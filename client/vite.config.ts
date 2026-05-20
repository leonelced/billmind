import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { // any request starting with '/api' should be forwarded to target
        target: "http://localhost:3000",
        changeOrigin: true,
      }
    }
  }
});
