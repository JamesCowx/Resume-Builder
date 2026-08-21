import { NextRequest, NextResponse } from "next/server";
import { savePrintPayload } from "@/lib/printStore";
import { urlToPdf } from "@/lib/pdf";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const RESUME_IDS = new Set([
  "modern",
  "classic",
  "minimal",
  "executive",
  "creative",
  "compact",
  "columns",
  "timeline",
  "elegant",
]);
const COVER_IDS = new Set(["cover-classic", "cover-clean"]);

type PdfBody = {
  kind?: "resume" | "cover";
  data: unknown;
  template: string;
  accent?: string;
  font?: string;
  name?: string;
};

export async function POST(req: NextRequest) {
  if (!rateLimit(`pdf:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "Too many PDF requests — please wait a moment." },
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

  const reqUrl = new URL(req.url);
  const originHeader = req.headers.get("origin");
  let origin: URL;
  if (originHeader) {
    try {
      origin = new URL(originHeader);
    } catch {
      return NextResponse.json({ error: "Invalid origin." }, { status: 400 });
    }
    if (origin.hostname !== reqUrl.hostname) origin = reqUrl;
  } else {
    origin = reqUrl;
  }

  const isCover = body.kind === "cover";
  const template = isCover
    ? typeof body.template === "string" && COVER_IDS.has(body.template)
      ? body.template
      : "cover-classic"
    : typeof body.template === "string" && RESUME_IDS.has(body.template)
      ? body.template
      : "modern";
  const accent = /^#[0-9a-fA-F]{6}$/.test(body.accent ?? "")
    ? body.accent!
    : "#1d4ed8";
  const font = /^var\(--font-[a-z0-9]+\)$/.test(body.font ?? "")
    ? body.font!
    : "";

  const token = await savePrintPayload({
    kind: isCover ? "cover" : "resume",
    data: body.data,
    template,
    accent,
    font,
    name: body.name,
  });

  try {
    const pdf = await urlToPdf(`${origin.origin}/print?token=${token}`);
    const fileName =
      (body.name || "resume").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "resume";
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "PDF generation failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
