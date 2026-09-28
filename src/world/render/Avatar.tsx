import { Character } from "./primitives/Character";

export function Avatar({ x, y, accent = "#E8B96B" }: { x: number; y: number; accent?: string }) {
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
