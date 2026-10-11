import type { DocPage } from "../../docs";

export const resumeQualificationPage: DocPage = {
  slug: "walkthrough-first-cycle",
  title: "Managed bootstrap and resume qualification",
  summary: "Exercise real runtime initialization and persisted identity renewal with signed Las and declared credentials.",
  section: "Walkthroughs",
  source: `# Managed bootstrap and resume qualification

A resume must preserve the being's life while accepting the fresh bindings of a legitimate launch. The repository journey \`tests/bootstrap/resume.rs\` exercises that boundary through the actual CLI configuration parser and public \`Agent::bootstrap\` and \`shutdown\` APIs. It starts the real signed Las dependency; a substitute tool server, fabricated launch key or failed model connection is not evidence for this path.

## Prepare the real inputs

Build the candidate with \`WISENT_SOURCE_COMMIT\` and supply that same revision as \`SINGULARITY_TEST_SOURCE_REVISION\`. The dependency environment must be dedicated to qualification: set \`SINGULARITY_TEST_DEPENDENCY_PURPOSE=isolated-qualification\` and provide real signed Las release files and the credential declarations required by the runtime's normal configuration.

\`SINGULARITY_TEST_RESUME_LAUNCHES\` names a JSON file with complete \`once\` argument arrays under these fields:

| Field | Launch to provide |
|---|---|
| \`initial\` | The original valid launch identity and dependencies. |
| \`renewed\` | The same stable being, with a different real workload key and executable digest and a higher declared policy sequence. |
| \`rollback\` | The same stable identity with a policy sequence older than the renewed launch. |
| \`changed_identity\` | A different agent id with a policy sequence not older than the renewed launch. |

The fixture must contain actual launch declarations, not example hashes or credentials. Startup import is refused by this journey. State, workspace and the Las watermark are redirected to a uniquely owned directory beneath the checkout's ignored \`.build/bootstrap-resume/\`; existing being state is never selected.

## Execute and inspect

\`cargo test --test managed-resume -- --ignored --nocapture\`

The first bootstrap persists a real being and shuts down its Las child. The renewed bootstrap must persist its new launch identity without changing the existing mind, budget, conversation, actions or creation identity. The rollback and changed-agent attempts must refuse with the relevant cause and leave the accepted state bytes unchanged.

The run retains \`before.json\`, \`after.json\` and \`report.json\` in its owned directory. A declared configuration is not a passing result: inspect the actual report and refusal causes. The compiled revision must match the declared source revision before any bootstrap begins.

## What this does not qualify

This journey covers runtime initialization and state preservation. It does not issue capabilities, prove a complete ticket-launch handoff, execute an autonomous cognition cycle, or observe Desktop. Those surfaces require their own real flows and retained results. To run a complete cycle, follow [Quick start](/docs/quick-start) with the real Brama and Las dependencies and use [Bootstrap](/docs/bootstrap) for the managed launch contract.

The resume field boundary is defined on [Identity](/docs/concepts/identity); inspect a running being through [State inspection](/docs/walkthrough-state).`,
};

export const examplesPage: DocPage = {
  slug: "examples/examples",
  title: "Qualification programs",
  summary: "Run repository-owned journeys against real dependencies and inspect their retained outcomes.",
  section: "Reference",
  source: `# Qualification programs

The managed-resume target in \`tests/bootstrap/resume.rs\` starts the actual runtime with signed Las and dedicated credential declarations. Its [input and evidence contract](/docs/walkthrough-first-cycle) explains identity renewal, preserved state and meaningful refusals.

\`cargo test --test managed-resume -- --ignored --nocapture\`

This is not an autonomous-cycle test. A complete being cycle uses the real dependencies described in [Quick start](/docs/quick-start), and the managed deployment boundary is [Bootstrap](/docs/bootstrap). Source presence, a printed command or a configuration declaration is not a runtime outcome.

The separate finance example is described under [The finance boundary](/docs/finance) and [Finance walkthrough](/docs/walkthrough-finance). Its evidence does not substitute for managed bootstrap, Las, credential or cognition qualification.`,
};
