import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!rateLimit(`import:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many imports. Try again in a minute." },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large (max 10MB)." }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  let text = "";

  try {
    if (name.endsWith(".pdf")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfjsLib = await import("pdfjs-dist");
      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      const pageTexts: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        pageTexts.push(content.items.map((item) => "str" in item ? item.str : "").join(" "));
      }
      text = pageTexts.join("\n");
    } else if (name.endsWith(".docx")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith(".txt") || name.endsWith(".text")) {
      text = await file.text();
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to parse file.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  if (!text.trim()) {
    return NextResponse.json(
      { error: "Could not extract text from the file." },
      { status: 400 }
    );
  }

  // Parse the text into resume fields
  const parsed = parseResumeText(text);

  return NextResponse.json({ text: text.trim(), parsed });
}

function parseResumeText(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const fullText = text.toLowerCase();

  // Extract email
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  const email = emailMatch ? emailMatch[0] : "";

  // Extract phone
  const phoneMatch = text.match(
    /(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  );
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  // Extract name (first non-empty line that's not a common header)
  const skipWords = [
    "resume", "curriculum", "vitae", "cv", "contact", "personal",
    "professional", "summary", "objective", "experience", "education",
    "skills", "projects", "certifications", "references",
  ];
  let name = "";
  for (const line of lines.slice(0, 5)) {
    const lower = line.toLowerCase();
    if (
      line.length > 1 &&
      line.length < 50 &&
      !skipWords.some((w) => lower.includes(w)) &&
      !email &&
      !line.match(/^\d/)
    ) {
      name = line;
      break;
    }
  }

  // Extract sections
  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  let currentSection: string | null = null;
  const sectionKeywords: Record<string, string[]> = {
    summary: ["summary", "objective", "profile", "about"],
    experience: ["experience", "employment", "work history", "professional experience"],
    education: ["education", "academic", "qualifications"],
    skills: ["skills", "technologies", "competencies", "expertise"],
    projects: ["projects", "portfolio"],
    certifications: ["certifications", "certificates", "licenses"],
  };

  for (const line of lines) {
    const lower = line.toLowerCase();
    let found = false;
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (
        keywords.some((k) => lower.startsWith(k) || lower === k) &&
        line.length < 40
      ) {
        currentSection = section;
        found = true;
        break;
      }
    }
    if (!found && currentSection) {
      sections[currentSection].push(line);
    }
  }

  return {
    name,
    email,
    phone,
    summary: sections.summary.join(" ").slice(0, 500),
    experience: sections.experience.join("\n"),
    education: sections.education.join("\n"),
    skills: sections.skills.join(", "),
    projects: sections.projects.join("\n"),
    certifications: sections.certifications.join("\n"),
  };
}
