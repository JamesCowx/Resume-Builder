"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Sparkles } from "lucide-react";
import type { ResumeData } from "@/lib/types";
import { analyzeJD, type JDAnalysis } from "@/lib/jd";
import styles from "./jd.module.css";

const cleanName = (token: string) =>
  token.replace(/^./, (c) => c.toUpperCase());

type Props = {
  data: ResumeData;
  jd: string;
  onJdChange: (value: string) => void;
  aiConfigured: boolean;
  aiBusy: boolean;
  onAddSkills: (skills: string[]) => void;
  onTailor: (jdText: string) => void;
};

export default function JDAnalyzer({
  data,
  jd,
  onJdChange,
  aiConfigured,
  aiBusy,
  onAddSkills,
  onTailor,
}: Props) {
  const [open, setOpen] = useState(false);

  const analysis: JDAnalysis | null = useMemo(
    () => (jd.trim() ? analyzeJD(jd, data) : null),
    [jd, data]
  );

  const scoreClass =
    analysis && analysis.matchScore >= 70
      ? styles.matchHigh
      : analysis && analysis.matchScore >= 40
        ? styles.matchMid
        : styles.matchLow;

  const addAll = () => {
    if (!analysis) return;
    const existing = new Set(
      data.skills.map((s) => s.toLowerCase().trim())
    );
    const toAdd = analysis.missingSkills
      .map(cleanName)
      .filter((s) => !existing.has(s.toLowerCase()));
    if (toAdd.length) onAddSkills(toAdd);
  };

  return (
    <section className={styles.panel}>
      <div
        className={styles.header}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
      >
        <p className={styles.title}>Job Description Match</p>
        {analysis && (
          <span className={`${styles.matchBadge} ${scoreClass}`}>
            {analysis.matchScore}%
          </span>
        )}
        <span className={styles.hint}>
          {open ? "Hide" : "Paste a job ad to check fit"}
        </span>
      </div>
      {open && (
        <div className={styles.body}>
          <textarea
            className={styles.textarea}
            value={jd}
            onChange={(e) => onJdChange(e.target.value)}
            placeholder={"Paste a job description here to see how well your resume matches it…"}
          />
          {analysis ? (
            <>
              <p className={styles.resultTitle}>Covered skills</p>
              {analysis.coveredSkills.length ? (
                <div className={styles.chipRow}>
                  {analysis.coveredSkills.map((s) => (
                    <span key={s} className={`${styles.chip} ${styles.chipCovered}`}>
                      <Check size={12} strokeWidth={3} />
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={styles.empty}>
                  None of your listed skills appear in the job description.
                </p>
              )}

              <p className={styles.resultTitle}>
                Missing keywords — add these to pass ATS filters
              </p>
              {analysis.missingSkills.length ? (
                <>
                  <div className={styles.chipRow}>
                    {analysis.missingSkills.map((s) => (
                      <span
                        key={s}
                        className={`${styles.chip} ${styles.chipMissing}`}
                        title="Click to add"
                        onClick={() => onAddSkills([cleanName(s)])}
                      >
                        <Plus size={12} strokeWidth={3} />
                        {cleanName(s)}
                      </span>
                    ))}
                  </div>
                  <button className={styles.addBtn} onClick={addAll}>
                    Add all to skills
                  </button>
                </>
              ) : (
                <p className={styles.empty}>
                  All detected keywords are already on your resume.
                </p>
              )}

              {aiConfigured && (
                <button
                  className={styles.aiBtn}
                  disabled={aiBusy}
                  onClick={() => onTailor(jd)}
                >
                  {aiBusy ? (
                    "Rewriting…"
                  ) : (
                    <>
                      <Sparkles size={14} strokeWidth={2.4} />
                      Rewrite my summary for this job
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <p className={styles.empty}>
              The match score updates live as you paste.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
