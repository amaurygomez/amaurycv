import { IsoBox } from "./IsoBox";

export function IsoCar({ x, y, color = "#5EEAD4" }: { x: number; y: number; color?: string }) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1.6}
        d={0.8}
        h={0.45}
        topColor={color}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.35}
        y={y + 0.15}
        z={0.45}
        w={0.9}
        d={0.5}
        h={0.3}
        topColor={color}
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
    </pixiContainer>
  );
}
