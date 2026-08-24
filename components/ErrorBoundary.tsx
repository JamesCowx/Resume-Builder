"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            background: "var(--bg)",
            color: "var(--text)",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "var(--red-soft)",
              color: "var(--red)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <AlertTriangle size={26} strokeWidth={2.2} />
          </span>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            Something went wrong
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)", maxWidth: 420 }}>
            The builder hit an unexpected error. Your resumes are safe — reload
            to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 10,
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, var(--brand), var(--brand-hover))",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <RotateCcw size={15} strokeWidth={2.4} />
            Reload builder
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}