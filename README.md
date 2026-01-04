# ContextUI

English | [日本語](./README_ja.md)

A headless Generative UI engine that generates a spec from your React components and context, then renders UI based
on that spec.

- Hyper-personalized UI: generate branded UIs at runtime and tailor them per user
- Reuse existing assets: fully reuse your existing React components
- No lock-in: bring your own spec generation logic

## Core Concepts
![](/docs/readme/concept_compose.png)

The SDK provides:
1. Compose existing Organisms in Atomic Design to build a Template (screen layout) spec
2. Interpret the spec and render it

- Renders the components you define.
  - Safe runtime environment
  - Branded presentation
  - Extensibility
- You can choose any LLM for spec generation.
  - You provide the spec generation logic

## 30-sec Quickstart
**Install**
```bash
npm install @context_ui/core
// or yarn add @context_ui/core
// or pnpm add @context_ui/core
```

```tsx
import { ContextUI, createRegistry } from '@context_ui/core'

type ProfilePanelProps = {
  title: string
}

const ProfilePanel = ({ title }: ProfilePanelProps) => (
  <section className="profile-panel">
    <h2>{title}</h2>
    <p>Display profile details here.</p>
  </section>
)

const registry = createRegistry()
  .register('ProfilePanel', {
    component: ProfilePanel,
    propsHint: {
      title: 'string',
    },
  })

const spec = {
  version: '1.0',
  components: [
    { id: 'profile', component: 'ProfilePanel', props: { title: 'Profile' } },
  ],
}

export function App() {
  return <ContextUI spec={spec} registry={registry} />
}
```

ContextUI does not provide component state management, actions, or data binding.

## Use Cases
TBD

For more information, see [React Example](./examples/react-app).

## UI Spec (JSON)
**Minimal structure**
```json
{
  "version": "1.0",
  "components": [
    { "component": "ProfilePanel", "props": { "title": "Profile" } }
  ]
}
```

**Key fields**
- `layout?`: `'vertical' | 'horizontal'` (defaults to `'vertical'`)
- `components[].children?`: child node array
- `components[].id?`: stable key

**Important rules**
- Only allowlisted components are valid
- `component` uses registry names (case-insensitive)
- `props` are passed through as-is

## Future Work
Today, ContextUI only composes Organisms, but we plan to enable generating Organisms from design systems. In other words,
we aim to generate Organisms from the "state to manage", "data", and "available actions" in your design system.

![](/docs/readme/concept_generate.png)

This extends beyond composing pre-defined components and will allow you to define new components for higher flexibility.

## Contributing / License
- Contributing guide: `CONTRIBUTING.md`
- License: Apache 2.0
