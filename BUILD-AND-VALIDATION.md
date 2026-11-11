# Build and validation notes

This package preserves the original Crosshair project layout and adds the reconstructed `src/` tree, Rollup preset configuration, pnpm v9 lockfile seed, translated READMEs, and release notes.

## Build

The supplied GitHub Actions workflow runs `pnpm install --no-frozen-lockfile` followed by `pnpm build`. The `rollup.config.js` uses the official `@decky/rollup` preset. The workflow copies the three README files and `RELEASE_NOTES.md` into the plugin ZIP.

## Important

The source archives supplied for this task did not include the original Rollup configuration, lockfile, or editable source tree. The TypeScript source in this package was reconstructed from the uploaded source map and the earlier patch. The current container has no pnpm executable and cannot complete a dependency install, so a fresh GitHub Actions build and SteamOS runtime test remain required. In particular, test A/B/X/Y, Select+X, Select+RT, capture while QAM is open/closed, and L1/R1 tab navigation on the target controller.
