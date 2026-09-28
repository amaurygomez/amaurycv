import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "@/world/lib/iso";
import { useMotionTime } from "@/world/render/fx/useMotionTime";
import { IsoBox } from "@/world/render/primitives/IsoBox";
import { INK, hex } from "@/world/render/utils";

export function IsoChef({
  x,
  y,
  facing = "sw",
}: {
  x: number;
  y: number;
  facing?: "se" | "sw" | "ne" | "nw";
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const foot = iso(x + 0.5, y + 0.5);
      const fx = foot.x;
      const fy = foot.y;
      const SKIN = 0xe8c8a0;
      const COAT = 0xf3efe2;
      const COAT_DARK = 0xc7c2b1;
      const PANTS = 0x111827;
      const PANTS_DARK = 0x0a0f18;
      const APRON = 0xe8b96b;
      const TOQUE = 0xf7f3ea;
      const EDGE = 0x050810;
      const shoulderY = fy - 21;
      const headTop = shoulderY - 9;

      g.ellipse(fx, fy + 4, 12, 4);
      g.fill({ color: 0x000000, alpha: 0.45 });

      g.rect(fx - 5, fy, 4, 3);
      g.fill({ color: 0x070b14 });
      g.rect(fx + 1, fy, 4, 3);
      g.fill({ color: 0x070b14 });

      g.rect(fx - 4, fy - 8, 3, 8);
      g.fill({ color: PANTS });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      g.rect(fx + 1, fy - 8, 3, 8);
      g.fill({ color: PANTS_DARK });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });

      g.rect(fx - 6, shoulderY + 3, 12, 10);
      g.fill({ color: COAT });
      g.stroke({ color: EDGE, alpha: 0.55, width: 0.75 });
      g.rect(fx - 7, shoulderY, 14, 4);
      g.fill({ color: COAT_DARK });
      g.stroke({ color: EDGE, alpha: 0.55, width: 0.75 });

      for (const dx of [-2, 2]) {
        for (let i = 0; i < 3; i += 1) {
          g.circle(fx + dx, fy - 19 + i * 3, 0.7);
          g.fill({ color: 0x0b101d, alpha: 0.95 });
        }
      }

      g.rect(fx - 6, fy - 12, 12, 2);
      g.fill({ color: APRON, alpha: 0.85 });

      const dir = facing === "se" || facing === "ne" ? 1 : -1;
      g.rect(fx + 5 * dir, fy - 18, 8 * dir, 2);
      g.fill({ color: COAT });
      g.circle(fx + 13 * dir, fy - 17, 2);
      g.fill({ color: SKIN });
      g.rect(fx + 13 * dir, fy - 18, 5 * dir, 0.8);
      g.stroke({ color: 0xa8b0c2, alpha: 0.9, width: 0.7 });

      g.rect(fx - 8 * dir, shoulderY + 4, 2, 8);
      g.fill({ color: COAT_DARK });
      g.circle(fx - 7 * dir, shoulderY + 13, 2);
      g.fill({ color: SKIN });

      g.rect(fx - 2, headTop + 9, 4, 2);
      g.fill({ color: SKIN });
      g.rect(fx - 4, headTop + 1, 8, 8);
      g.fill({ color: SKIN });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      g.rect(fx - 3, headTop, 6, 1);
      g.fill({ color: SKIN });

      const facingBack = facing === "ne" || facing === "nw";
      if (!facingBack) {
        g.rect(fx - 2, headTop + 4.5, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
        g.rect(fx + 1, headTop + 4.5, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
        g.rect(fx - 1, headTop + 7.5, 3, 0.8);
        g.fill({ color: 0x070b14, alpha: 0.75 });
      }

      g.rect(fx - 5, headTop - 2, 10, 3);
      g.fill({ color: TOQUE });
      g.stroke({ color: EDGE, alpha: 0.55, width: 0.7 });
      g.rect(fx - 4, headTop - 8, 8, 6);
      g.fill({ color: TOQUE });
      g.stroke({ color: EDGE, alpha: 0.5, width: 0.6 });
      g.ellipse(fx, headTop - 9, 7, 4);
      g.fill({ color: TOQUE });
      g.stroke({ color: EDGE, alpha: 0.45, width: 0.6 });
      for (const dx of [-2, 0, 2]) {
        g.rect(fx + dx, headTop - 7, 0.6, 4);
        g.fill({ color: 0xcfc9b8, alpha: 0.55 });
      }
    },
    [x, y, facing],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoGrill({ x, y, ember = "#F97316" }: { x: number; y: number; ember?: string }) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const base = iso(x + 0.5, y + 0.5, 0.6);
      const emberHex = hex(ember);

      for (const dx of [-14, 0, 14]) {
        g.moveTo(base.x + dx, base.y + 20);
        g.lineTo(base.x + dx * 0.4, base.y - 2);
        g.stroke({ color: 0x1f2937, alpha: 0.95, width: 1.8 });
      }

      g.ellipse(base.x, base.y - 4, 22, 8);
      g.fill({ color: 0x0b0f18, alpha: 0.98 });
      g.stroke({ color: 0x05080f, alpha: 0.92, width: 1.2 });

      for (const row of [-1, 0, 1]) {
        g.ellipse(base.x, base.y - 5 + row * 1.6, 17 - Math.abs(row) * 2, 0.6);
        g.stroke({ color: 0x6b7280, alpha: 0.85, width: 0.7 });
      }
      g.ellipse(base.x - 6, base.y - 5.5, 4, 1.4);
      g.fill({ color: 0x4a1d10, alpha: 0.95 });
      g.ellipse(base.x + 6, base.y - 4.8, 4.5, 1.6);
      g.fill({ color: 0x3a1808, alpha: 0.95 });

      g.rect(base.x - 16, base.y - 2.5, 32, 3.5);
      g.fill({ color: emberHex, alpha: 0.9 });
      g.stroke({ color: 0x4a0f00, alpha: 0.75, width: 0.8 });

      g.ellipse(base.x, base.y + 18, 30, 8);
      g.fill({ color: emberHex, alpha: 0.18 });
    },
    [x, y, ember],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoBbqSmoke({ x, y }: { x: number; y: number }) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const top = iso(x + 0.5, y + 0.5, 0.6);
      [0, 6, 14, 24].forEach((dy, i) => {
        g.circle(top.x + (i % 2 === 0 ? -2.5 : 2.5), top.y - 22 - dy, 4 - i * 0.6);
        g.fill({ color: 0xa8b0c2, alpha: 0.24 - i * 0.05 });
      });
    },
    [x, y],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoPrepCart({
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
        w={0.95}
        d={0.6}
        h={0.75}
        topColor="#3a2415"
        leftColor="#23170D"
        rightColor="#160E07"
      />
      <IsoBox
        x={x + 0.05}
        y={y + 0.06}
        z={0.75}
        w={0.85}
        d={0.48}
        h={0.04}
        topColor="#d6c19a"
        leftColor="#a88b66"
        rightColor="#7a6249"
      />
      <IsoBox
        x={x + 0.5}
        y={y + 0.12}
        z={0.79}
        w={0.32}
        d={0.32}
        h={0.03}
        topColor="#f7f3ea"
        leftColor="#cfcabb"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 0.1}
        y={y + 0.18}
        z={0.79}
        w={0.28}
        d={0.05}
        h={0.02}
        topColor={accent}
        leftColor="#7a4b12"
        rightColor="#4a2b08"
      />
    </pixiContainer>
  );
}

