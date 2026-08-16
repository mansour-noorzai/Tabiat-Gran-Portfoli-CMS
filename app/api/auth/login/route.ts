import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { User } from "@/models";

const input = z.object({ email: z.string().email(), password: z.string().min(8).max(72) });
const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const now = Date.now();
    const bucket = attempts.get(ip);
    if (bucket && bucket.reset > now && bucket.count >= 10) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }
    if (!bucket || bucket.reset <= now) attempts.set(ip, { count: 0, reset: now + 15 * 60_000 });

    const parsed = input.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    await connectDb();
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash");
    const valid = user && user.isActive && (await bcrypt.compare(parsed.data.password, user.passwordHash));
    if (!valid) {
      const current = attempts.get(ip)!;
      current.count += 1;
      attempts.set(ip, current);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    attempts.delete(ip);
    user.lastLoginAt = new Date();
    await user.save();
    const session = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: Boolean(user.mustChangePassword),
      avatarUrl: user.avatar?.url || "",
      avatarPublicId: user.avatar?.publicId || "",
      preferredLanguage: user.preferences?.language || "en",
      themeMode: user.preferences?.themeMode || "light",
      themeColor: user.preferences?.themeColor || "#696cff",
    };
    const token = await createSessionToken(session);
    const response = NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: Boolean(user.mustChangePassword),
      },
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
