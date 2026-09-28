import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso } from "@/world/lib/iso";
import { useMotionTime } from "@/world/render/fx/useMotionTime";
import { IsoBox } from "@/world/render/primitives/IsoBox";
import { IsoCounter } from "@/world/render/primitives/IsoCounter";
import { INK, hex } from "@/world/render/utils";

export function IsoPosHero({
  x,
  y,
  screen = "#5EEAD4",
}: {
  x: number;
  y: number;
  screen?: string;
}) {
  const drawScreen = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(screen);
      const p = iso(x + 0.55, y + 0.5, 1.1);
      for (let i = 0; i < 3; i += 1) {
        g.rect(p.x - 9, p.y - 16 + i * 6, 18, 1.4);
        g.fill({ color: colorHex, alpha: 0.45 });
      }
      g.circle(p.x + 8, p.y - 20, 4);
      g.fill({ color: 0x34d399, alpha: 0.95 });
    },
    [x, y, screen],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1.1}
        d={1.0}
        h={0.72}
        topColor="#1A1F2E"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.08}
        y={y + 0.18}
        z={0.72}
        w={0.95}
        d={0.6}
        h={0.42}
        topColor={screen}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.08}
        y={y + 0.05}
        z={0.72}
        w={0.95}
        d={0.14}
        h={0.08}
        topColor="#0F1524"
        leftColor={INK}
        rightColor={INK}
      />
      <pixiGraphics draw={drawScreen} />
    </pixiContainer>
  );
}

export function IsoPosTerminal({
  x,
  y,
  screenColor = "#5EEAD4",
}: {
  x: number;
  y: number;
  screenColor?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={0.7}
        d={0.7}
        h={0.55}
        topColor="#1A1F2E"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.05}
        y={y + 0.15}
        z={0.55}
        w={0.6}
        d={0.4}
        h={0.25}
        topColor={screenColor}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.05}
        y={y + 0.05}
        z={0.55}
        w={0.6}
        d={0.1}
        h={0.05}
        topColor="#0F1524"
        leftColor={INK}
        rightColor={INK}
      />
    </pixiContainer>
  );
}

export function IsoPosArea({ x, y }: { x: number; y: number }) {
  return <IsoCounter x={x} y={y} w={2.8} d={1.1} topColor="#2A2147" faceColor="#151023" />;
}

export function IsoReceiptStack({ x, y }: { x: number; y: number }) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={0.45}
        d={0.32}
        h={0.06}
        topColor="#f6f1e6"
        leftColor="#cfc9b8"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 0.02}
        y={y + 0.02}
        z={0.06}
        w={0.42}
        d={0.3}
        h={0.04}
        topColor="#f6f1e6"
        leftColor="#cfc9b8"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 0.08}
        y={y + 0.06}
        z={0.1}
        w={0.28}
        d={0.06}
        h={0.02}
        topColor="#34D399"
        leftColor="#0c3a2a"
        rightColor="#08251b"
      />
    </pixiContainer>
  );
}

export function IsoLotteryKiosk({
  x,
  y,
  accent = "#FBBF24",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const drawAwning = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const p = iso(x + 1.0, y + 1.2, 1.05);
      for (let i = 0; i < 8; i += 1) {
        const px = p.x - 26 + i * 8;
        g.poly([px - 3, p.y, px, p.y + 4, px + 3, p.y]);
        g.fill({ color: i % 2 === 0 ? colorHex : 0xf6f1e6, alpha: 0.92 });
      }
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={2.0}
        d={1.2}
        h={1.05}
        topColor="#4a3520"
        leftColor="#23170D"
        rightColor="#160E07"
      />
      <IsoBox
        x={x - 0.1}
        y={y + 1.1}
        z={1.05}
        w={2.2}
        d={0.18}
        h={0.06}
        topColor={accent}
        leftColor="#7a4b12"
        rightColor="#4a2b08"
      />
      <IsoBox
        x={x + 0.2}
        y={y + 1.18}
        z={0.45}
        w={1.6}
        d={0.05}
        h={0.5}
        topColor={INK}
        leftColor={accent}
        rightColor="#0F1524"
        outline={false}
      />
      <IsoBox
        x={x + 0.04}
        y={y + 0.04}
        z={1.05}
        w={0.16}
        d={0.16}
        h={0.95}
        topColor="#5a6478"
        leftColor="#3a4254"
        rightColor="#23272f"
      />
      <IsoBox
        x={x - 0.06}
        y={y - 0.04}
        z={1.7}
        w={0.7}
        d={0.32}
        h={0.42}
        topColor="#0b101d"
        leftColor={accent}
        rightColor="#7a4b12"
      />
      <pixiGraphics draw={drawAwning} />
    </pixiContainer>
  );
}

export function IsoTicketBoard({
  x,
  y,
  accent = "#FBBF24",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      for (let r = 0; r < 3; r += 1) {
        for (let c = 0; c < 3; c += 1) {
          const p = iso(x + 0.2 + c * 0.42, y + 0.08, 1.55 - r * 0.35);
          g.rect(p.x - 6, p.y - 8, 11, 8);
          g.fill({ color: 0x05080f, alpha: 0.92 });
          g.rect(p.x - 4, p.y - 6, 7, 1.4);
          g.fill({ color: colorHex, alpha: 0.85 });
          g.rect(p.x - 4, p.y - 3, 5, 1.2);
          g.fill({ color: colorHex, alpha: 0.65 });
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
        z={0.7}
        w={1.6}
        d={0.06}
        h={1.35}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function IsoLegacySystemCard({
  x,
  y,
  accent = "#A78BFA",
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
        w={1.0}
        d={0.7}
        h={0.85}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      {[0.18, 0.4, 0.62].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.08}
          y={y + 0.65}
          z={z}
          w={0.84}
          d={0.05}
          h={0.12}
          topColor={INK}
          leftColor={accent}
          rightColor="#0b101d"
        />
      ))}
    </pixiContainer>
  );
}

export function PosPulseFx({
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
  const t = useMotionTime(1.8, x * 0.2);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.0);
      const pulse = 0.4 + Math.abs(Math.sin(t * Math.PI * 2)) * 0.5;
      const colorHex = hex(color);
      g.circle(p.x, p.y, 4 + pulse * 3);
      g.fill({ color: colorHex, alpha: isActive ? 0.72 : 0.42 });
      g.circle(p.x, p.y, 10 + pulse * 4);
      g.stroke({ color: colorHex, alpha: isActive ? 0.3 : 0.16, width: 1 });
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
