#!/usr/bin/env node
/**
 * Spot-check QA — verifies the language toggle actually changes the
 * in-scene labels, and that the zoom controls work end-to-end.
 *
 * Run manually after dev server is up:
 *   node scripts/qa-i18n-zoom.mjs http://127.0.0.1:4321
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://127.0.0.1:4321";
const OUT = "/tmp/qa-shots-i18n";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
await page.addInitScript(() => localStorage.setItem("introSeen", "1"));
await page.goto(BASE, { waitUntil: "networkidle" });
await page
  .waitForFunction(() => Boolean(document.querySelector("canvas")), { timeout: 12000 })
  .catch(() => {});
await page.waitForTimeout(1500);

// Open Banking zone (3rd pill = banking-finance)
const nav = page.locator('nav[aria-label*="Capítulos profesionales"], nav[aria-label*="Career chapters"]').first();
const buttons = nav.locator("button");
await buttons.nth(2).click({ force: true });
await page.waitForTimeout(1100);

// Capture in EN
await page.screenshot({ path: `${OUT}/banking-EN.png` });
console.log("✓ EN capture");

// Toggle to ES
const esBtn = page.getByRole("button", { name: /Cambiar idioma a español/i });
await esBtn.click({ force: true });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/banking-ES.png` });
console.log("✓ ES capture");

// Zoom in via wheel
await page.mouse.move(720, 450);
await page.mouse.wheel(0, -300);
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/banking-ES-zoomed-in.png` });
console.log("✓ wheel zoom-in capture");

// Click zoom-out buttons twice
const zoomOutBtn = page.getByRole("button", { name: /Alejar|Zoom out/i });
await zoomOutBtn.click({ force: true });
await page.waitForTimeout(400);
await zoomOutBtn.click({ force: true });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/banking-ES-zoomed-out.png` });
console.log("✓ button zoom-out capture");

// Reset zoom
const resetBtn = page.getByRole("button", { name: /Restablecer zoom|Reset zoom/i }).first();
await resetBtn.click({ force: true });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/banking-ES-zoom-reset.png` });
console.log("✓ zoom reset capture");

await browser.close();
console.log("\n✓ all i18n+zoom captures in", OUT);
