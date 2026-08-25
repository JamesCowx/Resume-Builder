import { NextRequest, NextResponse } from "next/server";
import { createShare } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_PAYLOAD_BYTES = 512 * 1024;

type PdfBody = {
  kind?: "resume" | "cover";
  data: unknown;
  template: string;
  accent?: string;
  font?: string;
  name?: string;
};

export async function POST(req: NextRequest) {
  if (!rateLimit(`pdf:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: PdfBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || !body.data || typeof body.template !== "string") {
    return NextResponse.json({ error: "Missing resume data or template." }, { status: 400 });
  }

  const payload = JSON.stringify({
    kind: body.kind === "cover" ? "cover" : "resume",
    data: body.data,
    template: body.template,
    accent: body.accent || "#1d4ed8",
    font: body.font || "",
    name: body.name || "",
  });

  if (Buffer.byteLength(payload, "utf8") > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Resume is too large." }, { status: 413 });
  }

  try {
    const id = await createShare(
      body.kind === "cover" ? "cover" : "resume",
      (body.name || "").slice(0, 120),
      payload
    );
    return NextResponse.json({ id, url: `/s/${id}` });
  } catch (e) {
    console.error("PDF share creation failed:", e);
    console.error("TURSO_DATABASE_URL:", process.env.TURSO_DATABASE_URL ? "SET" : "MISSING");
    console.error("TURSO_AUTH_TOKEN:", process.env.TURSO_AUTH_TOKEN ? "SET" : "MISSING");
    const msg = e instanceof Error ? e.message : "Could not create share link.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
