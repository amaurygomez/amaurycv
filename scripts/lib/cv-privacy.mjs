import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const publicCvs = [
  { lang: "es", file: "public/Amaury-Gomez-CV-ES.pdf" },
  { lang: "en", file: "public/Amaury-Gomez-CV-EN.pdf" },
];

export const foldText = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeTerm = (text) => foldText(text).replace(/\s+/gu, " ").trim();

export function readPrivacyTerms() {
  let text = process.env.PRIVACY_DENYLIST ?? "";
  try {
    text += `\n${readFileSync(".privacy-denylist", "utf8")}`;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  return [
    ...new Set(
      text
        .split("\n")
        .filter((line) => !line.trimStart().startsWith("#"))
        .flatMap((line) => line.split(","))
        .map(normalizeTerm)
        .filter(Boolean),
    ),
  ];
}

export function countPrivacyMatches(text, terms) {
  const normalized = normalizeTerm(text);
  return terms.filter((term) =>
    new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(term)}(?![\\p{L}\\p{N}])`, "u").test(normalized),
  ).length;
}

export function readPdfText(file) {
  const text = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", file, "-"], {
    encoding: "utf8",
    maxBuffer: 8_000_000,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (!text.trim()) throw new Error("PDF text extraction returned no text");
  return text;
}
