#!/usr/bin/env node
// Prints /cv into public/Amaury-Gomez-CV-{ES,EN}.pdf. Needs the dev or preview server running.
// Usage: node scripts/cv-pdf.mjs [baseUrl]
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://127.0.0.1:4321";
const TARGETS = [
  { lang: "es", file: "public/Amaury-Gomez-CV-ES.pdf" },
  { lang: "en", file: "public/Amaury-Gomez-CV-EN.pdf" },
];
const EXPECTED_PAGES = 2;

// Names that must never ship, kept out of the repo: .privacy-denylist (one per line) or PRIVACY_DENYLIST.
function readDenylist() {
  let text = process.env.PRIVACY_DENYLIST ?? "";
  try {
    text += `\n${readFileSync(".privacy-denylist", "utf8")}`;
  } catch {
    // The file is optional; PRIVACY_DENYLIST alone is a valid source.
  }
  const terms = text
    .split(/[\n,]/)
    .map((term) => term.trim())
    .filter((term) => term && !term.startsWith("#"));
  if (!terms.length) {
    console.error("no denylist terms: set PRIVACY_DENYLIST or create .privacy-denylist");
    process.exit(1);
  }
  return terms;
}

const fold = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function privacyHits(text, terms) {
  const folded = fold(text);
  return terms.filter((term) =>
    new RegExp(`(?<![\\p{L}\\p{N}])${escape(fold(term))}(?![\\p{L}\\p{N}])`, "u").test(folded),
  );
}

// Counts page objects; "/Type /Pages" is the page tree and is excluded.
function countPages(pdf) {
  return pdf.toString("latin1").match(/\/Type\s*\/Page(?![A-Za-z])/g)?.length ?? 0;
}

const denylist = readDenylist();
const browser = await chromium.launch();
const page = await browser.newPage();
let failed = false;

for (const { lang, file } of TARGETS) {
  await page.goto(`${BASE}/cv?lang=${lang}`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready);

  const hits = privacyHits(await page.evaluate(() => document.body.innerText), denylist);
  if (hits.length) {
    console.error(`${file}: denylisted terms in the printed text: ${hits.join(", ")}`);
    failed = true;
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
    failed = true;
    continue;
  }

  writeFileSync(file, pdf);
  console.log(`wrote ${file} (${pages} pages, ${Math.round(pdf.length / 1024)} KB)`);
}

await browser.close();
process.exit(failed ? 1 : 0);
