import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api calls to the Express backend so the browser sees a single
      // origin (and the session cookie is sent automatically, no CORS needed).
      // Change the target port to match PORT in backend/.env.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})