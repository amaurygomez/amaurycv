/**
 * Iso furniture primitives — code-generated Pixi components.
 *
 * Stage 1: every piece drawn from polygons + fills (legal, zero asset deps).
 * Stage 2: each primitive can be swapped to a textured sprite without
 * changing scene composition (same x/y/z grid coords).
 *
 * Coordinate convention: every primitive takes (x, y) iso tile coords.
 * Optional z lifts the object off the floor.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "../lib/iso";

// Lego-style black edge outline — applies to most solid objects.
const STROKE_EDGE = 0x050810;
const STROKE_ALPHA = 0.65;
const STROKE_WIDTH = 1;

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoBox — basic raised cuboid (server rack, vault, podium, etc.)

export interface IsoBoxProps {
  x: number;
  y: number;
  z?: number;
  /** Width in tiles. */
  w?: number;
  /** Depth in tiles. */
  d?: number;
  /** Height in tile-heights (1 = TILE_H). */
  h?: number;
  topColor: string;
  leftColor: string;
  rightColor: string;
  outline?: boolean;
}

export function IsoBox({
  x,
  y,
  z = 0,
  w = 1,
  d = 1,
  h = 1,
  topColor,
  leftColor,
  rightColor,
  outline = true,
}: IsoBoxProps) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const top = iso(x, y, z + h);
      const topR = iso(x + w, y, z + h);
      const topB = iso(x + w, y + d, z + h);
      const topL = iso(x, y + d, z + h);
      const botR = iso(x + w, y, z);
      const botB = iso(x + w, y + d, z);
      const botL = iso(x, y + d, z);

      // Drop shadow on the floor — only for lifted, free-standing objects.
      // Tight, soft, offset slightly to the south-east, fades out fast.
      if (h >= 0.35 && z === 0) {
        const sFL = iso(x + 0.06, y + 0.06);
        const sFR = iso(x + w - 0.06, y + 0.06);
        const sBR = iso(x + w - 0.06, y + d - 0.06);
        const sBL = iso(x + 0.06, y + d - 0.06);
        g.poly([
          sFL.x,
          sFL.y + TILE_H / 2,
          sFR.x,
          sFR.y + TILE_H / 2,
          sBR.x,
          sBR.y + TILE_H / 2,
          sBL.x,
          sBL.y + TILE_H / 2,
        ]);
        g.fill({ color: 0x000000, alpha: 0.32 });
      }

      // top face — brightest
      g.poly([
        top.x,
        top.y,
        topR.x,
        topR.y,
        topB.x,
        topB.y,
        topL.x,
        topL.y,
      ]);
      g.fill({ color: hex(topColor) });
      if (outline)
        g.stroke({ color: STROKE_EDGE, alpha: STROKE_ALPHA, width: STROKE_WIDTH });

      // right face — medium (catches less light from upper-left)
      g.poly([
        topR.x,
        topR.y,
        topB.x,
        topB.y,
        botB.x,
        botB.y,
        botR.x,
        botR.y,
      ]);
      g.fill({ color: hex(rightColor) });
      if (outline)
        g.stroke({ color: STROKE_EDGE, alpha: STROKE_ALPHA, width: STROKE_WIDTH });

      // left face — darkest
      g.poly([
        topL.x,
        topL.y,
        topB.x,
        topB.y,
        botB.x,
        botB.y,
        botL.x,
        botL.y,
      ]);
      g.fill({ color: hex(leftColor) });
      if (outline)
        g.stroke({ color: STROKE_EDGE, alpha: STROKE_ALPHA, width: STROKE_WIDTH });
    },
    [x, y, z, w, d, h, topColor, leftColor, rightColor, outline]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoPodium — short raised platform with a colored top (info pillar, podium)

