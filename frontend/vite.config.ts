import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Support base path for GitHub Pages (e.g. /insurance-operation-agent/) or standard root
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
