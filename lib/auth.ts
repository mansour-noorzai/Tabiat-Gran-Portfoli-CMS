import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDb } from "./db";
import type { Permission, Role } from "./permissions";
import { can } from "./permissions";
import { User } from "@/models";

const COOKIE_NAME = "tg_admin_session";
const MAX_AGE = 60 * 60 * 8;

export type Session = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  mustChangePassword: boolean;
  avatarUrl: string;
  avatarPublicId: string;
  preferredLanguage: "en" | "fa" | "ps";
  themeMode: "light" | "dark" | "system";
  themeColor: string;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
}

function normalizeLanguage(value: unknown): Session["preferredLanguage"] {
  return value === "fa" || value === "ps" ? value : "en";
}

function normalizeThemeMode(value: unknown): Session["themeMode"] {
  return value === "dark" || value === "system" ? value : "light";
}

function normalizeThemeColor(value: unknown) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#696cff";
}

export async function createSessionToken(session: Session) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      userId: String(payload.userId),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as Role,
      mustChangePassword: Boolean(payload.mustChangePassword),
      avatarUrl: typeof payload.avatarUrl === "string" ? payload.avatarUrl : "",
      avatarPublicId: typeof payload.avatarPublicId === "string" ? payload.avatarPublicId : "",
      preferredLanguage: normalizeLanguage(payload.preferredLanguage),
      themeMode: normalizeThemeMode(payload.themeMode),
      themeColor: normalizeThemeColor(payload.themeColor),
    };
  } catch {
    return null;
  }
}

export async function getActiveSession(): Promise<Session | null> {
  const tokenSession = await getSession();
  if (!tokenSession) return null;
  try {
    await connectDb();
    const user = await User.findById(tokenSession.userId)
      .select("name email role isActive mustChangePassword avatar preferences")
      .lean();
    if (!user || !user.isActive) return null;
    const avatar = (user as any).avatar || {};
    const preferences = (user as any).preferences || {};
    return {
      userId: String(user._id),
      name: String(user.name),
      email: String(user.email),
      role: user.role as Role,
      mustChangePassword: Boolean(user.mustChangePassword),
      avatarUrl: String(avatar.url || ""),
      avatarPublicId: String(avatar.publicId || ""),
      preferredLanguage: normalizeLanguage(preferences.language),
      themeMode: normalizeThemeMode(preferences.themeMode),
      themeColor: normalizeThemeColor(preferences.themeColor),
    };
  } catch {
    return null;
  }
}

export async function requirePermission(permission: Permission) {
  const session = await getActiveSession();
  if (!session) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.mustChangePassword) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Password change required", code: "PASSWORD_CHANGE_REQUIRED" }, { status: 403 }),
    };
  }
  if (!can(session.role, permission)) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, session };
}

export async function requirePagePermission(permission: Permission) {
  const session = await getActiveSession();
  return session && can(session.role, permission) ? session : null;
}
