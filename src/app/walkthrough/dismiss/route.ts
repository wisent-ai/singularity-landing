import { NextRequest, NextResponse } from "next/server";
import {
  PROGRESS_COOKIE,
  PROGRESS_COOKIE_OPTIONS,
  completedProgress,
  parseProgress,
  serializeProgress,
} from "@/lib/onboarding/first-use";

export function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  const previous = parseProgress(request.cookies.get(PROGRESS_COOKIE)?.value);
  response.cookies.set(PROGRESS_COOKIE, serializeProgress(completedProgress(previous, false)), PROGRESS_COOKIE_OPTIONS);
  return response;
}
