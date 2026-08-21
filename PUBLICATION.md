# Publication

Publish the immutable output of `npm ci && npm run build` from `main` at `https://singularity.wisent.com`. The site has no server-side state or credentials; its primary action points to the canonical Singularity repository.

Regeneration inputs are versioned in `wisent-ai/singularity`: `landing.brief.json`, `landing.plan.json`, and `landing.config.json`. `landing.manifest.json` records their digests and the Wisent token digest.
