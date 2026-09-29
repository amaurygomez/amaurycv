import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// Secrets declared here are read from process.env at request time instead of being inlined into the bundle.
const secret = (options = {}) =>
  envField.string({ context: "server", access: "secret", ...options });

export default defineConfig({
  site: "https://amaurygomez.dev",
  output: "static",
  adapter: vercel(),
  integrations: [react(), sitemap()],
  env: {
    schema: {
      RESEND_API_KEY: secret({ optional: true }),
      RESEND_FROM: secret({ default: "Amaury Gómez <hello@amaurygomez.dev>" }),
      CONTACT_TO: secret({ default: "hello@amaurygomez.dev" }),
      // Optional so a deploy never breaks on it; without it both forms fall back to the email link.
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      TURNSTILE_SECRET_KEY: secret({ optional: true }),
      UPSTASH_REDIS_REST_URL: secret({ optional: true }),
      UPSTASH_REDIS_REST_TOKEN: secret({ optional: true }),
      CV_FULL_KEY: secret({ optional: true }),
      CRON_SECRET: secret({ optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // No source maps in production: the source is public on GitHub, the bundle stays lean.
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // pixi.js stays out of the vendor chunks so Rollup keeps it with the lazy
            // WorldStageCanvas chunk, off the mobile critical path.
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
