import { motion } from "motion/react";
import type { TimelineNode } from "@/world/types";

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
          key={`${node.step ?? "node"}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-5 last:mb-0"
        >
          <span
            className="absolute top-1.5 -left-[27px] inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2"
            style={{
              borderColor: accent,
              background: "#0B1020",
              boxShadow: `0 0 12px ${accent}`,
            }}
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline gap-2">
            {node.step && (
              <span className="font-display text-[12.5px] tracking-tight" style={{ color: accent }}>
                {node.step}
              </span>
            )}
            {(node.kickerEs || node.kickerEn) && (
              <span className="text-[9.5px] tracking-[0.18em] text-ag-text-muted/80 uppercase">
                {lang === "es" ? node.kickerEs : node.kickerEn}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[13px] font-semibold text-ag-text">
            {lang === "es" ? node.titleEs : node.titleEn}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-ag-text/78">
            {lang === "es" ? node.descEs : node.descEn}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
