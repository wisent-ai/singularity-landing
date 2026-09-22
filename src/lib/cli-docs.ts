const requiredRuntimeInvocation = String.raw`--agent-id <id> \
  --role <role> \
  --environment <environment> \
  --host <host> \
  --workload-id <id> \
  --workload-public-key <64-lowercase-hex> \
  --executable-digest <64-lowercase-hex> \
  --code-digest <64-lowercase-hex> \
  --policy-digest <64-lowercase-hex> \
  --policy-sequence <integer> \
  --las-release-manifest <absolute-file> \
  --las-release-manifest-signature <absolute-file> \
  --las-release-trust-store <absolute-file> \
  --las-release-watermark <absolute-path>`;

const runtimeInputs = `## Required inputs

The command requires these options, or their named environment-variable equivalents:

- \`--agent-id\` (\`SINGULARITY_AGENT_ID\`), \`--role\` (\`SINGULARITY_ROLE\`), \`--environment\` (\`SINGULARITY_ENVIRONMENT\`), \`--host\` (\`SINGULARITY_HOST\`), and \`--workload-id\` (\`SINGULARITY_WORKLOAD_ID\`). Each is a 1–128 byte immutable identifier using only ASCII letters, digits, \`-\`, \`_\`, \`.\`, or \`:\`.
- \`--workload-public-key\`, \`--executable-digest\`, \`--code-digest\`, and \`--policy-digest\`. Each value is exactly 64 lowercase hexadecimal characters.
- \`--policy-sequence <integer>\`.
- \`--las-release-manifest\`, \`--las-release-manifest-signature\`, and \`--las-release-trust-store\`. Each must name an absolute regular file. \`--las-release-watermark\` must be absolute.
- Brama signing material: either \`--brama-secret-file <owner-only-file>\` / \`BRAMA_HMAC_SECRET_FILE\`, or \`WISENT_APP_AGENT_AUTH_SECRET\` when no file is supplied.
- Brama caller authorization: \`--brama-bearer-file <owner-only-file>\` / \`BRAMA_BEARER_TOKEN_FILE\` is required separately. An HMAC identity signature does not replace the bearer.

## Runtime options

- Persona: \`--agent-name MyAgent\`, \`--agent-ticker AGENT\`, \`--agent-type general\`, and \`--specialty general\`.
- State and loop: \`--stimulus <text>\`, optional \`--import-file <singularity-mind-import-v1.json>\`, \`--starting-balance 10\`, \`--instance-price 0\`, \`--cycle-interval-secs 5\`, \`--max-tool-rounds 8\`, \`--state-dir .singularity\`, \`--workspace .\`, and \`--resume\`. On \`run\` and \`once\`, the complete import is validated before a new state is created and persisted before the first model call.
- Brama: \`--brama-url http://127.0.0.1:8081\`, \`--brama-model any\`, \`--max-tokens 2048\`, \`--temperature 0.2\`, \`--input-price 0\`, and \`--output-price 0\`.
- Las: \`--las-command node\`, \`--las-entrypoint ../las/src/mcp.mjs\`, \`--las-only <csv>\`, \`--las-skip <csv>\`, and \`--required-surfaces skarbiec,finance\`.
- Most and transport: \`--most-url http://127.0.0.1:8080\`, optional \`--most-token-file <owner-only-file>\`, \`--http-timeout-secs 120\`, and \`--shutdown-grace-secs 10\`. MCP calls wait for completion or explicit cancellation; the removed \`--mcp-timeout-secs\` option is no longer accepted.

Managed bootstrap and Las children retain an absolute \`HOME\` owned by the current Unix principal and not writable by another principal. Their executable search starts with \`$HOME/.local/bin\` and \`$HOME/.stado/bin\`, followed by the fixed operating-system and package-manager directories. A missing or unsafe home is refused, not replaced with another account's home. Ecosystem execution passes its configured Brama bearer, signing secret and agent identity into Jeden explicitly, with request state isolated under the ecosystem owner's directory.

Every flag above also has the environment-variable spelling exposed by \`singularity <command> --help\`.`;

