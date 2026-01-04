import React from 'react'
import { ContextUISpec, ContextUISpecNode, TextGenerator, generateSpec } from './core'
import { createRegistry, ContextUIRegistry } from './core/registry'

interface ContextUIBaseProps {
  registry?: ContextUIRegistry
  className?: string
}

interface ContextUISpecProps {
  spec: ContextUISpec
}

interface ContextUIGeneratorProps {
  spec?: undefined
  hint: string
  generator: TextGenerator
}

export type ContextUIProps = ContextUIBaseProps & (ContextUISpecProps | ContextUIGeneratorProps)

export const ContextUI: React.FC<ContextUIProps> = (props) => {
  const { spec, registry, className } = props
  const resolvedRegistry = React.useMemo(() => registry ?? createRegistry(), [registry])
  const [generatedSpec, setGeneratedSpec] = React.useState<ContextUISpec | null>(null)
  const generator = 'generator' in props ? props.generator : undefined
  const hint = 'hint' in props ? props.hint : undefined
  const shouldGenerate = !spec

  if (shouldGenerate && (!generator || hint == null)) {
    throw new Error('ContextUI requires either spec or hint+generator.')
  }

  React.useEffect(() => {
    if (!shouldGenerate) return

    let cancelled = false

    const run = async () => {
      try {
        if (!generator || hint == null) return
        const nextSpec = await generateSpec({ prompt: hint, generator, registry: resolvedRegistry })
        if (!cancelled) {
          setGeneratedSpec(nextSpec)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[ContextUI] Failed to generate spec', err)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [generator, hint, resolvedRegistry, spec])

  const renderNode = React.useCallback(
    function renderNode(node: ContextUISpecNode, index: number, keyPrefix = ''): React.ReactNode {
      const entry = resolvedRegistry.get(node.component)
      if (!entry) return null
      const Component = entry.component as React.ComponentType<any>
      const key = node.id ?? `${keyPrefix}${node.component}-${index}`
      const children = node.children?.map((child, childIndex) => renderNode(child, childIndex, `${key}-`))
      const props = node.props ?? {}
      return (
        <Component key={key} {...props}>
          {children}
        </Component>
      )
    },
    [resolvedRegistry],
  )

  const resolvedSpec = spec ?? generatedSpec
  const layout = resolvedSpec?.layout ?? 'vertical'
  const nodes = resolvedSpec?.components ?? []

  return (
    <div className={className} data-context-ui data-context-ui-layout={layout}>
      {nodes.map((node, index) => renderNode(node, index))}
    </div>
  )
}
