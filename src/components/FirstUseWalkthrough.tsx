"use client";

import { useState } from "react";
import type { WalkthroughStep } from "@/lib/onboarding/first-use";

export function FirstUseWalkthrough({ steps }: { steps: WalkthroughStep[] }) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const last = index === steps.length - 1;

  return (
    <div className="first-use-scrim" role="dialog" aria-modal="true" aria-label="Welcome to Singularity">
      <div className="first-use-card">
        <div className="first-use-topline"><span>First visit</span><span>{index + 1} / {steps.length}</span></div>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
        <div className="first-use-progress" aria-hidden="true">
          {steps.map((entry, position) => <i key={entry.screen_id} className={position <= index ? "is-done" : undefined} />)}
        </div>
        <div className="first-use-actions">
          {last
            ? <a className="first-use-primary" href="/visit/runtime">{step.action_label} <b>→</b></a>
            : <button className="first-use-primary" type="button" onClick={() => setIndex(index + 1)}>{step.action_label} <b>→</b></button>}
          <form action="/walkthrough/dismiss" method="post"><button className="first-use-dismiss" type="submit">{last ? (step.dismiss_label ?? "Close the walkthrough") : "Skip the walkthrough"}</button></form>
        </div>
      </div>
    </div>
  );
}
