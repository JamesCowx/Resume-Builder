import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const TURSO_URL = () => {
  const url = process.env.TURSO_DATABASE_URL || "";
  return url.replace(/^libsql:\/\//, "https://");
};
const TURSO_TOKEN = () => process.env.TURSO_AUTH_TOKEN || "";

async function tursoExecute(sql: string, args: unknown[] = []) {
  const token = TURSO_TOKEN();
  const url = `${TURSO_URL()}/v2/pipeline`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      requests: [
        {
          type: "execute",
          stmt: {
            sql,
            args: args.map((a) =>
              typeof a === "number"
                ? { type: "integer", value: String(a) }
                : { type: "text", value: String(a ?? "") }
            ),
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Turso HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();
  const result = json.results?.[0];
  if (result?.error) {
    throw new Error(`Turso error: ${result.error.message}`);
  }
  return result?.response?.result?.rows || [];
}

async function tursoBatch(statements: string[]) {
  const token = TURSO_TOKEN();
  const url = `${TURSO_URL()}/v2/pipeline`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      requests: statements.map((sql) => ({
        type: "execute",
        stmt: { sql },
      })),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Turso HTTP ${res.status}: ${text}`);
  }
}

let initialized = false;

export async function ensureTables() {
  if (initialized) return;
  try {
    await tursoBatch([
      "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, pass_hash TEXT NOT NULL, created_at INTEGER NOT NULL)",
      "CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at INTEGER NOT NULL)",
      "CREATE TABLE IF NOT EXISTS docs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'resume', payload TEXT NOT NULL, updated_at INTEGER NOT NULL)",
      "CREATE TABLE IF NOT EXISTS shares (id TEXT PRIMARY KEY, kind TEXT NOT NULL, name TEXT NOT NULL DEFAULT '', payload TEXT NOT NULL, created_at INTEGER NOT NULL)",
      "CREATE TABLE IF NOT EXISTS print_payloads (token TEXT PRIMARY KEY, payload TEXT NOT NULL, expires INTEGER NOT NULL)",
    ]);
    initialized = true;
  } catch (e) {
    console.error("ensureTables failed:", e);
  }
}

export async function initDb() {
  await ensureTables();
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
  await ensureTables();
  const id = randomBytes(16).toString("hex");
  await tursoExecute(
    "INSERT INTO users (id, email, pass_hash, created_at) VALUES (?, ?, ?, ?)",
    [id, email.toLowerCase(), hashPassword(password), Date.now()]
  );
  return id;
}

export async function findUserByEmail(email: string) {
  await ensureTables();
  const rows = await tursoExecute(
    "SELECT id, email, pass_hash FROM users WHERE email = ?",
    [email.toLowerCase()]
  );
  return (rows[0] as unknown as { id: string; email: string; pass_hash: string } | undefined);
}

export async function checkLogin(email: string, password: string) {
  const user = await findUserByEmail(email);
  const ok = verifyPassword(password, user?.pass_hash ?? DUMMY_HASH);
  if (!user || !ok) return null;
  return { id: user.id, email: user.email };
}

export async function createSession(userId: string) {
  await ensureTables();
  const token = randomBytes(32).toString("hex");
  await tursoExecute(
    "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
    [token, userId, Date.now()]
  );
  return token;
}

export async function destroySession(token: string) {
  await ensureTables();
  await tursoExecute("DELETE FROM sessions WHERE token = ?", [token]);
}

export async function userForSession(token: string | undefined) {
  if (!token) return null;
  await ensureTables();
  const cutoff = Date.now() - SESSION_MAX_AGE * 1000;
  const rows = await tursoExecute(
    "SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.created_at > ?",
    [token, cutoff]
  );
  return (rows[0] as unknown as { id: string; email: string } | null) ?? null;
}

export type StoredDocRow = {
  id: string;
  name: string;
  kind: string;
  payload: string;
  updated_at: number;
};

export async function listDocs(userId: string): Promise<StoredDocRow[]> {
  await ensureTables();
  const rows = await tursoExecute(
    "SELECT id, name, kind, payload, updated_at FROM docs WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  );
  return rows as unknown as StoredDocRow[];
}

export async function upsertDoc(
  userId: string,
  docId: string,
  name: string,
  kind: string,
  payload: string,
  updatedAt: number
): Promise<boolean> {
  await ensureTables();
  const existing = await tursoExecute(
    "SELECT user_id FROM docs WHERE id = ?",
    [docId]
  );
  if (existing[0] && (existing[0] as unknown as { user_id: string }).user_id !== userId) return false;
  await tursoExecute(
    `INSERT INTO docs (id, user_id, name, kind, payload, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, kind = excluded.kind,
       payload = excluded.payload, updated_at = excluded.updated_at`,
    [docId, userId, name, kind, payload, updatedAt]
  );
  return true;
}

export async function deleteDoc(userId: string, docId: string) {
  await ensureTables();
  await tursoExecute("DELETE FROM docs WHERE user_id = ? AND id = ?", [userId, docId]);
}

export async function createShare(kind: string, name: string, payload: string) {
  await ensureTables();
  const id = randomBytes(16).toString("hex");
  await tursoExecute(
    "INSERT INTO shares (id, kind, name, payload, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, kind, name, payload, Date.now()]
  );
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
  await ensureTables();
  const rows = await tursoExecute(
    "SELECT id, kind, name, payload, created_at FROM shares WHERE id = ?",
    [id]
  );
  return (rows[0] as unknown as ShareRow) ?? null;
}

export async function setPrintPayload(token: string, payload: string, expires: number) {
  await ensureTables();
  await tursoExecute(
    "INSERT INTO print_payloads (token, payload, expires) VALUES (?, ?, ?)",
    [token, payload, expires]
  );
}

export async function getPrintPayloadFromDb(token: string): Promise<string | null> {
  await ensureTables();
  const rows = await tursoExecute(
    "SELECT payload, expires FROM print_payloads WHERE token = ?",
    [token]
  );
  const row = rows[0] as unknown as { payload: string; expires: number } | undefined;
  if (!row) return null;
  if (row.expires < Date.now()) {
    await tursoExecute("DELETE FROM print_payloads WHERE token = ?", [token]);
    return null;
  }
  return row.payload;
}

export async function sweepPrintPayloads() {
  await ensureTables();
  await tursoExecute("DELETE FROM print_payloads WHERE expires < ?", [Date.now()]);
}
