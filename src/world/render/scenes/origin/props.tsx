import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "@/world/lib/iso";
import { useMotionTime } from "@/world/render/fx/useMotionTime";
import { IsoBox } from "@/world/render/primitives/IsoBox";
import { IsoCounter } from "@/world/render/primitives/IsoCounter";
import { INK, hex } from "@/world/render/utils";

export function IsoCertFrame({
  x,
  y,
  z = 1.2,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  z?: number;
  accent?: string;
}) {
  return (
    <IsoBox
      x={x}
      y={y}
      z={z}
      w={0.32}
      d={0.04}
      h={0.42}
      topColor={INK}
      leftColor={accent}
      rightColor="#1A1F2E"
    />
  );
}

export function IsoVintageCRT({
  x,
  y,
  screen = "#5EEAD4",
}: {
  x: number;
  y: number;
  screen?: string;
}) {
  const drawScanlines = useCallback(
    (g: Graphics) => {
      g.clear();
      const screenHex = hex(screen);
      const p = iso(x + 0.42, y + 0.34, 1.1);
      for (let i = 0; i < 5; i += 1) {
        g.rect(p.x - 7, p.y - 16 + i * 5, 22, 1.2);
        g.fill({ color: screenHex, alpha: 0.3 });
      }
      g.rect(p.x - 6, p.y - 2, 6, 2);
      g.fill({ color: screenHex, alpha: 0.95 });
    },
    [x, y, screen],
  );

  return (
    <pixiContainer>
      <IsoCounter x={x} y={y} w={2.5} d={1.25} topColor="#3a2415" faceColor="#23170D" />
      <IsoBox
        x={x + 0.22}
        y={y + 0.22}
        z={0.9}
        w={0.95}
        d={0.6}
        h={0.82}
        topColor="#dccfa9"
        leftColor="#a89c79"
        rightColor="#7a7156"
      />
      <IsoBox
        x={x + 0.38}
        y={y + 0.34}
        z={1.08}
        w={0.66}
        d={0.12}
        h={0.48}
        topColor={INK}
        leftColor={screen}
        rightColor="#0F1524"
      />
      <pixiGraphics draw={drawScanlines} />
      <IsoBox
        x={x + 1.4}
        y={y + 0.22}
        z={0.9}
        w={0.55}
        d={0.5}
        h={0.7}
        topColor="#d0c4a0"
        leftColor="#a89c79"
        rightColor="#7a7156"
      />
      <IsoBox
        x={x + 1.45}
        y={y + 0.32}
        z={1.45}
        w={0.45}
        d={0.06}
        h={0.06}
        topColor={INK}
        leftColor="#374151"
        rightColor="#1A2238"
      />
      <IsoBox
        x={x + 1.48}
        y={y + 0.42}
        z={1.3}
        w={0.07}
        d={0.06}
        h={0.05}
        topColor={screen}
        leftColor={screen}
        rightColor={screen}
      />
      <IsoBox
        x={x + 0.4}
        y={y + 0.88}
        z={0.9}
        w={0.95}
        d={0.28}
        h={0.04}
        topColor="#d0c4a0"
        leftColor="#a89c79"
        rightColor="#7a7156"
      />
      <IsoBox
        x={x + 1.55}
        y={y + 0.88}
        z={0.9}
        w={0.16}
        d={0.18}
        h={0.04}
        topColor="#d0c4a0"
        leftColor="#a89c79"
        rightColor="#7a7156"
      />
    </pixiContainer>
  );
}

