import { NextRequest, NextResponse } from "next/server";
import { getShare } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  
  try {
    const share = await getShare(id);
    if (!share) return NextResponse.json({ found: false });
    return NextResponse.json({
      found: true,
      id: share.id,
      kind: share.kind,
      name: share.name,
      payloadType: typeof share.payload,
      payloadLength: typeof share.payload === "string" ? share.payload.length : "N/A",
      payloadStart: typeof share.payload === "string" ? share.payload.substring(0, 100) : String(share.payload).substring(0, 100),
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}