const commonRuntimeRefusals = `## Configuration refusals

Before contacting a surface or writing being state, the runtime refuses with the exact relevant message when:

- stimulus exceeds 65536 bytes or contains NUL: \`configuration: stimulus must be at most 65536 bytes and contain no NUL\`;
- the workspace cannot be resolved or is not a directory: \`configuration: workspace: <error>\` or \`configuration: workspace must be a directory\`;
- \`--max-tool-rounds\` is zero: \`configuration: max tool rounds must be positive\`;
- a starting balance or price is negative: \`configuration: prices and balance cannot be negative\`;
- temperature is not finite or is outside 0 through 2: \`configuration: temperature must be finite and between zero and two\`;
- the Las entrypoint is not a file: \`configuration: LAS entrypoint not found: <path>\`;
- a release manifest, signature, or trust-store path is not absolute or not a regular file: \`configuration: <label> must be an absolute regular file\`;
- the watermark path is relative: \`configuration: LAS release watermark must be an absolute path\`;
- an immutable identity component is invalid: \`configuration: <label> is not a valid immutable identifier\`;
- a public key or digest is malformed: \`configuration: <label> must be 64 lowercase hexadecimal characters\`;
- neither Brama secret source exists: \`secret file: BRAMA_HMAC_SECRET_FILE or WISENT_APP_AGENT_AUTH_SECRET is required\`;
- a secret path is not a regular file, is group/world accessible, or is empty: \`secret file: not a regular file: <path>\`, \`secret file: <path> must not be group/world accessible\`, or \`secret file: <path> is empty\`.

Clap refuses a missing required option before runtime code executes. Configuration and secret refusals exit 2; upstream Brama, Las/MCP, or Most failures exit 3; state or I/O failures exit 4; tool, runtime, or JSON failures exit 5.`;

const strictStateRefusals = `## State refusals

Boot is deliberately strict:

- Existing state without \`--resume\` is refused as \`state: state already exists at <path>; use --resume or a new directory\`.
- \`--resume\` with no saved state is refused as \`state: resume requested but no state exists\`.
- \`--resume\` with a different configured identity is refused as \`state: resume identity does not match configuration\`.

A fresh state directory without \`--resume\` creates a new being. A matching saved identity with \`--resume\` continues it.`;

export type CliDocPage = {
  slug: string;
  title: string;
  summary: string;
  section: string;
  source: string;
};

