import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Cloud,
  FileCheck,
  FileDown,
  FileText,
  LayoutTemplate,
  Link2,
  Mail,
  PenLine,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react";
import { sampleResume } from "@/lib/types";
import { ResumeDocument, TEMPLATES } from "@/components/Templates";
import type { TemplateId } from "@/components/Templates";
import LandingPreview from "./LandingPreview";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import styles from "./landing.module.css";

const SHEET_W = 794;
const SHEET_H = 1123;
const GALLERY_SCALE = 0.22;

function GalleryPreview({ template }: { template: TemplateId }) {
  return (
    <div
      className={styles.galleryFrame}
      style={{ width: SHEET_W * GALLERY_SCALE, height: SHEET_H * GALLERY_SCALE }}
    >
      <div
        className={styles.galleryScaled}
        style={{ transform: `scale(${GALLERY_SCALE})`, width: SHEET_W }}
      >
        <ResumeDocument data={sampleResume()} template={template} />
      </div>
    </div>
  );
}

/* ---------- Feature showcases ---------- */

function AiMock() {
  return (
    <div className={styles.mockCard}>
      <div className={styles.mockTitlebar}>
        <span className={styles.mockTraffic} />
        <span className={styles.mockTraffic} />
        <span className={styles.mockTraffic} />
        <span className={styles.mockTab}>AI Assistant</span>
      </div>
      <div className={styles.mockBody}>
        <div className={styles.mockFieldLabel}>Professional Summary</div>
        <div className={styles.mockTextLine} />
        <div className={styles.mockTextLine} style={{ width: "88%" }} />
        <div className={styles.mockTextLine} style={{ width: "72%" }} />
        <div className={styles.aiBubble}>
          <span className={styles.aiBubbleIcon}>
            <Sparkles size={14} strokeWidth={2.3} />
          </span>
          <div>
            <p className={styles.aiBubbleHead}>AI rewrite applied</p>
            <p className={styles.aiBubbleText}>
              Cut deployment time 55% across 12 microservices and shipped 40+
              releases per quarter.
            </p>
          </div>
        </div>
        <div className={styles.aiChips}>
          <span className={styles.aiChip}>
            <Sparkles size={12} strokeWidth={2.4} /> Improve summary
          </span>
          <span className={styles.aiChip}>
            <Sparkles size={12} strokeWidth={2.4} /> Sharpen bullets
          </span>
          <span className={styles.aiChip}>
            <Sparkles size={12} strokeWidth={2.4} /> Tailor to job
          </span>
        </div>
      </div>
    </div>
  );
}

