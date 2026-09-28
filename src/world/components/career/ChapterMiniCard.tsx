import { motion } from "motion/react";
import { IconByKey } from "./IconByKey";

type ChapterMiniCardProps = {
  iconKey: string;
  title: string;
  desc: string;
  accent: string;
  index?: number;
  compact?: boolean;
};

export function ChapterMiniCard({
  iconKey,
  title,
  desc,
  accent,
  index = 0,
  compact = false,
}: ChapterMiniCardProps) {
  const iconBoxClass = compact ? "h-7 w-7" : "h-9 w-9";
  const iconSize = compact ? 13 : 15;
  const titleClass = compact ? "text-[12.5px]" : "text-[13.5px]";
  const descClass = compact ? "text-[11px]" : "text-[12px]";
  const padding = compact ? "p-2.5" : "p-3.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.04 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex gap-2.5 rounded-lg border ${padding}`}
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, ${accent}0f 0%, rgba(11,16,32,0.55) 70%)`,
      }}
    >
      <span
        className={`inline-flex ${iconBoxClass} shrink-0 items-center justify-center rounded-md border`}
        style={{
          borderColor: `${accent}55`,
          background: `${accent}18`,
          color: accent,
          boxShadow: `0 0 14px -4px ${accent}88`,
        }}
        aria-hidden="true"
      >
        <IconByKey iconKey={iconKey} size={iconSize} />
      </span>
      <div className="min-w-0 flex-1">
        <div className={`font-display ${titleClass} leading-tight text-ag-text`}>{title}</div>
        <p className={`mt-1 ${descClass} leading-relaxed text-ag-text/76`}>{desc}</p>
      </div>
    </motion.div>
  );
}
