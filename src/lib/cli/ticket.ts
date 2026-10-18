// The `singularity ticket` page, from src/ticket in the Singularity checkout:
// args.rs for the verbs and their inputs, mod.rs for key and sign, launch.rs
// for the managed start, and bootstrap/mod.rs for the checks the ticket is
// held to.
export const ticketSummary =
  "Write the keys and the signed launch ticket singularity-bootstrap starts a managed being from, or start one end to end.";

export const ticketSource = `# \`singularity ticket\`

\`singularity-bootstrap\` starts a managed being only from a \`singularity.bootstrap.v2\` manifest signed by the supervisor whose public key is its trust root. The manifest names a workload key, the executable's and the policy's digests and three Skarbiec capabilities. \`singularity ticket\` writes those keys and that manifest, and \`ticket launch\` makes all of them for one start and becomes the being.

## \`singularity ticket key\`

\`\`\`bash
singularity ticket key --holder <supervisor|workload> \\
  --out /absolute/private.key --public-out /absolute/public.key
\`\`\`

Writes a fresh Ed25519 key pair, seeded from \`/dev/urandom\`, as two new owner-only files. The private key is its hex seed. The public half depends on its holder: a supervisor's is the hex trust root \`singularity-bootstrap\` is given as \`--trust-root\`; a workload's is the PEM public key \`skarbiec grant issue --workload-public-key-file\` registers, against which Skarbiec verifies every redemption proof. Prints \`private_key\`, \`public_key\` and \`public_key_hex\`.

## \`singularity ticket sign\`

\`\`\`bash
singularity ticket sign --agent-id <id> --role <role> --environment <environment> --host <host> \\
  --workload-id <id> --workload-key /absolute/workload.key --broker-socket /path/to/broker.sock \\
  --executable /path/to/singularity --code-digest <sha256-hex> \\
  --policy-file /path/to/policy --policy-sequence <n> --expires-in-seconds <seconds> \\
  --brama-capability <id> --brama-resource brama:<field> \\
  --brama-bearer-capability <id> --brama-bearer-resource brama:<field> \\
  --most-capability <id> --most-resource most:<field> \\
  --supervisor-key /absolute/supervisor.key --trust-root /absolute/supervisor.pub \\
  --manifest-out /absolute/manifest.json --signature-out /absolute/manifest.sig \\
  -- <singularity arguments>
\`\`\`

Every input is stated; nothing is assumed. The workload key's public half, the SHA-256 of \`--executable\` and of \`--policy-file\` go into the manifest, which expires \`--expires-in-seconds\` after it is issued. Each capability is bound to the target \`singularity-bootstrap\` and its purpose: \`singularity.brama.bootstrap\` for the Brama HMAC, \`singularity.brama.authorization\` for the Brama bearer, \`singularity.most.bootstrap\` for the Most token. The arguments after \`--\` are the ones the bootstrap starts \`singularity\` with.

The manifest is validated by the bootstrap's own rules before anything is written, signed with the supervisor key, written with its signature as new owner-only files, and then checked exactly as \`singularity-bootstrap\` checks it: owner-only files, the signature against \`--trust-root\`, the manifest's rules and the executable's digest. Prints the two paths, the workload public key, both digests, \`issued_at\`, \`expires_at\` and \`checked_by\`.

## \`singularity ticket launch\`

\`\`\`bash
singularity ticket launch --agent-id <id> --role <role> --environment <environment> --host <host> \\
  --workload-id <id> --skarbiec /path/to/skarbiec \\
  --grant-capabilities <capabilities> --grant-ttl-seconds <seconds> \\
  --capability-ttl-seconds <seconds> --capability-max-uses <uses> \\
  --broker-socket /path/to/broker.sock --executable /path/to/singularity \\
  --policy-file /path/to/policy --policy-sequence <n> --expires-in-seconds <seconds> \\
  --brama-resource brama:<field> --brama-bearer-resource brama:<field> --most-resource most:<field> \\
  --supervisor-key /absolute/supervisor.key --trust-root /absolute/supervisor.pub \\
  --runtime-root /absolute/owner-only-directory \\
  -- <singularity arguments>
\`\`\`

A ticket expires within the time it states, so every start makes its own. Under a fresh \`ticket-<uuid>\` directory of \`--runtime-root\`, the launch writes a workload key pair, registers its PEM public half with \`skarbiec grant issue <agent-id> --capabilities … --ttl-seconds … --workload-public-key-file …\`, issues the three capabilities with \`skarbiec grant capability\`, signs the ticket with \`ticket sign\`'s own code (the code digest is the executable's SHA-256), and runs \`singularity-bootstrap\` on it, which redeems the capabilities and replaces this process with the being.

Every flag also reads its \`SINGULARITY_LAUNCH_*\` variable, so a service declaration whose arguments are the same on every host takes the host's own paths and resources from that host's environment. The being's arguments come after \`--\`, or as a JSON array of strings in \`--being-args\` (\`SINGULARITY_LAUNCH_BEING_ARGS\`) for a service whose declared arguments stop at \`ticket launch\`.

## Refusals

Every refusal below exits 2.

- A path that is not absolute: \`<flag> <path> is not absolute; singularity-bootstrap reads only absolute owner-only files\`.
- An output that already exists or cannot be written: \`<path> could not be created as a new owner-only file: <error>\`, \`<path> could not be written: <error>\` or \`<path> could not be synced: <error>\`. Files already written by the same call are removed; a removal that fails is added as \`; cleanup failed: …\`.
- An unreadable digest input: \`<flag> <path> cannot be read: <error>\`.
- A ticket the bootstrap would refuse: \`singularity-bootstrap refused the ticket written: <the bootstrap's refusal>\`, after the written manifest and signature are removed.
- In \`launch\`: \`skarbiec <grant issue|grant capability> refused: <Skarbiec's own sentence>\`, \`<skarbiec> could not be started: <error>\`, \`skarbiec grant capability for <purpose> did not answer JSON: <error>\` and \`… answered no capability_id: <answer>\`.
- In \`launch\`, the being's arguments given both ways (\`ticket launch takes the being's arguments after -- or from --being-args (SINGULARITY_LAUNCH_BEING_ARGS), not both\`), neither way (\`ticket launch needs the being's arguments after -- or as a JSON array in --being-args (SINGULARITY_LAUNCH_BEING_ARGS)\`), a value that is not a JSON array of strings, or an empty array.

Clap refuses a missing required flag before any of this runs.`;
