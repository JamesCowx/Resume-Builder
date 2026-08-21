"use client";

import { useState } from "react";
import {
  AI_PROVIDERS,
  type AISettings,
  type ProviderId,
} from "@/lib/ai";
import styles from "./modal.module.css";

type Props = {
  settings: AISettings;
  onSave: (s: AISettings) => void;
  onClose: () => void;
};

const PROVIDER_DOCS: Record<string, string> = {
  openai: "https://platform.openai.com/api-keys",
  anthropic: "https://console.anthropic.com/settings/keys",
  google: "https://aistudio.google.com/app/apikey",
  groq: "https://console.groq.com/keys",
  mistral: "https://console.mistral.ai/api-keys/",
  openrouter: "https://openrouter.ai/settings/keys",
};

export default function AISettingsModal({ settings, onSave, onClose }: Props) {
  const [provider, setProvider] = useState<ProviderId>(settings.provider);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [baseUrl, setBaseUrl] = useState(
    settings.baseUrl || AI_PROVIDERS.find((p) => p.id === settings.provider)?.baseUrl || ""
  );
  const [model, setModel] = useState(settings.model);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const config = AI_PROVIDERS.find((p) => p.id === provider)!;
  const needsBaseUrl = provider === "custom" || !baseUrl;

  const onProviderChange = (id: ProviderId) => {
    const next = AI_PROVIDERS.find((p) => p.id === id)!;
    setProvider(id);
    setBaseUrl(next.baseUrl);
    if (next.models.length) setModel(next.models[0]);
  };

  const testConnection = async () => {
    setTesting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          baseUrl,
          model,
          system: "Reply with exactly the single word: OK",
          user: "Ping",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.text) {
        setStatus({ ok: true, text: "Connected — the model responded." });
      } else {
        setStatus({ ok: false, text: json.error || "Connection failed." });
      }
    } catch {
      setStatus({ ok: false, text: "Network error while testing." });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>AI Writing Assistant</h2>
        <p className={styles.subtitle}>
          Connect any major AI provider to rewrite summaries, improve bullet
          points, and suggest skills. Your key is stored only in this browser.
        </p>

        <div className={styles.field}>
          <label className={styles.label}>Provider</label>
          <select
            className={styles.select}
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as ProviderId)}
          >
            {AI_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {needsBaseUrl && (
          <div className={styles.field}>
            <label className={styles.label}>API base URL</label>
            <input
              className={styles.input}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>API key</label>
          <div className={styles.keyRow}>
            <input
              className={styles.input}
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
            />
            <button
              className={`${styles.btn} ${styles.toggleBtn}`}
              onClick={() => setShowKey((s) => !s)}
              type="button"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Model</label>
          {config.models.length ? (
            <select
              className={styles.select}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {config.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={styles.input}
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. your-model-name"
            />
          )}
        </div>

        {status && (
          <div
            className={`${styles.status} ${status.ok ? styles.statusOk : styles.statusError}`}
            role="status"
          >
            {status.text}
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={testConnection}
            disabled={testing || !apiKey || !model}
          >
            {testing ? "Testing…" : "Test connection"}
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => onSave({ provider, apiKey, baseUrl, model })}
          >
            Save
          </button>
        </div>

        {PROVIDER_DOCS[provider] && (
          <p className={styles.keyHint}>
            Get a free API key:{" "}
            <span
              className={styles.link}
              onClick={() => window.open(PROVIDER_DOCS[provider], "_blank")}
            >
              {PROVIDER_DOCS[provider]}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