export const cliCommandPages: readonly CliDocPage[] = [
  {
    slug: "cli/run",
    title: "singularity run",
    summary: "Run autonomous cycles continuously while the being remains solvent.",
    section: "CLI commands",
    source: `# \`singularity run\`

Run the persistent being continuously. It boots the configured identity and surfaces, performs autonomous cycles while the remaining budget is above zero, and sleeps between cycles.

## Invocation

\`\`\`bash
singularity run \\
  ${requiredRuntimeInvocation}
\`\`\`

${runtimeInputs}

## Output and state effect

The command creates or resumes the owner-only state directory, saves \`state.json\`, and appends lifecycle, model, cost, tool, warning, and stop records to \`activity.jsonl\`. It normally writes operational logs rather than a final report to stdout. \`--stimulus\` contributes one external observation to the first cycle only.

Ctrl-C cancels the loop. Shutdown saves state, asks Las to stop within \`--shutdown-grace-secs\`, and records a final \`stopped\` event with status \`stopped\` or \`exhausted\`. A permanent Brama error aborts; other cycle errors become warning journal events and the next cycle proceeds after the configured interval.

${strictStateRefusals}

${commonRuntimeRefusals}`,
  },
  {
    slug: "cli/once",
    title: "singularity once",
    summary: "Execute exactly one autonomous cycle and print its persisted report.",
    section: "CLI commands",
    source: `# \`singularity once\`

Boot the being, execute exactly one autonomous cycle, shut down Las, and return the cycle report.

## Invocation

\`\`\`bash
singularity once \\
  ${requiredRuntimeInvocation}
\`\`\`

${runtimeInputs}

## Output and state effect

After a successful cycle and successful Las shutdown, stdout receives pretty JSON with \`cycle\`, \`status\`, \`final_content\`, \`balance_usd\`, \`earned_usd\`, \`net_profit_usd\`, \`total_tokens\`, and ordered \`actions\`. Status is \`completed\`, \`tool_round_limit\`, or \`budget_exhausted\`.

The cycle counter, conversation, mind, budget, and activity journal are persisted exactly as they are under \`run\`. If the cycle or shutdown fails, no report is printed; the classed error is printed to stderr by the binary.

${strictStateRefusals}

${commonRuntimeRefusals}`,
  },
  {
    slug: "cli/doctor",
    title: "singularity doctor",
    summary: "Preflight Brama, optional Most, Las, and every required tool surface without starting a cycle.",
    section: "CLI commands",
    source: `# \`singularity doctor\`

Run the runtime's read-only connectivity and capability preflight. It starts no autonomous cycle and writes no being state.

## Invocation

\`\`\`bash
singularity doctor \\
  ${requiredRuntimeInvocation}
\`\`\`

${runtimeInputs}

## Checks, output, and state effect

The command checks Brama \`GET /health\`, reads \`GET /v1/models\`, and requires the configured exact model to be present. The selectors \`any\`, \`any-vision-capable\`, and \`task:*\` do not require an exact catalogue match. When \`--most-token-file\` is supplied, it checks that Most has at least one send-capable backend. It then spawns Las and requires at least one \`<surface>__\` tool for every name in \`--required-surfaces\`.

Success prints pretty JSON shaped as \`{"ok":true,"brama_model":...,"most":...,"las_tools":...}\`. \`most\` is null when no token file is configured. The being state directory and activity journal are untouched; Las is stopped before return.

## Doctor-specific refusals

- An exact configured model absent from Brama is refused as \`configuration: configured Brama model is unavailable: <model>\`.
- A configured Most service with an empty or \`none\` backend report is refused as \`most: Most has no send-capable backend\`.
- A missing required Las surface is refused as \`mcp: required Las surface unavailable: <surface>\`.
- Las refusing startup, MCP initialization, tool listing, or shutdown is an upstream failure and exits 3.

${commonRuntimeRefusals}`,
  },
  {
    slug: "cli/tools",
    title: "singularity tools",
    summary: "Print the dynamic Las and built-in tool catalogue as JSON or a tab-separated table.",
    section: "CLI commands",
    source: `# \`singularity tools\`

Spawn Las, build the same dynamic and built-in catalogue exposed to the model, and print it. Direct Most tools are omitted because this command takes no Most credential.

## Invocation

\`\`\`bash
singularity tools \\
  --las-release-manifest <absolute-file> \\
  --las-release-manifest-signature <absolute-file> \\
  --las-release-trust-store <absolute-file> \\
  --las-release-watermark <absolute-path> \\
  [--agent-id <id>] [--format json|table]
\`\`\`

## Required inputs and options

- The four Las release-pinning paths are required by clap. They are passed to Las as \`LAS_RELEASE_MANIFEST_FILE\`, \`LAS_RELEASE_MANIFEST_SIGNATURE_FILE\`, \`LAS_RELEASE_TRUST_STORE_FILE\`, and \`LAS_RELEASE_WATERMARK_FILE\`.
- \`--agent-id\` / \`SINGULARITY_AGENT_ID\` is optional only when Skarbiec is not active. The default \`--las-only\` selection includes \`skarbiec\`, so the default surface set requires an explicit immutable identity.
- \`--las-command node\`, \`--las-entrypoint ../las/src/mcp.mjs\`, \`--las-only <csv>\`, and optional \`--las-skip <csv>\` select the spawned Las process and surfaces.
- \`--format json\` is the default; \`--format table\` selects the compact form. The MCP request and shutdown deadline is fixed at 120 seconds. This command enforces no required-surface list.

## Output and state effect

JSON format prints the full pretty-printed tool definitions, including each function's name, description, and JSON Schema. Table format prints one \`name<TAB>description\` line per tool. The command does not open or write a being state directory. It shuts down the spawned Las process before returning.

## Refusals

- A missing Las entrypoint is refused as \`configuration: LAS entrypoint not found: <path>\`.
- An invalid supplied identity is refused as \`mcp: invalid immutable Las agent identity\`.
- Active Skarbiec without \`--agent-id\` is refused as \`mcp: Skarbiec requires an explicit immutable Las agent identity\`.
- A Las executable that cannot start is refused as \`mcp: cannot start Las: <error>\`; missing stdio is \`mcp: Las stdin unavailable\` or \`mcp: Las stdout unavailable\`.
- An incompatible initialization response is refused as \`mcp: Las negotiated an unsupported MCP version\`.
- Clap refuses missing release-pinning paths or any \`--format\` value other than \`json\` or \`table\` before runtime code executes.

All MCP refusals exit 3; configuration and clap refusals exit 2; JSON serialization failures exit 5.`,
  },
  {
    slug: "cli/import",
    title: "singularity import",
    summary: "Atomically import attributed memory, knowledge, and profile records into an existing being.",
    section: "CLI commands",
    source: `# \`singularity import\`

Import an owner-provided mind document through Singularity's canonical state operation. The operation adds durable memories and provenance; it cannot replace identity or enable a financial tool.

## Invocation

\`\`\`bash
singularity import \\
  --file /path/to/mind.json \\
  --state-dir /path/to/being-state
\`\`\`

For a brand-new being, add \`--import-file /path/to/mind.json\` to the fully configured \`singularity run\` or \`singularity once\` command. The runtime validates the document before creating state and persists accepted records before its first model call.

\`--state-dir\` also reads \`SINGULARITY_STATE_DIR\` and defaults to \`.singularity\`. The being must already exist. If \`singularity run\` owns that state, the command submits the document to its owner-only local service. Otherwise it uses the same import operation with the stopped being's \`ActivityStore\`.

## Accepted document

\`\`\`json
{
  "schema_version": "singularity-mind-import-v1",
  "source": { "kind": "<export type>", "id": "<stable source id>" },
  "memories": [{ "id": "<stable item id>", "text": "<existing memory>" }],
  "knowledge": [{ "id": "<stable item id>", "text": "<existing knowledge>" }],
  "profile": [{ "id": "<stable item id>", "text": "<existing profile fact>" }]
}
\`\`\`

The arrays are optional, but the document must contain at least one real item. \`source.kind\`, \`source.id\`, and every item \`id\` are trimmed identifiers of at most 256 bytes without control characters. Item IDs are unique across all three arrays. Text is trimmed, nonempty, NUL-free, and at most 65,536 bytes. The file must be a regular non-symbolic-link JSON file no larger than 16 MiB, with no unknown fields and at most 1,000 total items.

## Duplicates and retained state

Singularity validates every record before mutation and then writes \`state.json\` once. A repeated source plus item ID with identical category and text is \`unchanged\`. The same text already retained from a different source gains that source attribution and is \`attributed\` rather than duplicated. A repeated source item with different category or text conflicts and refuses the complete document, leaving the original state unchanged.

Memory, knowledge, and profile values are retained in \`mind.memories\` under their respective kind, with \`kind\`, \`source_id\`, and \`item_id\` provenance. A profile item is a remembered fact, not an identity update. The operation never changes \`identity\`, \`system_prompt\`, rules, learnings, current model, budget, finance policy, or available tools, and it does not run a cycle.

## Result and refusals

Success prints pretty JSON with \`accepted\`, \`source_kind\`, \`source_id\`, \`imported\`, \`attributed\`, \`unchanged\`, \`conflicting\`, \`rejected\`, and item \`issues\`. An accepted import appends one \`mind_imported\` activity event. A conflict prints the same refused report, returns a state error, and saves nothing.

Malformed or unsupported input, a missing being, an unavailable active state owner, a live-looking state without its local service, an oversized request, and state I/O failure are refused on stderr. Validation and conflicts never partially import records.`,
  },
  {
    slug: "cli/onboarding",
    title: "singularity onboarding",
    summary: "Show or replay first use, optionally importing an existing mind before the walkthrough.",
    section: "CLI commands",
    source: `# \`singularity onboarding\`

Show Singularity's first-use journey without inventing starter memories or marking a model cycle complete.

## Invocation

\`\`\`bash
singularity onboarding [--reset] \\
  [--import-file /path/to/mind.json] \\
  [--state-dir /path/to/being-state]
\`\`\`

\`--reset\` discards recorded walkthrough progress and evidence before opening the first screen. \`--import-file\` invokes the exact [\`singularity import\`](import) state operation before presentation; \`--state-dir\` selects its destination and otherwise follows \`SINGULARITY_STATE_DIR\` or \`.singularity\`.

The import is optional. Skipping it leaves the existing or empty mind usable. When supplied, the entire document must be accepted and persisted before the walkthrough starts; the command prints the import report and stops immediately on any conflict or rejection. Import success does not complete onboarding. The journey's first-success fact remains \`autonomous_cycle_completed\`, recorded only after a real \`singularity once\` cycle completes.`,
  },
] as const;
