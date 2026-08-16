import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export function errorResponse(error: unknown, fallback = "Request failed") {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }
  const message = error instanceof Error ? error.message : "";
  if (/E11000/.test(message)) {
    return NextResponse.json({ error: "A record with this unique value already exists" }, { status: 409 });
  }
  if (/Cast to ObjectId failed|ValidationError/.test(message)) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
  console.error(error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

/**
 * CORS is unnecessary for the normal unified deployment because the public site
 * and API share one origin. PUBLIC_WEB_ORIGIN remains optional for an external
 * client that intentionally calls the public API from another origin.
 */
export function publicCors(response: NextResponse) {
  const origin = process.env.PUBLIC_WEB_ORIGIN?.replace(/\/$/, "");
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }
  return response;
}

export function verifyPublicOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  const configured = process.env.PUBLIC_WEB_ORIGIN?.replace(/\/$/, "");
  if (configured && origin === configured) return true;

  // Normal single-project case: only allow requests from the current host.
  try {
    const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const requestHost = forwardedHost || req.headers.get("host") || req.nextUrl.host;
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}
