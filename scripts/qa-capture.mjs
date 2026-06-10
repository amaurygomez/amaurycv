#!/usr/bin/env node
/**
 * QA capture script — opens the running dev server in Chromium, walks every
 * zone in every viewport, captures screenshots into /tmp/qa-shots/, and
 * collects network logs to confirm Pixi isolation on mobile/tablet.
 *
 * Run manually: node scripts/qa-capture.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://127.0.0.1:4321";
const OUT = "/tmp/qa-shots";
mkdirSync(OUT, { recursive: true });

// Chronological order in ZoneNavigator (matches src/world/components/ZoneNavigator.tsx)
const ZONE_LABELS = [
  { id: "education-path", label: "Origin" },
  { id: "software-factory", label: "POS" },
  { id: "banking-finance", label: "Banking" },
  { id: "telecom-quality", label: "Telecom" },
  { id: "public-security", label: "PublicSector" },
  { id: "personal-lab", label: "AILab" },
  { id: "discipline-life", label: "Discipline" },
];

const DESKTOP_VIEWPORTS = [
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1920x1080", w: 1920, h: 1080 },
];

const MOBILE_VIEWPORTS = [
  {
    name: "390x844-mobile",
    w: 390,
    h: 844,
    mobile: true,
  },
  {
    name: "768x1024-tablet",
    w: 768,
    h: 1024,
    mobile: false,
  },
];

async function setIntroSkipped(page) {
  await page.addInitScript(() => {
    localStorage.setItem("introSeen", "1");
  });
}

async function clickNavigatorPill(page, index) {
  // Pills are buttons inside the chronological navigator (aria-label that
  // starts with the year). Click by index.
  const nav = page
    .locator(
      'nav[aria-label*="Capítulos profesionales"], nav[aria-label*="Career chapters"]'
    )
    .first();
  const buttons = nav.locator("button");
  const count = await buttons.count();
  if (count <= index) {
    console.warn(`  ! navigator has only ${count} pills, need index ${index}`);
    return false;
  }
  await buttons.nth(index).click({ force: true });
  return true;
}

async function captureDesktop(browser) {
  for (const vp of DESKTOP_VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const networkUrls = [];
    page.on("request", (req) => networkUrls.push(req.url()));
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`console: ${msg.text()}`);
    });

    await setIntroSkipped(page);
    await page.goto(BASE, { waitUntil: "networkidle" });
    // Wait for Pixi canvas to mount
    await page
      .waitForFunction(() => Boolean(document.querySelector("canvas")), {
        timeout: 12000,
      })
      .catch(() => {});
    await page.waitForTimeout(1200);

    // Overview shot
    await page.screenshot({
      path: `${OUT}/desktop-${vp.name}-00-overview.png`,
    });

    // Per-zone
    for (let i = 0; i < ZONE_LABELS.length; i += 1) {
      const z = ZONE_LABELS[i];
      const ok = await clickNavigatorPill(page, i);
      if (!ok) continue;
      // Wait for camera transition + panel mount
      await page.waitForTimeout(1100);
      await page.screenshot({
        path: `${OUT}/desktop-${vp.name}-${String(i + 1).padStart(2, "0")}-${z.label}.png`,
      });
    }

    // Close active zone and capture journey CTA
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const close = btns.find((b) =>
        (b.getAttribute("aria-label") || "").match(/Cerrar zona|Close zone/i)
      );
      if (close) close.click();
    });
    await page.waitForTimeout(700);
    await page.screenshot({
      path: `${OUT}/desktop-${vp.name}-90-journey-cta-visible.png`,
    });

    // Start guided journey + walk 2 steps
    const journeyBtn = page
      .getByRole("button", { name: /Iniciar recorrido|Start journey/i })
      .first();
    if (await journeyBtn.isVisible().catch(() => false)) {
      await journeyBtn.click();
      await page.waitForTimeout(1100);
      await page.screenshot({
        path: `${OUT}/desktop-${vp.name}-91-tour-step1.png`,
      });
      const toolbar = page.getByRole("toolbar", {
        name: /Tour controls|Controles de recorrido/i,
      });
      const next = toolbar.getByRole("button").nth(1);
      for (let s = 0; s < 2; s += 1) {
        if (await next.isVisible().catch(() => false)) {
          await next.click({ force: true });
          await page.waitForTimeout(1100);
          await page.screenshot({
            path: `${OUT}/desktop-${vp.name}-${92 + s}-tour-step${s + 2}.png`,
          });
        }
      }
    }

    writeFileSync(
      `${OUT}/desktop-${vp.name}-network.txt`,
      `errors:\n${consoleErrors.join("\n")}\n\nrequests:\n${networkUrls.join("\n")}`
    );
    await context.close();
    console.log(`✓ desktop ${vp.name} captured`);
  }
}

async function captureMobile(browser) {
  for (const vp of MOBILE_VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      userAgent: vp.mobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : undefined,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    const networkUrls = [];
    page.on("request", (req) => networkUrls.push(req.url()));
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`console: ${msg.text()}`);
    });

    await setIntroSkipped(page);
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `${OUT}/mobile-${vp.name}-00-hero.png` });
    const totalH = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = Math.min(10, Math.ceil(totalH / vp.h));
    for (let i = 1; i < steps; i += 1) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "auto" }), i * vp.h);
      await page.waitForTimeout(450);
      await page.screenshot({
        path: `${OUT}/mobile-${vp.name}-${String(i).padStart(2, "0")}-scroll.png`,
      });
    }
    await page.screenshot({
      path: `${OUT}/mobile-${vp.name}-zz-fullpage.png`,
      fullPage: true,
    });

    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));

    writeFileSync(
      `${OUT}/mobile-${vp.name}-network.txt`,
      `overflow: ${JSON.stringify(overflow)}\nerrors:\n${consoleErrors.join("\n")}\n\nrequests:\n${networkUrls.join("\n")}`
    );

    await context.close();
    console.log(`✓ mobile ${vp.name} captured`);
  }
}

const browser = await chromium.launch({ headless: true });
try {
  await captureDesktop(browser);
  await captureMobile(browser);
  console.log("\n✓ all screenshots in", OUT);
} finally {
  await browser.close();
}
