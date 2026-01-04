import type { RegistryEntry } from '@context_ui/core'
import { setRegistryDefaults } from '@context_ui/core'

const themeRegistryEntries: Record<string, RegistryEntry> = {}

export const themeComponents = themeRegistryEntries

setRegistryDefaults(themeRegistryEntries)
