import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL || "MISSING";
  const token = process.env.TURSO_AUTH_TOKEN || "MISSING";
  return NextResponse.json({
    url: url ? `${url.substring(0, 30)}...` : "MISSING",
    tokenLength: token === "MISSING" ? 0 : token.length,
    tokenStart: token === "MISSING" ? "N/A" : token.substring(0, 20),
    nodeEnv: process.env.NODE_ENV,
  });
}
