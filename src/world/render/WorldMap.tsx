import { ZONE_META, ZONE_ORDER } from "@/world/content/zones";
import { useWorld } from "@/world/state/useWorld";
import type { ZoneId } from "@/world/types";
import { AmbientGlow } from "./AmbientGlow";
import { Avatar } from "./Avatar";
import { ZoneFloor } from "./ZoneFloor";
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
          <AmbientGlow key={`glow-${id}`} bounds={z.bounds} color={z.glow} intensity={intensity} />
        );
      })}

      {ZONE_ORDER.map((id) => (
        <pixiContainer
          key={`scene-${id}`}
          alpha={activeZone !== null && activeZone !== id ? 0.5 : 1}
        >
          <ZoneScene id={id} animate />
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
