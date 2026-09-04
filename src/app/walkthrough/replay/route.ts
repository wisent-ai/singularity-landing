import { NextResponse } from "next/server";
import { PROGRESS_COOKIE, PROGRESS_COOKIE_OPTIONS, replayedProgress, serializeProgress } from "@/lib/onboarding/first-use";

export function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/?walkthrough=replayed", request.url), 303);
  response.cookies.set(PROGRESS_COOKIE, serializeProgress(replayedProgress()), PROGRESS_COOKIE_OPTIONS);
  return response;
}
