import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/auth";

export async function GET() {
  const session = await getActiveSession();
  return session ? NextResponse.json({ user: session }) : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
