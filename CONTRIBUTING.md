# ContextUI Monorepo

Managed with pnpm workspaces. Packages are split by concern.

## Commands
- Install: `pnpm install`
- Dev (example with core/theme HMR): `pnpm dev`
- Build all: `pnpm build`
- Test all: `pnpm test`
- Package-specific:
    - UI: `pnpm --filter @context_ui/core build`
    - Theme: `pnpm --filter @context_ui/theme build`

## Structure
- `apps/core`: Core schema/spec helpers + registry-first ContextUI component (unstyled defaults).
- `apps/theme`: Default ContextUI theme + generated UI primitives.

## Docs
See the detailed documentation in `docs/`:
- `docs/index.md`: overview and workspace commands
- `docs/core.md`: core APIs + ContextUI usage/overrides
- `docs/theme.md`: ContextUI theme, Tailwind setup, usage
