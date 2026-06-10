/**
 * Shared scene composite objects — reused across multiple rooms.
 *
 * Each composite reads as one recognizable thing at iso scale (chef, mountain,
 * tent, queue, meeting table, etc). Built from Pixi polygons + Furniture
 * primitives. No sprite/asset dependencies — works inside DesktopEntry's
 * Pixi canvas, never loaded on mobile.
 *
 * Convention: every composite takes (x, y) iso tile coords. Some take an
 * "accent" color to harmonize with the host room palette.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "../../lib/iso";
import { IsoBox, IsoCounter } from "../Furniture";

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoChef — figure in a white chef coat + chef hat. Distinct from generic
// Character so the BBQ corner reads as "cook", not "soldier" or "random guy".
// Slightly squat, white double-breasted jacket, tall toque.

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

      // Drop shadow
      g.ellipse(fx, fy + 4, 12, 4);
      g.fill({ color: 0x000000, alpha: 0.45 });

      // Shoes
      g.rect(fx - 5, fy, 4, 3);
      g.fill({ color: 0x070b14 });
      g.rect(fx + 1, fy, 4, 3);
      g.fill({ color: 0x070b14 });

      // Pants — short black chef pants
      g.rect(fx - 4, fy - 8, 3, 8);
      g.fill({ color: PANTS });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      g.rect(fx + 1, fy - 8, 3, 8);
      g.fill({ color: PANTS_DARK });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });

      // White coat torso
      g.rect(fx - 6, fy - 8 - 13 + 3, 12, 13 - 3);
      g.fill({ color: COAT });
      g.stroke({ color: EDGE, alpha: 0.55, width: 0.75 });
      // Shoulders
      g.rect(fx - 7, fy - 8 - 13, 14, 4);
      g.fill({ color: COAT_DARK });
      g.stroke({ color: EDGE, alpha: 0.55, width: 0.75 });

      // Double-breasted buttons (two columns)
      [-2, 2].forEach((dx) => {
        for (let i = 0; i < 3; i += 1) {
          g.circle(fx + dx, fy - 8 - 11 + i * 3, 0.7);
          g.fill({ color: 0x0b101d, alpha: 0.95 });
        }
      });

      // Small gold apron strip across waist
      g.rect(fx - 6, fy - 12, 12, 2);
      g.fill({ color: APRON, alpha: 0.85 });

      // Arms — both forward toward the grill (slight angle)
      const dir = facing === "se" || facing === "ne" ? 1 : -1;
      // Forward arm holding tongs
      g.rect(fx + 5 * dir, fy - 18, 8 * dir, 2);
      g.fill({ color: COAT });
      g.circle(fx + 13 * dir, fy - 17, 2);
      g.fill({ color: SKIN });
      // tongs sliver
      g.rect(fx + 13 * dir, fy - 18, 5 * dir, 0.8);
      g.stroke({ color: 0xa8b0c2, alpha: 0.9, width: 0.7 });

      // Back arm at side
      g.rect(fx - 8 * dir, fy - 8 - 13 + 4, 2, 8);
      g.fill({ color: COAT_DARK });
      g.circle(fx - 7 * dir, fy - 8 - 13 + 4 + 8 + 1, 2);
      g.fill({ color: SKIN });

      // Neck + face
      const headTop = fy - 8 - 13 - 9;
      g.rect(fx - 2, headTop + 9, 4, 2);
      g.fill({ color: SKIN });
      g.rect(fx - 4, headTop + 1, 8, 8);
      g.fill({ color: SKIN });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      g.rect(fx - 3, headTop, 6, 1);
      g.fill({ color: SKIN });

      // Eyes + small smile
      const facingBack = facing === "ne" || facing === "nw";
      if (!facingBack) {
        g.rect(fx - 2, headTop + 4.5, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
        g.rect(fx + 1, headTop + 4.5, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
        g.rect(fx - 1, headTop + 7.5, 3, 0.8);
        g.fill({ color: 0x070b14, alpha: 0.75 });
      }

      // Tall TOQUE (chef hat) — pleated cylinder + puffy top
      // Brim band
      g.rect(fx - 5, headTop - 2, 10, 3);
      g.fill({ color: TOQUE });
      g.stroke({ color: EDGE, alpha: 0.55, width: 0.7 });
      // Cylinder body
      g.rect(fx - 4, headTop - 8, 8, 6);
      g.fill({ color: TOQUE });
      g.stroke({ color: EDGE, alpha: 0.5, width: 0.6 });
      // Puffy top (overhanging)
      g.ellipse(fx, headTop - 9, 7, 4);
      g.fill({ color: TOQUE });
      g.stroke({ color: EDGE, alpha: 0.45, width: 0.6 });
      // Pleat shadow lines
      [-2, 0, 2].forEach((dx) => {
        g.rect(fx + dx, headTop - 7, 0.6, 4);
        g.fill({ color: 0xcfc9b8, alpha: 0.55 });
      });
    },
    [x, y, facing]
  );

  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoGrill — proper kettle BBQ with grill grate visible and ember glow.
// Sits low on the floor. Companion: IsoBbqSmoke draws the smoke wisp above.

export function IsoGrill({
  x,
  y,
  ember = "#F97316",
}: {
  x: number;
  y: number;
  ember?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const base = iso(x + 0.5, y + 0.5, 0.6);
      const emberHex = hex(ember);

      // Splayed legs (3)
      [-14, 0, 14].forEach((dx) => {
        g.moveTo(base.x + dx, base.y + 20);
        g.lineTo(base.x + dx * 0.4, base.y - 2);
        g.stroke({ color: 0x1f2937, alpha: 0.95, width: 1.8 });
      });

      // Kettle bowl — slightly larger
      g.ellipse(base.x, base.y - 4, 22, 8);
      g.fill({ color: 0x0b0f18, alpha: 0.98 });
      g.stroke({ color: 0x05080f, alpha: 0.92, width: 1.2 });

      // Visible grill grate on top of the kettle (open lid view)
      [-1, 0, 1].forEach((row) => {
        g.ellipse(base.x, base.y - 5 + row * 1.6, 17 - Math.abs(row) * 2, 0.6);
        g.stroke({ color: 0x6b7280, alpha: 0.85, width: 0.7 });
      });
      // Two pieces of food/meat on the grate
      g.ellipse(base.x - 6, base.y - 5.5, 4, 1.4);
      g.fill({ color: 0x4a1d10, alpha: 0.95 });
      g.ellipse(base.x + 6, base.y - 4.8, 4.5, 1.6);
      g.fill({ color: 0x3a1808, alpha: 0.95 });

      // Ember glow opening (front grate slit) — warm light spills out
      g.rect(base.x - 16, base.y - 2.5, 32, 3.5);
      g.fill({ color: emberHex, alpha: 0.9 });
      g.rect(base.x - 16, base.y - 2.5, 32, 3.5);
      g.stroke({ color: 0x4a0f00, alpha: 0.75, width: 0.8 });

      // Floor halo — warm glow on the patio under the grill
      g.ellipse(base.x, base.y + 18, 30, 8);
      g.fill({ color: emberHex, alpha: 0.18 });
    },
    [x, y, ember]
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
    [x, y]
  );
  return <pixiGraphics draw={draw} />;
}

// IsoPrepCart — small prep cart with cutting board, knife, plate
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
      {/* Cart body */}
      <IsoBox x={x} y={y} w={0.95} d={0.6} h={0.75} topColor="#3a2415" leftColor="#23170D" rightColor="#160E07" />
      {/* Cutting board */}
      <IsoBox x={x + 0.05} y={y + 0.06} z={0.75} w={0.85} d={0.48} h={0.04} topColor="#d6c19a" leftColor="#a88b66" rightColor="#7a6249" />
      {/* Plate */}
      <IsoBox x={x + 0.5} y={y + 0.12} z={0.79} w={0.32} d={0.32} h={0.03} topColor="#f7f3ea" leftColor="#cfcabb" rightColor="#a8a395" />
      {/* Knife — thin gold sliver */}
      <IsoBox x={x + 0.1} y={y + 0.18} z={0.79} w={0.28} d={0.05} h={0.02} topColor={accent} leftColor="#7a4b12" rightColor="#4a2b08" />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoMountainMassif — three-layer mountain with snow caps, trail dots, summit
