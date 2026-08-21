"use client";

import { useState } from "react";
import { login, register, type AuthUser } from "@/lib/sync";
import styles from "./modal.module.css";

type Props = {
  onClose: () => void;
  onAuthed: (user: AuthUser) => void;
};

export default function AuthModal({ onClose, onAuthed }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const user =
        mode === "login"
          ? await login(email, password)
          : await register(email, password);
      onAuthed(user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>
          {mode === "login" ? "Sign in" : "Create account"}
        </h2>
        <p className={styles.subtitle}>
          Save your resumes to the cloud and access them from any device.
        </p>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && (
          <div className={`${styles.status} ${styles.statusError}`} role="status">
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
            Cancel
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={submit}
            disabled={busy || !email.trim() || !password}
          >
            {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>

        <p className={styles.keyHint} style={{ textAlign: "center" }}>
          {mode === "login" ? (
            <>
              No account yet?{" "}
              <span className={styles.link} onClick={() => setMode("register")}>
                Create one
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span className={styles.link} onClick={() => setMode("login")}>
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}