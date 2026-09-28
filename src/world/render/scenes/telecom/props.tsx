import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "@/world/lib/iso";
import { useMotionTime } from "@/world/render/fx/useMotionTime";
import { IsoBox } from "@/world/render/primitives/IsoBox";
import { IsoCounter } from "@/world/render/primitives/IsoCounter";
import { INK, hex } from "@/world/render/utils";

const COVERAGE_LEGEND = ["3G", "4G", "5G", "FIBER", "HFC"];

export function IsoCoverageMap({
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

      const p = iso(x + 1.4, y + 0.08, 1.7);
      g.moveTo(p.x - 36, p.y - 5);
      g.lineTo(p.x - 14, p.y - 12);
      g.lineTo(p.x + 8, p.y - 14);
      g.lineTo(p.x + 26, p.y - 10);
      g.lineTo(p.x + 32, p.y + 0);
      g.lineTo(p.x + 24, p.y + 8);
      g.lineTo(p.x + 4, p.y + 12);
      g.lineTo(p.x - 18, p.y + 10);
      g.lineTo(p.x - 32, p.y + 4);
      g.closePath();
      g.fill({ color: 0x0e2026, alpha: 0.95 });
      g.stroke({ color: colorHex, alpha: 0.7, width: 1.1 });

      [
        { dx: -18, dy: -6, c: green },
        { dx: -2, dy: -8, c: green },
        { dx: 14, dy: -6, c: colorHex },
        { dx: -10, dy: 4, c: gold },
        { dx: 16, dy: 2, c: gold },
      ].forEach((spot) => {
        g.circle(p.x + spot.dx, p.y + spot.dy, 2.5);
        g.fill({ color: spot.c, alpha: 0.92 });
        g.circle(p.x + spot.dx, p.y + spot.dy, 5);
        g.stroke({ color: spot.c, alpha: 0.35, width: 0.8 });
      });

      COVERAGE_LEGEND.forEach((_, i) => {
        const lp = iso(x + 0.3 + i * 0.5, y + 0.08, 0.55);
        g.circle(lp.x - 9, lp.y, 2);
        g.fill({ color: i === 4 ? gold : i === 2 ? colorHex : green, alpha: 0.95 });
        g.rect(lp.x - 6, lp.y - 4, 14, 8);
        g.fill({ color: 0x05080f, alpha: 0.85 });
      });
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.3}
        w={3.0}
        d={0.08}
        h={1.95}
        topColor={INK}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <pixiGraphics draw={draw} />
      {COVERAGE_LEGEND.map((label, i) => {
        const lp = iso(x + 0.3 + i * 0.5, y + 0.08, 0.55);
        return (
          <pixiText
            key={label}
            text={label}
            x={lp.x + 1}
            y={lp.y - 1}
            anchor={0.5}
            scale={1 / 3}
            resolution={3}
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 21,
              fontWeight: "700",
              fill: "#F7F3EA",
              letterSpacing: 1.2,
            }}
          />
        );
      })}
    </pixiContainer>
  );
}

export function IsoRecLiveMonitor({
  x,
  y,
  accent = "#F87171",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const p = iso(x + 0.9, y + 0.05, 1.3);
      g.rect(p.x - 36, p.y - 28, 72, 44);
      g.fill({ color: 0x05080f, alpha: 0.95 });
      g.stroke({ color: colorHex, alpha: 0.7, width: 1 });
      g.circle(p.x - 30, p.y - 22, 3);
      g.fill({ color: colorHex, alpha: 0.95 });
      [0.4, 0.7, 1.0, 0.6, 0.85, 0.5].forEach((h, i) => {
        g.rect(p.x - 20 + i * 7, p.y - 10 * h, 4, 20 * h);
        g.fill({ color: 0x5eead4, alpha: 0.78 });
      });
      g.rect(p.x - 30, p.y + 6, 28, 1.6);
      g.fill({ color: 0xe6e2d4, alpha: 0.65 });
    },
    [x, y, accent],
  );

  const labelPos = iso(x + 0.9, y + 0.05, 1.3);
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.85}
        w={1.8}
        d={0.06}
        h={1.0}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
      <pixiText
        text="REC · LIVE"
        x={labelPos.x - 8}
        y={labelPos.y - 22}
        anchor={{ x: 0, y: 0.5 }}
        scale={1 / 3}
        resolution={3}
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 24,
          fontWeight: "700",
          fill: "#F87171",
          letterSpacing: 1.8,
        }}
      />
    </pixiContainer>
  );
}