// flag dot. Used in Discipline. Bigger and more recognizable than abstract
// triangles.

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
      const ROCK_DARK = 0x2a1f12;
      const ROCK_MID = 0x4a3520;
      const ROCK_LIGHT = 0x7a5a36;
      const ROCK_HIGHLIGHT = 0x96764a;
      const SNOW = 0xf6f3eb;
      const SNOW_SHADOW = 0xc9c5b8;
      const accentColor = hex(accent);

      function peak(
        baseLx: number,
        baseLy: number,
        baseRx: number,
        baseRy: number,
        summitX: number,
        summitY: number,
        rockLight: number,
        rockShadow: number,
        snowHeight: number
      ) {
        const midX = (baseLx + baseRx) / 2;
        // Left lit face
        g.poly([baseLx, baseLy, summitX, summitY, midX, baseLy + (baseRy - baseLy) / 2]);
        g.fill({ color: rockLight, alpha: 0.96 });
        // Right shadow face
        g.poly([midX, baseLy + (baseRy - baseLy) / 2, summitX, summitY, baseRx, baseRy]);
        g.fill({ color: rockShadow, alpha: 0.96 });
        // Snow cap
        const snowBaseY = summitY + snowHeight;
        const snowLx = summitX - snowHeight * 0.65;
        const snowRx = summitX + snowHeight * 0.65;
        g.poly([snowLx, snowBaseY, summitX, summitY, snowRx, snowBaseY]);
        g.fill({ color: SNOW, alpha: 0.95 });
        g.poly([summitX, summitY, snowRx, snowBaseY, summitX, snowBaseY + 0.6]);
        g.fill({ color: SNOW_SHADOW, alpha: 0.9 });
        // Ridge highlight
        g.moveTo(summitX, summitY);
        g.lineTo(midX, baseLy + (baseRy - baseLy) / 2);
        g.stroke({ color: 0x000000, alpha: 0.32, width: 1 });
      }

      // Back ridge — wide, low
      const bA = iso(x - 0.4, y + 2.2);
      const bB = iso(x + 3.6, y + 2.0);
      const bSummit = iso(x + 1.6, y + 0.5);
      peak(
        bA.x, bA.y + TILE_H / 2,
        bB.x, bB.y + TILE_H / 2,
        bSummit.x, bSummit.y - 30,
        ROCK_MID, ROCK_DARK, 10
      );

      // Main peak — tallest
      const mA = iso(x, y + 2.2);
      const mB = iso(x + 3.0, y + 2.2);
      const mSummit = iso(x + 1.5, y + 0.4);
      peak(
        mA.x, mA.y + TILE_H / 2,
        mB.x, mB.y + TILE_H / 2,
        mSummit.x, mSummit.y - 56,
        ROCK_LIGHT, ROCK_MID, 16
      );

      // Front peak — smaller
      const fA = iso(x + 0.3, y + 2.3);
      const fB = iso(x + 2.2, y + 2.3);
      const fSummit = iso(x + 1.2, y + 1.5);
      peak(
        fA.x, fA.y + TILE_H / 2,
        fB.x, fB.y + TILE_H / 2,
        fSummit.x, fSummit.y - 26,
        ROCK_HIGHLIGHT, ROCK_MID, 8
      );

      // Trail — small dotted switchback up the main peak
      const trailPts = [
        { x: mA.x + 24, y: mA.y + TILE_H / 2 - 8 },
        { x: mA.x + 48, y: mA.y + TILE_H / 2 - 22 },
        { x: mSummit.x - 18, y: mSummit.y - 36 },
        { x: mSummit.x, y: mSummit.y - 52 },
      ];
      trailPts.forEach((pt, i) => {
        g.circle(pt.x, pt.y, 1.6);
        g.fill({ color: accentColor, alpha: 0.45 + i * 0.12 });
      });

      // Summit flag — pole + small triangle
      g.moveTo(mSummit.x, mSummit.y - 56);
      g.lineTo(mSummit.x, mSummit.y - 66);
      g.stroke({ color: 0x0b101d, alpha: 0.95, width: 1.2 });
      g.poly([mSummit.x, mSummit.y - 66, mSummit.x + 8, mSummit.y - 63, mSummit.x, mSummit.y - 60]);
      g.fill({ color: accentColor, alpha: 0.95 });

      // Summit accent glow
      g.circle(mSummit.x, mSummit.y - 56, 4);
      g.stroke({ color: accentColor, alpha: 0.55, width: 1 });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoEventTent — white event tent with two flag-poles. Loan-campaign tent.
// Approx 2.4 x 1.6 footprint.

