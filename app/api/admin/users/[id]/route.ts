import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { User } from "@/models";
import { writeAudit } from "@/lib/audit";
import { errorResponse } from "@/lib/http";

const schema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(10).max(72).optional(),
  role: z.enum(["super_admin", "admin", "editor"]).optional(),
  isActive: z.boolean().optional(),
  mustChangePassword: z.boolean().optional(),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("users.write");
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  const raw = await req.json();
  if (id === auth.session.userId && (raw.isActive === false || (raw.role && raw.role !== auth.session.role))) {
    return NextResponse.json({ error: "You cannot disable or demote your own account" }, { status: 400 });
  }
  try {
    const data = schema.parse(raw);
    await connectDb();
    const updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
      delete updateData.password;
    }
    if (data.email) updateData.email = data.email.toLowerCase();
    const item = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await writeAudit(auth.session, "update", "users", id, { email: item.email, role: item.role });
    return NextResponse.json({ item });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("users.write");
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  if (id === auth.session.userId) return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  try {
    await connectDb();
    const item = await User.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await writeAudit(auth.session, "delete", "users", id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
