import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H, TILE_W } from "@/world/lib/iso";
import type { ZoneBounds, ZoneId } from "@/world/types";
import { hex } from "./utils";

interface ZoneHotspotProps {
  id: ZoneId;
  bounds: ZoneBounds;
  accent: string;
  hovered?: boolean;
  active?: boolean;
  onHover: (id: ZoneId | null) => void;
  onSelect: (id: ZoneId) => void;
}

const RING_WIDTH: Record<string, number> = {
  "#E8B96B": 2.6,
  "#F97316": 2.3,
  "#34D399": 2.1,
};

export function ZoneHotspot({
  id,
  bounds,
  accent,
  hovered,
  active,
  onHover,
  onSelect,
}: ZoneHotspotProps) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      setPulse((Math.sin(t * 2) + 1) / 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const tl = iso(bounds.x, bounds.y);
      const tr = iso(bounds.x + bounds.w, bounds.y);
      const br = iso(bounds.x + bounds.w, bounds.y + bounds.h);
      const bl = iso(bounds.x, bounds.y + bounds.h);
      const floorY = TILE_H / 2;
      g.poly([tl.x, tl.y + floorY, tr.x, tr.y + floorY, br.x, br.y + floorY, bl.x, bl.y + floorY]);
      // Near-zero alpha keeps the whole room hit-testable while staying invisible.
      g.fill({ color: 0xffffff, alpha: 0.001 });

      // Ring only on hover or active; an idle pulse on every room looked like debug UI.
      if (hovered || active) {
        const center = iso(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
        const baseR = Math.min(bounds.w, bounds.h) * TILE_W * 0.14;
        g.circle(center.x, center.y + floorY, baseR + pulse * 4);
        g.stroke({
          color: hex(accent),
          alpha: active ? 0.55 : 0.35,
          width: RING_WIDTH[accent] ?? 1.8,
        });
      }
    },
    [bounds, accent, hovered, active, pulse],
  );

  return (
    <pixiGraphics
      draw={draw}
      eventMode="static"
      cursor="pointer"
      onPointerOver={() => onHover(id)}
      onPointerOut={() => onHover(null)}
      onPointerTap={() => onSelect(id)}
    />
  );
}
