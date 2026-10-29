export const earningsPage = {
  slug: "concepts/earnings",
  title: "Earning and cost record",
  summary: "Every model call is debited at its catalog price; no tool output credits the budget.",
  section: "Concepts",
  source: `# Earning and cost record

Every model call costs money, and the accounting is the being's most load-bearing state. The record is the \`budget\` object in \`state.json\` plus the paired journal events, written once per event in exact decimal arithmetic, never floating point.

## The budget object

| Field | Meaning |
|---|---|
| \`starting\` | Explicitly declared \`SINGULARITY_STARTING_BALANCE_USD\`; required and refused if negative. |
| \`remaining\` | Current balance; the [solvency](/docs/concepts/solvency) gate reads only this. |
| \`api_spent\` | Cumulative model cost. |
| \`instance_spent\` | Cumulative host cost for the time model calls took. |
| \`total_tokens\` | Lifetime token count (saturating). |
| \`earned\` | Credited revenue. Nothing credits it today, so it stays at zero. |

Net profit is derived, never stored: \`earned − api_spent − instance_spent\`.

## Cost: debited once per completion

Immediately after every Brama completion:

\`\`\`
api      = cost of the reported usage at Brama's catalog price for the served model
instance = elapsed call time in hours × SINGULARITY_INSTANCE_USD_PER_HOUR
remaining -= api + instance
\`\`\`

The catalog price includes cache reads and writes. A missing model price is a refusal, not a zero-cost call. The host's hourly price is also required; a free host declares zero. Two journal events are appended: \`model_completed\` (the usage block) and \`cost_debited\` (the amount).

## Revenue: no tool output credits the budget

The model cannot talk itself richer, and neither can a tool's answer. Whatever a tool returns, whatever its name and whatever fields its answer carries (a \`revenue_usd\` or \`realized_profit_usd\` included), \`earned\` and \`remaining\` are unchanged by it. The only thing that may credit the budget is a typed settlement record that the finance surface itself issues and verifies against its own state; no finance surface issues one yet, so no revenue is credited. What the finance surface does today is [the finance boundary](/docs/finance).

Journals written by older releases may still hold \`revenue_credited\` events; current releases write none.

## Where it lives

- \`state.json → budget\` — the current record, saved atomically with the rest of the being;
- \`activity.jsonl\` — the history: \`model_completed\` and \`cost_debited\` per completion, fsynced on append;
- every \`once\` report repeats the headline numbers: \`balance_usd\`, \`earned_usd\`, \`net_profit_usd\`, \`total_tokens\`.

\`\`\`bash
jq .budget .singularity/state.json
grep -E '"cost_debited"' .singularity/activity.jsonl
\`\`\`

## Not to be confused with

- **[Solvency](/docs/concepts/solvency)** — the gate that reads \`remaining\`; this page is the ledger it reads.
- **The finance transaction ledger** — \`singularity-finance-mcp\` keeps its own hash-chained audit of money moving in the world; the budget records what existence costs.
- **Brama's own billing** — Singularity records the cost quoted by Brama's caller-scoped model catalog; its local budget is not a funds transfer.
`,
};

export const solvencyPage = {
  slug: "concepts/solvency",
  title: "Solvency",
  summary: "The runtime has exactly one unconditional stop: a remaining balance that is not positive.",
  section: "Concepts",
  source: `# Solvency

The runtime has exactly one unconditional stop, and it is not a task being finished: it is \`remaining ≤ 0\`. Solvency is the rule that existence must be paid for, applied as a gate at every point where the being would spend.

## The gate

\`can_call\` is \`budget.remaining > 0\`, checked in exact decimal:

| Checkpoint | On failure |
|---|---|
| Before a cycle starts | The cycle does not start; status becomes \`exhausted\`; the report says \`budget_exhausted\`. |
| Before **every** model round inside a cycle | The same: a being can go broke halfway through a cycle, after a tool has already run. |
| The \`run\` loop condition | \`run\` repeats cycles only while solvent and not cancelled. |
| At shutdown | Final status is \`stopped\` if still solvent, \`exhausted\` if not. |

There is no debt: costs are debited after each completion, so \`remaining\` can cross zero mid-cycle, and the next gate catches it. An \`exhausted\` being's state remains intact and inspectable; nothing is deleted.

## What restores solvency

Only a fresh start with a higher \`SINGULARITY_STARTING_BALANCE_USD\` (a new being) begins with money again. No tool output credits the budget (see [earning and cost record](/docs/concepts/earnings)), and resuming an exhausted being does not reset the balance: \`--resume\` continues the same budget, and the first gate reports \`budget_exhausted\` again. Solvency is recoverable only by the operator's choice.

## How it reads

The framing message opens every cycle with the numbers the model must respect:

\`\`\`
Begin autonomous cycle <n>. Balance: <remaining> USD. Earned: <earned> USD. Net profit: <net> USD. Current model: <model>. Recent actions: <tool:status, …>. Inspect opportunities and choose the next useful action. A plain response ends only this cycle; the being continues living while solvent.
\`\`\`

and the \`once\` report repeats them (\`balance_usd\`, \`earned_usd\`, \`net_profit_usd\`). The initial system prompt makes the demand explicit: *earn more than you spend, preserve your solvency*.

## Where it lives

\`\`\`bash
jq '{status, remaining: .budget.remaining}' .singularity/state.json
\`\`\`

\`status\` is \`exhausted\` exactly when the last gate failed; the final journal event is \`{"type":"stopped", "status":"exhausted", …}\`.

## Not to be confused with

- **The [budget](/docs/concepts/earnings)** — the ledger; solvency is the predicate over it.
- **The protected reserve** — a finance-policy floor on real-world assets enforced by \`singularity-finance-mcp\`; solvency is about the being's own operating balance.
`,
};
