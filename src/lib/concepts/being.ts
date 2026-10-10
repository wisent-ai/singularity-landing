const lifecycle = `## Lifecycle and retained state

A being persists its identity, mind, budget, conversation, actions, resources and cycle counter in \`state.json\`, with lifecycle and action evidence in \`activity.jsonl\`. See [state inspection](/docs/walkthrough-state) for the stores and their interpretation.

| Existing state | Resume requested | Result |
|---|---|---|
| Absent | No | Create a being from the declared identity, mind and accounting inputs. |
| Absent | Yes | Refuse: \`state: resume requested but no state exists\`. |
| Present | No | Refuse and name the state path; require resume or a new state directory. |
| Present | Yes | Validate stable identity and policy sequence, retain the being, and accept the renewed launch binding. |

The [identity contract](/docs/concepts/identity) distinguishes stable fields from launch keys and digests. Resume does not require a renewed workload key or executable digest to equal the previous launch. A changed stable identity or policy rollback remains a refusal; deleting state is not a repair.

The runtime saves state after mutations and records action outcomes. Its statuses are \`starting\`, \`running\`, \`stopping\`, \`stopped\`, \`exhausted\` and \`failed\`. A process status or increased cycle counter alone does not prove that cognition or an external action succeeded. Concurrent processes must not animate the same being state.
`;

export const beingPage = {
  slug: "being",
  title: "The being",
  summary: "Retain identity, mind and actions across launches without silently dropping older records.",
  section: "Reference",
  source: `# The being

A being is persistent state, not a particular process. Its stable identity is separate from its renewable workload binding and model-writable mind.

## Identity and mind

[Identity](/docs/concepts/identity) owns the stable fields, launch binding and resume refusals. [Mind](/docs/concepts/mind) owns prompt changes, rules, learnings, memory retention, recall and model selection. Every retained memory reaches cognition, and every recorded action is included in the cycle framing; there is no fixed recent-record slice.

The self tools are \`singularity_memory_remember\`, \`singularity_memory_recall\`, \`singularity_self_set_prompt\`, \`singularity_self_add_rule\`, \`singularity_self_add_learning\` and \`singularity_self_switch_model\`. Their validation and persistence are described once in the mind contract rather than copied as separate limits here.

## Workspace tools

\`singularity_file_read\` reads a complete UTF-8 regular file inside \`SINGULARITY_WORKSPACE\`. \`singularity_file_write\` writes NUL-free text through a temporary file and rename, returning the byte count. Neither adds a guessed file-size ceiling.

Paths must contain only relative normal components. Canonical resolution must remain inside the workspace; otherwise the tool returns \`workspace_boundary\`. Writes refuse a symlink or non-regular destination. I/O failures retain their actual cause as \`file_read\` or \`file_write\` outcomes.

## Children

\`singularity_spawn_child\` accepts \`name\`, \`ticker\` and \`specialty\` as trimmed, nonempty text without control characters. It has no separate character ceilings. It creates a child state directory under \`children/<uuid>\` and launches the current executable with \`run\` and the child's persona.

The child receives the declared workspace, initial accounting inputs, cycle interval, Brama model and endpoint, Las selection and release files, and the configured Most endpoint. Credential inheritance goes through the bootstrap boundary; secret values are not child arguments. A failed credential setup or process spawn returns its cause. Successful spawn records the child ID and PID; that is evidence of process creation, not a completed child cycle.

${lifecycle}

## Qualification

Exercise an isolated being through real Brama and Las dependencies, inspect retained records after resume, and verify external effects at their owning service. The runtime can surface a consumer's actual refusal when the complete mind exceeds its capacity; it must not silently discard older state to hide that refusal.
`,
};

export const beingConceptPage = {
  slug: "concepts/being",
  title: "Being",
  summary: "Separate persistent being state from the process and credentials that currently animate it.",
  section: "Concepts",
  source: `# Being

A being survives a process restart because identity, mind, budget, conversation and actions are persisted. A child is a separate being with its own state; a renewed launch binding is not a new being.

${lifecycle}

For tools, workspace confinement and children, read [The being](/docs/being). For the complete memory and action contract, read [Mind](/docs/concepts/mind).
`,
};
