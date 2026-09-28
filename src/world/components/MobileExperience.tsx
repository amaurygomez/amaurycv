import { motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Code2,
  FileText,
  Gamepad2,
  Layers,
  Mail,
  MapPin,
  Quote,
  Sparkles,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { content, profile } from "@/i18n/content";
import { ZONE_META } from "@/world/content/zones";
import { useWorld } from "@/world/state/useWorld";
import type { ZoneId } from "@/world/types";
import { CapabilityGroupCard } from "./career/CapabilityGroupCard";
import { CareerChapterCard } from "./career/CareerChapterCard";
import { SKILL_GROUP_ICON_KEYS } from "./career/iconMap";
import { MetricCard } from "./career/MetricCard";
import { SectorChip } from "./career/SectorChip";

// Chapters are numbered rather than dated so the story reads as a progression
// without exposing employment dates.
const CHRONOLOGICAL: { id: ZoneId; year: string }[] = [
  { id: "origin", year: "01" },
  { id: "pos", year: "02" },
  { id: "banking", year: "03" },
  { id: "telecom", year: "04" },
  { id: "public-sector", year: "05" },
  { id: "ai-lab", year: "06" },
  { id: "discipline", year: "07" },
];

export function MobileExperience({ onEnterWorld }: { onEnterWorld: () => void }) {
  const { lang, setLang } = useLanguage();
  const { setContactOpen, setStackOpen } = useWorld();
  const [expandedZone, setExpandedZone] = useState<ZoneId | null>(null);
  const t = content[lang];

  const toggleZone = useCallback(
    (id: ZoneId) => setExpandedZone((prev) => (prev === id ? null : id)),
    [],
  );

  const positioning =
    lang === "es"
      ? "Software que sostiene venta, atención, decisiones y auditoría todos los días."
      : "Software that supports sales, customer care, decisions, and auditing every day.";
  const tagline =
    lang === "es"
      ? "Construyo y modernizo sistemas que tienen que funcionar en operación real."
      : "I build and modernize systems that have to work in real operations.";
  const role =
    lang === "es"
      ? "Ingeniero de Software Senior · Full Stack .NET / React"
      : "Senior Software Engineer · Full Stack .NET / React";

  const stats =
    lang === "es"
      ? [
          { value: "+11", label: "años", sub: "en producción" },
          { value: "4", label: "sectores", sub: "operación real" },
        ]
      : [
          { value: "11+", label: "years", sub: "in production" },
          { value: "4", label: "sectors", sub: "real operations" },
        ];

  const sectorChips: { label: string; accent: string }[] =
    lang === "es"
      ? [
          { label: "Telecomunicaciones", accent: "#5EEAD4" },
          { label: "Sector Público", accent: "#34D399" },
          { label: "Banca", accent: "#E8B96B" },
          { label: "Software / Ops", accent: "#A78BFA" },
        ]
      : [
          { label: "Telecommunications", accent: "#5EEAD4" },
          { label: "Public Sector", accent: "#34D399" },
          { label: "Banking", accent: "#E8B96B" },
          { label: "Software / Ops", accent: "#A78BFA" },
        ];

  const stackCore = [".NET", "React", "Java", "Oracle", "SQL Server", "Maps", "APIs"];

  return (
    <div className="relative w-full overflow-x-hidden bg-ag-bg text-ag-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(110% 60% at 50% 0%, rgba(232,185,107,0.18) 0%, rgba(7,11,20,0) 70%), radial-gradient(80% 50% at 80% 8%, rgba(94,234,212,0.12) 0%, rgba(7,11,20,0) 65%)",
        }}
      />

      <section className="relative px-5 pt-6 pb-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ag-gold/55 bg-ag-gold/15 text-[12px] font-bold tracking-[0.04em] text-ag-gold"
              style={{ boxShadow: "0 0 22px -4px rgba(232,185,107,0.6)" }}
            >
              AG
            </span>
            <div className="leading-tight">
              <div className="text-[10px] tracking-[0.3em] text-ag-gold uppercase">AG World</div>
              <div className="mt-0.5 text-[9.5px] tracking-[0.22em] text-ag-text-muted/70 uppercase">
                amaurygomez.dev
              </div>
            </div>
          </div>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>

        <h1 className="mt-7 font-display text-[28px] leading-tight">{profile.shortName}</h1>
        <p className="mt-1.5 text-[12.5px] text-ag-text-muted">{role}</p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10.5px] tracking-[0.16em] text-ag-text-muted uppercase">
          <MapPin size={11} className="text-ag-gold" />
          Santo Domingo, RD
        </div>

        <p className="mt-6 text-[16px] leading-snug text-ag-text">{tagline}</p>

        <div
          className="mt-5 flex gap-2.5 rounded-xl border p-3 text-[12.5px] leading-relaxed text-ag-text/86"
          style={{
            borderColor: "rgba(232,185,107,0.32)",
            background:
              "linear-gradient(135deg, rgba(232,185,107,0.12) 0%, rgba(232,185,107,0.02) 60%, transparent 100%)",
          }}
        >
          <Quote size={14} className="mt-0.5 shrink-0 text-ag-gold" />
          <span>{positioning}</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {stats.map((s, i) => (
            <MetricCard key={s.label} value={s.value} label={s.label} sub={s.sub} index={i} />
          ))}
        </div>

        <div className="mt-7">
          <div className="mb-2 text-[9.5px] tracking-[0.24em] text-ag-text-muted/75 uppercase">
            {lang === "es" ? "Sectores" : "Sectors"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sectorChips.map((s) => (
              <SectorChip key={s.label} label={s.label} accent={s.accent} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-[9.5px] tracking-[0.24em] text-ag-text-muted/75 uppercase">
            {lang === "es" ? "Stack núcleo" : "Core stack"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stackCore.map((s) => (
              <span
                key={s}
                className="rounded-md border border-ag-teal/30 bg-ag-teal/10 px-2.5 py-1 text-[10.5px] font-medium tracking-[0.1em] text-ag-teal uppercase"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-ag-gold px-4 py-2.5 text-[11.5px] font-semibold tracking-[0.16em] text-ag-panel uppercase transition hover:bg-[#f0c887]"
          >
            <Mail size={13} strokeWidth={2.6} />
            {lang === "es" ? "Contacto" : "Contact"}
          </button>
          <button
            type="button"
            onClick={() => setStackOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-ag-teal/40 px-4 py-2.5 text-[11.5px] font-semibold tracking-[0.16em] text-ag-text uppercase transition hover:border-ag-teal hover:text-ag-teal"
          >
            <Layers size={13} strokeWidth={2.6} />
            Stack
          </button>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ag-gold/35 px-4 py-2.5 text-[11.5px] font-semibold tracking-[0.16em] text-ag-text uppercase transition hover:border-ag-gold hover:text-ag-gold"
          >
            <Code2 size={13} strokeWidth={2.6} />
            GitHub
          </a>
          <a
            href={`${profile.cvPath}?lang=${lang}`}
            className="inline-flex items-center gap-2 rounded-full border border-ag-gold/35 px-4 py-2.5 text-[11.5px] font-semibold tracking-[0.16em] text-ag-text uppercase transition hover:border-ag-gold hover:text-ag-gold"
          >
            <FileText size={13} strokeWidth={2.6} />
            CV
          </a>
        </div>

        <button
          type="button"
          onClick={onEnterWorld}
          className="mt-6 flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left shadow-[0_18px_50px_-28px_rgba(94,234,212,0.55)] backdrop-blur-md transition active:scale-[0.99]"
          style={{
            borderColor: "rgba(94,234,212,0.35)",
            background:
              "linear-gradient(135deg, rgba(94,234,212,0.14) 0%, rgba(11,16,32,0.92) 60%)",
          }}
        >
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ag-teal/50 bg-ag-teal/12 text-ag-teal"
            style={{ boxShadow: "0 0 22px -6px rgba(94,234,212,0.7)" }}
            aria-hidden="true"
          >
            <Gamepad2 size={20} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[9.5px] font-semibold tracking-[0.24em] text-ag-teal uppercase">
              {lang === "es" ? "Modo interactivo" : "Interactive mode"}
            </span>
            <span className="mt-1 block font-display text-[16px] leading-tight text-ag-text">
              {lang === "es" ? "Explorar AG World" : "Explore AG World"}
            </span>
            <span className="mt-1 block text-[11.5px] leading-snug text-ag-text-muted">
              {lang === "es"
                ? "Recorre las 7 salas de mi carrera en el mapa isométrico."
                : "Walk the 7 rooms of my career on the isometric map."}
            </span>
          </span>
          <ArrowRight size={16} className="shrink-0 text-ag-teal" strokeWidth={2.4} />
        </button>

        <div className="mt-6 flex items-center gap-2 text-[10px] tracking-[0.18em] text-ag-text-muted/70 uppercase">
          <ArrowDownRight size={11} strokeWidth={2.4} />
          <span>
            {lang === "es"
              ? "Desliza para ver los 7 capítulos de la carrera"
              : "Scroll to see the 7 career chapters"}
          </span>
        </div>
      </section>

      <section className="border-y border-white/5 bg-ag-bg/60 px-5 py-4">
        <div className="mb-2.5 text-[9.5px] font-semibold tracking-[0.24em] text-ag-text-muted/80 uppercase">
          {lang === "es" ? "Capítulos" : "Chapters"}
        </div>
        <div className="-mx-5 overflow-x-auto px-5 pb-1">
          <div className="flex gap-2">
            {CHRONOLOGICAL.map(({ id, year }) => {
              const zone = ZONE_META[id];
              const active = expandedZone === id;
              const sector = lang === "es" ? zone.sectorEs : zone.sectorEn;
              const zoneTitle = lang === "es" ? zone.titleEs : zone.titleEn;
              const ariaLabel =
                lang === "es"
                  ? `Capítulo: ${sector ?? zoneTitle} · ${year}. Ir al detalle.`
                  : `Chapter: ${sector ?? zoneTitle} · ${year}. Jump to detail.`;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    toggleZone(id);
                    requestAnimationFrame(() => {
                      document.getElementById(`mobile-zone-${id}`)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    });
                  }}
                  className="inline-flex shrink-0 flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[9.5px] tracking-[0.14em] uppercase"
                  style={{
                    color: active ? "#0B1020" : zone.accent,
                    background: active ? zone.accent : `${zone.accent}10`,
                    border: `1px solid ${zone.accent}55`,
                    boxShadow: active ? `0 0 16px -4px ${zone.accent}` : undefined,
                  }}
                  aria-pressed={active}
                  aria-label={ariaLabel}
                >
                  <span className="text-[10.5px] font-bold tracking-[0.04em]">{year}</span>
                  {sector && <span className="text-[8.5px] font-semibold">{sector}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4 px-5 py-6">
        {CHRONOLOGICAL.map(({ id, year }) => (
          <CareerChapterCard
            key={id}
            id={`mobile-zone-${id}`}
            zone={ZONE_META[id]}
            year={year}
            lang={lang}
            expanded={expandedZone === id}
            onToggle={() => toggleZone(id)}
          />
        ))}
      </section>

      <section className="border-t border-white/5 px-5 py-7">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block h-[2px] w-5"
            style={{ background: "#5EEAD4", boxShadow: "0 0 6px #5EEAD4" }}
          />
          <span className="text-[10px] font-semibold tracking-[0.24em] text-ag-text-muted uppercase">
            {t.capabilities.eyebrow}
          </span>
        </div>
        <h2 className="font-display text-[20px] leading-tight text-ag-text">
          {t.capabilities.title}
        </h2>

        <motion.div
          className="mt-4 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
          }}
        >
          {t.skillGroups.map((group, i) => (
            <CapabilityGroupCard
              key={group.id}
              title={group.title}
              desc={group.summary}
              skills={group.skills.map((skill) => skill.name)}
              iconKey={SKILL_GROUP_ICON_KEYS[group.id]}
              index={i}
            />
          ))}
        </motion.div>

        <button
          type="button"
          onClick={() => setStackOpen(true)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ag-teal/40 px-4 py-3 text-[12px] font-semibold tracking-[0.14em] text-ag-teal uppercase"
        >
          <Sparkles size={14} />
          {lang === "es" ? "Ver stack completo" : "View full stack"}
        </button>
      </section>

      <section className="border-t border-white/5 px-5 py-10 text-center">
        <div className="mb-3 text-[9.5px] tracking-[0.24em] text-ag-gold uppercase">
          {lang === "es" ? "Cierre" : "Close"}
        </div>
        <h2 className="font-display text-[24px] leading-tight">
          {lang === "es"
            ? "Si esto resuena con lo que necesitas, hablemos."
            : "If this resonates with what you need, let's talk."}
        </h2>
        <p className="mx-auto mt-3 max-w-[34ch] text-[13.5px] leading-relaxed text-ag-text-muted">
          {lang === "es"
            ? "Sistemas que sostienen operación real, modernización honesta y criterio de ingeniería. Escríbeme y te respondo personalmente."
            : "Systems that sustain real operations, honest modernization, and engineering judgment. Reach out and I will reply personally."}
        </p>
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ag-gold px-7 py-3.5 text-[12px] font-semibold tracking-[0.18em] text-ag-panel uppercase shadow-[0_18px_50px_-20px_rgba(232,185,107,0.6)] transition hover:bg-[#f0c887]"
        >
          <Mail size={14} strokeWidth={2.6} />
          {lang === "es" ? "Escribirme" : "Reach out"}
        </button>
        <div className="mt-8 text-[10px] tracking-[0.22em] text-ag-text-muted/60 uppercase">
          © Amaury Gómez · Santo Domingo, RD
        </div>
      </section>
    </div>
  );
}

function LanguageToggle({
  lang,
  onChange,
}: {
  lang: "es" | "en";
  onChange: (l: "es" | "en") => void;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-full border border-ag-gold/25 bg-ag-bg/70 p-0.5"
    >
      {(["es", "en"] as const).map((code) => {
        const active = lang === code;
        const label = code === "es" ? "Cambiar idioma a español" : "Switch language to English";
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            aria-label={label}
            className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.22em] uppercase transition ${
              active
                ? "bg-ag-gold font-semibold text-ag-panel"
                : "text-ag-text-muted hover:text-ag-text"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
