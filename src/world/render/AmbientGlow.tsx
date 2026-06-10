import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H, TILE_W } from "../lib/iso";
import type { ZoneBounds } from "../types";

interface AmbientGlowProps {
  bounds: ZoneBounds;
  color: string;
  /** Higher intensity when a zone is hovered/active. 0..1 */
  intensity?: number;
}

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

/**
 * Soft radial glow centered on a zone. Drawn as a stack of concentric
 * circles with falling alpha so it reads as a light spill on the floor
 * without needing a real shader or texture.
 */
export function AmbientGlow({ bounds, color, intensity = 0.5 }: AmbientGlowProps) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      const center = iso(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
      const cy = center.y + TILE_H / 2;
      // Radius scales with zone diagonal so big rooms get a bigger spill.
      const radius =
        Math.max(bounds.w, bounds.h) * TILE_W * 0.55 + TILE_W * 0.5;

      // Softer light spill — fewer rings, lower alpha. The room should
      // feel lit, not surrounded by a UI halo.
      const rings = 6;
      for (let i = rings; i > 0; i -= 1) {
        const r = (radius * i) / rings;
        const alpha = (intensity * 0.045 * (rings - i + 1)) / rings;
        g.circle(center.x, cy, r);
        g.fill({ color: colorHex, alpha });
      }
    },
    [bounds, color, intensity]
  );

  return <pixiGraphics draw={draw} />;
}
