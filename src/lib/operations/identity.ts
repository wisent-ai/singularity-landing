export const identityPage = {
  slug: "concepts/identity",
  title: "Identity",
  summary: "Preserve a being across renewed launch credentials without changing who it is.",
  section: "Concepts",
  source: `# Identity

A being has a stable identity and a binding to its current launch. Both are stored in \`state.json\`; neither is model-writable. A managed launch can renew its workload key or upgrade its executable without discarding the being's mind, memories, budget or actions.

## Stable fields

\`agent_id\`, \`name\`, \`ticker\`, \`agent_type\`, \`specialty\`, \`role\`, \`environment\`, \`host\` and \`workload_id\` must match the saved being on resume. A different persona or host is not a credential rotation.

Identifiers must be nonempty ASCII alphanumerics with \`- _ . :\`. There is no guessed identifier-length ceiling. Invalid input is refused as \`configuration: <label> is not a valid immutable identifier\`.

## Renewed launch binding

\`workload_public_key\`, \`executable_digest\`, \`code_digest\` and \`policy_digest\` come from the new launch. Their hexadecimal format is still validated. \`policy_sequence\` may remain equal or advance, but must not be older than the sequence saved in the being's state.

This matches [managed ticket launch](/docs/bootstrap), which issues a fresh workload key and capabilities for each start. Accepting a renewed binding does not authorize a different stable identity or let the model edit the launch policy.

## Resume and refusals

\`singularity run --resume\` and \`singularity once --resume\` use the same resume gate. Configure the signed deployment and its real dependencies first; these commands execute the being and may perform consequential operations.

- Missing state: \`state: resume requested but no state exists\`.
- Changed stable fields: \`state: resume identity does not match configuration: ...\`, followed by each differing field with its stored and configured value.
- Policy rollback: the same refusal prefix, followed by the launched sequence and the newer sequence last used by this state.
- Existing state without \`--resume\`: the refusal names the state path and requires resume or a new directory.

Refusal is not permission to delete or recreate the existing state. Correct the launch identity or policy through the deployment owner.

## Evidence

Inspect the persisted identity and mind after a real managed resume with renewed credentials, then exercise a stable-identity mismatch and a policy rollback against an isolated being. Retain the launch revision, command results and state. Source presence and a refused model connection do not prove that a managed being resumed and completed a cycle.

The CLI resume gate owns this behavior. Desktop reads the resulting persisted state; it does not issue an alternative identity migration. See [configuration](/docs/configuration), [the being](/docs/being) and [state inspection](/docs/walkthrough-state).`,
};
