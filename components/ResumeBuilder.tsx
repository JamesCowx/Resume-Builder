"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  emptyResume,
  emptyCoverLetter,
  newId,
  sampleResume,
  sampleCoverLetter,
  coverLetterFromResume,
  SAMPLE_PROFILES,
} from "@/lib/types";
import type { CoverLetterData, ResumeData } from "@/lib/types";
import { ResumeDocument } from "./Templates";
import type { TemplateId } from "./Templates";
import { CoverLetterDocument, COVER_TEMPLATES } from "./CoverLetterDocument";
import type { CoverTemplateId } from "./CoverLetterDocument";
import TemplatePicker from "./TemplatePicker";
import ResumeForm from "./ResumeForm";
import CoverLetterForm from "./CoverLetterForm";
import JDAnalyzer from "./JDAnalyzer";
import ATSChecklist from "./ATSChecklist";
import AISettingsModal from "./AISettingsModal";
import AuthModal from "./AuthModal";
import OnboardingModal from "./OnboardingModal";
import type { OnboardingChoice } from "./OnboardingModal";
import { reviewResume } from "@/lib/review";
import { copyCoverAsText, copyResumeAsText } from "@/lib/ats";
import { DEFAULT_AI, loadAISettings, runAI, saveAISettings } from "@/lib/ai";
import type { AIAction, AISettings } from "@/lib/ai";
import {
  deleteCloudDoc,
  fetchCloudDocs,
  fetchMe,
  logout,
  pushCloudDoc,
  type AuthUser,
} from "@/lib/sync";
import styles from "./builder.module.css";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  Cloud,
  Copy,
  Database,
  Download,
  Eraser,
  FileDown,
  FolderInput,
  LogOut,
  Mail,
  Minus,
  Moon,
  Pencil,
  Plus,
  Redo2,
  RotateCcw,
  Sun,
  Share2,
  Trash2,
  Undo2,
} from "lucide-react";

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;

const ACCENTS = [
  { name: "Navy", value: "#1d4ed8" },
  { name: "Sky", value: "#0284c7" },
  { name: "Teal", value: "#0d9488" },
  { name: "Forest", value: "#15803d" },
  { name: "Crimson", value: "#be123c" },
  { name: "Burgundy", value: "#9f1239" },
  { name: "Midnight", value: "#0f172a" },
];

const FONTS = [
  { name: "Default (Helvetica)", value: "" },
  { name: "Inter", value: "var(--font-inter)" },
  { name: "Source Sans 3", value: "var(--font-source)" },
  { name: "Open Sans", value: "var(--font-opensans)" },
  { name: "Roboto", value: "var(--font-roboto)" },
  { name: "Poppins", value: "var(--font-poppins)" },
  { name: "Montserrat", value: "var(--font-montserrat)" },
  { name: "Space Grotesk", value: "var(--font-spacegrotesk)" },
  { name: "Lora", value: "var(--font-lora)" },
  { name: "Merriweather", value: "var(--font-merriweather)" },
  { name: "Libre Baskerville", value: "var(--font-librebaskerville)" },
  { name: "Playfair Display", value: "var(--font-playfair)" },
];

