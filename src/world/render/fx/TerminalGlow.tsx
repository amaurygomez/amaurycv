import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { useReducedMotion } from "motion/react";
import { iso, TILE_H } from "@/world/lib/iso";

const MIN_ALPHA = 0.15;
const MAX_ALPHA = 0.5;

export function TerminalGlow({ x, y, isActive }: { x: number; y: number; isActive: boolean }) {
  const [alpha, setAlpha] = useState(MIN_ALPHA);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isActive || reduced) return;
    let rising = true;
    const id = setInterval(() => {
      setAlpha((prev) => {
        const next = rising ? prev + 0.07 : prev - 0.07;
        if (next >= MAX_ALPHA) {
          rising = false;
          return MAX_ALPHA;
        }
        if (next <= MIN_ALPHA) {
          rising = true;
          return MIN_ALPHA;
        }
        return next;
      });
    }, 600);
    return () => clearInterval(id);
  }, [isActive, reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const c = iso(x + 0.7, y + 0.7);
      const cy = c.y + TILE_H / 2;
      g.ellipse(c.x, cy, 28, 14);
      g.fill({ color: 0x5eead4, alpha });
      g.ellipse(c.x, cy, 20, 10);
      g.stroke({ color: 0x5eead4, alpha: alpha * 1.5, width: 1.2 });
    },
    [x, y, alpha],
  );

  if (!isActive) return null;
  return <pixiGraphics draw={draw} />;
}
