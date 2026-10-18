// The live documentation serves every page pushed main declares. Each page is
// a `slug: "…"` followed by its `title: "…"` in a module under src/lib, read
// through git at HEAD, never from the working tree; HEAD must be the main
// origin names. Each page is fetched from the domain src/content/site.json
// declares, following its redirects, and must answer 200 with a body that
// carries the page's title, so a host serving an older site or no page fails
// here naming the page.
//
//   node tests/docs/live.mjs
//
// With SINGULARITY_LANDING_TEST_DEFECT and SINGULARITY_LANDING_TEST_CRITERION
// set, a passing run on committed sources writes criterion.json under
// .build/real-tests/docs-live/<stamp>/ with every page's address, status and
// final URL and the git commands it ran, as observed final state.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { constants, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const self = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(self), "..", "..");
const commands = [];

function git(args) {
  const run = spawnSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: Infinity });
  commands.push({ executable: "git", args, exit: run.status, signal: run.signal });
  if (run.error) throw new Error(`git ${args.join(" ")} could not run: ${run.error.message}`);
  assert.ok(!run.signal && !run.status, `git ${args.join(" ")} failed: ${run.stderr.trim()}`);
  return run.stdout;
}

const head = git(["rev-parse", "HEAD"]).trim();
const [pushed] = git(["ls-remote", "origin", "refs/heads/main"]).split(/\s/);
assert.equal(head, pushed, `HEAD ${head} is not the pushed main ${pushed}; the live site can only be compared with what was pushed`);

const { domain } = JSON.parse(git(["show", `${head}:src/content/site.json`]));
assert.ok(domain, "src/content/site.json declares no domain");

const decode = (text) => text.replaceAll('\\"', '"');
const escape = (text) => text
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#x27;");
const pages = [];
for (const file of git(["ls-tree", "-r", "--name-only", head, "--", "src/lib"]).split("\n").filter((name) => name.endsWith(".ts"))) {
  const source = git(["show", `${head}:${file}`]);
  for (const match of source.matchAll(/slug:\s*"(?<slug>[^"]+)",\s*title:\s*"(?<title>(?:[^"\\]|\\.)+)"/g)) {
    pages.push({ file, slug: match.groups.slug, title: decode(match.groups.title) });
  }
}
assert.ok(pages.length, `no module under src/lib at ${head} declares a page`);

const observed = [];
const failing = [];
for (const page of pages) {
  const address = `${domain}/docs/${page.slug}`;
  const response = await fetch(address);
  const body = await response.text();
  const carries = body.includes(page.title) || body.includes(escape(page.title));
  observed.push({ slug: page.slug, address, status: response.status, final: response.url, carriesTitle: carries });
  if (!response.ok || !carries) failing.push(`${address} (${page.file}): ${response.status} at ${response.url}${carries ? "" : `, without the title ${JSON.stringify(page.title)}`}`);
}
assert.deepEqual(failing, [], `${failing.length} of ${pages.length} pages main ${head} declares are not served:\n${failing.join("\n")}`);
console.log(`docs live: ${domain} serves every one of ${pages.length} pages main ${head} declares`);

const defectId = process.env.SINGULARITY_LANDING_TEST_DEFECT?.trim();
const criterion = process.env.SINGULARITY_LANDING_TEST_CRITERION?.trim();
assert.equal(Boolean(defectId), Boolean(criterion),
  "SINGULARITY_LANDING_TEST_DEFECT and SINGULARITY_LANDING_TEST_CRITERION are named together or not at all");
if (defectId) {
  // The pages and the domain are read through git at HEAD; only this journey
  // runs from the working tree, so only it must be committed.
  const uncommitted = git(["status", "--porcelain", "--", "tests/docs"]);
  assert.equal(uncommitted, "", `commit tests/docs before qualification:\n${uncommitted}`);
  const digest = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
  const out = path.join(root, ".build", "real-tests", "docs-live", new Date().toISOString().replace(/[:.]/g, ""));
  mkdirSync(out, { recursive: true });
  const report = path.join(out, "criterion.json");
  writeFileSync(report, `${JSON.stringify({
    defectId,
    criterion,
    sourceRevision: head,
    result: "passed",
    binarySha256: digest(process.execPath),
    testSha256: digest(self),
    observedFinalState: { domain, pages: observed },
    commands,
  }, null, "  ")}\n`, { mode: constants.S_IRUSR | constants.S_IWUSR });
  console.log(`criterion report: ${report}`);
}