export function IsoCellTower({
  x,
  y,
  accent = "#5EEAD4",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const t = useMotionTime(1.8, x * 0.3);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const accentHex = hex(accent);
      const pulse = (Math.sin(t) + 1) / 2;
      const base = iso(x + 0.5, y + 0.5);
      const cx = base.x;
      const cy = base.y + TILE_H / 2;
      const topY = cy - 36;
      for (const [bx1, bx2] of [
        [-6, -2],
        [6, 2],
        [-3, -1],
        [3, 1],
      ]) {
        g.moveTo(cx + bx1, cy);
        g.lineTo(cx + bx2, topY);
        g.stroke({ color: 0x9aa3b8, alpha: 0.9, width: 1.5 });
      }
      g.rect(cx - 1, topY - 8, 2, 8);
      g.fill({ color: accentHex });
      for (let i = 0; i < 3; i += 1) {
        const beamY = cy - 8 - i * 8;
        g.moveTo(cx - 5 + i * 1.2, beamY);
        g.lineTo(cx + 5 - i * 1.2, beamY);
        g.stroke({ color: 0x9aa3b8, alpha: 0.55, width: 1 });
      }
      for (let i = 0; i < 3; i += 1) {
        const r = 8 + i * 6 + pulse * 4;
        g.arc(cx, topY, r, Math.PI * 0.85, Math.PI * 0.15, false);
        g.stroke({ color: accentHex, alpha: 0.45 - i * 0.1, width: 1.2 });
      }
    },
    [x, y, accent, t],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoNetworkPlanningStation({
  x,
  y,
  accent = "#5EEAD4",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const drawMap = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const gold = 0xe8b96b;
      const p = iso(x + 0.55, y + 0.35, 1.25);
      for (let i = 0; i <= 4; i += 1) {
        g.moveTo(p.x - 18 + i * 9, p.y - 18);
        g.lineTo(p.x - 18 + i * 9, p.y + 18);
        g.stroke({ color: colorHex, alpha: 0.25, width: 0.5 });
        g.moveTo(p.x - 18, p.y - 18 + i * 9);
        g.lineTo(p.x + 18, p.y - 18 + i * 9);
        g.stroke({ color: colorHex, alpha: 0.25, width: 0.5 });
      }
      g.poly([
        p.x - 12,
        p.y - 8,
        p.x + 4,
        p.y - 12,
        p.x + 14,
        p.y - 2,
        p.x + 8,
        p.y + 10,
        p.x - 8,
        p.y + 8,
      ]);
      g.fill({ color: colorHex, alpha: 0.28 });
      g.stroke({ color: colorHex, alpha: 0.85, width: 1.2 });
      g.circle(p.x + 1, p.y, 2);
      g.fill({ color: gold, alpha: 0.95 });
      g.circle(p.x + 1, p.y, 5);
      g.stroke({ color: gold, alpha: 0.5, width: 0.8 });
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoCounter x={x} y={y} w={1.4} d={1.0} topColor="#14313A" faceColor="#0A1720" />
      <IsoBox
        x={x + 0.18}
        y={y + 0.25}
        z={0.9}
        w={0.85}
        d={0.12}
        h={0.7}
        topColor={INK}
        leftColor={accent}
        rightColor="#0F1524"
      />
      <pixiGraphics draw={drawMap} />
      <IsoBox
        x={x + 0.25}
        y={y + 0.62}
        z={0.9}
        w={0.55}
        d={0.3}
        h={0.04}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.85}
        y={y + 0.7}
        z={0.9}
        w={0.25}
        d={0.04}
        h={0.02}
        topColor="#E8B96B"
        leftColor="#7a4b12"
        rightColor="#4a2b08"
      />
    </pixiContainer>
  );
}

export function IsoServiceKiosk({
  x,
  y,
  accent = "#5EEAD4",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoCounter x={x} y={y} w={2.0} d={1.05} topColor="#14313A" faceColor="#0A1720" />
      <IsoBox
        x={x + 0.45}
        y={y + 0.18}
        z={0.9}
        w={0.18}
        d={0.18}
        h={0.5}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.35}
        y={y + 0.3}
        z={1.05}
        w={0.55}
        d={0.1}
        h={0.5}
        topColor={INK}
        leftColor={accent}
        rightColor="#0F1524"
      />
      <IsoBox
        x={x + 0.3}
        y={y + 0.65}
        z={0.9}
        w={0.7}
        d={0.22}
        h={0.04}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 1.35}
        y={y + 0.2}
        z={0.9}
        w={0.45}
        d={0.32}
        h={0.25}
        topColor="#E8B96B"
        leftColor="#7a4b12"
        rightColor="#4a2b08"
      />
    </pixiContainer>
  );
}

export function IsoIvrKeypad({
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
        w={0.8}
        d={0.6}
        h={0.85}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.08}
        y={y + 0.12}
        z={0.85}
        w={0.6}
        d={0.16}
        h={0.08}
        topColor={accent}
        leftColor="#7a4b12"
        rightColor="#4a2b08"
      />
      {[0.95, 1.05, 1.15].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.15}
          y={y + 0.5}
          z={z}
          w={0.5}
          d={0.06}
          h={0.05}
          topColor={INK}
          leftColor={accent}
          rightColor="#0F1524"
        />
      ))}
    </pixiContainer>
  );
}

export function SignalWaveFx({
  x,
  y,
  color = "#5EEAD4",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(1.5, x * 0.2 + y * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.7);
      const colorHex = hex(color);
      for (let i = 0; i < 3; i += 1) {
        const r = 7 + i * 7 + ((t * 6) % 6);
        g.arc(p.x, p.y, r, Math.PI * 0.85, Math.PI * 0.15, false);
        g.stroke({ color: colorHex, alpha: (isActive ? 0.58 : 0.34) - i * 0.09, width: 1.3 });
      }
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
