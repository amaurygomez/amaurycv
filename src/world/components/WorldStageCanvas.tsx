import "pixi.js/unsafe-eval";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { ZONE_META } from "../content/zones";
import { floorBounds, iso } from "../lib/iso";
import { getWorldBounds } from "../lib/worldBounds";
import { WorldMap } from "../render/WorldMap";
import { useWorld } from "../state/useWorld";
import { ZOOM_MAX, ZOOM_MIN } from "../state/context";

extend({ Container, Graphics, Text, Sprite });

const BEZIER = [0.22, 1, 0.36, 1] as const;

type CameraState = { x: number; y: number; scale: number };

function cubicBezierEase(t: number) {
  const [, p1y, , p2y] = BEZIER;
  const u = 1 - t;
  return 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t;
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function softClamp(value: number, min: number, max: number, resistance = 0.2) {
  if (min > max) return (min + max) / 2;
  if (value < min) return min - (min - value) * resistance;
  if (value > max) return max + (value - max) * resistance;
  return value;
}

function clampCamera(camera: CameraState, viewportW: number, viewportH: number, padding: number) {
  const bounds = getWorldBounds();
  const scaledMinX = bounds.minX * camera.scale;
  const scaledMaxX = (bounds.minX + bounds.width) * camera.scale;
  const scaledMinY = bounds.minY * camera.scale;
  const scaledMaxY = (bounds.minY + bounds.height) * camera.scale;

  const minX = viewportW - padding - scaledMaxX;
  const maxX = padding - scaledMinX;
  const minY = viewportH - padding - scaledMaxY;
  const maxY = padding - scaledMinY;

  return {
    x: softClamp(camera.x, minX, maxX, 0.18),
    y: softClamp(camera.y, minY, maxY, 0.18),
    scale: camera.scale,
  };
}

function getOverviewCamera(
  viewportW: number,
  viewportH: number,
  compactViewport: boolean,
  userZoom: number
) {
  const bounds = getWorldBounds();
  const marginX = compactViewport ? 18 : 80;
  const marginY = compactViewport ? 88 : 120;
  const scale =
    Math.min(
      (viewportW - marginX * 2) / bounds.width,
      (viewportH - marginY * 2) / bounds.height,
      1
    ) * userZoom;
  const x = viewportW / 2 - (bounds.minX + bounds.width / 2) * scale;
  // Compact viewports nudge the map slightly below center to clear the top
  // bar + chapter chip strip while keeping it visually centered.
  const y =
    viewportH / 2 -
    (bounds.minY + bounds.height / 2) * scale +
    (compactViewport ? 36 : 0);
  return clampCamera({ x, y, scale }, viewportW, viewportH, compactViewport ? 8 : 16);
}

// ZonePanel sits on the right with breakpoint-aware widths (sm 380 / md 400
// / xl 440) and a ~20-44px right gutter. We reserve this strip when focusing
// a zone so the active room is centered in the SAFE AREA (viewport minus
// panel), not buried behind it.
function getPanelReservedWidth(viewportW: number) {
  if (viewportW < 640) return 0; // mobile uses bottom drawer, full width is safe
  if (viewportW < 768) return 408; // 380 panel + 28 gutter
  if (viewportW < 1280) return 444; // 400 panel + 44 gutter
  return 488; // 440 panel + 48 gutter
}

// Per-zone hero frame: a sub-rectangle of the zone (in tile coords, relative
// to the zone origin) that should be fully inside the safe area. Combined
// with the focus point, this gives precise control over how each room is
// framed. Sizing this tighter than the full zone bounds lets us "zoom in"
// on the hero composition and intentionally let secondary props (right
// strips, deep corners) sit partly behind the panel without losing hero.
type HeroFrame = {
  fx: number; // focus x in tile coords (relative to zoneBounds.x)
  fy: number; // focus y in tile coords (relative to zoneBounds.y)
  fz?: number;
  fw: number; // hero rectangle width to fit in the safe area
  fh: number; // hero rectangle height to fit in the viewport
};

const ZONE_HERO_FRAMES: Record<keyof typeof ZONE_META, HeroFrame> = {
  // Origin — childhood + technical training + scholarship spread across the room
  "education-path": { fx: 3.2, fy: 4.0, fz: -0.2, fw: 6.5, fh: 6.0 },
  // POS room — sale area is the hero, with lottery + vehicle in the wings
  "software-factory": { fx: 3.4, fy: 4.0, fz: -0.15, fw: 6.5, fh: 6.0 },
  // Banking — TIGHT frame on the banker desk + Jasper printer hero. The
  // .bat strip on the far right is intentionally outside this frame and
  // expected to sit behind the right panel.
  "banking-finance": { fx: 2.4, fy: 3.4, fz: -0.15, fw: 4.6, fh: 5.6 },
  // Telecom — service counter + coverage hero center
  "telecom-quality": { fx: 2.8, fy: 3.4, fz: -0.1, fw: 6.0, fh: 6.0 },
  // Public Sector — meeting table is the centerpiece
  "public-security": { fx: 3.4, fy: 3.6, fz: -0.1, fw: 6.0, fh: 6.0 },
  // AI Lab — operator + architecture spread the whole room
  "personal-lab": { fx: 3.0, fy: 3.6, fz: -0.05, fw: 6.5, fh: 6.0 },
  // Discipline — mountain + BBQ split, center on the seam between them
  "discipline-life": { fx: 2.5, fy: 3.6, fz: -0.15, fw: 6.0, fh: 6.0 },
};

function getZoneCamera(
  zoneId: keyof typeof ZONE_META,
  viewportW: number,
  viewportH: number,
  compactViewport: boolean,
  userZoom: number
) {
  const zoneBounds = ZONE_META[zoneId].bounds;
  const frame = ZONE_HERO_FRAMES[zoneId];

  // Scale to fit the hero rectangle (not the whole zone) into the safe area.
  // A small extra margin keeps the hero from kissing the edges.
  const padded = floorBounds(frame.fw + 1.4, frame.fh + 1.4);
  const reservedRight = getPanelReservedWidth(viewportW);
  const safeAreaW = Math.max(360, viewportW - reservedRight);

  const baseScale = Math.min(
    (safeAreaW * (compactViewport ? 0.98 : 0.94)) / padded.width,
    (viewportH * (compactViewport ? 0.82 : 0.88)) / padded.height,
    compactViewport ? 2.1 : 1.9
  );
  const targetScale = Math.min(
    Math.max(baseScale * userZoom, baseScale * ZOOM_MIN),
    baseScale * ZOOM_MAX
  );

  const focus = { x: zoneBounds.x + frame.fx, y: zoneBounds.y + frame.fy, z: frame.fz ?? 0 };
  const zoneMid = iso(focus.x, focus.y, focus.z);
  const x = safeAreaW / 2 - zoneMid.x * targetScale;
  const y = viewportH / (compactViewport ? 2.4 : 2) - zoneMid.y * targetScale;
  return clampCamera({ x, y, scale: targetScale }, viewportW, viewportH, compactViewport ? 6 : 14);
}

export default function WorldStageCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<CameraState>({ x: 0, y: 0, scale: 1 });
  const animationRef = useRef<number | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, scale: 1 });
  const { activeZone, userZoom, setUserZoom, cameraResetNonce } = useWorld();

  // Touch gesture state (drag-pan + pinch-zoom). While the user is mid-gesture
  // or has manually moved the camera ("free camera"), the auto-framing
  // animation is suspended until the next zone/zoom/reset change.
  const gestureRef = useRef<{
    pointers: Map<number, { x: number; y: number }>;
    start: { x: number; y: number } | null;
    panning: boolean;
    lastCentroid: { x: number; y: number } | null;
    lastDist: number | null;
  }>({ pointers: new Map(), start: null, panning: false, lastCentroid: null, lastDist: null });
  const freeCameraRef = useRef(false);
  const lastTargetKeyRef = useRef("");

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize({ w: Math.floor(rect.width), h: Math.floor(rect.height) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const compactViewport = size.w > 0 && size.w < 640;
  const targetCamera = useMemo(() => {
    if (!size.w || !size.h) return { x: 0, y: 0, scale: 1 };
    return activeZone
      ? getZoneCamera(activeZone, size.w, size.h, compactViewport, userZoom)
      : getOverviewCamera(size.w, size.h, compactViewport, userZoom);
  }, [activeZone, compactViewport, size.h, size.w, userZoom]);

  // Wheel-to-zoom on the canvas. Active in both overview and zone modes.
  // We use trackpad-friendly damping so a single wheel notch nudges zoom
  // by ~6% rather than slamming the limits.
  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (event.ctrlKey) return; // let the browser handle pinch-zoom
      event.preventDefault();
      const delta = event.deltaY > 0 ? -1 : 1;
      setUserZoom(userZoom * (1 + delta * 0.06));
    },
    [setUserZoom, userZoom]
  );

  // Pixi's canvas needs pointer events for hotspot taps, but once a pan/pinch
  // starts we mute it so lifting the finger doesn't fire a zone tap.
  const setCanvasInteractive = useCallback((on: boolean) => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (canvas) canvas.style.pointerEvents = on ? "auto" : "none";
  }, []);

  const applyCamera = useCallback(
    (next: CameraState) => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      const clamped = clampCamera(next, size.w, size.h, compactViewport ? 6 : 14);
      cameraRef.current = clamped;
      setCamera(clamped);
    },
    [compactViewport, size.h, size.w]
  );

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    const g = gestureRef.current;
    g.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const pts = [...g.pointers.values()];
    if (pts.length === 1) {
      g.start = { ...pts[0] };
      g.lastCentroid = { ...pts[0] };
      g.lastDist = null;
    } else if (pts.length === 2) {
      g.lastCentroid = {
        x: (pts[0].x + pts[1].x) / 2,
        y: (pts[0].y + pts[1].y) / 2,
      };
      g.lastDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g.pointers.has(event.pointerId)) return;
      g.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const pts = [...g.pointers.values()];

      if (pts.length === 1 && g.lastCentroid && g.start) {
        // Drag-pan with a small threshold so taps still reach the hotspots.
        if (!g.panning) {
          const moved = Math.hypot(pts[0].x - g.start.x, pts[0].y - g.start.y);
          if (moved < 8) return;
          g.panning = true;
          freeCameraRef.current = true;
          setCanvasInteractive(false);
        }
        const dx = pts[0].x - g.lastCentroid.x;
        const dy = pts[0].y - g.lastCentroid.y;
        g.lastCentroid = { ...pts[0] };
        const cam = cameraRef.current;
        applyCamera({ x: cam.x + dx, y: cam.y + dy, scale: cam.scale });
        return;
      }

      if (pts.length >= 2 && g.lastCentroid && g.lastDist) {
        const centroid = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        };
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (!g.panning) {
          g.panning = true;
          freeCameraRef.current = true;
          setCanvasInteractive(false);
        }
        const cam = cameraRef.current;
        // Keep pinch scale within sane bounds relative to the overview fit.
        const fit = getOverviewCamera(size.w, size.h, compactViewport, 1).scale;
        const nextScale = Math.min(Math.max(cam.scale * (dist / g.lastDist), fit * 0.7), 4);
        const f = nextScale / cam.scale;
        // Zoom around the pinch centroid, plus the centroid's own drift (pan).
        applyCamera({
          x: centroid.x - (centroid.x - cam.x) * f + (centroid.x - g.lastCentroid.x),
          y: centroid.y - (centroid.y - cam.y) * f + (centroid.y - g.lastCentroid.y),
          scale: nextScale,
        });
        g.lastCentroid = centroid;
        g.lastDist = dist;
      }
    },
    [applyCamera, compactViewport, setCanvasInteractive, size.h, size.w]
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g.pointers.delete(event.pointerId)) return;
      const pts = [...g.pointers.values()];
      g.lastDist = pts.length >= 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : null;
      g.lastCentroid =
        pts.length >= 2
          ? { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
          : pts.length === 1
            ? { ...pts[0] }
            : null;
      if (pts.length === 1) g.start = { ...pts[0] };
      if (pts.length === 0) {
        g.panning = false;
        g.start = null;
        setCanvasInteractive(true);
      }
    },
    [setCanvasInteractive]
  );

  useEffect(() => {
    if (!size.w || !size.h) return;

    // Re-frame on zone/zoom/reset changes; a size-only change (e.g. mobile
    // URL bar collapse) keeps a user-positioned camera where it is.
    const targetKey = `${activeZone ?? "overview"}|${userZoom}|${cameraResetNonce}`;
    const keyChanged = lastTargetKeyRef.current !== targetKey;
    lastTargetKeyRef.current = targetKey;
    if (freeCameraRef.current) {
      if (!keyChanged) return;
      freeCameraRef.current = false;
    }

    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);

    const start = performance.now();
    const from = cameraRef.current;
    const to = targetCamera;
    const duration = compactViewport ? 520 : 680;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = cubicBezierEase(progress);
      const next = clampCamera(
        {
          x: lerp(from.x, to.x, eased),
          y: lerp(from.y, to.y, eased),
          scale: lerp(from.scale, to.scale, eased),
        },
        size.w,
        size.h,
        compactViewport ? 6 : 14
      );

      cameraRef.current = next;
      setCamera(next);

      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
      else animationRef.current = null;
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [activeZone, cameraResetNonce, compactViewport, size.h, size.w, targetCamera, userZoom]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ touchAction: "none" }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      {size.w > 0 && size.h > 0 && (
        <Application
          width={size.w}
          height={size.h}
          background="#070B14"
          preference="webgl"
          antialias
          resolution={window.devicePixelRatio || 1}
          autoDensity
        >
          <pixiContainer x={camera.x} y={camera.y} scale={camera.scale}>
            <WorldMap />
          </pixiContainer>
        </Application>
      )}
    </div>
  );
}
