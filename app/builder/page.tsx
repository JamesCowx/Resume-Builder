import type { Metadata } from "next";
import ResumeBuilder from "@/components/ResumeBuilder";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { TemplateId } from "@/components/Templates";

export const metadata: Metadata = {
  title: "Resume Builder",
  description:
    "Design a professional resume and cover letter in minutes — free, no signup required.",
  robots: { index: false, follow: false },
};

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

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const initialTemplate = (
    typeof template === "string" && TEMPLATE_IDS.has(template) ? template : undefined
  ) as TemplateId | undefined;
  return (
    <ErrorBoundary>
      <ResumeBuilder initialTemplate={initialTemplate} />
    </ErrorBoundary>
  );
}