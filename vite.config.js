import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: env.VITE_WEBSITE_NAME || "My PWA App",
          short_name: env.VITE_WEBSITE_NAME || "PWA App",
          description: env.VITE_WEBSITE_NAME || "A Vite PWA application",
          theme_color: "#000000",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: env.VITE_FAVICON_LINK || "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: env.VITE_FAVICON_LINK || "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /.*\.(?:js|css|html|png|jpg|jpeg|svg|webp|ico)$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "asset-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
      mkcert(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5173,
    },
    build: {
      sourcemap: true,
    },
  };
});
