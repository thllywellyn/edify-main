import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
    port: 5173,
    open: true
  },
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'esbuild'
  }
})
