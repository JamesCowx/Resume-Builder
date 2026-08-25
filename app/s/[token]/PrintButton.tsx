"use client";

export default function PrintButton() {
  return (
    <button className="sharePrintBtn" onClick={() => window.print()}>
      Download PDF
    </button>
  );
}
