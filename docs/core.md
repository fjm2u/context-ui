# @context_ui/core

Core schema/spec helpers plus the registry-first ContextUI component.

## Installation & scripts
- From repo root: `pnpm install`
- Build: `pnpm --filter @context_ui/core build`
- Tests: `pnpm --filter @context_ui/core test`

## Source layout
- `apps/core/src/context-ui.tsx`: ContextUI component + props.
- `apps/core/src/index.ts`: package entry point (exports public API).
- `apps/core/src/core/`: internal building blocks.
  - `registry/`: registry types + `createRegistry`.
  - `spec/`: spec types + `generateSpec`.
  - `index.ts`: internal re-exports.
- `apps/core/tests/`: Vitest tests.

## Usage
Import `@context_ui/theme` once to apply base styles. `@context_ui/core` ships without built-in components,
so you must provide your own registry. The `generateSpec` helper is also exported.

### Spec generation
- `generateSpec({ prompt, generator, registry })` builds a plain-text prompt with your prompt + registry entries.
- `generator` is a text -> text function; return a JSON string for `ContextUISpec`.
- Registry entries include component names and optional `propsHint` content.

Prompt format:
```
Prompt:
<your prompt>

Registry:
- CustomerOverview
- ActionPanel
```
If a registry entry has `propsHint`, it is included under the component name as indented JSON.

```ts
import { generateSpec, createRegistry } from '@context_ui/core'
import type { TextGenerator } from '@context_ui/core'

const extractPrompt = (promptText: string) => {
  const marker = '\n\nRegistry:\n'
  if (!promptText.startsWith('Prompt:\n')) return promptText
  const start = 'Prompt:\n'.length
  const end = promptText.indexOf(marker)
  return end === -1 ? promptText.slice(start) : promptText.slice(start, end)
}

const generator: TextGenerator = async (promptText) => {
  const prompt = extractPrompt(promptText)
  return JSON.stringify({ version: '1.0', components: [] })
}

const registry = createRegistry()
const spec = await generateSpec({
  prompt: 'Create a customer overview UI',
  generator,
  registry,
})
```

You can also let `ContextUI` call `generateSpec` for you when `spec` is omitted:

```tsx
import '@context_ui/theme'
import { ContextUI, createRegistry } from '@context_ui/core'
import type { TextGenerator } from '@context_ui/core'
import { SummaryCard } from './summary-card'

const extractPrompt = (promptText: string) => {
  const marker = '\n\nRegistry:\n'
  if (!promptText.startsWith('Prompt:\n')) return promptText
  const start = 'Prompt:\n'.length
  const end = promptText.indexOf(marker)
  return end === -1 ? promptText.slice(start) : promptText.slice(start, end)
}

const generator: TextGenerator = async (promptText) => {
  const prompt = extractPrompt(promptText)
  return JSON.stringify({
    version: '1.0',
    components: [
      { id: 'summary', component: 'SummaryCard', props: { title: 'Summary', body: `Hint: ${prompt}` } },
    ],
  })
}

const registry = createRegistry({
  SummaryCard: { component: SummaryCard },
})

<ContextUI hint="Summarize the customer" generator={generator} registry={registry} />
```

### Component registry
```tsx
import '@context_ui/theme'
import { ContextUI, createRegistry } from '@context_ui/core'
import type { ContextUISpec } from '@context_ui/core'

const registry = createRegistry({
  CustomerOverview: { component: CustomerOverview },
})
const spec: ContextUISpec = {
  version: '1.0',
  layout: 'vertical',
  components: [
    {
      id: 'overview',
      component: 'CustomerOverview',
      props: { title: 'Customer', subtitle: 'Active subscription' },
    },
  ],
}

<ContextUI spec={spec} registry={registry} />
```

Import `@context_ui/theme` once to apply base styles. `createRegistry()` starts empty unless you pass overrides.

Registry entries can include `propsHint` metadata. This is a lightweight, JSON-friendly hint object used only for
spec generation (no validation).

```tsx
const registry = createRegistry().register('Card', {
  component: Card,
  propsHint: {
    title: 'string',
    tone: ['muted', 'default', 'emphasis'],
  },
})
```

#### Component types
- `spec.components[].component` should match your registry names (case-insensitive).
- Pick stable names for your organism-level components and register them before rendering specs.

```tsx
const registry = createRegistry()
  .register('Card', { component: Card })
  .register('Badge', { component: Badge })
```

### Spec reference
#### ContextUISpec
- `version`: must be `'1.0'`.
- `layout?`: `'vertical' | 'horizontal'` (defaults to `'vertical'`).
- `components`: `ContextUISpecNode[]` root nodes rendered in order.

#### ContextUISpecNode
- `component`: registry name (case-insensitive lookup).
- `props?`: props passed to the component.
- `children?`: nested `ContextUISpecNode[]` passed as React children.
- `id?`: stable key for React rendering.

#### Component props
`@context_ui/core` does not define component prop shapes. Document your component props alongside your registry.

## Props
### ContextUI
- `spec?`: component spec tree (omit to generate internally).
- `hint?`: hint string for internal spec generation.
- `generator?`: `TextGenerator` used when `spec` is omitted.
- `registry?`: component registry (defaults to registry defaults; empty unless you set defaults).
- `className?`: wrapper class override/extension.

## Default components
- `@context_ui/core` ships without built-in components.
- Theme package: import `@context_ui/theme` once to apply base styles.

## Extending
- Use `registry.register(name, { component, propsHint? })` to add custom spec components.
- Extend specs by introducing new component names and registering them in your registry.
