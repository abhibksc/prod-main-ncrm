import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // Load environment variables

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: env.VITE_WEBSITE_NAME,
          short_name: env.VITE_WEBSITE_NAME,
          description: env.VITE_WEBSITE_NAME,
          theme_color: "#000000", // Set the desired theme color
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
        workbox: {
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === self.location.origin, // Cache static assets
              handler: "CacheFirst",
              options: {
                cacheName: "static-assets",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true, // Enable PWA during development
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5173, // Default port for development server
    },
  };
});
