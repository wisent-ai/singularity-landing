import { cookies } from "next/headers";
import { FirstUseWalkthrough } from "@/components/FirstUseWalkthrough";
import { LandingPage } from "@/components/landing-components.js";
import componentPlan from "@/content/components.json";
import plan from "@/content/plan.json";
import site from "@/content/site.json";
import { PROGRESS_COOKIE, parseProgress, walkthroughSteps } from "@/lib/onboarding/first-use";

export default async function Home() {
  const progress = parseProgress((await cookies()).get(PROGRESS_COOKIE)?.value);
  const showWalkthrough = progress === null || progress.status === "in_progress";
  return (
    <>
      <LandingPage site={site} plan={plan} componentPlan={componentPlan} />
      {showWalkthrough ? <FirstUseWalkthrough steps={walkthroughSteps()} /> : null}
    </>
  );
}
