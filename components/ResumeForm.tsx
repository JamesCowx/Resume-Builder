"use client";

import { useRef, useState } from "react";
import type { ResumeData } from "@/lib/types";
import type { AIAction } from "@/lib/ai";
import { Camera, ChevronDown, ChevronUp, GripVertical, Plus, Sparkles, X } from "lucide-react";
import styles from "./form.module.css";

type ListField = "experience" | "education" | "projects" | "certificates";

type ResumeFormProps = {
  data: ResumeData;
  onPersonalChange: (field: keyof ResumeData["personal"], value: string) => void;
  onSummaryChange: (value: string) => void;
  onPhotoChange: (value: string) => void;
  onAdd: (field: ListField) => void;
  onRemove: (field: ListField, id: string) => void;
  onMove: (field: ListField, id: string, dir: -1 | 1) => void;
  onReorder: (field: ListField, fromId: string, toId: string) => void;
  onItemChange: (
    field: ListField,
    id: string,
    key: string,
    value: string
  ) => void;
  onSkillsChange: (value: string) => void;
  aiConfigured: boolean;
  aiBusy: string | null;
  onAssist: (action: AIAction, id?: string) => void;
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

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className={styles.card}>
      <div
        className={styles.cardHeader}
        onClick={() => setCollapsed((c) => !c)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setCollapsed((c) => !c);
          }
        }}
      >
        <h3 className={styles.cardTitle}>
          {title}
          {typeof count === "number" && (
            <span className={styles.cardCount}>{count}</span>
          )}
        </h3>
        <span
          className={`${styles.chevron} ${collapsed ? styles.chevronCollapsed : ""}`}
          aria-hidden
        >
          <ChevronDown size={16} strokeWidth={2.4} />
        </span>
      </div>
      <div className={collapsed ? styles.cardBodyHidden : styles.cardBody}>
        <div className={styles.cardInner}>{children}</div>
      </div>
    </section>
  );
}

