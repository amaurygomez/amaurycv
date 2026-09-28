import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "@/world/lib/iso";
import { hex } from "@/world/render/utils";

export function IsoCarpet({
  x,
  y,
  w = 2,
  d = 2,
  color = "#5EEAD4",
  alpha = 0.18,
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  color?: string;
  alpha?: number;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const tl = iso(x, y);
      const tr = iso(x + w, y);
      const br = iso(x + w, y + d);
      const bl = iso(x, y + d);
      const floorY = TILE_H / 2;
      g.poly([tl.x, tl.y + floorY, tr.x, tr.y + floorY, br.x, br.y + floorY, bl.x, bl.y + floorY]);
      g.fill({ color: hex(color), alpha });
      g.stroke({ color: hex(color), alpha: alpha * 2, width: 1 });
    },
    [x, y, w, d, color, alpha],
  );

  return <pixiGraphics draw={draw} />;
}
