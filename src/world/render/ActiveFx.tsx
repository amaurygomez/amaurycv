/**
 * Active zone ambient animations — triggered only when a zone is selected.
 * Uses setInterval (not RAF) so they stay independent of character bob loops.
 * All intervals are cleaned up on unmount / when isActive goes false.
 */
import { useCallback, useEffect, useState } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "../lib/iso";

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

function useMotionTime(speed = 1, offset = 0) {
  const [time, setTime] = useState(offset);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const frameMs = window.innerWidth < 640 ? 33 : 16;
    const loop = (now: number) => {
      if (now - last >= frameMs) {
        last = now;
        setTime(((now - start) / 1000) * speed + offset);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [offset, reduced, speed]);

  return time;
}

// ─────────────────────────────────────────────────────────────────────────────
// TerminalGlow — pulsing halo ring around a terminal position.

export function TerminalGlow({
  x,
  y,
  isActive,
}: {
  x: number;
  y: number;
  isActive: boolean;
}) {
  const [alpha, setAlpha] = useState(0.15);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || reduced) return;
    let rising = true;
    const id = setInterval(() => {
      setAlpha((prev) => {
        if (rising) {
          const next = prev + 0.07;
          if (next >= 0.5) { rising = false; return 0.5; }
          return next;
        } else {
          const next = prev - 0.07;
          if (next <= 0.15) { rising = true; return 0.15; }
          return next;
        }
      });
    }, 600);
    return () => clearInterval(id);
  }, [isActive, reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      if (alpha <= 0) return;
      const c = iso(x + 0.7, y + 0.7);
      const cx = c.x;
      const cy = c.y + TILE_H / 2;
      // Soft elliptical halo on the floor
      g.ellipse(cx, cy, 28, 14);
      g.fill({ color: 0x5eead4, alpha });
      g.ellipse(cx, cy, 20, 10);
      g.stroke({ color: 0x5eead4, alpha: alpha * 1.5, width: 1.2 });
    },
    [x, y, alpha]
  );

  if (!isActive) return null;
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ServerLedPulse — 5 LEDs pulsing in sequence at the server rack position.

export function ServerLedPulse({
  x,
  y,
  isActive,
}: {
  x: number;
  y: number;
  isActive: boolean;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || reduced) return;
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 5);
    }, 200);
    return () => clearInterval(id);
  }, [isActive, reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const LED_COLORS = [0x34d399, 0xe8b96b, 0x5eead4, 0x34d399, 0xfbbf24];
      for (let i = 0; i < 5; i += 1) {
        const ledZ = 2.2 - i * 0.4;
        const p = iso(x, y, ledZ);
        const bright = i === activeIdx;
        g.rect(p.x - 5, p.y - 2, 5, 5);
        g.fill({ color: LED_COLORS[i], alpha: bright ? 1 : 0.25 });
        if (bright) {
          g.rect(p.x - 8, p.y - 5, 11, 11);
          g.fill({ color: LED_COLORS[i], alpha: 0.2 });
        }
      }
    },
    [x, y, activeIdx]
  );

  if (!isActive) return null;
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// DashboardFlicker — brief alpha flash on an overlay rect, suggesting data refresh.

