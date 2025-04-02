import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default frontend port
    proxy: {
      // Proxy API requests to the backend server during development
      '/api': {
        target: 'http://localhost:5032', // Your backend server address
        changeOrigin: true,
        // secure: false, // Uncomment if your backend uses HTTPS with self-signed cert
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove /api prefix if backend doesn't expect it
      },
    },
  },
})