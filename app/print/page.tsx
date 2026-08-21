import { loadPrintPayload } from "@/lib/printStore";
import { ResumeDocument } from "@/components/Templates";
import type { TemplateId } from "@/components/Templates";
import { CoverLetterDocument } from "@/components/CoverLetterDocument";
import type { CoverTemplateId } from "@/components/CoverLetterDocument";
import type { ResumeData, CoverLetterData } from "@/lib/types";
import "./print.css";

export const dynamic = "force-dynamic";

export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const payload = token ? await loadPrintPayload(token) : null;

  if (!payload) {
    return (
      <main className="sheetWrap">
        <p>This print link has expired or is invalid. Return to the builder.</p>
      </main>
    );
  }

  const style = { "--accent": payload.accent || "#1d4ed8" } as React.CSSProperties;
  const fontVar = payload.font || undefined;

  return (
    <main className="sheetWrap">
      <div style={style}>
        {payload.kind === "cover" ? (
          <CoverLetterDocument
            data={payload.data as CoverLetterData}
            template={(payload.template as CoverTemplateId) || "cover-classic"}
            font={fontVar}
          />
        ) : (
          <ResumeDocument
            data={payload.data as ResumeData}
            template={(payload.template as TemplateId) || "modern"}
            font={fontVar}
          />
        )}
      </div>
    </main>
  );
}