export function IsoPodium({
  x,
  y,
  color = "#1A2238",
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  color?: string;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} w={1} d={1} h={0.4} topColor={accent} leftColor={color} rightColor="#0B101D" />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoServerRack — tall dark cabinet with green status LEDs

export function IsoServerRack({ x, y }: { x: number; y: number }) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      // LEDs (small squares on the front face)
      const baseHeight = 2.4;
      for (let row = 0; row < 5; row += 1) {
        const ledZ = baseHeight - 0.2 - row * 0.4;
        const pTL = iso(x, y, ledZ);
        const pBR = iso(x + 0.05, y + 0.4, ledZ - 0.08);
        g.rect(pTL.x - 6, pTL.y - 2, 5, 5);
        g.fill({ color: row % 2 ? 0x34d399 : 0xe8b96b, alpha: 0.9 });
        // suppress unused
        void pBR;
      }
    },
    [x, y]
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
        rightColor="#070B14"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoMonitor — desk + monitor unit (one cell footprint, vertical screen)

export function IsoMonitor({
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
      {/* desk */}
      <IsoBox
        x={x}
        y={y}
        w={1.4}
        d={0.9}
        h={0.7}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      {/* monitor base */}
      <IsoBox
        x={x + 0.5}
        y={y + 0.3}
        z={0.7}
        w={0.35}
        d={0.35}
        h={0.15}
        topColor="#070B14"
        leftColor="#070B14"
        rightColor="#070B14"
      />
      {/* monitor screen */}
      <IsoBox
        x={x + 0.35}
        y={y + 0.3}
        z={0.85}
        w={0.7}
        d={0.1}
        h={0.85}
        topColor="#070B14"
        leftColor={screenColor}
        rightColor="#0F1524"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoCounter — long reception/desk counter (2-3 tiles wide)

export function IsoCounter({
  x,
  y,
  w = 3,
  d = 1,
  topColor = "#1A2238",
  faceColor = "#0F1524",
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  topColor?: string;
  faceColor?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={w}
        d={d}
        h={0.9}
        topColor={topColor}
        leftColor={faceColor}
        rightColor="#0B101D"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoPlant — small decorative planter (1 tile)

export function IsoPlant({ x, y }: { x: number; y: number }) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const c = iso(x + 0.5, y + 0.5, 0.45);
      // leaves (radial blobs)
      const leaves = [
        { dx: 0, dy: -6, r: 8, color: 0x34d399 },
        { dx: -8, dy: -2, r: 7, color: 0x22c55e },
        { dx: 8, dy: -2, r: 7, color: 0x16a34a },
        { dx: -3, dy: -12, r: 6, color: 0x5eead4 },
      ];
      leaves.forEach((l) => {
        g.circle(c.x + l.dx, c.y + l.dy, l.r);
        g.fill({ color: l.color, alpha: 0.85 });
      });
    },
    [x, y]
  );
  return (
    <pixiContainer>
      <IsoBox
        x={x + 0.25}
        y={y + 0.25}
        w={0.5}
        d={0.5}
        h={0.45}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoCarpet — colored floor area (no height) for highlighting zones

export function IsoCarpet({
  x,
  y,
  w = 2,
  d = 2,
  color = "#5EEAD4",
  alpha = 0.18,
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  color?: string;
  alpha?: number;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
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
      g.fill({ color: hex(color), alpha });
      g.stroke({ color: hex(color), alpha: alpha * 2, width: 1 });
    },
    [x, y, w, d, color, alpha]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoWall — wall segment along the north or west edge of a tile

export function IsoWall({
  x,
  y,
  side = "north",
  length = 1,
  height = 2,
  color = "#0F1524",
}: {
  x: number;
  y: number;
  side?: "north" | "west";
  length?: number;
  height?: number;
  color?: string;
}) {
  if (side === "north") {
    return (
      <IsoBox
        x={x}
        y={y}
        w={length}
        d={0.1}
        h={height}
        topColor="#0B101D"
        leftColor={color}
        rightColor="#070B14"
      />
    );
  }
  return (
    <IsoBox
      x={x}
      y={y}
      w={0.1}
      d={length}
      h={height}
      topColor="#0B101D"
      leftColor="#070B14"
      rightColor={color}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoBookshelf — tall narrow shelf with colored book bands

const BOOK_PALETTE = [
  0x7a3e18, 0x9d4f22, 0xb85c38, 0xc16a1f, 0x1f4f7a, 0x2e6da4, 0x5a8fbb, 0x60a5fa,
  0x2c6e4c, 0x34d399, 0x5eead4, 0xa7e6d6, 0xa66a2a, 0xc18643, 0xe8b96b, 0xfbbf24,
  0x4a2b4f, 0x6b3e74, 0xa78bfa, 0xc4b5fd, 0x6b1b1b, 0x9d2828, 0xc94343, 0xf87171,
];

export function IsoBookshelf({ x, y }: { x: number; y: number }) {
  // Wooden 4-shelf bookcase with grouped, varied book spines per row.
  // Each shelf has horizontal plank + ~6 books leaning naturally.
  const drawBooks = useCallback(
    (g: Graphics) => {
      g.clear();
      const SHELVES = 4;
      const SHELF_HEIGHT = 0.45;
      const SHELF_START_Z = 0.25;
      const BOOK_BASE_W = 1.42; // tile fraction for usable book area

      for (let row = 0; row < SHELVES; row += 1) {
        const baseZ = SHELF_START_Z + row * SHELF_HEIGHT;
        const center = iso(x + 0.5, y + 0.22, baseZ);
        const shelfLeft = center.x - BOOK_BASE_W * 14;
        const shelfRight = center.x + BOOK_BASE_W * 14;

        // shelf plank — solid wood
        g.rect(shelfLeft - 2, center.y + 12, shelfRight - shelfLeft + 4, 2.5);
        g.fill({ color: 0x3a2415, alpha: 0.95 });

        // Books on top of the plank
        const seed = row * 31 + 7;
        let cursor = shelfLeft + 1;
        let i = 0;
        while (cursor < shelfRight - 4) {
          // Varied book heights/widths/colors
          const widthRoll = (seed + i * 13) % 7;
          const heightRoll = (seed + i * 19) % 5;
          const colorIndex = (seed + i * 11) % BOOK_PALETTE.length;
          const bookW = 3 + (widthRoll % 4);
          const bookH = 14 + heightRoll * 1.2;
          const tilt = (seed + i * 7) % 5 === 0 ? 1 : 0; // occasional leaning book

          if (tilt) {
            // simple tilted book — render slightly skewed
            g.poly([
              cursor,
              center.y + 12 - bookH + 4,
              cursor + bookW + 2,
              center.y + 12 - bookH,
              cursor + bookW + 2,
              center.y + 12,
              cursor,
              center.y + 12,
            ]);
            g.fill({ color: BOOK_PALETTE[colorIndex], alpha: 0.95 });
            // gold band
            g.poly([
              cursor + 0.5,
              center.y + 12 - bookH * 0.5,
              cursor + bookW + 1.5,
              center.y + 12 - bookH * 0.5 - 1,
              cursor + bookW + 1.5,
              center.y + 12 - bookH * 0.5 + 2,
              cursor + 0.5,
              center.y + 12 - bookH * 0.5 + 3,
            ]);
            g.fill({ color: 0xe8b96b, alpha: 0.6 });
            cursor += bookW + 2.5;
          } else {
            g.rect(cursor, center.y + 12 - bookH, bookW, bookH);
            g.fill({ color: BOOK_PALETTE[colorIndex], alpha: 0.95 });
            // spine highlight
            g.rect(cursor, center.y + 12 - bookH, 0.6, bookH);
            g.fill({ color: 0x000000, alpha: 0.35 });
            // title band
            if (bookW >= 4) {
              g.rect(cursor + 0.5, center.y + 12 - bookH * 0.65, bookW - 1, 1.4);
              g.fill({ color: 0xf7f3ea, alpha: 0.55 });
            }
            cursor += bookW + 0.6;
          }
          i += 1;
          if (i > 14) break;
        }
      }
    },
    [x, y]
  );

  return (
    <pixiContainer>
      {/* Frame: warm wood color */}
      <IsoBox
        x={x}
        y={y}
        w={1}
        d={0.45}
        h={2.4}
        topColor="#3a2415"
        leftColor="#23170D"
        rightColor="#160E07"
      />
      {/* Back panel: darker recess */}
      <IsoBox
        x={x + 0.04}
        y={y + 0.04}
        z={0.05}
        w={0.92}
        d={0.05}
        h={2.3}
        topColor="#0B0805"
        leftColor="#0B0805"
        rightColor="#0B0805"
        outline={false}
      />
      <pixiGraphics draw={drawBooks} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoTerminal — large standalone terminal pedestal with screen on top
// (used in AI Lab as the centerpiece)

export function IsoTerminal({ x, y }: { x: number; y: number }) {
  return (
    <pixiContainer>
      {/* base pedestal */}
      <IsoBox
        x={x}
        y={y}
        w={1.4}
        d={1.4}
        h={1}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      {/* screen */}
      <IsoBox
        x={x + 0.1}
        y={y + 0.5}
        z={1}
        w={1.2}
        d={0.15}
        h={0.9}
        topColor="#070B14"
        leftColor="#5EEAD4"
        rightColor="#0F1524"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoAgentSlot — narrow upright "agent station" used in AI Lab rack

export function IsoAgentSlot({
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
        d={0.7}
        h={1.6}
        topColor="#0F1524"
        leftColor={accent}
        rightColor="#0B101D"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoWallScreen — wide thin screen mounted on a wall (Ops Command dashboards)

export function IsoWallScreen({
  x,
  y,
  w = 2,
  z = 1.2,
  color = "#5EEAD4",
}: {
  x: number;
  y: number;
  w?: number;
  z?: number;
  color?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={z}
        w={w}
        d={0.05}
        h={0.9}
        topColor="#070B14"
        leftColor={color}
        rightColor="#0F1524"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoDataConsole — low wide cabinet with a row of multi-color status LEDs.
// Used to suggest a DB / control console without text.

export function IsoDataConsole({
  x,
  y,
  w = 2.4,
  accents = ["#34D399", "#5EEAD4", "#FBBF24", "#A78BFA"],
}: {
  x: number;
  y: number;
  w?: number;
  accents?: readonly string[];
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const ledCount = 12;
      const ledStep = w / ledCount;
      for (let i = 0; i < ledCount; i += 1) {
        const p = iso(x + 0.05 + i * ledStep, y + 0.1, 0.95);
        const color = hex(accents[i % accents.length]);
        g.rect(p.x - 3, p.y - 5, 4, 4);
        g.fill({ color, alpha: 0.9 });
      }
    },
    [x, y, w, accents]
  );
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={w}
        d={0.7}
        h={0.95}
        topColor="#0F1524"
        leftColor="#0B101D"
        rightColor="#070B14"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoWhiteboard — large flat board on the wall, with horizontal "lines" of
// content suggested by accent stripes. AI Lab repo map / workflow.

export function IsoWhiteboard({
  x,
  y,
  w = 2.4,
  color = "#5EEAD4",
}: {
  x: number;
  y: number;
  w?: number;
  color?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      // Three accent "rows" of content lines
      for (let row = 0; row < 3; row += 1) {
        const z = 1.5 - row * 0.28;
        const len = w * (0.65 + (row % 2) * 0.2);
        const start = iso(x + 0.15, y + 0.08, z);
        const end = iso(x + 0.15 + len, y + 0.08, z);
        g.moveTo(start.x, start.y);
        g.lineTo(end.x, end.y);
        g.stroke({ color: colorHex, alpha: 0.55, width: 2 });
      }
    },
    [x, y, w, color]
  );
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={w}
        d={0.08}
        h={1.7}
        topColor="#1A1F2E"
        leftColor="#070B14"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoColorSwatch — a single color block on a wall (UI Studio palette).

export function IsoColorSwatch({
  x,
  y,
  z = 1.1,
  color,
}: {
  x: number;
  y: number;
  z?: number;
  color: string;
}) {
  return (
    <IsoBox
      x={x}
      y={y}
      z={z}
      w={0.4}
      d={0.04}
      h={0.4}
      topColor="#070B14"
      leftColor={color}
      rightColor={color}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoCertFrame — small framed certificate on a wall (Personal Signal).

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
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={z}
        w={0.32}
        d={0.04}
        h={0.42}
        topColor="#070B14"
        leftColor={accent}
        rightColor="#1A1F2E"
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoMapPin — a small upright pin on the floor (DR map marker).

export function IsoMapPin({
  x,
  y,
  color = "#B85C38",
}: {
  x: number;
  y: number;
  color?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const top = iso(x + 0.5, y + 0.5, 0.6);
      const base = iso(x + 0.5, y + 0.5);
      g.moveTo(top.x, top.y);
      g.lineTo(base.x, base.y);
      g.stroke({ color: 0x0b101d, alpha: 0.7, width: 2 });
      g.circle(top.x, top.y, 4);
      g.fill({ color: hex(color), alpha: 1 });
      g.circle(top.x, top.y, 7);
      g.stroke({ color: hex(color), alpha: 0.45, width: 1 });
    },
    [x, y, color]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoKiosk — a small free-standing project kiosk (Project District).
// A pedestal with a colored top-screen.

export function IsoKiosk({
  x,
  y,
  accent,
  label,
}: {
  x: number;
  y: number;
  accent: string;
  label?: string;
}) {
  // label suppressed visually (kept in the API for future asset swap)
  void label;
  return (
    <pixiContainer>
      {/* base */}
      <IsoBox
        x={x}
        y={y}
        w={1.4}
        d={1.4}
        h={0.55}
        topColor="#1A1F2E"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      {/* tilted screen */}
      <IsoBox
        x={x + 0.15}
        y={y + 0.15}
        z={0.55}
        w={1.1}
        d={0.18}
        h={0.85}
        topColor="#070B14"
        leftColor={accent}
        rightColor="#0F1524"
      />
      {/* corner status LEDs on top */}
      <IsoBox
        x={x + 0.05}
        y={y + 1.2}
        z={0.55}
        w={0.1}
        d={0.1}
        h={0.06}
        topColor={accent}
        leftColor={accent}
        rightColor={accent}
      />
      <IsoBox
        x={x + 1.25}
        y={y + 1.2}
        z={0.55}
        w={0.1}
        d={0.1}
        h={0.06}
        topColor={accent}
        leftColor={accent}
        rightColor={accent}
      />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoFloorMarker — a small gold-bordered hex sigil painted on the floor.
// Used in Lobby to mark the 4 pillars.

export function IsoFloorMarker({
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
      const c = iso(x + 0.5, y + 0.5);
      const cy = c.y + TILE_H / 2;
      const accentHex = hex(accent);
      // outer diamond
      g.poly([
        c.x,
        cy - 10,
        c.x + 16,
        cy,
        c.x,
        cy + 10,
        c.x - 16,
        cy,
      ]);
      g.fill({ color: accentHex, alpha: 0.18 });
      g.stroke({ color: accentHex, alpha: 0.7, width: 1.5 });
      // inner dot
      g.circle(c.x, cy, 2.5);
      g.fill({ color: accentHex, alpha: 0.9 });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoContactCard — small flat business-card surface on a pedestal.

export function IsoContactCard({
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
        d={0.8}
        h={0.7}
        topColor="#1A1F2E"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.1}
        y={y + 0.18}
        z={0.7}
        w={0.6}
        d={0.4}
        h={0.04}
        topColor={accent}
        leftColor="#070B14"
        rightColor="#070B14"
      />
    </pixiContainer>
  );
}
