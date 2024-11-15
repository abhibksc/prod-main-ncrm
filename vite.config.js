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
    host: true, // Or you can set it to your local IP like '192.168.0.x'
    port: 3000, // Make sure this port is not blocked by a firewall
  },
});
