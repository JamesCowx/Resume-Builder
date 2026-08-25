import type { ResumeData } from "@/lib/types";
import styles from "./templates.module.css";

export type TemplateId =
  | "modern"
  | "classic"
  | "minimal"
  | "executive"
  | "creative"
  | "compact"
  | "columns"
  | "timeline"
  | "elegant";

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "modern", name: "Modern", description: "Two-column, accent header" },
  { id: "classic", name: "Classic", description: "Centered serif, timeless" },
  { id: "minimal", name: "Minimal", description: "Clean, lightweight lines" },
  { id: "executive", name: "Executive", description: "Dark serif, leadership" },
  { id: "creative", name: "Creative", description: "Bold color sidebar" },
  { id: "compact", name: "Compact", description: "Tight, one-page focus" },
  { id: "columns", name: "Columns", description: "Sidebar skills, generous spacing" },
  { id: "timeline", name: "Timeline", description: "Experience as a dated timeline" },
  { id: "elegant", name: "Elegant", description: "Serif, refined letterpress look" },
];

const contactParts = (r: ResumeData) =>
  [
    r.personal.email,
    r.personal.phone,
    r.personal.location,
    r.personal.website,
  ].filter(Boolean);

const bullets = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const skillItems = (skills: string[]) =>
  skills.map((s) => s.trim()).filter((s) => s.length > 0);

