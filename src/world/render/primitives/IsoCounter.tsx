import { IsoBox } from "./IsoBox";

export function IsoCounter({
  x,
  y,
  w = 3,
  d = 1,
  topColor = "#1A2238",
  faceColor = "#0F1524",
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  topColor?: string;
  faceColor?: string;
}) {
  return (
    <IsoBox
      x={x}
      y={y}
      w={w}
      d={d}
      h={0.9}
      topColor={topColor}
      leftColor={faceColor}
      rightColor="#0B101D"
    />
  );
}
