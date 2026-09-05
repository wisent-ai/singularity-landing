import definition from "./onboarding_first_use.json";

export const journey = definition;
export const PROGRESS_COOKIE = "singularity_landing_first_use";
export const PROGRESS_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
} as const;

export interface FirstUseProgress {
  product_id: string;
  journey_id: string;
  journey_version: string;
  status: "in_progress" | "completed";
  evidence: Record<string, boolean>;
  started_at: string;
  completed_at?: string;
}

export interface WalkthroughStep {
  screen_id: string;
  title: string;
  body: string;
  action_label: string;
  dismiss_label: string | null;
}

export function walkthroughSteps(): WalkthroughStep[] {
  type Screen = (typeof journey.screens)[number];
  const byId = Object.fromEntries(journey.screens.map((screen) => [screen.screen_id, screen])) as Record<string, Screen>;
  const steps: WalkthroughStep[] = [];
  const seen = new Set<string>();
  let current: Screen | undefined = byId[journey.entry_screen_id];
  while (current && !seen.has(current.screen_id)) {
    seen.add(current.screen_id);
    const presentation = current.presentation as Record<string, string | undefined>;
    steps.push({
      screen_id: current.screen_id,
      title: presentation.title ?? current.title_key,
      body: presentation.body ?? current.body_key,
      action_label: presentation.action_label ?? "Next",
      dismiss_label: presentation.dismiss_label ?? null,
    });
    const transitions: { next_screen_id: string; priority: number }[] = current.transitions;
    const next = [...transitions].sort((left, right) => left.priority - right.priority)[0];
    current = next ? byId[next.next_screen_id] : undefined;
  }
  return steps;
}

export function serializeProgress(progress: FirstUseProgress): string {
  return Buffer.from(JSON.stringify(progress)).toString("base64url");
}

export function parseProgress(value: string | undefined): FirstUseProgress | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<FirstUseProgress>;
    if (parsed.journey_version !== journey.journey_version || (parsed.status !== "in_progress" && parsed.status !== "completed")) return null;
    return {
      product_id: journey.product_id,
      journey_id: journey.journey_id,
      journey_version: journey.journey_version,
      status: parsed.status,
      evidence: typeof parsed.evidence === "object" && parsed.evidence ? parsed.evidence : {},
      started_at: typeof parsed.started_at === "string" ? parsed.started_at : new Date().toISOString(),
      completed_at: typeof parsed.completed_at === "string" ? parsed.completed_at : undefined,
    };
  } catch {
    return null;
  }
}

export function replayedProgress(): FirstUseProgress {
  return {
    product_id: journey.product_id,
    journey_id: journey.journey_id,
    journey_version: journey.journey_version,
    status: "in_progress",
    evidence: {},
    started_at: new Date().toISOString(),
  };
}

export function completedProgress(previous: FirstUseProgress | null, recordSuccess: boolean): FirstUseProgress {
  const base = previous ?? replayedProgress();
  return {
    ...base,
    status: "completed",
    evidence: recordSuccess ? { ...base.evidence, [journey.first_success_fact]: true } : base.evidence,
    completed_at: new Date().toISOString(),
  };
}
