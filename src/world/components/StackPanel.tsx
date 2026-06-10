import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  Brain,
  Cloud,
  Database,
  FileBarChart,
  Layers,
  Map as MapIcon,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { ComponentType } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { content } from "../../i18n/content";
import { useWorld } from "../state/useWorld";

type Lang = "es" | "en";

const ACCENT = "#5EEAD4";

const GROUP_META: Record<
  string,
  { iconKey: string; descEs: string; descEn: string }
> = {
  // EN keys
  "Backend & Enterprise Systems": {
    iconKey: "layers",
    descEs: "El núcleo: APIs, identidad, auditoría y servicios de fondo en producción.",
    descEn: "The core: APIs, identity, audit, and background services in production.",
  },
  "Frontend & UI": {
    iconKey: "brain",
    descEs: "Dashboards empresariales y UIs internas pensadas para uso diario, no para vitrina.",
    descEn: "Enterprise dashboards and internal UIs built for daily use, not for showcase.",
  },
  "Databases & Data": {
    iconKey: "database",
    descEs: "Modelos empresariales, optimización de consultas, integridad transaccional.",
    descEn: "Enterprise models, query optimization, transactional integrity.",
  },
  "Maps, Real-Time & Operations": {
    iconKey: "map",
    descEs: "Cobertura, estadística geográfica y monitoreo en vivo sobre operación real.",
    descEn: "Coverage, geographic statistics, and live monitoring over real operations.",
  },
  "DevOps & Delivery": {
    iconKey: "cloud",
    descEs: "Pipelines, despliegues y resolución de incidencias en producción.",
    descEn: "Pipelines, deployments, and production troubleshooting.",
  },
  "Reporting & Legacy Systems": {
    iconKey: "report",
    descEs: "Lo legado no se ignora: se mantiene, se moderniza y se respeta.",
    descEn: "Legacy is not ignored — it is maintained, modernized, and respected.",
  },
  "AI Operations Lab": {
    iconKey: "sparkles",
    descEs: "Infra personal de IA: modelos locales, automatización, memoria vectorial, observabilidad y agentes con aprobación humana.",
    descEn: "Personal AI infrastructure: local models, automation, vector memory, observability, and agents with human approval.",
  },
  // ES keys
  "Backend y Sistemas Empresariales": {
    iconKey: "layers",
    descEs: "El núcleo: APIs, identidad, auditoría y servicios de fondo en producción.",
    descEn: "The core: APIs, identity, audit, and background services in production.",
  },
  "Frontend y UI": {
    iconKey: "brain",
    descEs: "Dashboards empresariales y UIs internas pensadas para uso diario, no para vitrina.",
    descEn: "Enterprise dashboards and internal UIs built for daily use, not for showcase.",
  },
  "Bases de Datos y Datos": {
    iconKey: "database",
    descEs: "Modelos empresariales, optimización de consultas, integridad transaccional.",
    descEn: "Enterprise models, query optimization, transactional integrity.",
  },
  "Mapas, Tiempo Real y Operaciones": {
    iconKey: "map",
    descEs: "Cobertura, estadística geográfica y monitoreo en vivo sobre operación real.",
    descEn: "Coverage, geographic statistics, and live monitoring over real operations.",
  },
  "DevOps y Entrega": {
    iconKey: "cloud",
    descEs: "Pipelines, despliegues y resolución de incidencias en producción.",
    descEn: "Pipelines, deployments, and production troubleshooting.",
  },
  "Reportería y Sistemas Legados": {
    iconKey: "report",
    descEs: "Lo legado no se ignora: se mantiene, se moderniza y se respeta.",
    descEn: "Legacy is not ignored — it is maintained, modernized, and respected.",
  },
  "Laboratorio de Operaciones con IA": {
    iconKey: "sparkles",
    descEs: "Infra personal de IA: modelos locales, automatización, memoria vectorial, observabilidad y agentes con aprobación humana.",
    descEn: "Personal AI infrastructure: local models, automation, vector memory, observability, and agents with human approval.",
  },
};

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  layers: Layers,
  brain: Brain,
  database: Database,
  map: MapIcon,
  cloud: Cloud,
  report: FileBarChart,
  sparkles: Sparkles,
};

