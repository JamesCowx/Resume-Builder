import { setPrintPayload, getPrintPayloadFromDb, sweepPrintPayloads } from "./db";

export type PrintPayload = {
  kind: "resume" | "cover";
  data: unknown;
  template: string;
  accent: string;
  font: string;
  name?: string;
};

const TTL = 10 * 60 * 1000;

export async function savePrintPayload(payload: PrintPayload): Promise<string> {
  const token = `${Date.now()}-${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
  await setPrintPayload(token, JSON.stringify(payload), Date.now() + TTL);
  sweepPrintPayloads().catch(() => {});
  return token;
}

export async function loadPrintPayload(token: string): Promise<PrintPayload | null> {
  if (!/^[0-9a-z-]+$/i.test(token)) return null;
  const raw = await getPrintPayloadFromDb(token);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PrintPayload;
  } catch {
    return null;
  }
}