function Photo({ src, className }: { src: string; className: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="Profile" className={className} />;
}

export function ResumeDocument({
  data,
  template,
  font,
}: {
  data: ResumeData;
  template: TemplateId;
  font?: string;
}) {
  return (
    <div
      className={`${styles.sheet} ${styles[template]}`}
      style={font ? { fontFamily: font } : undefined}
    >
      {template === "modern" && <ModernTemplate data={data} />}
      {template === "classic" && <ClassicTemplate data={data} />}
      {template === "minimal" && <MinimalTemplate data={data} />}
      {template === "executive" && <ExecutiveTemplate data={data} />}
      {template === "creative" && <CreativeTemplate data={data} />}
      {template === "compact" && <CompactTemplate data={data} />}
      {template === "columns" && <ColumnsTemplate data={data} />}
      {template === "timeline" && <TimelineTemplate data={data} />}
      {template === "elegant" && <ElegantTemplate data={data} />}
    </div>
  );
}

function ModernTemplate({ data }: { data: ResumeData }) {
  const contact = contactParts(data);
  return (
    <>
      <header className={styles.modernHeader}>
        <Photo src={data.personal.photo} className={styles.modernPhoto} />
        <div className={styles.modernHeaderMain}>
          <h1 className={styles.modernName}>
            {data.personal.fullName || "Your Name"}
          </h1>
          <p className={styles.modernHeadline}>{data.personal.headline}</p>
          {contact.length > 0 && (
            <div className={styles.modernContact}>
              {contact.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className={styles.modernBody}>
        <aside className={styles.modernSidebar}>
          <section className={styles.modernSection}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.pillList}>
              {skillItems(data.skills).map((s) => (
                <span key={s} className={styles.modernSkill}>
                  {s}
                </span>
              ))}
            </div>
          </section>
          <section className={styles.modernSection}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {data.education.map((e) => (
              <div key={e.id} className={styles.itemBlock}>
                <p className={styles.itemTitle}>{e.school || "School"}</p>
                <p className={styles.itemMeta}>
                  {e.degree}
                  {e.location && ` — ${e.location}`}
                </p>
                <p className={styles.itemDates}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </p>
                {e.details && <p className={styles.itemMeta}>{e.details}</p>}
              </div>
            ))}
          </section>
          {data.certificates.length > 0 && (
            <section className={styles.modernSection}>
              <h2 className={styles.sectionTitle}>Certificates</h2>
              {data.certificates.map((c) => (
                <div key={c.id} className={styles.itemBlock}>
                  <p className={styles.itemTitle}>{c.name || "Certification"}</p>
                  <p className={styles.itemMeta}>
                    {[c.issuer, c.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ))}
            </section>
          )}
        </aside>
        <main className={styles.modernMain}>
          <section className={styles.modernSection}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <p>{data.personal.summary}</p>
          </section>
          <section className={styles.modernSection}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            {data.experience.map((x) => (
              <div key={x.id} className={styles.itemBlock}>
                <div className={styles.itemHeader}>
                  <p className={styles.itemTitle}>
                    {x.role || "Role"}
                    {x.company && (
                      <span className={styles.modernCompany}> · {x.company}</span>
                    )}
                  </p>
                  <span className={styles.itemDates}>
                    {[x.start, x.end].filter(Boolean).join(" – ")}
                  </span>
                </div>
                <p className={styles.itemMeta}>
                  {x.location && ` ${x.location}`}
                </p>
                <ul className={styles.bullets}>
                  {bullets(x.bullets).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          {data.projects.length > 0 && (
            <section className={styles.modernSection}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {data.projects.map((p) => (
                <div key={p.id} className={styles.itemBlock}>
                  <div className={styles.itemHeader}>
                    <p className={styles.itemTitle}>{p.name || "Project"}</p>
                    {p.url && <span className={styles.itemDates}>{p.url}</span>}
                  </div>
                  {p.description && (
                    <p className={styles.itemMeta}>{p.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </>
  );
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  const contact = contactParts(data);
  return (
    <div className={styles.classic}>
      <header className={styles.classicHeader}>
        <h1 className={styles.classicName}>
          {data.personal.fullName || "Your Name"}
        </h1>
        <p className={styles.classicHeadline}>{data.personal.headline}</p>
        {contact.length > 0 && (
          <div className={styles.classicContact}>
            {contact.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}
      </header>

      <section className={styles.classicSection}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <p>{data.personal.summary}</p>
      </section>

      <section className={styles.classicSection}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        {data.experience.map((x) => (
          <div key={x.id} className={styles.itemBlock}>
            <div className={styles.itemHeader}>
              <p className={`${styles.itemTitle} ${styles.classicItemTitle}`}>
                {x.role || "Role"}
                {x.company && <span> · {x.company}</span>}
              </p>
              <span className={styles.itemDates}>
                {[x.start, x.end].filter(Boolean).join(" – ")}
              </span>
            </div>
            <p className={styles.itemMeta}>{x.location}</p>
            <ul className={`${styles.bullets} ${styles.classicBullets}`}>
              {bullets(x.bullets).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.classicSection}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {data.education.map((e) => (
          <div key={e.id} className={styles.itemBlock}>
            <div className={styles.itemHeader}>
              <p className={`${styles.itemTitle} ${styles.classicItemTitle}`}>
                {e.school || "School"}
              </p>
              <span className={styles.itemDates}>
                {[e.start, e.end].filter(Boolean).join(" – ")}
              </span>
            </div>
            <p className={styles.itemMeta}>
              {e.degree}
              {e.location && ` — ${e.location}`}
            </p>
            {e.details && <p className={styles.itemMeta}>{e.details}</p>}
          </div>
        ))}
      </section>

      <section className={styles.classicSection}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className={styles.classicSkillRow}>
          {skillItems(data.skills).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  const contact = contactParts(data);
  return (
    <div className={styles.minimal}>
      <header className={styles.minimalHeader}>
        <div>
          <h1 className={styles.minimalName}>
            {data.personal.fullName || "Your Name"}
          </h1>
          <p className={styles.minimalHeadline}>{data.personal.headline}</p>
        </div>
        {contact.length > 0 && (
          <div className={styles.minimalContact}>
            {contact.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
        )}
      </header>
      <div className={styles.minimalRule} />

      <section className={styles.minimalSection}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <p>{data.personal.summary}</p>
      </section>

      <section className={styles.minimalSection}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        {data.experience.map((x) => (
          <div key={x.id} className={styles.itemBlock}>
            <div className={styles.itemHeader}>
              <p className={styles.itemTitle}>
                {x.role || "Role"}
                {x.company && <span> · {x.company}</span>}
              </p>
              <span className={styles.itemDates}>
                {[x.start, x.end].filter(Boolean).join(" – ")}
              </span>
            </div>
            <p className={styles.itemMeta}>{x.location && ` ${x.location}`}</p>
            <ul className={styles.bullets}>
              {bullets(x.bullets).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.minimalSection}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {data.education.map((e) => (
          <div key={e.id} className={styles.itemBlock}>
            <div className={styles.itemHeader}>
              <p className={styles.itemTitle}>{e.school || "School"}</p>
              <span className={styles.itemDates}>
                {[e.start, e.end].filter(Boolean).join(" – ")}
              </span>
            </div>
            <p className={styles.itemMeta}>
              {e.degree}
              {e.location && ` — ${e.location}`}
            </p>
            {e.details && <p className={styles.itemMeta}>{e.details}</p>}
          </div>
        ))}
      </section>

      <section className={styles.minimalSection}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <p>
          {skillItems(data.skills).map((s) => (
            <span key={s} className={styles.minimalSkill}>
              {s}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const contact = contactParts(data);
  return (
    <div className={styles.executive}>
      <header className={styles.executiveHeader}>
        <div className={styles.executiveHeaderMain}>
          <h1 className={styles.executiveName}>
            {data.personal.fullName || "Your Name"}
          </h1>
          <p className={styles.executiveHeadline}>{data.personal.headline}</p>
          {contact.length > 0 && (
            <div className={styles.executiveContact}>
              {contact.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          )}
        </div>
        <Photo src={data.personal.photo} className={styles.executivePhoto} />
      </header>
      <div className={styles.executiveBody}>
        <main>
          <section className={styles.executiveSection}>
            <h2 className={styles.sectionTitle}>Profile</h2>
            <p>{data.personal.summary}</p>
          </section>
          <section className={styles.executiveSection}>
            <h2 className={styles.sectionTitle}>Professional Experience</h2>
            {data.experience.map((x) => (
              <div key={x.id} className={styles.itemBlock}>
                <div className={styles.itemHeader}>
                  <p className={styles.itemTitle}>
                    {x.role || "Role"}
                    {x.company && (
                      <span className={styles.executiveCompany}>
                        {" "}
                        · {x.company}
                      </span>
                    )}
                  </p>
                  <span className={styles.itemDates}>
                    {[x.start, x.end].filter(Boolean).join(" – ")}
                  </span>
                </div>
                <p className={styles.itemMeta}>{x.location}</p>
                <ul className={styles.bullets}>
                  {bullets(x.bullets).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          {data.projects.length > 0 && (
            <section className={styles.executiveSection}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {data.projects.map((p) => (
                <div key={p.id} className={styles.itemBlock}>
                  <p className={styles.itemTitle}>
                    {p.name || "Project"}
                    {p.url && <span className={styles.itemMeta}> — {p.url}</span>}
                  </p>
                  {p.description && (
                    <p className={styles.itemMeta}>{p.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>
        <aside className={styles.executiveSidebar}>
          <section className={styles.executiveSection}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            {skillItems(data.skills).map((s) => (
              <span key={s} className={styles.executiveSkill}>
                {s}
              </span>
            ))}
          </section>
          <section className={styles.executiveSection}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {data.education.map((e) => (
              <div key={e.id} className={styles.itemBlock}>
                <p className={styles.itemTitle}>{e.school || "School"}</p>
                <p className={styles.itemMeta}>
                  {e.degree}
                  {e.location && ` — ${e.location}`}
                </p>
                <p className={styles.itemDates}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </p>
                {e.details && <p className={styles.itemMeta}>{e.details}</p>}
              </div>
            ))}
          </section>
          {data.certificates.length > 0 && (
            <section className={styles.executiveSection}>
              <h2 className={styles.sectionTitle}>Certifications</h2>
              {data.certificates.map((c) => (
                <div key={c.id} className={styles.executiveCert}>
                  <p className={styles.executiveCertName}>
                    {c.name || "Certification"}
                  </p>
                  <p className={styles.executiveCertMeta}>
                    {[c.issuer, c.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function CreativeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className={styles.creative}>
      <aside className={styles.creativeSidebar}>
        <Photo src={data.personal.photo} className={styles.creativePhoto} />
        {data.personal.email ||
        data.personal.phone ||
        data.personal.location ||
        data.personal.website ? (
          <section className={styles.creativeSection}>
            <h2 className={styles.creativeSideTitle}>Contact</h2>
            {[
              data.personal.email,
              data.personal.phone,
              data.personal.location,
              data.personal.website,
            ]
              .filter(Boolean)
              .map((v) => (
                <div key={v} className={styles.creativeContactRow}>
                  <span className={styles.creativeContactDot} aria-hidden />
                  <span>{v}</span>
                </div>
              ))}
          </section>
        ) : null}
        {skillItems(data.skills).length > 0 && (
          <section className={styles.creativeSection}>
            <h2 className={styles.creativeSideTitle}>Skills</h2>
            {skillItems(data.skills).map((s) => (
              <span key={s} className={styles.creativeSkill}>
                {s}
              </span>
            ))}
          </section>
        )}
        {data.education.length > 0 && (
          <section className={styles.creativeSection}>
            <h2 className={styles.creativeSideTitle}>Education</h2>
            {data.education.map((e) => (
              <div key={e.id} className={styles.itemBlock}>
                <p className={styles.itemTitle}>{e.school || "School"}</p>
                <p className={styles.itemMeta}>{e.degree}</p>
                <p className={styles.itemDates}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </p>
              </div>
            ))}
          </section>
        )}
        {data.certificates.length > 0 && (
          <section className={styles.creativeSection}>
            <h2 className={styles.creativeSideTitle}>Certificates</h2>
            {data.certificates.map((c) => (
              <div key={c.id} className={styles.itemBlock}>
                <p className={styles.itemTitle}>{c.name || "Certification"}</p>
                <p className={styles.itemMeta}>{c.year}</p>
              </div>
            ))}
          </section>
        )}
      </aside>
      <main className={styles.creativeMain}>
        <h1 className={styles.creativeName}>
          {data.personal.fullName || "Your Name"}
        </h1>
        <p className={styles.creativeHeadline}>{data.personal.headline}</p>
        <div className={styles.creativeRule} />
        <section className={styles.creativeSection}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          <p>{data.personal.summary}</p>
        </section>
        <section className={styles.creativeSection}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {data.experience.map((x) => (
            <div key={x.id} className={styles.itemBlock}>
              <div className={styles.itemHeader}>
                <p className={styles.itemTitle}>
                  {x.role || "Role"}
                  {x.company && (
                    <span className={styles.creativeCompany}> · {x.company}</span>
                  )}
                </p>
                <span className={styles.itemDates}>
                  {[x.start, x.end].filter(Boolean).join(" – ")}
                </span>
              </div>
              <ul className={styles.bullets}>
                {bullets(x.bullets).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        {data.projects.length > 0 && (
          <section className={styles.creativeSection}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            {data.projects.map((p) => (
              <div key={p.id} className={styles.itemBlock}>
                <p className={styles.itemTitle}>
                  {p.name || "Project"}
                  {p.url && <span className={styles.itemMeta}> — {p.url}</span>}
                </p>
                {p.description && (
                  <p className={styles.itemMeta}>{p.description}</p>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function CompactTemplate({ data }: { data: ResumeData }) {
  const contact = contactParts(data);
  return (
    <div className={styles.compact}>
      <header className={styles.compactHeader}>
        <div>
          <h1 className={styles.compactName}>
            {data.personal.fullName || "Your Name"}
          </h1>
          <p className={styles.compactHeadline}>{data.personal.headline}</p>
        </div>
        {contact.length > 0 && (
          <div className={styles.compactContact}>
            {contact.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
        )}
      </header>
      <div className={styles.compactRule} />
      {data.personal.summary && (
        <section className={styles.compactSection}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <p>{data.personal.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section className={styles.compactSection}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {data.experience.map((x) => (
            <div key={x.id} className={styles.compactItem}>
              <span className={styles.compactDot} />
              <div>
                <p className={styles.compactItemTitle}>
                  {x.role || "Role"}
                  {x.company && <span> · {x.company}</span>}
                  <span className={styles.compactItemDates}>
                    {"  "}
                    {[x.start, x.end].filter(Boolean).join(" – ")}
                  </span>
                </p>
                <ul className={styles.compactBullets}>
                  {bullets(x.bullets).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      )}
      {data.projects.length > 0 && (
        <section className={styles.compactSection}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {data.projects.map((p) => (
            <div key={p.id} className={styles.compactItem}>
              <span className={styles.compactDot} />
              <div>
                <p className={styles.compactItemTitle}>
                  {p.name || "Project"}
                  {p.url && <span className={styles.itemMeta}> — {p.url}</span>}
                </p>
                {p.description && (
                  <p className={styles.itemMeta}>{p.description}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section className={styles.compactSection}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {data.education.map((e) => (
            <div key={e.id} className={styles.compactItem}>
              <span className={styles.compactDot} />
              <div>
                <p className={styles.compactItemTitle}>
                  {e.school || "School"}
                  {e.degree && <span> · {e.degree}</span>}
                  <span className={styles.compactItemDates}>
                    {"  "}
                    {[e.start, e.end].filter(Boolean).join(" – ")}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </section>
      )}
      {skillItems(data.skills).length > 0 && (
        <section className={styles.compactSection}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.compactSkills}>
            {skillItems(data.skills).map((s) => (
              <span key={s} className={styles.compactTag}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ColumnsTemplate({ data }: { data: ResumeData }) {
  return (
    <div className={styles.columns}>
      <header className={styles.columnsHeader}>
        <h1 className={styles.columnsName}>
          {data.personal.fullName || "Your Name"}
        </h1>
        <p className={styles.columnsHeadline}>{data.personal.headline}</p>
        <div className={styles.columnsContact}>
          {contactParts(data).map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </header>
      <div className={styles.columnsBody}>
        <main className={styles.columnsMain}>
          <section className={styles.columnsSection}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <p>{data.personal.summary}</p>
          </section>
          <section className={styles.columnsSection}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            {data.experience.map((x) => (
              <div key={x.id} className={styles.itemBlock}>
                <div className={styles.itemHeader}>
                  <p className={styles.itemTitle}>
                    {x.role || "Role"}
                    {x.company && (
                      <span className={styles.columnsCompany}> · {x.company}</span>
                    )}
                  </p>
                  <span className={styles.itemDates}>
                    {[x.start, x.end].filter(Boolean).join(" – ")}
                  </span>
                </div>
                <p className={styles.itemMeta}>{x.location}</p>
                <ul className={styles.bullets}>
                  {bullets(x.bullets).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          {data.projects.length > 0 && (
            <section className={styles.columnsSection}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {data.projects.map((p) => (
                <div key={p.id} className={styles.itemBlock}>
                  <p className={styles.itemTitle}>
                    {p.name || "Project"}
                    {p.url && <span className={styles.itemMeta}> — {p.url}</span>}
                  </p>
                  {p.description && (
                    <p className={styles.itemMeta}>{p.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}
          {data.certificates.length > 0 && (
            <section className={styles.columnsSection}>
              <h2 className={styles.sectionTitle}>Certifications</h2>
              {data.certificates.map((c) => (
                <div key={c.id} className={styles.itemBlock}>
                  <p className={styles.itemTitle}>{c.name || "Certification"}</p>
                  <p className={styles.itemMeta}>
                    {[c.issuer, c.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ))}
            </section>
          )}
        </main>
        <aside className={styles.columnsSidebar}>
          <section className={styles.columnsSection}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.columnsSkills}>
              {skillItems(data.skills).map((s) => (
                <span key={s} className={styles.columnsSkill}>
                  {s}
                </span>
              ))}
            </div>
          </section>
          <section className={styles.columnsSection}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {data.education.map((e) => (
              <div key={e.id} className={styles.itemBlock}>
                <p className={styles.itemTitle}>
                  {e.school || "School"} · {e.degree}
                </p>
                <p className={styles.itemDates}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </p>
                {e.details && <p className={styles.itemMeta}>{e.details}</p>}
              </div>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}

function TimelineTemplate({ data }: { data: ResumeData }) {
  return (
    <div className={styles.timeline}>
      <header className={styles.timelineHeader}>
        <h1 className={styles.timelineName}>
          {data.personal.fullName || "Your Name"}
        </h1>
        <p className={styles.timelineHeadline}>{data.personal.headline}</p>
        <div className={styles.timelineContact}>
          {contactParts(data).map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </header>
      <div className={styles.timelineRule} />
      {data.personal.summary && (
        <section className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <p>{data.personal.summary}</p>
        </section>
      )}
      <section className={styles.timelineSection}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        <div className={styles.timelineList}>
          {data.experience.map((x) => (
            <div key={x.id} className={styles.timelineItem}>
              <div className={styles.timelineMarker} />
              <div className={styles.timelineDates}>
                {[x.start, x.end].filter(Boolean).join(" – ")}
              </div>
              <div className={styles.timelineCard}>
                <p className={styles.itemTitle}>
                  {x.role || "Role"}
                  {x.company && <span className={styles.timelineCompany}> · {x.company}</span>}
                </p>
                <p className={styles.itemMeta}>{x.location}</p>
                <ul className={styles.bullets}>
                  {bullets(x.bullets).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
      {data.education.length > 0 && (
        <section className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.timelineList}>
            {data.education.map((e) => (
              <div key={e.id} className={styles.timelineItem}>
                <div className={styles.timelineMarker} />
                <div className={styles.timelineDates}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </div>
                <div>
                  <p className={styles.itemTitle}>{e.school || "School"}</p>
                  <p className={styles.itemMeta}>{e.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {skillItems(data.skills).length > 0 && (
        <section className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.compactSkills}>
            {skillItems(data.skills).map((s) => (
              <span key={s} className={styles.timelineSkill}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ElegantTemplate({ data }: { data: ResumeData }) {
  return (
    <div className={styles.elegant}>
      <div className={styles.elegantBorder}>
        <header className={styles.elegantHeader}>
          <h1 className={styles.elegantName}>
            {data.personal.fullName || "Your Name"}
          </h1>
          <p className={styles.elegantHeadline}>{data.personal.headline}</p>
          <div className={styles.elegantContact}>
            {contactParts(data).map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </header>

        <section className={styles.elegantSection}>
          <h2 className={styles.elegantSectionTitle}>
            <span>Profile</span>
          </h2>
          <p>{data.personal.summary}</p>
        </section>

        <section className={styles.elegantSection}>
          <h2 className={styles.elegantSectionTitle}>
            <span>Experience</span>
          </h2>
          {data.experience.map((x) => (
            <div key={x.id} className={styles.elegantItem}>
              <div className={styles.itemHeader}>
                <p className={styles.itemTitle}>
                  {x.role || "Role"}
                  {x.company && (
                    <span className={styles.elegantCompany}> · {x.company}</span>
                  )}
                </p>
                <span className={styles.elegantDates}>
                  {[x.start, x.end].filter(Boolean).join(" – ")}
                </span>
              </div>
              <p className={styles.itemMeta}>{x.location}</p>
              <ul className={`${styles.bullets} ${styles.elegantBullets}`}>
                {bullets(x.bullets).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className={styles.elegantColumns}>
          <section className={styles.elegantSection}>
            <h2 className={styles.elegantSectionTitle}>
              <span>Education</span>
            </h2>
            {data.education.map((e) => (
              <div key={e.id} className={styles.elegantItem}>
                <p className={styles.itemTitle}>{e.school || "School"}</p>
                <p className={styles.itemMeta}>{e.degree}</p>
                <p className={styles.elegantDates}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </p>
              </div>
            ))}
          </section>
          <section className={styles.elegantSection}>
            <h2 className={styles.elegantSectionTitle}>
              <span>Skills</span>
            </h2>
            <div className={styles.elegantSkillRow}>
              {skillItems(data.skills).map((s) => (
                <span key={s} className={styles.elegantSkill}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
