import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { useReducedMotion } from "motion/react";
import { iso, TILE_H } from "@/world/lib/iso";
import { useMotionTime } from "@/world/render/fx/useMotionTime";
import { IsoBox } from "@/world/render/primitives/IsoBox";
import { IsoCounter } from "@/world/render/primitives/IsoCounter";
import { INK, hex } from "@/world/render/utils";

const ARCHITECTURE_NODES = [
  { label: "n8n", dx: -42, dy: 6 },
  { label: "LiteLLM", dx: -16, dy: -4 },
  { label: "Qdrant", dx: 14, dy: 6 },
  { label: "Langfuse", dx: 40, dy: -4 },
];

export function IsoArchitectureBoard({
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
      const nodeColors = [0x34d399, 0xe8b96b, hex(accent), 0xa78bfa];
      const p = iso(x + 1.4, y + 0.05, 1.7);

      for (let i = 0; i < ARCHITECTURE_NODES.length - 1; i += 1) {
        const a = ARCHITECTURE_NODES[i];
        const b = ARCHITECTURE_NODES[i + 1];
        g.moveTo(p.x + a.dx + 7, p.y + a.dy);
        g.lineTo(p.x + b.dx - 7, p.y + b.dy);
        g.stroke({ color: 0xa8b0c2, alpha: 0.6, width: 1 });
        g.poly([
          p.x + b.dx - 7,
          p.y + b.dy,
          p.x + b.dx - 11,
          p.y + b.dy - 2,
          p.x + b.dx - 11,
          p.y + b.dy + 2,
        ]);
        g.fill({ color: 0xa8b0c2, alpha: 0.85 });
      }
      ARCHITECTURE_NODES.forEach((node, i) => {
        g.rect(p.x + node.dx - 9, p.y + node.dy - 6, 18, 12);
        g.fill({ color: 0x05080f, alpha: 0.92 });
        g.stroke({ color: nodeColors[i], alpha: 0.85, width: 1 });
        g.circle(p.x + node.dx - 4, p.y + node.dy, 1.6);
        g.fill({ color: nodeColors[i], alpha: 0.95 });
      });
    },
    [x, y, accent],
  );

  const p = iso(x + 1.4, y + 0.05, 1.7);
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.5}
        w={3.0}
        d={0.08}
        h={1.8}
        topColor="#1A1F2E"
        leftColor={INK}
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
      {ARCHITECTURE_NODES.map((node) => (
        <pixiText
          key={node.label}
          text={node.label}
          x={p.x + node.dx}
          y={p.y + node.dy + 9}
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
      ))}
    </pixiContainer>
  );
}

export function IsoOpsRack({
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
      const ledColors = [hex(accent), 0x34d399, 0xe8b96b];
      for (let row = 0; row < 7; row += 1) {
        const p = iso(x + 0.14, y + 0.18, 2.85 - row * 0.35);
        g.rect(p.x - 8, p.y - 2, 26, 3.5);
        g.fill({ color: 0x05080f, alpha: 0.96 });
        g.stroke({ color: 0x1a2238, alpha: 0.9, width: 0.4 });
        for (let i = 0; i < 4; i += 1) {
          g.circle(p.x - 5 + i * 5, p.y - 0.5, 1.1);
          g.fill({ color: ledColors[(row + i) % 3], alpha: 0.95 });
        }
      }
      const bp = iso(x + 0.5, y + 0.6, 0.1);
      for (let i = 0; i < 4; i += 1) {
        g.moveTo(bp.x - 8 + i * 4, bp.y);
        g.bezierCurveTo(
          bp.x - 4 + i * 4,
          bp.y + 6,
          bp.x + 4 - i * 2,
          bp.y + 10,
          bp.x + 8,
          bp.y + 12,
        );
        g.stroke({ color: i % 2 === 0 ? 0x1f2937 : 0x4a3520, alpha: 0.85, width: 1.2 });
      }
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1.3}
        d={1.4}
        h={3.0}
        topColor="#1A2238"
        leftColor="#0B101D"
        rightColor={INK}
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function IsoOpsDesk({
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
      <IsoCounter x={x} y={y} w={2.0} d={1.0} topColor="#1A2238" faceColor="#0F1524" />
      <IsoBox
        x={x + 0.18}
        y={y + 0.2}
        z={0.9}
        w={0.85}
        d={0.12}
        h={0.65}
        topColor={INK}
        leftColor={accent}
        rightColor="#0F1524"
      />
      <IsoBox
        x={x + 0.45}
        y={y + 0.35}
        z={0.9}
        w={0.25}
        d={0.25}
        h={0.1}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 1.2}
        y={y + 0.25}
        z={0.9}
        w={0.6}
        d={0.1}
        h={0.5}
        topColor={INK}
        leftColor="#34d399"
        rightColor="#0F1524"
      />
      <IsoBox
        x={x + 0.4}
        y={y + 0.65}
        z={0.9}
        w={0.9}
        d={0.22}
        h={0.04}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.65}
        y={y + 1.15}
        z={0}
        w={0.55}
        d={0.55}
        h={0.45}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.65}
        y={y + 1.6}
        z={0}
        w={0.55}
        d={0.08}
        h={1.0}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
    </pixiContainer>
  );
}

