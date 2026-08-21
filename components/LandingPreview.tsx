"use client";

import { useEffect, useState } from "react";
import { sampleResume } from "@/lib/types";
import { ResumeDocument, TEMPLATES } from "@/components/Templates";
import type { TemplateId } from "@/components/Templates";
import styles from "./landing.module.css";

const SHEET_W = 794;
const SCALE = 0.4;
const ROTATE_MS = 4500;

const TEMPLATE_ACCENTS: Record<TemplateId, string> = {
  modern: "#1d4ed8",
  classic: "#0f172a",
  minimal: "#475569",
  executive: "#1e3a8a",
  creative: "#be123c",
  compact: "#15803d",
  columns: "#7c3aed",
  timeline: "#0d9488",
  elegant: "#92400e",
};

export default function LandingPreview() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const t = TEMPLATES[index];

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TEMPLATES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className={styles.previewRoot}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={styles.previewCanvas}
        style={{ "--accent": TEMPLATE_ACCENTS[t.id] } as React.CSSProperties}
      >
        <div key={t.id} className={styles.previewSheet}>
          <div
            className={styles.previewSheetInner}
            style={{ transform: `scale(${SCALE})`, width: SHEET_W }}
          >
            <ResumeDocument data={sampleResume()} template={t.id} />
          </div>
        </div>
      </div>
      <div className={styles.previewChips} role="tablist" aria-label="Choose a template to preview">
        {TEMPLATES.map((tp, i) => (
          <button
            key={tp.id}
            role="tab"
            aria-selected={i === index}
            className={`${styles.previewChip} ${i === index ? styles.previewChipActive : ""}`}
            onClick={() => {
              setIndex(i);
              setPaused(true);
            }}
            aria-label={`Preview the ${tp.name} template`}
          >
            <span
              className={styles.previewChipDot}
              style={{ background: TEMPLATE_ACCENTS[tp.id] }}
            />
            {tp.name}
          </button>
        ))}
      </div>
    </div>
  );
}
