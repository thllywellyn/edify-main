import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
    host: true,    allowedHosts: [
      'edify.lsanalab.xyz',
      'edify-main-production.up.railway.app'
    ],
    fs: {
      strict: false // Allow serving files from outside the root directory
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
        ],
        start_url: '/',
        orientation: 'portrait'
      }
    })
  ],  build: {
    sourcemap: true
  }
})
