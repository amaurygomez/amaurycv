import js from "@eslint/js";
import globals from "globals";
import astro from "eslint-plugin-astro";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const NODE_FILES = ["*.{js,mjs,ts}", "src/lib/server/**", "src/pages/api/**", "tests/unit/**"];
// Node processes that drive a real browser, so their page callbacks need both sets.
const BROWSER_DRIVERS = ["scripts/**", "tests/e2e/**"];

export default defineConfig([
  globalIgnores(["dist", ".astro", ".vercel", "node_modules", "test-results", "playwright-report"]),
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
  },
  astro.configs.recommended,
  {
    files: ["**/*.{js,mjs,ts,tsx,astro}"],
    ignores: NODE_FILES,
    languageOptions: { globals: globals.browser },
  },
  {
    files: [...NODE_FILES, ...BROWSER_DRIVERS],
    languageOptions: { globals: globals.node },
  },
]);
