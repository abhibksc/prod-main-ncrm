import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      // React plugin for Vite
      react(),

      // PWA plugin configuration
      VitePWA({
        registerType: "autoUpdate", // Automatically updates service workers
        devOptions: {
          enabled: true, // Enables PWA features in development mode for testing
        },
        manifest: {
          name: env.VITE_WEBSITE_NAME || "My PWA App", // Fallback if env is missing
          short_name: env.VITE_WEBSITE_NAME || "PWA App",
          description: env.VITE_WEBSITE_NAME || "A Vite PWA application",
          theme_color: "#000000", // Defines the theme color of the app
          background_color: "#ffffff", // Sets the background color
          display: "standalone", // Ensures standalone (app-like) behavior
          start_url: "/user/dashboard", // App starting route
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
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/your-api-domain\.com\/.*$/, // Adjust for your APIs
              handler: "NetworkFirst", // Caching strategy
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 50, // Max number of items to cache
                  maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
                },
              },
            },
          ],
        },
      }),
    ],

    // Aliases for cleaner imports
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Dev server configuration
    server: {
      host: true, // Expose the dev server to external networks
      port: 5173, // Default port
    },

    // Build optimizations or adjustments
    build: {
      outDir: "dist", // Build output directory
      sourcemap: true, // Enable source maps for debugging
    },
  };
});
