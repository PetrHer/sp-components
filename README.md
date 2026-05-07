# @jt0033418/sp-components

Reusable custom components and layout primitives built on top of `@fluentui/react-components`.

## Install

```bash
npm install @jt0033418/sp-components
```

Peer dependencies expected in host app:
- `react`
- `react-dom`
- `@fluentui/react-components`

## Development

```bash
npm install
npm run build
npm run typecheck
```

## Publish to GitHub Packages

This package is configured for the GitHub Enterprise repository:

- `https://jtfg.ghe.com/JT0033418/jtfg-sp-components.git`

Default registry configuration assumes GitHub Packages subdomain isolation is enabled:

- registry: `https://npm.jtfg.ghe.com`

If your GitHub Enterprise instance uses the non-subdomain registry mode, replace the registry in [package.json](package.json) and [.npmrc](.npmrc) with:

```text
https://jtfg.ghe.com/_registry/npm
```

### Local publish

1. Create a classic personal access token with package publish permission on your GitHub Enterprise instance.
2. In your shell, set `NODE_AUTH_TOKEN` to that token.
3. Run:

```bash
npm ci
npm run build
npm publish
```

### Publish from GitHub Actions

After pushing this repository to GitHub, run the `Publish package` workflow from the Actions tab.

If your enterprise setup does not allow `GITHUB_TOKEN` to publish packages, create a repository secret named `NODE_AUTH_TOKEN` with a classic PAT and update [.github/workflows/publish-package.yml](.github/workflows/publish-package.yml) to use that secret in the publish step.

## Exports

- `CardSection`
- `PageShell`
