import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H, TILE_W } from "@/world/lib/iso";
import type { ZoneBounds } from "@/world/types";
import { hex } from "./utils";

const RINGS = 6;

// Concentric circles with rising alpha toward the center fake a light spill on
// the floor without a shader or texture.
export function AmbientGlow({
  bounds,
  color,
  intensity = 0.5,
}: {
  bounds: ZoneBounds;
  color: string;
  intensity?: number;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      const center = iso(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
      const cy = center.y + TILE_H / 2;
      const radius = Math.max(bounds.w, bounds.h) * TILE_W * 0.55 + TILE_W * 0.5;
      for (let i = RINGS; i > 0; i -= 1) {
        const r = (radius * i) / RINGS;
        const alpha = (intensity * 0.045 * (RINGS - i + 1)) / RINGS;
        g.circle(center.x, cy, r);
        g.fill({ color: colorHex, alpha });
      }
    },
    [bounds, color, intensity],
  );

  return <pixiGraphics draw={draw} />;
}
