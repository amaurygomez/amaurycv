type SectorChipProps = {
  label: string;
  accent?: string;
  size?: "sm" | "md";
  active?: boolean;
};

const DEFAULT_ACCENT = "#5EEAD4";

export function SectorChip({
  label,
  accent = DEFAULT_ACCENT,
  size = "md",
  active = false,
}: SectorChipProps) {
  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5 text-[9.5px] tracking-[0.16em]"
      : "px-2.5 py-1 text-[10.5px] tracking-[0.12em]";

  if (active) {
    return (
      <span
        className={`inline-flex items-center rounded-md font-semibold uppercase ${sizeClass}`}
        style={{
          background: accent,
          color: "#0B1020",
          boxShadow: `0 0 14px -3px ${accent}`,
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium uppercase ${sizeClass}`}
      style={{
        borderColor: `${accent}55`,
        color: accent,
        background: `${accent}10`,
      }}
    >
      {label}
    </span>
  );
}
