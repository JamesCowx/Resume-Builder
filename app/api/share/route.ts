import { NextRequest, NextResponse } from "next/server";
import { createShare } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PAYLOAD_BYTES = 512 * 1024;

type ShareBody = {
  kind?: "resume" | "cover";
  data: unknown;
  template?: string;
  accent?: string;
  font?: string;
  name?: string;
};

export async function POST(req: NextRequest) {
  if (!rateLimit(`share:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "Too many shares created. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: ShareBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body.data !== "object" || body.data === null) {
    return NextResponse.json({ error: "Missing resume data." }, { status: 400 });
  }
  if (req.headers.get("content-length") && Number(req.headers.get("content-length")) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Resume is too large to share." }, { status: 413 });
  }

  const payload = JSON.stringify({
    kind: body.kind === "cover" ? "cover" : "resume",
    data: body.data,
    template: typeof body.template === "string" ? body.template : "modern",
    accent: typeof body.accent === "string" && body.accent ? body.accent : "#1d4ed8",
    font: typeof body.font === "string" ? body.font : "",
    name: typeof body.name === "string" ? body.name.slice(0, 120) : "",
  });

  if (Buffer.byteLength(payload, "utf8") > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Resume is too large to share." }, { status: 413 });
  }

  try {
    const id = await createShare(
      body.kind === "cover" ? "cover" : "resume",
      typeof body.name === "string" ? body.name.slice(0, 120) : "",
      payload
    );
    return NextResponse.json({ id, url: `/s/${id}` });
  } catch {
    return NextResponse.json({ error: "Could not create share link." }, { status: 500 });
  }
}
