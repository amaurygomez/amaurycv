import type { ReactNode } from "react";

type VisualMetaphorPanelProps = {
  children: ReactNode;
  accent: string;
  ratio?: "wide" | "square";
};

export function VisualMetaphorPanel({
  children,
  accent,
  ratio = "wide",
}: VisualMetaphorPanelProps) {
  const aspectClass = ratio === "wide" ? "aspect-[16/9]" : "aspect-square";
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border ${aspectClass}`}
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, rgba(11,16,32,0.95) 0%, ${accent}10 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 100%, ${accent}1a 0%, transparent 65%)`,
        }}
      />
      <div className="relative h-full w-full p-4 text-ag-text">{children}</div>
    </div>
  );
}