export function DashboardFlicker({
  x,
  y,
  isActive,
}: {
  x: number;
  y: number;
  isActive: boolean;
}) {
  const [flash, setFlash] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || reduced) return;
    const trigger = () => {
      setFlash(true);
      const off = setTimeout(() => setFlash(false), 150);
      return off;
    };
    let offTimer: ReturnType<typeof setTimeout> | null = null;
    const id = setInterval(() => {
      if (offTimer) clearTimeout(offTimer);
      offTimer = trigger();
    }, 1800);
    return () => {
      clearInterval(id);
      if (offTimer) clearTimeout(offTimer);
    };
  }, [isActive, reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      if (!flash) return;
      // Flash overlay on the wall screens area
      const tl = iso(x, y, 1.2);
      const tr = iso(x + 6, y, 1.2);
      const br = iso(x + 6, y, 2.1);
      const bl = iso(x, y, 2.1);
      g.poly([tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
      g.fill({ color: 0x34d399, alpha: 0.18 });
    },
    [x, y, flash]
  );

  if (!isActive) return null;
  return <pixiGraphics draw={draw} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PortalPulse — sine-wave gold glow on the contact portal door.

export function PortalPulse({
  x,
  y,
  w,
  h,
  isActive,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  isActive: boolean;
}) {
  const [glowAlpha, setGlowAlpha] = useState(0.25);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || reduced) return;
    const start = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      setGlowAlpha(0.25 + ((Math.sin(t * 2) + 1) / 2) * 0.45);
    }, 400);
    return () => clearInterval(id);
  }, [isActive, reduced]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      if (glowAlpha <= 0) return;
      // Gold glow wash over the door frame
      const tl = iso(x, y, 0);
      const tr = iso(x + w, y, 0);
      const br = iso(x + w, y + h, 0);
      const bl = iso(x, y + h, 0);
      g.poly([
        tl.x, tl.y + 16,
        tr.x, tr.y + 16,
        br.x, br.y + 16,
        bl.x, bl.y + 16,
      ]);
      g.fill({ color: 0xe8b96b, alpha: glowAlpha });
      // Door arch highlight
      const dc = iso(x + w / 2, y, 1.2);
      g.ellipse(dc.x, dc.y, w * 28, 16);
      g.fill({ color: 0xe8b96b, alpha: glowAlpha * 0.6 });
    },
    [x, y, w, h, glowAlpha]
  );

  if (!isActive) return null;
  return <pixiGraphics draw={draw} />;
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
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function WaveformPulse({
  x,
  y,
  color = "#F87171",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime((Math.PI * 2) / 0.8, x * 0.13);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      const p = iso(x + 0.5, y + 0.5, 1.05);
      for (let i = 0; i < 8; i += 1) {
        const h = 3 + Math.abs(Math.sin(t + i * 0.7)) * 10;
        g.rect(p.x - 18 + i * 5, p.y - h / 2, 2.4, h);
        g.fill({ color: colorHex, alpha: isActive ? 0.8 : 0.46 });
      }
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function DataPacketLine({
  from,
  to,
  color = "#5EEAD4",
  isActive,
  offset = 0,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  isActive: boolean;
  offset?: number;
}) {
  const t = useMotionTime(0.8, offset);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const a = iso(from.x, from.y);
      const b = iso(to.x, to.y);
      const ax = a.x;
      const ay = a.y + TILE_H / 2;
      const bx = b.x;
      const by = b.y + TILE_H / 2;
      const colorHex = hex(color);
      g.moveTo(ax, ay);
      g.lineTo(bx, by);
      g.stroke({ color: colorHex, alpha: isActive ? 0.34 : 0.2, width: 1.2 });

      const p = t % 1;
      const px = ax + (bx - ax) * p;
      const py = ay + (by - ay) * p;
      g.circle(px, py, 3.4);
      g.fill({ color: colorHex, alpha: isActive ? 0.9 : 0.55 });
      g.circle(px, py, 7);
      g.stroke({ color: colorHex, alpha: isActive ? 0.32 : 0.18, width: 1 });
    },
    [from, to, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function ApprovalStampFx({
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
  const t = useMotionTime(1.4, x * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.05);
      const colorHex = hex(color);
      const pulse = 0.65 + Math.sin(t * Math.PI * 2) * 0.18;
      g.circle(p.x, p.y, 12 + pulse * 3);
      g.stroke({ color: colorHex, alpha: isActive ? 0.65 : 0.38, width: 1.5 });
      g.moveTo(p.x - 6, p.y);
      g.lineTo(p.x - 1, p.y + 5);
      g.lineTo(p.x + 8, p.y - 7);
      g.stroke({ color: colorHex, alpha: isActive ? 0.9 : 0.55, width: 2 });
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function ReceiptFeedFx({
  x,
  y,
  color = "#FBBF24",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(1.6, y * 0.18);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.1);
      const colorHex = hex(color);
      for (let i = 0; i < 5; i += 1) {
        const dy = ((t * 16 + i * 8) % 38) - 18;
        g.rect(p.x - 11, p.y - dy, 22, 1.5);
        g.fill({ color: colorHex, alpha: isActive ? 0.72 : 0.42 });
      }
    },
    [x, y, color, isActive, t]
  );

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
        const px = p.x + Math.cos(a) * 26;
        const py = p.y + Math.sin(a) * 11;
        g.circle(px, py, 3);
        g.fill({ color: colorHex, alpha: isActive ? 0.9 : 0.55 });
      }
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function CameraFeedGlow({
  x,
  y,
  w = 2,
  color = "#5EEAD4",
  isActive,
}: {
  x: number;
  y: number;
  w?: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(1.3, x * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      const a = 0.14 + Math.abs(Math.sin(t)) * (isActive ? 0.26 : 0.14);
      const tl = iso(x, y, 1.25);
      const tr = iso(x + w, y, 1.25);
      const br = iso(x + w, y, 2.05);
      const bl = iso(x, y, 2.05);
      g.poly([tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
      g.fill({ color: colorHex, alpha: a });
    },
    [x, y, w, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function RadarSweepFx({
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
  const t = useMotionTime(0.34, x * 0.12);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 2.45);
      const colorHex = hex(color);
      const angle = t * Math.PI * 2;
      g.circle(p.x, p.y, 17);
      g.stroke({ color: colorHex, alpha: isActive ? 0.48 : 0.3, width: 1.2 });
      g.moveTo(p.x, p.y);
      g.lineTo(p.x + Math.cos(angle) * 17, p.y + Math.sin(angle) * 17);
      g.stroke({ color: colorHex, alpha: isActive ? 0.9 : 0.55, width: 1.6 });
      g.arc(p.x, p.y, 12, angle - 0.5, angle, false);
      g.stroke({ color: colorHex, alpha: isActive ? 0.55 : 0.32, width: 4 });
    },
    [x, y, color, isActive, t]
  );

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
    [points, color, isActive, t]
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
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
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
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function MonitorCursorFx({
  x,
  y,
  color = "#A78BFA",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(1.2, y * 0.14);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(color);
      const p = iso(x + 0.5, y + 0.5, 1.22);
      const blink = Math.sin(t * Math.PI * 2) > 0 ? 1 : 0.25;
      g.rect(p.x - 13, p.y - 8, 18, 1.4);
      g.fill({ color: colorHex, alpha: isActive ? 0.7 : 0.42 });
      g.rect(p.x - 13, p.y - 3, 11, 1.4);
      g.fill({ color: colorHex, alpha: isActive ? 0.5 : 0.3 });
      g.rect(p.x + 7, p.y - 9, 2, 9);
      g.fill({ color: colorHex, alpha: (isActive ? 0.9 : 0.55) * blink });
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function CameraSweepFx({
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
  const t = useMotionTime(0.7, x * 0.17);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 1.25);
      const colorHex = hex(color);
      const sweep = Math.sin(t * Math.PI * 2) * 12;
      g.moveTo(p.x + 7, p.y - 23);
      g.lineTo(p.x + 28 + sweep, p.y - 12);
      g.lineTo(p.x + 20 + sweep, p.y + 5);
      g.closePath();
      g.fill({ color: colorHex, alpha: isActive ? 0.2 : 0.11 });
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
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
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function GymBarBounceFx({
  x,
  y,
  color = "#E8B96B",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(0.85, x * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const lift = Math.abs(Math.sin(t * Math.PI * 2)) * 5;
      const p = iso(x + 0.8, y + 0.45, 0.35);
      g.moveTo(p.x - 24, p.y - lift);
      g.lineTo(p.x + 24, p.y - lift);
      g.stroke({ color: 0xf7f3ea, alpha: isActive ? 0.9 : 0.65, width: 2 });
      [-30, -25, 25, 30].forEach((dx) => {
        g.rect(p.x + dx, p.y - 9 - lift, 4, 18);
        g.fill({ color: hex(color), alpha: isActive ? 0.9 : 0.62 });
      });
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function BadgeGlowFx({
  x,
  y,
  color = "#60A5FA",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(0.18);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.55, y + 0.5, 0.92);
      const pulse = 0.45 + Math.abs(Math.sin(t * Math.PI * 2)) * 0.45;
      const colorHex = hex(color);
      g.circle(p.x, p.y, 17 + pulse * 6);
      g.fill({ color: colorHex, alpha: (isActive ? 0.2 : 0.12) * pulse });
      g.circle(p.x, p.y, 8);
      g.stroke({ color: colorHex, alpha: isActive ? 0.8 : 0.5, width: 1.5 });
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function PageFlipFx({
  x,
  y,
  color = "#E8B96B",
  isActive,
}: {
  x: number;
  y: number;
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(0.75, y * 0.1);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.5, 0.92);
      const flip = Math.abs(Math.sin(t * Math.PI * 2));
      const colorHex = hex(color);
      g.rect(p.x - 15, p.y - 8, 14, 11);
      g.fill({ color: 0xf7f3ea, alpha: isActive ? 0.82 : 0.62 });
      g.rect(p.x + 1, p.y - 8, 14, 11);
      g.fill({ color: 0xf7f3ea, alpha: isActive ? 0.72 : 0.52 });
      g.moveTo(p.x + 1, p.y - 8);
      g.lineTo(p.x + 1 + 12 * flip, p.y - 10 + 6 * flip);
      g.lineTo(p.x + 1, p.y + 3);
      g.closePath();
      g.fill({ color: colorHex, alpha: isActive ? 0.46 : 0.28 });
    },
    [x, y, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}

export function ProgressPathFx({
  points,
  color = "#60A5FA",
  isActive,
}: {
  points: readonly { x: number; y: number }[];
  color?: string;
  isActive: boolean;
}) {
  const t = useMotionTime(0.7);
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      if (points.length < 2) return;
      const colorHex = hex(color);
      const screen = points.map((p) => {
        const projected = iso(p.x, p.y);
        return { x: projected.x, y: projected.y + TILE_H / 2 };
      });
      screen.forEach((p, index) => {
        if (index === 0) return;
        const prev = screen[index - 1];
        g.moveTo(prev.x, prev.y);
        g.lineTo(p.x, p.y);
        g.stroke({ color: colorHex, alpha: isActive ? 0.38 : 0.24, width: 2 });
      });
      const progress = ((t % 1) + 1) % 1;
      const rawSegment = progress * (screen.length - 1);
      const segment = Math.min(Math.floor(rawSegment), screen.length - 2);
      const local = rawSegment - segment;
      const a = screen[segment];
      const b = screen[segment + 1];
      if (!a || !b) return;
      const px = a.x + (b.x - a.x) * local;
      const py = a.y + (b.y - a.y) * local;
      g.circle(px, py, 4);
      g.fill({ color: colorHex, alpha: isActive ? 0.95 : 0.58 });
    },
    [points, color, isActive, t]
  );

  return <pixiGraphics draw={draw} />;
}
