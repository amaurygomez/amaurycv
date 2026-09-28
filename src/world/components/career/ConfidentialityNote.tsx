import { ShieldCheck } from "lucide-react";

type ConfidentialityNoteProps = {
  text: string;
  accent?: string;
};

const DEFAULT_ACCENT = "#34D399";

export function ConfidentialityNote({ text, accent = DEFAULT_ACCENT }: ConfidentialityNoteProps) {
  return (
    <div
      className="flex gap-2.5 rounded-lg border p-3 text-[11.5px] leading-relaxed text-ag-text/82"
      style={{
        borderColor: `${accent}45`,
        background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 70%)`,
      }}
      role="note"
    >
      <ShieldCheck size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />
      <span>{text}</span>
    </div>
  );
}
