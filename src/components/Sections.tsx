import type { Artifact, Section } from "@/content/types";

/**
 * Technical copy names commands and fields, and a product page that prints
 * `stado capabilities --json` with the backticks intact reads as unfinished.
 * Backtick spans become inline code; nothing else in the copy is interpreted,
 * so no plan can inject markup.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split("\`");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <code key={index}>{part}</code> : <span key={index}>{part}</span>,
      )}
    </>
  );
}

function ArtifactView({ artifact }: { artifact: Artifact }) {
  if (artifact.type === "terminal") {
    return (
      <figure className="artifact">
        <pre className="artifact__body" tabIndex={0} role="group" aria-label={artifact.caption}>
          <code>{artifact.lines.join("\n")}</code>
        </pre>
        <figcaption>{artifact.caption}</figcaption>
      </figure>
    );
  }

  if (artifact.type === "code") {
    return (
      <figure className="artifact">
        <pre className="artifact__body" tabIndex={0} role="group" aria-label={artifact.caption}>
          <code data-language={artifact.language}>{artifact.code}</code>
        </pre>
        <figcaption>{artifact.caption}</figcaption>
      </figure>
    );
  }

  return (
    <div className="artifact artifact--table">
      <table>
        <caption>{artifact.caption}</caption>
        <thead>
          <tr>
            {artifact.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {artifact.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={cell} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={cell}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SectionView({ section }: { section: Section }) {
  const headingId = section.id + "-heading";

  if (section.kind === "recognition") {
    return (
      <section id={section.id} aria-labelledby={headingId}>
        <div className="shell">
          <h2 id={headingId} className="section-heading">
            {section.heading}
          </h2>
          <p className="section-lede"><Rich text={section.lede} /></p>
          <div className="card-grid">
            {section.items.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p><Rich text={item.text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.kind === "mechanism") {
    return (
      <section id={section.id} aria-labelledby={headingId}>
        <div className="shell">
          <h2 id={headingId} className="section-heading">
            {section.heading}
          </h2>
          <p className="section-lede"><Rich text={section.lede} /></p>
          <ol className="steps">
            {section.items.map((item) => (
              <li key={item.step}>
                <span className="steps__number" aria-hidden="true">
                  {item.step}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p><Rich text={item.text} /></p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  if (section.kind === "proof") {
    return (
      <section id={section.id} aria-labelledby={headingId}>
        <div className="shell">
          <h2 id={headingId} className="section-heading">
            {section.heading}
          </h2>
          <p className="section-lede"><Rich text={section.lede} /></p>
          <ArtifactView artifact={section.artifact} />
        </div>
      </section>
    );
  }

  if (section.kind === "objection") {
    return (
      <section id={section.id} aria-labelledby={headingId}>
        <div className="shell">
          <h2 id={headingId} className="section-heading">
            {section.heading}
          </h2>
          <div className="qa">
            {section.items.map((item) => (
              <div className="qa__item" key={item.question}>
                <h3>{item.question}</h3>
                <p><Rich text={item.answer} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
}
