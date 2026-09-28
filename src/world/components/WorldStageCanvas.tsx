import "pixi.js/unsafe-eval";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { ZONE_META } from "@/world/content/zones";
import { floorBounds, iso } from "@/world/lib/iso";
import { getWorldBounds } from "@/world/lib/worldBounds";
import { WorldMap } from "@/world/render/WorldMap";
import { useWorld } from "@/world/state/useWorld";
import { ZOOM_MAX, ZOOM_MIN } from "@/world/state/context";

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
  userZoom: number,
) {
  const bounds = getWorldBounds();
  const marginX = compactViewport ? 18 : 80;
  const marginY = compactViewport ? 88 : 120;
  const scale =
    Math.min(
      (viewportW - marginX * 2) / bounds.width,
      (viewportH - marginY * 2) / bounds.height,
      1,
    ) * userZoom;
  const x = viewportW / 2 - (bounds.minX + bounds.width / 2) * scale;
  // Compact viewports shift the map down to clear the top bar and chapter strip.
  const y = viewportH / 2 - (bounds.minY + bounds.height / 2) * scale + (compactViewport ? 36 : 0);
  return clampCamera({ x, y, scale }, viewportW, viewportH, compactViewport ? 8 : 16);
}

// Mirrors ZonePanel's breakpoint widths plus its gutter, so a focused room is
// centered in the visible area instead of behind the panel.
function getPanelReservedWidth(viewportW: number) {
  if (viewportW < 640) return 0; // the panel is a bottom drawer here
  if (viewportW < 768) return 408;
  if (viewportW < 1280) return 444;
  return 488;
}

// Per-room framing in tiles, relative to the zone origin: the focus point and the
// area that must stay visible. Anything outside it may sit behind the panel.
type HeroFrame = {
  fx: number;
  fy: number;
  fz?: number;
  fw: number;
  fh: number;
};

const ZONE_HERO_FRAMES: Record<keyof typeof ZONE_META, HeroFrame> = {
  origin: { fx: 3.2, fy: 4.0, fz: -0.2, fw: 6.5, fh: 6.0 },
  pos: { fx: 3.4, fy: 4.0, fz: -0.15, fw: 6.5, fh: 6.0 },
  // Tight on purpose: the .bat corner on the far right sits behind the panel.
  banking: { fx: 2.4, fy: 3.4, fz: -0.15, fw: 4.6, fh: 5.6 },
  telecom: { fx: 2.8, fy: 3.4, fz: -0.1, fw: 6.0, fh: 6.0 },
  "public-sector": { fx: 3.4, fy: 3.6, fz: -0.1, fw: 6.0, fh: 6.0 },
  "ai-lab": { fx: 3.0, fy: 3.6, fz: -0.05, fw: 6.5, fh: 6.0 },
  discipline: { fx: 2.5, fy: 3.6, fz: -0.15, fw: 6.0, fh: 6.0 },
};

function getZoneCamera(
  zoneId: keyof typeof ZONE_META,
  viewportW: number,
  viewportH: number,
  compactViewport: boolean,
  userZoom: number,
) {
  const zoneBounds = ZONE_META[zoneId].bounds;
  const frame = ZONE_HERO_FRAMES[zoneId];

  // Fit the hero frame (plus a small margin) rather than the whole zone.
  const padded = floorBounds(frame.fw + 1.4, frame.fh + 1.4);
  const reservedRight = getPanelReservedWidth(viewportW);
  const safeAreaW = Math.max(360, viewportW - reservedRight);

  const baseScale = Math.min(
    (safeAreaW * (compactViewport ? 0.98 : 0.94)) / padded.width,
    (viewportH * (compactViewport ? 0.82 : 0.88)) / padded.height,
    compactViewport ? 2.1 : 1.9,
  );
  const targetScale = Math.min(
    Math.max(baseScale * userZoom, baseScale * ZOOM_MIN),
    baseScale * ZOOM_MAX,
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

  // After a touch pan or pinch the camera stays where the user left it until
  // the zone, zoom or reset changes.
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

  // Small steps so trackpads, which fire many wheel events, zoom smoothly.
  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (event.ctrlKey) return; // let the browser handle pinch-zoom
      event.preventDefault();
      const delta = event.deltaY > 0 ? -1 : 1;
      setUserZoom(userZoom * (1 + delta * 0.06));
    },
    [setUserZoom, userZoom],
  );

  // Mute the canvas during a pan or pinch so lifting the finger is not a zone tap.
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
    [compactViewport, size.h, size.w],
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
        // The threshold lets short taps through to the hotspots.
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
        const fit = getOverviewCamera(size.w, size.h, compactViewport, 1).scale;
        const nextScale = Math.min(Math.max(cam.scale * (dist / g.lastDist), fit * 0.7), 4);
        const f = nextScale / cam.scale;
        // Zoom around the pinch centroid and follow its drift as a pan.
        applyCamera({
          x: centroid.x - (centroid.x - cam.x) * f + (centroid.x - g.lastCentroid.x),
          y: centroid.y - (centroid.y - cam.y) * f + (centroid.y - g.lastCentroid.y),
          scale: nextScale,
        });
        g.lastCentroid = centroid;
        g.lastDist = dist;
      }
    },
    [applyCamera, compactViewport, setCanvasInteractive, size.h, size.w],
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
    [setCanvasInteractive],
  );

  useEffect(() => {
    if (!size.w || !size.h) return;

    // A size-only change (mobile URL bar collapsing) keeps a user-positioned camera.
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
        compactViewport ? 6 : 14,
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
