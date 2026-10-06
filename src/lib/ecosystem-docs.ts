import type { DocPage } from "./docs";

const controlInputs = `## Shared control options

\`--state-dir PATH\` names the live owner's state directory; its environment equivalent is \`SINGULARITY_STATE_DIR\`. It is required: no directory is assumed. \`--json\` prints the whole response envelope; without it a successful answer prints only its \`result\`, and a refusal prints the whole envelope.

The owner and the client must run as the same Unix user. An owner that is not listening is a refusal — \`ecosystem owner unavailable at <socket>: <error>; no cached state is presented as live\` — and every refusal exits nonzero.`;

export const ecosystemPages: readonly DocPage[] = [{
  slug: "ecosystem",
  title: "Autonomous ecosystem",
  section: "Runtime",
  summary: "Durable observations, independently reviewed opportunities, execution through Jeden, delivery through Stado and measured outcomes.",
  sourcePath: "singularity/src/ecosystem",
  source: `# Autonomous ecosystem

The ecosystem runtime chooses work for the Wisent products on its own, without a reported defect, and keeps that portfolio across restarts. It observes the products, proposes opportunities, has each one reviewed by a separate model call, executes accepted ones through Jeden, delivers them through Stado and judges the outcome after release. A release opens outcome measurement; it is not evidence of adoption or revenue.

Singularity owns direction and allocations. Jeden and Pursuit own requirements, execution and independent acceptance. Stado owns product identity and creation (\`stado product\`), release and installation. Echo owns usage and market data. Provider credentials stay with their owners.

## Commands

\`singularity ecosystem run --policy /path/to/policy.json\` starts the owner. It takes every runtime input of [\`singularity run\`](/docs/cli/run): the workload identity, \`--starting-balance\`, \`--instance-price\`, \`--cycle-interval-secs\`, \`--state-dir\`, \`--workspace\`, the Brama URL, model and credentials, and the signed Las inputs. None has a default. The cycle interval paces control, selection, outcome review, Las admission and dispatch.

The read and control commands — \`status\`, \`opportunities\`, \`initiatives\`, \`records\`, \`record\`, \`explain\`, \`pause\` and \`resume\` — talk to the running owner over \`ecosystem.sock\` in its state directory. Each request and each answer is one newline-terminated JSON document with \`schema_version\` 2; an answer carries \`ok\` and either \`result\` or \`error\` with its code, operation, message and retryability.

## Where the portfolio lives

The portfolio — metadata, records and spend reservations — lives in the fleet database \`singularity\`, every row keyed by the being's agent id, reached through Stado's shared connector: \`stado database resolve singularity\`, the Skarbiec route and the \`singularity-database-client\` bearer. A leftover \`ecosystem.sqlite3\` in the state directory is refused at startup.

Each write stores the record and an \`event\` record naming the changed kind, id and content SHA-256 in one transaction. The state directory holds the owner lock \`ecosystem.lock\`, the control socket and the immutable request files handed to Jeden and Stado under \`requests/\`.

## Fixed delegated policy

The policy file's SHA-256 must equal the delegated identity's policy digest, or startup is refused with \`ecosystem policy does not match the delegated identity's policy digest\`.

| Field | Meaning |
| --- | --- |
| schema_version | 1 |
| id | Stable delegation identity |
| workspace_root | Absolute canonical parent of the product checkouts |
| product_ids | Existing products the delegation covers |
| model | Brama model; must equal the runtime's Brama model, and is passed to Jeden |
| allow_product_creation | Whether new private products may be provisioned with \`stado product create\` |
| allow_write, allow_command | Whether Jeden may write and run commands; execution needs both |
| allow_release | Whether accepted work may be released and installed through Stado |
| budget_usd | The portfolio's spend allocation, a decimal string |
| initiative_limit_usd | Largest estimated cost one opportunity may carry |
| exploration_budget_usd | Allocation for product and research opportunities |
| model_call_reserve_usd | Reservation held for each direction or outcome model call |
| max_active | Initiatives that may be open and executing at once |
| review_interval_seconds | Cadence of selection, reviews and blocked-work retries |
| observation_interval_seconds | Cadence of each observation source, and the oldest evidence a decision may cite |
| sources | Any of product_catalog, product_analytics, market_research, operator_decisions, fleet_services |

Budgets, the initiative limit, the call reserve, \`max_active\` and both intervals must be positive; exploration may be zero; no allocation may exceed \`budget_usd\`; \`sources\` must not be empty. Otherwise startup is refused with \`ecosystem policy has an invalid version, scope, budget or observation schedule\`. \`workspace_root\` must be absolute and canonical, and the state directory must be owner-only and outside it.

On restart the persisted policy and owner must be the ones the store was created with, and the policy sequence may advance but not roll back: \`ecosystem authority differs from its persisted policy; authority cannot change on resume\`, \`ecosystem owner differs from its persisted principal; execution credentials cannot change owner on resume\`, \`ecosystem policy sequence is missing or would roll back\`. A second owner of the same state directory is refused by its lock.

## Observation

Each policy source is read on its own cadence; a failing source records an \`observation_failed\` issue and does not stop the others:

| Source | Command |
| --- | --- |
| product_catalog | \`stado product --catalog <workspace_root>/stado/catalog/products.yml catalog --json\` |
| product_analytics | \`echo-cli analytics 7\` |
| market_research | \`echo-cli market\` |
| operator_decisions | \`oko transcripts tasks --open --read-only --json\` |
| fleet_services | \`stado service list --json\` |

## Selection and review

Once per \`review_interval_seconds\`, while fewer than \`max_active\` initiatives are open, one model call proposes proactive work from the latest observations, the portfolio and the policy — or nothing. A proposal must name exact observation ids no older than \`observation_interval_seconds\`, a measurable expected outcome, a rejection condition and alternatives; it is recorded as a proposed opportunity before review.

The review first applies the policy: an estimated cost outside the initiative limit, an invalid product identifier, a product opportunity without \`allow_product_creation\`, or an existing-product opportunity outside \`product_ids\` is rejected without a model call. Otherwise a separate model call reviews it against the same evidence. A rejected opportunity stays in the record.

An accepted opportunity becomes an initiative only while fewer than \`max_active\` are open, while no open initiative holds the same product (it waits with \`product_scope_busy\`), and, for product and research work, while the exploration allocation covers it. Each model call's request, evidence and answer are retained; a call whose answer was recorded settles on restart without asking again.

## Execution and delivery

A product opportunity is first provisioned: \`stado product create --request <file> --allow-create --json\` for the private repositories \`wisent-ai/<id>\`, \`wisent-ai/<id>-desktop\` and \`wisent-ai/<id>-landing\`. Provisioning is not implementation; the executor still owes the product.

The initiative then goes to Jeden as one immutable request: \`jeden pursue --request-file <file> --model <model> --allow-write --allow-command --json\`. Its allocation is reserved before dispatch. A later pass reads \`jeden pursue --status\`, or continues a blocked run with \`--resume-run\`; a request whose outcome is indeterminate is never replayed. A succeeded run must carry an accepted receipt and settles its cost; a cost above the reservation pauses admission.

With \`allow_release\`, the accepted commit's version is read from its \`.wisent-release.json\`, recorded, and submitted with \`stado release submit --source <checkout> --commit <commit> --version <version> --channel stable --json\`; an unanswered submission is resolved from \`stado release status\` and never resubmitted. After the run completes, each catalogued installation is read with \`stado product status\` and must report the accepted revision and readiness.

## Outcomes and controls

After delivery, a model call compares post-release observations with the original expected outcome and rejection condition and records continue, change, maintain, stop or unknown. Missing telemetry is unknown. Later selection reads these outcomes.

Selection, dispatch, provisioning, release and outcome review need open admission: not paused, and the signed Las catalog admitted. Observation and reconciliation of work already dispatched continue while paused. \`pause\` and \`resume\` change only admission; neither grants authority or allocation.

Singularity Desktop's **Ecosystem** screen talks to the same owner socket: the delegated owner, runtime revision, Las readiness, issues, opportunities, initiatives with **Explain decision and delivery** and **Browse execution and outcome history**, **Pause selection** / **Resume selection**, and a record browser that reads a record by kind and id.

## Availability

The runtime ships in source. No host runs an owner until Singularity's service is declared and installed, and no qualification of unattended operation exists yet.
`,
}, {
  slug: "cli/ecosystem",
  title: "singularity ecosystem",
  summary: "Run the durable portfolio owner, or read and control a running one.",
  section: "CLI commands",
  source: `# \`singularity ecosystem\`

Run \`singularity ecosystem --help\` to list the group. A subcommand is required.

Use [run](/docs/cli/ecosystem/run) to own the portfolio. Read it with [status](/docs/cli/ecosystem/status), [opportunities](/docs/cli/ecosystem/opportunities), [initiatives](/docs/cli/ecosystem/initiatives), [records](/docs/cli/ecosystem/records), [record](/docs/cli/ecosystem/record) or [explain](/docs/cli/ecosystem/explain). [Pause](/docs/cli/ecosystem/pause) and [resume](/docs/cli/ecosystem/resume) control admission without changing delegation. How the owner decides is described in [Autonomous ecosystem](/docs/ecosystem).`,
}, {
  slug: "cli/ecosystem/run",
  title: "singularity ecosystem run",
  summary: "Own persistent portfolio state under one fixed delegated policy.",
  section: "CLI commands",
  source: `# \`singularity ecosystem run\`

## Invocation

\`singularity ecosystem run --policy /absolute/policy.json [--start-paused] [--ready-json]\` with every runtime input of [\`singularity run\`](/docs/cli/run): identity, \`--starting-balance\`, \`--instance-price\`, \`--cycle-interval-secs\`, \`--state-dir\`, \`--workspace\`, Brama and the signed Las inputs. The policy's SHA-256 must equal \`--policy-digest\`; its fields are listed under [fixed delegated policy](/docs/ecosystem).

## State and output

The process takes the owner lock in the state directory, opens the portfolio in the fleet database \`singularity\`, recovers retained model answers and execution results, and opens \`ecosystem.sock\`. \`--start-paused\` records a pause before the socket opens; without it the recorded pause is unchanged.

\`--ready-json\` prints one flushed line, \`{"schema_version":2,"event":"ecosystem_control_ready","socket":…,"paused":…,"source_revision":…}\`, once control is listening. It does not attest Las admission, model access or delivery. The process keeps running until it is cancelled or a background operation stops.

An invalid policy, a changed owner or policy, a policy sequence that rolls back, another owner of the directory, a leftover \`ecosystem.sqlite3\` or an unbindable socket refuses startup. Dependency failures after startup are recorded as issues, read with [status](/docs/cli/ecosystem/status).`,
}, {
  slug: "cli/ecosystem/status",
  title: "singularity ecosystem status",
  summary: "Read the live owner, admission, counts, spend and operation issues.",
  section: "CLI commands",
  source: `# \`singularity ecosystem status\`

\`singularity ecosystem status --state-dir STATE --json\`

The result reports \`paused\`, \`las_catalog_ready\`, the persisted \`owner\`, \`runtime.version\` and \`runtime.source_revision\` (null when none was compiled in), \`last_progress_at\`, \`active_count\`, the observation, opportunity and initiative counts, \`spent_usd\`, \`reserved_usd\`, \`budget_usd\` and the open \`issues\`. It changes nothing.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/opportunities",
  title: "singularity ecosystem opportunities",
  summary: "List recorded opportunities, newest first.",
  section: "CLI commands",
  source: `# \`singularity ecosystem opportunities\`

\`singularity ecosystem opportunities --state-dir STATE [--limit N] [--before CURSOR] --json\`

The result contains \`items\` and \`next_cursor\`, newest insert first. Without \`--limit\` every opportunity is listed. With it, a non-null \`next_cursor\` passed as \`--before\` reads older entries. A limit of zero or a cursor that is not positive is refused: \`records takes a limit of at least 1 when given and a positive before cursor\`.

Listing neither accepts an opportunity nor allocates an initiative.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/initiatives",
  title: "singularity ecosystem initiatives",
  summary: "List initiatives and their state, newest first.",
  section: "CLI commands",
  source: `# \`singularity ecosystem initiatives\`

\`singularity ecosystem initiatives --state-dir STATE [--limit N] [--before CURSOR] --json\`

The result contains \`items\` and \`next_cursor\`, newest insert first; every initiative is listed unless \`--limit\` is given. Paging and its refusal are those of [opportunities](/docs/cli/ecosystem/opportunities). Use [explain](/docs/cli/ecosystem/explain) for one initiative's opportunity and review. Listing does not start or repeat execution.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/records",
  title: "singularity ecosystem records",
  summary: "List retained record summaries without their bodies.",
  section: "CLI commands",
  source: `# \`singularity ecosystem records\`

\`singularity ecosystem records [KIND] --state-dir STATE [--initiative-id ID] [--limit N] [--before CURSOR] --json\`

KIND (for example \`observation\`, \`review\`, \`execution\`, \`execution_response\`, \`outcome\`, \`event\`, \`issue\`) and \`--initiative-id\` are optional filters; an unknown kind lists nothing. Each item carries \`kind\`, \`id\`, \`created_at\`, \`updated_at\`, \`total_bytes\`, a \`preview\` and a \`state\`. Every matching record is listed unless \`--limit\` is given; page with \`--before\` and the same filters. Read a body with [record](/docs/cli/ecosystem/record).

${controlInputs}`,
}, {
  slug: "cli/ecosystem/record",
  title: "singularity ecosystem record",
  summary: "Read one retained record whole, or in revision-bound UTF-8 fragments.",
  section: "CLI commands",
  source: `# \`singularity ecosystem record\`

\`singularity ecosystem record KIND ID --state-dir STATE [--offset N] [--bytes N] [--revision SHA256] --json\`

Without \`--bytes\` the record is read whole from \`--offset\` (default 0). The result includes \`kind\`, \`id\`, \`offset\`, \`total_bytes\`, \`content_sha256\`, \`text\` and \`next_offset\`. To read in fragments, pass \`--bytes\`, then each \`next_offset\` as \`--offset\` with the first fragment's digest as \`--revision\`; fragments end at UTF-8 boundaries.

Refusals: \`record bytes must be at least 1 when given; omit it to read the whole record\`, \`continuing a record requires its content_sha256 in revision\`, \`record revision must be a lowercase SHA-256 digest\`, \`unknown record KIND/ID\`, an offset past the end, an offset inside a character, and \`record KIND/ID revision mismatch: requested …, observed …; restart at offset 0 without revision to read its current contents\`.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/explain",
  title: "singularity ecosystem explain",
  summary: "Read one initiative with its opportunity, review and related-record counts.",
  section: "CLI commands",
  source: `# \`singularity ecosystem explain\`

\`singularity ecosystem explain INITIATIVE_ID --state-dir STATE --json\`

The result contains the \`initiative\`, the \`opportunity\` it came from, its independent \`review\`, the count of related records per kind, and \`history\`: the [records](/docs/cli/ecosystem/records) parameters that list its trail. An unknown id is refused with \`unknown initiative ID\`.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/pause",
  title: "singularity ecosystem pause",
  summary: "Stop new admission without cancelling dispatched work.",
  section: "CLI commands",
  source: `# \`singularity ecosystem pause\`

\`singularity ecosystem pause --state-dir STATE --json\`

The owner records the pause and a \`control\` record, then answers with [status](/docs/cli/ecosystem/status). New selection, dispatch, provisioning, release and outcome review stop; observation and reconciliation of already dispatched work continue. The pause survives restarts. It is not cancellation of a remote operation.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/resume",
  title: "singularity ecosystem resume",
  summary: "Reopen admission under the existing authority and allocation.",
  section: "CLI commands",
  source: `# \`singularity ecosystem resume\`

\`singularity ecosystem resume --state-dir STATE --json\`

The owner records open admission and a \`control\` record, then answers with [status](/docs/cli/ecosystem/status). Resuming does not raise a budget, grant authority, clear an indeterminate operation or admit the Las catalog; selection and dispatch still need those checks.

${controlInputs}`,
}];
