import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  const timestamp = new Date().toISOString();
  const authConfigured = Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32);
  const databaseConfigured = Boolean(process.env.MONGODB_URI);

  try {
    if (!authConfigured) throw new Error("AUTH_SECRET is not configured correctly");
    await connectDb();

    return NextResponse.json(
      {
        status: "ok",
        service: "tabiat-gran-cms",
        timestamp,
        checks: {
          database: "ok",
          authentication: "ok",
        },
      },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    console.error(
      "[health] readiness check failed",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json(
      {
        status: "unhealthy",
        service: "tabiat-gran-cms",
        timestamp,
        checks: {
          database: databaseConfigured ? "error" : "missing",
          authentication: authConfigured ? "ok" : "missing",
        },
      },
      { status: 503, headers: noStoreHeaders },
    );
  }
}
