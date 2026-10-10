export const mindPage = {
  slug: "concepts/mind",
  title: "Mind and memory stores",
  summary: "Persist the complete mind and make every retained memory available to cognition and recall.",
  section: "Concepts",
  source: `# Mind and memory stores

The being's \`state.json\` stores its system prompt, rules, learnings, memories, children and current model. The identity is separate and is not model-writable. Successful mind changes are saved through the runtime's normal state persistence path.

## Tools and validation

\`singularity_self_set_prompt\` replaces the system prompt. \`singularity_self_add_rule\` and \`singularity_self_add_learning\` append entries. \`singularity_memory_remember\` appends a memory with a generated id, kind, text and timestamp. None discards an older entry merely because a fixed row count has been reached.

Text arguments are trimmed, nonempty and free of control characters. Invalid arguments return \`invalid_arguments\` with the field named. These tools do not impose guessed character caps; the actual storage and model consumers can still refuse an operation they cannot accept.

## Cognition and recall

Every cognition request reconstructs its system message from the current system prompt, all self-imposed rules, all persistent learnings and all persisted memories, followed by the conversation. Memories are included newest first. The cycle message includes every recorded action, also newest first. Neither path silently substitutes a fixed-size recent slice.

\`singularity_memory_recall\` matches its query case-insensitively against memory kind or text and returns every match newest first. It reads state without adding a mind-change event. An empty result means no match, not a truncated page.

A model's context limit is a real consumer constraint: Brama or the provider can refuse an oversized request. That refusal is not permission for the runtime to erase or silently hide the older mind.

## Imported memory

[Mind import](/docs/import-existing-mind) preserves attribution and repeat-import identity. Profile imports become profile-kind memories; they do not rewrite the stable identity, budget, financial authority or credentials. A conflicting source item refuses the complete import rather than partially applying it.

## Model selection and persistence

\`singularity_self_switch_model\` accepts a model advertised by Brama or a supported routing selector. The chosen value is retained for subsequent calls and resume. A changed prompt keeps rules and learnings intact because they are stored separately.

Qualification must retain the real imported state, the Brama request and result, recall output, source revision and consumer failures. A source edit or stored memory count alone does not prove that all records reached cognition.`,
};

export const rulePage = {
  slug: "concepts/rule",
  title: "Rule",
  summary: "Persist self-imposed rules without confusing them with enforced authority.",
  section: "Concepts",
  source: `# Rule

\`singularity_self_add_rule\` appends one self-imposed rule to \`state.json → mind.rules\`. Its \`rule\` argument follows the [mind text contract](/docs/concepts/mind): trimmed, nonempty and free of control characters, without a guessed character ceiling. Invalid input returns \`invalid_arguments\` with \`rule is invalid\`.

Rules are append-only. Replacing the system prompt does not erase them, and every cognition request includes all rules under \`Self-imposed rules:\`. A successful tool call saves the state and records its outcome in the activity journal.

A rule guides the model; it is not a runtime authorization. Signed finance policy, capability checks and workspace boundaries remain enforced independently. Learnings use their own persistent section and record what happened rather than prescribing behavior. Neither section has a separate invented text cap.`,
};
