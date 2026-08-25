import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Pencil } from "lucide-react";
import { getShare } from "@/lib/db";
import { ResumeDocument } from "@/components/Templates";
import type { TemplateId } from "@/components/Templates";
import { CoverLetterDocument } from "@/components/CoverLetterDocument";
import type { CoverTemplateId } from "@/components/CoverLetterDocument";
import type { ResumeData, CoverLetterData } from "@/lib/types";
import "./share.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shared Resume",
  robots: { index: false, follow: false },
};

const RESUME_IDS = new Set([
  "modern",
  "classic",
  "minimal",
  "executive",
  "creative",
  "compact",
  "columns",
  "timeline",
  "elegant",
]);
const COVER_IDS = new Set(["cover-classic", "cover-clean"]);

type Payload = {
  kind: "resume" | "cover";
  data: unknown;
  template: string;
  accent: string;
  font: string;
  name?: string;
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

function sanitizePayload(raw: string | undefined): Payload | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as Partial<Payload>;
    if (typeof p.data !== "object" || p.data === null) return null;
    const kind = p.kind === "cover" ? "cover" : "resume";
    const template = str(p.template);
    const accent = /^#[0-9a-fA-F]{6}$/.test(str(p.accent))
      ? str(p.accent)
      : "#1d4ed8";
    const font = /^var\(--font-[a-z0-9]+\)$/.test(str(p.font))
      ? str(p.font)
      : "";
    return {
      kind,
      data: p.data,
      template: kind === "cover" ? (COVER_IDS.has(template) ? (template as CoverTemplateId) : "cover-classic") : (RESUME_IDS.has(template) ? (template as TemplateId) : "modern"),
      accent,
      font,
      name: str(p.name).slice(0, 120),
    };
  } catch {
    return null;
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let share = null;
  try {
    share = await getShare(token);
  } catch (e) {
    console.error("Share page getShare error:", e);
  }
  const payload = share ? sanitizePayload(share.payload) : null;

  if (!payload) {
    return (
      <main className="sharePage">
        <header className="shareBar">
          <Link href="/" className="shareBrand">
            <span className="shareBrandMark">
              <FileText size={16} strokeWidth={2.4} />
            </span>
            <span>
              Resume<span className="shareBrandFaint">Builder</span>
            </span>
          </Link>
          <Link href="/builder" className="shareCta">
            Create your own
          </Link>
        </header>
        <div className="shareEmpty">
          <h1>This link has expired or doesn&apos;t exist.</h1>
          <p>The shared resume you&apos;re looking for could not be found.</p>
          <Link href="/builder" className="shareEmptyCta">
            <Pencil size={15} strokeWidth={2.4} />
            Build your own resume
          </Link>
        </div>
      </main>
    );
  }

  const style = { "--accent": payload.accent } as React.CSSProperties;

  return (
    <main className="sharePage">
      <header className="shareBar">
        <Link href="/" className="shareBrand">
          <span className="shareBrandMark">
            <FileText size={16} strokeWidth={2.4} />
          </span>
          <span>
            Resume<span className="shareBrandFaint">Builder</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="sharePrintBtn"
            onClick={() => window.print()}
          >
            Download PDF
          </button>
          <Link href="/builder" className="shareCta">
            <Pencil size={14} strokeWidth={2.5} />
            Make your own
          </Link>
        </div>
      </header>

      <div className="shareCanvas">
        <div className="shareSheet">
          <div style={style}>
            {payload.kind === "cover" ? (
              <CoverLetterDocument
                data={payload.data as CoverLetterData}
                template={payload.template as CoverTemplateId}
                font={payload.font || undefined}
              />
            ) : (
              <ResumeDocument
                data={payload.data as ResumeData}
                template={payload.template as TemplateId}
                font={payload.font || undefined}
              />
            )}
          </div>
        </div>
      </div>

      <footer className="shareFooter">
        Crafted with ResumeBuilder
      </footer>
    </main>
  );
}
