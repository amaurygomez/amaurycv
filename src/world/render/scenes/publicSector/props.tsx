import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { useReducedMotion } from "motion/react";
import { iso, TILE_H } from "@/world/lib/iso";
import { useMotionTime } from "@/world/render/fx/useMotionTime";
import { IsoBox } from "@/world/render/primitives/IsoBox";
import { INK, hex } from "@/world/render/utils";

export function IsoServerRack({ x, y }: { x: number; y: number }) {
  const drawLeds = useCallback(
    (g: Graphics) => {
      g.clear();
      for (let row = 0; row < 5; row += 1) {
        const p = iso(x, y, 2.2 - row * 0.4);
        g.rect(p.x - 6, p.y - 2, 5, 5);
        g.fill({ color: row % 2 ? 0x34d399 : 0xe8b96b, alpha: 0.9 });
      }
    },
    [x, y],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1}
        d={1.2}
        h={2.4}
        topColor="#1A2238"
        leftColor="#0B101D"
        rightColor={INK}
      />
      <pixiGraphics draw={drawLeds} />
    </pixiContainer>
  );
}

export function IsoAdminDesk({
  x,
  y,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={0.7}
        d={0.55}
        h={0.7}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.08}
        y={y + 0.1}
        z={0.7}
        w={0.5}
        d={0.08}
        h={0.35}
        topColor={INK}
        leftColor={accent}
        rightColor="#0F1524"
      />
    </pixiContainer>
  );
}

export function IsoFloorMap({
  x,
  y,
  w = 3,
  d = 2,
  base = "#13201F",
  outline = "#5EEAD4",
  pins = [],
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  base?: string;
  outline?: string;
  pins?: { dx: number; dy: number; color: string }[];
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const outlineHex = hex(outline);
      const floorY = TILE_H / 2;
      const tl = iso(x, y);
      const tr = iso(x + w, y);
      const br = iso(x + w, y + d);
      const bl = iso(x, y + d);
      g.poly([tl.x, tl.y + floorY, tr.x, tr.y + floorY, br.x, br.y + floorY, bl.x, bl.y + floorY]);
      g.fill({ color: hex(base), alpha: 0.55 });
      g.stroke({ color: outlineHex, alpha: 0.7, width: 1.5 });

      const ridgeA = iso(x + w * 0.2, y + d * 0.4);
      const ridgeB = iso(x + w * 0.7, y + d * 0.6);
      g.moveTo(ridgeA.x, ridgeA.y + floorY);
      g.lineTo(ridgeB.x, ridgeB.y + floorY);
      g.stroke({ color: outlineHex, alpha: 0.35, width: 1 });

      pins.forEach((pin) => {
        const pp = iso(x + pin.dx, y + pin.dy);
        const px = pp.x;
        const py = pp.y + floorY;
        const pinHex = hex(pin.color);
        g.moveTo(px, py);
        g.lineTo(px, py - 8);
        g.stroke({ color: 0x070b14, alpha: 0.85, width: 1.5 });
        g.circle(px, py - 8, 3);
        g.fill({ color: pinHex, alpha: 1 });
        g.circle(px, py - 8, 6);
        g.stroke({ color: pinHex, alpha: 0.5, width: 1 });
      });
    },
    [x, y, w, d, base, outline, pins],
  );

  return <pixiGraphics draw={draw} />;
}

function IsoSeatedFigure({
  x,
  y,
  shirt,
  facing,
}: {
  x: number;
  y: number;
  shirt: string;
  facing: "n" | "s";
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x, y, 0);
      const fx = p.x;
      const fy = p.y + TILE_H / 2;
      g.ellipse(fx, fy + 2, 9, 3);
      g.fill({ color: 0x000000, alpha: 0.4 });
      g.rect(fx - 5, fy - (facing === "n" ? 18 : 10), 10, 8);
      g.fill({ color: 0x1f2937 });
      g.rect(fx - 4, fy - 16, 8, 9);
      g.fill({ color: hex(shirt) });
      g.rect(fx - 3, fy - 23, 6, 7);
      g.fill({ color: 0xe8c8a0 });
      g.rect(fx - 3, fy - 23, 6, 2);
      g.fill({ color: 0x241a08 });
    },
    [x, y, shirt, facing],
  );

  return <pixiGraphics draw={draw} />;
}

