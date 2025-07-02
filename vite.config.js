import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // Configure server options to handle large requests
    middlewareMode: false,
    cors: true,
    // Increase request limits
    host: true,
    port: 5173,
    strictPort: false,
    // Disable HMR overlay for cleaner development
    hmr: {
      overlay: false
    }
  },
  // Optimize build for development
  optimizeDeps: {
    include: ['vue', 'axios']
  }
})
