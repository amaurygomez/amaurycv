import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso } from "@/world/lib/iso";
import { hex } from "@/world/render/utils";
import { useMotionTime } from "./useMotionTime";

export function ReceiptFeedFx({
  x,
  y,
  color = "#FBBF24",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(1.6, y * 0.18);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.1);
      const colorHex = hex(color);
      for (let i = 0; i < 5; i += 1) {
        const dy = ((t * 16 + i * 8) % 38) - 18;
        g.rect(p.x - 11, p.y - dy, 22, 1.5);
        g.fill({ color: colorHex, alpha: isActive ? 0.72 : 0.42 });
      }
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
