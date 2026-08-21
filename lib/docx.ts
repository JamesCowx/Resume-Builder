import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { ResumeData, CoverLetterData } from "./types";

const bullets = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function heading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
    },
    children: [
      new TextRun({ text, bold: true, size: 24, color: "1D4ED8" }),
    ],
  });
}

function metaLine(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, color: "6B7280" })],
    spacing: { after: 60 },
  });
}

export function buildDocx(data: ResumeData): Document {
  const { personal } = data;
  const kids: Paragraph[] = [];

  kids.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personal.fullName || "Your Name",
          bold: true,
          size: 44,
          color: "0F172A",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  if (personal.headline) {
    kids.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personal.headline,
            size: 24,
            italics: true,
            color: "334155",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      })
    );
  }

  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
  ].filter(Boolean);
  if (contact.length) {
    kids.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contact.join("  |  "),
            size: 20,
            color: "4B5563",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
      })
    );
  }

  if (personal.summary) {
    kids.push(heading("SUMMARY"));
    kids.push(
      new Paragraph({
        children: [new TextRun({ text: personal.summary, size: 22 })],
        spacing: { after: 120 },
      })
    );
  }

  if (data.experience.length) {
    kids.push(heading("EXPERIENCE"));
    for (const x of data.experience) {
      kids.push(
        new Paragraph({
          children: [
            new TextRun({ text: x.role || "Role", bold: true, size: 24 }),
            new TextRun({
              text: x.company ? `  |  ${x.company}` : "",
              size: 22,
              color: "1D4ED8",
              bold: true,
            }),
          ],
          spacing: { before: 60 },
        })
      );
      const meta = [
        x.location,
        [x.start, x.end].filter(Boolean).join(" – "),
      ].filter(Boolean).join("   ·   ");
      if (meta) kids.push(metaLine(meta));
      for (const b of bullets(x.bullets)) {
        kids.push(
          new Paragraph({
            children: [new TextRun({ text: b, size: 22 })],
            bullet: { level: 0 },
            spacing: { after: 20 },
          })
        );
      }
    }
  }

  if (data.projects.length) {
    kids.push(heading("PROJECTS"));
    for (const p of data.projects) {
      kids.push(
        new Paragraph({
          children: [
            new TextRun({ text: p.name || "Project", bold: true, size: 23 }),
            new TextRun({
              text: p.url ? `  |  ${p.url}` : "",
              size: 20,
              color: "1D4ED8",
            }),
          ],
          spacing: { before: 40 },
        })
      );
      if (p.description) {
        kids.push(
          new Paragraph({
            children: [new TextRun({ text: p.description, size: 22 })],
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  if (data.education.length) {
    kids.push(heading("EDUCATION"));
    for (const e of data.education) {
      kids.push(
        new Paragraph({
          children: [
            new TextRun({ text: e.school || "School", bold: true, size: 23 }),
            new TextRun({
              text: e.degree ? `  |  ${e.degree}` : "",
              size: 22,
            }),
          ],
          spacing: { before: 40 },
        })
      );
      const meta = [
        e.location,
        [e.start, e.end].filter(Boolean).join(" – "),
      ].filter(Boolean).join("   ·   ");
      if (meta) kids.push(metaLine(meta));
      if (e.details)
        kids.push(
          new Paragraph({
            children: [new TextRun({ text: e.details, size: 20 })],
            spacing: { after: 40 },
          })
        );
    }
  }

  if (data.certificates.length) {
    kids.push(heading("CERTIFICATIONS"));
    for (const c of data.certificates) {
      kids.push(
        new Paragraph({
          children: [
            new TextRun({ text: c.name || "Certification", size: 22 }),
            new TextRun({
              text: [c.issuer, c.year].filter(Boolean).length
                ? `  |  ${[c.issuer, c.year].filter(Boolean).join(", ")}`
                : "",
              size: 20,
              color: "6B7280",
            }),
          ],
          spacing: { after: 40 },
        })
      );
    }
  }

  if (data.skills.length) {
    kids.push(heading("SKILLS"));
    kids.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.skills.map((s) => s.trim()).filter(Boolean).join(", "),
            size: 22,
          }),
        ],
        spacing: { after: 40 },
      })
    );
  }

  return new Document({
    creator: "Resume Builder",
    title: `${personal.fullName || "Resume"} — Resume`,
    sections: [{ properties: {}, children: kids }],
  });
}

export async function downloadDocx(data: ResumeData, name: string): Promise<void> {
  const doc = buildDocx(data);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name || "resume"}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function buildCoverDocx(data: CoverLetterData): Document {
  const kids: Paragraph[] = [];
  const spacer = () =>
    new Paragraph({ children: [new TextRun({ text: "", size: 10 })] });

  const sender = [
    data.senderName,
    data.senderEmail,
    data.senderPhone,
    data.senderLocation,
  ].filter(Boolean);
  sender.forEach((line, i) =>
    kids.push(
      new Paragraph({
        children: [new TextRun({ text: line, size: 22, bold: i === 0 })],
        spacing: { after: 60 },
      })
    )
  );
  if (sender.length) kids.push(spacer());

  const meta = [
    data.date,
    data.recipientName,
    data.company,
    data.position ? `Re: ${data.position}` : "",
  ].filter(Boolean);
  meta.forEach((line) =>
    kids.push(
      new Paragraph({
        children: [new TextRun({ text: line, size: 22 })],
        spacing: { after: 60 },
      })
    )
  );
  kids.push(spacer());

  kids.push(
    new Paragraph({
      children: [new TextRun({ text: data.opening || "Dear Hiring Manager,", size: 22 })],
      spacing: { after: 120 },
    })
  );

  const paragraphs = data.body
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  (paragraphs.length ? paragraphs : ["Write the body of your cover letter here."]).forEach(
    (p) =>
      kids.push(
        new Paragraph({
          children: [new TextRun({ text: p, size: 22 })],
          spacing: { after: 120 },
        })
      )
  );
  kids.push(spacer());

  kids.push(
    new Paragraph({
      children: [new TextRun({ text: data.closing || "Sincerely,", size: 22 })],
      spacing: { after: 240 },
    })
  );
  kids.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.senderName || "Your Full Name", size: 22, bold: true }),
      ],
    })
  );

  return new Document({
    creator: "Resume Builder",
    title: `${data.senderName || "Cover Letter"} — Cover Letter`,
    sections: [{ properties: {}, children: kids }],
  });
}

export async function downloadCoverDocx(
  data: CoverLetterData,
  name: string
): Promise<void> {
  const doc = buildCoverDocx(data);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name || "cover-letter"}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