const SEAT_OFFSETS = [0.4, 1.55, 2.7];

export function IsoMeetingTable({
  x,
  y,
  w = 3.2,
  d = 1.4,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  accent?: string;
}) {
  const drawDocuments = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      for (let i = 0; i < 3; i += 1) {
        const p = iso(x + 0.5 + (i * (w - 1)) / 2, y + d / 2, 0.72);
        g.rect(p.x - 8, p.y - 6, 16, 8);
        g.fill({ color: 0xf6f1e6, alpha: 0.92 });
        g.rect(p.x - 6, p.y - 4, 12, 1.2);
        g.fill({ color: colorHex, alpha: 0.7 });
        g.rect(p.x - 6, p.y - 1, 8, 1);
        g.fill({ color: 0x0b101d, alpha: 0.7 });
      }
    },
    [x, y, w, d, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={w}
        d={d}
        h={0.7}
        topColor="#3a2415"
        leftColor="#23170D"
        rightColor="#160E07"
      />
      <IsoBox
        x={x + 0.05}
        y={y + d / 2 - 0.04}
        z={0.7}
        w={w - 0.1}
        d={0.08}
        h={0.02}
        topColor={accent}
        leftColor={accent}
        rightColor={accent}
      />
      <pixiGraphics draw={drawDocuments} />
      {SEAT_OFFSETS.map((dx) => (
        <IsoSeatedFigure key={`n-${dx}`} x={x + dx} y={y - 0.45} shirt="#1f3a5b" facing="s" />
      ))}
      {SEAT_OFFSETS.map((dx) => (
        <IsoSeatedFigure key={`s-${dx}`} x={x + dx} y={y + d + 0.05} shirt="#3a1f1f" facing="n" />
      ))}
    </pixiContainer>
  );
}

