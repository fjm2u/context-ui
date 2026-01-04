# ContextUI

[English](./README.md) | [日本語](./README_ja.md)

A React-based headless engine that lets you generate and customize UI with LLMs.

Dynamically generate user-optimized UI while reusing your existing components.

## Why ContextUI?

### Hyper-personalization
- Dynamically generate UI optimized for each user's role, behavior, and situation
- Deliver tailored experiences for every user

### Fully reuse existing assets
- Use your React components as-is
- Keep your design system and branding intact
- Runs in a safe runtime environment with extensibility

### Flexible spec generation
- Choose any LLM (OpenAI, Anthropic, local models, etc.)
- You implement and control the spec generation logic
- Open JSON format, always portable

## 30-sec Quickstart (get it running fast)

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

## Core Concepts
### Architecture overview
- Layer 1 builds Organisms bottom-up from data and actions
- Layer 2 arranges Organisms top-down to match goals
- Separating generation and composition keeps UI consistent and flexible

Today we provide Layer 2 (Templates composition and rendering). Layer 1 is planned.

### Layer 1: Organisms generation

![](/docs/readme/concept_generate.png)

In this phase, LLMs generate Organisms from Atoms/Molecules using UI context.
- Inputs: your React components (Atoms / Molecules)
- UI context: data model to render, available actions
- Output: generated Organisms (e.g., a search bar)

We plan to generate Organisms from "state to manage," "data," and "available actions."
This goes beyond composing pre-defined components and will allow defining new components.

### Layer 2: Templates composition

![](/docs/readme/concept_compose.png)

LLMs select and arrange Organisms to match user intent.
- Inputs: Atoms / Molecules + existing Organisms + generated Organisms
- System/user context: goals/intent, constraints
- Output: Templates (screen layout spec)

## Use Cases
- **Personalized dashboards**: dynamically place widgets by user role
- **Chatbot UI**: generate forms and cards based on conversation flow
- **A/B test automation**: LLM generates multiple layout variations

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

## Contributing / License
- Contributing guide: `CONTRIBUTING.md`
- License: Apache 2.0
