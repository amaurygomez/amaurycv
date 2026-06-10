import { motion } from "motion/react";

type MetricCardProps = {
  value: string;
  label: string;
  sub?: string;
  accent?: string;
  index?: number;
};

const DEFAULT_ACCENT = "#E8B96B";

export function MetricCard({
  value,
  label,
  sub,
  accent = DEFAULT_ACCENT,
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border px-2.5 py-3 text-center"
      style={{
        borderColor: `${accent}30`,
        background: `linear-gradient(180deg, ${accent}10 0%, rgba(255,255,255,0.02) 70%)`,
      }}
    >
      <div className="font-display text-[22px] leading-none" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#F7F3EA]/88">
        {label}
      </div>
      {sub && (
        <div className="mt-0.5 text-[8.5px] uppercase tracking-[0.14em] text-[#A8B0C2]/65">
          {sub}
        </div>
      )}
    </motion.div>
  );
}
