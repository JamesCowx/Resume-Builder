import { createClient, type Client } from "@libsql/client";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function initDb() {
  const db = getClient();
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      pass_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS docs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'resume',
      payload TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS shares (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS print_payloads (
      token TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      expires INTEGER NOT NULL
    );
  `);
}

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, expected);
}

const DUMMY_HASH = hashPassword("not-a-real-account");

export async function createUser(email: string, password: string) {
  const id = randomBytes(16).toString("hex");
  await getClient().execute({
    sql: "INSERT INTO users (id, email, pass_hash, created_at) VALUES (?, ?, ?, ?)",
    args: [id, email.toLowerCase(), hashPassword(password), Date.now()],
  });
  return id;
}

export async function findUserByEmail(email: string) {
  const result = await getClient().execute({
    sql: "SELECT id, email, pass_hash FROM users WHERE email = ?",
    args: [email.toLowerCase()],
  });
  return result.rows[0] as unknown as { id: string; email: string; pass_hash: string } | undefined;
}

export async function checkLogin(email: string, password: string) {
  const user = await findUserByEmail(email);
  const ok = verifyPassword(password, user?.pass_hash ?? DUMMY_HASH);
  if (!user || !ok) return null;
  return { id: user.id, email: user.email };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  await getClient().execute({
    sql: "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
    args: [token, userId, Date.now()],
  });
  return token;
}

export async function destroySession(token: string) {
  await getClient().execute({ sql: "DELETE FROM sessions WHERE token = ?", args: [token] });
}

export async function userForSession(token: string | undefined) {
  if (!token) return null;
  const cutoff = Date.now() - SESSION_MAX_AGE * 1000;
  const result = await getClient().execute({
    sql: "SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.created_at > ?",
    args: [token, cutoff],
  });
  return (result.rows[0] as unknown as { id: string; email: string } | null) ?? null;
}

export type StoredDocRow = {
  id: string;
  name: string;
  kind: string;
  payload: string;
  updated_at: number;
};

export async function listDocs(userId: string): Promise<StoredDocRow[]> {
  const result = await getClient().execute({
    sql: "SELECT id, name, kind, payload, updated_at FROM docs WHERE user_id = ? ORDER BY updated_at DESC",
    args: [userId],
  });
  return result.rows as unknown as StoredDocRow[];
}

export async function upsertDoc(
  userId: string,
  docId: string,
  name: string,
  kind: string,
  payload: string,
  updatedAt: number
): Promise<boolean> {
  const existing = await getClient().execute({
    sql: "SELECT user_id FROM docs WHERE id = ?",
    args: [docId],
  });
  if (existing.rows[0] && (existing.rows[0] as unknown as { user_id: string }).user_id !== userId) return false;
  await getClient().execute({
    sql: `INSERT INTO docs (id, user_id, name, kind, payload, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET name = excluded.name, kind = excluded.kind,
            payload = excluded.payload, updated_at = excluded.updated_at`,
    args: [docId, userId, name, kind, payload, updatedAt],
  });
  return true;
}

export async function deleteDoc(userId: string, docId: string) {
  await getClient().execute({
    sql: "DELETE FROM docs WHERE user_id = ? AND id = ?",
    args: [userId, docId],
  });
}

export async function createShare(kind: string, name: string, payload: string) {
  const id = randomBytes(16).toString("hex");
  await getClient().execute({
    sql: "INSERT INTO shares (id, kind, name, payload, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [id, kind, name, payload, Date.now()],
  });
  return id;
}

export type ShareRow = {
  id: string;
  kind: string;
  name: string;
  payload: string;
  created_at: number;
};

export async function getShare(id: string): Promise<ShareRow | null> {
  if (!/^[0-9a-f]{32}$/i.test(id)) return null;
  const result = await getClient().execute({
    sql: "SELECT id, kind, name, payload, created_at FROM shares WHERE id = ?",
    args: [id],
  });
  return (result.rows[0] as unknown as ShareRow) ?? null;
}

export async function setPrintPayload(token: string, payload: string, expires: number) {
  await getClient().execute({
    sql: "INSERT INTO print_payloads (token, payload, expires) VALUES (?, ?, ?)",
    args: [token, payload, expires],
  });
}

export async function getPrintPayloadFromDb(token: string): Promise<string | null> {
  const result = await getClient().execute({
    sql: "SELECT payload, expires FROM print_payloads WHERE token = ?",
    args: [token],
  });
  const row = result.rows[0] as unknown as { payload: string; expires: number } | undefined;
  if (!row) return null;
  if (row.expires < Date.now()) {
    await getClient().execute({ sql: "DELETE FROM print_payloads WHERE token = ?", args: [token] });
    return null;
  }
  return row.payload;
}

export async function sweepPrintPayloads() {
  await getClient().execute({
    sql: "DELETE FROM print_payloads WHERE expires < ?",
    args: [Date.now()],
  });
}
