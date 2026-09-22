export const repositoryPage = {
  slug: "repo-surface",
  title: "Repo surface",
  summary: "Claim one canonical main checkout, retain exact commit evidence, and publish without force.",
  section: "Reference",
  source: `# Repo surface

\`singularity-repo-mcp\` serves policy-bound repository operations over stdio MCP, protocol \`2024-11-05\`. Requests are bounded to 2 MiB. It uses the repository's existing canonical checkout on \`main\`; it does not create another checkout, a proposal branch, or a pull request.

The final gate is **independent acceptance and qualified product delivery**. A successful push is not evidence that an installed product works. The ecosystem retains execution and delivery evidence separately; see [Ecosystem](ecosystem).

## Configuration

| Variable | Meaning |
|---|---|
| \`JEDEN_REPO_POLICY_FILE\` | Absolute path to an owner-only repository policy file. |
| \`JEDEN_REPO_STATE_DIR\` | Absolute path to the durable repository-operation store. |

The policy contains a nonempty \`repositories\` map keyed by repository ID. Its repository fields include:

| Field | Contract |
|---|---|
| \`root\` | Absolute existing canonical Git checkout. |
| \`remote\` | Configured Git remote name. Its URL must identify \`github_repository\`. |
| \`base_branch\` | Exactly \`main\`. |
| \`github_repository\` | Exact GitHub \`owner/name\`. |
| \`allowed_paths\` | Nonempty list of relative paths; absolute paths, parent traversal and \`.git\` components are refused. |
| \`checks\` | Named fixed \`git_diff_check\` operations. |
| \`required_checks\` | Distinct names present in \`checks\`. |

Unknown fields are rejected. The policy must be a regular, non-symlink file owned by the current user, with no group or other access.

## Tools

| Tool | Contract |
|---|---|
| \`workspace_create\` | Claim the canonical checkout using \`repo_id\`, \`workspace_id\` and \`request_id\`. The checkout must be clean, on main, have exactly one Git worktree, match the policy origin and have no executable Git filters. |
| \`workspace_read\` | Read one bounded UTF-8 file within \`allowed_paths\`. |
| \`workspace_apply_patch\` | Apply one bounded unified diff within \`allowed_paths\`; invalidate the previous seal and checks. |
| \`workspace_diff\` | Return the bounded unified diff. |
| \`workspace_seal\` | Stage allowed roots and record the exact Git tree and bounded diff. |
| \`workspace_check\` | Run a named fixed \`git_diff_check\` against the sealed index and retain tree-bound evidence. This is not a product test. |
| \`commit_create\` | Commit the sealed index without restaging after every required check has successful evidence for that exact tree. |
| \`branch_publish\` | Publish the recorded commit to main without force, then read the remote main revision back. |
| \`proposal_status\` | Read the stored workspace lifecycle without changing it. |

For a normal operation, claim, read, patch, inspect the diff, seal, run the named checks, create the commit, and publish. Real product tests and independent acceptance still govern release. A published workspace permits a subsequent workspace to claim the repository; an unfinished workspace retains its claim.

\`workspace_create\`, \`workspace_apply_patch\`, \`commit_create\` and \`branch_publish\` require a stable \`request_id\`. Repeating a recorded request with identical operation, workspace and input returns the recorded response. Reusing it for different input is refused. A recorded response is historical evidence, not a fresh observation of the remote.

Before publishing, the remote main revision must equal either the recorded base commit or the exact commit being published. Any other revision is a conflict. Publication performs a second remote read and marks \`published\` only when it observes the exact commit. The service never force-pushes to resolve a conflict.

## Refusals and recovery

| Refusal | Meaning |
|---|---|
| \`policy_denied: canonical repository operations require main\` | The policy named another base branch. |
| \`invalid_state: source repository is not clean\` | Existing edits prevent a new claim. Preserve them; do not discard or stash another operator's work. |
| \`policy_denied: canonical checkout is not on main; no branch was changed\` | The checkout is on another branch. The service does not switch it. |
| \`policy_denied: repository has multiple checkouts; none was removed\` | Git reports more than one worktree. The service leaves them intact. |
| \`policy_denied: canonical origin differs from the policy repository\` | The configured remote does not identify the policy's GitHub repository. |
| \`invalid_state: repository <repository> is owned by unfinished workspace <workspace>\` | A previous operation still owns this repository. Inspect its status and evidence. |
| \`invalid_state: workspace no longer owns the canonical repository\` | Another workspace owns the current repository claim. |
| \`invalid_state: request_id was already used for different input\` | The request ID is already bound to another operation or payload. |
| \`invalid_state: remote main differs from the workspace base; no force push was attempted\` | The remote changed since the recorded base. No publication was attempted. |
| \`invalid_state: remote main does not contain the exact published commit\` | The publication readback did not match; do not report delivery. |

Other path, seal, check and command refusals are listed in [Runbook](runbook).

## Migration from isolated proposals

Remove \`branch_prefix\` and \`github_head_owner\` from the policy; they are no longer accepted. Set \`base_branch\` to \`main\` and bind \`root\` to the one canonical checkout. \`pull_request_open\` is no longer a tool; unknown tool names are refused rather than redirected.

Old isolated workspace records are not adopted. An operation that tries to use one returns \`policy_denied: workspace is not the canonical main checkout; legacy isolated workspaces are not adopted\`. Preserve that record and any uncommitted work while reconciling it into the canonical checkout. The service does not remove old directories or rewrite their records.

The current store contains repository claims, workspace records, request records and lock files, not copies of repositories. See [Inspecting state](walkthrough-state).

## Las boundary

Repository operations reach the being as namespaced tools through the \`warsztat\` surface in [Las](skills). The repository server remains a separate process with its own policy and durable state. Las admission and repository policy are both required; finding a tool in the catalogue does not grant it authority.`,
};
