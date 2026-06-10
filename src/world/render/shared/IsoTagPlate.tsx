/**
 * IsoTagPlate — small floating label plate above an iso object.
 * Lets a visitor read "OLLAMA", "JASPER", "POS", "BBQ" etc. in the iso world
 * without polluting the right-side panel. Used sparingly: only when the
 * object alone is not visually self-evident.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso } from "../../lib/iso";

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

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
  const padding = Math.max(label.length * 3.2, 18);
  const drawPlate = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x, y, z);
      const color = hex(accent);
      const halfW = padding;
      g.roundRect(p.x - halfW, p.y - 8, halfW * 2, 11, 3);
      g.fill({ color: 0x070b14, alpha: 0.85 });
      g.stroke({ color, alpha: 0.7, width: 0.8 });
      g.moveTo(p.x, p.y + 3);
      g.lineTo(p.x, p.y + 7);
      g.stroke({ color, alpha: 0.45, width: 0.6 });
    },
    [x, y, z, padding, accent]
  );

  const p = iso(x, y, z);
  // Render text at 3x font size and counter-scale to 1/3 so the rasterized
  // texture has 3x the pixel density of the on-screen glyph. This keeps the
  // label crisp when the camera zooms in (effective scale up to ~4x).
  // Cheaper than swapping to BitmapText and works with the current font.
  const TEXT_OVERSAMPLE = 3;
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
