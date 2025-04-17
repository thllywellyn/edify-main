import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        withCredentials: true
      }
    },
    port: 5173,
    open: false,
    fs: {
      strict: false,
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src')
      ]
    }
  },
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'esbuild'
  }
})
