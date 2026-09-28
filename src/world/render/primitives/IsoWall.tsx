import { IsoBox } from "./IsoBox";
import { INK } from "@/world/render/utils";

export function IsoWall({
  x,
  y,
  side = "north",
  length = 1,
  height = 2,
  color = "#0F1524",
}: {
  x: number;
  y: number;
  side?: "north" | "west";
  length?: number;
  height?: number;
  color?: string;
}) {
  if (side === "north") {
    return (
      <IsoBox
        x={x}
        y={y}
        w={length}
        d={0.1}
        h={height}
        topColor="#0B101D"
        leftColor={color}
        rightColor={INK}
      />
    );
  }
  return (
    <IsoBox
      x={x}
      y={y}
      w={0.1}
      d={length}
      h={height}
      topColor="#0B101D"
      leftColor={INK}
      rightColor={color}
    />
  );
}
