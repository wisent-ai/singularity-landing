// The `singularity activity` page, from the Singularity checkout:
// config/mod.rs for the verb and its input, domain/activity.rs read_journal
// for what is read and every refusal.
export const activitySummary =
  "Read a being's activity journal, every event oldest first, without changing its state.";

export const activitySource = `# \`singularity activity\`

The activity journal (\`activity.jsonl\` in the being's state directory) is the history the runtime appends to: cycle starts, model usage, cost debits, tool outcomes, imports, warnings and stops. \`singularity activity list\` reads it; nothing in this command creates, changes or locks the state directory, so it is safe while \`singularity run\` owns the being. Singularity Desktop reads the same journal for its activity feed and refuses a damaged line the same way.

## \`singularity activity list\`

\`\`\`bash
singularity activity list --state-dir /path/to/being-state
singularity --text activity list --state-dir /path/to/being-state
\`\`\`

\`--state-dir\` also reads \`SINGULARITY_STATE_DIR\`; no directory is assumed. The command prints \`journal\` (the file read) and \`events\`, every journal record as it was written, oldest first. A journal that does not exist yet, or is empty, lists no event. Global \`--text\` prints the same document as indented lines.

## Refusals

The whole journal is refused rather than shown in part, so a damaged history never reads as a shorter complete one. Each refusal exits 4 and names the journal; a line refusal also names its physical line, counting from one, with blank lines inside the journal counted and refused:

- \`state: activity journal <path> cannot be read: <cause>\` — the file exists but cannot be read (permissions, a directory in its place, an I/O error);
- \`state: activity journal <path> is not UTF-8: <cause>\`;
- \`state: activity journal <path> line <n> is not JSON: <cause>; the journal is damaged and no line of it was shown\`;
- \`state: activity journal <path> line <n> is not a JSON object; the journal is damaged and no line of it was shown\`;
- \`state: activity journal <path> line <n> has no type; the journal is damaged and no line of it was shown\`.

A missing \`--state-dir\` with no \`SINGULARITY_STATE_DIR\` is a usage error (exit 2). To repair a damaged journal, keep a copy, then remove or correct the named line; the runtime only appends, so later lines are unaffected.`;
