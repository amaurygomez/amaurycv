import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

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
const YEAR_ALLOWED_FILES = ["src/styles/fonts/OFL.txt"];

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

const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const word = (term: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}._-])${escape(fold(term))}(?![\\p{L}\\p{N}=])`, "u");
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

function pdfTextOf(file: string) {
  try {
    return execFileSync("pdftotext", ["-layout", file, "-"], {
      encoding: "utf8",
      maxBuffer: 8_000_000,
    });
  } catch {
    return null;
  }
}

function denylist() {
  if (!existsSync(DENYLIST)) return [];
  return readFileSync(DENYLIST, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .filter((term) => !LABEL_TERMS.includes(fold(term)));
}

function hits(text: string, terms: string[]) {
  return terms.filter((term) => word(term).test(fold(text)));
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
  const terms = denylist();
  const missingDenylist = !existsSync(DENYLIST);

  it.skipIf(missingDenylist)("has a denylist with enough terms to be worth running", () => {
    expect(terms.length).toBeGreaterThan(5);
  });

  it.skipIf(missingDenylist)("keeps denylisted names out of every repo file", () => {
    const found: string[] = [];
    for (const { file, text } of scannable()) {
      found.push(...hits(text, terms).map((term) => `${file}: ${term}`));
    }
    expect(found).toEqual([]);
  });

  it.skipIf(missingDenylist)("keeps denylisted names out of the published PDFs", () => {
    const pdfs = repoFiles().filter((f) => f.startsWith("public/") && f.endsWith(".pdf"));
    const found: string[] = [];
    expect(pdfs.length).toBeGreaterThan(0);
    for (const file of pdfs) {
      const text = pdfTextOf(file);
      if (text === null) {
        found.push(`${file}: unreadable, install poppler-utils for pdftotext`);
        continue;
      }
      found.push(...hits(text, terms).map((term) => `${file}: ${term}`));
    }
    expect(found).toEqual([]);
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
