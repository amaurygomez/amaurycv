/**
 * Iconic scene props — code-generated. Each is designed to be visually
 * recognizable at iso scale ("that is a camera", "that is a police car")
 * without text labels. Built from polygons + fills, no asset deps.
 */
import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "../lib/iso";
import { IsoBox } from "./Furniture";

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoCamera — broadcast/studio camera on a tripod, lens facing south.

export function IsoCamera({ x, y, accent = "#E8B96B" }: { x: number; y: number; accent?: string }) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const accentHex = hex(accent);
      const center = iso(x + 0.5, y + 0.5);
      const cx = center.x;
      const cy = center.y + TILE_H / 2;
      // Tripod legs
      for (const dx of [-6, 0, 6]) {
        g.moveTo(cx + dx, cy);
        g.lineTo(cx, cy - 14);
        g.stroke({ color: 0x070b14, alpha: 0.85, width: 1.5 });
      }
      // Tripod head
      g.rect(cx - 7, cy - 18, 14, 4);
      g.fill({ color: 0x0b101d });
      // Camera body
      g.rect(cx - 9, cy - 28, 18, 10);
      g.fill({ color: 0x1a1f2e });
      g.rect(cx - 9, cy - 28, 18, 2);
      g.fill({ color: accentHex });
      // Lens (forward)
      g.circle(cx + 9, cy - 23, 4);
      g.fill({ color: 0x070b14 });
      g.circle(cx + 9, cy - 23, 2);
      g.fill({ color: accentHex, alpha: 0.6 });
      // Top mic
      g.rect(cx - 4, cy - 31, 8, 3);
      g.fill({ color: 0x070b14 });
      // Tally light
      g.circle(cx - 7, cy - 23, 1.5);
      g.fill({ color: 0xf87171 });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoMicrophone — boom mic on a tall stand.

export function IsoMicrophone({ x, y, color = "#E8B96B" }: { x: number; y: number; color?: string }) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      const center = iso(x + 0.5, y + 0.5);
      const cx = center.x;
      const cy = center.y + TILE_H / 2;
      // Stand
      g.moveTo(cx, cy);
      g.lineTo(cx, cy - 32);
      g.stroke({ color: 0x070b14, alpha: 0.9, width: 2 });
      // Base
      g.ellipse(cx, cy, 7, 2.5);
      g.fill({ color: 0x0b101d });
      // Boom arm
      g.moveTo(cx, cy - 30);
      g.lineTo(cx + 10, cy - 36);
      g.stroke({ color: 0x070b14, alpha: 0.9, width: 1.5 });
      // Mic head
      g.circle(cx + 11, cy - 37, 3.5);
      g.fill({ color: 0x0b101d });
      g.circle(cx + 11, cy - 37, 2);
      g.fill({ color: colorHex, alpha: 0.8 });
    },
    [x, y, color]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoRecSign — pulsing red REC sign mounted overhead.

