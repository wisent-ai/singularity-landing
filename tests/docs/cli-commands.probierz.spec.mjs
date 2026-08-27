import assert from "node:assert/strict";
import test from "node:test";

const productionOrigin = "https://singularity.wisent.com";
const commands = [
  {
    route: "/docs/cli/run",
    invocation: "singularity run \\\n  --agent-id <id>",
  },
  {
    route: "/docs/cli/once",
    invocation: "singularity once \\\n  --agent-id <id>",
  },
  {
    route: "/docs/cli/doctor",
    invocation: "singularity doctor \\\n  --agent-id <id>",
  },
  {
    route: "/docs/cli/tools",
    invocation: "singularity tools \\\n  --las-release-manifest <absolute-file>",
  },
];

function decodeHtml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'");
}

function canonicalUrl(html) {
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
}

for (const command of commands) {
  test(`${command.route} is the canonical production command page`, async () => {
    const expectedUrl = new URL(command.route, productionOrigin).href;
    const response = await fetch(expectedUrl, { redirect: "follow" });
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.equal(response.url, expectedUrl);
    assert.equal(canonicalUrl(html), expectedUrl);
    assert.ok(
      decodeHtml(html).includes(command.invocation),
      `${command.route} must render its exact invocation`,
    );
  });
}

test("/docs/cli links the complete public command tree", async () => {
  const indexUrl = new URL("/docs/cli", productionOrigin).href;
  const response = await fetch(indexUrl, { redirect: "follow" });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.url, indexUrl);
  assert.equal(canonicalUrl(html), indexUrl);
  for (const { route } of commands) {
    assert.match(html, new RegExp(`href=["']${route.replaceAll("/", "\\/")}["']`));
  }
});
