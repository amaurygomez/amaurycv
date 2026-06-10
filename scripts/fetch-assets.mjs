#!/usr/bin/env node
/**
 * fetch-assets.mjs — Stage 1 helper to download CC0 placeholder packs.
 *
 * Runs ON DEMAND only (npm run assets:fetch). Not part of build, not auto.
 * Stage 1 uses code-generated iso tiles; this script becomes useful once
 * we want to upgrade visuals with Kenney CC0 packs.
 *
 * All packs listed below are CC0 (public domain) — free for commercial use,
 * no attribution required. URLs verified May 2026; if Kenney moves them,
 * update the manifest below.
 *
 * Usage:
 *   node scripts/fetch-assets.mjs            # downloads all
 *   node scripts/fetch-assets.mjs blocks     # downloads just one pack
 *
 * Output: public/assets/<pack>/  (gitignored — re-fetch on clone)
 */

import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "assets");

/**
 * Manifest of Kenney CC0 packs we want for AG World scenes.
 * Edit this list as the scenes evolve.
 *
 * Each pack has:
 *   - key: short name (folder under public/assets/)
 *   - url: direct ZIP URL
 *   - license: must be CC0
 *   - source: page where the pack lives (for humans)
 *   - description: what the pack contains
 */
const PACKS = [
  {
    key: "isometric-blocks",
    url: "https://kenney.nl/media/pages/assets/isometric-blocks/86a0152f5b-1677662261/kenney_isometric-blocks.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/isometric-blocks",
    description: "Generic isometric building blocks and elements",
  },
  {
    key: "isometric-buildings",
    url: "https://kenney.nl/media/pages/assets/isometric-tiles-buildings/cfcdb066e1-1677694983/kenney_isometric-buildings.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/isometric-tiles-buildings",
    description: "Isometric building tiles and structures",
  },
  {
    key: "isometric-city",
    url: "https://kenney.nl/media/pages/assets/isometric-city/c3a3f12a59-1677673858/kenney_isometric-city.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/isometric-city",
    description:
      "Isometric city props: cars, lamp posts, fences, vegetation — useful for telecom storefront and street scenes",
  },
  {
    key: "isometric-tiles",
    url: "https://kenney.nl/media/pages/assets/isometric-tiles/91cd05a9c2-1677679720/kenney_isometric-tiles.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/isometric-tiles",
    description:
      "Hex + iso terrain tiles (grass, asphalt, water) for ground variations across rooms",
  },
  {
    key: "furniture-kit",
    url: "https://kenney.nl/media/pages/assets/furniture-kit/8ce9c8d7be-1677692253/kenney_furniture-kit.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/furniture-kit",
    description:
      "3D furniture (desks, chairs, bookshelves, beds, lamps) — pre-rendered iso angles available for replacing hand-drawn props",
  },
  {
    key: "mini-arena",
    url: "https://kenney.nl/media/pages/assets/mini-arena/89a14b6dec-1677660124/kenney_mini-arena.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/mini-arena",
    description:
      "Mini-style props (gym, sports, characters) — gym equipment & barbells for the discipline-life zone",
  },
  {
    key: "mini-market",
    url: "https://kenney.nl/media/pages/assets/mini-market/53fcd3a586-1677663186/kenney_mini-market.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/mini-market",
    description:
      "Storefront / point-of-sale props (POS terminals, shelves, products) — telecom store + POS scenes",
  },
  {
    key: "tower-defense-kit",
    url: "https://kenney.nl/media/pages/assets/tower-defense-kit/12c0d2b50a-1677673498/kenney_tower-defense-kit.zip",
    license: "CC0",
    source: "https://kenney.nl/assets/tower-defense-kit",
    description:
      "Towers, antennas, signal props — telecom cell tower + radar visualization upgrade",
  },
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function extractZip(zipPath, targetDir) {
  try {
    execSync(`unzip -q -o "${zipPath}" -d "${targetDir}"`, { stdio: "pipe" });
    await rm(zipPath, { force: true });
    console.log(`  extracted to ${targetDir}`);
  } catch (err) {
    console.warn(`  unzip failed (${err.message}), leaving ZIP in place`);
  }
}

async function downloadPack(pack) {
  const target = join(OUT, pack.key);
  const zipPath = `${target}.zip`;
  console.log(`\n→ ${pack.key}`);
  console.log(`  source: ${pack.source}`);
  console.log(`  license: ${pack.license}`);
  if (pack.description) {
    console.log(`  desc: ${pack.description}`);
  }

  if (await exists(target)) {
    console.log(`  already present at ${target} — skipping.`);
    return;
  }

  await mkdir(OUT, { recursive: true });
  console.log(`  fetching ${pack.url}`);
  const res = await fetch(pack.url);
  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status} for ${pack.url}`);
  }
  await pipeline(res.body, createWriteStream(zipPath));
  console.log(`  saved ${zipPath}`);
  await extractZip(zipPath, target);
}

async function main() {
  const want = process.argv[2];
  const list = want ? PACKS.filter((p) => p.key === want) : PACKS;
  if (!list.length) {
    console.error(`Unknown pack '${want}'. Available: ${PACKS.map((p) => p.key).join(", ")}`);
    process.exit(1);
  }

  console.log(`AG World · CC0 asset fetcher`);
  console.log(`Output: ${OUT}`);
  console.log(`Packs:  ${list.map((p) => p.key).join(", ")}`);

  for (const pack of list) {
    try {
      await downloadPack(pack);
    } catch (err) {
      console.error(`✖ ${pack.key} failed:`, err.message);
    }
  }
  console.log(`\nDone. Remember public/assets/ is gitignored.`);
}

// Avoid catching unhandled rejections silently
main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
