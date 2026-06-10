import { motion } from "motion/react";
import type { TimelineNode } from "../../types";

type OriginTimelineProps = {
  nodes: readonly TimelineNode[];
  lang: "es" | "en";
  accent: string;
};

export function OriginTimeline({ nodes, lang, accent }: OriginTimelineProps) {
  return (
    <ol className="relative ml-3 border-l-2 pl-5" style={{ borderColor: `${accent}40` }}>
      {nodes.map((node, i) => (
        <motion.li
          key={`${node.yearLabel ?? "node"}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-5 last:mb-0"
        >
          <span
            className="absolute -left-[27px] top-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2"
            style={{
              borderColor: accent,
              background: "#0B1020",
              boxShadow: `0 0 12px ${accent}`,
            }}
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline gap-2">
            {node.yearLabel && (
              <span
                className="font-display text-[12.5px] tracking-tight"
                style={{ color: accent }}
              >
                {node.yearLabel}
              </span>
            )}
            {(node.ageLabelEs || node.ageLabelEn) && (
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#A8B0C2]/80">
                {lang === "es" ? node.ageLabelEs : node.ageLabelEn}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[13px] font-semibold text-[#F7F3EA]">
            {lang === "es" ? node.titleEs : node.titleEn}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-[#F7F3EA]/78">
            {lang === "es" ? node.descEs : node.descEn}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
