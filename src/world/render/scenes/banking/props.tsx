import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso, TILE_H } from "@/world/lib/iso";
import { IsoBox } from "@/world/render/primitives/IsoBox";
import { IsoCounter } from "@/world/render/primitives/IsoCounter";
import { INK, hex } from "@/world/render/utils";

export function IsoLoanCounter({
  x,
  y,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoCounter x={x} y={y} w={2.6} d={1.2} topColor="#2a1f12" faceColor="#160E07" />
      <IsoBox
        x={x + 0.25}
        y={y + 0.25}
        z={0.9}
        w={0.32}
        d={0.32}
        h={0.1}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 0.2}
        y={y + 0.35}
        z={1.0}
        w={0.7}
        d={0.08}
        h={0.55}
        topColor={INK}
        leftColor={accent}
        rightColor="#0F1524"
      />
      <IsoBox
        x={x + 1.0}
        y={y + 0.3}
        z={0.9}
        w={0.4}
        d={0.28}
        h={0.14}
        topColor="#1A2238"
        leftColor="#0F1524"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 1.05}
        y={y + 0.32}
        z={1.04}
        w={0.3}
        d={0.06}
        h={0.04}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0B101D"
      />
      <IsoBox
        x={x + 1.5}
        y={y + 0.3}
        z={0.9}
        w={0.55}
        d={0.4}
        h={0.05}
        topColor="#f6f1e6"
        leftColor="#cfc9b8"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 1.5}
        y={y + 0.3}
        z={0.95}
        w={0.55}
        d={0.4}
        h={0.05}
        topColor={accent}
        leftColor="#7a4b12"
        rightColor="#4a2b08"
      />
      <IsoBox
        x={x + 2.05}
        y={y + 0.6}
        z={0.9}
        w={0.2}
        d={0.03}
        h={0.02}
        topColor="#0b101d"
        leftColor={accent}
        rightColor="#4a2b08"
      />
    </pixiContainer>
  );
}

export function IsoJasperPrinter({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1.15}
        d={1.0}
        h={0.58}
        topColor="#f6f1e6"
        leftColor="#a8a395"
        rightColor="#7a7156"
      />
      <IsoBox
        x={x + 0.15}
        y={y + 0.1}
        z={0.58}
        w={0.85}
        d={0.12}
        h={0.06}
        topColor={accent}
        leftColor={accent}
        rightColor={accent}
      />
      <IsoBox
        x={x + 0.18}
        y={y + 0.06}
        z={0.64}
        w={0.8}
        d={0.04}
        h={0.42}
        topColor="#f6f1e6"
        leftColor="#cfc9b8"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 0.22}
        y={y + 0.07}
        z={0.76}
        w={0.55}
        d={0.03}
        h={0.04}
        topColor={accent}
        leftColor={accent}
        rightColor={accent}
      />
      <IsoBox
        x={x + 0.22}
        y={y + 0.07}
        z={0.86}
        w={0.45}
        d={0.03}
        h={0.04}
        topColor={accent}
        leftColor={accent}
        rightColor={accent}
      />
      <IsoBox
        x={x + 0.22}
        y={y + 0.07}
        z={0.96}
        w={0.6}
        d={0.03}
        h={0.04}
        topColor={accent}
        leftColor={accent}
        rightColor={accent}
      />
    </pixiContainer>
  );
}

const LOAN_BARS = [12, 22, 16, 28, 20, 32, 24];