export function IsoEventTent({
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
      const accentHex = hex(accent);
      // Iso footprint corners
      const fl = iso(x, y + 1.6, 0);
      const fr = iso(x + 2.4, y + 1.6, 0);
      const bl = iso(x, y, 0);
      const br = iso(x + 2.4, y, 0);
      const apexFront = iso(x + 1.2, y + 1.6, 1.55);
      const apexBack = iso(x + 1.2, y, 1.55);

      // Back tent roof slope — white with scallop trim
      g.poly([bl.x, bl.y + TILE_H / 2, apexBack.x, apexBack.y, br.x, br.y + TILE_H / 2]);
      g.fill({ color: 0xf6f1e6, alpha: 0.96 });
      g.stroke({ color: 0x0b101d, alpha: 0.4, width: 1 });

      // Front (visible) roof slope — slightly shaded
      g.poly([
        fl.x, fl.y + TILE_H / 2,
        apexFront.x, apexFront.y,
        fr.x, fr.y + TILE_H / 2,
      ]);
      g.fill({ color: 0xece6d4, alpha: 0.97 });
      g.stroke({ color: 0x0b101d, alpha: 0.5, width: 1 });

      // Scallop trim on front edge
      for (let i = 0; i < 6; i += 1) {
        const t = i / 5;
        const px = fl.x + (fr.x - fl.x) * t;
        const py = fl.y + TILE_H / 2 + (fr.y - fl.y) * t;
        g.poly([px - 4, py, px, py + 4, px + 4, py]);
        g.fill({ color: accentHex, alpha: 0.78 });
      }

      // Ridge highlight from apex
      g.moveTo(apexFront.x, apexFront.y);
      g.lineTo(apexBack.x, apexBack.y);
      g.stroke({ color: 0xcfc9b8, alpha: 0.55, width: 1 });

      // Flag poles + triangular flags on each apex corner
      [
        { px: apexFront.x - 36, py: apexFront.y - 12 },
        { px: apexFront.x + 36, py: apexFront.y - 12 },
      ].forEach((p) => {
        g.moveTo(p.px, p.py + 18);
        g.lineTo(p.px, p.py - 4);
        g.stroke({ color: 0x0b101d, alpha: 0.9, width: 1 });
        g.poly([p.px, p.py - 4, p.px + 7, p.py - 1, p.px, p.py + 2]);
        g.fill({ color: accentHex, alpha: 0.95 });
      });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoServiceQueue — 3 mini-figures standing in a line. Reads as bank teller
// line or telecom service line. Each figure smaller than full Character.

export function IsoServiceQueue({
  x,
  y,
  count = 3,
  shirts = ["#1f3a5b", "#3a1f1f", "#2d2a1a"],
}: {
  x: number;
  y: number;
  count?: number;
  shirts?: readonly string[];
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const SKIN = 0xe8c8a0;
      const PANTS = 0x0b101d;
      for (let i = 0; i < count; i += 1) {
        const p = iso(x, y + i * 0.55, 0);
        const fx = p.x;
        const fy = p.y + TILE_H / 2;
        const shirtHex = hex(shirts[i % shirts.length]);
        // shadow
        g.ellipse(fx, fy + 2, 8, 2.6);
        g.fill({ color: 0x000000, alpha: 0.42 });
        // legs
        g.rect(fx - 3, fy - 7, 2.4, 7);
        g.fill({ color: PANTS });
        g.rect(fx + 0.6, fy - 7, 2.4, 7);
        g.fill({ color: PANTS });
        // torso
        g.rect(fx - 4, fy - 17, 8, 10);
        g.fill({ color: shirtHex });
        // head
        g.rect(fx - 3, fy - 24, 6, 7);
        g.fill({ color: SKIN });
        // hair
        g.rect(fx - 3, fy - 24, 6, 2);
        g.fill({ color: 0x241a08 });
      }
    },
    [x, y, count, shirts]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoMeetingTable — long rectangular table with chairs around it. Used in
// the Public Sector room as the institutional coordination centerpiece.

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
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      // 3 small map/doc panes on the tabletop
      for (let i = 0; i < 3; i += 1) {
        const p = iso(x + 0.5 + i * (w - 1) / 2, y + d / 2, 0.72);
        g.rect(p.x - 8, p.y - 6, 16, 8);
        g.fill({ color: 0xf6f1e6, alpha: 0.92 });
        g.rect(p.x - 6, p.y - 4, 12, 1.2);
        g.fill({ color: colorHex, alpha: 0.7 });
        g.rect(p.x - 6, p.y - 1, 8, 1);
        g.fill({ color: 0x0b101d, alpha: 0.7 });
      }
    },
    [x, y, w, d, accent]
  );

  // Helper to draw a seated figure
  const seatedFigure = (sx: number, sy: number, shirt: string, facing: "n" | "s") => {
    const draw = (g: Graphics) => {
      g.clear();
      const p = iso(sx, sy, 0);
      const fx = p.x;
      const fy = p.y + TILE_H / 2;
      g.ellipse(fx, fy + 2, 9, 3);
      g.fill({ color: 0x000000, alpha: 0.4 });
      // chair back
      g.rect(fx - 5, fy - (facing === "n" ? 18 : 10), 10, 8);
      g.fill({ color: 0x1f2937 });
      // torso
      g.rect(fx - 4, fy - 16, 8, 9);
      g.fill({ color: hex(shirt) });
      // head
      g.rect(fx - 3, fy - 23, 6, 7);
      g.fill({ color: 0xe8c8a0 });
      g.rect(fx - 3, fy - 23, 6, 2);
      g.fill({ color: 0x241a08 });
    };
    return <pixiGraphics key={`seat-${sx}-${sy}`} draw={draw} />;
  };

  const chairsTop = [0.4, 1.55, 2.7].map((dx) => ({ x: x + dx, y: y - 0.45, shirt: "#1f3a5b" }));
  const chairsBot = [0.4, 1.55, 2.7].map((dx) => ({ x: x + dx, y: y + d + 0.05, shirt: "#3a1f1f" }));

  return (
    <pixiContainer>
      {/* Table base — dark wood */}
      <IsoBox x={x} y={y} w={w} d={d} h={0.7} topColor="#3a2415" leftColor="#23170D" rightColor="#160E07" />
      {/* Tabletop accent stripe */}
      <IsoBox x={x + 0.05} y={y + d / 2 - 0.04} z={0.7} w={w - 0.1} d={0.08} h={0.02} topColor={accent} leftColor={accent} rightColor={accent} />
      {/* Documents on the tabletop */}
      <pixiGraphics draw={draw} />
      {/* Seated figures around the table */}
      {chairsTop.map((c) => seatedFigure(c.x, c.y, c.shirt, "s"))}
      {chairsBot.map((c) => seatedFigure(c.x, c.y, c.shirt, "n"))}
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoFileCabinet — 3-drawer filing cabinet. Used in Banking shared-file story.

export function IsoFileCabinet({
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
      {/* Cabinet body */}
      <IsoBox x={x} y={y} w={0.85} d={0.7} h={1.45} topColor="#9aa3b8" leftColor="#5a6478" rightColor="#3a4254" />
      {/* 3 drawer faces (right side visible) */}
      {[0.15, 0.6, 1.05].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.04}
          y={y + 0.65}
          z={z}
          w={0.8}
          d={0.04}
          h={0.32}
          topColor="#0b101d"
          leftColor="#a8b0c2"
          rightColor="#7a8294"
        />
      ))}
      {/* Drawer handles (small accent rectangles) */}
      {[0.31, 0.76, 1.21].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.32}
          y={y + 0.62}
          z={z}
          w={0.22}
          d={0.04}
          h={0.04}
          topColor={accent}
          leftColor={accent}
          rightColor="#0b101d"
        />
      ))}
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoBatConsole — floating black .bat command console with green text lines
// + curly "→" arrow showing automation. Used in Banking shared-file story.

