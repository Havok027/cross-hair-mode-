# Build and validation notes

This package uses the editable `src/` tree, the official Decky Rollup preset, a complete pnpm v9 lockfile, translated READMEs, and release notes.

## Build

Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test`, `pnpm test:backend`, and `pnpm build`. GitHub Actions uses Node 24 and Python 3.12, packages `dist/`, the backend, manifests, license and three READMEs, then checks the ZIP with the pinned original Direct Updater validator.

Published release versions are never overwritten. When a version already exists, the workflow still builds, tests, validates the ZIP and uploads the installation package as the `Crosshair` Actions artifact; it skips release publication and verification of a new public download. Increase the version in `package.json` to publish a new release for Direct Updater. The version is omitted from `plugin.json` to keep a single source of truth. After a new release is published, the workflow checks the public download and its SHA-256 using both GitHub API and asset-page metadata.

## Important

Automated input tests use simulated events. A SteamOS runtime check remains necessary for A/B/X/Y, Select+X, Select+RT, recording with the QAM open, shortcut use with the QAM open/closed, and L1/R1 navigation on the target controller.
