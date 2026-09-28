import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H, TILE_W } from "@/world/lib/iso";
import type { ZoneBounds } from "@/world/types";
import { hex } from "./utils";

interface ZoneFloorProps {
  bounds: ZoneBounds;
  baseColor: string;
  accent: string;
  hovered?: boolean;
  active?: boolean;
}

export function ZoneFloor({ bounds, baseColor, accent, hovered, active }: ZoneFloorProps) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const baseHex = hex(baseColor);
      const accentHex = hex(accent);
      const tileAlpha = active ? 1 : hovered ? 0.95 : 0.85;
      const accentTileAlpha = active ? 0.4 : hovered ? 0.28 : 0.18;

      for (let dy = 0; dy < bounds.h; dy += 1) {
        for (let dx = 0; dx < bounds.w; dx += 1) {
          const { x: cx, y: cy } = iso(bounds.x + dx, bounds.y + dy);
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
          if ((dx + dy) % 4 === 0) {
            g.fill({ color: accentHex, alpha: accentTileAlpha });
          } else {
            g.fill({ color: baseHex, alpha: tileAlpha });
          }
        }
      }

      const tl = iso(bounds.x, bounds.y);
      const tr = iso(bounds.x + bounds.w, bounds.y);
      const br = iso(bounds.x + bounds.w, bounds.y + bounds.h);
      const bl = iso(bounds.x, bounds.y + bounds.h);
      const floorY = TILE_H / 2;
      g.poly([tl.x, tl.y + floorY, tr.x, tr.y + floorY, br.x, br.y + floorY, bl.x, bl.y + floorY]);
      g.stroke({ color: accentHex, alpha: active ? 0.8 : hovered ? 0.5 : 0.22, width: 1.5 });
    },
    [bounds, baseColor, accent, hovered, active],
  );

  return <pixiGraphics draw={draw} />;
}