export function IsoBatConsole({
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
      const p = iso(x + 0.5, y + 0.4, 0.95);
      const colorHex = hex(accent);
      // Console body
      g.rect(p.x - 22, p.y - 16, 44, 22);
      g.fill({ color: 0x05080f, alpha: 0.96 });
      g.stroke({ color: colorHex, alpha: 0.7, width: 0.9 });
      // Window title bar
      g.rect(p.x - 22, p.y - 16, 44, 4);
      g.fill({ color: 0x0e1620, alpha: 0.95 });
      // 3 dots (window controls)
      [0xff5f57, 0xfebc2e, 0x28c840].forEach((c, i) => {
        g.circle(p.x - 18 + i * 4, p.y - 14, 1.2);
        g.fill({ color: c, alpha: 0.95 });
      });
      // Prompt line: > resolve.bat
      g.rect(p.x - 19, p.y - 8, 2, 1.6);
      g.fill({ color: colorHex, alpha: 0.95 });
      g.rect(p.x - 16, p.y - 8, 20, 1.4);
      g.fill({ color: colorHex, alpha: 0.85 });
      // Result lines
      g.rect(p.x - 19, p.y - 4, 18, 1.2);
      g.fill({ color: 0xe6e2d4, alpha: 0.65 });
      g.rect(p.x - 19, p.y - 1, 14, 1.2);
      g.fill({ color: 0xe6e2d4, alpha: 0.55 });
      // Blinking cursor
      g.rect(p.x - 19, p.y + 2, 2, 1.4);
      g.fill({ color: colorHex, alpha: 0.9 });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoPhoneShelf — display case with 3 phones in a row. Used in Telecom store.

export function IsoPhoneShelf({
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
      {/* Shelf cabinet */}
      <IsoBox x={x} y={y} w={1.8} d={0.7} h={1.05} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      {/* Glass front strip */}
      <IsoBox x={x + 0.04} y={y + 0.6} z={0.25} w={1.72} d={0.06} h={0.6} topColor="#0b101d" leftColor={accent} rightColor="#0b101d" outline={false} />
      {/* 3 phones on display */}
      {[0.18, 0.78, 1.38].map((dx) => (
        <pixiContainer key={dx}>
          <IsoBox x={x + dx} y={y + 0.25} z={1.05} w={0.18} d={0.12} h={0.28} topColor="#070b14" leftColor="#1A2238" rightColor="#0B101D" />
          <IsoBox x={x + dx + 0.02} y={y + 0.27} z={1.07} w={0.14} d={0.04} h={0.24} topColor="#070b14" leftColor={accent} rightColor="#0F1524" />
        </pixiContainer>
      ))}
      {/* Small price tags */}
      {[0.22, 0.82, 1.42].map((dx) => (
        <IsoBox
          key={dx}
          x={x + dx}
          y={y + 0.55}
          z={1.05}
          w={0.1}
          d={0.04}
          h={0.05}
          topColor="#E8B96B"
          leftColor="#7a4b12"
          rightColor="#4a2b08"
        />
      ))}
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoCoverageMap — wall-mounted coverage map with checkmark indicators for
// 3G / 4G / 5G / Fiber / HFC. Used in Telecom.

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

      // Country outline (abstract blob suggesting DR)
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

      // Coverage hotspots
      [
        { dx: -18, dy: -6, c: green },
        { dx: -2, dy: -8, c: green },
        { dx: 14, dy: -6, c: colorHex },
        { dx: -10, dy: 4, c: gold },
        { dx: 16, dy: 2, c: gold },
      ].forEach((h) => {
        g.circle(p.x + h.dx, p.y + h.dy, 2.5);
        g.fill({ color: h.c, alpha: 0.92 });
        g.circle(p.x + h.dx, p.y + h.dy, 5);
        g.stroke({ color: h.c, alpha: 0.35, width: 0.8 });
      });

      // Legend rows at the bottom (5 small chips)
      const labels = ["3G", "4G", "5G", "FIBER", "HFC"];
      labels.forEach((_, i) => {
        const lp = iso(x + 0.3 + i * 0.5, y + 0.08, 0.55);
        // bullet
        g.circle(lp.x - 9, lp.y, 2);
        g.fill({ color: i === 4 ? gold : i === 2 ? colorHex : green, alpha: 0.95 });
        // chip background
        g.rect(lp.x - 6, lp.y - 4, 14, 8);
        g.fill({ color: 0x05080f, alpha: 0.85 });
      });
    },
    [x, y, accent]
  );

  return (
    <pixiContainer>
      {/* Wall board behind */}
      <IsoBox x={x} y={y} z={0.3} w={3.0} d={0.08} h={1.95} topColor="#070B14" leftColor="#0F1524" rightColor="#0B101D" />
      <pixiGraphics draw={draw} />
      {/* Small labels (rendered as text for legibility). Oversampled so
          they stay crisp when the camera zooms in. */}
      {["3G", "4G", "5G", "FIBER", "HFC"].map((label, i) => {
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

// ─────────────────────────────────────────────────────────────────────────────
// IsoRecLiveMonitor — wall monitor with REC LIVE pulse + waveform.
// Combined object: cleaner than scattering REC sign + waveform around.

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
      // Screen background
      g.rect(p.x - 36, p.y - 28, 72, 44);
      g.fill({ color: 0x05080f, alpha: 0.95 });
      g.stroke({ color: colorHex, alpha: 0.7, width: 1 });
      // REC LIVE dot top-left
      g.circle(p.x - 30, p.y - 22, 3);
      g.fill({ color: colorHex, alpha: 0.95 });
      // 6 waveform bars
      [0.4, 0.7, 1.0, 0.6, 0.85, 0.5].forEach((h, i) => {
        g.rect(p.x - 20 + i * 7, p.y - 10 * h, 4, 20 * h);
        g.fill({ color: 0x5eead4, alpha: 0.78 });
      });
      // Bottom timecode bar
      g.rect(p.x - 30, p.y + 6, 28, 1.6);
      g.fill({ color: 0xe6e2d4, alpha: 0.65 });
    },
    [x, y, accent]
  );

  return (
    <pixiContainer>
      {/* Monitor frame mounted on wall */}
      <IsoBox x={x} y={y} z={0.85} w={1.8} d={0.06} h={1.0} topColor="#070B14" leftColor="#1A2238" rightColor="#0F1524" />
      <pixiGraphics draw={draw} />
      {/* REC text — oversampled for zoom crispness */}
      {(() => {
        const tp = iso(x + 0.9, y + 0.05, 1.3);
        return (
          <pixiText
            text="REC · LIVE"
            x={tp.x - 8}
            y={tp.y - 22}
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
        );
      })()}
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoPoliceK9 — small dog figure (German Shepherd silhouette). Used in
// Public Sector outside corner. Secondary, not dominant.

export function IsoPoliceK9({
  x,
  y,
  facing = "se",
}: {
  x: number;
  y: number;
  facing?: "se" | "sw";
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 0);
      const fx = p.x;
      const fy = p.y + TILE_H / 2;
      const dir = facing === "se" ? 1 : -1;
      const FUR = 0x3a2e1f;
      const FUR_DARK = 0x231a10;
      const TAN = 0xa8804a;

      // shadow
      g.ellipse(fx, fy + 1, 14, 3);
      g.fill({ color: 0x000000, alpha: 0.42 });

      // Body (horizontal oval)
      g.ellipse(fx, fy - 5, 12, 4);
      g.fill({ color: FUR, alpha: 0.96 });
      g.stroke({ color: FUR_DARK, alpha: 0.95, width: 0.7 });

      // Tan underbelly
      g.ellipse(fx, fy - 3, 10, 1.6);
      g.fill({ color: TAN, alpha: 0.82 });

      // Legs (4 small rectangles)
      [-9, -5, 4, 8].forEach((dx) => {
        g.rect(fx + dx, fy - 3, 1.6, 4);
        g.fill({ color: FUR_DARK });
      });

      // Tail — angled up
      g.moveTo(fx - 10 * dir, fy - 6);
      g.lineTo(fx - 14 * dir, fy - 11);
      g.stroke({ color: FUR, alpha: 0.95, width: 2.4 });

      // Head — small rectangle on the front
      g.rect(fx + 8 * dir, fy - 10, 5, 5);
      g.fill({ color: FUR, alpha: 0.97 });
      g.stroke({ color: FUR_DARK, alpha: 0.9, width: 0.6 });
      // Snout
      g.rect(fx + 12 * dir, fy - 8, 3, 2);
      g.fill({ color: FUR_DARK });
      // Eye
      g.rect(fx + 10 * dir, fy - 8.5, 0.8, 0.8);
      g.fill({ color: 0x070b14 });
      // Ear (pointy)
      g.poly([fx + 8 * dir, fy - 10, fx + 9.5 * dir, fy - 14, fx + 11 * dir, fy - 10]);
      g.fill({ color: FUR_DARK, alpha: 0.95 });
    },
    [x, y, facing]
  );
  return <pixiGraphics draw={draw} />;
}

// IsoPoliceCarSmall — police cruiser (visible roof bar, blue stripe).
// Used in Public Sector outside corner.

export function IsoPoliceCarSmall({
  x,
  y,
  facing = "se",
}: {
  x: number;
  y: number;
  facing?: "se" | "sw";
}) {
  const dir = facing === "sw" ? -1 : 1;
  void dir;
  return (
    <pixiContainer>
      {/* Body */}
      <IsoBox x={x} y={y} w={1.6} d={0.85} h={0.55} topColor="#f7f3ea" leftColor="#cfcabb" rightColor="#9aa3b8" />
      {/* Cabin */}
      <IsoBox x={x + 0.3} y={y + 0.1} z={0.55} w={1.0} d={0.65} h={0.3} topColor="#0F1524" leftColor="#1A2238" rightColor="#0B101D" />
      {/* Blue stripe (right side visible) */}
      <IsoBox x={x + 0.04} y={y + 0.78} z={0.18} w={1.52} d={0.06} h={0.16} topColor="#1e3a8a" leftColor="#1e3a8a" rightColor="#0c1a4a" outline={false} />
      {/* Roof light bar (red/blue) */}
      <IsoBox x={x + 0.55} y={y + 0.28} z={0.85} w={0.5} d={0.18} h={0.08} topColor="#1e3a8a" leftColor="#7f1d1d" rightColor="#0c1a4a" />
    </pixiContainer>
  );
}

// IsoOfficer — police officer figure with cap + tie shirt
export function IsoOfficer({
  x,
  y,
  facing = "se",
  badgeColor = "#E8B96B",
}: {
  x: number;
  y: number;
  facing?: "se" | "sw" | "ne" | "nw";
  badgeColor?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5);
      const fx = p.x;
      const fy = p.y;
      const SKIN = 0xe8c8a0;
      const UNIFORM = 0x162338;
      const UNIFORM_DARK = 0x0b1426;
      const EDGE = 0x050810;
      const badgeHex = hex(badgeColor);

      g.ellipse(fx, fy + 4, 11, 3.5);
      g.fill({ color: 0x000000, alpha: 0.45 });
      g.rect(fx - 5, fy, 4, 3);
      g.fill({ color: 0x070b14 });
      g.rect(fx + 1, fy, 4, 3);
      g.fill({ color: 0x070b14 });
      // legs
      g.rect(fx - 4, fy - 8, 3, 8);
      g.fill({ color: UNIFORM_DARK });
      g.rect(fx + 1, fy - 8, 3, 8);
      g.fill({ color: UNIFORM_DARK });
      // torso
      g.rect(fx - 6, fy - 8 - 13 + 3, 12, 13 - 3);
      g.fill({ color: UNIFORM });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      // shoulders + badge
      g.rect(fx - 7, fy - 8 - 13, 14, 4);
      g.fill({ color: UNIFORM_DARK });
      g.rect(fx + 2, fy - 8 - 12, 3, 1.4);
      g.fill({ color: badgeHex });
      // arms
      g.rect(fx - 8, fy - 8 - 13 + 4, 2, 8);
      g.fill({ color: UNIFORM_DARK });
      g.circle(fx - 7, fy - 8 - 13 + 4 + 9, 2);
      g.fill({ color: SKIN });
      g.rect(fx + 6, fy - 8 - 13 + 4, 2, 8);
      g.fill({ color: UNIFORM });
      g.circle(fx + 7, fy - 8 - 13 + 4 + 9, 2);
      g.fill({ color: SKIN });
      // head + cap
      const headTop = fy - 8 - 13 - 9;
      g.rect(fx - 2, headTop + 9, 4, 2);
      g.fill({ color: SKIN });
      g.rect(fx - 4, headTop + 1, 8, 8);
      g.fill({ color: SKIN });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      // Officer cap
      g.rect(fx - 5, headTop - 3, 10, 4);
      g.fill({ color: UNIFORM_DARK });
      g.rect(fx - 6, headTop, 12, 2);
      g.fill({ color: 0x0b1020 });
      g.rect(fx - 1.5, headTop - 2, 3, 1.5);
      g.fill({ color: badgeHex });
      // eyes
      const facingBack = facing === "ne" || facing === "nw";
      if (!facingBack) {
        g.rect(fx - 2, headTop + 4.5, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
        g.rect(fx + 1, headTop + 4.5, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
      }
    },
    [x, y, facing, badgeColor]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoConfidentialBadge — shield + lock icon. "Generalized for confidentiality".
// Used in Public Sector to telegraph the secrecy of the room contents.

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
      // Shield silhouette
      g.poly([
        p.x, p.y - 16,
        p.x + 11, p.y - 12,
        p.x + 11, p.y - 2,
        p.x + 6, p.y + 8,
        p.x, p.y + 12,
        p.x - 6, p.y + 8,
        p.x - 11, p.y - 2,
        p.x - 11, p.y - 12,
      ]);
      g.fill({ color: 0x0b1322, alpha: 0.95 });
      g.stroke({ color: colorHex, alpha: 0.9, width: 1.2 });
      // Padlock body
      g.rect(p.x - 4, p.y - 4, 8, 7);
      g.fill({ color: colorHex, alpha: 0.92 });
      // Padlock shackle
      g.arc(p.x, p.y - 4, 3.6, Math.PI, 0, false);
      g.stroke({ color: colorHex, alpha: 0.95, width: 1.4 });
      // Keyhole
      g.circle(p.x, p.y - 1, 1.2);
      g.fill({ color: 0x05080f, alpha: 1 });
      g.rect(p.x - 0.6, p.y - 1, 1.2, 3);
      g.fill({ color: 0x05080f, alpha: 1 });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoChildAtCRT — small seated child in front of an old CRT. Hero of the
// Origin "childhood corner". Distinct from generic Character — smaller head,
// shorter body, slightly tilted.

export function IsoChildAtCRT({
  x,
  y,
  shirt = "#5EAEDF",
  screen = "#5EEAD4",
}: {
  x: number;
  y: number;
  shirt?: string;
  screen?: string;
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
      const screenHex = hex(screen);

      // shadow
      g.ellipse(fx, fy + 2, 10, 3);
      g.fill({ color: 0x000000, alpha: 0.42 });

      // Seated legs (short, knees bent forward)
      g.rect(fx - 4, fy - 4, 3, 4);
      g.fill({ color: 0x1a1f2e });
      g.rect(fx + 1, fy - 4, 3, 4);
      g.fill({ color: 0x1a1f2e });

      // Torso — slightly hunched toward screen
      g.rect(fx - 5, fy - 12, 10, 8);
      g.fill({ color: shirtHex });
      g.stroke({ color: 0x050810, alpha: 0.55, width: 0.7 });

      // Arms forward to keyboard
      g.rect(fx + 1, fy - 11, 7, 1.8);
      g.fill({ color: shirtHex });
      g.circle(fx + 8, fy - 10, 1.6);
      g.fill({ color: SKIN });

      // Neck
      g.rect(fx - 1, fy - 14, 2, 2);
      g.fill({ color: SKIN });

      // Head — smaller (child proportion)
      g.rect(fx - 3, fy - 21, 6, 7);
      g.fill({ color: SKIN });
      g.stroke({ color: 0x050810, alpha: 0.55, width: 0.7 });
      // Hair
      g.rect(fx - 3, fy - 21, 6, 2.5);
      g.fill({ color: HAIR });
      // Eyes (looking at screen)
      g.rect(fx + 1, fy - 17.5, 1, 1);
      g.fill({ color: 0x070b14 });
      g.rect(fx + 3, fy - 17.5, 1, 1);
      g.fill({ color: 0x070b14 });
      void screenHex;
    },
    [x, y, shirt, screen]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoVintageCRT — chunky beige CRT monitor + tower + keyboard. Reads as
// late-90s / early-2000s PC. Sits on a small desk.

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
      // Cursor block (vintage)
      g.rect(p.x - 6, p.y - 2, 6, 2);
      g.fill({ color: screenHex, alpha: 0.95 });
    },
    [x, y, screen]
  );

  return (
    <pixiContainer>
      {/* Desk underneath */}
      <IsoCounter x={x} y={y} w={2.5} d={1.25} topColor="#3a2415" faceColor="#23170D" />
      {/* CRT body — beige, chunky */}
      <IsoBox x={x + 0.22} y={y + 0.22} z={0.9} w={0.95} d={0.6} h={0.82} topColor="#dccfa9" leftColor="#a89c79" rightColor="#7a7156" />
      {/* CRT screen recessed */}
      <IsoBox x={x + 0.38} y={y + 0.34} z={1.08} w={0.66} d={0.12} h={0.48} topColor="#070B14" leftColor={screen} rightColor="#0F1524" />
      <pixiGraphics draw={drawScanlines} />
      {/* PC Tower beside */}
      <IsoBox x={x + 1.4} y={y + 0.22} z={0.9} w={0.55} d={0.5} h={0.7} topColor="#d0c4a0" leftColor="#a89c79" rightColor="#7a7156" />
      {/* Tower drive slot */}
      <IsoBox x={x + 1.45} y={y + 0.32} z={1.45} w={0.45} d={0.06} h={0.06} topColor="#070B14" leftColor="#374151" rightColor="#1A2238" />
      {/* Power LED */}
      <IsoBox x={x + 1.48} y={y + 0.42} z={1.3} w={0.07} d={0.06} h={0.05} topColor={screen} leftColor={screen} rightColor={screen} />
      {/* Keyboard on desk */}
      <IsoBox x={x + 0.4} y={y + 0.88} z={0.9} w={0.95} d={0.28} h={0.04} topColor="#d0c4a0" leftColor="#a89c79" rightColor="#7a7156" />
      {/* Mouse */}
      <IsoBox x={x + 1.55} y={y + 0.88} z={0.9} w={0.16} d={0.18} h={0.04} topColor="#d0c4a0" leftColor="#a89c79" rightColor="#7a7156" />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoDiplomaWithRibbon — diploma scroll with red ribbon + gold seal.
// Used in Origin scholarship corner.

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
      // Scroll / diploma body
      g.rect(p.x - 16, p.y - 12, 32, 22);
      g.fill({ color: 0xf6f1e6, alpha: 0.97 });
      g.stroke({ color: 0x7a5a30, alpha: 0.75, width: 1 });
      // Text lines
      for (let i = 0; i < 3; i += 1) {
        g.rect(p.x - 12, p.y - 8 + i * 4, 24, 1.2);
        g.fill({ color: 0x4a3520, alpha: 0.65 });
      }
      // Gold seal
      g.circle(p.x + 11, p.y + 7, 4);
      g.fill({ color: colorHex, alpha: 0.95 });
      g.circle(p.x + 11, p.y + 7, 6);
      g.stroke({ color: colorHex, alpha: 0.45, width: 0.8 });
      // Red ribbon
      g.poly([
        p.x + 7, p.y + 10,
        p.x + 15, p.y + 10,
        p.x + 11, p.y + 18,
      ]);
      g.fill({ color: 0xb02020, alpha: 0.92 });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// IsoGradCap — graduation cap floating on a tile
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
      // Cap body (mortarboard)
      g.poly([p.x, p.y - 14, p.x + 18, p.y - 6, p.x, p.y + 2, p.x - 18, p.y - 6]);
      g.fill({ color: 0x0b101d, alpha: 0.96 });
      g.stroke({ color: 0x050810, alpha: 0.9, width: 0.8 });
      // Cap base
      g.rect(p.x - 7, p.y - 2, 14, 5);
      g.fill({ color: 0x0b101d, alpha: 0.95 });
      // Tassel
      g.moveTo(p.x + 4, p.y - 8);
      g.lineTo(p.x + 10, p.y + 2);
      g.stroke({ color: colorHex, alpha: 0.95, width: 1.2 });
      g.circle(p.x + 10, p.y + 4, 1.6);
      g.fill({ color: colorHex, alpha: 0.95 });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoLotteryKiosk — small kiosk shed with awning. Sells recharges + lottery.
// Used in the POS room.

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
      // Striped awning scallop on front edge
      const p = iso(x + 1.0, y + 1.2, 1.05);
      for (let i = 0; i < 8; i += 1) {
        const px = p.x - 26 + i * 8;
        g.poly([px - 3, p.y, px, p.y + 4, px + 3, p.y]);
        g.fill({ color: i % 2 === 0 ? colorHex : 0xf6f1e6, alpha: 0.92 });
      }
    },
    [x, y, accent]
  );

  return (
    <pixiContainer>
      {/* Kiosk base (booth body) */}
      <IsoBox x={x} y={y} w={2.0} d={1.2} h={1.05} topColor="#4a3520" leftColor="#23170D" rightColor="#160E07" />
      {/* Awning slab */}
      <IsoBox x={x - 0.1} y={y + 1.1} z={1.05} w={2.2} d={0.18} h={0.06} topColor={accent} leftColor="#7a4b12" rightColor="#4a2b08" />
      {/* Service window (open) */}
      <IsoBox x={x + 0.2} y={y + 1.18} z={0.45} w={1.6} d={0.05} h={0.5} topColor="#070b14" leftColor={accent} rightColor="#0F1524" outline={false} />
      {/* Vertical sign post */}
      <IsoBox x={x + 0.04} y={y + 0.04} z={1.05} w={0.16} d={0.16} h={0.95} topColor="#5a6478" leftColor="#3a4254" rightColor="#23272f" />
      <IsoBox x={x - 0.06} y={y - 0.04} z={1.7} w={0.7} d={0.32} h={0.42} topColor="#0b101d" leftColor={accent} rightColor="#7a4b12" />
      {/* Awning scallop */}
      <pixiGraphics draw={drawAwning} />
    </pixiContainer>
  );
}

// IsoTicketBoard — large numbered lottery ticket board (used inside the
// POS-room lottery corner, mounted on wall)
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
      // Numbers grid 3x3
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
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.7} w={1.6} d={0.06} h={1.35} topColor="#070B14" leftColor="#1A2238" rightColor="#0F1524" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// IsoLegacySystemCard — small card representing Crystal Reports / ASP.NET /
// WinForms heritage. Used in the POS room to hint at the legacy technical layer
// without overcrowding.
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
      <IsoBox x={x} y={y} w={1.0} d={0.7} h={0.85} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      {/* Three "system" stripes on the face */}
      {[0.18, 0.4, 0.62].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.08}
          y={y + 0.65}
          z={z}
          w={0.84}
          d={0.05}
          h={0.12}
          topColor="#070b14"
          leftColor={accent}
          rightColor="#0b101d"
        />
      ))}
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoArchitectureBoard — whiteboard with architecture diagram:
// n8n → LiteLLM/Ollama → Qdrant → Langfuse, drawn as connected nodes.

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
      const colorHex = hex(accent);
      const gold = 0xe8b96b;
      const purple = 0xa78bfa;
      const green = 0x34d399;
      const p = iso(x + 1.4, y + 0.05, 1.7);

      const nodes = [
        { dx: -42, dy: 6, color: green, label: "n8n" },
        { dx: -16, dy: -4, color: gold, label: "LiteLLM" },
        { dx: 14, dy: 6, color: colorHex, label: "Qdrant" },
        { dx: 40, dy: -4, color: purple, label: "Langfuse" },
      ];
      // Connecting lines
      for (let i = 0; i < nodes.length - 1; i += 1) {
        const a = nodes[i];
        const b = nodes[i + 1];
        g.moveTo(p.x + a.dx + 7, p.y + a.dy);
        g.lineTo(p.x + b.dx - 7, p.y + b.dy);
        g.stroke({ color: 0xa8b0c2, alpha: 0.6, width: 1 });
        // arrow head
        g.poly([
          p.x + b.dx - 7, p.y + b.dy,
          p.x + b.dx - 11, p.y + b.dy - 2,
          p.x + b.dx - 11, p.y + b.dy + 2,
        ]);
        g.fill({ color: 0xa8b0c2, alpha: 0.85 });
      }
      // Nodes
      nodes.forEach((n) => {
        g.rect(p.x + n.dx - 9, p.y + n.dy - 6, 18, 12);
        g.fill({ color: 0x05080f, alpha: 0.92 });
        g.stroke({ color: n.color, alpha: 0.85, width: 1 });
        g.circle(p.x + n.dx - 4, p.y + n.dy, 1.6);
        g.fill({ color: n.color, alpha: 0.95 });
      });
    },
    [x, y, accent]
  );

  return (
    <pixiContainer>
      {/* Board frame */}
      <IsoBox x={x} y={y} z={0.5} w={3.0} d={0.08} h={1.8} topColor="#1A1F2E" leftColor="#070B14" rightColor="#0F1524" />
      <pixiGraphics draw={draw} />
      {/* Node labels (oversampled for zoom crispness) */}
      {["n8n", "LiteLLM", "Qdrant", "Langfuse"].map((label, i) => {
        const offsets = [-42, -16, 14, 40];
        const dys = [6, -4, 6, -4];
        const p = iso(x + 1.4, y + 0.05, 1.7);
        return (
          <pixiText
            key={label}
            text={label}
            x={p.x + offsets[i]}
            y={p.y + dys[i] + 9}
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

// ─────────────────────────────────────────────────────────────────────────────
// IsoOpsRack — taller, more recognizable server rack with cable spaghetti
// at the bottom and visible LEDs in defined units.

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
      const colorHex = hex(accent);
      // 7 server "U" rows with LEDs
      for (let row = 0; row < 7; row += 1) {
        const p = iso(x + 0.14, y + 0.18, 2.85 - row * 0.35);
        g.rect(p.x - 8, p.y - 2, 26, 3.5);
        g.fill({ color: 0x05080f, alpha: 0.96 });
        g.stroke({ color: 0x1a2238, alpha: 0.9, width: 0.4 });
        // LED bank
        for (let i = 0; i < 4; i += 1) {
          g.circle(p.x - 5 + i * 5, p.y - 0.5, 1.1);
          g.fill({ color: (row + i) % 3 === 0 ? colorHex : (row + i) % 3 === 1 ? 0x34d399 : 0xe8b96b, alpha: 0.95 });
        }
      }
      // Cable spaghetti at the bottom
      const bp = iso(x + 0.5, y + 0.6, 0.1);
      [0, 1, 2, 3].forEach((i) => {
        g.moveTo(bp.x - 8 + i * 4, bp.y);
        g.bezierCurveTo(bp.x - 4 + i * 4, bp.y + 6, bp.x + 4 - i * 2, bp.y + 10, bp.x + 8, bp.y + 12);
        g.stroke({ color: i % 2 === 0 ? 0x1f2937 : 0x4a3520, alpha: 0.85, width: 1.2 });
      });
    },
    [x, y, accent]
  );

  return (
    <pixiContainer>
      <IsoBox x={x} y={y} w={1.3} d={1.4} h={3.0} topColor="#1A2238" leftColor="#0B101D" rightColor="#070B14" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// IsoOpsDesk — operator workstation with monitor + chair + smaller secondary
// monitor. One operator focus.
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
      {/* Desk */}
      <IsoCounter x={x} y={y} w={2.0} d={1.0} topColor="#1A2238" faceColor="#0F1524" />
      {/* Primary monitor */}
      <IsoBox x={x + 0.18} y={y + 0.2} z={0.9} w={0.85} d={0.12} h={0.65} topColor="#070B14" leftColor={accent} rightColor="#0F1524" />
      {/* Monitor stand */}
      <IsoBox x={x + 0.45} y={y + 0.35} z={0.9} w={0.25} d={0.25} h={0.1} topColor="#070b14" leftColor="#1A2238" rightColor="#0B101D" />
      {/* Secondary monitor (smaller, side) */}
      <IsoBox x={x + 1.2} y={y + 0.25} z={0.9} w={0.6} d={0.1} h={0.5} topColor="#070B14" leftColor="#34d399" rightColor="#0F1524" />
      {/* Keyboard */}
      <IsoBox x={x + 0.4} y={y + 0.65} z={0.9} w={0.9} d={0.22} h={0.04} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      {/* Chair (behind desk) */}
      <IsoBox x={x + 0.65} y={y + 1.15} z={0} w={0.55} d={0.55} h={0.45} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      <IsoBox x={x + 0.65} y={y + 1.6} z={0} w={0.55} d={0.08} h={1.0} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
    </pixiContainer>
  );
}

// IsoQdrantCylinder — labeled vector database cylinder
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
      // top ellipse
      g.ellipse(p.x, p.y - 16, 18, 6);
      g.fill({ color: 0x0b101d, alpha: 0.95 });
      g.stroke({ color, alpha: 0.85, width: 1 });
      // body
      g.rect(p.x - 18, p.y - 16, 36, 28);
      g.fill({ color: 0x102026, alpha: 0.93 });
      // bottom ellipse
      g.ellipse(p.x, p.y + 12, 18, 6);
      g.fill({ color: 0x102026, alpha: 0.96 });
      g.stroke({ color, alpha: 0.7, width: 1 });
      // 4 horizontal "data" stripes
      [0, 1, 2, 3].forEach((i) => {
        g.ellipse(p.x, p.y - 8 + i * 7, 16, 3);
        g.stroke({ color, alpha: 0.35, width: 0.7 });
      });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// IsoN8nNodes — small connected nodes diagram representing an n8n workflow
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
      // Connections
      for (let i = 0; i < pts.length - 1; i += 1) {
        g.moveTo(pts[i].x, pts[i].y);
        g.lineTo(pts[i + 1].x, pts[i + 1].y);
        g.stroke({ color: colorHex, alpha: 0.55, width: 1.2 });
      }
      // Round nodes with center dot
      pts.forEach((p, i) => {
        g.circle(p.x, p.y, 5);
        g.fill({ color: 0x05080f, alpha: 0.95 });
        g.stroke({ color: colorHex, alpha: 0.85, width: 1 });
        g.circle(p.x, p.y, 2);
        g.fill({ color: i === pts.length - 1 ? 0xe8b96b : colorHex, alpha: 0.95 });
      });
    },
    [x, y, accent]
  );
  return <pixiGraphics draw={draw} />;
}

