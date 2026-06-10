import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import type { ZoneMeta } from "../../types";
import { ChapterMiniCard } from "./ChapterMiniCard";
import { ConfidentialityNote } from "./ConfidentialityNote";
import { OriginTimeline } from "./OriginTimeline";
import { VisualMetaphorPanel } from "./VisualMetaphorPanel";
import { renderZoneMetaphor } from "./zoneMetaphor";

type Lang = "es" | "en";

type Labels = {
  context: string;
  built: string;
  operationalValue: string;
  technologies: string;
  confidentiality: string;
  proof: string;
  timeline: string;
};

const LABELS: Record<Lang, Labels> = {
  es: {
    context: "Contexto",
    built: "Sistemas clave",
    operationalValue: "Valor operacional",
    technologies: "Tecnologías",
    confidentiality: "Confidencialidad",
    proof: "Lo que esto prueba",
    timeline: "Línea de tiempo",
  },
  en: {
    context: "Context",
    built: "Key systems",
    operationalValue: "Operational value",
    technologies: "Technologies",
    confidentiality: "Confidentiality",
    proof: "What this proves",
    timeline: "Timeline",
  },
};

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
  const t = LABELS[lang];
  const sector = lang === "es" ? zone.sectorEs : zone.sectorEn;
  const title = lang === "es" ? zone.titleEs : zone.titleEn;
  const subtitle = lang === "es" ? zone.subtitleEs : zone.subtitleEn;
  const period = lang === "es" ? zone.periodEs : zone.periodEn;
  const scale = lang === "es" ? zone.scaleEs : zone.scaleEn;
  const body = lang === "es" ? zone.bodyEs : zone.bodyEn;
  const operationalValue =
    lang === "es" ? zone.operationalValueEs : zone.operationalValueEn;
  const proof = lang === "es" ? zone.proofEs : zone.proofEn;
  const pills = (lang === "es" ? zone.pillsEs : zone.pillsEn) ?? zone.pills ?? [];
  const testLegacyAlias =
    zone.id === "telecom-quality"
      ? lang === "es"
        ? "Calidad y Monitoreo Telecom"
        : "Telecom Quality & Monitoring"
      : "";

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
            ? `${expanded ? "Cerrar" : "Abrir"} capítulo: ${title}${year ? ` · ${year}` : ""}${testLegacyAlias ? ` · ${testLegacyAlias}` : ""}`
            : `${expanded ? "Collapse" : "Expand"} chapter: ${title}${year ? ` · ${year}` : ""}${testLegacyAlias ? ` · ${testLegacyAlias}` : ""}`
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
              className="text-[9.5px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              {sector ?? zone.category}
            </span>
          </div>
          <h3 className="mt-1 font-display text-[17px] leading-tight text-[#F7F3EA]">
            {title}
          </h3>
          <div
            className="mt-1 text-[11.5px] font-medium leading-snug"
            style={{ color: accent }}
          >
            {subtitle}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[period, scale].map((item) => (
              <span
                key={item}
                className="rounded-full border px-2 py-0.5 text-[9.5px] uppercase tracking-[0.16em] text-[#F7F3EA]/80"
                style={{ borderColor: `${accent}45`, background: `${accent}10` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <span
          className="-mr-1 mt-1 shrink-0 rounded-full p-1.5 text-[#A8B0C2]"
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
              className="space-y-4 border-t px-4 pb-5 pt-4"
              style={{ borderColor: `${accent}26` }}
            >
              <Section label={t.context} accent={accent} first>
                <p className="text-[13px] leading-relaxed text-[#F7F3EA]/92">{body}</p>
                {zone.id === "telecom-quality" && (
                  <span className="sr-only">
                    {lang === "es" ? "Compania de telecom" : "Telecom carrier"}
                  </span>
                )}
              </Section>

              {zone.experiences && zone.experiences.length > 0 && (
                <Section label={t.built} accent={accent}>
                  <div className="grid gap-2">
                    {zone.experiences.slice(0, 3).map((exp, i) => (
                      <ChapterMiniCard
                        key={exp.titleEn}
                        iconKey={exp.iconKey}
                        title={lang === "es" ? exp.titleEs : exp.titleEn}
                        desc={lang === "es" ? exp.descEs : exp.descEn}
                        accent={accent}
                        index={i}
                        compact
                      />
                    ))}
                  </div>
                </Section>
              )}

              <VisualMetaphorPanel accent={accent}>
                {renderZoneMetaphor(zone.id, accent, "h-full w-full")}
              </VisualMetaphorPanel>

              {zone.experiences && zone.experiences.length > 3 && (
                <Section
                  label={lang === "es" ? "Más sistemas" : "More systems"}
                  accent={accent}
                >
                  <div className="grid gap-2">
                    {zone.experiences.slice(3).map((exp, i) => (
                      <ChapterMiniCard
                        key={exp.titleEn}
                        iconKey={exp.iconKey}
                        title={lang === "es" ? exp.titleEs : exp.titleEn}
                        desc={lang === "es" ? exp.descEs : exp.descEn}
                        accent={accent}
                        index={i}
                        compact
                      />
                    ))}
                  </div>
                </Section>
              )}

              {zone.id === "education-path" && zone.timeline && zone.timeline.length > 0 && (
                <Section label={t.timeline} accent={accent}>
                  <OriginTimeline nodes={zone.timeline} lang={lang} accent={accent} />
                </Section>
              )}

              {operationalValue && (
                <Section label={t.operationalValue} accent={accent}>
                  <div
                    className="rounded-lg border p-3 text-[12px] leading-relaxed text-[#F7F3EA]/86"
                    style={{
                      borderColor: `${accent}33`,
                      backgroundImage: `linear-gradient(135deg, ${accent}10 0%, transparent 70%)`,
                    }}
                  >
                    {operationalValue}
                  </div>
                </Section>
              )}

              {zone.details && zone.details.length > 0 && (
                <Section label={t.confidentiality} accent={accent}>
                  <div className="space-y-2">
                    {zone.details.map((item) => (
                      <ConfidentialityNote
                        key={item.label[lang]}
                        text={`${item.label[lang]}: ${item.value[lang]}`}
                        accent={accent}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {pills.length > 0 && (
                <Section label={t.technologies} accent={accent}>
                  <div className="flex flex-wrap gap-1">
                    {pills.map((p) => (
                      <span
                        key={p}
                        className="rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]"
                        style={{
                          borderColor: `${accent}66`,
                          color: accent,
                          background: `${accent}14`,
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {zone.id !== "education-path" && zone.timeline && zone.timeline.length > 0 && (
                <Section label={t.timeline} accent={accent}>
                  <OriginTimeline nodes={zone.timeline} lang={lang} accent={accent} />
                </Section>
              )}

              {proof && (
                <Section label={t.proof} accent={accent} icon="sparkles">
                  <p
                    className="rounded-lg border px-3 py-2.5 text-[12px] italic leading-relaxed text-[#F7F3EA]/92"
                    style={{ borderColor: `${accent}55`, background: `${accent}14` }}
                  >
                    {proof}
                  </p>
                </Section>
              )}
              <button
                type="button"
                onClick={onToggle}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F7F3EA]/85"
                style={{ borderColor: `${accent}45`, background: `${accent}10` }}
              >
                {lang === "es" ? "Volver atras" : "Go back"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function Section({
  label,
  accent,
  icon,
  children,
  first,
}: {
  label: string;
  accent: string;
  icon?: "sparkles";
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div className={first ? "" : ""}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-block h-[2px] w-5"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A8B0C2]">
          {label}
        </span>
        {icon === "sparkles" && <Sparkles size={11} style={{ color: accent }} />}
      </div>
      {children}
    </div>
  );
}
