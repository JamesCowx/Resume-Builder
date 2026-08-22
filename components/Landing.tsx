import Link from "next/link";
import {
  ArrowRight,
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
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Zap,
  Users,
  TrendingUp,
  Clock,
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
const GALLERY_SCALE = 0.24;

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

/* ---------- Feature showcases (product-style mocks) ---------- */

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
    { icon: FileDown, label: "resume.pdf", sub: "Pixel-perfect A4 · ready to send", pct: 100, done: true },
    { icon: FileText, label: "resume.docx", sub: "Editable in Word & Google Docs", pct: 100, done: true },
    { icon: ClipboardCopy, label: "Plain text copy", sub: "Clean output for ATS paste", pct: 100, done: true },
    { icon: Link2, label: "Public share link", sub: "Copied to clipboard", pct: 100, done: true },
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

/* ---------- Content data ---------- */

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: "9 designer templates",
    body: "From minimal to executive, every template is hand-tuned for readability and built to fit one page.",
  },
  {
    icon: Sparkles,
    title: "AI writing assistant",
    body: "Bring your own API key and let AI rewrite your summary, sharpen bullet points, and suggest skills.",
  },
  {
    icon: FileCheck,
    title: "ATS-friendly output",
    body: "A built-in checklist and plain-text export make sure recruiters' software can read every word.",
  },
  {
    icon: Target,
    title: "Job match scoring",
    body: "Paste a job description and instantly see which keywords you cover and which ones to add.",
  },
  {
    icon: Mail,
    title: "Cover letters, too",
    body: "Pair every resume with a matching cover letter — sender details pull from your resume automatically.",
  },
  {
    icon: Cloud,
    title: "Cloud sync & backup",
    body: "Create a free account to sync across devices, or export a full JSON backup any time.",
  },
  {
    icon: FileDown,
    title: "Pixel-perfect PDF",
    body: "One click downloads a crisp, print-perfect A4 PDF rendered from your exact preview.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Your resumes live on your device by default. AI keys are stored only in your own browser.",
  },
];

const STEPS = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    body: "Browse nine professional layouts and switch between them at any time — your content never moves.",
  },
  {
    icon: PenLine,
    title: "Fill in your details",
    body: "A guided editor with drag-and-drop reordering, instant live preview, and full undo/redo.",
  },
  {
    icon: FileDown,
    title: "Download your PDF",
    body: "Export a pixel-perfect A4 PDF, a Word file, or copy ATS-friendly plain text in one click.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I went from weeks of silence to two interviews in the first week after switching. The ATS checklist caught placeholders I'd been missing for years.",
    name: "Dana K.",
    role: "Product Manager",
    initials: "DK",
  },
  {
    quote:
      "The AI bullet rewrites are shockingly good. Paste a job description, hit 'tailor', and done — every bullet starts with a strong verb.",
    name: "Marcus T.",
    role: "Software Engineer",
    initials: "MT",
  },
  {
    quote:
      "Resume, cover letter, and PDF — start to finish in under an hour. And the templates genuinely fit one page, which nothing else managed.",
    name: "Priya S.",
    role: "Marketing Lead",
    initials: "PS",
  },
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

const STATS = [
  { value: 9, suffix: "", label: "Resume templates", icon: LayoutTemplate },
  { value: 2, suffix: "", label: "Cover letter designs", icon: Mail },
  { value: 11, suffix: "", label: "Typefaces included", icon: FileText },
  { value: 1, suffix: "", label: "Click to PDF", icon: Zap },
];

