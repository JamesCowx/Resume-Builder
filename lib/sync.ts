export type AuthUser = { id: string; email: string };

export async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  const json = await res.json().catch(() => ({ user: null }));
  return json.user ?? null;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Login failed.");
  return json.user;
}

export async function register(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Registration failed.");
  return json.user;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export type CloudDoc = {
  id: string;
  name: string;
  kind: string;
  updatedAt: number;
  [key: string]: unknown;
};

export async function fetchCloudDocs(): Promise<CloudDoc[]> {
  const res = await fetch("/api/docs", { cache: "no-store" });
  const json = await res.json().catch(() => ({ docs: [] }));
  return Array.isArray(json.docs) ? json.docs : [];
}

export async function pushCloudDoc(doc: { id: string } & Record<string, unknown>): Promise<void> {
  const res = await fetch(`/api/docs/${doc.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Failed to sync to cloud.");
  }
}

export async function deleteCloudDoc(id: string): Promise<void> {
  await fetch(`/api/docs/${id}`, { method: "DELETE" });
}