import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { getActiveSession } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { errorResponse } from "@/lib/http";
import { User } from "@/models";

const schema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  avatar: z.object({
    url: z.string().trim().max(2048).refine((value: string) => !value || /^https:\/\//i.test(value), "Profile image must use an HTTPS URL").optional().default(""),
    publicId: z.string().trim().max(300).optional().default(""),
  }).optional(),
  preferences: z.object({
    language: z.enum(["en", "fa", "ps"]).optional(),
    themeMode: z.enum(["light", "dark", "system"]).optional(),
    themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  }).optional(),
});

export async function PUT(req: NextRequest) {
  const session = await getActiveSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.mustChangePassword) return NextResponse.json({ error: "Password change required" }, { status: 403 });
  try {
    const data = schema.parse(await req.json());
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.avatar !== undefined) update.avatar = data.avatar;
    if (data.preferences?.language !== undefined) update["preferences.language"] = data.preferences.language;
    if (data.preferences?.themeMode !== undefined) update["preferences.themeMode"] = data.preferences.themeMode;
    if (data.preferences?.themeColor !== undefined) update["preferences.themeColor"] = data.preferences.themeColor;

    await connectDb();
    const user = await User.findByIdAndUpdate(session.userId, { $set: update }, { new: true, runValidators: true });
    if (!user || !user.isActive) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    await writeAudit({ ...session, name: user.name }, "update", "profile", session.userId, { fields: Object.keys(update) });
    return NextResponse.json({
      item: {
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || { url: "", publicId: "" },
        preferences: {
          language: user.preferences?.language || "en",
          themeMode: user.preferences?.themeMode || "light",
          themeColor: user.preferences?.themeColor || "#696cff",
        },
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
