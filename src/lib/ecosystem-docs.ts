import type { DocPage } from "./docs";

const controlInputs = `## Shared control options

\`--state-dir PATH\` selects the live owner; its environment equivalent is \`SINGULARITY_STATE_DIR\`, and its default is \`.singularity\`. Relative paths resolve from the client's working directory. \`--json\` prints the complete version-two response envelope.

The owner and client must have the same Unix identity. An unavailable socket is a refusal, not permission to read cached state. Owner and transport refusals name the operation and return a nonzero exit status. Malformed command arguments are rejected by the CLI parser before a request is sent. See [the ecosystem contract](/docs/ecosystem) for current release availability and wire limits.`;

export const ecosystemPages: readonly DocPage[] = [{
  slug: "ecosystem",
  title: "Autonomous ecosystem",
  section: "Runtime",
  summary: "Durable observations, independently reviewed opportunities, execution and measured outcomes.",
  sourcePath: "singularity/src/ecosystem",
  source: `# Autonomous ecosystem

The ecosystem runtime keeps a portfolio across process restarts. It collects observations even when no defect was reported. A separate model call reviews each proposed opportunity before an initiative exists. A release opens outcome measurement; it is not evidence of adoption or revenue.

Singularity owns direction and allocations. Jeden adapts Pursuit's contract, execution and independent acceptance protocol. Wisent Products owns product identity and installation. Stado owns release qualification and delivery. Echo owns audience, usage and market data. Provider credentials stay with their owners.

**Availability:** The owner commands and Desktop changes described here are source changes awaiting native release and real-owner qualification. End-to-end product delivery and the 72-hour unattended qualification are not established by this page or a source commit.

## Commands

\`singularity ecosystem run --policy /path/to/policy.json\` starts the state owner with the normal identity, Brama and signed Las configuration. Its policy file SHA-256 must equal the delegated identity's policy digest. Missing identity, signed release files or known positive Brama prices is a refusal, not an offline demonstration.

Add \`--start-paused\` to persist the admissions pause before opening control, including when reopening existing state. Omitting that flag preserves the recorded pause; only \`resume\` reopens admission. Add \`--ready-json\` for a flushed stdout event named \`ecosystem_control_ready\` after recovery and socket binding. The event includes the control schema version, socket path, pause state and embedded source revision. It confirms local control availability only, not Las admission, Brama access or successful execution.

Relative \`--state-dir\` values resolve from the process working directory. CLI clients must use the same directory or an equivalent path. Unix socket path limits apply to the path passed to the operating system; a short relative path can address state beneath a long working-directory path. A binding refusal names the socket and operating-system error. Desktop currently requires a socket path that fits its native Unix address limit.

\`singularity ecosystem status --state-dir /path/to/state --json\` reads the live owner's status. The same scope supports \`opportunities\`, \`initiatives\`, \`records [KIND]\`, \`record KIND ID\`, \`explain INITIATIVE_ID\`, \`pause\` and \`resume\`.

The JSON envelope has \`schema_version\`, \`ok\`, and either \`result\` or \`error\`. A refusal includes its operation, code, message and retryability and exits nonzero. The owner-only Unix socket is \`ecosystem.sock\`; a request is one newline-terminated JSON object with version 2, a method, and its \`params\`. Version 1 clients are refused explicitly rather than silently receiving only the first page. Both peers must have the same Unix identity. The request limit is 64 KiB and the response limit is 16 MiB. Oversized results return \`response_too_large\` with the observed size and limit. An unavailable socket never turns cached data into a live response.

Status reports the persisted owner, \`runtime.version\`, \`runtime.source_revision\`, \`las_catalog_ready\`, portfolio counts, allocations and operation failures. The source revision comes from \`WISENT_SOURCE_COMMIT\` at compilation and is null when absent; it is not an installation or qualification receipt. The owner contains the agent, role, environment and workload identity. Catalog readiness means the signed Las catalog passed admission; it does not prove that a product operation succeeded. Until admission succeeds, new selection and dispatch remain blocked while observation and existing-operation reconciliation continue.

## Reading retained evidence

\`opportunities\` and \`initiatives\` return \`items\` and \`next_cursor\`. Their default page holds at most 50 entries. Pass \`--limit\` from 1 through 100 and return \`next_cursor\` as \`--before\` to read older entries. Each collection page also has a byte bound; an individual oversized record must be read through \`record\`, not discarded.

\`records [KIND]\` uses the same paging arguments. Omit KIND for all retained record types, or select a kind such as \`observation\`, \`review\`, \`execution\`, \`execution_response\`, \`outcome\`, \`event\`, \`cognition_input\` or \`cognition_call\`. An unknown or empty kind has an empty collection. \`--initiative-id ID\` selects records carrying that initiative identity, including its event trail. The response contains identities, timestamps, byte lengths and shortened previews; it does not copy whole observation or model-response bodies into a list.

Pages are ordered by insertion, newest first. They are live listings, not a frozen portfolio snapshot: a record can change or disappear between reads. Keep the same filters when returning a cursor. Starting again without a cursor includes newer inserts.

\`record KIND ID --bytes 65536 --offset 0\` reads the first fragment. The byte count must be between 4 and 262144. A result contains \`kind\`, \`id\`, \`offset\`, \`total_bytes\`, \`content_sha256\`, \`text\` and \`next_offset\`. Return \`next_offset\` as \`--offset\` and the first result's digest as \`--revision\`. The owner ends fragments at UTF-8 boundaries; a caller-supplied offset inside a character is refused. Concatenating the decoded text fragments reconstructs the retained JSON bytes. The digest covers those bytes, not the containing response envelopes.

A continuation without its revision is refused. A revision mismatch reports the requested and observed digests and does not return a fragment from the newer record. To read the current version, explicitly restart at offset zero without a revision. An absent record and an offset beyond its end are also refusals.

\`explain ID\` returns the current initiative, opportunity and independent review, plus counts of related records and the parameters for reading their history. It does not assemble an unbounded execution and event history into one response.

The owner upgrades schema-one SQLite state to schema two in the same transaction as its validated startup changes. Old events become \`event\` records with identities \`event-<old event number>\`; their original detail and timestamps remain. New events additionally name the changed record and its content digest. Older records acquire their digest on their first fragment read. Missing schema metadata on nonempty state is refused rather than treated as permission to adopt another history.

Control wire version two does not change the delegated policy, Jeden request or Wisent Products creation schemas; those contracts remain version one.

## Fixed delegated policy

The policy contains:

| Field | Meaning |
| --- | --- |
| schema_version | 1 |
| id | Stable delegation identity |
| model | Exact priced Brama provider/model route, also passed to Jeden |
| workspace_root | Absolute canonical parent of product checkouts |
| product_ids | Existing products the delegation covers |
| allow_product_creation | Whether new private product identities may be provisioned |
| allow_write, allow_command | Whether execution may use the matching runtime grants |
| allow_release | Whether this portfolio may submit and reconcile product delivery |
| budget_usd | Portfolio model-cost allocation, as a decimal string |
| initiative_limit_usd | Maximum allocation to one initiative |
| exploration_budget_usd | Allocation for new products and research |
| model_call_reserve_usd | Fixed reservation per direction or outcome call; the fresh catalog-priced upper bound must fit before inference |
| max_active | Maximum admitted execution concurrency |
| review_interval_seconds | Decision and blocked-operation review cadence |
| observation_interval_seconds | Observation cadence and maximum evidence age |
| sources | product_catalog, product_analytics, market_research, operator_decisions, fleet_services |

Limits and cadences must be positive, except exploration may be zero. The workspace must already exist. State must be owner-only and outside the executor's checkout root. A second process cannot own the same database. A restarted process must use the original policy and owner; a changed file or different execution principal cannot silently widen its authority. The delegated policy sequence may advance but cannot disappear or roll back.

## Decisions and recovery

SQLite keeps observations, opportunities, independent reviews, initiatives, execution identities, outcome decisions, errors and a chronological event trail. A reservation is persisted before a model or executor is called. Unknown costs retain that allocation. A failed execution with complete usage still settles its actual cost; rejection of its implementation does not erase its bill. Repeated settlement must name the same numeric amount. Recording an overrun and pausing admission share one transaction, so interruption cannot commit the excess spend while leaving admission open.

Discovery uses actual observation identities. Empty evidence, stale evidence, missing alternatives, an unmeasurable outcome, an absent rejection condition, unsupported scope or an exhausted allocation prevents admission. Rejected proposals remain in the record. Future decisions receive earlier outcomes rather than treating each cycle as a blank task.

Each reasoning purpose retains its current request identity, exact instructions, evidence and generation settings. Recorded provider responses retain the provider's response ID and token usage. Startup settles known responses without another inference call. A dispatch with no retained response stays indeterminate, keeps its allocation and is not retransmitted. Pending opportunity reviews resume separately; an unresolved review does not prevent review of another proposal. Review refusals use the configured review interval rather than spending again on every scheduler tick. Outcome record IDs derive from their reasoning request, so consuming a retained answer does not create another outcome.

Within one portfolio, a nonterminal initiative retains its product scope through execution, delivery and observation. Another accepted opportunity for that product waits with \`product_scope_busy\` and the retaining initiative's identity. A blocked product does not prevent eligible work for a different product.

Observation readers run independently. An unavailable source records its command and failure without preventing another source or an already-dispatched initiative from progressing. Direction calls also run separately from execution reconciliation.

Jeden receives an immutable request ID and repository scope. Repeating submission reads or continues that request rather than creating another task. Its accepted result must contain a canonical Pursuit contract, verdict and success receipt, plus reviewed source revisions. Changed or unpushed source is not accepted for release. An interrupted mutable tool call without a complete result remains indeterminate and is not blindly replayed.

A new product is provisioned through \`wisent-products create\`. Private repositories and a preview catalog record are not an implemented product. The executor still owes real functionality, canonical documentation, actual tests, installation recipes, commits and push. A missing recipe or first-use result remains a gap.

Release reconciliation retains the exact product, version, source commit and Stado run. If submission returned no identity, the runtime requires an unambiguous matching recorded run before proceeding. Installation read-back must report the exact accepted revision and readiness. An installation receipt does not prove customer impact.

## Outcomes and controls

After delivery, an independent review compares fresh post-release observations with the original expected outcome and rejection condition. It records continue, change, maintain, stop or unknown. Missing telemetry stays unknown. Earlier analytics cannot be relabelled as post-release evidence.

Pause prevents new selection and dispatch. Already-dispatched work may finish; the runtime reads its durable state rather than cancelling or duplicating the effect. Resume restores admission under the same policy. Neither operation increases a budget or grants a capability.

Singularity Desktop's **Ecosystem** screen reads this same owner service. It shows the delegated owner, tool admission, allocations, observation count, hypotheses, alternatives, uncertainty, initiative refusals and initiative explanations. Its pause, resume and refresh controls use the same API. Opportunities and initiatives have older-page controls; Refresh returns to their newest entries. A failed collection read does not erase the other collections that were read successfully.

**Recorded evidence** filters retained records by kind and initiative. It supports older pages, direct reads by kind and ID, and previous/next content fragments with the recorded SHA-256. **Browse execution and outcome history** applies the initiative filter. A changed record requires **Reload current record**; the app does not silently replace its version midway through reading. The record browser remains available when a status or collection request fails.

Changing the selected owner clears the earlier view, and a late response from that owner cannot replace the new owner's data. The screen remains available when the older being \`state.json\` is absent; a connection failure is displayed instead of a healthy cached state.

Desktop owner exchanges use nonblocking sockets and follow task cancellation. Cancelling a view closes its pending exchange without leaving a blocking reader behind. Cancellation does not undo an operation the owner already accepted; an unconfirmed result requires live state read-back before another mutation.

## Qualification boundaries

A running process, a nonempty catalog, a compiled binary or a successful model response does not establish unattended operation. Qualification must retain exact source revisions, actual commands, failures, receipts and supported recordings for proactive selection, existing-product delivery, new-product first use, coordinated source changes, interruption, dependency outages, scope refusal, resource exhaustion and evidence-driven redirection. The 72-hour unattended criterion requires 72 hours of observed operation; it cannot be inferred from a short run.

The reusable local-control journey is \`cargo test --test ecosystem\`, run by the fleet qualification recipe with the actual candidate binary and its normal delegated identity, Brama configuration and signed Las files. Compilation must embed the full \`WISENT_SOURCE_COMMIT\`. \`SINGULARITY_ECOSYSTEM_TEST_POLICY\` must name a real policy with all four mutation grants false and only \`product_catalog\` as its source. Its executor checkout root must not contain the test's isolated state. Missing configuration fails the journey instead of skipping it or substituting a provider.

The journey creates its own paused owner under \`.wisent-output/ecosystem-tests/<run-id>\`, waits for its control-readiness event, checks pagination and reconstructs Unicode records against their actual SQLite bytes. It exercises invalid limits, fragment sizes, offsets, missing and mismatched revisions, absent records and unavailable-owner refusals. It interrupts only its own process group and verifies that the recorded pause and content survive reopening. This qualifies local-control persistence, not external-effect deduplication or autonomous delivery.

The report retains the candidate commit, executable digest, working directory, argv, exit codes or signals, owner output, CLI responses and persisted-state observations. Completed reports are copied into \`WISENT_TEST_EVIDENCE_DIR\` when the fleet supplies it. This source includes the journey but has not established a passing real-owner run or visual Desktop qualification.
`,
}, {
  slug: "cli/ecosystem",
  title: "singularity ecosystem",
  summary: "Select a durable portfolio owner or one of its control operations.",
  section: "CLI commands",
  source: `# \`singularity ecosystem\`

Run \`singularity ecosystem --help\` to list the group. A subcommand is required; this group does not start an owner implicitly.

Use [run](/docs/cli/ecosystem/run) to own the portfolio. Read it with [status](/docs/cli/ecosystem/status), [opportunities](/docs/cli/ecosystem/opportunities), [initiatives](/docs/cli/ecosystem/initiatives), [records](/docs/cli/ecosystem/records), [record](/docs/cli/ecosystem/record) or [explain](/docs/cli/ecosystem/explain). [Pause](/docs/cli/ecosystem/pause) and [resume](/docs/cli/ecosystem/resume) control admission without changing delegation.

These are source contracts awaiting the qualification described in [Autonomous ecosystem](/docs/ecosystem).`,
}, {
  slug: "cli/ecosystem/run",
  title: "singularity ecosystem run",
  summary: "Own persistent portfolio state under one fixed delegated policy.",
  section: "CLI commands",
  source: `# \`singularity ecosystem run\`

## Invocation

\`singularity ecosystem run --policy /absolute/policy.json --state-dir state --start-paused --ready-json\`

Supply the normal identity, Brama authorization and signing material, and signed Las inputs documented under [required runtime inputs](/docs/cli/run). The example does not supply or replace those credentials. The policy's SHA-256 must match the delegated policy digest. [Policy fields and validation](/docs/ecosystem) define portfolio budgets and authority; the older being's starting balance does not allocate portfolio funds.

## State and output

The process owns SQLite state and its Unix control socket. Existing portfolio state reopens under the same owner and policy; it does not require the older being's \`--resume\` flag. \`--start-paused\` persists a pause before the socket opens, including on reopening. Without it, the recorded pause remains unchanged.

\`--ready-json\` emits the flushed \`ecosystem_control_ready\` event after recovery and binding. It reports the schema, socket, pause and embedded source revision. It does not attest Las admission, model access, delivery or installation. The process remains running after this event.

Missing configuration, invalid policy, changed owner, policy rollback, another state owner or an unbindable socket refuses startup. Dependency failures remain observable through control; a listening socket is not proof that those dependencies work.`,
}, {
  slug: "cli/ecosystem/status",
  title: "singularity ecosystem status",
  summary: "Read the live owner, allocations, admission and operation failures.",
  section: "CLI commands",
  source: `# \`singularity ecosystem status\`

\`singularity ecosystem status --state-dir state --json\`

The result reports the persisted owner, pause, runtime version and source revision, signed Las catalog readiness, portfolio counts, allocations and operation failures. A missing compiled source revision is null, not an inferred release. Catalog readiness does not establish successful execution. This command does not change admission or delegation.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/opportunities",
  title: "singularity ecosystem opportunities",
  summary: "Read one bounded page of retained opportunity records.",
  section: "CLI commands",
  source: `# \`singularity ecosystem opportunities\`

\`singularity ecosystem opportunities --state-dir state --limit 50 --json\`

The result contains \`items\` and \`next_cursor\`. Return a non-null cursor with \`--before CURSOR\` to read older inserts. Omit it to restart at the newest inserts. \`--limit\` defaults to 50 and must be between 1 and 100.

This is a live listing, not a frozen snapshot. A record too large for one bounded collection response must be read with [record](/docs/cli/ecosystem/record). Reading an opportunity neither accepts it nor allocates an initiative.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/initiatives",
  title: "singularity ecosystem initiatives",
  summary: "Read one bounded page of admitted initiative records.",
  section: "CLI commands",
  source: `# \`singularity ecosystem initiatives\`

\`singularity ecosystem initiatives --state-dir state --limit 50 --json\`

The result contains \`items\` and \`next_cursor\`, newest insert first. Use \`--before CURSOR\` for older inserts; omit it for a fresh listing. \`--limit\` defaults to 50 and accepts 1 through 100. Records can change between reads.

An oversized collection entry requires [record](/docs/cli/ecosystem/record). Use [explain](/docs/cli/ecosystem/explain) for the current proposal, independent review and retained-history parameters. Listing does not start or repeat execution.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/records",
  title: "singularity ecosystem records",
  summary: "Find retained evidence without copying complete bodies into a listing.",
  section: "CLI commands",
  source: `# \`singularity ecosystem records\`

\`singularity ecosystem records event --state-dir state --initiative-id INITIATIVE_ID --limit 50 --json\`

KIND and \`--initiative-id\` are optional. Omit KIND for all types; an unknown kind returns an empty collection. A row carries its identity, timestamps, byte length and shortened preview. Read its body with [record](/docs/cli/ecosystem/record).

\`--limit\` accepts 1 through 100 and defaults to 50. Return \`next_cursor\` as \`--before\` with the same filters. Pages follow descending insertion order and are not snapshots; restarting without a cursor includes newer inserts.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/record",
  title: "singularity ecosystem record",
  summary: "Read retained JSON in bounded, revision-bound UTF-8 fragments.",
  section: "CLI commands",
  source: `# \`singularity ecosystem record\`

\`singularity ecosystem record event RECORD_ID --state-dir state --offset 0 --bytes 65536 --json\`

KIND and ID are required. \`--offset\` defaults to zero; \`--bytes\` defaults to 65536 and accepts 4 through 262144. The result includes \`kind\`, \`id\`, \`offset\`, \`total_bytes\`, \`content_sha256\`, \`text\` and \`next_offset\`.

For a continuation, pass the returned \`next_offset\` as \`--offset\` and the original digest as \`--revision SHA256\`. Concatenate decoded \`text\` values, not response envelopes. The owner ends each fragment at a UTF-8 boundary.

A nonzero offset without a revision, a changed revision, an absent record, an offset past the end or inside a UTF-8 character, and an invalid byte limit are refusals. A changed record is not silently substituted. Explicitly restart at offset zero without a revision to read its current content.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/explain",
  title: "singularity ecosystem explain",
  summary: "Read an initiative's current decision and bounded history references.",
  section: "CLI commands",
  source: `# \`singularity ecosystem explain\`

\`singularity ecosystem explain INITIATIVE_ID --state-dir state --json\`

The required ID selects an initiative. The result contains its current record, opportunity and independent review, related-record counts and parameters for reading retained history. An unknown initiative is refused. The response does not assemble an unbounded execution trail; use [records](/docs/cli/ecosystem/records) with the returned initiative filter.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/pause",
  title: "singularity ecosystem pause",
  summary: "Persist an admission pause without cancelling dispatched operations.",
  section: "CLI commands",
  source: `# \`singularity ecosystem pause\`

\`singularity ecosystem pause --state-dir state --json\`

The owner persists the pause before acknowledging it. Repeating the command leaves admission paused. New selection and dispatch stop; observations and reconciliation of already-dispatched operations continue. The pause survives owner interruption and reopening.

An interrupted client exchange does not undo an accepted pause. Read [status](/docs/cli/ecosystem/status) to establish the actual state. Pause is not cancellation or revocation of a remote operation.

${controlInputs}`,
}, {
  slug: "cli/ecosystem/resume",
  title: "singularity ecosystem resume",
  summary: "Reopen admission under the existing authority and remaining allocation.",
  section: "CLI commands",
  source: `# \`singularity ecosystem resume\`

\`singularity ecosystem resume --state-dir state --json\`

The owner persists an open admission state. It does not increase the budget, grant capabilities, clear an indeterminate external effect or make an unavailable dependency healthy. Selection and dispatch still require their normal policy, allocation and readiness checks.

An interrupted client exchange can leave the result unknown; read [status](/docs/cli/ecosystem/status) rather than assuming the change was undone.

${controlInputs}`,
}];
