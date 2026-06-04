import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
