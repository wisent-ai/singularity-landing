export const runbookPage = {
  slug: "runbook",
  title: "Runbook",
  summary: "Interpret runtime, finance and canonical repository refusals without discarding evidence.",
  section: "Reference",
  source: `# Runbook

A refusal identifies a failed operation, not permission to delete its state or bypass its authority. Preserve the original error and state directory. Source-defined messages below describe the contract; they do not claim that a particular installation passed a real flow.

## Configuration and startup

Check [Configuration](configuration) for identity and release-pinning inputs and [Bootstrap](bootstrap) for signed managed launch.

| Message | Interpretation |
|---|---|
| \`configuration: <label> is not a valid immutable identifier\` | The identity component is empty, too long, or contains unsupported characters. |
| \`configuration: <label> must be 64 lowercase hexadecimal characters\` | A key or digest has the wrong encoding. |
| \`configuration: stimulus must be at most 65536 bytes and contain no NUL\` | The observation exceeds its input bound. |
| \`configuration: workspace: <io-error>\` / \`workspace must be a directory\` | The workspace does not resolve to an existing directory. |
| \`configuration: max tool rounds must be positive\` | The configured round limit is zero. |
| \`configuration: prices and balance cannot be negative\` | A configured decimal is negative. |
| \`configuration: temperature must be finite and between zero and two\` | The temperature is outside its accepted range. |
| \`configuration: LAS entrypoint not found: <path>\` | The configured entrypoint is not an existing file. |
| \`configuration: LAS release manifest must be an absolute regular file\` | The manifest, signature or trust-store file is invalid. The watermark must also be absolute. |
| \`configuration: BRAMA_BASE_URL must use http or https\` | The gateway URL uses an unsupported scheme; the same rule applies to Most. |
| \`secret file: not a regular file: <path>\` | A credential does not name a regular file. |
| \`secret file: <path> must not be group/world accessible\` | The credential permissions are too broad. |
| \`secret file: <path> is empty\` | No credential remains after trailing newlines are stripped. |
| \`secret file: BRAMA_HMAC_SECRET_FILE or WISENT_APP_AGENT_AUTH_SECRET is required\` | The runtime has no signing secret. Authorization is separate; see Bootstrap. |

Do not invent an identity, copy another workload's credential or substitute a dummy signed release to make startup pass.

## Las startup

| Message | Interpretation |
|---|---|
| \`mcp: cannot start Las: <os-error>\` | The interpreter or entrypoint could not start. The child has a scrubbed environment; use the intended absolute interpreter path. |
| \`mcp: Las negotiated an unsupported MCP version\` | The peer did not negotiate \`2024-11-05\`. |
| \`mcp: required Las surface unavailable: <surface>\` | The admitted catalogue lacks the required namespace. Inspect release admission and selection; do not silently remove a needed dependency. |
| \`mcp: Skarbiec requires an explicit immutable Las agent identity\` | The selected Skarbiec surface has no agent identity. |
| \`mcp: invalid immutable Las agent identity\` | The supplied identity fails validation. |
| \`tool: duplicate tool: <name>\` / \`invalid tool name: <name>\` / \`tool schema is not an object: <name>\` | The offered catalogue is invalid. |

## Runtime failures

Permanent Brama failures include HTTP 4xx, contradictory completions and rejected signatures. Transient failures include connection errors and HTTP 429/5xx. The runtime journals tolerated failures rather than reporting successful actions. \`once\` returns its first failure; existing state and journal entries still matter.

An indeterminate tool outcome means dispatch may have happened without a reliable response. It must not be automatically replayed as though nothing occurred. \`maximum tool rounds reached\` means a cycle stopped at its configured round bound, not that its objective succeeded.

| State refusal | Interpretation |
|---|---|
| \`state: state already exists at <path>; use --resume or a new directory\` | An existing being must not be silently overwritten. |
| \`state: resume requested but no state exists\` | The directory has no being to resume. |
| \`state: resume identity does not match configuration\` | The immutable identity differs from the stored being. |
| \`state: unsupported state schema <version>\` | The store has an unsupported being schema. Do not delete it to bypass migration. |

Ecosystem state is separate from the being snapshot. Read [Ecosystem](ecosystem) for control commands, record fragments, unknown outcomes, migration and owner availability. A cached Desktop record does not prove that the owner is running.

## Tool outcomes

| Error code | Interpretation |
|---|---|
| \`invalid_arguments\` | The input object or a bounded field was invalid. |
| \`unknown_tool\` | The name was absent from the admitted catalogue. |
| \`remote_tool\` | The Las child returned an error result. |
| \`mcp\` | The transport failed; a dispatched effect may be indeterminate. |
| \`most_unavailable\` | Most's credential was not configured. |
| \`model_unavailable\` | Brama did not advertise the requested model. |
| \`invalid_path\` / \`workspace_boundary\` | The path was invalid or escaped the workspace. |
| \`sensitive_output_rejected\` | The output violated a size, shape or sensitive-output rule. The runtime log carries the reason. |
| \`child_state\` / \`child_executable\` / \`child_spawn\` | Child creation failed at state, executable resolution or process creation. |

## Finance startup

\`singularity-finance-mcp\` exits 1 on startup failure. Required configuration includes \`SINGULARITY_FINANCE_POLICY_FILE\`, \`SINGULARITY_FINANCE_ENABLE_LEASE_FILE\`, \`SINGULARITY_FINANCE_STATE_DIR\`, \`SINGULARITY_FINANCE_EXECUTOR\` and \`SINGULARITY_FINANCE_VERIFY_KEY_HEX\`.

Important refusals include:

- \`policy_denied: SINGULARITY_FINANCE_EXECUTOR must name an executable file\`.
- \`policy_denied: protected file must be owner-only, current-user-owned, regular, and not a symlink\`.
- \`policy_denied: policy signature verification failed\`.
- \`policy_denied: signed policy rollback or equivocation detected\`.
- \`state_error: invalid audit record: …\`.
- \`state_error: audit hash chain validation failed\`.

A rollback refusal means the store already anchored a newer policy or lease. Restore the correct document; do not delete the anchor. An audit refusal means the retained chain failed verification. Preserve the evidence and recover from a verified copy rather than serving over an altered chain.

## Finance operations

| Refusal | Interpretation |
|---|---|
| \`policy_denied: finance enable lease is absent, expired, disabled, or mismatched\` | The lease does not authorize this operation. |
| \`policy_denied: signed enable lease rollback or equivocation detected\` | An older or contradictory lease was presented. |
| \`policy_denied: beneficiary is not in signed policy\` / \`asset is not in signed policy\` | An unknown beneficiary or asset was requested. |
| \`policy_denied: beneficiary is disabled, outside its validity window, or disallows the asset or purpose\` | The beneficiary's authorization does not cover the intent. |
| \`policy_denied: per-transaction limit exceeded\` | The amount exceeds an asset or beneficiary limit. |
| \`policy_denied: rolling, daily, or lifetime limit exceeded\` | Reserving and executed transactions exceed the applicable window; beneficiary limits are checked separately. |
| \`policy_denied: protected reserve would be breached\` | Funds cannot cover the intent without using the protected reserve. |
| \`policy_denied: proposal TTL exceeds signed policy\` / \`proposal validity exceeds beneficiary validity\` | The intent outlives its authorization. |
| \`policy_denied: parameters cannot override protected intent fields\` | Parameters attempted to replace protected intent fields. |
| \`invalid_state: request_id was already used with different intent\` | The request ID is bound to another intent. |
| \`invalid_state: execution requires signed state and completed reconciliation\` | Execution is not admitted in the current state. |
| \`invalid_state: transaction can no longer be cancelled\` | The cancellation conditions no longer hold. |
| \`internal_error: executor refused: <stderr>\` | Dispatch failed after the transaction was marked indeterminate; reconciliation remains required. |
| \`policy_denied: owner event does not approve exact intent hash\` | The signed event describes another intent. |
| \`policy_denied: owner event timestamp outside acceptance window\` | The event's timestamp is not admissible. |
| \`invalid_state: approval requires an independently accepted simulation\` | Simulation evidence has not admitted approval. |
| \`invalid_state: simulation event invalid in current state\` | The simulation event is incompatible with the current lifecycle state. |
| \`invalid_state: signing requires completed timelock and ready state\` | Signing is not admitted yet. |
| \`invalid_state: submission requires signed state and completed reconciliation\` | Submission is not admitted yet. |
| \`invalid_state: confirmation requires submitted, indeterminate, or quarantined state\` | Confirmation is incompatible with the current state. |
| \`invalid_state: terminal transaction state is immutable\` | A terminal transaction cannot be rewritten. |
| \`policy_denied: custody authority is not authorized by signed policy\` / \`independent custody signature verification failed\` | The authority or signature failed verification. |
| \`policy_denied: external WORM receipt is not bound to the exact execution event\` | The receipt does not match the event's identity and reference. |

## HTTP custody adapter

\`singularity-finance-executor-http\` exits 1 on refusal. It requires a credential-free HTTPS \`SINGULARITY_FINANCE_CUSTODY_URL\` and an absolute, regular, non-symlink, current-user-owned, owner-only \`SINGULARITY_FINANCE_CUSTODY_TOKEN_FILE\`.

Its refusals include \`custody token is empty\`, \`execution request exceeds size limit\`, \`custody service refused with HTTP <status>\`, \`custody response exceeds size limit\`, and \`custody response failed validation\`. Validation covers the executor identity, reference, signature and receipt path. The adapter does not retry an ambiguous dispatch.

## Repository operations

Startup errors include \`policy_denied: JEDEN_REPO_POLICY_FILE is required\`, \`policy must be owned by the current user and mode 0600 (or stricter)\`, \`repository root is not a git checkout\`, \`canonical repository operations require main\`, and \`required check "<name>" is not defined\`.

The [Repo surface](repo-surface) documents canonical-checkout admission, ownership, publication readback and migration refusals. There is no proposal-branch or pull-request path.

| Refusal | Interpretation |
|---|---|
| \`policy_denied: repository is not allowlisted\` | The repository ID is not in policy. |
| \`invalid_state: source repository is not clean\` | Existing changes prevent admission. Preserve them. |
| \`policy_denied: repository config contains executable Git filters\` | The repository has clean, smudge or process filters. |
| \`policy_denied: path is outside allowed_paths\` | The requested path is not authorized. |
| \`invalid_state: cannot seal an empty diff\` | There is no change to seal. |
| \`invalid_state: workspace is not sealed\` / \`staged tree changed after seal\` / \`worktree changed after seal\` / \`untracked files appeared after seal\` | The checkout no longer matches the exact sealed evidence. |
| \`policy_denied: check is not allowlisted\` | The check name is not declared. |
| \`invalid_state: required check "<name>" has not run\` / \`lacks successful exact evidence\` | A check lacks successful evidence for the exact sealed tree. |
| \`invalid_state: workspace is already committed\` | One workspace represents one commit. |
| \`command_failed: <operation> failed (exit <code>): <stderr>\` | The named Git operation failed. Retain its actual error. |

A Git whitespace check is not a product test, independent acceptance or installation proof. \`published: true\` records the publication readback; it is not a live service-health result.

## Exit codes

For \`singularity\` and \`singularity-bootstrap\`:

| Code | Meaning |
|---|---|
| 0 | Success for the requested operation. |
| 2 | Configuration, secret-file or usage error. |
| 3 | Upstream Brama, Las or Most failure. |
| 4 | State or I/O error. |
| 5 | Tool, runtime or JSON error. |

After launching a child, Bootstrap returns the child's exit status. Its manifest, digest and capability-redemption refusals use the classes above. MCP servers exit 1 on startup failure; later tool errors are in-band results with \`isError: true\`.`,
};
