export const statePage = {
  slug: "walkthrough-state",
  title: "Inspecting the state stores",
  summary: "Read being, ecosystem, finance and repository evidence without confusing recorded state with a live result.",
  section: "Walkthroughs",
  source: `# Inspecting the state stores

Singularity keeps different records for the being, ecosystem, finance and repository operations. No single snapshot proves that all of them are healthy. This page describes the current stores; it does not present synthetic transactions or unavailable-provider runs as evidence of completed work.

## Being snapshot and journal

The being's \`state.json\` uses schema \`being-v1\`. It contains its immutable identity, persistent mind, budget, conversation, recent actions and tracked resources. Budget values are decimal strings rather than floating-point amounts.

\`activity.jsonl\` records lifecycle and action events. A cycle count can increase before its model request succeeds. Likewise, a stopped process does not prove that an intended external action completed. Inspect model usage, tool outcomes and actual downstream evidence rather than inferring success from a counter or final process state.

The native **Being** activity feed reads the entire journal. Invalid UTF-8
refuses the file read; malformed JSON, a non-object record or a record without
\`type\` names its physical line and cause instead of showing a partial
history. An empty journal is empty; the final line terminator is not another
record. The screen retains the read failure until a later successful refresh.
Only a journal that does not exist is treated as not yet created. Permission,
metadata and file-read failures remain visible errors, not an empty feed.

Mind import preserves the being's identity and authority. Its counts and attribution are documented in [Import existing mind](import-existing-mind).

## Ecosystem database and live owner

The ecosystem portfolio lives in the fleet database \`singularity\`, reached through Stado's shared database connector and scoped by the being's agent id. It retains observations, opportunities, reviews, initiatives, execution identities, outcomes, reservations and event records. The state directory holds the owner lock, control socket and immutable execution request files, not a second portfolio database. See the authoritative [ecosystem storage contract](/docs/ecosystem#where-the-portfolio-lives).

Use the owner interface for normal inspection:

\`singularity ecosystem status --state-dir <state-directory> --json\`

\`singularity ecosystem records --state-dir <state-directory> --json\`

\`singularity ecosystem explain <initiative-id> --state-dir <state-directory> --json\`

These commands address the live owner through \`ecosystem.sock\`. An unavailable owner is a refusal, not permission to present a direct database read as a live response. The native **Ecosystem** screen uses the same owner and can remain available without the older being snapshot.

Startup refuses a leftover \`ecosystem.sqlite3\` rather than opening or silently importing it, naming the file and the state directory: Singularity does not copy that file, so carry its history into the fleet database or move the file out of the state directory before starting the being again. It also refuses unsupported schema versions and nonempty fleet state without schema metadata.

Read complete records through the owner interface rather than treating a summary as the whole record. [Ecosystem](/docs/ecosystem) owns the current collection, fragment, admission and qualification contracts.

## Repository store

\`JEDEN_REPO_STATE_DIR\` contains:

| Entry | Meaning |
|---|---|
| \`repositories/\` | Current repository-to-workspace claims. |
| \`records/\` | Workspace identity, base commit, canonical checkout path, seal, check evidence, commit and published flag. |
| \`requests/\` | Operation, workspace, input fingerprint and recorded response for each request ID. |
| \`locks/\` | Workspace operation locks. |
| \`request-locks/\` | Request operation locks. |
| \`repository-locks/\` | Repository-claim locks. |

There is no current \`workspaces/\` directory containing additional checkouts. The stored field named \`worktree\` points to the policy's canonical checkout on main. Legacy isolated records are not silently adopted or deleted.

An unfinished workspace keeps its repository claim. A published workspace permits a later workspace to claim it. \`proposal_status\` returns retained lifecycle state without inspecting current remote health. A repeated recorded request likewise returns historical evidence. Neither is a new installation or service-readiness check.

The policy-bound operation sequence, non-forced publication and exact refusals are documented in [Repo surface](repo-surface). Check evidence must match the sealed tree. A successful \`git_diff_check\` proves neither product functionality nor independent acceptance.

## Finance store

\`SINGULARITY_FINANCE_STATE_DIR\` keeps transaction histories, request records, policy and lease anchors, the audit chain, and write-ahead commits with their applied markers. A transaction history records its lifecycle transitions and their actors.

An indeterminate dispatch remains unresolved until an authorized reconciliation supplies evidence. A failed executor process is not proof that the external effect did not happen. Terminal states must not be rewritten to hide earlier failures.

The audit records carry sequence and previous-hash links. Startup verifies the chain and refuses malformed records or broken links. Policy and lease anchors prevent older signed authority from silently replacing newer accepted authority. Do not remove anchors or audit records as a recovery shortcut.

Read [Finance](finance) for the signed authority and executor contract and [Runbook](runbook) for the refusal meanings. A local record, signature or test executor does not establish that real custody submitted or confirmed a transaction.

## Preserve evidence

The finance and repository stores enforce owner-only state and policy access. Read their records without rewriting permissions or editing operation results. For a failed flow, retain the exact source revision, command, exit status, raw error and persisted or external final state.

The source changes described here still require the real-owner, real-provider and installed-product qualification described in [Ecosystem](ecosystem). Documentation and a source commit are not substitutes for those runs.`,
};
