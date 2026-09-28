import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/i18n/content";
import { useWorld } from "@/world/state/useWorld";
import { ZONE_META } from "@/world/content/zones";
import type { ZoneMeta } from "@/world/types";
import { ZoneStory } from "./career/ZoneStory";

export function ZonePanel() {
  const { activeZone, setActiveZone } = useWorld();
  const { lang } = useLanguage();
  const zone = activeZone ? ZONE_META[activeZone] : null;
  const dialogRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!zone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveZone(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zone, setActiveZone]);

  // Restore focus to whatever opened the panel so keyboard users do not land
  // on <body> after closing it.
  useEffect(() => {
    if (!zone) {
      const trigger = triggerRef.current;
      triggerRef.current = null;
      if (trigger && typeof trigger.focus === "function") {
        trigger.focus();
      }
      return;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      triggerRef.current = active;
    }
  }, [zone]);

  useEffect(() => {
    if (!zone || !dialogRef.current) return;
    const root = dialogRef.current;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((item) => !item.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [zone]);

  return (
    <AnimatePresence>
      {zone && (
        <>
          {/* Tap-to-close backdrop on small screens only; keyboard users close
              with the X button or Escape, so it stays out of the a11y tree. */}
          <motion.div
            aria-hidden="true"
            onClick={() => setActiveZone(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 cursor-default sm:hidden"
          />
          <motion.aside
            key={zone.id}
            ref={dialogRef}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            // Widths are mirrored in getPanelReservedWidth (WorldStageCanvas);
            // sm:bottom-24 keeps the dock and tour controls clear.
            className="absolute inset-x-2 top-auto bottom-2 z-40 max-h-[80vh] overflow-y-auto rounded-2xl border sm:inset-x-auto sm:top-20 sm:right-4 sm:bottom-24 sm:max-h-none sm:w-[380px] sm:rounded-2xl md:top-24 md:right-5 md:w-[400px] xl:w-[440px]"
            style={{
              borderColor: `${zone.accent}45`,
              boxShadow: `0 24px 70px -36px ${zone.accent}, 0 0 0 1px ${zone.accent}1a`,
              background:
                "linear-gradient(180deg, rgba(11,16,32,0.92) 0%, rgba(11,16,32,0.86) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            role="dialog"
            aria-modal="false"
            aria-labelledby={`zone-${zone.id}-title`}
          >
            <PanelHeader zone={zone} lang={lang} onClose={() => setActiveZone(null)} />
            <div className="space-y-5 px-4 pt-4 pb-6 md:px-5">
              <ZoneStory zone={zone} lang={lang} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelHeader({ zone, lang, onClose }: { zone: ZoneMeta; lang: Lang; onClose: () => void }) {
  const sector = lang === "es" ? zone.sectorEs : zone.sectorEn;
  return (
    <div
      className="sticky top-0 z-10 border-b px-4 pt-4 pb-3.5 backdrop-blur-md md:px-5"
      style={{
        borderColor: `${zone.accent}26`,
        background: "linear-gradient(180deg, rgba(11,16,32,0.96) 0%, rgba(11,16,32,0.88) 100%)",
        backgroundImage: `linear-gradient(180deg, ${zone.accent}14 0%, transparent 100%)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: zone.accent, boxShadow: `0 0 12px ${zone.accent}` }}
          />
          <span className="text-[9.5px] font-semibold tracking-[0.24em] text-ag-text-muted uppercase">
            {sector ?? zone.category}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-m-1.5 rounded-full p-1.5 text-ag-text-muted transition hover:bg-white/5 hover:text-ag-text"
          aria-label={lang === "es" ? "Cerrar" : "Close"}
        >
          <X size={14} />
        </button>
      </div>

      <h2
        id={`zone-${zone.id}-title`}
        className="mt-2 font-display text-[18px] leading-tight text-ag-text md:text-[20px]"
      >
        {lang === "es" ? zone.titleEs : zone.titleEn}
      </h2>
      <p className="mt-1 text-[11.5px] leading-snug font-medium" style={{ color: zone.accent }}>
        {lang === "es" ? zone.subtitleEs : zone.subtitleEn}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {[
          lang === "es" ? zone.periodEs : zone.periodEn,
          lang === "es" ? zone.scaleEs : zone.scaleEn,
        ].map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] tracking-[0.16em] text-ag-text/82 uppercase"
            style={{ borderColor: `${zone.accent}3a`, background: `${zone.accent}14` }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
