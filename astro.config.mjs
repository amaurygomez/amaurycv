import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://amaurygomez.dev",
  output: "static",
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Do NOT force pixi.js / @pixi/react into a shared vendor chunk.
            // Letting Rollup co-locate them with the lazy WorldStageCanvas
            // chunk keeps Pixi off the mobile critical path entirely.
            if (id.includes("node_modules/motion")) {
              return "vendor-motion";
            }
            if (id.includes("node_modules/react-dom")) {
              return "vendor-react";
            }
            if (id.includes("node_modules/lucide-react")) {
              return "vendor-lucide";
            }
          },
        },
      },
      chunkSizeWarningLimit: 900,
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
});
