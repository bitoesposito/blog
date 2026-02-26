## Cursor Cloud specific instructions

This is a single-product Astro v5 static blog/portfolio site. No database, no backend API, no external services required.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Astro dev server | `npm run dev` | 1234 | Main dev server with HMR |

### Key commands

- **Dev server**: `npm run dev` (port 1234, `host: true`)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview built site**: `npm run preview`
- **Type checking**: `npx astro check`
- **Formatting**: `npm run prettier` (writes fixes) or `npx prettier --check` for dry-run
- **Postinstall**: `patch-package` runs automatically on `npm install`/`npm ci`

### Known issues

- `npm run build` fails due to a pre-existing MDX parse error in `src/content/education/sql-postgres/21-node-api-pool-repository-sql-injection.mdx`. The dev server is unaffected (MDX is parsed lazily per-page).
- `astro check` reports 1 pre-existing TS error (`noindex` property on `PostHead.astro`). This does not block development.
- Prettier reports style issues on ~47 files. This is pre-existing formatting drift, not a setup problem.

### Gotchas

- The `patches/` directory contains a patch for `rehype-pretty-code@0.14.1` applied via `patch-package` postinstall. Do not delete this directory.
- No `.env` file is needed; all config is hardcoded in `src/consts.ts` and `astro.config.ts`.
