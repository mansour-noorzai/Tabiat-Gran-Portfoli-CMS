import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { deleteAsset } from "@/lib/cloudinary";
import { Media, User } from "@/models";
import { writeAudit } from "@/lib/audit";
import { errorResponse } from "@/lib/http";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("media.write");
  if (!auth.ok) return auth.response;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    await connectDb();
    const item = await Media.findByIdAndUpdate(id, { alt: body.alt ?? {} }, { new: true });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await writeAudit(auth.session, "update", "media", id);
    return NextResponse.json({ item });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("media.write");
  if (!auth.ok) return auth.response;
  try {
    const { id } = await ctx.params;
    await connectDb();
    const item = await Media.findById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cloudinaryResult = await deleteAsset(item.publicId, item.resourceType || "image");
    // Prevent a deleted media asset from remaining as a broken CMS profile avatar.
    await User.updateMany({ "avatar.publicId": item.publicId }, { $set: { avatar: { url: "", publicId: "" } } });
    await item.deleteOne();
    await writeAudit(auth.session, "delete", "media", id, {
      publicId: item.publicId,
      cloudinary: cloudinaryResult.alreadyMissing ? "already_missing" : "deleted",
    });
    return NextResponse.json({ ok: true, cloudinary: cloudinaryResult.alreadyMissing ? "already_missing" : "deleted" });
  } catch (error) {
    console.error("Media deletion failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete media" }, { status: 500 });
  }
}
