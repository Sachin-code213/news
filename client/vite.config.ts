import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // vite.config.ts
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // 🚀 Use the IP address instead of localhost
        changeOrigin: true,
        secure: false,
      },
    },
  },
})