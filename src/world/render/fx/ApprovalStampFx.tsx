import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso } from "@/world/lib/iso";
import { hex } from "@/world/render/utils";
import { useMotionTime } from "./useMotionTime";

export function ApprovalStampFx({
  x,
  y,
  color = "#34D399",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(1.4, x * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.05);
      const colorHex = hex(color);
      const pulse = 0.65 + Math.sin(t * Math.PI * 2) * 0.18;
      g.circle(p.x, p.y, 12 + pulse * 3);
      g.stroke({ color: colorHex, alpha: isActive ? 0.65 : 0.38, width: 1.5 });
      g.moveTo(p.x - 6, p.y);
      g.lineTo(p.x - 1, p.y + 5);
      g.lineTo(p.x + 8, p.y - 7);
      g.stroke({ color: colorHex, alpha: isActive ? 0.9 : 0.55, width: 2 });
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
