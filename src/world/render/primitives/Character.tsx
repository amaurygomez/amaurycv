import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { useReducedMotion } from "motion/react";
import { iso } from "@/world/lib/iso";
import { hex } from "@/world/render/utils";

type CharacterPose = "stand" | "sit" | "point" | "talk";
type CharacterFacing = "ne" | "nw" | "se" | "sw";
type CharacterAccessory = "none" | "headphones" | "cap" | "tie";

interface CharacterProps {
  x: number;
  y: number;
  pose?: CharacterPose;
  facing?: CharacterFacing;
  // Idle bob amplitude in pixels; 0 disables it.
  bob?: number;
  skin?: string;
  hair?: string;
  shirt?: string;
  pants?: string;
  accent?: string;
  accessory?: CharacterAccessory;
}

const EDGE = 0x050810;
const DARK = 0x070b14;

function darken(color: string, factor: number): number {
  const v = hex(color);
  const r = Math.max(0, Math.floor(((v >> 16) & 0xff) * factor));
  const g = Math.max(0, Math.floor(((v >> 8) & 0xff) * factor));
  const b = Math.max(0, Math.floor((v & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}

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
}: CharacterProps) {
  const [bobY, setBobY] = useState(0);
  const reduced = useReducedMotion();

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
      const accentHex = accent ? hex(accent) : null;

      g.ellipse(fx, fy + 4, 11, 3.5);
      g.fill({ color: 0x000000, alpha: 0.45 });

      g.rect(fx - 5, fy, 4, 3);
      g.fill({ color: DARK });
      g.rect(fx + 1, fy, 4, 3);
      g.fill({ color: DARK });

      g.rect(fx - 4, fy - legH, 3, legH);
      g.fill({ color: hex(pants) });
      g.stroke({ color: EDGE, alpha: 0.65, width: 0.75 });
      g.rect(fx + 1, fy - legH, 3, legH);
      g.fill({ color: darken(pants, 0.8) });
      g.stroke({ color: EDGE, alpha: 0.65, width: 0.75 });

      g.rect(fx - 6, fy - legH - torsoH + 3, 12, torsoH - 3);
      g.fill({ color: shirtHex });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      g.rect(fx - 7, fy - legH - torsoH, 14, 4);
      g.fill({ color: shirtDarkHex });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });

      if (accentHex !== null && accessory === "tie") {
        g.rect(fx - 1, fy - legH - torsoH + 3, 2, torsoH - 5);
        g.fill({ color: accentHex });
        g.rect(fx - 1.5, fy - legH - torsoH + 3, 3, 2);
        g.fill({ color: accentHex });
      } else if (accentHex !== null) {
        g.rect(fx - 2, fy - legH - torsoH, 4, 1.5);
        g.fill({ color: accentHex });
      }

      const armY = fy - legH - torsoH + 4;
      const armH = torsoH - 5;

      if (pose === "point") {
        const dirX = facing === "se" || facing === "ne" ? 1 : -1;
        g.rect(fx - 8 * dirX, armY, 2, armH);
        g.fill({ color: shirtDarkHex });
        g.circle(fx - 8 * dirX + 1, armY + armH + 1, 2);
        g.fill({ color: skinHex });
        g.rect(fx + 5 * dirX, armY + 1, 9 * dirX, 2);
        g.fill({ color: shirtHex });
        g.circle(fx + 14 * dirX, armY + 2, 2);
        g.fill({ color: skinHex });
      } else if (pose === "talk") {
        g.rect(fx - 8, armY, 2, armH);
        g.fill({ color: shirtDarkHex });
        g.circle(fx - 7, armY + armH + 1, 2);
        g.fill({ color: skinHex });
        g.rect(fx + 6, armY, 2, armH - 4);
        g.fill({ color: shirtHex });
        g.rect(fx + 6, armY - 4, 4, 2);
        g.fill({ color: shirtHex });
        g.circle(fx + 10, armY - 3, 2.2);
        g.fill({ color: skinHex });
      } else {
        g.rect(fx - 8, armY, 2, armH);
        g.fill({ color: shirtDarkHex });
        g.circle(fx - 7, armY + armH + 1, 2);
        g.fill({ color: skinHex });
        g.rect(fx + 6, armY, 2, armH);
        g.fill({ color: shirtHex });
        g.circle(fx + 7, armY + armH + 1, 2);
        g.fill({ color: skinHex });
      }

      g.rect(fx - 2, headTop + headSize, 4, 2);
      g.fill({ color: skinHex });

      g.rect(fx - 4, headTop + 1, 8, headSize - 1);
      g.fill({ color: skinHex });
      g.stroke({ color: EDGE, alpha: 0.6, width: 0.75 });
      // Chipped top corners make the square head read as rounded.
      g.rect(fx - 4, headTop, 1, 1);
      g.fill({ color: DARK, alpha: 0.5 });
      g.rect(fx + 3, headTop, 1, 1);
      g.fill({ color: DARK, alpha: 0.5 });
      g.rect(fx - 3, headTop, 6, 1);
      g.fill({ color: skinHex });

      if (accessory === "cap") {
        g.rect(fx - 4, headTop, 8, 3);
        g.fill({ color: hairHex });
        g.stroke({ color: EDGE, alpha: 0.7, width: 0.75 });
        g.rect(fx + 2, headTop + 2, 5, 2);
        g.fill({ color: hairHex });
      } else if (accessory === "headphones") {
        g.rect(fx - 4, headTop, 8, 3);
        g.fill({ color: hairHex });
        g.rect(fx - 5, headTop, 10, 2);
        g.fill({ color: DARK });
        g.rect(fx - 6, headTop + 1, 2, 4);
        g.fill({ color: DARK });
        g.rect(fx + 4, headTop + 1, 2, 4);
        g.fill({ color: DARK });
      } else {
        g.rect(fx - 4, headTop, 8, 3);
        g.fill({ color: hairHex });
        g.stroke({ color: EDGE, alpha: 0.7, width: 0.75 });
      }

      const facingBack = facing === "ne" || facing === "nw";
      if (!facingBack) {
        const eyeY = headTop + 4.5;
        g.rect(fx - 2, eyeY, 1.2, 1.2);
        g.fill({ color: DARK });
        g.rect(fx + 1, eyeY, 1.2, 1.2);
        g.fill({ color: DARK });
        g.rect(fx - 1, eyeY + 3, 3, 0.8);
        g.fill({ color: DARK, alpha: 0.7 });
      }
    },
    [x, y, pose, facing, bobY, skin, hair, shirt, pants, accent, accessory, reduced],
  );

  return <pixiGraphics draw={draw} />;
}
