import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const alias: Record<string, string> = {
    '@context_ui/core': path.resolve(__dirname, '../../apps/core/src'),
  }

  if (command === 'serve') {
    alias['@context_ui/theme'] = path.resolve(__dirname, '../../apps/theme/src/dev.tsx')
  }

  return {
    plugins: [react()],
    resolve: {
      alias,
    },
  }
})
