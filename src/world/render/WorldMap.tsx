/**
 * WorldMap — thin dispatcher.
 *
 * Renders zone floors + ambient glows + per-zone scene modules + avatar +
 * hotspots. Each room's actual composition lives in its own file under
 * ./scenes/. New scene primitives shared across rooms live under ./shared/.
 *
 * This file should stay small. If a room needs new objects, add them to
 * shared/sceneObjects.tsx, not here.
 */
import { useWorld } from "../state/useWorld";
import { ZONE_META, ZONE_ORDER } from "../content/zones";
import type { ZoneId } from "../types";
import { ZoneFloor } from "./ZoneFloor";
import { AmbientGlow } from "./AmbientGlow";
import { ZoneHotspot } from "./ZoneHotspot";
import { Avatar } from "./Avatar";
import {
  AILabScene,
  BankingScene,
  DisciplineScene,
  PosScene,
  OriginScene,
  PublicSectorScene,
  TelecomScene,
} from "./scenes";

export function WorldMap() {
  const { hoveredZone, activeZone, setHoveredZone, setActiveZone, avatarPos } = useWorld();

  return (
    <pixiContainer>
      {ZONE_ORDER.map((id) => {
        const z = ZONE_META[id];
        return (
          <ZoneFloor
            key={`floor-${id}`}
            bounds={z.bounds}
            baseColor={z.floorColor}
            accent={z.accent}
            hovered={hoveredZone === id}
            active={activeZone === id}
          />
        );
      })}

      {ZONE_ORDER.map((id) => {
        const z = ZONE_META[id];
        const intensity = activeZone === id ? 1 : hoveredZone === id ? 0.76 : 0.42;
        return (
          <AmbientGlow
            key={`glow-${id}`}
            bounds={z.bounds}
            color={z.glow}
            intensity={intensity}
          />
        );
      })}

      {ZONE_ORDER.map((id) => (
        <pixiContainer
          key={`scene-${id}`}
          alpha={activeZone !== null && activeZone !== id ? 0.5 : 1}
        >
          <ZoneSceneFor id={id} animate />
        </pixiContainer>
      ))}

      <Avatar x={avatarPos.x} y={avatarPos.y} accent="#E8B96B" />

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
  );
}

function ZoneSceneFor({ id, animate }: { id: ZoneId; animate: boolean }) {
  const bounds = ZONE_META[id].bounds;
  switch (id) {
    case "education-path":
      return <OriginScene bounds={bounds} animate={animate} />;
    case "software-factory":
      return <PosScene bounds={bounds} animate={animate} />;
    case "banking-finance":
      return <BankingScene bounds={bounds} animate={animate} />;
    case "telecom-quality":
      return <TelecomScene bounds={bounds} animate={animate} />;
    case "public-security":
      return <PublicSectorScene bounds={bounds} animate={animate} />;
    case "personal-lab":
      return <AILabScene bounds={bounds} animate={animate} />;
    case "discipline-life":
      return <DisciplineScene bounds={bounds} animate={animate} />;
    default:
      return null;
  }
}
