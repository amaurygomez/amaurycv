/**
 * Canonical zone IDs for AG World.
 * The world is ONE unified map (no scene swapping). Each zone is a
 * bounded area inside the map with its own floor, furniture and panel.
 */
export type ZoneId =
  | "telecom-quality"
  | "public-security"
  | "banking-finance"
  | "software-factory"
  | "personal-lab"
  | "discipline-life"
  | "education-path";

export type ZoneCategory =
  | "telecom"
  | "seguridad"
  | "finanzas"
  | "software"
  | "laboratorio"
  | "vida"
  | "educacion";

export type ZoneSceneType =
  | "telecom-store"
  | "security-command"
  | "banking-floor"
  | "software-factory"
  | "personal-lab"
  | "discipline-life"
  | "education-campus";

export interface ZoneBounds {
  /** Top-left iso tile coordinate. */
  x: number;
  y: number;
  /** Footprint in tiles. */
  w: number;
  h: number;
}

/** Localized string pair. */
export interface I18nText {
  es: string;
  en: string;
}

export interface ZoneDetail {
  label: I18nText;
  value: I18nText;
}

/** Sub-experience mini-card rendered as a visual chapter inside a zone panel. */
export interface ZoneExperience {
  /** Lucide icon name (kebab-case) handled by the panel renderer. */
  iconKey: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

/** Timeline node used by the Origin Story zone. */
export interface TimelineNode {
  ageLabelEs?: string;
  ageLabelEn?: string;
  yearLabel?: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

export interface ZoneMeta {
  id: ZoneId;
  scene: ZoneSceneType;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  periodEs: string;
  periodEn: string;
  scaleEs: string;
  scaleEn: string;
  thumbEs: string;
  thumbEn: string;
  /** Paragraph body shown in side panel. */
  bodyEs: string;
  bodyEn: string;
  /** Optional structured bullets shown under the body. */
  bulletsEs?: readonly string[];
  bulletsEn?: readonly string[];
  details?: readonly ZoneDetail[];
  category: ZoneCategory;
  /** Iso tile bounds inside the unified WorldMap. */
  bounds: ZoneBounds;
  /** Floor tint inside the zone (overrides default world floor). */
  floorColor: string;
  /** Accent color of the zone — walls, glows, hotspot ring. */
  accent: string;
  /** Hex glow color for the ambient light radial. */
  glow: string;
  /**
   * Pills shown inside the side panel (stack/tags).
   * Use `pills` for language-neutral tech names (.NET, React, SQL Server).
   * Use `pillsEs`/`pillsEn` only when the label itself must translate.
   */
  pills?: readonly string[];
  pillsEs?: readonly string[];
  pillsEn?: readonly string[];
  /** Optional "Operational value" section — why the work mattered. */
  operationalValueEs?: string;
  operationalValueEn?: string;
  /** Optional one-liner "What this proves" — credibility statement. */
  proofEs?: string;
  proofEn?: string;
  /** Sector label for zone chips (UI-friendly short string). */
  sectorEs?: string;
  sectorEn?: string;
  /** Origin-story style timeline rendered inside the panel. */
  timeline?: readonly TimelineNode[];
  /** Sub-experience cards (visual chapters) shown inside the zone panel. */
  experiences?: readonly ZoneExperience[];
}