export function IsoLoanBoard({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const tops = LOAN_BARS.map((height, i) => {
        const p = iso(x + 0.2 + i * 0.27, y + 0.08, 1.4);
        g.rect(p.x, p.y - height, 6, height);
        g.fill({ color: colorHex, alpha: 0.78 });
        return { x: p.x + 3, y: p.y - height - 2 };
      });
      for (let i = 0; i < tops.length - 1; i += 1) {
        g.moveTo(tops[i].x, tops[i].y);
        g.lineTo(tops[i + 1].x, tops[i + 1].y);
        g.stroke({ color: 0xe8b96b, alpha: 0.95, width: 1.4 });
      }
    },
    [x, y, accent],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        z={0.6}
        w={2.2}
        d={0.06}
        h={1.45}
        topColor={INK}
        leftColor="#1A2238"
        rightColor="#0F1524"
      />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function IsoEventTent({
  x,
  y,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const accentHex = hex(accent);
      const floorY = TILE_H / 2;
      const fl = iso(x, y + 1.6, 0);
      const fr = iso(x + 2.4, y + 1.6, 0);
      const bl = iso(x, y, 0);
      const br = iso(x + 2.4, y, 0);
      const apexFront = iso(x + 1.2, y + 1.6, 1.55);
      const apexBack = iso(x + 1.2, y, 1.55);

      g.poly([bl.x, bl.y + floorY, apexBack.x, apexBack.y, br.x, br.y + floorY]);
      g.fill({ color: 0xf6f1e6, alpha: 0.96 });
      g.stroke({ color: 0x0b101d, alpha: 0.4, width: 1 });

      g.poly([fl.x, fl.y + floorY, apexFront.x, apexFront.y, fr.x, fr.y + floorY]);
      g.fill({ color: 0xece6d4, alpha: 0.97 });
      g.stroke({ color: 0x0b101d, alpha: 0.5, width: 1 });

      for (let i = 0; i < 6; i += 1) {
        const t = i / 5;
        const px = fl.x + (fr.x - fl.x) * t;
        const py = fl.y + floorY + (fr.y - fl.y) * t;
        g.poly([px - 4, py, px, py + 4, px + 4, py]);
        g.fill({ color: accentHex, alpha: 0.78 });
      }

      g.moveTo(apexFront.x, apexFront.y);
      g.lineTo(apexBack.x, apexBack.y);
      g.stroke({ color: 0xcfc9b8, alpha: 0.55, width: 1 });

      for (const px of [apexFront.x - 36, apexFront.x + 36]) {
        const py = apexFront.y - 12;
        g.moveTo(px, py + 18);
        g.lineTo(px, py - 4);
        g.stroke({ color: 0x0b101d, alpha: 0.9, width: 1 });
        g.poly([px, py - 4, px + 7, py - 1, px, py + 2]);
        g.fill({ color: accentHex, alpha: 0.95 });
      }
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoFileCabinet({
  x,
  y,
  accent = "#5EEAD4",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={0.85}
        d={0.7}
        h={1.45}
        topColor="#9aa3b8"
        leftColor="#5a6478"
        rightColor="#3a4254"
      />
      {[0.15, 0.6, 1.05].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.04}
          y={y + 0.65}
          z={z}
          w={0.8}
          d={0.04}
          h={0.32}
          topColor="#0b101d"
          leftColor="#a8b0c2"
          rightColor="#7a8294"
        />
      ))}
      {[0.31, 0.76, 1.21].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.32}
          y={y + 0.62}
          z={z}
          w={0.22}
          d={0.04}
          h={0.04}
          topColor={accent}
          leftColor={accent}
          rightColor="#0b101d"
        />
      ))}
    </pixiContainer>
  );
}

export function IsoBatConsole({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const p = iso(x + 0.5, y + 0.4, 0.95);
      const colorHex = hex(accent);
      g.rect(p.x - 22, p.y - 16, 44, 22);
      g.fill({ color: 0x05080f, alpha: 0.96 });
      g.stroke({ color: colorHex, alpha: 0.7, width: 0.9 });
      g.rect(p.x - 22, p.y - 16, 44, 4);
      g.fill({ color: 0x0e1620, alpha: 0.95 });
      [0xff5f57, 0xfebc2e, 0x28c840].forEach((c, i) => {
        g.circle(p.x - 18 + i * 4, p.y - 14, 1.2);
        g.fill({ color: c, alpha: 0.95 });
      });
      g.rect(p.x - 19, p.y - 8, 2, 1.6);
      g.fill({ color: colorHex, alpha: 0.95 });
      g.rect(p.x - 16, p.y - 8, 20, 1.4);
      g.fill({ color: colorHex, alpha: 0.85 });
      g.rect(p.x - 19, p.y - 4, 18, 1.2);
      g.fill({ color: 0xe6e2d4, alpha: 0.65 });
      g.rect(p.x - 19, p.y - 1, 14, 1.2);
      g.fill({ color: 0xe6e2d4, alpha: 0.55 });
      g.rect(p.x - 19, p.y + 2, 2, 1.4);
      g.fill({ color: colorHex, alpha: 0.9 });
    },
    [x, y, accent],
  );

  return <pixiGraphics draw={draw} />;
}

export function IsoDocumentDesk({
  x,
  y,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1.6}
        d={1.0}
        h={0.75}
        topColor="#3a2415"
        leftColor="#23170D"
        rightColor="#160E07"
      />
      <IsoBox
        x={x + 0.15}
        y={y + 0.15}
        z={0.75}
        w={0.55}
        d={0.4}
        h={0.08}
        topColor="#f6f1e6"
        leftColor="#cfc9b8"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 0.18}
        y={y + 0.18}
        z={0.83}
        w={0.5}
        d={0.36}
        h={0.06}
        topColor="#f6f1e6"
        leftColor="#cfc9b8"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 0.8}
        y={y + 0.15}
        z={0.75}
        w={0.55}
        d={0.4}
        h={0.06}
        topColor="#f6f1e6"
        leftColor="#cfc9b8"
        rightColor="#a8a395"
      />
      <IsoBox
        x={x + 1.38}
        y={y + 0.3}
        z={0.75}
        w={0.18}
        d={0.22}
        h={0.12}
        topColor={accent}
        leftColor="#7a4b12"
        rightColor="#4a2b08"
      />
    </pixiContainer>
  );
}
