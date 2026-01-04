import type { ContextUIRegistry } from '../registry'
import type { ContextUISpec, PropsHint } from './types'

export type RegistryCatalogEntry = {
  name: string
  propsHint?: PropsHint
}

export type TextGenerator = (prompt: string) => string | Promise<string>

export type GenerateSpecOptions = {
  prompt: string
  generator: TextGenerator
  registry: ContextUIRegistry
}

const indentLines = (value: string, indent: string) =>
  value
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n')

const formatRegistryEntry = (entry: RegistryCatalogEntry): string => {
  if (entry.propsHint === undefined) {
    return `- ${entry.name}`
  }

  const hint = JSON.stringify(entry.propsHint, null, 2)
  return ['- ' + entry.name, '  propsHint:', indentLines(hint, '    ')].join('\n')
}

const buildGeneratorPrompt = (prompt: string, registry: RegistryCatalogEntry[]): string => {
  const registryLines = registry.length ? registry.map(formatRegistryEntry) : ['- (none)']
  return ['Prompt:', prompt, '', 'Registry:', ...registryLines].join('\n')
}

export const generateSpec = async ({
  prompt,
  generator,
  registry,
}: GenerateSpecOptions): Promise<ContextUISpec> => {
  const registryCatalog = registry.entries().map(({ name, entry }) =>
    entry.propsHint === undefined ? { name } : { name, propsHint: entry.propsHint },
  )
  const generatorPrompt = buildGeneratorPrompt(prompt, registryCatalog)
  const result = await generator(generatorPrompt)

  if (typeof result !== 'string') {
    throw new Error('Spec generator must return a JSON string.')
  }

  try {
    return JSON.parse(result) as ContextUISpec
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Failed to parse spec JSON from generator output: ${message}`)
  }
}
