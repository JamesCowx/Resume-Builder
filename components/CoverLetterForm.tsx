"use client";

import type { CoverLetterData } from "@/lib/types";
import { Download } from "lucide-react";
import styles from "./form.module.css";

type Props = {
  data: CoverLetterData;
  onChange: (patch: Partial<CoverLetterData>) => void;
  onPullFromResume: () => void;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  full,
  textarea,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  full?: boolean;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div className={`${styles.field} ${full ? styles.gridFull : ""}`}>
      <label className={styles.label}>{label}</label>
      {textarea ? (
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardInner}>{children}</div>
      </div>
    </section>
  );
}

export default function CoverLetterForm({ data, onChange, onPullFromResume }: Props) {
  return (
    <div className={styles.form}>
      <Section title="Sender (your details)">
        <div className={styles.grid}>
          <Field
            label="Your Full Name"
            value={data.senderName}
            onChange={(v) => onChange({ senderName: v })}
            placeholder="Jane Smith"
            hint="Tip: create a resume first, then 'Pull from resume' to fill this automatically."
          />
          <Field
            label="Email"
            value={data.senderEmail}
            onChange={(v) => onChange({ senderEmail: v })}
            placeholder="jane@email.com"
          />
          <Field
            label="Phone"
            value={data.senderPhone}
            onChange={(v) => onChange({ senderPhone: v })}
            placeholder="(555) 123-4567"
          />
          <Field
            label="Location"
            value={data.senderLocation}
            onChange={(v) => onChange({ senderLocation: v })}
            placeholder="New York, NY"
          />
        </div>
        <div className={styles.aiRow}>
          <button
            className={styles.aiBtn}
            onClick={onPullFromResume}
            title="Copy your name, email, phone, and location from the resume"
          >
            <Download size={14} strokeWidth={2.4} />
            Pull from resume
          </button>
        </div>
      </Section>

      <Section title="Recipient">
        <div className={styles.grid}>
          <Field
            label="Recipient Name"
            value={data.recipientName}
            onChange={(v) => onChange({ recipientName: v })}
            placeholder="Hiring Manager"
          />
          <Field
            label="Company"
            value={data.company}
            onChange={(v) => onChange({ company: v })}
            placeholder="Acme Corporation"
          />
          <Field
            label="Position You're Applying For"
            value={data.position}
            onChange={(v) => onChange({ position: v })}
            placeholder="Senior Software Engineer"
          />
          <Field
            label="Date"
            value={data.date}
            onChange={(v) => onChange({ date: v })}
            placeholder="March 3, 2026"
          />
        </div>
      </Section>

      <Section title="Letter">
        <div className={styles.grid}>
          <Field
            label="Salutation"
            value={data.opening}
            onChange={(v) => onChange({ opening: v })}
            placeholder="Dear Hiring Manager,"
          />
          <Field
            label="Body (paragraphs separated by blank lines)"
            value={data.body}
            onChange={(v) => onChange({ body: v })}
            full
            textarea
            hint="Introduce yourself, connect your experience to the role, and end with a call to action."
          />
          <Field
            label="Closing"
            value={data.closing}
            onChange={(v) => onChange({ closing: v })}
            placeholder="Sincerely,"
          />
        </div>
      </Section>
    </div>
  );
}