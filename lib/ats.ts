import type { ResumeData, CoverLetterData } from "./types";

const bullets = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = [];
  const { personal } = data;

  if (personal.fullName) lines.push(personal.fullName.toUpperCase());
  if (personal.headline) lines.push(personal.headline);
  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
  ].filter(Boolean);
  if (contact.length) lines.push(contact.join(" | "));
  lines.push("");

  if (personal.summary) {
    lines.push("SUMMARY");
    lines.push(personal.summary);
    lines.push("");
  }

  if (data.experience.length) {
    lines.push("EXPERIENCE");
    for (const x of data.experience) {
      const title = [x.role, x.company].filter(Boolean).join(", ");
      const dates = [x.start, x.end].filter(Boolean).join(" – ");
      const loc = x.location;
      const head = [title, dates].filter(Boolean).join("  |  ");
      lines.push(head);
      if (loc) lines.push(loc);
      for (const b of bullets(x.bullets)) lines.push(`- ${b}`);
      lines.push("");
    }
  }

  if (data.projects.length) {
    lines.push("PROJECTS");
    for (const p of data.projects) {
      const head = [p.name, p.url].filter(Boolean).join("  |  ");
      lines.push(head);
      if (p.description) lines.push(p.description);
      lines.push("");
    }
  }

  if (data.education.length) {
    lines.push("EDUCATION");
    for (const e of data.education) {
      const head = [e.school, e.degree].filter(Boolean).join(", ");
      const dates = [e.start, e.end].filter(Boolean).join(" – ");
      lines.push([head, dates].filter(Boolean).join("  |  "));
      if (e.location) lines.push(e.location);
      if (e.details) lines.push(e.details);
      lines.push("");
    }
  }

  if (data.certificates.length) {
    lines.push("CERTIFICATIONS");
    for (const c of data.certificates) {
      lines.push(
        [c.name, c.issuer, c.year].filter(Boolean).join(" | ")
      );
    }
    lines.push("");
  }

  if (data.skills.length) {
    lines.push("SKILLS");
    lines.push(data.skills.map((s) => s.trim()).filter(Boolean).join(", "));
    lines.push("");
  }

  return lines.join("\n").trim();
}

export async function copyResumeAsText(data: ResumeData): Promise<boolean> {
  const text = resumeToPlainText(data);
  return writeClipboard(text);
}

export function coverToPlainText(data: CoverLetterData): string {
  const lines: string[] = [];
  const sender = [
    data.senderName,
    data.senderEmail,
    data.senderPhone,
    data.senderLocation,
  ].filter(Boolean);
  if (sender.length) lines.push(sender.join(" | "));
  const meta = [
    data.date,
    data.recipientName,
    data.company,
    data.position ? `Re: ${data.position}` : "",
  ].filter(Boolean);
  if (meta.length) lines.push(meta.join(" | "));
  lines.push("");
  lines.push(data.opening || "Dear Hiring Manager,");
  lines.push("");
  const paragraphs = data.body
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!paragraphs.length) paragraphs.push("Write the body of your cover letter here.");
  for (const p of paragraphs) {
    lines.push(p);
    lines.push("");
  }
  lines.push(data.closing || "Sincerely,");
  lines.push("");
  lines.push(data.senderName || "Your Full Name");
  return lines.join("\n").trim();
}

export async function copyCoverAsText(data: CoverLetterData): Promise<boolean> {
  return writeClipboard(coverToPlainText(data));
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
