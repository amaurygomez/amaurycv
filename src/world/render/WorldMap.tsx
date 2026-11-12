import { useCallback, useLayoutEffect, useRef } from "react";
import type { Container, Graphics } from "pixi.js";
import { useLanguage } from "@/hooks/useLanguage";
import { ZONE_META, ZONE_ORDER } from "@/world/content/zones";
import { iso } from "@/world/lib/iso";
import { useWorld } from "@/world/state/useWorld";
import type { ZoneBounds, ZoneId } from "@/world/types";
import { AmbientGlow } from "./AmbientGlow";
import { Avatar } from "./Avatar";
import { ZoneFloor } from "./ZoneFloor";
import { TagVisibility } from "./primitives/tagVisibility";
import { hex } from "./utils";
import { ZoneHotspot } from "./ZoneHotspot";
import {
  AILabScene,
  BankingScene,
  DisciplineScene,
  OriginScene,
  PosScene,
  PublicSectorScene,
  TelecomScene,
} from "./scenes";

// Chapter numbers follow the career order shown in the navigator, not the draw order.
const CHAPTER: Record<ZoneId, string> = {
  origin: "01",
  pos: "02",
  banking: "03",
  telecom: "04",
  "public-sector": "05",
  "ai-lab": "06",
  discipline: "07",
};

const BUILD_STAGGER_MS = 140;
const BUILD_RISE_MS = 720;

export function WorldMap() {
  const { hoveredZone, activeZone, setHoveredZone, setActiveZone, avatarPos } = useWorld();
  const { lang } = useLanguage();
  const floorRefs = useRef<(Container | null)[]>([]);
  const sceneRefs = useRef<(Container | null)[]>([]);
  const overlayRef = useRef<Container | null>(null);

  // Build-in: the rooms rise one after another, then titles, avatar and hotspots fade in.
  // Pixi objects are driven directly so the map does not re-render on every frame.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = ZONE_ORDER.map((_, i) => [floorRefs.current[i], sceneRefs.current[i]] as const);
    const overlay = overlayRef.current;
    for (const [floor, scene] of layers) {
      if (floor) floor.alpha = 0;
      if (scene) scene.alpha = 0;
    }
    if (overlay) overlay.alpha = 0;

    const start = performance.now();
    const total = (ZONE_ORDER.length - 1) * BUILD_STAGGER_MS + BUILD_RISE_MS;
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      layers.forEach(([floor, scene], i) => {
        const t = Math.min(Math.max((elapsed - i * BUILD_STAGGER_MS) / BUILD_RISE_MS, 0), 1);
        const eased = 1 - Math.pow(1 - t, 3);
        if (floor) floor.alpha = Math.min(1, t * 2.2);
        if (scene) {
          scene.alpha = eased;
          scene.y = (1 - eased) * 34;
        }
      });
      if (overlay) overlay.alpha = Math.min(Math.max((elapsed - total + 200) / 400, 0), 1);
      if (elapsed < total + 250) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <pixiContainer>
      {ZONE_ORDER.map((id, i) => {
        const z = ZONE_META[id];
        return (
          <pixiContainer
            key={`floor-${id}`}
            ref={(node) => {
              floorRefs.current[i] = node;
            }}
          >
            <ZoneFloor
              bounds={z.bounds}
              baseColor={z.floorColor}
              accent={z.accent}
              hovered={hoveredZone === id}
              active={activeZone === id}
            />
          </pixiContainer>
        );
      })}

      {ZONE_ORDER.map((id) => {
        const z = ZONE_META[id];
        const intensity = activeZone === id ? 1 : hoveredZone === id ? 0.76 : 0.42;
        return (
          <AmbientGlow key={`glow-${id}`} bounds={z.bounds} color={z.glow} intensity={intensity} />
        );
      })}

      {ZONE_ORDER.map((id, i) => (
        <pixiContainer
          key={`scene-${id}`}
          ref={(node) => {
            sceneRefs.current[i] = node;
          }}
        >
          <pixiContainer alpha={activeZone !== null && activeZone !== id ? 0.42 : 1}>
            <TagVisibility.Provider value={activeZone === id || hoveredZone === id}>
              <ZoneScene id={id} animate />
            </TagVisibility.Provider>
          </pixiContainer>
        </pixiContainer>
      ))}

      <pixiContainer
        ref={(node) => {
          overlayRef.current = node;
        }}
      >
        <Avatar x={avatarPos.x} y={avatarPos.y} accent="#E8B96B" />

        {activeZone === null &&
          ZONE_ORDER.map((id) => {
            const z = ZONE_META[id];
            const sector = (lang === "es" ? z.sectorEs : z.sectorEn) ?? z.category;
            return (
              <ZoneTitle
                key={`title-${id}`}
                bounds={z.bounds}
                chapter={CHAPTER[id]}
                label={sector}
                accent={z.accent}
                hovered={hoveredZone === id}
              />
            );
          })}

        {ZONE_ORDER.map((id) => {
          const z = ZONE_META[id];
          return (
            <ZoneHotspot
              key={`hot-${id}`}
              id={id}
              bounds={z.bounds}
              accent={z.accent}
              hovered={hoveredZone === id}
              active={activeZone === id}
              onHover={setHoveredZone}
              onSelect={setActiveZone}
            />
          );
        })}
      </pixiContainer>
    </pixiContainer>
  );
}

