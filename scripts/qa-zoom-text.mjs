#!/usr/bin/env node
/**
 * Verifies text stays crisp at zoom and captures every room at 2x zoom
 * so we can spot weaknesses in the scene layouts at high magnification.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://127.0.0.1:4321";
const OUT = "/tmp/qa-zoom";
mkdirSync(OUT, { recursive: true });

const ZONES = [
  { idx: 0, label: "Origin" },
  { idx: 1, label: "POS" },
  { idx: 2, label: "Banking" },
  { idx: 3, label: "Telecom" },
  { idx: 4, label: "PublicSector" },
  { idx: 5, label: "AILab" },
  { idx: 6, label: "Discipline" },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.addInitScript(() => localStorage.setItem("introSeen", "1"));
await page.goto(BASE, { waitUntil: "networkidle" });
await page
  .waitForFunction(() => Boolean(document.querySelector("canvas")), { timeout: 12000 })
  .catch(() => {});
await page.waitForTimeout(1500);

const nav = page
  .locator('nav[aria-label*="Capítulos profesionales"], nav[aria-label*="Career chapters"]')
  .first();
const navButtons = nav.locator("button");

for (const z of ZONES) {
  // Open the zone
  await navButtons.nth(z.idx).click({ force: true });
  await page.waitForTimeout(1200);
  // Default zoom shot
  await page.screenshot({ path: `${OUT}/${z.label}-1x.png` });
  // Zoom in 3 notches via wheel
  await page.mouse.move(640, 540);
  for (let i = 0; i < 4; i += 1) {
    await page.mouse.wheel(0, -250);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${z.label}-2x.png` });
  // Reset zoom
  const reset = page
    .getByRole("button", { name: /Restablecer zoom|Reset zoom/i })
    .first();
  if (await reset.isVisible().catch(() => false)) {
    await reset.click({ force: true });
    await page.waitForTimeout(500);
  } else {
    // fallback: scroll back out
    for (let i = 0; i < 8; i += 1) {
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(120);
    }
  }
  console.log(`✓ ${z.label}`);
}

await browser.close();
console.log("\n✓ all zoom captures in", OUT);
