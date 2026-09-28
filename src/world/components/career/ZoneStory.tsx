import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { Lang } from "@/i18n/content";
import type { ZoneExperience, ZoneMeta } from "@/world/types";
import { ChapterMiniCard } from "./ChapterMiniCard";
import { ConfidentialityNote } from "./ConfidentialityNote";
import { OriginTimeline } from "./OriginTimeline";
import { VisualMetaphorPanel } from "./VisualMetaphorPanel";
import { renderZoneMetaphor } from "./zoneMetaphor";

const LABELS = {
  es: {
    context: "Contexto",
    keySystems: "Sistemas clave",
    moreSystems: "Más sistemas",
    timeline: "Línea de tiempo",
    operationalValue: "Valor operacional",
    confidentiality: "Confidencialidad",
    technologies: "Tecnologías",
    proof: "Lo que esto prueba",
  },
  en: {
    context: "Context",
    keySystems: "Key systems",
    moreSystems: "More systems",
    timeline: "Timeline",
    operationalValue: "Operational value",
    confidentiality: "Confidentiality",
    technologies: "Technologies",
    proof: "What this proves",
  },
} as const;

const TOP_EXPERIENCES = 3;

/** Body shared by the desktop zone panel and the mobile chapter cards. */
export function ZoneStory({ zone, lang }: { zone: ZoneMeta; lang: Lang }) {
  const t = LABELS[lang];
  const accent = zone.accent;
  const body = lang === "es" ? zone.bodyEs : zone.bodyEn;
  const operationalValue = lang === "es" ? zone.operationalValueEs : zone.operationalValueEn;
  const proof = lang === "es" ? zone.proofEs : zone.proofEn;
  const pills = (lang === "es" ? zone.pillsEs : zone.pillsEn) ?? zone.pills ?? [];
  const experiences = zone.experiences ?? [];
  const timeline = zone.timeline ?? [];
  const details = zone.details ?? [];

  return (
    <>
      <Section label={t.context} accent={accent}>
        <p className="text-[13px] leading-relaxed text-ag-text/92">{body}</p>
      </Section>

      {experiences.length > 0 && (
        <Section label={t.keySystems} accent={accent}>
          <ExperienceList
            items={experiences.slice(0, TOP_EXPERIENCES)}
            lang={lang}
            accent={accent}
          />
        </Section>
      )}

      <VisualMetaphorPanel accent={accent}>
        {renderZoneMetaphor(zone.id, accent, "h-full w-full")}
      </VisualMetaphorPanel>

      {experiences.length > TOP_EXPERIENCES && (
        <Section label={t.moreSystems} accent={accent}>
          <ExperienceList items={experiences.slice(TOP_EXPERIENCES)} lang={lang} accent={accent} />
        </Section>
      )}

      {timeline.length > 0 && (
        <Section label={t.timeline} accent={accent}>
          <OriginTimeline nodes={timeline} lang={lang} accent={accent} />
        </Section>
      )}

      {operationalValue && (
        <Section label={t.operationalValue} accent={accent}>
          <div
            className="rounded-lg border p-3 text-[12px] leading-relaxed text-ag-text/86"
            style={{
              borderColor: `${accent}33`,
              backgroundImage: `linear-gradient(135deg, ${accent}10 0%, transparent 70%)`,
            }}
          >
            {operationalValue}
          </div>
        </Section>
      )}

      {details.length > 0 && (
        <Section label={t.confidentiality} accent={accent}>
          <div className="space-y-2">
            {details.map((item) => (
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
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.06em] uppercase"
                style={{ borderColor: `${accent}66`, color: accent, background: `${accent}14` }}
              >
                {pill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {proof && (
        <Section label={t.proof} accent={accent} withIcon>
          <p
            className="rounded-lg border px-3 py-2.5 text-[12px] leading-relaxed text-ag-text/92 italic"
            style={{ borderColor: `${accent}55`, background: `${accent}14` }}
          >
            {proof}
          </p>
        </Section>
      )}
    </>
  );
}

function ExperienceList({
  items,
  lang,
  accent,
}: {
  items: readonly ZoneExperience[];
  lang: Lang;
  accent: string;
}) {
  return (
    <div className="grid gap-2">
      {items.map((exp, i) => (
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
  );
}

function Section({
  label,
  accent,
  withIcon = false,
  children,
}: {
  label: string;
  accent: string;
  withIcon?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-block h-[2px] w-5"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
          aria-hidden="true"
        />
        <span className="text-[10px] font-semibold tracking-[0.24em] text-ag-text-muted uppercase">
          {label}
        </span>
        {withIcon && <Sparkles size={12} style={{ color: accent }} aria-hidden="true" />}
      </div>
      {children}
    </div>
  );
}
