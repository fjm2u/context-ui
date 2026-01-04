export type PropsHint = Record<string, unknown>

export type LayoutDirection = 'vertical' | 'horizontal'

export interface ContextUISpecNode {
  id?: string
  component: string
  props?: Record<string, unknown>
  children?: ContextUISpecNode[]
}

export interface ContextUISpec {
  version: '1.0'
  layout?: LayoutDirection
  components: ContextUISpecNode[]
}
