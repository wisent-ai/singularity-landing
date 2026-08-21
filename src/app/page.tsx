import PrimaryAction from "@/components/PrimaryAction";
import { Rich, SectionView } from "@/components/Sections";
import plan from "@/content/plan.json";
import site from "@/content/site.json";
import type { Plan, SiteContent } from "@/content/types";

const content = site as SiteContent;
const page = plan as Plan;

const decision = page.sections.find((section) => section.kind === "decision");
const body = page.sections.filter((section) => section.kind !== "decision");

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="shell">
          <p className="eyebrow">{page.hero.eyebrow}</p>
          <h1 id="hero-heading" className="hero__headline">
            {page.hero.headline}
          </h1>
          <p className="hero__lede"><Rich text={page.hero.lede} /></p>
          <div className="actions hero__actions">
            <PrimaryAction action={content.primaryAction} />
            {content.secondaryAction?.target ? (
              <a className="button button--secondary" href={content.secondaryAction.target}>
                {content.secondaryAction.label}
              </a>
            ) : null}
          </div>
          {content.commitment ? <p className="commitment hero__commitment">{content.commitment}</p> : null}
          <ul className="proof-strip">
            {page.hero.proofStrip.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </div>
      </section>

      {body.map((section) => (
        <SectionView key={section.id} section={section} />
      ))}

      {decision && decision.kind === "decision" ? (
        <section className="decision" id={decision.id} aria-labelledby={decision.id + "-heading"}>
          <div className="shell decision__inner">
            <h2 id={decision.id + "-heading"} className="section-heading">
              {decision.heading}
            </h2>
            <p className="section-lede"><Rich text={decision.lede} /></p>
            <div className="actions">
              <PrimaryAction action={content.primaryAction} />
            </div>
            {content.commitment ? <p className="commitment">{content.commitment}</p> : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
