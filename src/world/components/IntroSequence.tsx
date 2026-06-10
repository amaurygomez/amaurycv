import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

const ZONE_CHIPS = {
  es: ["Telecom", "Seguridad", "Banca", "Factory", "Lab", "Vida", "Educacion"],
  en: ["Telecom", "Security", "Banking", "Factory", "Lab", "Life", "Education"],
} as const;

export function IntroSequence({
  onComplete,
  mobile = false,
}: {
  onComplete: () => void;
  mobile?: boolean;
}) {
  const { lang } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [typedChars, setTypedChars] = useState(0);
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [ready, setReady] = useState(false);

  const finish = useCallback(() => onComplete(), [onComplete]);

  useEffect(() => {
    if (mobile || reducedMotion) {
      const timer = window.setTimeout(() => setReady(true), 220);
      return () => window.clearTimeout(timer);
    }

    const text = lang === "es" ? "Inicializando AG World..." : "Initializing AG World...";
    const typeTimer = window.setInterval(() => {
      setTypedChars((current) => Math.min(current + 1, text.length));
    }, 42);
    const landmarksTimer = window.setTimeout(() => setShowLandmarks(true), 800);
    const avatarTimer = window.setTimeout(() => setShowAvatar(true), 1700);
    const readyTimer = window.setTimeout(() => setReady(true), 2000);

    return () => {
      window.clearInterval(typeTimer);
      window.clearTimeout(landmarksTimer);
      window.clearTimeout(avatarTimer);
      window.clearTimeout(readyTimer);
    };
  }, [lang, mobile, reducedMotion]);

  const title = lang === "es" ? "Inicializando AG World..." : "Initializing AG World...";
  const chips = ZONE_CHIPS[lang];

  if (mobile || reducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-[80] flex items-center justify-center bg-[#070B14]"
      >
        <div className="w-[min(88vw,360px)] rounded-3xl border border-[#E8B96B]/20 bg-[#0B1020]/94 p-6 text-center shadow-[0_28px_80px_-38px_rgba(232,185,107,0.45)]">
          <div className="text-[10px] uppercase tracking-[0.34em] text-[#E8B96B]">AG World</div>
          <div className="mt-3 text-sm text-[#F7F3EA]">{title}</div>
          <button
            type="button"
            onClick={finish}
            aria-label="Start Journey"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#E8B96B] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0B1020]"
          >
            {lang === "es" ? "Entrar a AG World" : "Enter AG World"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="ag-world-intro"
      className="absolute inset-0 z-[80] overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.05, 0.12, 0.05], backgroundPositionY: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(94,234,212,0.18), transparent 35%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 18px, 18px 100%",
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0.6, opacity: 0.25 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,185,107,0.24),transparent_58%)] blur-3xl" />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-[min(92vw,620px)] rounded-[28px] border border-[#E8B96B]/18 bg-[#0B1020]/86 p-6 shadow-[0_40px_120px_-54px_rgba(232,185,107,0.52)] backdrop-blur-2xl sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] uppercase tracking-[0.34em] text-[#E8B96B]">AG World</div>
            <button
              type="button"
              onClick={finish}
              className="rounded-full border border-[#E8B96B]/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F7F3EA]"
            >
              {lang === "es" ? "Saltar" : "Skip"}
            </button>
          </div>

          <div className="mt-6 font-mono text-[15px] text-[#F7F3EA]">
            {title.slice(0, Math.max(typedChars, 1))}
            {typedChars < title.length ? "_" : ""}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {chips.map((chip, index) => (
              <motion.div
                key={chip}
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={
                  showLandmarks
                    ? { opacity: 1, scale: 1, y: 0, boxShadow: "0 0 26px rgba(232,185,107,0.14)" }
                    : { opacity: 0, scale: 0.92, y: 12 }
                }
                transition={{ delay: showLandmarks ? index * 0.13 : 0, duration: 0.24 }}
                className="rounded-2xl border border-[#E8B96B]/16 bg-white/[0.03] px-3 py-3 text-[11px] uppercase tracking-[0.16em] text-[#A8B0C2]"
              >
                {chip}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={showAvatar ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-[#E8B96B]/14 bg-[#070B14]/60 px-4 py-3"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="h-9 w-9 rounded-xl bg-[linear-gradient(180deg,#E8B96B_0%,#C8923D_100%)]"
            />
            <div className="text-[12px] text-[#F7F3EA]/84">
              {lang === "es"
                ? "Landmarks listos. Avatar sincronizado."
                : "Landmarks online. Avatar synced."}
            </div>
          </motion.div>

          <motion.button
            type="button"
            onClick={finish}
            aria-label="Start Journey"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.24 }}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#E8B96B] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0B1020]"
          >
            {lang === "es" ? "Entrar a AG World" : "Enter AG World"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