const TEMPLATE_IDS = new Set([
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

const COVER_TEMPLATE_IDS = new Set(["cover-classic", "cover-clean"]);

type ListField = "experience" | "education" | "projects" | "certificates";

const LIST_DEFAULTS: Record<ListField, string[]> = {
  experience: ["role", "company", "location", "start", "end", "bullets"],
  education: ["school", "degree", "location", "start", "end", "details"],
  projects: ["name", "url", "description"],
  certificates: ["name", "issuer", "year"],
};

type StoredDoc = {
  id: string;
  name: string;
  kind: "resume" | "cover";
  data: ResumeData;
  cover: CoverLetterData;
  template: TemplateId;
  coverTemplate: CoverTemplateId;
  accent: string;
  font: string;
  updatedAt: number;
};

type HistoryEntry = {
  data: ResumeData;
  cover: CoverLetterData;
  template: TemplateId;
  coverTemplate: CoverTemplateId;
  accent: string;
  font: string;
};

const makeDoc = (
  data: ResumeData,
  name = "My Resume",
  extra?: Partial<StoredDoc>
): StoredDoc => ({
  id: newId(),
  name,
  kind: "resume",
  data,
  cover: emptyCoverLetter(),
  template: "modern",
  coverTemplate: "cover-classic",
  accent: ACCENTS[0].value,
  font: "",
  updatedAt: Date.now(),
  ...extra,
});

const makeCoverDoc = (
  cover: CoverLetterData,
  name = "Cover Letter",
  extra?: Partial<StoredDoc>
): StoredDoc => ({
  id: newId(),
  name,
  kind: "cover",
  data: emptyResume(),
  cover,
  template: "modern",
  coverTemplate: "cover-classic",
  accent: ACCENTS[0].value,
  font: "",
  updatedAt: Date.now(),
  ...extra,
});

// Deterministic placeholder used during SSR/first client render so the server
// and client produce identical HTML (avoids hydration mismatches). Real docs
// are loaded in a mount effect.
const PLACEHOLDER_DOC: StoredDoc = {
  id: "placeholder",
  name: "My Resume",
  kind: "resume",
  data: emptyResume(),
  cover: emptyCoverLetter(),
  template: "modern",
  coverTemplate: "cover-classic",
  accent: ACCENTS[0].value,
  font: "",
  updatedAt: 0,
};

const ensureDocs = (): StoredDoc[] => {
  try {
    const raw = window.localStorage.getItem("resume-builder:docs");
    if (raw) {
      const list = JSON.parse(raw) as StoredDoc[];
      if (Array.isArray(list) && list.length) {
        const valid = list.map(normalizeDoc).filter(Boolean) as StoredDoc[];
        if (valid.length) return valid;
      }
    }
  } catch {
    // ignore
  }
  try {
    const dataRaw = window.localStorage.getItem("resume-builder:data");
    if (dataRaw) {
      const settings = JSON.parse(
        window.localStorage.getItem("resume-builder:settings") || "{}"
      );
      window.localStorage.removeItem("resume-builder:data");
      window.localStorage.removeItem("resume-builder:settings");
      const doc = makeDoc(JSON.parse(dataRaw), "My Resume", settings);
      window.localStorage.setItem("resume-builder:docs", JSON.stringify([doc]));
      return [doc];
    }
  } catch {
    // ignore
  }
  return [makeDoc(sampleResume())];
};

const isTemplate = (v: unknown): v is TemplateId =>
  typeof v === "string" && TEMPLATE_IDS.has(v);

const isCoverTemplate = (v: unknown): v is CoverTemplateId =>
  typeof v === "string" && COVER_TEMPLATE_IDS.has(v);

const sanitizeData = (raw: unknown): ResumeData => {
  const base = emptyResume();
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const p =
    obj.personal && typeof obj.personal === "object"
      ? (obj.personal as Record<string, unknown>)
      : {};
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    personal: {
      ...base.personal,
      fullName: str(p.fullName),
      headline: str(p.headline),
      email: str(p.email),
      phone: str(p.phone),
      location: str(p.location),
      website: str(p.website),
      summary: str(p.summary),
      photo: str(p.photo),
    },
    experience: Array.isArray(obj.experience) ? (obj.experience as ResumeData["experience"]) : [],
    education: Array.isArray(obj.education) ? (obj.education as ResumeData["education"]) : [],
    projects: Array.isArray(obj.projects) ? (obj.projects as ResumeData["projects"]) : [],
    certificates: Array.isArray(obj.certificates) ? (obj.certificates as ResumeData["certificates"]) : [],
    skills: Array.isArray(obj.skills) ? obj.skills.map(String) : [],
  };
};

const sanitizeCover = (raw: unknown): CoverLetterData => {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    recipientName: str(obj.recipientName),
    company: str(obj.company),
    position: str(obj.position),
    date: str(obj.date),
    senderName: str(obj.senderName),
    senderEmail: str(obj.senderEmail),
    senderPhone: str(obj.senderPhone),
    senderLocation: str(obj.senderLocation),
    opening: str(obj.opening),
    body: str(obj.body),
    closing: str(obj.closing),
  };
};

const normalizeDoc = (raw: unknown): StoredDoc | null => {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.id !== "string") return null;
  const kind = d.kind === "cover" ? "cover" : "resume";
  return {
    id: d.id,
    name: typeof d.name === "string" && d.name ? d.name : "Imported resume",
    kind,
    data: sanitizeData(d.data),
    cover: sanitizeCover(d.cover ?? (kind === "cover" ? sampleCoverLetter() : undefined)),
    template: isTemplate(d.template) ? d.template : "modern",
    coverTemplate: isCoverTemplate(d.coverTemplate)
      ? d.coverTemplate
      : "cover-classic",
    accent: typeof d.accent === "string" ? d.accent : ACCENTS[0].value,
    font: typeof d.font === "string" ? d.font : "",
    updatedAt: typeof d.updatedAt === "number" ? d.updatedAt : Date.now(),
  };
};

const sanitizeDoc = normalizeDoc;

const timeAgo = (ms: number): string => {
  const secs = Math.max(0, Math.round(ms / 1000));
  if (secs < 3) return "Saved just now";
  if (secs < 60) return `Saved ${secs}s ago`;
  const mins = Math.round(secs / 60);
  return `Saved ${mins}m ago`;
};

const readActiveId = (docs: StoredDoc[]): string => {
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem("resume-builder:active");
  } catch {
    // ignore
  }
  return saved && docs.some((d) => d.id === saved) ? saved : docs[0].id;
};

