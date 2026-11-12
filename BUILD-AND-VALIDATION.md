# Build and validation notes

This package uses the editable `src/` tree, the official Decky Rollup preset, a complete pnpm v9 lockfile, translated READMEs, and release notes.

## Build

Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test`, `pnpm test:backend`, and `pnpm build`. GitHub Actions uses Node 24 and Python 3.12, packages `dist/`, the backend, manifests, license and three READMEs, then checks the ZIP with the pinned original Direct Updater validator.

Published release versions are never overwritten. Increase the version in both `package.json` and `plugin.json` before publishing another package. After publication, the workflow checks the public download and its SHA-256 using both GitHub API and asset-page metadata.

## Important

Automated input tests use simulated events. A SteamOS runtime check remains necessary for A/B/X/Y, Select+X, Select+RT, recording with the QAM open, shortcut use with the QAM open/closed, and L1/R1 navigation on the target controller.
