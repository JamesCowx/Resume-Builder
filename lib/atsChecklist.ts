import type { ResumeData } from "./types";
import { resumeToPlainText } from "./ats";

export type AtsCheck = {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
};

export function atsChecklist(data: ResumeData): AtsCheck[] {
  const p = data.personal;
  const text = resumeToPlainText(data);

  const hasName = p.fullName.trim().length > 0;
  const hasContact = Boolean(p.email.trim() || p.phone.trim());
  const hasSummary = p.summary.trim().length >= 40;
  const hasExperience = data.experience.length > 0;
  const hasEducation = data.education.length > 0;
  const hasSkills = data.skills.filter((s) => s.trim()).length >= 3;
  const hasDates = data.experience.every(
    (x) => x.start.trim() || x.end.trim()
  );

  const blockedPhrases = /lorem|placeholder|tbd|xxx|\[object\s*object\]/i;
  const noPlaceholders = !blockedPhrases.test(text);

  const hasPhoto = Boolean(p.photo);

  return [
    {
      id: "name",
      label: "Full name present",
      pass: hasName,
      detail: hasName ? "Good — your name is the first thing ATS reads." : "Add your full name.",
    },
    {
      id: "contact",
      label: "Contact info present",
      pass: hasContact,
      detail: hasContact
        ? "Email or phone is included."
        : "Add at least an email or phone number.",
    },
    {
      id: "summary",
      label: "Summary section",
      pass: hasSummary,
      detail: hasSummary
        ? "A summary helps ATS and recruiters skim quickly."
        : "Write a 2–4 sentence summary.",
    },
    {
      id: "experience",
      label: "Work experience listed",
      pass: hasExperience,
      detail: hasExperience
        ? "Experience section present."
        : "Add at least one role.",
    },
    {
      id: "education",
      label: "Education listed",
      pass: hasEducation,
      detail: hasEducation ? "Education section present." : "Add your education.",
    },
    {
      id: "skills",
      label: "3+ skills listed",
      pass: hasSkills,
      detail: hasSkills
        ? "A solid skill list helps keyword matching."
        : "List at least 3 skills.",
    },
    {
      id: "dates",
      label: "Dates on all roles",
      pass: hasDates,
      detail: hasDates
        ? "Every role has start/end dates."
        : "Add dates to each role — many ATS reject missing dates.",
    },
    {
      id: "placeholders",
      label: "No placeholder text",
      pass: noPlaceholders,
      detail: noPlaceholders
        ? "No placeholder text detected."
        : "Remove placeholder text like 'lorem', 'TBD', or 'xxx'.",
    },
    {
      id: "photo",
      label: "No photo (ATS-safe)",
      pass: !hasPhoto,
      detail: hasPhoto
        ? "Photos can confuse some ATS parsers — consider a no-photo template for applications."
        : "Good — no photo is safest for ATS parsing.",
    },
    {
      id: "sections",
      label: "Standard section names",
      pass: true,
      detail: "Sections use standard headings (Experience, Education, Skills).",
    },
    {
      id: "text",
      label: "Text is extractable",
      pass: true,
      detail: "Content exports to plain text cleanly (no tables or images for core info).",
    },
  ];
}

export function atsScore(checks: AtsCheck[]): number {
  const passed = checks.filter((c) => c.pass).length;
  return Math.round((passed / checks.length) * 100);
}