export default function ResumeBuilder({
  initialTemplate,
}: {
  initialTemplate?: TemplateId;
}) {
  const [docs, setDocs] = useState<StoredDoc[]>([PLACEHOLDER_DOC]);
  const [activeId, setActiveId] = useState<string>("placeholder");

  const active = docs.find((d) => d.id === activeId) ?? docs[0] ?? PLACEHOLDER_DOC;
  const isCover = active.kind === "cover";

  const [fit, setFit] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [showReview, setShowReview] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);

  const [jd, setJd] = useState("");
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_AI);
  const [showAI, setShowAI] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [now, setNow] = useState(0);
  const [sampleSel, setSampleSel] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced" | "offline">("idle");
  const [hydrated, setHydrated] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const scaledRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HistoryEntry[]>([]);
  const futureRef = useRef<HistoryEntry[]>([]);
  const toastTimer = useRef<number | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const syncTimer = useRef<number | null>(null);

  const data = active.data;
  const cover = active.cover;
  const template = active.template;
  const coverTemplate = active.coverTemplate;
  const accent = active.accent;
  const font = active.font;

  const review = useMemo(() => reviewResume(data), [data]);
  const scale = fit * zoom;
  const aiConfigured = Boolean(aiSettings.apiKey && aiSettings.model);

  const showToast = (msg: string, error = false) => {
    setToast({ msg, error });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  };

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem("resume-builder:theme", next);
        document.documentElement.setAttribute("data-theme", next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const updateActive = (patch: Partial<StoredDoc>) =>
    setDocs((prev) =>
      prev.map((d) =>
        d.id === activeId ? { ...d, ...patch, updatedAt: Date.now() } : d
      )
    );

  const snapshot = (): HistoryEntry => ({
    data: active.data,
    cover: active.cover,
    template: active.template,
    coverTemplate: active.coverTemplate,
    accent: active.accent,
    font: active.font,
  });

  const applyEntry = (entry: HistoryEntry) =>
    updateActive({
      data: entry.data,
      cover: entry.cover,
      template: entry.template,
      coverTemplate: entry.coverTemplate,
      accent: entry.accent,
      font: entry.font,
    });

  const pushHistory = () => {
    historyRef.current.push(snapshot());
    if (historyRef.current.length > 50) historyRef.current.shift();
  };

  const commit = (updater: (prev: ResumeData) => ResumeData) => {
    pushHistory();
    futureRef.current = [];
    updateActive({ data: updater(active.data) });
    setCanUndo(true);
    setCanRedo(false);
  };

  const commitCover = (patch: Partial<CoverLetterData>) => {
    pushHistory();
    futureRef.current = [];
    updateActive({ cover: { ...active.cover, ...patch } });
    setCanUndo(true);
    setCanRedo(false);
  };

  const commitStyle = (patch: Partial<StoredDoc>) => {
    pushHistory();
    futureRef.current = [];
    updateActive(patch);
    setCanUndo(true);
    setCanRedo(false);
  };

  const pullFromResume = () => {
    const firstResume = docs.find((d) => d.kind === "resume");
    if (!firstResume) {
      showToast("Create a resume first to pull your details from it.", true);
      return;
    }
    const p = firstResume.data.personal;
    commitCover({
      senderName: p.fullName || cover.senderName,
      senderEmail: p.email || cover.senderEmail,
      senderPhone: p.phone || cover.senderPhone,
      senderLocation: p.location || cover.senderLocation,
    });
    showToast("Pulled your details from the resume");
  };

  const undo = () => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    futureRef.current.push(snapshot());
    applyEntry(prev);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(true);
  };

  const redo = () => {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push(snapshot());
    applyEntry(next);
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  };

  const clearHistory = () => {
    historyRef.current = [];
    futureRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
  };

  const activate = (doc: StoredDoc) => {
    setActiveId(doc.id);
    clearHistory();
    try {
      window.localStorage.setItem("resume-builder:active", doc.id);
    } catch {
      // ignore
    }
  };

  const switchDoc = (id: string) => {
    const target = docs.find((d) => d.id === id);
    if (target) activate(target);
  };

  const newDoc = () => {
    const doc = makeDoc(emptyResume(), `Resume ${docs.filter((d) => d.kind === "resume").length + 1}`);
    setDocs((prev) => [...prev, doc]);
    activate(doc);
  };

  const newCoverDoc = () => {
    const firstResume = docs.find((d) => d.kind === "resume");
    const coverData = firstResume
      ? coverLetterFromResume(firstResume.data)
      : sampleCoverLetter();
    const doc = makeCoverDoc(
      coverData,
      `Cover Letter ${docs.filter((d) => d.kind === "cover").length + 1}`
    );
    setDocs((prev) => [...prev, doc]);
    activate(doc);
    showToast("Cover letter created — sender details pulled from your resume");
  };

  const duplicateDoc = () => {
    const copy: StoredDoc = {
      ...active,
      id: newId(),
      name: `${active.name} (copy)`,
      updatedAt: Date.now(),
    };
    setDocs((prev) => [...prev, copy]);
    activate(copy);
  };

  const renameDoc = () => {
    const name = window.prompt("Rename this document:", active.name);
    if (name && name.trim()) updateActive({ name: name.trim() });
  };

  const deleteDoc = () => {
    if (docs.length <= 1) {
      showToast("You need at least one document.", true);
      return;
    }
    if (!window.confirm(`Delete "${active.name}"?`)) return;
    const remaining = docs.filter((d) => d.id !== activeId);
    setDocs(remaining);
    activate(remaining[0]);
    if (user) deleteCloudDoc(activeId).catch(() => {});
  };

  const handleBackup = () => {
    try {
      const blob = new Blob(
        [JSON.stringify({ app: "resume-builder", exportedAt: new Date().toISOString(), docs })],
        { type: "application/json" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resumes-backup.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Backup downloaded");
    } catch {
      showToast("Backup failed", true);
    }
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const name = file.name.toLowerCase();

    // JSON backup import
    if (name.endsWith(".json")) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const raw = Array.isArray(json) ? json : Array.isArray(json.docs) ? json.docs : null;
        if (!raw) throw new Error("Invalid format");
        const valid = raw.map(sanitizeDoc).filter(Boolean) as StoredDoc[];
        if (!valid.length) throw new Error("No valid resumes in file");
        setDocs((prev) => {
          const ids = new Set(prev.map((d) => d.id));
          const merged = [...prev];
          for (const d of valid) {
            if (ids.has(d.id)) continue;
            ids.add(d.id);
            merged.push(d);
          }
          return merged;
        });
        showToast(`Imported ${valid.length} resume(s)`);
      } catch {
        showToast("Import failed — not a valid backup file", true);
      }
      return;
    }

    // PDF/DOCX/TXT import
    if (name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".txt")) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/import", { method: "POST", body: formData });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Import failed");

        const parsed = json.parsed;
        if (parsed) {
          commit((d) => ({
            ...d,
            personal: {
              ...d.personal,
              fullName: parsed.name || d.personal.fullName,
              email: parsed.email || d.personal.email,
              phone: parsed.phone || d.personal.phone,
              summary: parsed.summary || d.personal.summary,
            },
            skills: parsed.skills
              ? parsed.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
              : d.skills,
          }));
          showToast("Resume imported — review and edit the extracted content");
        } else {
          showToast("Could not parse resume structure — text pasted as summary");
          commit((d) => ({
            ...d,
            personal: { ...d.personal, summary: json.text?.slice(0, 500) || "" },
          }));
        }
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Import failed", true);
      }
      return;
    }

    showToast("Unsupported file type — use JSON, PDF, DOCX, or TXT", true);
  };

  // Hydrate from localStorage after mount (client-only) — keeps the initial
  // SSR/first-render HTML deterministic to avoid hydration mismatches.
  // This is the canonical "hydrate external browser state" pattern, so the
  // set-state-in-effect rule is intentionally disabled here.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNow(Date.now());
    setAiSettings(loadAISettings());
    setTheme(
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light"
    );
    const loaded = ensureDocs();
    let finalDocs = loaded;
    if (initialTemplate) {
      const activeId0 = readActiveId(loaded);
      finalDocs = loaded.map((d) =>
        d.id === activeId0 && d.template !== initialTemplate
          ? { ...d, template: initialTemplate, updatedAt: Date.now() }
          : d
      );
      try {
        window.localStorage.setItem("resume-builder:docs", JSON.stringify(finalDocs));
      } catch {
        // ignore
      }
    }
    setDocs(finalDocs);
    setActiveId(readActiveId(finalDocs));
    const everSaved =
      Boolean(window.localStorage.getItem("resume-builder:docs")) ||
      Boolean(window.localStorage.getItem("resume-builder:data"));
    if (!everSaved && !window.localStorage.getItem("resume-builder:onboarded")) {
      setShowOnboarding(true);
    }
    setHydrated(true);
  }, [initialTemplate]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const markOnboarded = () => {
    setShowOnboarding(false);
    try {
      window.localStorage.setItem("resume-builder:onboarded", "1");
    } catch {
      // ignore
    }
  };

  const handleOnboardingChoose = (choice: OnboardingChoice) => {
    if (choice === "blank") {
      commit(() => emptyResume());
      updateActive({ name: "My Resume" });
      showToast("Started a blank resume — type your details below");
      markOnboarded();
    } else if (choice === "sample") {
      showToast("Sample resume loaded — edit anything, or pick a template");
      markOnboarded();
    } else {
      importRef.current?.click();
      // Don't mark as onboarded yet — let the file input onChange handle it
      // If user cancels, they'll see onboarding again on next visit
    }
  };

  // Auth + cloud sync
  useEffect(() => {
    fetchMe().then((u) => setUser(u)).catch(() => setUser(null));
  }, []);

  const handleAuthed = async (u: AuthUser) => {
    setUser(u);
    setShowAuth(false);
    setSyncState("syncing");
    try {
      const cloud = await fetchCloudDocs();
      const cloudById = new Map(cloud.map((c) => [c.id, c]));
      setDocs((prev) => {
        const localById = new Map(prev.map((d) => [d.id, d]));
        const merged = new Map(localById);
        for (const [id, c] of cloudById) {
          const local = localById.get(id);
          if (!local || (c.updatedAt ?? 0) > local.updatedAt) {
            const normalized = normalizeDoc(c);
            if (normalized) merged.set(id, normalized);
          }
        }
        return [...merged.values()];
      });
      showToast(`Signed in as ${u.email}. Resumes synced.`);
      setSyncState("synced");
    } catch {
      setSyncState("idle");
      showToast("Signed in, but sync failed. Will retry.", true);
    }
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    setUser(null);
    showToast("Signed out. Resumes remain saved on this device.");
  };

  // Debounced push to cloud
  useEffect(() => {
    if (!user || !hydrated) return;
    if (syncTimer.current) window.clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(async () => {
      setSyncState("syncing");
      try {
        for (const d of docs) {
          await pushCloudDoc(d);
        }
        setSyncState("synced");
      } catch {
        setSyncState("offline");
      }
    }, 900);
    return () => {
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
    };
  }, [docs, user, hydrated]);

  // Persist docs to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem("resume-builder:docs", JSON.stringify(docs));
    } catch {
      // ignore
    }
  }, [docs, hydrated]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 8000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () =>
      setFit(Math.min(1, (el.clientWidth - 40) / SHEET_WIDTH));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = scaledRef.current;
    if (!el) return;
    setOverflow(el.scrollHeight > SHEET_HEIGHT + 1);
  }, [data, cover, template, coverTemplate, font]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, cover, accent, font, template, coverTemplate, isCover]);

  const updatePersonal = (field: keyof ResumeData["personal"], value: string) =>
    commit((d) => ({ ...d, personal: { ...d.personal, [field]: value } }));

  const updateSkills = (value: string) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    commit((d) => ({ ...d, skills }));
  };

  const addItem = (field: ListField) =>
    commit((d) => {
      const item: Record<string, string> = { id: newId() };
      for (const k of LIST_DEFAULTS[field]) item[k] = "";
      return {
        ...d,
        [field]: [...(d[field] as object[]), item],
      } as ResumeData;
    });

  const removeItem = (field: ListField, id: string) =>
    commit((d) => ({
      ...d,
      [field]: (d[field] as { id: string }[]).filter((i) => i.id !== id),
    }));

  const moveItem = (field: ListField, id: string, dir: -1 | 1) =>
    commit((d) => {
      const arr = d[field] as { id: string }[];
      const i = arr.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return d;
      const copy = [...arr];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return { ...d, [field]: copy } as ResumeData;
    });

  const reorderItem = (field: ListField, fromId: string, toId: string) =>
    commit((d) => {
      const arr = d[field] as { id: string }[];
      const from = arr.findIndex((x) => x.id === fromId);
      const to = arr.findIndex((x) => x.id === toId);
      if (from < 0 || to < 0 || from === to) return d;
      const copy = [...arr];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return { ...d, [field]: copy } as ResumeData;
    });

  const updateItem = (
    field: ListField,
    id: string,
    key: string,
    value: string
  ) =>
    commit((d) => ({
      ...d,
      [field]: (d[field] as Record<string, string>[]).map((i) =>
        i.id === id ? { ...i, [key]: value } : i
      ),
    }));

  const addSkills = (skills: string[]) =>
    commit((d) => {
      const existing = new Set(d.skills.map((s) => s.toLowerCase()));
      const merged = [...d.skills];
      for (const s of skills) {
        if (!existing.has(s.toLowerCase())) merged.push(s);
      }
      return { ...d, skills: merged };
    });

  const clearAll = () => {
    if (window.confirm("Clear all content? This cannot be undone.")) {
      if (isCover) commitCover(emptyCoverLetter());
      else commit(() => emptyResume());
    }
  };

  const handleRequestBody = () => ({
    kind: isCover ? "cover" : "resume",
    data: isCover ? cover : data,
    template: isCover ? coverTemplate : template,
    accent,
    font,
    name: isCover
      ? cover.senderName || active.name || "cover-letter"
      : data.personal.fullName || active.name || "resume",
  });

  const handleDownloadPDF = async () => {
    setPdfBusy(true);
    const baseName = isCover
      ? cover.senderName || active.name || "cover-letter"
      : data.personal.fullName || active.name || "resume";
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(handleRequestBody()),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "PDF generation failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("PDF downloaded");
    } catch (e) {
      // Fallback: open print page in new window for browser print-to-PDF
      try {
        const printRes = await fetch("/api/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(handleRequestBody()),
        });
        if (printRes.ok) {
          const { id } = await printRes.json();
          window.open(`/s/${id}`, "_blank");
          showToast("Opened in new tab — use Ctrl+P to save as PDF");
        } else {
          showToast(e instanceof Error ? e.message : "Could not generate the PDF.", true);
        }
      } catch {
        showToast(e instanceof Error ? e.message : "Could not generate the PDF.", true);
      }
    } finally {
      setPdfBusy(false);
    }
  };

  const handleShare = async () => {
    setShareBusy(true);
    const baseName = isCover
      ? cover.senderName || active.name || "cover-letter"
      : data.personal.fullName || active.name || "resume";
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(handleRequestBody()),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not create a share link.");
      const url = `${window.location.origin}${json.url}`;
      try {
        await navigator.clipboard.writeText(url);
        showToast(`Share link copied — anyone with it can view "${baseName}"`);
      } catch {
        window.prompt("Your public share link:", url);
        showToast("Share link created");
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not create a share link.", true);
    } finally {
      setShareBusy(false);
    }
  };

  const handleCopyText = async () => {
    const ok = isCover ? await copyCoverAsText(cover) : await copyResumeAsText(data);
    showToast(
      ok
        ? "Copied as ATS-friendly plain text"
        : "Copy failed — please copy manually",
      !ok
    );
  };

  const handleExportWord = async () => {
    const base = isCover
      ? cover.senderName || active.name || "cover-letter"
      : data.personal.fullName || active.name || "resume";
    const name =
      base.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") ||
      (isCover ? "cover-letter" : "resume");
    try {
      if (isCover) {
        const { downloadCoverDocx } = await import("@/lib/docx");
        await downloadCoverDocx(cover, name);
      } else {
        const { downloadDocx } = await import("@/lib/docx");
        await downloadDocx(data, name);
      }
      showToast("Word (.docx) file downloaded");
    } catch {
      showToast("Could not generate the Word file.", true);
    }
  };

  const assist = async (action: AIAction, id?: string) => {
    if (!aiConfigured) {
      setShowAI(true);
      return;
    }
    const busyKey = id ? `${action}:${id}` : action;
    setAiBusy(busyKey);
    try {
      let text = "";
      if (action === "summary") {
        text = await runAI(aiSettings, "summary", {
          text: data.personal.summary,
          jobDescription: jd || undefined,
        });
      } else if (action === "headline") {
        text = await runAI(aiSettings, "headline", {
          text: data.personal.headline,
          jobDescription: jd || undefined,
        });
      } else if (action === "bullets" && id) {
        const job = data.experience.find((x) => x.id === id);
        if (job)
          text = await runAI(aiSettings, "bullets", {
            text: job.bullets,
            jobDescription: jd || undefined,
          });
      } else if (action === "skills") {
        text = await runAI(aiSettings, "skills", {
          text: data.skills.join(", "),
          jobDescription: jd || undefined,
        });
      }
      if (text) {
        if (action === "summary") updatePersonal("summary", text);
        else if (action === "headline") updatePersonal("headline", text);
        else if (action === "bullets" && id)
          updateItem("experience", id, "bullets", text);
        else if (action === "skills")
          addSkills(
            text
              .split(/[,\n]/)
              .map((s) => s.trim())
              .filter(Boolean)
          );
        showToast("AI update applied");
      } else {
        showToast("AI returned an empty response — try again", true);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI request failed";
      showToast(msg, true);
    } finally {
      setAiBusy(null);
    }
  };

  const tailorForJob = async () => {
    if (!aiConfigured) {
      setShowAI(true);
      return;
    }
    setAiBusy("tailor");
    try {
      const text = await runAI(aiSettings, "summary", {
        text: data.personal.summary,
        jobDescription: jd || undefined,
      });
      if (text) {
        updatePersonal("summary", text);
        showToast("Summary tailored to the job description");
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "AI request failed", true);
    } finally {
      setAiBusy(null);
    }
  };

  const handleSaveAI = (s: AISettings) => {
    setAiSettings(s);
    saveAISettings(s);
    setShowAI(false);
    showToast("AI settings saved");
  };

  const sheetStyle = { "--accent": accent } as React.CSSProperties;
  const scoreClass =
    review.score >= 80
      ? styles.scoreHigh
      : review.score >= 50
        ? styles.scoreMid
        : styles.scoreLow;
  const issueCount = review.issues.filter((i) => i.severity !== "good").length;

  const syncLabel =
    !user
      ? "Sign in to save"
      : syncState === "syncing"
        ? "Syncing…"
        : syncState === "synced"
          ? "Cloud synced"
          : syncState === "offline"
            ? "Sync offline"
            : "Signed in";

  return (
    <>
      <div className={`${styles.app} app-shell`}>
        <header className={styles.toolbar}>
          <div className={styles.toolbarRow}>
            <Link href="/" className={styles.brand} title="Back to home">
              <div className={styles.logo}>R</div>
              <span className={styles.brandName}>
                Resume<span>Builder</span>
              </span>
            </Link>
            <select
              className={`${styles.select} ${styles.docSelect}`}
              value={activeId}
              onChange={(e) => switchDoc(e.target.value)}
              aria-label="Switch document"
              title="Switch document"
            >
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.kind === "cover" ? "✉ " : "▤ "}
                  {d.name}
                </option>
              ))}
            </select>
            <button className={styles.docBtn} onClick={newDoc} title="New resume">
              <Plus size={14} strokeWidth={2.6} />
              New
            </button>
            <button
              className={styles.docBtn}
              onClick={newCoverDoc}
              title="New cover letter"
            >
              <Mail size={14} strokeWidth={2.4} />
              Cover
            </button>
            <button className={styles.docBtn} onClick={duplicateDoc} title="Duplicate">
              <Copy size={14} strokeWidth={2.4} />
              Copy
            </button>
            <button className={styles.docBtn} onClick={renameDoc} title="Rename">
              <Pencil size={14} strokeWidth={2.4} />
              Rename
            </button>
            <button
              className={`${styles.docBtn} ${styles.docBtnDanger}`}
              onClick={deleteDoc}
              title="Delete"
              aria-label="Delete document"
            >
              <Trash2 size={14} strokeWidth={2.4} />
            </button>
            <span
              className={styles.savedIndicator}
              title={`Last saved: ${new Date(active.updatedAt).toLocaleTimeString()}`}
            >
              {timeAgo(now - active.updatedAt)}
            </span>
            <div className={styles.toolbarSpacer} />
            <button
              className={styles.textBtn}
              onClick={user ? handleLogout : () => setShowAuth(true)}
              title={user ? "Sign out" : "Create an account to sync to the cloud"}
            >
              {user ? (
                <>
                  <Cloud size={15} strokeWidth={2.4} />
                  {user.email}
                </>
              ) : (
                <>
                  <Cloud size={15} strokeWidth={2.4} />
                  Sign in
                </>
              )}
            </button>
            {user && (
              <button
                className={styles.iconBtnGhost}
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={15} strokeWidth={2.4} />
              </button>
            )}
            <span className={styles.savedIndicator} title="Cloud sync status">
              {syncLabel}
            </span>
            <button
              className={styles.iconBtnGhost}
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun size={16} strokeWidth={2.4} />
              ) : (
                <Moon size={16} strokeWidth={2.4} />
              )}
            </button>
            <button
              className={`${styles.aiButton} ${aiConfigured ? styles.aiButtonConfigured : ""}`}
              onClick={() => setShowAI(true)}
              title="Configure your AI writing assistant"
            >
              <span className={styles.aiButtonDot} />
              {aiConfigured ? "AI: Connected" : "Add AI key"}
            </button>
            <button className={styles.textBtn} onClick={handleBackup} title="Download JSON backup">
              <Database size={15} strokeWidth={2.4} />
              Backup
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json,.pdf,.docx,.txt"
              hidden
              onChange={(e) => {
                handleImport(e.target.files?.[0]);
                e.target.value = "";
              }}
              aria-label="Import resume or backup"
            />
            <button
              className={styles.textBtn}
              onClick={() => importRef.current?.click()}
              title="Import a resume (PDF, DOCX, TXT) or JSON backup"
            >
              <FolderInput size={15} strokeWidth={2.4} />
              Import
            </button>
            <button className={styles.textBtn} onClick={handleCopyText} title="Copy as ATS-friendly plain text">
              <ClipboardCopy size={15} strokeWidth={2.4} />
              Copy Text
            </button>
            <button
              className={styles.textBtn}
              onClick={handleExportWord}
              title={`Export as a Word document (${isCover ? "cover letter" : "resume"})`}
            >
              <FileDown size={15} strokeWidth={2.4} />
              Word
            </button>
            <button
              className={styles.textBtn}
              onClick={handleShare}
              disabled={shareBusy}
              title="Create a public link to this document"
            >
              <Share2 size={15} strokeWidth={2.4} />
              {shareBusy ? "Creating…" : "Share"}
            </button>
            <button
              className={styles.primaryBtn}
              onClick={handleDownloadPDF}
              disabled={pdfBusy}
            >
              {pdfBusy ? (
                "Generating…"
              ) : (
                <>
                  <Download size={15} strokeWidth={2.6} />
                  Download PDF
                </>
              )}
            </button>
          </div>
          <div className={styles.toolbarRow}>
            {isCover ? (
              <div className={styles.toolbarGroup}>
                <span className={styles.toolbarLabel}>Cover Template</span>
                <select
                  className={styles.select}
                  value={coverTemplate}
                  onChange={(e) =>
                    commitStyle({ coverTemplate: e.target.value as CoverTemplateId })
                  }
                  aria-label="Choose cover letter template"
                >
                  {COVER_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <TemplatePicker
                current={template}
                accent={accent}
                onSelect={(id) => commitStyle({ template: id })}
              />
            )}
            <div className={styles.toolbarGroup}>
              <span className={styles.toolbarLabel}>Font</span>
              <select
                className={styles.select}
                value={font}
                onChange={(e) => commitStyle({ font: e.target.value })}
                aria-label="Choose font"
              >
                {FONTS.map((f) => (
                  <option key={f.value || "default"} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.toolbarGroup}>
              <span className={styles.toolbarLabel}>Accent</span>
              <div className={styles.swatches}>
                {ACCENTS.map((c) => (
                  <button
                    key={c.value}
                    className={`${styles.swatch} ${
                      accent === c.value ? styles.swatchActive : ""
                    }`}
                    style={{ background: c.value }}
                    title={c.name}
                    aria-label={`Accent color ${c.name}`}
                    onClick={() => commitStyle({ accent: c.value })}
                  />
                ))}
              </div>
            </div>
            <div className={styles.toolbarGroup}>
              <button
                className={styles.textBtn}
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={15} strokeWidth={2.4} />
                Undo
              </button>
              <button
                className={styles.textBtn}
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={15} strokeWidth={2.4} />
                Redo
              </button>
            </div>
            <button className={styles.textBtn} onClick={clearAll} title="Clear all content">
              <Eraser size={15} strokeWidth={2.4} />
              Clear
            </button>
            {!isCover && (
              <select
                className={styles.select}
                value={sampleSel}
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) return;
                  const profile = SAMPLE_PROFILES.find((p) => p.id === id);
                  if (profile) {
                    commit(() => profile.build());
                    showToast(`${profile.name} profile loaded`);
                  }
                  setSampleSel("");
                }}
                aria-label="Load sample profile"
              >
                <option value="">Samples…</option>
                {SAMPLE_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </header>

        <main className={styles.workspace}>
          <div className={styles.formCol}>
            {isCover ? (
              <CoverLetterForm
                data={cover}
                onChange={commitCover}
                onPullFromResume={pullFromResume}
              />
            ) : (
              <ResumeForm
                data={data}
                onPersonalChange={updatePersonal}
                onSummaryChange={(v) => updatePersonal("summary", v)}
                onPhotoChange={(v) => updatePersonal("photo", v)}
                onAdd={addItem}
                onRemove={removeItem}
                onMove={moveItem}
                onReorder={reorderItem}
                onItemChange={updateItem}
                onSkillsChange={updateSkills}
                aiConfigured={aiConfigured}
                aiBusy={aiBusy}
                onAssist={assist}
              />
            )}
          </div>

          <div className={styles.previewCol}>
            <div className={styles.previewHeader}>
              <span className={styles.previewLabel}>
                {isCover ? "Cover Letter Preview" : "Live Preview"}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {overflow && (
                  <span
                    className={styles.overflowChip}
                    title="Content extends past one A4 page"
                  >
                    <AlertTriangle size={13} strokeWidth={2.6} />
                    Spills past 1 page
                  </span>
                )}
                <div className={styles.zoomGroup}>
                  <button
                    className={styles.zoomBtn}
                    onClick={() =>
                      setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))
                    }
                    aria-label="Zoom out"
                  >
                    <Minus size={14} strokeWidth={2.6} />
                  </button>
                  <span className={styles.zoomLabel}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    className={styles.zoomBtn}
                    onClick={() =>
                      setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))
                    }
                    aria-label="Zoom in"
                  >
                    <Plus size={14} strokeWidth={2.6} />
                  </button>
                  <button
                    className={styles.zoomBtn}
                    onClick={() => setZoom(1)}
                    title="Reset zoom"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw size={13} strokeWidth={2.6} />
                  </button>
                </div>
              </div>
            </div>

            {!isCover && (
              <>
                <div className={styles.review}>
                  <div
                    className={styles.reviewHeader}
                    onClick={() => setShowReview((s) => !s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setShowReview((s) => !s);
                      }
                    }}
                  >
                    <p className={styles.reviewTitle}>Resume Review</p>
                    <span
                      className={`${styles.scoreBadge} ${scoreClass}`}
                      aria-label={`Score ${review.score} out of 100`}
                    >
                      {review.score}/100
                    </span>
                    <span className={styles.reviewHint}>
                      {showReview
                        ? "Hide suggestions"
                        : `${issueCount} suggestion${issueCount === 1 ? "" : "s"}`}
                    </span>
                  </div>
                  {showReview && (
                    <div className={styles.reviewBody}>
                      {review.issues.length === 0 ? (
                        <p className={styles.reviewEmpty}>
                          Your resume looks strong — nice work!
                        </p>
                      ) : (
                        <ul className={styles.reviewList}>
                          {review.issues.map((issue, i) => (
                            <li key={i} className={styles.reviewItem}>
                              <span
                                className={`${styles.reviewDot} ${
                                  issue.severity === "error"
                                    ? styles.dotError
                                    : issue.severity === "warning"
                                      ? styles.dotWarning
                                      : styles.dotGood
                                }`}
                              />
                              <span>{issue.message}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <ATSChecklist data={data} />

                <JDAnalyzer
                  data={data}
                  jd={jd}
                  onJdChange={setJd}
                  aiConfigured={aiConfigured}
                  aiBusy={aiBusy !== null}
                  onAddSkills={addSkills}
                  onTailor={tailorForJob}
                />
              </>
            )}

            <div ref={viewportRef} className={styles.previewViewport}>
              <div className={styles.scaledWrap}>
                <div
                  style={{
                    width: SHEET_WIDTH * scale,
                    height: SHEET_HEIGHT * scale,
                  }}
                >
                  <div
                    ref={scaledRef}
                    className={styles.scaled}
                    style={{
                      transform: `scale(${scale})`,
                      width: SHEET_WIDTH,
                    }}
                  >
                    <div style={sheetStyle}>
                      {isCover ? (
                        <CoverLetterDocument
                          data={cover}
                          template={coverTemplate}
                          font={font || undefined}
                        />
                      ) : (
                        <ResumeDocument
                          data={data}
                          template={template}
                          font={font || undefined}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAI && (
        <AISettingsModal
          settings={aiSettings}
          onSave={handleSaveAI}
          onClose={() => setShowAI(false)}
        />
      )}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onAuthed={handleAuthed} />
      )}

      {showOnboarding && (
        <OnboardingModal
          onChoose={handleOnboardingChoose}
          onClose={markOnboarded}
        />
      )}

      {toast && (
        <div className={styles.toastWrap}>
          <div
            className={`${styles.toast} ${toast.error ? styles.toastError : ""}`}
            role="status"
          >
            {toast.error ? (
              <AlertTriangle size={16} strokeWidth={2.6} />
            ) : (
              <CheckCircle2 size={16} strokeWidth={2.4} />
            )}
            {toast.msg}
          </div>
        </div>
      )}
    </>
  );
}