import type { ResumeData } from "./types";

export type ReviewIssue = {
  severity: "error" | "warning" | "good";
  message: string;
};

const ACTION_VERBS =
  /^(led|built|created|developed|designed|implemented|launched|managed|mentored|improved|reduced|increased|drove|shipped|spearheaded|architected|optimized|automated|delivered|coordinated|negotiated|secured|owned|engineered|grew|established|streamlined)/i;

const QUANTIFIED = /\d+(%|m|k|people|users|clients|revenue|stars|×|x)?/i;

export function reviewResume(data: ResumeData): {
  score: number;
  issues: ReviewIssue[];
} {
  const issues: ReviewIssue[] = [];
  const { personal, experience, education, projects, certificates, skills } =
    data;

  const good = (message: string) =>
    issues.push({ severity: "good", message });
  const warn = (message: string) =>
    issues.push({ severity: "warning", message });
  const err = (message: string) => issues.push({ severity: "error", message });

  let score = 0;
  const add = (points: number) => (score += points);

  if (personal.fullName.trim()) {
    add(10);
    good("Your name is set — it should appear prominently at the top.");
  } else {
    err("Add your full name — it's the first thing recruiters look for.");
  }

  const contacts = [personal.email, personal.phone, personal.location];
  const contactCount = contacts.filter((c) => c.trim()).length;
  if (contactCount === 3) {
    add(10);
    good("Email, phone, and location are all present.");
  } else {
    add(contactCount * (10 / 3));
    warn(
      `Add your ${["email", "phone", "location"]
        .filter((_, i) => !contacts[i].trim())
        .join(" and ")} so recruiters can reach you.`
    );
  }

  const summaryLen = personal.summary.trim().length;
  if (summaryLen >= 80 && summaryLen <= 500) {
    add(15);
    good("Your summary is a good length — concise but informative.");
  } else if (summaryLen > 0) {
    add(6);
    warn(
      summaryLen < 80
        ? "Your summary is a little short — aim for 2–4 sentences that sell your impact."
        : "Your summary is quite long — trim it to the essentials (under ~500 characters)."
    );
  } else {
    err("Write a 2–4 sentence professional summary at the top.");
  }

  if (experience.length === 0) {
    err("Add at least one work experience entry — it's the heart of a resume.");
  } else {
    add(Math.min(experience.length * 5, 15));
    let bulletGood = 0;
    for (const job of experience) {
      const lines = job.bullets
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) {
        warn(`"${job.role || "Job"}" at ${job.company || "?"} has no bullet points.`);
        continue;
      }
      const quantified = lines.filter((l) => QUANTIFIED.test(l)).length;
      const action = lines.filter((l) => ACTION_VERBS.test(l)).length;
      if (quantified >= 1 && action === lines.length) {
        bulletGood++;
        good(
          `"${job.role || "Job"}" bullets are action-driven and quantified.`
        );
      } else {
        warn(
          `Improve bullets at "${job.role || "Job"}": start with action verbs and add numbers/outcomes (e.g. "Increased conversion by 20%").`
        );
      }
    }
    add(Math.min(bulletGood * 5, 15));
  }

  if (education.length > 0) {
    add(8);
    good("Education section is included.");
  } else {
    warn("Consider adding your education, even a short entry.");
  }

  if (projects.length > 0) {
    add(7);
    good("Projects add real credibility — nice work.");
  }

  if (certificates.length > 0) {
    add(5);
    good("Certifications strengthen your profile.");
  }

  const cleanSkills = skills.map((s) => s.trim()).filter(Boolean);
  if (cleanSkills.length >= 5) {
    add(15);
    good("A solid, keyword-rich skills list helps you pass ATS filters.");
  } else if (cleanSkills.length > 0) {
    add(7);
    warn("List 5+ skills, including keywords from the job description.");
  } else {
    err("Add your skills — most ATS systems scan these keywords first.");
  }

  const text = [
    personal.summary,
    ...experience.flatMap((j) => j.bullets),
    ...projects.map((p) => `${p.name} ${p.description}`),
  ]
    .join(" ")
    .toLowerCase();

  if (/\blorem\b|\bplaceholder\b|\btbd\b|\bxxx\b/.test(text)) {
    err("Remove placeholder text (lorem ipsum, TBD, xxx, etc.).");
    score = Math.max(0, score - 15);
  }

  score = Math.round(Math.min(100, Math.max(0, score)));
  return { score, issues };
}
