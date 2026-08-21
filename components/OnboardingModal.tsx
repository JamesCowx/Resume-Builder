"use client";

import { FilePlus2, FolderInput, Sparkles, X } from "lucide-react";
import styles from "./onboarding.module.css";

export type OnboardingChoice = "blank" | "sample" | "import";

type Props = {
  onChoose: (choice: OnboardingChoice) => void;
  onClose: () => void;
};

export default function OnboardingModal({ onChoose, onClose }: Props) {
  const options: {
    id: OnboardingChoice;
    icon: typeof FilePlus2;
    title: string;
    body: string;
    accent: "primary" | "purple" | "neutral";
  }[] = [
    {
      id: "sample",
      icon: Sparkles,
      title: "Start with a sample",
      body: "See a filled-in example you can edit piece by piece.",
      accent: "primary",
    },
    {
      id: "blank",
      icon: FilePlus2,
      title: "Start from scratch",
      body: "A clean, empty resume ready for your details.",
      accent: "neutral",
    },
    {
      id: "import",
      icon: FolderInput,
      title: "Import a backup",
      body: "Restore resumes from a previous JSON backup.",
      accent: "purple",
    },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} aria-label="Dismiss">
          <X size={16} strokeWidth={2.4} />
        </button>

        <span className={styles.logo}>R</span>
        <h2 className={styles.title}>Welcome to ResumeBuilder</h2>
        <p className={styles.subtitle}>
          Pick a starting point — you can switch templates and change anything
          at any time. Your work is saved automatically on this device.
        </p>

        <div className={styles.options}>
          {options.map((o) => (
            <button
              key={o.id}
              className={`${styles.option} ${styles[`option_${o.accent}`]}`}
              onClick={() => onChoose(o.id)}
            >
              <span className={styles.optionIcon}>
                <o.icon size={20} strokeWidth={2.2} />
              </span>
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{o.title}</span>
                <span className={styles.optionBody}>{o.body}</span>
              </span>
            </button>
          ))}
        </div>

        <button className={styles.skip} onClick={onClose}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
