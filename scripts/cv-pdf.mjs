#!/usr/bin/env node
/**
 * Renders /cv (print styles) into the downloadable PDFs served from public/.
 * Re-run after editing CV content, with the dev or preview server running.
 *
 * Run manually: node scripts/cv-pdf.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:4321";
const TARGETS = [
  { query: "", file: "public/Amaury-Gomez-CV-ES.pdf" },
  { query: "?lang=en", file: "public/Amaury-Gomez-CV-EN.pdf" },
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const { query, file } of TARGETS) {
  await page.goto(`${BASE}/cv${query}`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: file, format: "Letter", preferCSSPageSize: true });
  console.log(`wrote ${file}`);
}
await browser.close();
