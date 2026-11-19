import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  countPrivacyMatches,
  escapeRegex,
  foldText,
  readPdfText,
  readPrivacyTerms,
} from "../../scripts/lib/cv-privacy.mjs";

const DENYLIST = ".privacy-denylist";
const SELF = "tests/unit/privacy.test.ts";

// Open-ended employment labels. "current" and "actual" are ordinary identifiers in code
// (ref.current, aria-current), so they are matched on prose lines only.
const LABEL_TERMS = [
  "present",
  "presente",
  "current",
  "actual",
  "actualidad",
  "in progress",
  "en curso",
];
// The unfinished degree keeps "In progress"; the label only leaks when it marks a job.
const EDUCATION = /degree|estudios|universi|licenciatura|ingenier|maestr|bachiller/i;

// Four-digit numbers that are versions, namespaces or byte limits, never employment dates.
const YEAR_ALLOWED = [
  /SharePoint 2013/g,
  /· IBM · 20\d{2}/g,
  /www\.w3\.org\/2000\/svg/g,
  /(?<![\p{L}\p{N}])(?:2000|2048)(?![\p{L}\p{N}])/gu,
];
const YEAR_ALLOWED_FILES = ["src/styles/fonts/OFL.txt", "LICENSE"];

// An age pins a birth year; an approximate tenure ("8+ años") does not.
const AGE_PATTERNS = [
  /(?<![\p{L}\p{N}])age\s*\d/giu,
  /(?<![\p{L}\p{N}])\d{1,2}\s*años(?![\p{L}\p{N}])/giu,
];
const AGE_ALLOWED = [
  /tenure: "[^"]*"/g,
  /\d{1,2}\s*\+\s*años/g,
  /\+\s*\d{1,2}\s*años/g,
  /más de \d{1,2} años/gi,
];

const CODE_FILE = /\.(ts|tsx|js|mjs|cjs|astro|json|css)$/;
const PROSE_LINE = /["'`*]|\/\//;

const word = (term: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}._-])${escapeRegex(foldText(term))}(?![\\p{L}\\p{N}=])`, "u");
const strip = (text: string, patterns: RegExp[]) =>
  patterns.reduce((left, pattern) => left.replace(pattern, ""), text);

function repoFiles() {
  const listed = execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    {
      encoding: "utf8",
    },
  );
  return listed.split("\0").filter((file) => file && existsSync(file));
}

function textOf(file: string) {
  if (statSync(file).size > 8_000_000) return null;
  const text = readFileSync(file, "utf8");
  return text.includes("\0") ? null : text;
}

function hits(text: string, terms: string[]) {
  return terms.filter((term) => word(term).test(foldText(text)));
}

/** Every repo file that is readable as text, this file excluded: it names the terms it hunts. */
function scannable() {
  return repoFiles()
    .filter((file) => file !== SELF)
    .flatMap((file) => {
      const text = textOf(file);
      return text === null ? [] : [{ file, text }];
    });
}

describe("privacy", () => {
  const terms = readPrivacyTerms().filter((term) => !LABEL_TERMS.includes(term));
  const missingDenylist = !process.env.PRIVACY_DENYLIST?.trim() && !existsSync(DENYLIST);

  it("matches a full term across line breaks, regardless of case and accents", () => {
    expect(countPrivacyMatches("ÁRBOL\n   AZUL", ["arbol azul"])).toBe(1);
    expect(countPrivacyMatches("superárbol azulino", ["arbol azul"])).toBe(0);
  });

  it.skipIf(missingDenylist)("has at least one private term configured", () => {
    expect(terms.length).toBeGreaterThan(0);
  });

  it.skipIf(missingDenylist)("keeps denylisted names out of every repo file", () => {
    const affectedFiles = scannable().filter(({ text }) => hits(text, terms).length).length;
    expect(affectedFiles, "Private matches detected in repository files").toBe(0);
  });

  it.skipIf(missingDenylist)("keeps denylisted names out of the published PDFs", () => {
    const pdfs = repoFiles().filter((f) => f.startsWith("public/") && f.endsWith(".pdf"));
    expect(pdfs.length).toBeGreaterThan(0);
    let unreadable = 0;
    let matches = 0;
    for (const file of pdfs) {
      try {
        matches += countPrivacyMatches(readPdfText(file), terms);
      } catch {
        unreadable += 1;
      }
    }
    expect(unreadable, "Could not extract PDF text. Check the PDFs and install pdftotext").toBe(0);
    expect(matches, "Private matches detected in published PDFs").toBe(0);
  });

  it("uses no open-ended employment labels anywhere in the repo", () => {
    const found: string[] = [];
    for (const { file, text } of scannable()) {
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        if (CODE_FILE.test(file) && !PROSE_LINE.test(line)) return;
        const near = lines.slice(Math.max(0, index - 2), index + 3).join("\n");
        if (EDUCATION.test(near)) return;
        found.push(...hits(line, LABEL_TERMS).map((term) => `${file}:${index + 1}: ${term}`));
      });
    }
    expect(found).toEqual([]);
  });

  it("shows no calendar years outside the allowlist", () => {
    const found: string[] = [];
    for (const { file, text } of scannable()) {
      if (YEAR_ALLOWED_FILES.includes(file)) continue;
      const years = strip(text, YEAR_ALLOWED).match(
        /(?<![\p{L}\p{N}])(19|20)\d{2}(?![\p{L}\p{N}])/gu,
      );
      found.push(...(years ?? []).map((year) => `${file}: ${year}`));
    }
    expect(found).toEqual([]);
  });

  it("gives away no age, only approximate tenure", () => {
    const found: string[] = [];
    for (const { file, text } of scannable()) {
      const left = strip(text, AGE_ALLOWED);
      for (const pattern of AGE_PATTERNS) {
        found.push(...(left.match(pattern) ?? []).map((hit) => `${file}: ${hit.trim()}`));
      }
    }
    expect(found).toEqual([]);
  });
});
