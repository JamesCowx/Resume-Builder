import type { ResumeData } from "./types";
import { resumeToPlainText } from "./ats";

export type JDAnalysis = {
  matchScore: number;
  coveredSkills: string[];
  missingSkills: string[];
  jdKeywords: string[];
};

const STOPWORDS = new Set([
  "the", "and", "for", "you", "your", "our", "with", "this", "that", "from",
  "will", "have", "are", "has", "was", "were", "who", "what", "when", "where",
  "which", "their", "they", "them", "its", "into", "over", "under", "about",
  "between", "through", "during", "before", "after", "above", "below", "a",
  "an", "to", "in", "of", "on", "at", "by", "or", "as", "if", "be", "we", "us",
  "you'll", "we're", "etc", "plus", "including", "use", "using", "used",
  "able", "ability", "new", "strong", "strongly", "all", "other", "such",
  "some", "than", "then", "job", "role", "position", "team", "work", "working",
  "company", "candidate", "experience", "years", "year", "skills", "skill",
  "required", "requirements", "preferred", "responsibilities",
  "responsibility", "knowledge", "benefits", "apply", "applying",
  "opportunity", "equal", "culture",
]);

function tokenize(text: string): string[] {
  // Strip trailing dots so sentence-final words don't carry "developer."-style
  // noise, while keeping internal dots/plus signs (Node.js, C++).
  return (
    text
      .match(/[A-Za-z0-9][A-Za-z0-9+#.+_-]{1,}/g)
      ?.map((t) => t.replace(/\.+$/, "")) ?? []
  );
}

function looksLikeSkill(token: string): boolean {
  // Tech names contain digits / special chars (C++, Node.js, 3D, AWS), or are
  // Capitalized / ALL-CAPS words (React, TypeScript, SQL).
  if (/[#+.0-9]/.test(token)) return true;
  if (token.length <= 1) return false;
  return /^[A-Z][a-z]+$/.test(token) || /^[A-Z]{2,}$/.test(token);
}

export function analyzeJD(jdText: string, resume: ResumeData): JDAnalysis {
  const jdLower = jdText.toLowerCase();
  const resumeText = resumeToPlainText(resume).toLowerCase();

  const skills = resume.skills.map((s) => s.trim()).filter(Boolean);
  const coveredSkills = skills.filter((s) =>
    jdLower.includes(s.toLowerCase())
  );

  const matchScore =
    skills.length > 0
      ? Math.round((coveredSkills.length / skills.length) * 100)
      : 0;

  const tokens = tokenize(jdText);
  const candidateKeywords = new Set<string>();

  for (const t of tokens) {
    const lower = t.toLowerCase();
    if (STOPWORDS.has(lower)) continue;
    if (!looksLikeSkill(t)) continue;
    // Skip pure numbers / years
    if (/^\d+$/.test(lower)) continue;
    candidateKeywords.add(lower);
  }

  const jdKeywords = [...candidateKeywords].slice(0, 20);
  const missingSkills = jdKeywords.filter(
    (k) => !resumeText.includes(k)
  );

  return { matchScore, coveredSkills, missingSkills, jdKeywords };
}
