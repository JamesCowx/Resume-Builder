import { NextRequest, NextResponse } from "next/server";
import { listDocs, userForSession } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = await userForSession(token);
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const rows = await listDocs(user.id);
  const docs = rows.map((r) => {
    try {
      return { ...JSON.parse(r.payload), id: r.id, kind: r.kind };
    } catch {
      return null;
    }
  }).filter(Boolean);
  return NextResponse.json({ docs });
}
