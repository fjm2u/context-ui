# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by pnpm workspaces (`pnpm-workspace.yaml`).
- `apps/core`: prompt-to-spec helpers (`generateSpec`), registry + JSON Schema 2020-12 types, and the registry-first ContextUI component; tests live in `apps/core/tests/`.
- `apps/theme`: default ContextUI theme registry + primitives; Tailwind config at `apps/theme/tailwind.config.ts`, styles in `apps/theme/src/styles/`.
- `examples/react-app`: end-to-end Vite example wired to the core + theme packages.
- `docs/`: package overviews and usage guides.

## Build, Test, and Development Commands
- Install deps: `pnpm install`.
- Build all packages: `pnpm build`; per package: `pnpm --filter @context_ui/core build` (or `@context_ui/theme`).
- Test all: `pnpm test`; per package: `pnpm --filter @context_ui/core test` (Vitest) or add tests for other packages.
- Example dev loop for UI: `pnpm --filter @context_ui/core test -- --watch`.

## Coding Style & Naming Conventions
- TypeScript everywhere; follow existing style: 2-space indentation, single quotes, and no semicolons.
- Keep filenames lowercase and descriptive (`spec.ts`, `registry.ts`); types/interfaces in `PascalCase`, functions/variables in `camelCase`.
- Favor small, pure helpers and keep spec/type definitions centralized in `apps/core/src/core/`.
- Update `docs/` when adding public-facing APIs or changing prompt/registry/theme formats.

## Testing Guidelines
- Framework: Vitest (configured in `apps/core`); place new tests under `apps/<pkg>/tests/`.
- Cover prompt formatting, registry/propsHint handling, spec parsing, and ContextUI component behavior when adding features.
- Run `pnpm test` (or filtered command) before sending changes; add minimal fixtures to keep tests fast.

## Commit & Pull Request Guidelines
- No established history yet; prefer Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`) for clarity.
- PRs should include: brief summary of the change, packages touched (`@context_ui/*`), commands run (`pnpm build/test`), and any relevant screenshots/spec snippets for UI-facing updates.
- Avoid wide formatting-only diffs; keep changes scoped and documented in the corresponding `docs/*.md` when behavior shifts.
