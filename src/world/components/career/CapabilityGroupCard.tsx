import { motion } from "motion/react";
import { IconByKey } from "./IconByKey";

type CapabilityGroupCardProps = {
  title: string;
  desc?: string;
  skills: string[];
  iconKey?: string;
  accent?: string;
  index?: number;
};

const DEFAULT_ACCENT = "#5EEAD4";

export function CapabilityGroupCard({
  title,
  desc,
  skills,
  iconKey = "layers",
  accent = DEFAULT_ACCENT,
  index = 0,
}: CapabilityGroupCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.05, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 rounded-xl border p-4"
      style={{
        borderColor: `${accent}1f`,
        background: `linear-gradient(160deg, ${accent}10 0%, rgba(11,16,32,0.6) 70%)`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}14`,
            color: accent,
            boxShadow: `0 0 18px -6px ${accent}`,
          }}
        >
          <IconByKey iconKey={iconKey} size={16} />
        </span>
        <div className="min-w-0">
          <div className="font-display text-[14px] leading-tight text-ag-text">{title}</div>
        </div>
      </div>
      {desc && <p className="text-[12px] leading-relaxed text-ag-text/72">{desc}</p>}
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
