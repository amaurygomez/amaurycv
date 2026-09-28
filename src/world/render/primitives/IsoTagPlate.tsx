import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso } from "@/world/lib/iso";
import { hex } from "@/world/render/utils";

// Text is rasterized at 3x and scaled back down so labels stay sharp at the
// camera's max zoom, without switching to BitmapText.
const TEXT_OVERSAMPLE = 3;

export function IsoTagPlate({
  x,
  y,
  z = 1.1,
  label,
  accent,
}: {
  x: number;
  y: number;
  z?: number;
  label: string;
  accent: string;
}) {
  const halfWidth = Math.max(label.length * 3.2, 18);
  const drawPlate = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x, y, z);
      const color = hex(accent);
      g.roundRect(p.x - halfWidth, p.y - 8, halfWidth * 2, 11, 3);
      g.fill({ color: 0x070b14, alpha: 0.85 });
      g.stroke({ color, alpha: 0.7, width: 0.8 });
      g.moveTo(p.x, p.y + 3);
      g.lineTo(p.x, p.y + 7);
      g.stroke({ color, alpha: 0.45, width: 0.6 });
    },
    [x, y, z, halfWidth, accent],
  );

  const p = iso(x, y, z);
  return (
    <pixiContainer>
      <pixiGraphics draw={drawPlate} />
      <pixiText
        text={label}
        x={p.x}
        y={p.y - 3}
        anchor={0.5}
        scale={1 / TEXT_OVERSAMPLE}
        resolution={TEXT_OVERSAMPLE}
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 8 * TEXT_OVERSAMPLE,
          fontWeight: "600",
          fill: accent,
          letterSpacing: 0.4 * TEXT_OVERSAMPLE,
        }}
      />
    </pixiContainer>
  );
}
