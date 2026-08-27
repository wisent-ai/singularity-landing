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

## Runtime options

- Persona: \`--agent-name MyAgent\`, \`--agent-ticker AGENT\`, \`--agent-type general\`, and \`--specialty general\`.
- State and loop: \`--stimulus <text>\`, \`--starting-balance 10\`, \`--instance-price 0\`, \`--cycle-interval-secs 5\`, \`--max-tool-rounds 8\`, \`--state-dir .singularity\`, \`--workspace .\`, and \`--resume\`.
- Brama: \`--brama-url http://127.0.0.1:8081\`, \`--brama-model any\`, \`--max-tokens 2048\`, \`--temperature 0.2\`, \`--input-price 0\`, and \`--output-price 0\`.
- Las: \`--las-command node\`, \`--las-entrypoint ../las/src/mcp.mjs\`, \`--las-only <csv>\`, \`--las-skip <csv>\`, and \`--required-surfaces skarbiec,finance\`.
- Most and deadlines: \`--most-url http://127.0.0.1:8080\`, optional \`--most-token-file <owner-only-file>\`, \`--http-timeout-secs 120\`, \`--mcp-timeout-secs 120\`, and \`--shutdown-grace-secs 10\`.

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
] as const;
