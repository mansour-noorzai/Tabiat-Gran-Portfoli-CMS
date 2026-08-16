import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, getActiveSession, setSessionCookie } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { User } from "@/models";

const input = z.object({
  currentPassword: z.string().min(8).max(72),
  newPassword: z.string().min(10).max(72),
});

export async function POST(req: NextRequest) {
  const session = await getActiveSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = input.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Use a new password of 10–72 characters." }, { status: 400 });

  await connectDb();
  const user = await User.findById(session.userId).select("+passwordHash");
  if (!user || !user.isActive) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const currentValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!currentValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  if (await bcrypt.compare(parsed.data.newPassword, user.passwordHash)) {
    return NextResponse.json({ error: "New password must be different from the current password" }, { status: 400 });
  }

  user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  user.mustChangePassword = false;
  await user.save();
  await writeAudit(session, "change_password", "users", String(user._id));

  const refreshed = {
    userId: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: false,
    avatarUrl: user.avatar?.url || "",
    avatarPublicId: user.avatar?.publicId || "",
    preferredLanguage: user.preferences?.language || "en",
    themeMode: user.preferences?.themeMode || "light",
    themeColor: user.preferences?.themeColor || "#696cff",
  };
  const token = await createSessionToken(refreshed);
  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, token);
  return response;
}
