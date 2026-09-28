import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "@/world/lib/iso";
import { hex } from "@/world/render/utils";
import { useMotionTime } from "./useMotionTime";

type Point = { x: number; y: number };

export function DataPacketLine({
  from,
  to,
  color = "#5EEAD4",
  isActive,
  offset = 0,
}: {
  from: Point;
  to: Point;
  color?: string;
  isActive: boolean;
  offset?: number;
}) {
  const t = useMotionTime(0.8, offset);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const a = iso(from.x, from.y);
      const b = iso(to.x, to.y);
      const ax = a.x;
      const ay = a.y + TILE_H / 2;
      const bx = b.x;
      const by = b.y + TILE_H / 2;
      const colorHex = hex(color);
      g.moveTo(ax, ay);
      g.lineTo(bx, by);
      g.stroke({ color: colorHex, alpha: isActive ? 0.34 : 0.2, width: 1.2 });

      const progress = t % 1;
      const px = ax + (bx - ax) * progress;
      const py = ay + (by - ay) * progress;
      g.circle(px, py, 3.4);
      g.fill({ color: colorHex, alpha: isActive ? 0.9 : 0.55 });
      g.circle(px, py, 7);
      g.stroke({ color: colorHex, alpha: isActive ? 0.32 : 0.18, width: 1 });
    },
    [from, to, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
