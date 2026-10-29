export const loopPage = {
  slug: "loop",
  title: "The loop and solvency",
  summary: "Run model rounds until a plain reply or exhausted budget, accounting for every completion and tool outcome.",
  section: "Reference",
  source: `# The loop and solvency

A cycle appends its framing observation, calls Brama, executes returned tools and retains the resulting accounting and actions. A plain reply ends the cycle, not the being's existence. There is no configured model-round ceiling.

## Cycle transitions

- Before a cycle or model round, the runtime checks that the remaining budget is positive. Failure records \`exhausted\` and reports \`budget_exhausted\`.
- The cycle counter advances and \`cycle_started\` is journaled. The framing message includes balance, earnings, net profit, current model and every recorded action, newest first. The optional stimulus is appended only for the first cycle.
- Cognition reconstructs the complete [mind](/docs/concepts/mind) and sends it with the catalogue to Brama. The runtime obtains the price of the model that actually served the completion, then debits model usage and measured call-time host cost before executing tools.
- A reply without tool calls is saved and reported as \`completed\`, with its \`final_content\`.
- Otherwise tools execute in order. Each outcome becomes a conversation message and action record; tracked Most resource IDs and tool events are retained. State is saved after each tool, then cognition continues subject to solvency.

The report carries cycle, status, final content, balance, earned amount, net profit, total tokens and action names. \`tool_round_limit\` is not a current result: there is no hidden default count at which the runtime abandons an ongoing cycle.

## Cost and revenue

Model cost comes from Brama's caller-scoped catalog for the served model, including cache usage. Host cost uses the measured call duration and declared \`SINGULARITY_INSTANCE_USD_PER_HOUR\`. Exact-decimal accounting records \`model_completed\` and \`cost_debited\`; missing pricing is a refusal rather than an assumed free call.

No tool output credits revenue. Whatever a tool answers, including a \`finance__*\` or \`trading__*\` tool and whatever fields its answer carries, the budget's \`earned\` and \`remaining\` stay as they are: the only thing that may credit the budget is a typed settlement record issued and verified by the finance surface, and no finance surface issues one yet. See [earning and cost record](/docs/concepts/earnings) for the accounting fields and [Finance](/docs/finance) for authority over actual money movement.

## Continuous operation and failures

\`singularity run\` repeats cycles while solvent and not cancelled. Between cycles it uses the explicitly declared \`SINGULARITY_CYCLE_INTERVAL_SECS\`; there is no assumed pause. During this interval it accepts local mind-import requests and watches cancellation.

A permanent Brama error ends the run. Other cycle errors are journaled as warnings before the declared inter-cycle wait. An MCP transport failure during a tool operation is an indeterminate outcome: the remote effect is unknown and the runtime does not automatically replay that tool call. A recorded warning or continued loop is not proof that the failed operation succeeded.

## Shutdown and persistence

Shutdown saves \`stopping\`, closes the Las input, requests SIGTERM for its own child and waits for that child to exit. No guessed grace period triggers SIGKILL. Failure to signal or wait retains the actual cause. A Las server that ignores its shutdown request must be diagnosed at that server rather than represented as a successful shutdown.

The runtime then journals and saves \`stopped\` while solvent, or \`exhausted\` otherwise, and returns any Las shutdown error. Inspect the command result as well as persisted status: a saved final state alone does not establish successful shutdown.

\`--resume\` continues the retained being through its [identity gate](/docs/concepts/identity). It does not reset an exhausted budget. Real qualification must inspect cognition, retained accounting and downstream effects; a counter increment, boot refusal or unavailable-provider run is not a completed cycle.
`,
};