const METRICS = [
  { value: "2 min", label: "Average build time", icon: Clock },
  { value: "3x", label: "More interviews", icon: TrendingUp },
  { value: "50k+", label: "Resumes created", icon: Users },
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
              <span className={styles.badge}>
                <Sparkles size={13} strokeWidth={2.5} />
                Free forever · No signup to start
              </span>
              <h1 className={styles.heroTitle}>
                Build a resume that
                <span className={styles.heroAccent}> gets you hired.</span>
              </h1>
              <p className={styles.heroSub}>
                Nine hand-crafted templates, AI writing assistance, ATS checks,
                and pixel-perfect PDF export — all free, no account required.
              </p>
              <div className={styles.heroActions}>
                <Link href="/builder" className={styles.primaryCta}>
                  Build my resume — free
                  <ArrowRight size={17} strokeWidth={2.5} />
                </Link>
                <a href="#templates" className={styles.secondaryCta}>
                  Browse templates
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
            </Reveal>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroGlow} aria-hidden />
            <Reveal delay={120}>
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

        <div className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statIcon}>
                <s.icon size={16} strokeWidth={2.2} />
              </span>
              <p className={styles.statNum}>
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ---------- Metrics bar ---------- */}
      <section className={styles.metricsBar}>
        {METRICS.map((m) => (
          <div key={m.label} className={styles.metric}>
            <span className={styles.metricIcon}>
              <m.icon size={18} strokeWidth={2.2} />
            </span>
            <div>
              <p className={styles.metricValue}>{m.value}</p>
              <p className={styles.metricLabel}>{m.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- Showcases (product-style splits) ---------- */}
      <section className={styles.section}>
        <Reveal>
          <div className={styles.showcase}>
            <div className={styles.showcaseCopy}>
              <p className={styles.eyebrow}>AI writing assistant</p>
              <h2 className={styles.sectionTitle}>
                Let AI do the heavy lifting — then make it yours
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
                  <Check size={14} strokeWidth={3} /> BYOK — works with 6+ providers or any OpenAI-compatible API
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
          <div className={`${styles.showcase} ${styles.showcaseAlt}`}>
            <div className={styles.showcaseVisual}>
              <MatchMock />
            </div>
            <div className={styles.showcaseCopy}>
              <p className={styles.eyebrow}>Job match & ATS</p>
              <h2 className={styles.sectionTitle}>
                Know your match score before you hit send
              </h2>
              <p className={styles.sectionSub}>
                Paste a job description to see covered keywords, the skills on
                the list you&apos;re missing, and a live 100-point resume review —
                before a recruiter ever reads it.
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
                Preview is pixel-perfect. So is the download.
              </h2>
              <p className={styles.sectionSub}>
                What you see in the live preview is exactly what lands in your
                PDF. Grab a Word file, copy plain text, or send a public link
                that renders the resume for anyone.
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

      {/* ---------- Features grid ---------- */}
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
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 70}>
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>
                  <f.icon size={20} strokeWidth={2.2} />
                </span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
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
            <Reveal key={t.id} delay={(i % 3) * 70}>
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
            <Reveal key={s.title} delay={i * 90}>
              <div className={styles.step}>
                <span className={styles.stepNum}>0{i + 1}</span>
                <span className={styles.featureIcon}>
                  <s.icon size={20} strokeWidth={2.2} />
                </span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Loved by job seekers</p>
          <h2 className={styles.sectionTitle}>People who landed the interview</h2>
        </div>
        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className={styles.testimonial}>
                <span className={styles.testiQuote}>
                  <Quote size={20} strokeWidth={2.2} />
                </span>
                <div className={styles.testiStars} aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} strokeWidth={2.4} fill="currentColor" />
                  ))}
                </div>
                <blockquote className={styles.testiQuoteText}>{t.quote}</blockquote>
                <figcaption className={styles.testiAuthor}>
                  <span className={styles.testiAvatar}>{t.initials}</span>
                  <span>
                    <span className={styles.testiName}>{t.name}</span>
                    <span className={styles.testiRole}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
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
      <section className={styles.ctaBanner}>
        <Reveal>
          <h2 className={styles.ctaTitle}>
            Your next role is one great resume away.
          </h2>
          <p className={styles.ctaSub}>
            Start free. No account, no credit card, no watermark.
          </p>
          <Link href="/builder" className={styles.primaryCta}>
            Build my resume now
            <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
        </Reveal>
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
