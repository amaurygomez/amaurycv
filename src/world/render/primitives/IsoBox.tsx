import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "@/world/lib/iso";
import { hex } from "@/world/render/utils";

// A dark edge on every face keeps solid objects readable when zoomed out.
const EDGE = { color: 0x050810, alpha: 0.65, width: 1 };

interface IsoBoxProps {
  x: number;
  y: number;
  z?: number;
  // w and d are in tiles, h is in tile heights.
  w?: number;
  d?: number;
  h?: number;
  topColor: string;
  leftColor: string;
  rightColor: string;
  outline?: boolean;
}

export function IsoBox({
  x,
  y,
  z = 0,
  w = 1,
  d = 1,
  h = 1,
  topColor,
  leftColor,
  rightColor,
  outline = true,
}: IsoBoxProps) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const top = iso(x, y, z + h);
      const topR = iso(x + w, y, z + h);
      const topB = iso(x + w, y + d, z + h);
      const topL = iso(x, y + d, z + h);
      const botR = iso(x + w, y, z);
      const botB = iso(x + w, y + d, z);
      const botL = iso(x, y + d, z);

      // Shadow only for objects that stand on the floor and are tall enough to read as solid.
      if (h >= 0.35 && z === 0) {
        const sFL = iso(x + 0.06, y + 0.06);
        const sFR = iso(x + w - 0.06, y + 0.06);
        const sBR = iso(x + w - 0.06, y + d - 0.06);
        const sBL = iso(x + 0.06, y + d - 0.06);
        const floorY = TILE_H / 2;
        g.poly([
          sFL.x,
          sFL.y + floorY,
          sFR.x,
          sFR.y + floorY,
          sBR.x,
          sBR.y + floorY,
          sBL.x,
          sBL.y + floorY,
        ]);
        g.fill({ color: 0x000000, alpha: 0.32 });
      }

      g.poly([top.x, top.y, topR.x, topR.y, topB.x, topB.y, topL.x, topL.y]);
      g.fill({ color: hex(topColor) });
      if (outline) g.stroke(EDGE);

      g.poly([topR.x, topR.y, topB.x, topB.y, botB.x, botB.y, botR.x, botR.y]);
      g.fill({ color: hex(rightColor) });
      if (outline) g.stroke(EDGE);

      g.poly([topL.x, topL.y, topB.x, topB.y, botB.x, botB.y, botL.x, botL.y]);
      g.fill({ color: hex(leftColor) });
      if (outline) g.stroke(EDGE);
    },
    [x, y, z, w, d, h, topColor, leftColor, rightColor, outline],
  );

  return <pixiGraphics draw={draw} />;
}
