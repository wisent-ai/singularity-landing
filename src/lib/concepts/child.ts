export const childPage = {
  slug: "concepts/child",
  title: "Child",
  summary: "Spawn a separate being with declared accounting and workload credentials.",
  section: "Concepts",
  source: `# Child

\`singularity_spawn_child\` creates a separate being: its own process, state directory, budget and mind. The parent records its creation; the child is not a tool round or a copy of the parent's memories.

## Arguments and result

\`name\`, \`ticker\` and \`specialty\` must be trimmed, nonempty text without control characters. There is no separate byte-length ceiling. Invalid arguments return \`invalid_arguments\` and name the field.

Successful process creation returns \`child_id\` and \`pid\`. The parent adds a \`ChildRecord\` with the UUID, name, ticker, state directory, creation timestamp and \`running\` status to \`mind.children\`. That status describes spawn time; the child's own state and journal establish its later condition.

## Launch declarations

The parent starts its current executable with \`run\`, setting \`SINGULARITY_AGENT_NAME\`, \`SINGULARITY_AGENT_TICKER\`, \`SINGULARITY_SPECIALTY\`, \`SINGULARITY_STATE_DIR\` and \`SINGULARITY_RESUME=false\` for the new being. The state directory is \`<parent-state-dir>/children/<uuid>\`.

Resolved workspace, Brama endpoint and model, Las command, entrypoint, selection and signed release files are passed explicitly. The configured Most endpoint is passed when present. Credential descriptors use the bootstrap inheritance boundary; secrets do not appear in child arguments.

The child also receives the resolved \`SINGULARITY_STARTING_BALANCE_USD\`, \`SINGULARITY_INSTANCE_USD_PER_HOUR\` and \`SINGULARITY_CYCLE_INTERVAL_SECS\`. This preserves inputs supplied as flags even if the parent's environment has no value or a different one. Initial accounting uses the declared starting allowance, not the parent's remaining balance; no funds are transferred by this initialization.

## Refusals

| Outcome | Failed operation |
|---|---|
| \`child_state\` | Creating the child state directory. |
| \`child_executable\` | Resolving the current executable. |
| \`child_credentials\` | Preparing inherited workload credentials. |
| \`child_spawn\` | Starting the process. |

Each outcome includes the actual cause. A successful OS spawn does not prove that the child passed boot gates or completed cognition.

## Independent lifecycle

A child starts from its initial persona prompt, not a copy of the parent's mind, rules or memories. It follows the same [loop](/docs/loop) and [solvency](/docs/concepts/solvency) contract as other beings.

The parent does not supervise, restart or propagate shutdown to this child. The child can outlive it; after a child exits, its retained state can be resumed through the normal [identity gate](/docs/concepts/identity). Inspect \`mind.children\` in the parent and the child's own \`state.json\` and \`activity.jsonl\`; do not treat a historical PID as proof of a live process.
`,
};