export function IsoRecSign({ x, y }: { x: number; y: number }) {
  const [pulse, setPulse] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      setPulse((Math.sin((t * Math.PI * 2) / 0.8) + 1) / 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const center = iso(x + 0.5, y + 0.5, 2.4);
      const cx = center.x;
      const cy = center.y;
      // Plate
      g.rect(cx - 12, cy - 6, 24, 11);
      g.fill({ color: 0x0b101d });
      g.rect(cx - 12, cy - 6, 24, 11);
      g.stroke({ color: 0xf87171, alpha: 0.4 + pulse * 0.5, width: 1 });
      // Red dot
      g.circle(cx - 7, cy - 0.5, 2.5);
      g.fill({ color: 0xf87171, alpha: 0.5 + pulse * 0.5 });
      // "REC" letters as 3 small bars (suggestive)
      for (let i = 0; i < 3; i += 1) {
        g.rect(cx - 1 + i * 4, cy - 3, 3, 6);
        g.fill({ color: 0xf87171, alpha: 0.7 + pulse * 0.3 });
      }
    },
    [x, y, pulse]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoMapDR — stylized DR-shape mat on the floor with optional pins.

export function IsoMapDR({
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
      const baseHex = hex(base);
      const outlineHex = hex(outline);
      // Rough DR oval as iso diamond
      const tl = iso(x, y);
      const tr = iso(x + w, y);
      const br = iso(x + w, y + d);
      const bl = iso(x, y + d);
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
      g.fill({ color: baseHex, alpha: 0.55 });
      g.stroke({ color: outlineHex, alpha: 0.7, width: 1.5 });

      // Cordillera Central — a thin slash inside
      const ccA = iso(x + w * 0.2, y + d * 0.4);
      const ccB = iso(x + w * 0.7, y + d * 0.6);
      g.moveTo(ccA.x, ccA.y + TILE_H / 2);
      g.lineTo(ccB.x, ccB.y + TILE_H / 2);
      g.stroke({ color: outlineHex, alpha: 0.35, width: 1 });

      // Pins
      pins.forEach((p) => {
        const pp = iso(x + p.dx, y + p.dy);
        const px = pp.x;
        const py = pp.y + TILE_H / 2;
        g.moveTo(px, py);
        g.lineTo(px, py - 8);
        g.stroke({ color: 0x070b14, alpha: 0.85, width: 1.5 });
        g.circle(px, py - 8, 3);
        g.fill({ color: hex(p.color), alpha: 1 });
        g.circle(px, py - 8, 6);
        g.stroke({ color: hex(p.color), alpha: 0.5, width: 1 });
      });
    },
    [x, y, w, d, base, outline, pins]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoCellTower — telco antenna with pulsing signal arcs.

export function IsoCellTower({ x, y, accent = "#5EEAD4" }: { x: number; y: number; accent?: string }) {
  const [pulse, setPulse] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      setPulse((Math.sin(t * 1.8 + x * 0.3) + 1) / 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, x]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const accentHex = hex(accent);
      const base = iso(x + 0.5, y + 0.5);
      const cx = base.x;
      const cy = base.y + TILE_H / 2;
      // Tower (4 legs converging)
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
      // Top antenna
      g.rect(cx - 1, topY - 8, 2, 8);
      g.fill({ color: accentHex });
      // Cross beams
      for (let i = 0; i < 3; i += 1) {
        const beamY = cy - 8 - i * 8;
        g.moveTo(cx - 5 + i * 1.2, beamY);
        g.lineTo(cx + 5 - i * 1.2, beamY);
        g.stroke({ color: 0x9aa3b8, alpha: 0.55, width: 1 });
      }
      // Signal arcs
      for (let i = 0; i < 3; i += 1) {
        const r = 8 + i * 6 + pulse * 4;
        g.arc(cx, topY, r, Math.PI * 0.85, Math.PI * 0.15, false);
        g.stroke({ color: accentHex, alpha: 0.45 - i * 0.1, width: 1.2 });
      }
    },
    [x, y, accent, pulse]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoPoliceCar — small isometric cruiser, blue stripe + roof lights.

export function IsoPoliceCar({ x, y, facing = "se" }: { x: number; y: number; facing?: "se" | "sw" }) {
  return (
    <pixiContainer>
      {/* Body */}
      <IsoBox
        x={x}
        y={y}
        w={1.8}
        d={0.9}
        h={0.5}
        topColor="#F7F3EA"
        leftColor={facing === "se" ? "#1f2937" : "#0F1524"}
        rightColor="#0B101D"
      />
      {/* Blue stripe */}
      <IsoBox
        x={x}
        y={y + 0.55}
        z={0.18}
        w={1.8}
        d={0.06}
        h={0.18}
        topColor="#3B82F6"
        leftColor="#3B82F6"
        rightColor="#1E3A8A"
      />
      {/* Roof / cabin */}
      <IsoBox
        x={x + 0.4}
        y={y + 0.18}
        z={0.5}
        w={1}
        d={0.55}
        h={0.35}
        topColor="#F7F3EA"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      {/* Light bar */}
      <IsoBox
        x={x + 0.5}
        y={y + 0.3}
        z={0.85}
        w={0.8}
        d={0.25}
        h={0.08}
        topColor="#070B14"
        leftColor="#3B82F6"
        rightColor="#F87171"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoCar — generic civilian car (small).

export function IsoCar({
  x,
  y,
  color = "#5EEAD4",
}: {
  x: number;
  y: number;
  color?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1.6}
        d={0.8}
        h={0.45}
        topColor={color}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.35}
        y={y + 0.15}
        z={0.45}
        w={0.9}
        d={0.5}
        h={0.3}
        topColor={color}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoHouseMini — tiny isometric building (loan symbol).

export function IsoHouseMini({
  x,
  y,
  wall = "#E8B96B",
  roof = "#B85C38",
}: {
  x: number;
  y: number;
  wall?: string;
  roof?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1}
        d={1}
        h={0.9}
        topColor={wall}
        leftColor={wall}
        rightColor="#0F1524"
      />
      <IsoBox
        x={x - 0.05}
        y={y - 0.05}
        z={0.9}
        w={1.1}
        d={1.1}
        h={0.4}
        topColor={roof}
        leftColor={roof}
        rightColor="#3a1c10"
      />
      {/* Door */}
      <IsoBox
        x={x + 0.35}
        y={y + 0.95}
        w={0.3}
        d={0.05}
        h={0.5}
        topColor="#070B14"
        leftColor="#070B14"
        rightColor="#070B14"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoBankCounter — banker's desk with a glass shield + small cash stack.

export function IsoBankCounter({
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
      {/* Counter base */}
      <IsoBox
        x={x}
        y={y}
        w={2}
        d={0.8}
        h={0.95}
        topColor="#1A1F2E"
        leftColor={accent}
        rightColor="#0B101D"
      />
      {/* Glass divider */}
      <IsoBox
        x={x}
        y={y + 0.4}
        z={0.95}
        w={2}
        d={0.05}
        h={0.55}
        topColor="#5EEAD4"
        leftColor="#5EEAD4"
        rightColor="#0F1524"
      />
      {/* Cash stack on counter */}
      <IsoBox
        x={x + 0.4}
        y={y + 0.15}
        z={0.95}
        w={0.35}
        d={0.18}
        h={0.1}
        topColor="#34D399"
        leftColor="#0c3a2a"
        rightColor="#08251b"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoLotteryBoard — wall-mounted board with 6 winning-number cells lit up.

export function IsoLotteryBoard({
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
      const accentHex = hex(accent);
      // 6 little number cells across the front
      const baseZ = 1.5;
      for (let i = 0; i < 6; i += 1) {
        const p = iso(x + 0.2 + i * 0.27, y + 0.04, baseZ);
        g.rect(p.x - 4, p.y - 12, 9, 12);
        g.fill({ color: 0x070b14 });
        g.rect(p.x - 4, p.y - 12, 9, 2);
        g.fill({ color: accentHex });
        // "number" represented as small bars
        g.rect(p.x - 2, p.y - 8, 5, 1);
        g.fill({ color: accentHex, alpha: 0.9 });
        g.rect(p.x - 2, p.y - 5, 5, 1);
        g.fill({ color: accentHex, alpha: 0.9 });
        g.rect(p.x - 2, p.y - 2, 5, 1);
        g.fill({ color: accentHex, alpha: 0.9 });
      }
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      {/* Board backing */}
      <IsoBox
        x={x}
        y={y}
        w={2.4}
        d={0.06}
        h={1.7}
        topColor="#0F1524"
        leftColor="#0B101D"
        rightColor="#070B14"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoPosTerminal — small POS device on a low pedestal.

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
      {/* Screen */}
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
      {/* Keypad area */}
      <IsoBox
        x={x + 0.05}
        y={y + 0.05}
        z={0.55}
        w={0.6}
        d={0.1}
        h={0.05}
        topColor="#0F1524"
        leftColor="#070B14"
        rightColor="#070B14"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoPresentationScreen — wide wall-mounted screen with mock chart bars
// Generic executive-level dashboard.

export function IsoPresentationScreen({
  x,
  y,
  w = 3,
  z = 1.2,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  w?: number;
  z?: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const accentHex = hex(accent);
      // Bars suggesting stats
      const barCount = 7;
      const step = w / barCount;
      for (let i = 0; i < barCount; i += 1) {
        const h = 8 + (i % 3) * 5 + ((i * 37) % 9);
        const p = iso(x + 0.05 + i * step, y + 0.08, z + 0.1);
        g.rect(p.x, p.y - h, 5, h);
        g.fill({ color: accentHex, alpha: 0.75 });
      }
      // Trend line (top-right)
      const lineA = iso(x + 0.15, y + 0.08, z + 0.8);
      const lineB = iso(x + w * 0.85, y + 0.08, z + 0.6);
      g.moveTo(lineA.x, lineA.y);
      g.lineTo(lineB.x, lineB.y);
      g.stroke({ color: 0xe8b96b, alpha: 0.85, width: 1.5 });
    },
    [x, y, w, z, accent]
  );
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={z}
        w={w}
        d={0.06}
        h={1.1}
        topColor="#070B14"
        leftColor="#0F1524"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoSmartphone — small smartphone held up in mobile/transactional scenes.

export function IsoSmartphone({
  x,
  y,
  z = 0.9,
  screenColor = "#5EEAD4",
}: {
  x: number;
  y: number;
  z?: number;
  screenColor?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const c = iso(x + 0.5, y + 0.5, z);
      const cx = c.x;
      const cy = c.y;
      g.rect(cx - 3, cy - 8, 6, 11);
      g.fill({ color: 0x0b101d });
      g.rect(cx - 2.5, cy - 7, 5, 8);
      g.fill({ color: hex(screenColor), alpha: 0.85 });
    },
    [x, y, z, screenColor]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoIslandBase — soft platform/carpet for a populated island scene.

export function IsoIslandBase({
  x,
  y,
  w,
  d,
  color,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  color: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      const tl = iso(x, y);
      const tr = iso(x + w, y);
      const br = iso(x + w, y + d);
      const bl = iso(x, y + d);
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
      g.fill({ color: colorHex, alpha: 0.18 });
      g.stroke({ color: colorHex, alpha: 0.55, width: 1.5 });
    },
    [x, y, w, d, color]
  );
  return <pixiGraphics draw={draw} />;
}