function MatchMock() {
  return (
    <div className={styles.mockCard}>
      <div className={styles.mockTitlebar}>
        <span className={styles.mockTraffic} />
        <span className={styles.mockTraffic} />
        <span className={styles.mockTraffic} />
        <span className={styles.mockTab}>Job Match</span>
      </div>
      <div className={styles.mockBody}>
        <div className={styles.matchTop}>
          <div className={styles.matchRing}>
            <div className={styles.matchRingInner}>87%</div>
          </div>
          <div>
            <p className={styles.matchTitle}>Match score</p>
            <p className={styles.matchSub}>vs. Senior Engineer · Acme</p>
          </div>
        </div>
        <div className={styles.matchRow}>
          <span className={styles.chipOk}>
            <Check size={11} strokeWidth={3} /> React
          </span>
          <span className={styles.chipOk}>
            <Check size={11} strokeWidth={3} /> TypeScript
          </span>
          <span className={styles.chipOk}>
            <Check size={11} strokeWidth={3} /> AWS
          </span>
          <span className={styles.chipMiss}>GraphQL</span>
          <span className={styles.chipMiss}>Kubernetes</span>
        </div>
        <div className={styles.atsBlock}>
          <p className={styles.atsHead}>ATS checklist</p>
          <div className={styles.atsRow}>
            <CheckCircle2 size={14} strokeWidth={2.4} /> Contact info present
          </div>
          <div className={styles.atsRow}>
            <CheckCircle2 size={14} strokeWidth={2.4} /> No placeholder text
          </div>
          <div className={styles.atsRow}>
            <CheckCircle2 size={14} strokeWidth={2.4} /> ATS-safe single column
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportMock() {
  const rows = [
    { icon: FileDown, label: "resume.pdf", sub: "Pixel-perfect A4 · ready to send" },
    { icon: FileText, label: "resume.docx", sub: "Editable in Word & Google Docs" },
    { icon: ClipboardCopy, label: "Plain text copy", sub: "Clean output for ATS paste" },
    { icon: Link2, label: "Public share link", sub: "Copied to clipboard" },
  ];
  return (
    <div className={styles.mockCard}>
      <div className={styles.mockTitlebar}>
        <span className={styles.mockTraffic} />
        <span className={styles.mockTraffic} />
        <span className={styles.mockTraffic} />
        <span className={styles.mockTab}>Export</span>
      </div>
      <div className={styles.mockBody}>
        {rows.map((r) => (
          <div key={r.label} className={styles.exportRow}>
            <span className={styles.exportIcon}>
              <r.icon size={16} strokeWidth={2.2} />
            </span>
            <div className={styles.exportInfo}>
              <p className={styles.exportLabel}>{r.label}</p>
              <p className={styles.exportSub}>{r.sub}</p>
            </div>
            <span className={styles.exportDone}>
              <Check size={13} strokeWidth={3} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Bento features ---------- */

const BENTO_FEATURES = [
  {
    icon: LayoutTemplate,
    title: "9 designer templates",
    body: "From minimal to executive, every template is hand-tuned for readability and built to fit one page.",
    span: "span2",
    accent: "red",
  },
  {
    icon: Sparkles,
    title: "AI writing assistant",
    body: "Bring your own API key and let AI rewrite your summary, sharpen bullet points, and suggest skills.",
    span: "span1",
    accent: "red",
  },
  {
    icon: Target,
    title: "Job match scoring",
    body: "Paste a job description and instantly see which keywords you cover and which ones to add.",
    span: "span1",
    accent: "red",
  },
  {
    icon: FileCheck,
    title: "ATS-friendly output",
    body: "A built-in checklist and plain-text export make sure recruiters' software can read every word.",
    span: "span1",
    accent: "green",
  },
  {
    icon: FileDown,
    title: "Pixel-perfect PDF",
    body: "One click downloads a crisp, print-perfect A4 PDF rendered from your exact preview.",
    span: "span1",
    accent: "amber",
  },
  {
    icon: Mail,
    title: "Cover letters, too",
    body: "Pair every resume with a matching cover letter — sender details pull from your resume automatically.",
    span: "span2",
    accent: "red",
  },
  {
    icon: Cloud,
    title: "Cloud sync & backup",
    body: "Create a free account to sync across devices, or export a full JSON backup any time.",
    span: "span1",
    accent: "red",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Your resumes live on your device by default. AI keys are stored only in your own browser.",
    span: "span1",
    accent: "green",
  },
];

const STEPS = [
  {
    num: "01",
    icon: LayoutTemplate,
    title: "Pick a template",
    body: "Browse nine professional layouts and switch between them at any time — your content never moves.",
  },
  {
    num: "02",
    icon: PenLine,
    title: "Fill in your details",
    body: "A guided editor with drag-and-drop reordering, instant live preview, and full undo/redo.",
  },
  {
    num: "03",
    icon: FileDown,
    title: "Download your PDF",
    body: "Export a pixel-perfect A4 PDF, a Word file, or copy ATS-friendly plain text in one click.",
  },
];

const COMPARISON = [
  { feature: "Free templates", us: true, them: "3-5 only" },
  { feature: "AI writing assistant", us: true, them: "Paid only" },
  { feature: "ATS checker", us: true, them: false },
  { feature: "Job match scoring", us: true, them: false },
  { feature: "PDF export", us: true, them: "Watermark" },
  { feature: "Word export", us: true, them: "Paid only" },
  { feature: "Cover letters", us: true, them: "Paid only" },
  { feature: "No account required", us: true, them: false },
  { feature: "Cloud sync", us: true, them: true },
  { feature: "Privacy-first", us: true, them: false },
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. Templates, the editor, ATS tools, and PDF/Word export are completely free — no account and no credit card to start. Cloud sync is optional, and AI uses your own provider key.",
  },
  {
    q: "What happens to my data?",
    a: "Your resumes are stored on your device by default. Nothing is uploaded unless you create an account to sync or choose to create a public share link, which you can do at any time.",
  },
  {
    q: "How does the AI assistant work?",
    a: "You bring your own API key from OpenAI, Anthropic, Google, Groq, Mistral, OpenRouter, or any OpenAI-compatible endpoint. Keys stay in your browser and requests go directly to your provider.",
  },
  {
    q: "Will my resume pass ATS scans?",
    a: "A built-in checklist verifies standard section names, contact info, dates, and placeholder-free text, and one-click plain-text export gives you a clean, ATS-ready copy.",
  },
  {
    q: "Which file formats can I export?",
    a: "Pixel-perfect PDF, editable Word (.docx), ATS-friendly plain text, and a full JSON backup that you can re-import anytime.",
  },
  {
    q: "Can I write a cover letter too?",
    a: "Yes — cover letters share your details automatically, come with two matching designs, and export to PDF and Word just like resumes.",
  },
];

const PLATFORMS = [
  { icon: Monitor, label: "Desktop" },
  { icon: Smartphone, label: "Mobile" },
  { icon: Globe, label: "Any browser" },
];

export default function Landing() {
  return (
    <div className={styles.page}>
      {/* ---------- Nav ---------- */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>
            <FileText size={18} strokeWidth={2.4} />
          </span>
          <span className={styles.brandName}>
            Resume<span>Builder</span>
          </span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#templates">Templates</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className={styles.navActions}>
          <Link href="/builder" className={styles.navGhost}>
            Open editor
          </Link>
          <Link href="/builder" className={styles.navCta}>
            Start building
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <header className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden />
        <div className={styles.heroOrbs} aria-hidden>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Reveal>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>
                  <Sparkles size={13} strokeWidth={2.5} />
                  Free forever
                </span>
                <span className={styles.badgeSecondary}>
                  No signup required
                </span>
              </div>
              <h1 className={styles.heroTitle}>
                The resume builder
                <br />
                <span className={styles.heroAccent}>that actually works.</span>
              </h1>
              <p className={styles.heroSub}>
                Nine hand-crafted templates, AI writing assistance, ATS checks,
                and pixel-perfect PDF export — all free, no account required.
              </p>
              <div className={styles.heroActions}>
                <Link href="/builder" className={styles.primaryCta}>
                  Build my resume — free
                  <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
                <a href="#templates" className={styles.secondaryCta}>
                  Browse templates
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </a>
              </div>
              <div className={styles.heroPoints}>
                <span>
                  <Check size={14} strokeWidth={3} /> No credit card
                </span>
                <span>
                  <Check size={14} strokeWidth={3} /> No watermark
                </span>
                <span>
                  <Check size={14} strokeWidth={3} /> PDF &amp; Word export
                </span>
              </div>
              <div className={styles.platforms}>
                {PLATFORMS.map((p) => (
                  <span key={p.label} className={styles.platform}>
                    <p.icon size={14} strokeWidth={2.2} />
                    {p.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroGlow} aria-hidden />
            <Reveal delay={150}>
              <LandingPreview />
            </Reveal>
            <div className={`${styles.heroChip} ${styles.chipTop}`} aria-hidden>
              <span className={styles.chipIcon}>
                <FileCheck size={14} strokeWidth={2.4} />
              </span>
              ATS score 92/100
            </div>
            <div className={`${styles.heroChip} ${styles.chipBottom}`} aria-hidden>
              <span className={styles.chipIcon}>
                <FileDown size={14} strokeWidth={2.4} />
              </span>
              PDF downloaded
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Stats ---------- */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statNum}>
              <CountUp value={9} />
            </p>
            <p className={styles.statLabel}>Resume templates</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statNum}>
              <CountUp value={2} />
            </p>
            <p className={styles.statLabel}>Cover letter designs</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statNum}>
              <CountUp value={11} />
            </p>
            <p className={styles.statLabel}>Typefaces included</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statNum}>
              <CountUp value={1} suffix=" click" />
            </p>
            <p className={styles.statLabel}>To PDF export</p>
          </div>
        </div>
      </section>

      {/* ---------- Showcases ---------- */}
      <section className={styles.section}>
        <Reveal>
          <div className={styles.showcase}>
            <div className={styles.showcaseCopy}>
              <p className={styles.eyebrow}>AI writing assistant</p>
              <h2 className={styles.sectionTitle}>
                Let AI do the heavy lifting
              </h2>
              <p className={styles.sectionSub}>
                Rewrite your summary, sharpen every bullet so it starts with a
                strong action verb, and tailor the whole resume to the exact job
                you&apos;re applying for.
              </p>
              <ul className={styles.showcaseList}>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> Four tools: summary, headline, bullets &amp; skills
                </li>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> Paste a job description and watch the keywords align
                </li>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> Works with 6+ providers or any OpenAI-compatible API
                </li>
              </ul>
            </div>
            <div className={styles.showcaseVisual}>
              <AiMock />
            </div>
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <Reveal>
          <div className={`${styles.showcase} ${styles.showcaseReverse}`}>
            <div className={styles.showcaseVisual}>
              <MatchMock />
            </div>
            <div className={styles.showcaseCopy}>
              <p className={styles.eyebrow}>Job match & ATS</p>
              <h2 className={styles.sectionTitle}>
                Know your score before you send
              </h2>
              <p className={styles.sectionSub}>
                Paste a job description to see covered keywords, missing skills,
                and a live 100-point resume review — before a recruiter ever reads it.
              </p>
              <ul className={styles.showcaseList}>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> Covered vs. missing keyword scan
                </li>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> ATS checklist: dates, sections, placeholders
                </li>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> One-click ATS-friendly plain-text copy
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className={styles.section}>
        <Reveal>
          <div className={styles.showcase}>
            <div className={styles.showcaseCopy}>
              <p className={styles.eyebrow}>Export & share</p>
              <h2 className={styles.sectionTitle}>
                Pixel-perfect preview. Pixel-perfect download.
              </h2>
              <p className={styles.sectionSub}>
                What you see in the live preview is exactly what lands in your
                PDF. Grab a Word file, copy plain text, or send a public link.
              </p>
              <ul className={styles.showcaseList}>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> A4 PDF rendered from your real preview
                </li>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> Clean .docx for further editing in Office
                </li>
                <li className={styles.showcaseItem}>
                  <Check size={14} strokeWidth={3} /> Share links with clipboard-copy UX
                </li>
              </ul>
            </div>
            <div className={styles.showcaseVisual}>
              <ExportMock />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Bento features ---------- */}
      <section id="features" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Everything you need</p>
          <h2 className={styles.sectionTitle}>
            A complete toolkit for landing interviews
          </h2>
          <p className={styles.sectionSub}>
            Not just a template gallery — a full workflow from first draft to
            final PDF.
          </p>
        </div>
        <div className={styles.bentoGrid}>
          {BENTO_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 60}>
              <div className={`${styles.bentoCard} ${styles[`bento${f.span}`]} ${styles[`bento${f.accent}`]}`}>
                <span className={styles.bentoIcon}>
                  <f.icon size={22} strokeWidth={2} />
                </span>
                <h3 className={styles.bentoTitle}>{f.title}</h3>
                <p className={styles.bentoBody}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Templates gallery ---------- */}
      <section id="templates" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Hand-crafted layouts</p>
          <h2 className={styles.sectionTitle}>Templates recruiters love</h2>
          <p className={styles.sectionSub}>
            Every layout is tuned for one-page balance and clean ATS parsing.
            Click any template to start building with it.
          </p>
        </div>
        <div className={styles.templateGrid}>
          {TEMPLATES.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 60}>
              <Link href={`/builder?template=${t.id}`} className={styles.templateCard}>
                <GalleryPreview template={t.id} />
                <div className={styles.templateMeta}>
                  <p className={styles.templateName}>{t.name}</p>
                  <p className={styles.templateDesc}>{t.description}</p>
                </div>
                <span className={styles.templateHover}>
                  Use this template
                  <ArrowRight size={14} strokeWidth={2.5} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className={styles.templateCta}>
          <Link href="/builder" className={styles.primaryCta}>
            Try them all — it&apos;s free
            <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Three steps</p>
          <h2 className={styles.sectionTitle}>From blank page to job offer</h2>
          <p className={styles.sectionSub}>
            Ninety seconds of setup, then everything is one click away.
          </p>
        </div>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className={styles.step}>
                <span className={styles.stepNum}>{s.num}</span>
                <span className={styles.stepIcon}>
                  <s.icon size={22} strokeWidth={2} />
                </span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Comparison ---------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Why choose us</p>
          <h2 className={styles.sectionTitle}>Built different than the rest</h2>
          <p className={styles.sectionSub}>
            Most resume builders lock features behind paywalls. We don&apos;t.
          </p>
        </div>
        <div className={styles.comparisonTable}>
          <div className={styles.comparisonHeader}>
            <span className={styles.comparisonFeature}>Feature</span>
            <span className={styles.comparisonUs}>Resume Builder</span>
            <span className={styles.comparisonThem}>Others</span>
          </div>
          {COMPARISON.map((row) => (
            <div key={row.feature} className={styles.comparisonRow}>
              <span className={styles.comparisonFeature}>{row.feature}</span>
              <span className={styles.comparisonUs}>
                {row.us === true ? (
                  <Check size={16} strokeWidth={3} className={styles.checkGreen} />
                ) : (
                  row.us
                )}
              </span>
              <span className={styles.comparisonThem}>
                {row.them === true ? (
                  <Check size={16} strokeWidth={3} />
                ) : row.them === false ? (
                  <span className={styles.cross}>—</span>
                ) : (
                  row.them
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Questions</p>
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
        </div>
        <div className={styles.faq}>
          {FAQS.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqSummary}>
                {f.q}
                <Zap size={15} strokeWidth={2.4} />
              </summary>
              <p className={styles.faqBody}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBanner}>
          <div className={styles.ctaOrbs} aria-hidden>
            <div className={styles.ctaOrb1} />
            <div className={styles.ctaOrb2} />
          </div>
          <Reveal>
            <h2 className={styles.ctaTitle}>
              Your next role is one great resume away.
            </h2>
            <p className={styles.ctaSub}>
              Start free. No account, no credit card, no watermark.
            </p>
            <Link href="/builder" className={styles.ctaBtn}>
              Build my resume now
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <span className={styles.brandMark}>
              <FileText size={16} strokeWidth={2.4} />
            </span>
            <span className={styles.brandName}>
              Resume<span>Builder</span>
            </span>
            <p className={styles.footerNote}>
              A privacy-first resume builder. Your documents stay on your device
              unless you choose to sync them.
            </p>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerHead}>Product</p>
            <Link href="/builder">Start building</Link>
            <a href="#templates">Templates</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerHead}>Tools</p>
            <Link href="/builder">Resume builder</Link>
            <Link href="/builder">Cover letter builder</Link>
            <Link href="/builder">ATS checker</Link>
            <Link href="/builder">AI writing assistant</Link>
          </div>
          <div className={styles.footerCta}>
            <p className={styles.footerCtaTitle}>Ready when you are.</p>
            <Link href="/builder" className={styles.footerCtaBtn}>
              Create your resume
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Resume Builder</span>
          <span className={styles.footerMuted}>
            Free forever · No watermark · Built for getting hired
          </span>
        </div>
      </footer>
    </div>
  );
}
