import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import packageJson from './package.json'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_DATE__: JSON.stringify(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
  },
  base: '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'vendor-react';
          if (id.includes('node_modules/react-router-dom/')) return 'vendor-react-router';
          if (id.includes('node_modules/lucide-react/')) return 'vendor-lucide';
          if (id.includes('node_modules/@supabase/supabase-js/')) return 'vendor-supabase';
        }
      }
    }
  }
})
