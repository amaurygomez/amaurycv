import { motion } from "motion/react";
import { useLanguage } from "../../hooks/useLanguage";
import { useWorld } from "../state/useWorld";
import { ZONE_META } from "../content/zones";
import type { ZoneId } from "../types";

/**
 * Chapter strip — fixed top-center on desktop, scrollable on mobile.
 * Always visible so visitors immediately see the career narrative arc
 * without opening any panel. Click jumps to that chapter's room.
 * Chapters are numbered (not dated) so the story reads as a progression
 * without exposing employment dates.
 */
const CHRONOLOGICAL: { id: ZoneId; year: string }[] = [
  { id: "education-path", year: "01" },
  { id: "software-factory", year: "02" },
  { id: "banking-finance", year: "03" },
  { id: "telecom-quality", year: "04" },
  { id: "public-security", year: "05" },
  { id: "personal-lab", year: "06" },
  { id: "discipline-life", year: "07" },
];

export function ZoneNavigator() {
  const { activeZone, setActiveZone } = useWorld();
  const { lang } = useLanguage();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="
        pointer-events-auto absolute z-30
        inset-x-2 top-[3.6rem] flex justify-center
        sm:inset-x-auto sm:left-1/2 sm:top-4 sm:-translate-x-1/2
      "
      aria-label={lang === "es" ? "Capítulos profesionales" : "Career chapters"}
    >
      <div
        className="flex max-w-full items-stretch gap-1 overflow-x-auto rounded-full border border-white/10 bg-[#070B14]/85 p-1 backdrop-blur-md sm:overflow-visible"
        style={{
          boxShadow: "0 18px 50px -28px rgba(232,185,107,0.45)",
        }}
      >
        {CHRONOLOGICAL.map(({ id, year }) => {
          const zone = ZONE_META[id];
          const active = activeZone === id;
          const sector = (lang === "es" ? zone.sectorEs : zone.sectorEn) ?? zone.category;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveZone(active ? null : id)}
              className={`
                group relative flex shrink-0 flex-col items-center gap-0.5 rounded-full
                px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em]
                transition
                ${active ? "text-[#0B1020]" : "text-[#A8B0C2] hover:text-[#F7F3EA]"}
              `}
              style={{
                background: active ? zone.accent : "transparent",
                boxShadow: active ? `0 0 18px -4px ${zone.accent}` : undefined,
              }}
              aria-pressed={active}
              aria-label={`${lang === "es" ? "Capítulo" : "Chapter"} ${year} · ${lang === "es" ? zone.titleEs : zone.titleEn}`}
              title={lang === "es" ? zone.titleEs : zone.titleEn}
            >
              <span
                className="text-[10px] font-bold tracking-[0.04em]"
                style={{ color: active ? "#0B1020" : zone.accent }}
              >
                {year}
              </span>
              <span className="hidden text-[8.5px] font-semibold md:inline">{sector}</span>
              {!active && (
                <span
                  className="absolute -bottom-0.5 left-1/2 inline-block h-[3px] w-[3px] -translate-x-1/2 rounded-full"
                  style={{ background: zone.accent, boxShadow: `0 0 6px ${zone.accent}` }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
