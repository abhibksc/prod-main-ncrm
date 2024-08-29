import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://myapi4crm.testcrm.co.in",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/web"),
      },
    },
  },
});
