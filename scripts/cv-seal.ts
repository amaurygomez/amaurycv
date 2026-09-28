// Encrypts a full-CV PDF kept outside the repo into sealed/cv.<lang>.pdf.enc.
// Usage: npm run cv:seal -- <full-cv.pdf> <es|en>, with CV_FULL_KEY in .env.local.
import { readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseKey, seal, unseal } from "../src/lib/server/sealed.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const [input, lang] = process.argv.slice(2);

if (!input || (lang !== "es" && lang !== "en"))
  fail("usage: npm run cv:seal -- <full-cv.pdf> <es|en>");

const source = resolve(input);
if (!relative(root, source).startsWith("..")) fail("the plaintext PDF must live outside the repo");

const pdf = readFileSync(source);
if (pdf.subarray(0, 5).toString("latin1") !== "%PDF-") fail(`${input} is not a PDF`);
if (pdf.length > 4 * 1024 * 1024) fail("PDF is over 4 MiB; export a lighter one");

if (!process.env.CV_FULL_KEY)
  fail("CV_FULL_KEY is not set (generate one with: openssl rand -base64 32)");
const key = parseKey(process.env.CV_FULL_KEY);
const aad = `cv:${lang}`;
const sealed = seal(pdf, key, aad);
if (!unseal(sealed, key, aad).equals(pdf)) fail("round-trip check failed");

const target = resolve(root, "sealed", `cv.${lang}.pdf.enc`);
writeFileSync(target, `${sealed}\n`);
console.log(`sealed ${relative(root, target)} (${Math.round(pdf.length / 1024)} KiB)`);

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