export function IsoChildAtCRT({
  x,
  y,
  shirt = "#5EAEDF",
}: {
  x: number;
  y: number;
  shirt?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.3, y + 0.55, 0);
      const fx = p.x;
      const fy = p.y + TILE_H / 2;
      const SKIN = 0xf3d6ab;
      const HAIR = 0x3a2618;
      const shirtHex = hex(shirt);

      g.ellipse(fx, fy + 2, 10, 3);
      g.fill({ color: 0x000000, alpha: 0.42 });

      g.rect(fx - 4, fy - 4, 3, 4);
      g.fill({ color: 0x1a1f2e });
      g.rect(fx + 1, fy - 4, 3, 4);
      g.fill({ color: 0x1a1f2e });

      g.rect(fx - 5, fy - 12, 10, 8);
      g.fill({ color: shirtHex });
      g.stroke({ color: 0x050810, alpha: 0.55, width: 0.7 });

      g.rect(fx + 1, fy - 11, 7, 1.8);
      g.fill({ color: shirtHex });
      g.circle(fx + 8, fy - 10, 1.6);
      g.fill({ color: SKIN });

      g.rect(fx - 1, fy - 14, 2, 2);
      g.fill({ color: SKIN });

      g.rect(fx - 3, fy - 21, 6, 7);
      g.fill({ color: SKIN });
      g.stroke({ color: 0x050810, alpha: 0.55, width: 0.7 });
      g.rect(fx - 3, fy - 21, 6, 2.5);
      g.fill({ color: HAIR });
      g.rect(fx + 1, fy - 17.5, 1, 1);
      g.fill({ color: 0x070b14 });
      g.rect(fx + 3, fy - 17.5, 1, 1);
      g.fill({ color: 0x070b14 });
    },
    [x, y, shirt],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoDiplomaWithRibbon({
  x,
  y,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const p = iso(x + 0.5, y + 0.4, 0.9);
      g.rect(p.x - 16, p.y - 12, 32, 22);
      g.fill({ color: 0xf6f1e6, alpha: 0.97 });
      g.stroke({ color: 0x7a5a30, alpha: 0.75, width: 1 });
      for (let i = 0; i < 3; i += 1) {
        g.rect(p.x - 12, p.y - 8 + i * 4, 24, 1.2);
        g.fill({ color: 0x4a3520, alpha: 0.65 });
      }
      g.circle(p.x + 11, p.y + 7, 4);
      g.fill({ color: colorHex, alpha: 0.95 });
      g.circle(p.x + 11, p.y + 7, 6);
      g.stroke({ color: colorHex, alpha: 0.45, width: 0.8 });
      g.poly([p.x + 7, p.y + 10, p.x + 15, p.y + 10, p.x + 11, p.y + 18]);
      g.fill({ color: 0xb02020, alpha: 0.92 });
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoGradCap({
  x,
  y,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const p = iso(x + 0.5, y + 0.5, 0.85);
      g.poly([p.x, p.y - 14, p.x + 18, p.y - 6, p.x, p.y + 2, p.x - 18, p.y - 6]);
      g.fill({ color: 0x0b101d, alpha: 0.96 });
      g.stroke({ color: 0x050810, alpha: 0.9, width: 0.8 });
      g.rect(p.x - 7, p.y - 2, 14, 5);
      g.fill({ color: 0x0b101d, alpha: 0.95 });
      g.moveTo(p.x + 4, p.y - 8);
      g.lineTo(p.x + 10, p.y + 2);
      g.stroke({ color: colorHex, alpha: 0.95, width: 1.2 });
      g.circle(p.x + 10, p.y + 4, 1.6);
      g.fill({ color: colorHex, alpha: 0.95 });
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoTrailPath({
  points,
  color = "#60A5FA",
}: {
  points: readonly { x: number; y: number }[];
  color?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      points.forEach((pt, i) => {
        if (i === 0) return;
        const a = iso(points[i - 1].x, points[i - 1].y);
        const b = iso(pt.x, pt.y);
        g.moveTo(a.x, a.y + TILE_H / 2);
        g.lineTo(b.x, b.y + TILE_H / 2);
        g.stroke({ color: colorHex, alpha: 0.25, width: 1 });
      });
      points.forEach((pt, i) => {
        const p = iso(pt.x, pt.y);
        g.circle(p.x, p.y + TILE_H / 2, 2.2);
        g.fill({ color: colorHex, alpha: 0.55 + i * 0.06 });
        g.circle(p.x, p.y + TILE_H / 2, 4.4);
        g.stroke({ color: colorHex, alpha: 0.22, width: 0.8 });
      });
    },
    [points, color],
  );

  return <pixiGraphics draw={draw} />;
}

export function BadgeGlowFx({
  x,
  y,
  color = "#60A5FA",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(0.18);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.55, y + 0.5, 0.92);
      const pulse = 0.45 + Math.abs(Math.sin(t * Math.PI * 2)) * 0.45;
      const colorHex = hex(color);
      g.circle(p.x, p.y, 17 + pulse * 6);
      g.fill({ color: colorHex, alpha: (isActive ? 0.2 : 0.12) * pulse });
      g.circle(p.x, p.y, 8);
      g.stroke({ color: colorHex, alpha: isActive ? 0.8 : 0.5, width: 1.5 });
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}

export function PageFlipFx({
  x,
  y,
  color = "#E8B96B",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(0.75, y * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 0.92);
      const flip = Math.abs(Math.sin(t * Math.PI * 2));
      const colorHex = hex(color);
      g.rect(p.x - 15, p.y - 8, 14, 11);
      g.fill({ color: 0xf7f3ea, alpha: isActive ? 0.82 : 0.62 });
      g.rect(p.x + 1, p.y - 8, 14, 11);
      g.fill({ color: 0xf7f3ea, alpha: isActive ? 0.72 : 0.52 });
      g.moveTo(p.x + 1, p.y - 8);
      g.lineTo(p.x + 1 + 12 * flip, p.y - 10 + 6 * flip);
      g.lineTo(p.x + 1, p.y + 3);
      g.closePath();
      g.fill({ color: colorHex, alpha: isActive ? 0.46 : 0.28 });
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
