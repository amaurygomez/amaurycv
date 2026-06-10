import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H, TILE_W } from "../lib/iso";
import type { ZoneBounds, ZoneId } from "../types";

interface ZoneHotspotProps {
  id: ZoneId;
  bounds: ZoneBounds;
  accent: string;
  hovered?: boolean;
  active?: boolean;
  onHover: (id: ZoneId | null) => void;
  onSelect: (id: ZoneId) => void;
}

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

/**
 * Invisible interactive area covering a zone footprint. Captures hover
 * and click for the whole room. Draws a pulsing accent ring at the
 * center as the only visual cue — text labels live in the side panel.
 */
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
      // 0..1 triangle wave at ~0.5 Hz
      setPulse((Math.sin(t * 2) + 1) / 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const accentHex = hex(accent);
      // Hit area: full zone diamond (transparent fill so it stays clickable)
      const tl = iso(bounds.x, bounds.y);
      const tr = iso(bounds.x + bounds.w, bounds.y);
      const br = iso(bounds.x + bounds.w, bounds.y + bounds.h);
      const bl = iso(bounds.x, bounds.y + bounds.h);
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
      g.fill({ color: 0xffffff, alpha: 0.001 });

      // Subtle accent ring at the zone center — only shows on hover/active.
      // No idle pulse: avoids the "UI debug" look. The zone floor itself
      // brightens on hover (ZoneFloor handles that).
      if (hovered || active) {
        const center = iso(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
        const cy = center.y + TILE_H / 2;
        const baseR = Math.min(bounds.w, bounds.h) * TILE_W * 0.14;
        const pulseR = baseR + pulse * 4;
        const ringAlpha = active ? 0.55 : 0.35;
        const ringWidth =
          accent === "#E8B96B"
            ? 2.6
            : accent === "#F97316"
              ? 2.3
              : accent === "#34D399"
                ? 2.1
                : 1.8;

        g.circle(center.x, cy, pulseR);
        g.stroke({ color: accentHex, alpha: ringAlpha, width: ringWidth });
      }
    },
    [bounds, accent, hovered, active, pulse]
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
