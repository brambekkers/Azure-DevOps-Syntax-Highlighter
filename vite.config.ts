import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import kaioken from 'vite-plugin-kaioken'
import manifest from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        input: {
          contentScript: 'src/contentScript/index.ts',
        },
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
          // Ensure content script is bundled as a single file
          manualChunks: (id) => {
            // Bundle highlight.js with the content script
            if (id.includes('highlight.js') || id.includes('contentScript')) {
              return undefined // Don't split into separate chunk
            }
          },
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      hmr: { port: 5173 },
    },
    plugins: [crx({ manifest }), kaioken()],
  }
})