const ROCK_DARK = 0x2a1f12;
const ROCK_MID = 0x4a3520;
const ROCK_LIGHT = 0x7a5a36;
const ROCK_HIGHLIGHT = 0x96764a;
const SNOW = 0xf6f3eb;
const SNOW_SHADOW = 0xc9c5b8;

type Point = { x: number; y: number };

function drawPeak(
  g: Graphics,
  left: Point,
  right: Point,
  summit: Point,
  litColor: number,
  shadeColor: number,
  snowHeight: number,
) {
  const mid = { x: (left.x + right.x) / 2, y: left.y + (right.y - left.y) / 2 };
  g.poly([left.x, left.y, summit.x, summit.y, mid.x, mid.y]);
  g.fill({ color: litColor, alpha: 0.96 });
  g.poly([mid.x, mid.y, summit.x, summit.y, right.x, right.y]);
  g.fill({ color: shadeColor, alpha: 0.96 });

  const snowY = summit.y + snowHeight;
  const snowL = summit.x - snowHeight * 0.65;
  const snowR = summit.x + snowHeight * 0.65;
  g.poly([snowL, snowY, summit.x, summit.y, snowR, snowY]);
  g.fill({ color: SNOW, alpha: 0.95 });
  g.poly([summit.x, summit.y, snowR, snowY, summit.x, snowY + 0.6]);
  g.fill({ color: SNOW_SHADOW, alpha: 0.9 });

  g.moveTo(summit.x, summit.y);
  g.lineTo(mid.x, mid.y);
  g.stroke({ color: 0x000000, alpha: 0.32, width: 1 });
}

