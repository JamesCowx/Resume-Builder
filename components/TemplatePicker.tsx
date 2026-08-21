"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { TEMPLATES } from "./Templates";
import type { TemplateId } from "./Templates";
import styles from "./templatepicker.module.css";

type Props = {
  current: TemplateId;
  accent: string;
  onSelect: (id: TemplateId) => void;
};

function Line({
  w = "100%",
  h = 4,
  c = "#dbe3ee",
  r = 2,
  style,
}: {
  w?: string | number;
  h?: number;
  c?: string;
  r?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "block",
        width: typeof w === "number" ? `${w}%` : w,
        height: h,
        background: c,
        borderRadius: r,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Dot({ c, s = 6 }: { c: string; s?: number }) {
  return (
    <span
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        background: c,
        flexShrink: 0,
      }}
    />
  );
}

function Thumb({ id }: { id: TemplateId }) {
  const A = "var(--accent)";
  const ASoft = "color-mix(in srgb, var(--accent) 12%, #ffffff)";
  const ink = "#334155";
  const soft = "#e3eaf3";

  const body: React.ReactNode = (() => {
    switch (id) {
      case "modern":
        return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
              style={{
                height: "30%",
                background: `linear-gradient(120deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #0f172a))`,
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "0 12px",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.9)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <Line w="62%" h={7} c="#fff" />
                <Line w="42%" h={4} c="rgba(255,255,255,0.8)" />
              </div>
            </div>
            <div style={{ flex: 1, display: "flex" }}>
              <div
                style={{
                  width: "34%",
                  background: "#f6f8fb",
                  borderRight: `1px solid ${soft}`,
                  padding: "10px 9px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <Line w="70%" h={4} c={A} />
                <Line w="90%" h={3} c={soft} />
                <Line w="80%" h={3} c={soft} />
                <Line w="70%" h={4} c={A} style={{ marginTop: 4 }} />
                <Line w="85%" h={3} c={soft} />
                <Line w="90%" h={3} c={soft} />
              </div>
              <div style={{ flex: 1, padding: "10px 11px", display: "flex", flexDirection: "column", gap: 7 }}>
                <Line w="34%" h={4} c={A} />
                <Line w="95%" h={3} c={soft} />
                <Line w="88%" h={3} c={soft} />
                <Line w="34%" h={4} c={A} style={{ marginTop: 4 }} />
                <Line w="90%" h={5} c={ink} />
                <Line w="85%" h={3} c={soft} />
                <Line w="92%" h={3} c={soft} />
                <Line w="90%" h={5} c={ink} />
                <Line w="80%" h={3} c={soft} />
              </div>
            </div>
          </div>
        );
      case "classic":
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 12px", gap: 8 }}>
            <Line w="58%" h={8} c={ink} />
            <Line w="40%" h={3} c="#94a3b8" />
            <Line w="72%" h={2} c={A} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", marginTop: 4 }}>
              <Line w="26%" h={4} c={ink} style={{ alignSelf: "center" }} />
              <Line w="96%" h={3} c={soft} />
              <Line w="90%" h={3} c={soft} />
              <Line w="26%" h={4} c={ink} style={{ alignSelf: "center", marginTop: 4 }} />
              <Line w="94%" h={5} c={ink} />
              <Line w="86%" h={3} c={soft} />
              <Line w="92%" h={3} c={soft} />
            </div>
          </div>
        );
      case "minimal":
        return (
          <div style={{ display: "flex", flexDirection: "column", padding: "15px 14px", gap: 8 }}>
            <Line w="46%" h={8} c={ink} />
            <Line w="30%" h={4} c={A} />
            <Line w="100%" h={2} c={A} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
              <Line w="22%" h={3} c={A} />
              <Line w="94%" h={3} c={soft} />
              <Line w="88%" h={3} c={soft} />
              <Line w="22%" h={3} c={A} style={{ marginTop: 4 }} />
              <Line w="92%" h={5} c={ink} />
              <Line w="85%" h={3} c={soft} />
            </div>
          </div>
        );
      case "executive":
        return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
              style={{
                height: "30%",
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 6,
                borderBottom: `3px solid ${A}`,
              }}
            >
              <Line w="55%" h={8} c="#fff" />
              <Line w="40%" h={3} c="rgba(255,255,255,0.55)" />
              <Line w="70%" h={3} c="rgba(255,255,255,0.5)" />
            </div>
            <div style={{ flex: 1, display: "flex" }}>
              <div style={{ flex: 1, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 7 }}>
                <Line w="30%" h={4} c={A} />
                <Line w="92%" h={3} c={soft} />
                <Line w="30%" h={4} c={A} style={{ marginTop: 3 }} />
                <Line w="88%" h={5} c={ink} />
                <Line w="82%" h={3} c={soft} />
              </div>
              <div
                style={{
                  width: "30%",
                  borderLeft: `1px solid ${soft}`,
                  padding: "11px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <Line w="60%" h={4} c={A} />
                <Line w="85%" h={3} c={soft} />
                <Line w="75%" h={3} c={soft} />
                <Line w="90%" h={3} c={soft} />
              </div>
            </div>
          </div>
        );
      case "creative":
        return (
          <div style={{ display: "flex", height: "100%" }}>
            <div
              style={{
                width: "36%",
                background: `linear-gradient(180deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #0f172a))`,
                padding: "13px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.9)", flexShrink: 0 }}
              />
              <Line w="70%" h={3} c="rgba(255,255,255,0.7)" />
              <Line w="85%" h={3} c="rgba(255,255,255,0.6)" />
              <Line w="60%" h={3} c="rgba(255,255,255,0.7)" />
              <Line w="80%" h={3} c="rgba(255,255,255,0.6)" />
            </div>
            <div style={{ flex: 1, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 7 }}>
              <Line w="55%" h={8} c={A} />
              <Line w="40%" h={3} c="#94a3b8" />
              <Line w="30%" h={4} c={A} style={{ marginTop: 2 }} />
              <Line w="92%" h={5} c={ink} />
              <Line w="86%" h={3} c={soft} />
              <Line w="90%" h={3} c={soft} />
              <Line w="30%" h={4} c={A} style={{ marginTop: 3 }} />
              <Line w="88%" h={5} c={ink} />
              <Line w="80%" h={3} c={soft} />
            </div>
          </div>
        );
      case "compact":
        return (
          <div style={{ display: "flex", flexDirection: "column", padding: "12px 13px", gap: 6 }}>
            <Line w="42%" h={7} c={ink} />
            <Line w="28%" h={3} c={A} />
            <Line w="100%" h={2} c={ASoft} />
            <Line w="20%" h={3} c={A} style={{ marginTop: 2 }} />
            <Line w="94%" h={3} c={soft} />
            <Line w="20%" h={3} c={A} style={{ marginTop: 3 }} />
            <div style={{ display: "flex", gap: 4 }}>
              <Line w="20%" h={5} c={ink} />
              <Line w="52%" h={3} c={soft} style={{ marginTop: 1 }} />
            </div>
            <Line w="80%" h={3} c={soft} />
            <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
              <span style={{ flex: 1, height: 9, background: ASoft, borderRadius: 3 }} />
              <span style={{ flex: 1, height: 9, background: ASoft, borderRadius: 3 }} />
              <span style={{ flex: 1, height: 9, background: ASoft, borderRadius: 3 }} />
            </div>
          </div>
        );
      case "columns":
        return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
              style={{
                background: ASoft,
                borderBottom: `2px solid ${A}`,
                padding: "13px 12px 11px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Line w="52%" h={8} c={ink} />
              <Line w="34%" h={3} c={A} />
            </div>
            <div style={{ flex: 1, display: "flex" }}>
              <div style={{ flex: 1, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 7 }}>
                <Line w="28%" h={4} c={A} />
                <Line w="92%" h={3} c={soft} />
                <Line w="28%" h={4} c={A} style={{ marginTop: 3 }} />
                <Line w="88%" h={5} c={ink} />
                <Line w="80%" h={3} c={soft} />
              </div>
              <div
                style={{
                  width: "32%",
                  background: "#f6f8fb",
                  borderLeft: `1px solid ${soft}`,
                  padding: "11px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <Line w="60%" h={4} c={A} />
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Line w={3} h={10} c={A} r={1} />
                    <Line w="70%" h={3} c={soft} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "timeline":
        return (
          <div style={{ display: "flex", flexDirection: "column", padding: "14px 15px", gap: 7 }}>
            <Line w="50%" h={8} c={ink} />
            <Line w="32%" h={3} c={A} />
            <Line w="100%" h={2} c={A} />
            <div style={{ display: "flex", gap: 9, marginTop: 4 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Dot c={A} />
                <Line w={2} h={26} c={ASoft} r={1} />
                <Dot c={A} />
                <Line w={2} h={26} c={ASoft} r={1} />
                <Dot c={A} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9, paddingTop: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Line w="46%" h={5} c={ink} />
                  <Line w="72%" h={3} c={soft} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Line w="46%" h={5} c={ink} />
                  <Line w="66%" h={3} c={soft} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Line w="46%" h={5} c={ink} />
                  <Line w="70%" h={3} c={soft} />
                </div>
              </div>
            </div>
          </div>
        );
      case "elegant":
        return (
          <div style={{ height: "100%", padding: 8 }}>
            <div
              style={{
                height: "100%",
                border: "2px solid #d9d5c8",
                padding: "13px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 7,
                background: "#fdfcf8",
              }}
            >
              <Line w="66%" h={7} c="#1f1e1a" />
              <Line w="42%" h={3} c="#9a927e" />
              <Line w="80%" h={2} c="#d9d5c8" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", marginTop: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Line w="16%" h={3} c="#9a927e" />
                  <Line w="1px" h={10} c="#d9d5c8" style={{ flex: 1, height: 1 }} />
                </div>
                <Line w="92%" h={5} c={ink} />
                <Line w="84%" h={3} c={soft} />
                <Line w="88%" h={3} c={soft} />
                <Line w="16%" h={3} c="#9a927e" style={{ marginTop: 3 }} />
                <Line w="90%" h={5} c={ink} />
                <Line w="80%" h={3} c={soft} />
              </div>
            </div>
          </div>
        );
    }
  })();

  return (
    <div className={styles.mini} style={{ ["--accent" as string]: "var(--accent)" }}>
      {body}
    </div>
  );
}

export default function TemplatePicker({ current, accent, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const currentName = TEMPLATES.find((t) => t.id === current)?.name ?? "Template";

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="grid"
        aria-expanded={open}
      >
        Templates: {currentName}
        <span className={`${styles.buttonCaret} ${open ? styles.caretOpen : ""}`}>
          <ChevronDown size={14} strokeWidth={2.6} />
        </span>
      </button>
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div
            className={styles.popover}
            role="listbox"
            aria-label="Templates"
            style={{ ["--accent" as string]: accent }}
          >
            <p className={styles.popoverTitle}>Choose a template</p>
            <div className={styles.grid}>
              {TEMPLATES.map((t) => {
                const active = t.id === current;
                return (
                  <button
                    key={t.id}
                    role="option"
                    aria-selected={active}
                    className={`${styles.card} ${active ? styles.cardActive : ""}`}
                    onClick={() => {
                      onSelect(t.id);
                      setOpen(false);
                    }}
                  >
                    <Thumb id={t.id} />
                    <span
                      className={`${styles.cardName} ${
                        active ? styles.cardActiveName : ""
                      }`}
                    >
                      {t.name}
                      {active && (
                        <span className={styles.check} aria-hidden>
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}