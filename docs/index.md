# ContextUI Docs

Generative UI monorepo managed by pnpm workspaces. Packages:

- [`@context_ui/core`](./core.md): core schema/spec helpers + registry-first ContextUI component.
- [`@context_ui/theme`](./theme.md): Tailwind styles for ContextUI.

Package READMEs are intentionally brief; use these docs as the source of truth for usage and APIs.

## Workspace commands
- Install: `pnpm install`
- Dev (example with core/theme HMR): `pnpm dev`
- Build all: `pnpm build`
- Test all: `pnpm test`
- Filtered: `pnpm --filter <pkg> <script>` (e.g., `pnpm --filter @context_ui/core build`).

## Flow
1) Ingest prompt → `@context_ui/core` combines it with registry entries and feeds your generator a plain-text prompt to build a spec.
2) Prefer registry specs → render with `ContextUI` (component names align with your registry).
3) Use `@context_ui/theme` for base styles.
