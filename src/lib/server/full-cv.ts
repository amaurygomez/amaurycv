import { CV_FULL_KEY } from "astro:env/server";
import type { Lang } from "@/i18n/content";
import { parseKey, unseal } from "./sealed";
import sealedEn from "@sealed/cv.en.pdf.enc?raw";
import sealedEs from "@sealed/cv.es.pdf.enc?raw";

const SEALED: Record<Lang, string> = { en: sealedEn, es: sealedEs };
const opened = new Map<Lang, Buffer>();

/** Distinct from the public /Amaury-Gomez-CV-XX.pdf download so both can sit in one folder. */
export const fullCvFilename = (lang: Lang) => `Amaury-Gomez-CV-Full-${lang.toUpperCase()}.pdf`;

/** Decrypts the committed full CV; null when the key is missing or does not match. */
export function openFullCv(lang: Lang): Buffer | null {
  const cached = opened.get(lang);
  if (cached) return cached;
  try {
    const pdf = unseal(SEALED[lang], parseKey(CV_FULL_KEY), `cv:${lang}`);
    opened.set(lang, pdf);
    return pdf;
  } catch (error) {
    console.error(`[full-cv] cannot open ${lang}`, error);
    return null;
  }
}
