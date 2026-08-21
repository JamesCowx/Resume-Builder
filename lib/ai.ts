export type ProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "groq"
  | "mistral"
  | "openrouter"
  | "custom";

export type AISettings = {
  provider: ProviderId;
  apiKey: string;
  baseUrl: string;
  model: string;
};

export type AIAction = "summary" | "headline" | "bullets" | "skills";

export type AIProvider = {
  id: ProviderId;
  name: string;
  baseUrl: string;
  models: string[];
  api: "openai" | "anthropic" | "google";
};

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini"],
    api: "openai",
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    baseUrl: "https://api.anthropic.com/v1",
    models: ["claude-3-5-haiku-latest", "claude-sonnet-4-20250514"],
    api: "anthropic",
  },
  {
    id: "google",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: ["gemini-2.0-flash", "gemini-1.5-flash"],
    api: "google",
  },
  {
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    api: "openai",
  },
  {
    id: "mistral",
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    models: ["mistral-small-latest", "open-mistral-nemo"],
    api: "openai",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    models: [
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-haiku",
      "meta-llama/llama-3.3-70b-instruct",
    ],
    api: "openai",
  },
  {
    id: "custom",
    name: "Custom (OpenAI-compatible)",
    baseUrl: "",
    models: [],
    api: "openai",
  },
];

export const DEFAULT_AI: AISettings = {
  provider: "openai",
  apiKey: "",
  baseUrl: "",
  model: "gpt-4o-mini",
};

export const loadAISettings = (): AISettings => {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem("resume-builder:ai");
      if (saved) return { ...DEFAULT_AI, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
  }
  return DEFAULT_AI;
};

export const saveAISettings = (s: AISettings) => {
  try {
    window.localStorage.setItem("resume-builder:ai", JSON.stringify(s));
  } catch {
    // ignore
  }
};

type AssistContext = {
  text: string;
  jobDescription?: string;
};

function buildPrompt(
  action: AIAction,
  ctx: AssistContext
): { system: string; user: string } {
  const baseSystem =
    "You are an expert resume writer who helps job seekers get hired. Return only the requested output with no commentary, no markdown headers, and no preamble.";
  const jdSection = ctx.jobDescription?.trim()
    ? `\n\nTarget job description:\n"""\n${ctx.jobDescription.trim()}\n"""`
    : "";

  switch (action) {
    case "summary":
      return {
        system: baseSystem,
        user:
          `Rewrite this professional summary to be compelling, specific, and quantified. ` +
          `Keep it 2–4 sentences, written in the implied first person (no "I" or "my"). ` +
          `Lead with the strongest, most relevant achievement or expertise.${jdSection}` +
          `\n\nCurrent summary:\n"""\n${ctx.text}\n"""`,
      };
    case "headline":
      return {
        system: baseSystem,
        user:
          `Suggest a short, punchy professional headline (title line) for a resume, ` +
          `around 4–8 words, using strong keywords.${jdSection}` +
          `\n\nCurrent headline: "${ctx.text}"`,
      };
    case "bullets":
      return {
        system:
          baseSystem +
          " Output must be plain bullet points, one per line, with no bullets markers, numbering, or markdown.",
        user:
          `Rewrite these resume bullet points so each starts with a strong action verb and ` +
          `includes a measurable outcome or metric where believable. Keep 3–6 bullets.` +
          ` Make them concise (one line each where possible).${jdSection}` +
          `\n\nCurrent bullets (one per line):\n"""\n${ctx.text}\n"""`,
      };
    case "skills":
      return {
        system:
          baseSystem +
          " Output must be a single comma-separated list, no bullets, no numbering.",
        user:
          `Based on the resume and target job, produce an optimized list of 8–14 skills ` +
          `that mix the candidate's strengths with keywords from the job description.` +
          ` Include relevant tools, languages, and soft skills only if defensible.${jdSection}` +
          `\n\nCurrent skills: ${ctx.text || "(none)"}`,
      };
  }
}

export async function runAI(
  settings: AISettings,
  action: AIAction,
  ctx: AssistContext
): Promise<string> {
  if (!settings.apiKey) throw new Error("NO_KEY");
  const { system, user } = buildPrompt(action, ctx);
  const res = await fetch("/api/ai/assist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: settings.provider,
      apiKey: settings.apiKey,
      baseUrl: settings.baseUrl,
      model: settings.model,
      system,
      user,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return String(json.text ?? "").trim();
}
