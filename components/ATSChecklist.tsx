"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { ResumeData } from "@/lib/types";
import { atsChecklist, atsScore } from "@/lib/atsChecklist";
import styles from "./jd.module.css";

type Props = {
  data: ResumeData;
};

export default function ATSChecklist({ data }: Props) {
  const [open, setOpen] = useState(false);
  const checks = useMemo(() => atsChecklist(data), [data]);
  const score = atsScore(checks);
  const passed = checks.filter((c) => c.pass).length;

  const scoreClass =
    score >= 90 ? styles.matchHigh : score >= 60 ? styles.matchMid : styles.matchLow;

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
        <p className={styles.title}>ATS Compliance</p>
        <span className={`${styles.matchBadge} ${scoreClass}`}>
          {passed}/{checks.length}
        </span>
        <span className={styles.hint}>{open ? "Hide" : "Check ATS readiness"}</span>
      </div>
      {open && (
        <div className={styles.body}>
          <ul className={styles.checkList}>
            {checks.map((c) => (
              <li key={c.id} className={styles.checkItem}>
                <span
                  className={`${styles.checkIcon} ${c.pass ? styles.checkPass : styles.checkFail}`}
                >
                  {c.pass ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <X size={13} strokeWidth={3} />
                  )}
                </span>
                <div>
                  <p className={styles.checkLabel}>{c.label}</p>
                  <p className={styles.checkDetail}>{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}