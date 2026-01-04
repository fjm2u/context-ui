import type { ComponentType } from 'react'
import type { PropsHint } from '../spec'

export type RegistryEntry = {
  component: ComponentType<any>
  propsHint?: PropsHint
}

export interface ContextUIRegistry {
  register: (name: string, entry: RegistryEntry) => ContextUIRegistry
  get: (name: string) => RegistryEntry | undefined
  entries: () => Array<{ name: string; entry: RegistryEntry }>
}

type RegistryRecord = {
  name: string
  entry: RegistryEntry
}

const normalizeRegistryName = (name: string): string => name.trim().toLowerCase()

const mergeRegistryEntries = (target: Map<string, RegistryRecord>, entries: Record<string, RegistryEntry>) => {
  Object.entries(entries).forEach(([name, entry]) => {
    target.set(normalizeRegistryName(name), { name, entry })
  })
}

let registryDefaults: Record<string, RegistryEntry> = {}

export const setRegistryDefaults = (defaults: Record<string, RegistryEntry>) => {
  registryDefaults = { ...defaults }
}

export const createRegistry = (overrides: Record<string, RegistryEntry> = {}): ContextUIRegistry => {
  const entries = new Map<string, RegistryRecord>()
  mergeRegistryEntries(entries, registryDefaults)
  mergeRegistryEntries(entries, overrides)
  const registry: ContextUIRegistry = {
    register: (name, entry) => {
      entries.set(normalizeRegistryName(name), { name, entry })
      return registry
    },
    get: (name) => entries.get(normalizeRegistryName(name))?.entry,
    entries: () => Array.from(entries.values()).map(({ name, entry }) => ({ name, entry })),
  }
  return registry
}
