import { NextResponse } from "next/server";
import { AI_PROVIDERS } from "@/lib/ai";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

type ReqBody = {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
  system: string;
  user: string;
};

export async function POST(req: Request) {
  if (!rateLimit(`ai:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a moment." },
      { status: 429 }
    );
  }

  let body: ReqBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { provider, apiKey, baseUrl, model, system, user } = body;
  if (!provider || !apiKey || !model) {
    return NextResponse.json(
      { error: "Missing provider, API key, or model." },
      { status: 400 }
    );
  }

  const providerConfig = AI_PROVIDERS.find((p) => p.id === provider);
  if (!providerConfig) {
    return NextResponse.json({ error: "Unsupported provider." }, { status: 400 });
  }

  if (baseUrl) {
    let parsed: URL;
    try {
      parsed = new URL(baseUrl);
    } catch {
      return NextResponse.json({ error: "Invalid base URL." }, { status: 400 });
    }
    const local =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (parsed.protocol !== "https:" && !(local && parsed.protocol === "http:")) {
      return NextResponse.json(
        { error: "Base URL must use HTTPS." },
        { status: 400 }
      );
    }
  }

  try {
    let text: string;

    if (providerConfig.api === "anthropic") {
      const base = baseUrl || providerConfig.baseUrl;
      const res = await fetch(`${base}/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 800,
          temperature: 0.7,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          json?.error?.message || json?.message || `Request failed (${res.status})`;
        return NextResponse.json({ error: msg }, { status: res.status });
      }
      text = json?.content?.[0]?.text ?? "";
    } else if (providerConfig.api === "google") {
      const base = baseUrl || providerConfig.baseUrl;
      const url = `${base}/models/${encodeURIComponent(model)}:generateContent`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          json?.error?.message || `Request failed (${res.status})`;
        return NextResponse.json({ error: msg }, { status: res.status });
      }
      text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } else {
      const base = baseUrl || providerConfig.baseUrl;
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: 800,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          json?.error?.message || json?.message || `Request failed (${res.status})`;
        return NextResponse.json({ error: msg }, { status: res.status });
      }
      text = json?.choices?.[0]?.message?.content ?? "";
    }

    if (!text) {
      return NextResponse.json(
        { error: "The model returned an empty response." },
        { status: 502 }
      );
    }
    return NextResponse.json({ text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error contacting the AI provider.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
