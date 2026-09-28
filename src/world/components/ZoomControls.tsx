import { Minus, Plus, RotateCcw } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { ZOOM_MAX, ZOOM_MIN } from "@/world/state/context";
import { useWorld } from "@/world/state/useWorld";

export function ZoomControls() {
  const { userZoom, zoomIn, zoomOut, resetZoom } = useWorld();
  const { lang } = useLanguage();
  const pct = Math.round(userZoom * 100);
  const labelIn = lang === "es" ? "Acercar" : "Zoom in";
  const labelOut = lang === "es" ? "Alejar" : "Zoom out";
  const labelReset = lang === "es" ? "Restablecer zoom" : "Reset zoom";

  return (
    <div
      className="pointer-events-auto absolute right-4 bottom-4 z-30 flex flex-col items-stretch gap-1 rounded-2xl border border-ag-gold/22 bg-ag-panel/82 p-1.5 shadow-[0_20px_60px_-28px_rgba(232,185,107,0.5)] backdrop-blur-md md:right-6 md:bottom-6"
      role="group"
      aria-label={lang === "es" ? "Controles de zoom" : "Zoom controls"}
    >
      <ZoomBtn
        onClick={zoomIn}
        disabled={userZoom >= ZOOM_MAX - 0.01}
        ariaLabel={labelIn}
        icon={<Plus size={14} strokeWidth={2.4} />}
      />
      <button
        type="button"
        onClick={resetZoom}
        aria-label={labelReset}
        title={labelReset}
        className="inline-flex h-7 items-center justify-center rounded-md px-2 text-[9px] font-semibold tracking-[0.16em] text-ag-text-muted uppercase tabular-nums transition hover:text-ag-gold"
      >
        {pct}%
      </button>
      <ZoomBtn
        onClick={zoomOut}
        disabled={userZoom <= ZOOM_MIN + 0.01}
        ariaLabel={labelOut}
        icon={<Minus size={14} strokeWidth={2.4} />}
      />
      {userZoom !== 1 && (
        <button
          type="button"
          onClick={resetZoom}
          aria-label={labelReset}
          title={labelReset}
          className="mt-0.5 inline-flex h-7 w-9 items-center justify-center rounded-md border border-white/8 text-ag-text-muted transition hover:border-ag-gold/55 hover:text-ag-gold"
        >
          <RotateCcw size={12} strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}

function ZoomBtn({
  onClick,
  disabled,
  ariaLabel,
  icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/8 text-ag-text transition hover:border-ag-gold/55 hover:text-ag-gold disabled:cursor-not-allowed disabled:opacity-30"
    >
      {icon}
    </button>
  );
}
