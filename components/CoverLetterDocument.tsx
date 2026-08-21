import type { CoverLetterData } from "@/lib/types";
import styles from "./cover.module.css";

export type CoverTemplateId = "cover-classic" | "cover-clean";

export const COVER_TEMPLATES: {
  id: CoverTemplateId;
  name: string;
  description: string;
}[] = [
  { id: "cover-classic", name: "Classic Letter", description: "Centered sender, formal" },
  { id: "cover-clean", name: "Clean Modern", description: "Accent rule, spacious" },
];

export function CoverLetterDocument({
  data,
  template,
  font,
}: {
  data: CoverLetterData;
  template: CoverTemplateId;
  font?: string;
}) {
  const paragraphs = data.body
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const senderBlock = [
    data.senderName,
    data.senderEmail,
    data.senderPhone,
    data.senderLocation,
  ].filter(Boolean);

  return (
    <div
      className={`${styles.sheet} ${template === "cover-clean" ? styles.clean : styles.classic}`}
      style={font ? { fontFamily: font } : undefined}
    >
      <header
        className={
          template === "cover-clean" ? styles.cleanHeader : styles.classicHeader
        }
      >
        {template === "cover-clean" ? (
          <>
            <h1 className={styles.cleanName}>
              {data.senderName || "Your Full Name"}
            </h1>
            {senderBlock.length > 1 && (
              <div className={styles.cleanContact}>
                {senderBlock.slice(1).map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            )}
            <div className={styles.cleanRule} />
          </>
        ) : (
          <>
            <h1 className={styles.classicName}>
              {data.senderName || "Your Full Name"}
            </h1>
            {senderBlock.length > 1 && (
              <div className={styles.classicContact}>
                {senderBlock.slice(1).map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            )}
          </>
        )}
      </header>

      <div className={styles.meta}>
        {[data.date, data.recipientName, data.company].filter(Boolean).map((l) => (
          <p key={l} className={styles.metaLine}>
            {l}
          </p>
        ))}
        {data.position && (
          <p className={styles.metaLine}>
            Re: {data.position}
          </p>
        )}
      </div>

      <p className={styles.opening}>{data.opening || "Dear Hiring Manager,"}</p>

      <div className={styles.body}>
        {paragraphs.length ? (
          paragraphs.map((p, i) => (
            <p key={i} className={styles.bodyParagraph}>
              {p}
            </p>
          ))
        ) : (
          <p className={styles.bodyParagraph}>
            Write the body of your cover letter here. Introduce yourself, connect
            your experience to the role, and end with a call to action.
          </p>
        )}
      </div>

      <div className={styles.signoff}>
        <p className={styles.closing}>{data.closing || "Sincerely,"}</p>
        <p className={styles.signedName}>{data.senderName || "Your Full Name"}</p>
      </div>
    </div>
  );
}