export function IsoQdrantCylinder({
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
      const p = iso(x + 0.45, y + 0.45, 1.0);
      const color = hex(accent);
      g.ellipse(p.x, p.y - 16, 18, 6);
      g.fill({ color: 0x0b101d, alpha: 0.95 });
      g.stroke({ color, alpha: 0.85, width: 1 });
      g.rect(p.x - 18, p.y - 16, 36, 28);
      g.fill({ color: 0x102026, alpha: 0.93 });
      g.ellipse(p.x, p.y + 12, 18, 6);
      g.fill({ color: 0x102026, alpha: 0.96 });
      g.stroke({ color, alpha: 0.7, width: 1 });
      for (let i = 0; i < 4; i += 1) {
        g.ellipse(p.x, p.y - 8 + i * 7, 16, 3);
        g.stroke({ color, alpha: 0.35, width: 0.7 });
      }
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoN8nNodes({
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
      const pts = [
        iso(x, y, 0.1),
        iso(x + 0.6, y + 0.1, 0.1),
        iso(x + 1.2, y + 0.5, 0.1),
        iso(x + 1.8, y + 0.05, 0.1),
      ].map((p) => ({ x: p.x, y: p.y + TILE_H / 2 }));
      for (let i = 0; i < pts.length - 1; i += 1) {
        g.moveTo(pts[i].x, pts[i].y);
        g.lineTo(pts[i + 1].x, pts[i + 1].y);
        g.stroke({ color: colorHex, alpha: 0.55, width: 1.2 });
      }
      pts.forEach((p, i) => {
        g.circle(p.x, p.y, 5);
        g.fill({ color: 0x05080f, alpha: 0.95 });
        g.stroke({ color: colorHex, alpha: 0.85, width: 1 });
        g.circle(p.x, p.y, 2);
        g.fill({ color: i === pts.length - 1 ? 0xe8b96b : colorHex, alpha: 0.95 });
      });
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoHumanApprovalGate({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const drawSignal = useCallback(
    (g: Graphics) => {
      g.clear();
      const green = hex(accent);
      const top = iso(x + 0.7, y - 0.1, 1.85);
      g.circle(top.x, top.y, 14);
      g.fill({ color: green, alpha: 0.18 });
      g.circle(top.x, top.y, 8);
      g.fill({ color: green, alpha: 0.95 });
      g.circle(top.x, top.y, 10);
      g.stroke({ color: green, alpha: 0.55, width: 1.5 });
      g.moveTo(top.x - 4, top.y);
      g.lineTo(top.x - 1, top.y + 3);
      g.lineTo(top.x + 5, top.y - 4);
      g.stroke({ color: 0x0b101d, alpha: 0.95, width: 2 });
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={0.15}
        d={0.15}
        h={1.7}
        topColor="#0B101D"
        leftColor={accent}
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 1.25}
        y={y}
        w={0.15}
        d={0.15}
        h={1.7}
        topColor="#0B101D"
        leftColor={accent}
        rightColor="#0B101D"
      />
      <IsoBox
        x={x}
        y={y}
        z={1.7}
        w={1.4}
        d={0.15}
        h={0.2}
        topColor={accent}
        leftColor="#0c3a2a"
        rightColor="#08251b"
      />
      <pixiGraphics draw={drawSignal} />
    </pixiContainer>
  );
}

export function IsoLangfusePanel({
  x,
  y,
  accent = "#A78BFA",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const p = iso(x + 0.6, y + 0.08, 1.2);
      g.rect(p.x - 20, p.y - 14, 40, 24);
      g.fill({ color: 0x05080f, alpha: 0.94 });
      g.stroke({ color: colorHex, alpha: 0.7, width: 0.9 });
      g.rect(p.x - 20, p.y - 14, 40, 4);
      g.fill({ color: 0x0e1620, alpha: 0.95 });
      [0.5, 0.7, 0.6, 0.9, 0.8].forEach((h, i) => {
        const bh = 12 * h;
        g.rect(p.x - 16 + i * 7, p.y + 6 - bh, 4, bh);
        g.fill({ color: colorHex, alpha: 0.85 });
      });
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.8}
        w={1.2}
        d={0.05}
        h={0.6}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function IsoRouterChip({
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
        w={0.9}
        d={0.6}
        h={0.2}
        topColor={accent}
        leftColor="#3a2d12"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.12}
        y={y + 0.12}
        z={0.2}
        w={0.65}
        d={0.08}
        h={0.06}
        topColor="#0B1020"
        leftColor="#0B1020"
        rightColor="#0B1020"
      />
      {[0.1, 0.3, 0.5, 0.7].map((dx) => (
        <IsoBox
          key={dx}
          x={x + dx}
          y={y + 0.62}
          z={0.05}
          w={0.05}
          d={0.04}
          h={0.04}
          topColor="#cfc9b8"
          leftColor="#a8a395"
          rightColor="#7a7156"
        />
      ))}
    </pixiContainer>
  );
}

export function IsoGpuWorkstation({
  x,
  y,
  accent = "#34D399",
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
        w={1.2}
        d={0.85}
        h={0.85}
        topColor="#1A2238"
        leftColor="#0B101D"
        rightColor={INK}
      />
      <IsoBox
        x={x + 0.15}
        y={y + 0.78}
        z={0.25}
        w={0.95}
        d={0.06}
        h={0.42}
        topColor={INK}
        leftColor={accent}
        rightColor="#0b101d"
        outline={false}
      />
      {[0.15, 0.45, 0.75].map((dx) => (
        <IsoBox
          key={dx}
          x={x + dx}
          y={y + 0.15}
          z={0.85}
          w={0.08}
          d={0.06}
          h={0.05}
          topColor={accent}
          leftColor={accent}
          rightColor={accent}
        />
      ))}
    </pixiContainer>
  );
}

const LED_COLORS = [0x34d399, 0xe8b96b, 0x5eead4, 0x34d399, 0xfbbf24];

export function ServerLedPulse({ x, y, isActive }: { x: number; y: number; isActive: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isActive || reduced) return;
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % LED_COLORS.length);
    }, 200);
    return () => clearInterval(id);
  }, [isActive, reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      LED_COLORS.forEach((color, i) => {
        const p = iso(x, y, 2.2 - i * 0.4);
        const bright = i === activeIdx;
        g.rect(p.x - 5, p.y - 2, 5, 5);
        g.fill({ color, alpha: bright ? 1 : 0.25 });
        if (bright) {
          g.rect(p.x - 8, p.y - 5, 11, 11);
          g.fill({ color, alpha: 0.2 });
        }
      });
    },
    [x, y, activeIdx],
  );

  if (!isActive) return null;
  return <pixiGraphics draw={draw} />;
}

export function DataOrbitFx({
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
  const t = useMotionTime(1, x * 0.21);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.25);
      const colorHex = hex(color);
      g.ellipse(p.x, p.y, 26, 11);
      g.stroke({ color: colorHex, alpha: isActive ? 0.34 : 0.2, width: 1 });
      for (let i = 0; i < 3; i += 1) {
        const a = t * 2 + i * ((Math.PI * 2) / 3);
        g.circle(p.x + Math.cos(a) * 26, p.y + Math.sin(a) * 11, 3);
        g.fill({ color: colorHex, alpha: isActive ? 0.9 : 0.55 });
      }
    },
    [x, y, color, isActive, t],
  );

  return <pixiGraphics draw={draw} />;
}
