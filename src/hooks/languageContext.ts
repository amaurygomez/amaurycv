import { createContext } from "react";
import type { Lang } from "@/i18n/content";

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageState | null>(null);
