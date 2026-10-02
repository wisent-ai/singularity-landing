#!/usr/bin/env node
// Every command `singularity` dispatches has a page on this site, or this
// refuses. The commands are read from the Clap enums in the Singularity
// checkout (src/config/mod.rs `enum Command`, src/ecosystem/mod.rs
// `enum EcosystemCommand`; each `Name(Args)` variant, lower-cased), the pages
// from the slugs src/lib/cli-docs.ts and src/lib/ecosystem-docs.ts declare.
//
//   node scripts/check-command-coverage.mjs [--singularity-root DIR]
//
// Exit 0 when every command has a page, 1 with the missing ones named, 2 for
// a wrong invocation or an unreadable enum.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
let singularityRoot = resolve(root, "..", "singularity");
for (let index = 0; index < argv.length; index += 1) {
  if (argv[index] === "--singularity-root" && index + 1 < argv.length) {
    index += 1;
    singularityRoot = resolve(argv[index]);
    continue;
  }
  console.error(`check-command-coverage: unknown argument ${argv[index]}`);
  process.exit(2);
}

const variants = (relative, enumName, prefix) => {
  const path = resolve(singularityRoot, relative);
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    console.error(`check-command-coverage: ${path} cannot be read (${error.message}); name the Singularity checkout with --singularity-root`);
    process.exit(2);
  }
  const start = source.indexOf(`pub enum ${enumName}`);
  if (start < 0) {
    console.error(`check-command-coverage: ${path} has no ${enumName} enum`);
    process.exit(2);
  }
  const end = source.indexOf("\n}", start);
  const body = source.slice(start, end < 0 ? undefined : end);
  const names = [...body.matchAll(/^    ([A-Z][A-Za-z]*)\(/gm)].map((match) => `${prefix}${match[1].toLowerCase()}`);
  if (names.length === 0) {
    console.error(`check-command-coverage: ${path} has no variants in ${enumName}`);
    process.exit(2);
  }
  return names;
};

const commands = [
  ...variants("src/config/mod.rs", "Command", "cli/"),
  ...variants("src/ecosystem/mod.rs", "EcosystemCommand", "cli/ecosystem/"),
];

const slugs = new Set();
for (const relative of ["src/lib/cli-docs.ts", "src/lib/ecosystem-docs.ts"]) {
  const text = readFileSync(resolve(root, relative), "utf8");
  for (const match of text.matchAll(/slug: "([^"]+)"/g)) slugs.add(match[1]);
}

const missing = commands.filter((command) => !slugs.has(command));
if (missing.length) {
  console.error(
    `check-command-coverage: ${missing.length} command(s) have no page: ${missing.join(", ")}; add it to src/lib/cli-docs.ts or src/lib/ecosystem-docs.ts`,
  );
  process.exit(1);
}
console.log(`check-command-coverage: every one of ${commands.length} commands has a page`);
