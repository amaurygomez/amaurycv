import { Character } from "./Character";

interface AvatarProps {
  x: number;
  y: number;
  accent?: string;
}

/**
 * Idle Lobby figure — wraps Character with sensible defaults so the
 * Lobby entrance always has the same friendly silhouette.
 */
export function Avatar({ x, y, accent = "#E8B96B" }: AvatarProps) {
  return (
    <Character
      x={x}
      y={y}
      facing="se"
      pose="stand"
      shirt="#1a1f2e"
      pants="#0F1524"
      accent={accent}
      accessory="tie"
    />
  );
}
