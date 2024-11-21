import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: env.VITE_WEBSITE_NAME,
          short_name: env.VITE_WEBSITE_NAME,
          description: env.VITE_WEBSITE_NAME,
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
    // server: {
    //   host: true, // Makes the server accessible on the local network
    //   port: 5173, // Development server port
    //   proxy: {
    //     "/api": {
    //       target: "https://trapi.jarha.in", // API base URL
    //       changeOrigin: true, // Modifies the Origin header to match the target URL
    //       secure: false, // Disables SSL verification (if the target has invalid SSL certificates)
    //       rewrite: (path) => path.replace(/^\/api/, ""), // Strips "/api" prefix from requests
    //     },
    //   },
    // },
  };
});
