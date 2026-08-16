import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { User } from "@/models";
import { writeAudit } from "@/lib/audit";
import { errorResponse } from "@/lib/http";

const password = z.string().min(10).max(72);
const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password,
  role: z.enum(["super_admin", "admin", "editor"]),
  isActive: z.boolean().default(true),
  mustChangePassword: z.boolean().default(true),
});

function publicUser(user: any) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    mustChangePassword: user.mustChangePassword,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function GET() {
  const auth = await requirePermission("users.read");
  if (!auth.ok) return auth.response;
  await connectDb();
  const items = await User.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: items.map(publicUser) });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("users.write");
  if (!auth.ok) return auth.response;
  try {
    const data = schema.parse(await req.json());
    await connectDb();
    const passwordHash = await bcrypt.hash(data.password, 12);
    const item = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      isActive: data.isActive,
      mustChangePassword: data.mustChangePassword,
    });
    await writeAudit(auth.session, "create", "users", String(item._id), { email: item.email, role: item.role });
    return NextResponse.json({ item: publicUser(item) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
