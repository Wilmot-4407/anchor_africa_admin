import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      // Forward /api requests to Express backend
      // fetch("/api/v1/ai/suggest-icon") → http://localhost:4000/api/v1/ai/suggest-icon
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
});