const COPY = {
  es: {
    eyebrow: "Stack técnico",
    title: "7 capacidades reales, no una lista de badges.",
    subtitle:
      "El stack agrupado por lo que sé hacer con él, no por moda. Cada capa viene de proyectos en producción.",
    close: "Cerrar",
    footer: "Más contexto en cada zona del mundo: telecom, sector público, banca, POS y laboratorio.",
  },
  en: {
    eyebrow: "Technical stack",
    title: "7 real capabilities, not a list of badges.",
    subtitle:
      "Stack grouped by what I can do with it, not by trend. Each layer comes from production work.",
    close: "Close",
    footer: "More context inside each zone of the world: telecom, public sector, banking, POS, and lab.",
  },
} as const;

export function StackPanel() {
  const { stackOpen, setStackOpen } = useWorld();
  const { lang } = useLanguage();
  const dialogRef = useRef<HTMLElement | null>(null);
  const t = COPY[lang];
  const groups = content[lang].skillGroups;

  const close = useCallback(() => setStackOpen(false), [setStackOpen]);

  useEffect(() => {
    if (!stackOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stackOpen, close]);

  return (
    <AnimatePresence>
      {stackOpen && (
        <>
          <motion.button
            type="button"
            aria-label={t.close}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] cursor-default bg-[#070B14]/65 backdrop-blur-sm"
          />
          <motion.aside
            ref={dialogRef}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stack-title"
            className="
              fixed inset-x-2 bottom-2 z-[81] max-h-[92vh] overflow-y-auto rounded-2xl
              border bg-[#0B1020]/97 backdrop-blur-xl
              sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[88vh]
              sm:w-[640px] sm:-translate-x-1/2 sm:-translate-y-1/2
              md:w-[760px]
            "
            style={{
              borderColor: `${ACCENT}38`,
              boxShadow: `0 28px 90px -42px ${ACCENT}`,
            }}
          >
            <header
              className="sticky top-0 z-10 border-b bg-[#0B1020]/96 px-6 pt-6 pb-5 backdrop-blur-xl md:px-7"
              style={{
                borderColor: `${ACCENT}26`,
                backgroundImage: `linear-gradient(180deg, ${ACCENT}14 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: ACCENT, boxShadow: `0 0 14px ${ACCENT}` }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.28em] text-[#A8B0C2]">
                      {t.eyebrow}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="-m-2 rounded-full p-2 text-[#A8B0C2] transition hover:bg-white/5 hover:text-[#F7F3EA]"
                  aria-label={t.close}
                >
                  <X size={16} />
                </button>
              </div>
              <h2
                id="stack-title"
                className="mt-3 font-display text-[22px] leading-tight text-[#F7F3EA] md:text-[26px]"
              >
                {t.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#F7F3EA]/75">
                {t.subtitle}
              </p>
            </header>

            <div className="px-6 pb-7 pt-5 md:px-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {groups.map((g, i) => (
                  <StackCard key={g.title} title={g.title} skills={g.skills} index={i} lang={lang} />
                ))}
              </div>

              <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] leading-relaxed text-[#A8B0C2]">
                {t.footer}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function StackCard({
  title,
  skills,
  index,
  lang,
}: {
  title: string;
  skills: { name: string; level: number }[];
  index: number;
  lang: Lang;
}) {
  const meta = GROUP_META[title];
  const Icon = ICONS[meta?.iconKey ?? "layers"] ?? BarChart3;
  const desc = lang === "es" ? meta?.descEs : meta?.descEn;
  const isAiOps = title === "AI Operations Lab" || title === "Laboratorio de Operaciones con IA";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.05, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4"
      style={{
        borderColor: `${ACCENT}1f`,
        backgroundImage: `linear-gradient(160deg, ${ACCENT}08 0%, transparent 70%)`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border"
          style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}12`, color: ACCENT }}
        >
          <Icon size={15} />
        </span>
        <div className="font-display text-[14.5px] leading-tight text-[#F7F3EA]">
          {title}
        </div>
      </div>
      {desc && (
        <p className="text-[12px] leading-relaxed text-[#F7F3EA]/72">{desc}</p>
      )}
      {isAiOps && (
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5EEAD4]">
          {["n8n", "LiteLLM/Ollama", "Qdrant", "Langfuse/Evals"].map((item, itemIndex) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <span className="rounded-md border border-[#5EEAD4]/25 bg-[#5EEAD4]/8 px-1.5 py-0.5">
                {item}
              </span>
              {itemIndex < 3 && <span className="text-[#A8B0C2]/45">→</span>}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span
            key={s.name}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10.5px] font-medium text-[#F7F3EA]/85"
          >
            {s.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
