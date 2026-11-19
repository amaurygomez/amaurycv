#!/usr/bin/env node
// Prints /cv into public/Amaury-Gomez-CV-{ES,EN}.pdf. Needs the dev or preview server running.
// Usage: node scripts/cv-pdf.mjs [baseUrl]
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { countPrivacyMatches, publicCvs, readPrivacyTerms } from "./lib/cv-privacy.mjs";

const BASE = process.argv[2] ?? "http://127.0.0.1:4321";
const EXPECTED_PAGES = 2;

// Counts page objects; "/Type /Pages" is the page tree and is excluded.
function countPages(pdf) {
  return pdf.toString("latin1").match(/\/Type\s*\/Page(?![A-Za-z])/g)?.length ?? 0;
}

const denylist = readPrivacyTerms();
if (!denylist.length) {
  console.error("Set PRIVACY_DENYLIST or add terms to .privacy-denylist before generating PDFs.");
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage();
const checked = [];

try {
  for (const { lang, file } of publicCvs) {
    await page.goto(`${BASE}/cv?lang=${lang}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.fonts.ready);

    const matches = countPrivacyMatches(
      await page.evaluate(() => document.body.innerText),
      denylist,
    );
    if (matches) {
      console.error(`${file}: ${matches} private-term match(es). Review the CV locally.`);
      continue;
    }

    const pdf = await page.pdf({
      format: "Letter",
      preferCSSPageSize: true,
      printBackground: false,
      tagged: true,
      outline: true,
    });
    const pages = countPages(pdf);
    if (pages !== EXPECTED_PAGES) {
      console.error(
        `${file}: expected ${EXPECTED_PAGES} pages, got ${pages}; trim the content or spacing`,
      );
      continue;
    }
    checked.push({ file, pdf, pages });
  }
} finally {
  await browser.close();
}

if (checked.length !== publicCvs.length) {
  process.exitCode = 1;
} else {
  for (const { file, pdf, pages } of checked) {
    writeFileSync(file, pdf);
    console.log(`wrote ${file} (${pages} pages, ${Math.round(pdf.length / 1024)} KB)`);
  }
}