// IsoHumanApprovalGate — clear green-check gate, taller, more "control point"
export function IsoHumanApprovalGate({
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
    [x, y, accent]
  );
  return (
    <pixiContainer>
      {/* Arch posts */}
      <IsoBox x={x} y={y} w={0.15} d={0.15} h={1.7} topColor="#0B101D" leftColor={accent} rightColor="#0B101D" />
      <IsoBox x={x + 1.25} y={y} w={0.15} d={0.15} h={1.7} topColor="#0B101D" leftColor={accent} rightColor="#0B101D" />
      {/* Arch beam */}
      <IsoBox x={x} y={y} z={1.7} w={1.4} d={0.15} h={0.2} topColor={accent} leftColor="#0c3a2a" rightColor="#08251b" />
      {/* Approval signal */}
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// IsoLangfusePanel — compact telemetry/observability panel with bar chart
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
      // Panel
      g.rect(p.x - 20, p.y - 14, 40, 24);
      g.fill({ color: 0x05080f, alpha: 0.94 });
      g.stroke({ color: colorHex, alpha: 0.7, width: 0.9 });
      // Title bar
      g.rect(p.x - 20, p.y - 14, 40, 4);
      g.fill({ color: 0x0e1620, alpha: 0.95 });
      // 5 bars (evals trend)
      [0.5, 0.7, 0.6, 0.9, 0.8].forEach((h, i) => {
        const bh = 12 * h;
        g.rect(p.x - 16 + i * 7, p.y + 6 - bh, 4, bh);
        g.fill({ color: colorHex, alpha: 0.85 });
      });
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.8} w={1.2} d={0.05} h={0.6} topColor="#070B14" leftColor="#1A2238" rightColor="#0F1524" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoLoanCounter — formal bank desk with computer, phone, in/out tray.
// Reads as banker workstation, not generic counter.

export function IsoLoanCounter({
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
      {/* Counter base — darker formal wood */}
      <IsoCounter x={x} y={y} w={2.6} d={1.2} topColor="#2a1f12" faceColor="#160E07" />
      {/* Computer + monitor */}
      <IsoBox x={x + 0.25} y={y + 0.25} z={0.9} w={0.32} d={0.32} h={0.1} topColor="#070b14" leftColor="#1A2238" rightColor="#0B101D" />
      <IsoBox x={x + 0.2} y={y + 0.35} z={1.0} w={0.7} d={0.08} h={0.55} topColor="#070b14" leftColor={accent} rightColor="#0F1524" />
      {/* Telephone (right side) */}
      <IsoBox x={x + 1.0} y={y + 0.3} z={0.9} w={0.4} d={0.28} h={0.14} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      <IsoBox x={x + 1.05} y={y + 0.32} z={1.04} w={0.3} d={0.06} h={0.04} topColor="#070b14" leftColor="#1A2238" rightColor="#0B101D" />
      {/* In/out paper tray */}
      <IsoBox x={x + 1.5} y={y + 0.3} z={0.9} w={0.55} d={0.4} h={0.05} topColor="#f6f1e6" leftColor="#cfc9b8" rightColor="#a8a395" />
      <IsoBox x={x + 1.5} y={y + 0.3} z={0.95} w={0.55} d={0.4} h={0.05} topColor={accent} leftColor="#7a4b12" rightColor="#4a2b08" />
      {/* Pen on desk */}
      <IsoBox x={x + 2.05} y={y + 0.6} z={0.9} w={0.2} d={0.03} h={0.02} topColor="#0b101d" leftColor={accent} rightColor="#4a2b08" />
    </pixiContainer>
  );
}

// IsoTellerWindow — small bank teller window (counter + glass + person silhouette)
export function IsoTellerWindow({
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
      {/* Counter */}
      <IsoCounter x={x} y={y} w={1.4} d={0.9} topColor="#3a2415" faceColor="#23170D" />
      {/* Glass partition (thin upright) */}
      <IsoBox x={x + 0.06} y={y + 0.04} z={0.9} w={1.3} d={0.05} h={0.85} topColor="#070b14" leftColor={accent} rightColor="#0b101d" outline={false} />
      {/* Speak hole accent */}
      <IsoBox x={x + 0.55} y={y + 0.04} z={1.4} w={0.3} d={0.05} h={0.1} topColor={accent} leftColor={accent} rightColor="#4a2b08" />
      {/* Slot at the bottom of the glass for cash/docs */}
      <IsoBox x={x + 0.3} y={y + 0.04} z={0.95} w={0.8} d={0.05} h={0.05} topColor="#0b101d" leftColor="#3a2415" rightColor="#0b101d" />
    </pixiContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IsoTrailPath — series of faint glowing dots along a path. Reused for the
// Origin timeline subtle floor trail.

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
      // Faint dotted connecting line
      points.forEach((pt, i) => {
        if (i === 0) return;
        const a = iso(points[i - 1].x, points[i - 1].y);
        const b = iso(pt.x, pt.y);
        g.moveTo(a.x, a.y + TILE_H / 2);
        g.lineTo(b.x, b.y + TILE_H / 2);
        g.stroke({ color: colorHex, alpha: 0.25, width: 1 });
      });
      // Dots at each waypoint
      points.forEach((pt, i) => {
        const p = iso(pt.x, pt.y);
        g.circle(p.x, p.y + TILE_H / 2, 2.2);
        g.fill({ color: colorHex, alpha: 0.55 + i * 0.06 });
        g.circle(p.x, p.y + TILE_H / 2, 4.4);
        g.stroke({ color: colorHex, alpha: 0.22, width: 0.8 });
      });
    },
    [points, color]
  );
  return <pixiGraphics draw={draw} />;
}
