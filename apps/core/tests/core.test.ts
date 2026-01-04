import { describe, it, expect } from 'vitest'
import { createRegistry, generateSpec } from '../src'
import type { TextGenerator } from '../src'

describe('registry', () => {
  it('treats component names as case-insensitive', () => {
    const Default = () => null
    const Override = () => null
    const propsHint = {
      label: 'string',
    }
    const registry = createRegistry({ Text: { component: Default } })
    const initialCount = registry.entries().length

    expect(registry.get('text')?.component).toBe(Default)

    registry.register('text', { component: Override, propsHint })
    expect(registry.get('Text')?.component).toBe(Override)
    expect(registry.get('Text')?.propsHint).toEqual(propsHint)
    expect(registry.entries()).toHaveLength(initialCount)
  })
})

describe('spec generation', () => {
  it('passes prompt and registry to the generator', async () => {
    const registry = createRegistry({
      Text: { component: () => null, propsHint: { content: 'string' } },
      Button: { component: () => null },
    })
    let captured: string | undefined

    const generator: TextGenerator = async (generatorPrompt) => {
      captured = generatorPrompt
      return JSON.stringify({ version: '1.0', components: [] })
    }

    const spec = await generateSpec({ prompt: 'Build a profile view', generator, registry })

    expect(spec).toEqual({ version: '1.0', components: [] })
    const expectedPrompt = [
      'Prompt:',
      'Build a profile view',
      '',
      'Registry:',
      '- Text',
      '  propsHint:',
      '    {',
      '      "content": "string"',
      '    }',
      '- Button',
    ].join('\n')

    expect(captured).toBe(expectedPrompt)
  })
})
