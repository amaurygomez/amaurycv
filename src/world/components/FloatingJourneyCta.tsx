import { Code2, FileText, Layers, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/i18n/content";
import { useLanguage } from "@/hooks/useLanguage";
import { useWorld } from "@/world/state/useWorld";

const CTA_ITEMS = [
  {
    key: "contact",
    href: `mailto:${profile.email}`,
    labelEs: "Contacto",
    labelEn: "Contact",
    icon: Mail,
  },
  {
    key: "stack",
    href: "",
    labelEs: "Stack",
    labelEn: "Stack",
    icon: Layers,
  },
  {
    key: "github",
    href: profile.github,
    labelEs: "GitHub",
    labelEn: "GitHub",
    icon: Code2,
  },
  {
    key: "cv",
    href: profile.cvPath,
    labelEs: "Ver CV",
    labelEn: "View CV",
    icon: FileText,
  },
] as const;

export function FloatingJourneyCta() {
  const { journeyCompleted, setStackOpen } = useWorld();
  const { lang } = useLanguage();
  const closingLine =
    lang === "es"
      ? "Hablemos de sistemas que funcionen en operación real."
      : "Let’s build systems that work beyond the demo.";

  return (
    <AnimatePresence>
      {journeyCompleted && (
        <motion.nav
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 22 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto fixed inset-x-3 bottom-4 z-[65] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
          aria-label={lang === "es" ? "Acciones finales del recorrido" : "Journey actions"}
        >
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-ag-gold/25 bg-ag-panel/92 p-2 shadow-[0_22px_60px_-32px_rgba(232,185,107,0.55)] backdrop-blur-xl">
            <p className="px-2 pt-1 text-center font-display text-[14px] leading-snug text-ag-text">
              {closingLine}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CTA_ITEMS.map((item) => {
                const Icon = item.icon;
                const label = lang === "es" ? item.labelEs : item.labelEn;
                const baseClass =
                  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ag-text transition hover:border-ag-gold/55 hover:text-ag-gold focus-visible:outline-ag-gold";

                if (item.key === "stack") {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setStackOpen(true)}
                      aria-label={label}
                      className={baseClass}
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                    </button>
                  );
                }

                return (
                  <a
                    key={item.key}
                    href={item.key === "cv" ? `${item.href}?lang=${lang}` : item.href}
                    target={item.key === "github" ? "_blank" : undefined}
                    rel={item.key === "github" ? "noreferrer" : undefined}
                    aria-label={label}
                    className={baseClass}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
