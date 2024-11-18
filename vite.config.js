import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically updates the service worker
      manifest: {
        name: "My PWA App",
        short_name: "MyApp",
        description: "An example PWA using Vite",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/user/dashboard",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
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
