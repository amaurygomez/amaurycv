import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { content, type SkillGroupId } from "@/i18n/content";
import { useWorld } from "@/world/state/useWorld";
import { IconByKey } from "./career/IconByKey";
import { SKILL_GROUP_ICON_KEYS } from "./career/iconMap";

const ACCENT = "#5EEAD4";
const AI_PIPELINE = ["n8n", "LiteLLM/Ollama", "Qdrant", "Langfuse/Evals"];

const COPY = {
  es: {
    close: "Cerrar",
    footer:
      "Más contexto en cada zona del mundo: telecom, sector público, banca, POS y laboratorio.",
  },
  en: {
    close: "Close",
    footer:
      "More context inside each zone of the world: telecom, public sector, banking, POS, and lab.",
  },
} as const;

export function StackPanel() {
  const { stackOpen, setStackOpen } = useWorld();
  const { lang } = useLanguage();
  const dialogRef = useRef<HTMLElement | null>(null);
  const t = COPY[lang];
  const { capabilities, skillGroups } = content[lang];

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
            className="fixed inset-0 z-[80] cursor-default bg-ag-bg/65 backdrop-blur-sm"
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
            className="fixed inset-x-2 bottom-2 z-[81] max-h-[92vh] overflow-y-auto rounded-2xl border bg-ag-panel/97 backdrop-blur-xl sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[88vh] sm:w-[640px] sm:-translate-x-1/2 sm:-translate-y-1/2 md:w-[760px]"
            style={{
              borderColor: `${ACCENT}38`,
              boxShadow: `0 28px 90px -42px ${ACCENT}`,
            }}
          >
            <header
              className="sticky top-0 z-10 border-b bg-ag-panel/96 px-6 pt-6 pb-5 backdrop-blur-xl md:px-7"
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
                    <span className="text-[10px] tracking-[0.28em] text-ag-text-muted uppercase">
                      {capabilities.eyebrow}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="-m-2 rounded-full p-2 text-ag-text-muted transition hover:bg-white/5 hover:text-ag-text"
                  aria-label={t.close}
                >
                  <X size={16} />
                </button>
              </div>
              <h2
                id="stack-title"
                className="mt-3 font-display text-[22px] leading-tight text-ag-text md:text-[26px]"
              >
                {capabilities.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-ag-text/75">
                {capabilities.subtitle}
              </p>
            </header>

            <div className="px-6 pt-5 pb-7 md:px-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {skillGroups.map((group, i) => (
                  <StackCard
                    key={group.id}
                    id={group.id}
                    title={group.title}
                    summary={group.summary}
                    skills={group.skills.map((skill) => skill.name)}
                    index={i}
                  />
                ))}
              </div>

              <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] leading-relaxed text-ag-text-muted">
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
  id,
  title,
  summary,
  skills,
  index,
}: {
  id: SkillGroupId;
  title: string;
  summary: string;
  skills: string[];
  index: number;
}) {
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
          <IconByKey iconKey={SKILL_GROUP_ICON_KEYS[id]} size={15} />
        </span>
        <div className="font-display text-[14.5px] leading-tight text-ag-text">{title}</div>
      </div>
      <p className="text-[12px] leading-relaxed text-ag-text/72">{summary}</p>
      {id === "ai" && (
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-ag-teal uppercase">
          {AI_PIPELINE.map((item, itemIndex) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <span className="rounded-md border border-ag-teal/25 bg-ag-teal/8 px-1.5 py-0.5">
                {item}
              </span>
              {itemIndex < AI_PIPELINE.length - 1 && (
                <span className="text-ag-text-muted/45">→</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10.5px] font-medium text-ag-text/85"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