export function IsoMountainMassif({
  x,
  y,
  accent = "#F97316",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const accentColor = hex(accent);
      const floor = (tx: number, ty: number) => {
        const p = iso(tx, ty);
        return { x: p.x, y: p.y + TILE_H / 2 };
      };
      const lifted = (tx: number, ty: number, dy: number) => {
        const p = iso(tx, ty);
        return { x: p.x, y: p.y - dy };
      };

      drawPeak(
        g,
        floor(x - 0.4, y + 2.2),
        floor(x + 3.6, y + 2.0),
        lifted(x + 1.6, y + 0.5, 30),
        ROCK_MID,
        ROCK_DARK,
        10,
      );

      const mainBase = iso(x, y + 2.2);
      const mainSummit = iso(x + 1.5, y + 0.4);
      drawPeak(
        g,
        floor(x, y + 2.2),
        floor(x + 3.0, y + 2.2),
        lifted(x + 1.5, y + 0.4, 56),
        ROCK_LIGHT,
        ROCK_MID,
        16,
      );

      drawPeak(
        g,
        floor(x + 0.3, y + 2.3),
        floor(x + 2.2, y + 2.3),
        lifted(x + 1.2, y + 1.5, 26),
        ROCK_HIGHLIGHT,
        ROCK_MID,
        8,
      );

      const trail = [
        { x: mainBase.x + 24, y: mainBase.y + TILE_H / 2 - 8 },
        { x: mainBase.x + 48, y: mainBase.y + TILE_H / 2 - 22 },
        { x: mainSummit.x - 18, y: mainSummit.y - 36 },
        { x: mainSummit.x, y: mainSummit.y - 52 },
      ];
      trail.forEach((pt, i) => {
        g.circle(pt.x, pt.y, 1.6);
        g.fill({ color: accentColor, alpha: 0.45 + i * 0.12 });
      });

      const sx = mainSummit.x;
      const sy = mainSummit.y;
      g.moveTo(sx, sy - 56);
      g.lineTo(sx, sy - 66);
      g.stroke({ color: 0x0b101d, alpha: 0.95, width: 1.2 });
      g.poly([sx, sy - 66, sx + 8, sy - 63, sx, sy - 60]);
      g.fill({ color: accentColor, alpha: 0.95 });
      g.circle(sx, sy - 56, 4);
      g.stroke({ color: accentColor, alpha: 0.55, width: 1 });
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoChecklistBoard({
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
      for (let i = 0; i < 5; i += 1) {
        const p = iso(x + 0.2, y + 0.08, 1.6 - i * 0.22);
        g.rect(p.x - 4, p.y - 4, 5, 5);
        g.stroke({ color: 0x34d399, alpha: 0.9, width: 0.7 });
        g.moveTo(p.x - 3, p.y - 2);
        g.lineTo(p.x - 1.5, p.y);
        g.lineTo(p.x + 0.5, p.y - 3);
        g.stroke({ color: 0x34d399, alpha: 0.95, width: 1 });
        g.rect(p.x + 3, p.y - 3, 26 - i * 1.5, 1.2);
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
        z={0.6}
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

export function IsoTraceabilityBoard({
  x,
  y,
  accent = "#F97316",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      for (let i = 0; i < 7; i += 1) {
        const p = iso(x + 0.2, y + 0.08, 1.75 - i * 0.18);
        g.circle(p.x - 4, p.y, 1.4);
        g.fill({ color: colorHex, alpha: 0.95 });
        g.rect(p.x, p.y - 1.2, 32 - i, 1.2);
        g.fill({ color: 0xe6e2d4, alpha: 0.6 - i * 0.04 });
      }
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.6}
        w={1.8}
        d={0.06}
        h={1.7}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function MountainFlagFx({
  x,
  y,
  color = "#F97316",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(1.1, y * 0.2);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x, y, 1.55);
      const colorHex = hex(color);
      const wave = Math.sin(t * Math.PI * 2) * 2;
      g.moveTo(p.x, p.y);
      g.lineTo(p.x, p.y - 18);
      g.stroke({ color: 0xf7f3ea, alpha: 0.75, width: 1.4 });
      g.poly([p.x, p.y - 18, p.x + 15, p.y - 15 + wave, p.x, p.y - 11]);
      g.fill({ color: colorHex, alpha: isActive ? 0.92 : 0.64 });
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
