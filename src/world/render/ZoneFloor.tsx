import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H, TILE_W } from "../lib/iso";
import type { ZoneBounds } from "../types";

interface ZoneFloorProps {
  bounds: ZoneBounds;
  baseColor: string;
  accent: string;
  hovered?: boolean;
  active?: boolean;
}

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

/**
 * Renders the floor area of a single zone with a subtle checker pattern
 * and an accent border around the room. Hover/active states brighten
 * the floor and intensify the border.
 */
export function ZoneFloor({ bounds, baseColor, accent, hovered, active }: ZoneFloorProps) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const baseHex = hex(baseColor);
      const accentHex = hex(accent);

      // Slightly lighten the base color when hovered/active
      const tileAlpha = active ? 1 : hovered ? 0.95 : 0.85;
      const accentTileAlpha = active ? 0.4 : hovered ? 0.28 : 0.18;

      // Render tiles with subtle accent checker
      for (let dy = 0; dy < bounds.h; dy += 1) {
        for (let dx = 0; dx < bounds.w; dx += 1) {
          const x = bounds.x + dx;
          const y = bounds.y + dy;
          const { x: cx, y: cy } = iso(x, y);
          const isAccent = (dx + dy) % 4 === 0;
          g.poly([
            cx,
            cy,
            cx + TILE_W / 2,
            cy + TILE_H / 2,
            cx,
            cy + TILE_H,
            cx - TILE_W / 2,
            cy + TILE_H / 2,
          ]);
          if (isAccent) {
            g.fill({ color: accentHex, alpha: accentTileAlpha });
          } else {
            g.fill({ color: baseHex, alpha: tileAlpha });
          }
        }
      }

      // Accent border around the zone (gold/teal/etc outline)
      const tl = iso(bounds.x, bounds.y);
      const tr = iso(bounds.x + bounds.w, bounds.y);
      const br = iso(bounds.x + bounds.w, bounds.y + bounds.h);
      const bl = iso(bounds.x, bounds.y + bounds.h);
      const borderAlpha = active ? 0.8 : hovered ? 0.5 : 0.22;
      g.poly([
        tl.x,
        tl.y + TILE_H / 2,
        tr.x,
        tr.y + TILE_H / 2,
        br.x,
        br.y + TILE_H / 2,
        bl.x,
        bl.y + TILE_H / 2,
      ]);
      g.stroke({ color: accentHex, alpha: borderAlpha, width: 1.5 });
    },
    [bounds, baseColor, accent, hovered, active]
  );

  return <pixiGraphics draw={draw} />;
}
