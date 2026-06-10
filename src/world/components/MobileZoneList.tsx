import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../hooks/useLanguage";
import { ZONE_META, ZONE_ORDER } from "../content/zones";
import { useWorld } from "../state/useWorld";
import type { ZoneId } from "../types";

export function MobileZoneList() {
  const { lang } = useLanguage();
  const { setActiveZone, journeyCompleted } = useWorld();

  return (
    <div className="absolute inset-x-0 bottom-0 top-[14.5rem] z-20 overflow-y-auto px-4 pb-32 sm:hidden">
      <div className="space-y-3">
        {ZONE_ORDER.map((id, index) => (
          <ZoneCard
            key={id}
            id={id}
            index={index}
            onOpen={() => setActiveZone(id)}
            lang={lang}
          />
        ))}
      </div>
      {!journeyCompleted && (
        <div className="mt-5 rounded-2xl border border-[#E8B96B]/15 bg-white/[0.03] px-4 py-3 text-[12px] leading-relaxed text-[#A8B0C2]">
          {lang === "es"
            ? "Toca una zona para entrar a la escena isometrica y abrir su panel."
            : "Tap a zone to enter the isometric scene and open its panel."}
        </div>
      )}
    </div>
  );
}

function ZoneCard({
  id,
  index,
  onOpen,
  lang,
}: {
  id: ZoneId;
  index: number;
  onOpen: () => void;
  lang: "es" | "en";
}) {
  const zone = ZONE_META[id];
  const accent = zone.accent;

  const sector = lang === "es" ? zone.sectorEs : zone.sectorEn;
  const period = lang === "es" ? zone.periodEs : zone.periodEn;
  const scale = lang === "es" ? zone.scaleEs : zone.scaleEn;
  const title = lang === "es" ? zone.titleEs : zone.titleEn;
  const subtitle = lang === "es" ? zone.subtitleEs : zone.subtitleEn;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      className="
        flex w-full items-stretch gap-3 rounded-2xl border p-3.5 text-left
        shadow-[0_14px_40px_-28px_rgba(0,0,0,0.85)] backdrop-blur-md
      "
      style={{
        borderColor: `${accent}30`,
        background: `linear-gradient(135deg, ${accent}10 0%, rgba(11,16,32,0.92) 55%)`,
      }}
      aria-label={title}
    >
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border"
        style={{ borderColor: `${accent}55`, background: `${accent}14` }}
        aria-hidden="true"
      >
        <ZoneThumb id={id} accent={accent} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
          {sector && (
            <span
              className="rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: `${accent}55`, color: accent, background: `${accent}10` }}
            >
              {sector}
            </span>
          )}
          <span className="truncate text-[9.5px] uppercase tracking-[0.16em] text-[#A8B0C2]/80">
            {period} · {scale}
          </span>
        </div>
        <div className="mt-1.5 text-[15px] font-semibold leading-tight text-[#F7F3EA]">
          {title}
        </div>
        <div className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#A8B0C2]">
          {subtitle}
        </div>
      </div>
      <ChevronRight size={18} className="shrink-0 self-center" style={{ color: accent }} />
    </motion.button>
  );
}

function ZoneThumb({ id, accent }: { id: ZoneId; accent: string }) {
  const stroke = accent;

  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" aria-hidden="true">
      <rect x="10" y="40" width="44" height="8" rx="4" fill="rgba(247,243,234,0.08)" />
      {id === "telecom-quality" && (
        <>
          <rect x="10" y="24" width="12" height="16" rx="3" fill={stroke} fillOpacity="0.2" stroke={stroke} />
          <rect x="26" y="18" width="20" height="12" rx="3" fill="rgba(248,113,113,0.18)" stroke="#F87171" />
          <path d="M52 20v16" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M48 20c2 2 2 14 0 16M56 20c2 2 2 14 0 16" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {id === "public-security" && (
        <>
          <rect x="10" y="28" width="20" height="10" rx="3" fill="rgba(96,165,250,0.16)" stroke="#60A5FA" />
          <path d="M18 22h6" stroke="#F87171" strokeWidth="3" strokeLinecap="round" />
          <path d="M39 18l7 7-7 7" stroke={stroke} strokeWidth="2" />
          <rect x="42" y="31" width="10" height="12" rx="2" fill={stroke} fillOpacity="0.2" stroke={stroke} />
        </>
      )}
      {id === "banking-finance" && (
        <>
          <rect x="10" y="24" width="16" height="16" rx="3" fill={stroke} fillOpacity="0.18" stroke={stroke} />
          <rect x="31" y="18" width="12" height="22" rx="2" fill="rgba(247,243,234,0.08)" stroke="#F7F3EA" />
          <rect x="46" y="24" width="8" height="8" rx="2" fill="rgba(52,211,153,0.22)" stroke="#34D399" />
        </>
      )}
      {id === "software-factory" && (
        <>
          <rect x="10" y="22" width="18" height="18" rx="3" fill={stroke} fillOpacity="0.18" stroke={stroke} />
          <rect x="34" y="18" width="12" height="8" rx="2" fill="rgba(94,234,212,0.22)" stroke="#5EEAD4" />
          <path d="M40 27v12" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 20h6v16h-6" stroke="#F7F3EA" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {id === "personal-lab" && (
        <>
          <rect x="10" y="18" width="10" height="22" rx="2" fill="rgba(94,234,212,0.18)" stroke={stroke} />
          <rect x="22" y="18" width="10" height="22" rx="2" fill="rgba(52,211,153,0.18)" stroke="#34D399" />
          <circle cx="44" cy="26" r="8" fill="rgba(94,234,212,0.12)" stroke={stroke} />
          <path d="M44 18v16M36 26h16" stroke={stroke} strokeWidth="2" />
        </>
      )}
      {id === "discipline-life" && (
        <>
          <path d="M14 38c7-12 9-20 18-20 8 0 11 8 18 20" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 22l8 4" stroke="#F7F3EA" strokeWidth="2" />
          <rect x="34" y="24" width="16" height="4" rx="2" fill="rgba(247,243,234,0.2)" />
          <rect x="38" y="18" width="8" height="20" rx="2" stroke="#E8B96B" />
        </>
      )}
      {id === "education-path" && (
        <>
          <rect x="10" y="18" width="18" height="14" rx="2" fill="rgba(96,165,250,0.18)" stroke="#60A5FA" />
          <rect x="32" y="20" width="12" height="18" rx="2" fill="rgba(247,243,234,0.08)" stroke="#F7F3EA" />
          <circle cx="50" cy="28" r="6" fill="rgba(232,185,107,0.22)" stroke="#E8B96B" />
        </>
      )}
    </svg>
  );
}
