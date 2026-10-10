export const configurationPage = {
  slug: "configuration",
  title: "Configuration",
  summary: "Declare identity, accounting and service inputs; preserve the actual consumer's limits and refusals.",
  section: "Reference",
  source: `# Configuration

The CLI names each option and its environment variable in \`singularity <command> --help\`. Managed launches provide identity and workload credentials through [bootstrap](/docs/bootstrap); unmanaged launches must provide the same required inputs. No endpoint, persona name, directory or accounting allowance is inferred.

## Identity and directories

Required identity inputs are \`SINGULARITY_AGENT_ID\`, \`SINGULARITY_AGENT_NAME\`, \`SINGULARITY_AGENT_TICKER\`, \`SINGULARITY_ROLE\`, \`SINGULARITY_ENVIRONMENT\`, \`SINGULARITY_HOST\`, \`SINGULARITY_WORKLOAD_ID\`, \`SINGULARITY_WORKLOAD_PUBLIC_KEY\`, \`SINGULARITY_EXECUTABLE_SHA256\`, \`SINGULARITY_CODE_SHA256\`, \`SINGULARITY_POLICY_SHA256\` and \`SINGULARITY_POLICY_SEQUENCE\`. The compiled persona defaults for \`SINGULARITY_AGENT_TYPE\` and \`SINGULARITY_SPECIALTY\` are \`general\`.

The [identity contract](/docs/concepts/identity) defines identifier grammar, digest encoding, stable fields and permitted renewal on resume. It does not impose an identifier-length ceiling.

\`SINGULARITY_STATE_DIR\` and \`SINGULARITY_WORKSPACE\` are required paths, not assumed working-directory locations. The workspace must resolve to a directory. \`SINGULARITY_RESUME\` defaults to false; enabling it retains the existing being subject to the identity and policy gate.

\`SINGULARITY_STIMULUS\` is an optional first-cycle observation. It must contain no NUL; there is no runtime byte ceiling.

## Accounting and cycles

\`run\`, \`once\`, \`doctor\` and \`ecosystem run\` require:

| Variable | CLI option | Meaning |
|---|---|---|
| \`SINGULARITY_STARTING_BALANCE_USD\` | \`--starting-balance\` | Initial accounting allowance for a new being. |
| \`SINGULARITY_INSTANCE_USD_PER_HOUR\` | \`--instance-price\` | Declared hourly host cost. |
| \`SINGULARITY_CYCLE_INTERVAL_SECS\` | \`--cycle-interval-secs\` | Declared pause between cycles. |

Missing declarations are parser refusals before state creation or service access. Balance and price must not be negative; a free host must explicitly declare zero. Resume keeps the saved budget. Children inherit resolved declarations, including flag overrides. Accounting initialization does not transfer funds.

A cycle continues until the model stops calling tools or solvency fails; there is no configured model-round count. The ecosystem owner's control, reconciliation and dispatch timers use the declared cycle interval, which must be positive for \`ecosystem run\`. Its signed policy separately owns observation, review and allocation values.

## Brama

\`BRAMA_BASE_URL\` and \`BRAMA_MODEL\` are required. The model must be an advertised model or supported selector; no gateway address or model is assumed.

Signing and caller authorization are distinct. \`BRAMA_HMAC_SECRET_FILE\` supplies the signing secret; \`BRAMA_BEARER_TOKEN_FILE\` supplies the caller bearer. A managed bootstrap can hand off each through an unlinked owner-only descriptor. Explicit secret-file options take precedence over their handoffs. Outside a handoff, the existing \`WISENT_APP_AGENT_AUTH_SECRET\` input can supply signing material, but it does not replace caller authorization: a missing bearer is refused with that distinction named.

Secret files must be nonempty regular files with owner-only access. Managed descriptors must also be unlinked and remain close-on-exec except for the explicit child-being inheritance path.

\`BRAMA_MAX_TOKENS\` and \`BRAMA_TEMPERATURE\` are optional and have no defaults. When omitted, no output limit or temperature is sent; the model's catalog output capacity and provider sampling policy apply. A stated temperature must be finite and nonnegative; the provider owns its upper bound and refusal.

Cost uses Brama's caller-scoped catalog price for the served model, including cache reads and writes. Missing catalog models or unusable prices are refusals, not free calls. There are no configured input/output token prices. See [earning and cost record](/docs/concepts/earnings).

## Las and Most

\`LAS_COMMAND\`, \`LAS_MCP_ENTRYPOINT\` and \`LAS_ONLY\` declare the program, entrypoint and selected surfaces. No interpreter, checkout or surface selection is assumed. An empty \`LAS_ONLY\` serves every surface Las offers; \`LAS_SKIP\` optionally excludes surfaces.

\`LAS_RELEASE_MANIFEST_FILE\`, \`LAS_RELEASE_MANIFEST_SIGNATURE_FILE\` and \`LAS_RELEASE_TRUST_STORE_FILE\` must be absolute regular files; \`LAS_RELEASE_WATERMARK_FILE\` must be an absolute path. \`SINGULARITY_REQUIRED_SURFACES\` retains the compiled default \`skarbiec,finance\`; each declared required surface must expose a tool.

\`MOST_SERVICE_TOKEN_FILE\` or the bootstrap Most handoff enables direct messaging. Whenever that credential exists, \`MOST_BASE_URL\` is required. Missing it is refused as \`a Most credential is configured but MOST_BASE_URL (--most-url) is not: no Most address is assumed\`.

A trading surface requires all of \`--trading-proxy-url\`, \`--trading-instance-id\` and \`--trading-auth-secret-file\`, or none. Unmanaged equivalents are \`TRADING_AUTONOMY_PROXY_URL\`, \`TRADING_AUTONOMY_INSTANCE_ID\` and \`TRADING_AUTONOMY_AUTH_SECRET_FILE\`. Managed launches put these arguments in the declared being argument list; the bootstrap does not pass its ambient environment into the being.

## Ecosystem database

The fleet database is resolved through Stado's shared connector using the \`singularity\` consumer and Skarbiec credential route. \`SINGULARITY_STADO_HOME\`, or otherwise \`HOME\`, identifies the connector's host state. Resolve, route, delegated credential read and database failures retain the failed operation and actual cause.

For standalone use, declare \`SINGULARITY_DATABASE_URL\` with a PostgreSQL or MySQL URL and \`SINGULARITY_DATABASE_CA_FILE\` with the server's PEM verification bundle. A URL without its CA file is refused. See [ecosystem storage](/docs/ecosystem#where-the-portfolio-lives) for the owner interface and legacy-state refusal.

## First use and logging

The onboarding journey is offline only when neither \`STADO_INTEGRATION_API_URL\` nor \`SINGULARITY_STADO_INTEGRATION_TOKEN\` is set. Partial, empty or unusable declarations refuse instead of silently selecting offline behavior.

Journey state requires \`SINGULARITY_ONBOARDING_STATE_PATH\`, \`XDG_STATE_HOME\` or \`HOME\`; device identity requires \`USER\`. Unset \`RUST_LOG\` selects \`info\`; a stated but invalid filter is refused.

## Finance, repository and launch authority

Finance configuration names \`SINGULARITY_FINANCE_POLICY_FILE\`, \`SINGULARITY_FINANCE_ENABLE_LEASE_FILE\`, \`SINGULARITY_FINANCE_STATE_DIR\`, \`SINGULARITY_FINANCE_VERIFY_KEY_HEX\` and \`SINGULARITY_FINANCE_EXECUTOR\`. The HTTP executor additionally needs \`SINGULARITY_FINANCE_CUSTODY_URL\` and \`SINGULARITY_FINANCE_CUSTODY_TOKEN_FILE\`; custody owns real signing and execution. See [Finance](/docs/finance).

The repository surface takes \`JEDEN_REPO_POLICY_FILE\` and \`JEDEN_REPO_STATE_DIR\`; [Repo surface](/docs/repo-surface) owns their authority and refusals.

Bootstrap takes \`SINGULARITY_BOOTSTRAP_MANIFEST\`, \`SINGULARITY_BOOTSTRAP_MANIFEST_SIG\`, \`SINGULARITY_BOOTSTRAP_TRUST_ROOT\` and \`SINGULARITY_RUNTIME_ROOT\`. \`singularity ticket launch\` constructs the signed launch from declared \`SINGULARITY_LAUNCH_*\` inputs; its help names each mapping. The installed executable supplies its own measured code and executable digests. \`SINGULARITY_LAUNCH_BEING_ARGS\` is a JSON string array when arguments are not supplied after \`--\`; both or neither is refused.

Bootstrap verifies and redeems credentials, then replaces its process image with the being. It does not remain as a second resident wrapper. See [Bootstrap](/docs/bootstrap) for the complete launch contract.
`,
};
