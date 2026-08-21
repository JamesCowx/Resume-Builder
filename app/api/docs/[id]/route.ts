import { NextRequest, NextResponse } from "next/server";
import { deleteDoc, upsertDoc, userForSession } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = await userForSession(token);
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "Missing doc id." }, { status: 400 });
  await deleteDoc(user.id, id);
  return NextResponse.json({ ok: true });
}

type DocBody = {
  id: string;
  name: string;
  kind?: string;
  updatedAt?: number;
  [key: string]: unknown;
};

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = await userForSession(token);
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let body: DocBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body || typeof body.id !== "string" || typeof body.name !== "string") {
    return NextResponse.json({ error: "A doc id and name are required." }, { status: 400 });
  }
  const { id, name, kind, updatedAt, ...rest } = body;
  const payload = JSON.stringify({ ...rest, name, updatedAt: updatedAt ?? Date.now() });
  const ok = await upsertDoc(user.id, id, name, kind === "cover" ? "cover" : "resume", payload, updatedAt ?? Date.now());
  if (!ok) {
    return NextResponse.json({ error: "Document belongs to another user." }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
