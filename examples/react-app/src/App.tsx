import React from 'react'
import { ContextUI, createRegistry, generateSpec } from '@context_ui/core'
import type { ContextUISpec, TextGenerator } from '@context_ui/core'
import '@context_ui/theme'

type CalloutProps = {
  title?: string
  body?: string
}

type CustomerOverviewProps = {
  title?: string
  subtitle?: string
  actionLabel?: string
}

const Callout: React.FC<CalloutProps> = ({ title, body }) => (
  <div className="callout">
    {title && <h3 className="callout-title">{title}</h3>}
    {body && <p className="callout-body">{body}</p>}
  </div>
)

const CustomerOverview: React.FC<CustomerOverviewProps> = ({
  title = 'Customer overview',
  subtitle,
  actionLabel = 'Save customer',
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    plan: '',
    active: false,
  })

  const updateField = (key: 'name' | 'email' | 'plan', value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="customer-overview">
      <header className="customer-overview-header">
        <div>
          <h3 className="customer-overview-title">{title}</h3>
          {subtitle && <p className="customer-overview-subtitle">{subtitle}</p>}
        </div>
        <button type="button" className="action-button">
          {actionLabel}
        </button>
      </header>
      <div className="customer-overview-body">
        <form
          className="customer-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label className="customer-field">
            <span className="customer-field-label">Name</span>
            <input
              className="customer-field-input"
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Jane Doe"
            />
          </label>
          <label className="customer-field">
            <span className="customer-field-label">Email</span>
            <input
              className="customer-field-input"
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="jane@example.com"
            />
          </label>
          <label className="customer-field">
            <span className="customer-field-label">Plan</span>
            <input
              className="customer-field-input"
              value={formData.plan}
              onChange={(event) => updateField('plan', event.target.value)}
              placeholder="Pro"
            />
          </label>
          <label className="customer-field-row">
            <input
              className="customer-checkbox"
              type="checkbox"
              checked={formData.active}
              onChange={(event) => {
                const isActive = event.target.checked
                setFormData((prev) => ({ ...prev, active: isActive }))
              }}
            />
            <span className="customer-field-label">Active subscription</span>
          </label>
        </form>
        <div className="customer-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formData.name || '-'}</td>
                <td>{formData.email || '-'}</td>
                <td>{formData.plan || '-'}</td>
                <td>
                  <span className={formData.active ? 'customer-pill active' : 'customer-pill'}>
                    {formData.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const calloutPropsHint = {
  title: 'string',
  body: 'string',
}

const customerOverviewPropsHint = {
  title: 'string',
  subtitle: 'string',
  actionLabel: 'string',
}

const registry = createRegistry({
  Callout: { component: Callout, propsHint: calloutPropsHint },
  CustomerOverview: { component: CustomerOverview, propsHint: customerOverviewPropsHint },
})

const prompt = 'Create a customer overview organism with an editable form and preview.'

const extractPrompt = (promptText: string) => {
  const marker = '\n\nRegistry:\n'
  if (!promptText.startsWith('Prompt:\n')) return promptText
  const start = 'Prompt:\n'.length
  const end = promptText.indexOf(marker)
  return end === -1 ? promptText.slice(start) : promptText.slice(start, end)
}

const extractRegistryNames = (promptText: string) => {
  const marker = '\n\nRegistry:\n'
  const start = promptText.indexOf(marker)
  if (start === -1) return []
  return promptText
    .slice(start + marker.length)
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter((name) => name && name !== '(none)')
}

const generator: TextGenerator = (promptText) => {
  const resolvedPrompt = extractPrompt(promptText)
  const registryNames = extractRegistryNames(promptText)

  return JSON.stringify({
    version: '1.0',
    layout: 'vertical',
    components: [
      {
        id: 'intro',
        component: 'Text',
        props: {
          tone: 'muted',
          content: `Prompt: ${resolvedPrompt}`,
        },
      },
      {
        id: 'callout',
        component: 'Callout',
        props: {
          title: 'Registry override',
          body: `Registry entries: ${registryNames.join(', ') || 'None'}`,
        },
      },
      {
        id: 'overview',
        component: 'CustomerOverview',
        props: {
          title: 'Customer overview',
          subtitle: `Prompt: ${resolvedPrompt}`,
          actionLabel: 'Save customer',
        },
      },
    ],
  })
}

const App: React.FC = () => {
  const [spec, setSpec] = React.useState<ContextUISpec | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const generated = await generateSpec({ prompt, generator, registry })
        if (!cancelled) {
          setSpec(generated)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to generate spec')
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Example</p>
        <h1>React demo using @context_ui/core</h1>
        <p className="lede">
          Registry-first spec demo. You can swap the generator with one from your API service once available.
        </p>
        <ul className="notes">
          <li>Callout and CustomerOverview are custom registry entries.</li>
          <li>Components render from a spec generated by a local generator.</li>
          <li>Prompt + registry are combined into a text input for the generator.</li>
        </ul>
      </header>

      <section className="card">
        <div className="card-header">
          <h2>Generated UI</h2>
        </div>
        {error ? (
          <p className="status error">{error}</p>
        ) : spec ? (
          <ContextUI spec={spec} registry={registry} />
        ) : (
          <p className="status">Generating spec...</p>
        )}
      </section>
    </main>
  )
}

export default App
