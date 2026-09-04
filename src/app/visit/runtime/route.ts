import { NextRequest, NextResponse } from "next/server";
import {
  PROGRESS_COOKIE,
  PROGRESS_COOKIE_OPTIONS,
  completedProgress,
  parseProgress,
  serializeProgress,
} from "@/lib/onboarding/first-use";

const RUNTIME_SOURCE = "https://github.com/wisent-ai/singularity";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(RUNTIME_SOURCE, 303);
  const previous = parseProgress(request.cookies.get(PROGRESS_COOKIE)?.value);

  // The visitor has chosen the runtime link and is about to reach its public
  // source. This redirect is the server-side site of that effect, so it records
  // runtime_source_opened; merely advancing or closing the tour never does.
  if (!previous?.evidence.runtime_source_opened) {
    response.cookies.set(PROGRESS_COOKIE, serializeProgress(completedProgress(previous, true)), PROGRESS_COOKIE_OPTIONS);
  }
  return response;
}