function ItemActions({
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: {
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div className={styles.itemActions}>
      <span
        className={styles.dragHandle}
        title="Drag to reorder"
        aria-label="Drag to reorder"
      >
        <GripVertical size={15} strokeWidth={2.2} />
      </span>
      <button
        className={styles.iconBtn}
        onClick={onMove.bind(null, -1)}
        disabled={!canMoveUp}
        title="Move up"
        aria-label="Move up"
      >
        <ChevronUp size={16} strokeWidth={2.4} />
      </button>
      <button
        className={styles.iconBtn}
        onClick={onMove.bind(null, 1)}
        disabled={!canMoveDown}
        title="Move down"
        aria-label="Move down"
      >
        <ChevronDown size={16} strokeWidth={2.4} />
      </button>
      <button
        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
        onClick={onRemove}
        title="Remove"
        aria-label="Remove"
      >
        <X size={16} strokeWidth={2.4} />
      </button>
    </div>
  );
}

function AiButton({
  label,
  busy,
  disabled,
  onClick,
}: {
  label: string;
  busy: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={styles.aiBtn}
      onClick={onClick}
      disabled={busy || disabled}
      title="Uses your connected AI provider"
    >
      {busy ? "Working…" : (
        <>
          <Sparkles size={14} strokeWidth={2.4} />
          {label}
        </>
      )}
    </button>
  );
}

export default function ResumeForm({
  data,
  onPersonalChange,
  onSummaryChange,
  onPhotoChange,
  onAdd,
  onRemove,
  onMove,
  onReorder,
  onItemChange,
  onSkillsChange,
  aiConfigured,
  aiBusy,
  onAssist,
}: ResumeFormProps) {
  const { personal } = data;
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo is too large — please use an image under 2 MB.");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => onPhotoChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  const dragProps = (field: ListField, id: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setDragId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const fromId = e.dataTransfer.getData("text/plain") || dragId;
      if (fromId && fromId !== id) onReorder(field, fromId, id);
      setDragId(null);
    },
    onDragEnd: () => setDragId(null),
  });

  const datesField = (
    start: string,
    end: string,
    onChange: (key: "start" | "end", value: string) => void
  ) => (
    <Field
      label="Dates"
      value={`${start} – ${end}`}
      onChange={(v) => {
        const [s = "", e = ""] = v.split("–").map((x) => x.trim());
        onChange("start", s);
        onChange("end", e);
      }}
      placeholder="Jan 2022 – Present"
    />
  );

  return (
    <div className={styles.form}>
      <Section title="Personal Details">
        <div className={styles.photoRow}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handlePhoto(e.target.files?.[0])}
          />
          {personal.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={personal.photo}
              alt="Profile preview"
              className={styles.photoPreview}
            />
          ) : (
            <div
              className={`${styles.photoPreview} ${styles.photoPreviewEmpty}`}
              aria-hidden
            >
              <Camera size={22} strokeWidth={2} />
            </div>
          )}
          <div className={styles.photoControls}>
            <button
              className={styles.fileBtn}
              onClick={() => fileRef.current?.click()}
            >
              Upload photo (optional)
            </button>
            {personal.photo && (
              <button
                className={styles.removePhotoBtn}
                onClick={() => onPhotoChange("")}
              >
                Remove photo
              </button>
            )}
          </div>
          {photoError && <span className={styles.photoError}>{photoError}</span>}
        </div>
        <div className={styles.grid}>
          <Field
            label="Full Name"
            value={personal.fullName}
            onChange={(v) => onPersonalChange("fullName", v)}
            placeholder="Jane Smith"
          />
          <Field
            label="Professional Title"
            value={personal.headline}
            onChange={(v) => onPersonalChange("headline", v)}
            placeholder="Frontend Developer"
          />
          <Field
            label="Email"
            value={personal.email}
            onChange={(v) => onPersonalChange("email", v)}
            placeholder="jane@email.com"
          />
          <Field
            label="Phone"
            value={personal.phone}
            onChange={(v) => onPersonalChange("phone", v)}
            placeholder="(555) 123-4567"
          />
          <Field
            label="Location"
            value={personal.location}
            onChange={(v) => onPersonalChange("location", v)}
            placeholder="New York, NY"
          />
          <Field
            label="Website / Portfolio"
            value={personal.website}
            onChange={(v) => onPersonalChange("website", v)}
            placeholder="janedev.com"
          />
        </div>
        {aiConfigured && (
          <div className={styles.aiRow}>
            <AiButton
              label="Improve headline"
              busy={aiBusy === "headline"}
              onClick={() => onAssist("headline")}
            />
          </div>
        )}
      </Section>

      <Section title="Professional Summary">
        <div className={styles.grid}>
          <Field
            label="Summary"
            value={personal.summary}
            onChange={onSummaryChange}
            placeholder="2–4 sentences that sell your top skills and experience."
            full
            textarea
            hint={`Tip: recruiters read this first. Lead with your strongest asset.  ·  ${personal.summary.length} chars`}
          />
        </div>
        {aiConfigured && (
          <div className={styles.aiRow}>
            <AiButton
              label="Improve with AI"
              busy={aiBusy === "summary"}
              onClick={() => onAssist("summary")}
            />
          </div>
        )}
      </Section>

      <Section title="Work Experience" count={data.experience.length}>
        {data.experience.map((x, i) => (
          <div key={x.id} className={styles.item} {...dragProps("experience", x.id)}>
            <div className={styles.itemTop}>
              <p className={styles.itemTitle}>
                {x.role || x.company || "Experience"}
              </p>
              <ItemActions
                onRemove={() => onRemove("experience", x.id)}
                onMove={(d) => onMove("experience", x.id, d)}
                canMoveUp={i > 0}
                canMoveDown={i < data.experience.length - 1}
              />
            </div>
            <div className={styles.grid}>
              <Field
                label="Job Title"
                value={x.role}
                onChange={(v) => onItemChange("experience", x.id, "role", v)}
                placeholder="Senior Developer"
              />
              <Field
                label="Company"
                value={x.company}
                onChange={(v) => onItemChange("experience", x.id, "company", v)}
                placeholder="Acme Corp"
              />
              <Field
                label="Location"
                value={x.location}
                onChange={(v) => onItemChange("experience", x.id, "location", v)}
                placeholder="Chicago, IL"
              />
              {datesField(x.start, x.end, (key, v) =>
                onItemChange("experience", x.id, key, v)
              )}
              <Field
                label="Achievements (one per line)"
                value={x.bullets}
                onChange={(v) => onItemChange("experience", x.id, "bullets", v)}
                full
                textarea
                hint="Use action verbs and include numbers, e.g. “Cut page load time by 40%.”"
              />
              {aiConfigured && (
                <div className={styles.aiRow}>
                  <AiButton
                    label="Improve bullets with AI"
                    busy={aiBusy === `bullets:${x.id}`}
                    onClick={() => onAssist("bullets", x.id)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => onAdd("experience")}>
          <Plus size={15} strokeWidth={2.6} />
          Add Experience
        </button>
      </Section>

      <Section title="Education" count={data.education.length}>
        {data.education.map((e, i) => (
          <div key={e.id} className={styles.item} {...dragProps("education", e.id)}>
            <div className={styles.itemTop}>
              <p className={styles.itemTitle}>
                {e.school || e.degree || "Education"}
              </p>
              <ItemActions
                onRemove={() => onRemove("education", e.id)}
                onMove={(d) => onMove("education", e.id, d)}
                canMoveUp={i > 0}
                canMoveDown={i < data.education.length - 1}
              />
            </div>
            <div className={styles.grid}>
              <Field
                label="School"
                value={e.school}
                onChange={(v) => onItemChange("education", e.id, "school", v)}
                placeholder="University of ..."
              />
              <Field
                label="Degree"
                value={e.degree}
                onChange={(v) => onItemChange("education", e.id, "degree", v)}
                placeholder="B.S. in Computer Science"
              />
              <Field
                label="Location"
                value={e.location}
                onChange={(v) => onItemChange("education", e.id, "location", v)}
                placeholder="Boston, MA"
              />
              {datesField(e.start, e.end, (key, v) =>
                onItemChange("education", e.id, key, v)
              )}
              <Field
                label="Additional Details"
                value={e.details}
                onChange={(v) => onItemChange("education", e.id, "details", v)}
                full
                placeholder="GPA, honors, activities"
              />
            </div>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => onAdd("education")}>
          <Plus size={15} strokeWidth={2.6} />
          Add Education
        </button>
      </Section>

      <Section title="Projects" count={data.projects.length}>
        {data.projects.map((p, i) => (
          <div key={p.id} className={styles.item} {...dragProps("projects", p.id)}>
            <div className={styles.itemTop}>
              <p className={styles.itemTitle}>{p.name || "Project"}</p>
              <ItemActions
                onRemove={() => onRemove("projects", p.id)}
                onMove={(d) => onMove("projects", p.id, d)}
                canMoveUp={i > 0}
                canMoveDown={i < data.projects.length - 1}
              />
            </div>
            <div className={styles.grid}>
              <Field
                label="Project Name"
                value={p.name}
                onChange={(v) => onItemChange("projects", p.id, "name", v)}
                placeholder="Open Source Dashboard"
              />
              <Field
                label="Link"
                value={p.url}
                onChange={(v) => onItemChange("projects", p.id, "url", v)}
                placeholder="github.com/yourname/repo"
              />
              <Field
                label="Description"
                value={p.description}
                onChange={(v) =>
                  onItemChange("projects", p.id, "description", v)
                }
                full
                textarea
                placeholder="What it does, what you built, and the result."
              />
            </div>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => onAdd("projects")}>
          <Plus size={15} strokeWidth={2.6} />
          Add Project
        </button>
      </Section>

      <Section title="Certifications" count={data.certificates.length}>
        {data.certificates.map((c, i) => (
          <div key={c.id} className={styles.item} {...dragProps("certificates", c.id)}>
            <div className={styles.itemTop}>
              <p className={styles.itemTitle}>{c.name || "Certification"}</p>
              <ItemActions
                onRemove={() => onRemove("certificates", c.id)}
                onMove={(d) => onMove("certificates", c.id, d)}
                canMoveUp={i > 0}
                canMoveDown={i < data.certificates.length - 1}
              />
            </div>
            <div className={styles.grid}>
              <Field
                label="Certification"
                value={c.name}
                onChange={(v) => onItemChange("certificates", c.id, "name", v)}
                placeholder="AWS Solutions Architect"
              />
              <Field
                label="Issuer"
                value={c.issuer}
                onChange={(v) => onItemChange("certificates", c.id, "issuer", v)}
                placeholder="Amazon Web Services"
              />
              <Field
                label="Year"
                value={c.year}
                onChange={(v) => onItemChange("certificates", c.id, "year", v)}
                placeholder="2022"
              />
            </div>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => onAdd("certificates")}>
          <Plus size={15} strokeWidth={2.6} />
          Add Certification
        </button>
      </Section>

      <Section title="Skills">
        <div className={styles.grid}>
          <Field
            label="Skills"
            value={data.skills.join(", ")}
            onChange={onSkillsChange}
            full
            placeholder="React, TypeScript, Figma, ..."
            hint="Separate skills with commas. You can also paste a whole list."
          />
        </div>
        {aiConfigured && (
          <div className={styles.aiRow}>
            <AiButton
              label="Suggest skills with AI"
              busy={aiBusy === "skills"}
              onClick={() => onAssist("skills")}
            />
          </div>
        )}
      </Section>
    </div>
  );
}
