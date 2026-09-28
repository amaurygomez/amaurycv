import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "@/i18n/content";
import type { ZoneMeta } from "@/world/types";
import { ZoneStory } from "./ZoneStory";

type CareerChapterCardProps = {
  zone: ZoneMeta;
  year?: string;
  lang: Lang;
  expanded: boolean;
  onToggle: () => void;
  id?: string;
};

export function CareerChapterCard({
  zone,
  year,
  lang,
  expanded,
  onToggle,
  id,
}: CareerChapterCardProps) {
  const accent = zone.accent;
  const sector = lang === "es" ? zone.sectorEs : zone.sectorEn;
  const title = lang === "es" ? zone.titleEs : zone.titleEn;
  const subtitle = lang === "es" ? zone.subtitleEs : zone.subtitleEn;
  const period = lang === "es" ? zone.periodEs : zone.periodEn;
  const scale = lang === "es" ? zone.scaleEs : zone.scaleEn;
  const yearSuffix = year ? ` · ${year}` : "";

  return (
    <article
      id={id}
      role={expanded ? "dialog" : undefined}
      className="overflow-hidden rounded-2xl border"
      style={{
        borderColor: `${accent}38`,
        background: `linear-gradient(180deg, ${accent}0e 0%, rgba(11,16,32,0.88) 60%)`,
        boxShadow: `0 22px 60px -38px ${accent}`,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left"
        aria-expanded={expanded}
        aria-label={
          lang === "es"
            ? `${expanded ? "Cerrar" : "Abrir"} capítulo: ${title}${yearSuffix}`
            : `${expanded ? "Collapse" : "Expand"} chapter: ${title}${yearSuffix}`
        }
      >
        {year && (
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[11px] font-bold"
            style={{
              borderColor: `${accent}66`,
              background: `${accent}18`,
              color: accent,
              boxShadow: `0 0 18px -4px ${accent}`,
            }}
            aria-hidden="true"
          >
            {year}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
            />
            <span
              className="text-[9.5px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: accent }}
            >
              {sector ?? zone.category}
            </span>
          </div>
          <h3 className="mt-1 font-display text-[17px] leading-tight text-ag-text">{title}</h3>
          <div className="mt-1 text-[11.5px] leading-snug font-medium" style={{ color: accent }}>
            {subtitle}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[period, scale].map((item) => (
              <span
                key={item}
                className="rounded-full border px-2 py-0.5 text-[9.5px] tracking-[0.16em] text-ag-text/80 uppercase"
                style={{ borderColor: `${accent}45`, background: `${accent}10` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <span
          className="mt-1 -mr-1 shrink-0 rounded-full p-1.5 text-ag-text-muted"
          style={{ background: expanded ? `${accent}14` : "transparent" }}
          aria-hidden="true"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="space-y-4 border-t px-4 pt-4 pb-5"
              style={{ borderColor: `${accent}26` }}
            >
              <ZoneStory zone={zone} lang={lang} />
              <button
                type="button"
                onClick={onToggle}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-ag-text/85 uppercase"
                style={{ borderColor: `${accent}45`, background: `${accent}10` }}
              >
                {lang === "es" ? "Volver atrás" : "Go back"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
