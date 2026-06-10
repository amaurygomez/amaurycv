import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { iso } from "../lib/iso";

export type CharacterPose = "stand" | "sit" | "point" | "talk";
export type CharacterFacing = "ne" | "nw" | "se" | "sw";
export type CharacterAccessory =
  | "none"
  | "headphones"
  | "cap"
  | "officerHat"
  | "tie";

export interface CharacterProps {
  /** Iso tile coordinates (the figure stands on this tile). */
  x: number;
  y: number;
  pose?: CharacterPose;
  facing?: CharacterFacing;
  /** Idle bob amplitude in pixels. 0 disables. */
  bob?: number;
  skin?: string;
  hair?: string;
  shirt?: string;
  pants?: string;
  accent?: string;
  accessory?: CharacterAccessory;
  badgeColor?: string;
}

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

function darken(hexStr: string, factor: number): number {
  const v = parseInt(hexStr.replace(/^#/, ""), 16);
  const r = Math.max(0, Math.floor(((v >> 16) & 0xff) * factor));
  const g = Math.max(0, Math.floor(((v >> 8) & 0xff) * factor));
  const b = Math.max(0, Math.floor((v & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}

const EDGE = 0x050810;

/**
 * Substantial pixel humanoid. Designed for Lego-style readability at
 * iso scale: proper head silhouette, visible shoulders, hands at the
 * end of arms, defined hair, shoes, drop shadow, and per-pose arms.
 *
 * Drawn from rectangles for crispness — no sprite asset dependency.
 */
export function Character({
  x,
  y,
  pose = "stand",
  facing = "se",
  bob = 1.2,
  skin = "#e8c8a0",
  hair = "#241a08",
  shirt = "#3a4a6a",
  pants = "#1a1f2e",
  accent,
  accessory = "none",
  badgeColor,
}: CharacterProps) {
  const [bobY, setBobY] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!bob || reduced) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      setBobY(Math.sin(t * 1.4 + x * 0.5 + y * 0.5) * bob);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [bob, reduced, x, y]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();

      // Anchor the figure to the tile center; bob lifts the whole body.
      const foot = iso(x + 0.5, y + 0.5);
      const fx = foot.x;
      const fy = foot.y + (reduced ? 0 : bobY);

      const seated = pose === "sit";
      const legH = seated ? 4 : 8;
      const torsoH = seated ? 10 : 13;
      const headSize = 9;
      const headTop = fy - 2 - legH - torsoH - headSize;

      const skinHex = hex(skin);
      const hairHex = hex(hair);
      const shirtHex = hex(shirt);
      const shirtDarkHex = darken(shirt, 0.78);
      const pantsHex = hex(pants);
      const pantsDarkHex = darken(pants, 0.8);
      const accentHex = accent ? hex(accent) : null;

      // ─── Drop shadow ────────────────────────────────────────────────
      g.ellipse(fx, fy + 4, 11, 3.5);
      g.fill({ color: 0x000000, alpha: 0.45 });

      // ─── Shoes / feet ───────────────────────────────────────────────
      g.rect(fx - 5, fy, 4, 3);
      g.fill({ color: 0x070b14 });
      g.rect(fx + 1, fy, 4, 3);
      g.fill({ color: 0x070b14 });

      // ─── Legs (two columns with edge stroke) ────────────────────────
      g.rect(fx - 4, fy - legH, 3, legH);
      g.fill({ color: pantsHex });
      g.stroke({ color: EDGE, alpha: 0.65, width: 0.75 });
      g.rect(fx + 1, fy - legH, 3, legH);
      g.fill({ color: pantsDarkHex });
      g.stroke({ color: EDGE, alpha: 0.65, width: 0.75 });

      // ─── Torso with shoulder shape ──────────────────────────────────
      // Main body
      g.rect(fx - 6, fy - legH - torsoH + 3, 12, torsoH - 3);
      g.fill({ color: shirtHex });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      // Shoulders (slightly wider top strip)
      g.rect(fx - 7, fy - legH - torsoH, 14, 4);
      g.fill({ color: shirtDarkHex });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });

      // Tie / accent stripe down the chest
      if (accentHex !== null && accessory === "tie") {
        g.rect(fx - 1, fy - legH - torsoH + 3, 2, torsoH - 5);
        g.fill({ color: accentHex });
        g.rect(fx - 1.5, fy - legH - torsoH + 3, 3, 2);
        g.fill({ color: accentHex });
      } else if (accentHex !== null) {
        // Subtle collar/badge
        g.rect(fx - 2, fy - legH - torsoH, 4, 1.5);
        g.fill({ color: accentHex });
      }

      // ─── Arms (pose-dependent) + hands ──────────────────────────────
      const armY = fy - legH - torsoH + 4;
      const armH = torsoH - 5;

      if (pose === "point") {
        const dirX = facing === "se" || facing === "ne" ? 1 : -1;
        // Back arm relaxed
        g.rect(fx - 8 * dirX, armY, 2, armH);
        g.fill({ color: shirtDarkHex });
        // Hand on back arm
        g.circle(fx - 8 * dirX + 1, armY + armH + 1, 2);
        g.fill({ color: skinHex });
        // Forward arm extended horizontally
        g.rect(fx + 5 * dirX, armY + 1, 9 * dirX, 2);
        g.fill({ color: shirtHex });
        // Pointing hand
        g.circle(fx + 14 * dirX, armY + 2, 2);
        g.fill({ color: skinHex });
      } else if (pose === "talk") {
        // Left arm down
        g.rect(fx - 8, armY, 2, armH);
        g.fill({ color: shirtDarkHex });
        g.circle(fx - 7, armY + armH + 1, 2);
        g.fill({ color: skinHex });
        // Right arm raised (talking gesture)
        g.rect(fx + 6, armY, 2, armH - 4);
        g.fill({ color: shirtHex });
        g.rect(fx + 6, armY - 4, 4, 2);
        g.fill({ color: shirtHex });
        g.circle(fx + 10, armY - 3, 2.2);
        g.fill({ color: skinHex });
      } else {
        // Stand / sit — symmetric arms
        g.rect(fx - 8, armY, 2, armH);
        g.fill({ color: shirtDarkHex });
        g.circle(fx - 7, armY + armH + 1, 2);
        g.fill({ color: skinHex });
        g.rect(fx + 6, armY, 2, armH);
        g.fill({ color: shirtHex });
        g.circle(fx + 7, armY + armH + 1, 2);
        g.fill({ color: skinHex });
      }

      // ─── Neck ───────────────────────────────────────────────────────
      g.rect(fx - 2, headTop + headSize, 4, 2);
      g.fill({ color: skinHex });

      // ─── Head silhouette (rounded with side rects) ──────────────────
      // Main head face
      g.rect(fx - 4, headTop + 1, 8, headSize - 1);
      g.fill({ color: skinHex });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      // Top corners chipped to suggest roundness
      g.rect(fx - 4, headTop, 1, 1);
      g.fill({ color: 0x070b14, alpha: 0.5 });
      g.rect(fx + 3, headTop, 1, 1);
      g.fill({ color: 0x070b14, alpha: 0.5 });
      g.rect(fx - 3, headTop, 6, 1);
      g.fill({ color: skinHex });

      // ─── Hair / hats ────────────────────────────────────────────────
      if (accessory === "officerHat") {
        // Cap top
        g.rect(fx - 5, headTop - 3, 10, 4);
        g.fill({ color: 0x152033 });
        g.stroke({ color: EDGE, alpha: 0.7, width: 0.75 });
        // Brim
        g.rect(fx - 6, headTop, 12, 2);
        g.fill({ color: 0x0b1020 });
        // Badge
        g.rect(fx - 1.5, headTop - 2, 3, 1.5);
        g.fill({ color: badgeColor ? hex(badgeColor) : 0xe8b96b });
      } else if (accessory === "cap") {
        // Baseball cap
        g.rect(fx - 4, headTop, 8, 3);
        g.fill({ color: hairHex });
        g.stroke({ color: EDGE, alpha: 0.7, width: 0.75 });
        // Visor
        g.rect(fx + 2, headTop + 2, 5, 2);
        g.fill({ color: hairHex });
      } else if (accessory === "headphones") {
        // Hair underneath
        g.rect(fx - 4, headTop, 8, 3);
        g.fill({ color: hairHex });
        // Headband
        g.rect(fx - 5, headTop, 10, 2);
        g.fill({ color: 0x070b14 });
        // Ear cups
        g.rect(fx - 6, headTop + 1, 2, 4);
        g.fill({ color: 0x070b14 });
        g.rect(fx + 4, headTop + 1, 2, 4);
        g.fill({ color: 0x070b14 });
      } else {
        // Default hair
        g.rect(fx - 4, headTop, 8, 3);
        g.fill({ color: hairHex });
        g.stroke({ color: EDGE, alpha: 0.7, width: 0.75 });
      }

      // ─── Eyes ───────────────────────────────────────────────────────
      const eyeY = headTop + 4.5;
      const facingBack = facing === "ne" || facing === "nw";
      if (!facingBack) {
        const dx = facing === "se" ? 0 : 0;
        void dx;
        g.rect(fx - 2, eyeY, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
        g.rect(fx + 1, eyeY, 1.2, 1.2);
        g.fill({ color: 0x070b14 });
      }

      // ─── Smile / mouth hint ─────────────────────────────────────────
      if (!facingBack) {
        g.rect(fx - 1, eyeY + 3, 3, 0.8);
        g.fill({ color: 0x070b14, alpha: 0.7 });
      }
    },
    [
      x,
      y,
      pose,
      facing,
      bobY,
      skin,
      hair,
      shirt,
      pants,
      accent,
      accessory,
      badgeColor,
      reduced,
    ]
  );

  return <pixiGraphics draw={draw} />;
}
