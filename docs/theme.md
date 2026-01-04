# @context_ui/theme

**WIP**: This package is under active development. It currently provides base Tailwind styles only (no default registry
entries), and the API/docs may change.

Default Tailwind styles for ContextUI.

## Installation & scripts
- From repo root: `pnpm install`
- Build: `pnpm --filter @context_ui/theme build`
- Tests: none yet (`pnpm --filter @context_ui/theme test`).

## Usage
```tsx
import '@context_ui/theme'
import { ContextUI, createRegistry } from '@context_ui/core'

const registry = createRegistry({
  CustomerOverview: { component: CustomerOverview },
})

<ContextUI spec={spec} registry={registry} />

// Optional overrides
registry.register('BillingEditor', { component: BillingEditor })
<ContextUI spec={spec} registry={registry} />
```

Importing `@context_ui/theme` applies the base styles but does not register any components.
`@context_ui/core` ships without built-in components, so always provide your own registry.

If you need to control CSS loading (SSR/Next), import the CSS explicitly:
```tsx
import '@context_ui/theme/styles/globals.css'
```

## Styling
- Tailwind config: `apps/theme/tailwind.config.ts`
- Tokens/base styles: `apps/theme/src/styles/globals.css` (includes CSS variables for light/dark).
- Utility: `apps/theme/src/lib/utils.ts` (`cn` helper for future theme components).

## Extending
- Register components by passing a custom registry (`createRegistry({ CustomerOverview: { component: CustomerOverview, propsHint } })`).
- `@context_ui/theme` includes styles by default; use `@context_ui/theme/styles/globals.css` only when you need manual control.