const TITLE_OVERSAMPLE = 3;

/** Overview label floating over a room: chapter number and sector, readable without zooming. */
function ZoneTitle({
  bounds,
  chapter,
  label,
  accent,
  hovered,
}: {
  bounds: ZoneBounds;
  chapter: string;
  label: string;
  accent: string;
  hovered: boolean;
}) {
  const text = `${chapter}  ${label.toUpperCase()}`;
  const p = iso(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2, 3.4);
  const halfWidth = text.length * 3.9 + 12;
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const color = hex(accent);
      g.roundRect(p.x - halfWidth, p.y - 11, halfWidth * 2, 22, 11);
      g.fill({ color: 0x07090f, alpha: hovered ? 0.96 : 0.82 });
      g.stroke({ color, alpha: hovered ? 1 : 0.55, width: hovered ? 1.4 : 1 });
      g.moveTo(p.x, p.y + 11);
      g.lineTo(p.x, p.y + 26);
      g.stroke({ color, alpha: 0.4, width: 1 });
      g.circle(p.x, p.y + 28, 2);
      g.fill({ color, alpha: 0.8 });
    },
    [accent, halfWidth, hovered, p.x, p.y],
  );

  return (
    <pixiContainer eventMode="none">
      <pixiGraphics draw={draw} />
      <pixiText
        text={text}
        x={p.x}
        y={p.y}
        anchor={0.5}
        scale={1 / TITLE_OVERSAMPLE}
        resolution={TITLE_OVERSAMPLE}
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 11 * TITLE_OVERSAMPLE,
          fontWeight: "700",
          fill: hovered ? "#F2F4F8" : accent,
          letterSpacing: 1.1 * TITLE_OVERSAMPLE,
        }}
      />
    </pixiContainer>
  );
}

function ZoneScene({ id, animate }: { id: ZoneId; animate: boolean }) {
  const bounds = ZONE_META[id].bounds;
  switch (id) {
    case "origin":
      return <OriginScene bounds={bounds} animate={animate} />;
    case "pos":
      return <PosScene bounds={bounds} animate={animate} />;
    case "banking":
      return <BankingScene bounds={bounds} animate={animate} />;
    case "telecom":
      return <TelecomScene bounds={bounds} animate={animate} />;
    case "public-sector":
      return <PublicSectorScene bounds={bounds} animate={animate} />;
    case "ai-lab":
      return <AILabScene bounds={bounds} animate={animate} />;
    case "discipline":
      return <DisciplineScene bounds={bounds} animate={animate} />;
    default:
      return null;
  }
}
