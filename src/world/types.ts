export type ZoneId =
  "telecom" | "public-sector" | "banking" | "pos" | "ai-lab" | "discipline" | "origin";

type ZoneCategory =
  "telecom" | "public-sector" | "finance" | "software" | "ai-lab" | "discipline" | "education";

/** Iso tile rectangle: x/y is the top-left tile, w/h the footprint. */
export interface ZoneBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface I18nText {
  es: string;
  en: string;
}

interface ZoneDetail {
  label: I18nText;
  value: I18nText;
}

export interface ZoneExperience {
  /** Key into ZONE_ICONS in components/career/iconMap.ts. */
  iconKey: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

export interface TimelineNode {
  kickerEs?: string;
  kickerEn?: string;
  step?: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

export interface ZoneMeta {
  id: ZoneId;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  periodEs: string;
  periodEn: string;
  scaleEs: string;
  scaleEn: string;
  bodyEs: string;
  bodyEn: string;
  details?: readonly ZoneDetail[];
  category: ZoneCategory;
  bounds: ZoneBounds;
  floorColor: string;
  accent: string;
  glow: string;
  /**
   * Use `pills` for language-neutral tech names (.NET, React, SQL Server) and
   * `pillsEs`/`pillsEn` only when the label itself must be translated.
   */
  pills?: readonly string[];
  pillsEs?: readonly string[];
  pillsEn?: readonly string[];
  operationalValueEs?: string;
  operationalValueEn?: string;
  proofEs?: string;
  proofEn?: string;
  sectorEs?: string;
  sectorEn?: string;
  timeline?: readonly TimelineNode[];
  experiences?: readonly ZoneExperience[];
}
