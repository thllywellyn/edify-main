import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
    host: true,
    allowedHosts: [
      'edify.lsanalab.xyz',
      'edify-main-frontend.up.railway.app'
    ],
    open: false,
    port: 5173,
    fs: {
      strict: false
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Edify',
        short_name: 'Edify',
        description: 'Online Learning Platform',
        theme_color: '#4E84C1',
        background_color: '#042439',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/src/Pages/Images/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/src/Pages/Images/logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    sourcemap: false,
    minify: false,
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    target: 'esnext',
    reportCompressedSize: false,
    write: true
  }
})
