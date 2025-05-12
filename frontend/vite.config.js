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
    open: false,
    host: true,
    fs: {
      strict: false
    },
    allowedHosts: ['edify.lsanalab.xyz']
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
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@material-tailwind/react', 'react-hot-toast', 'react-icons'],
          'utils-vendor': ['axios', 'date-fns']
        }
      }
    }
  }
})