export function IsoConfidentialBadge({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const p = iso(x + 0.5, y + 0.5, 1.0);
      g.poly([
        p.x,
        p.y - 16,
        p.x + 11,
        p.y - 12,
        p.x + 11,
        p.y - 2,
        p.x + 6,
        p.y + 8,
        p.x,
        p.y + 12,
        p.x - 6,
        p.y + 8,
        p.x - 11,
        p.y - 2,
        p.x - 11,
        p.y - 12,
      ]);
      g.fill({ color: 0x0b1322, alpha: 0.95 });
      g.stroke({ color: colorHex, alpha: 0.9, width: 1.2 });
      g.rect(p.x - 4, p.y - 4, 8, 7);
      g.fill({ color: colorHex, alpha: 0.92 });
      g.arc(p.x, p.y - 4, 3.6, Math.PI, 0, false);
      g.stroke({ color: colorHex, alpha: 0.95, width: 1.4 });
      g.circle(p.x, p.y - 1, 1.2);
      g.fill({ color: 0x05080f, alpha: 1 });
      g.rect(p.x - 0.6, p.y - 1, 1.2, 3);
      g.fill({ color: 0x05080f, alpha: 1 });
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoRoleMatrix({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          const granted = col <= row;
          const p = iso(x + 0.2 + col * 0.34, y + 0.08, 1.85 - row * 0.22);
          g.rect(p.x - 4, p.y - 4, 8, 6);
          g.fill({ color: granted ? colorHex : 0x1a2238, alpha: granted ? 0.85 : 0.9 });
          g.stroke({ color: 0x070b14, alpha: 0.7, width: 0.5 });
        }
      }
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.5}
        w={1.7}
        d={0.06}
        h={1.45}
        topColor={INK}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function IsoAuditTrailBoard({
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
      for (let i = 0; i < 6; i += 1) {
        const p = iso(x + 0.22, y + 0.08, 1.9 - i * 0.16);
        g.rect(p.x, p.y, 38 - i * 3, 1.4);
        g.fill({ color: colorHex, alpha: 0.65 });
      }
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.5}
        w={1.5}
        d={0.06}
        h={1.45}
        topColor={INK}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function IsoBigWallMap({
  x,
  y,
  accent = "#5EEAD4",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const gold = 0xe8b96b;
      const green = 0x34d399;
      const p = iso(x + 1.5, y + 0.05, 1.85);
      g.moveTo(p.x - 40, p.y - 4);
      g.lineTo(p.x - 16, p.y - 14);
      g.lineTo(p.x + 10, p.y - 16);
      g.lineTo(p.x + 30, p.y - 10);
      g.lineTo(p.x + 36, p.y + 0);
      g.lineTo(p.x + 26, p.y + 12);
      g.lineTo(p.x + 4, p.y + 16);
      g.lineTo(p.x - 22, p.y + 12);
      g.lineTo(p.x - 36, p.y + 4);
      g.closePath();
      g.fill({ color: 0x0c1f24, alpha: 0.96 });
      g.stroke({ color: colorHex, alpha: 0.85, width: 1.2 });
      [
        { dx: -22, dy: -6, c: green },
        { dx: -4, dy: -10, c: gold },
        { dx: 18, dy: -6, c: green },
        { dx: 8, dy: 6, c: colorHex },
        { dx: -16, dy: 4, c: gold },
      ].forEach((spot) => {
        g.circle(p.x + spot.dx, p.y + spot.dy, 2.5);
        g.fill({ color: spot.c, alpha: 0.92 });
      });
      [0.45, 0.55, 0.65].forEach((s, i) => {
        g.rect(p.x + 22, p.y - 12 + i * 6, 12 * s, 2.4);
        g.fill({ color: i === 0 ? green : i === 1 ? gold : colorHex, alpha: 0.85 });
      });
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.5}
        w={3.2}
        d={0.08}
        h={2.0}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function DashboardFlicker({ x, y, isActive }: { x: number; y: number; isActive: boolean }) {
  const [flash, setFlash] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isActive || reduced) return;
    let offTimer: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      clearTimeout(offTimer);
      setFlash(true);
      offTimer = setTimeout(() => setFlash(false), 150);
    }, 1800);
    return () => {
      clearInterval(id);
      clearTimeout(offTimer);
    };
  }, [isActive, reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      if (!flash) return;
      const tl = iso(x, y, 1.2);
      const tr = iso(x + 6, y, 1.2);
      const br = iso(x + 6, y, 2.1);
      const bl = iso(x, y, 2.1);
      g.poly([tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
      g.fill({ color: 0x34d399, alpha: 0.18 });
    },
    [x, y, flash],
  );

  if (!isActive) return null;
  return <pixiGraphics draw={draw} />;
}

export function MapPinBlinkFx({
  points,
  color = "#34D399",
  isActive,
}: {
  points: readonly { x: number; y: number; z?: number }[];
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(0.9);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      points.forEach((point, index) => {
        const p = iso(point.x, point.y, point.z ?? 0.2);
        const pulse = 0.45 + Math.abs(Math.sin(t * Math.PI * 2 + index)) * 0.45;
        g.circle(p.x, p.y + TILE_H / 2, 3.5);
        g.fill({ color: colorHex, alpha: isActive ? pulse : pulse * 0.6 });
        g.circle(p.x, p.y + TILE_H / 2, 8 + pulse * 3);
        g.stroke({ color: colorHex, alpha: (isActive ? 0.26 : 0.15) * pulse, width: 1 });
      });
    },
    [points, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}

export function ChartBarsFx({
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
  const t = useMotionTime(0.55, y * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      [0.28, 0.62, 0.42, 0.8, 0.55].forEach((base, index) => {
        const growth = 0.65 + Math.abs(Math.sin(t * Math.PI * 2 + index * 0.7)) * 0.35;
        const h = 10 + base * 22 * growth;
        const p = iso(x + 0.22 + index * 0.28, y + 0.08, 1.42);
        g.rect(p.x, p.y - h, 6, h);
        g.fill({ color: colorHex, alpha: isActive ? 0.78 : 0.48 });
      });
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
