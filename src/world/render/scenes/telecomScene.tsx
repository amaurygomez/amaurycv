/**
 * Telecom scene — Chapter 4: customer care + CRM coverage + monitoring.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import type { ZoneBounds } from "../../types";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Lang } from "../../../i18n/content";
import { iso } from "../../lib/iso";
import { IsoBox, IsoCarpet, IsoCounter, IsoWall } from "../Furniture";
import { DataPacketLine, SignalWaveFx, TerminalGlow } from "../ActiveFx";
import { Character } from "../Character";
import { IsoCellTower } from "../SceneProps";
import { IsoTagPlate } from "../shared/IsoTagPlate";
import {
  IsoCoverageMap,
  IsoRecLiveMonitor,
} from "../shared/sceneObjects";

const T: Record<Lang, {
  coverage: string;
  service: string;
  planning: string;
  tower: string;
  ivr: string;
}> = {
  es: {
    coverage: "CRM & Cobertura",
    service: "Atención al cliente",
    planning: "Planificación de red",
    tower: "Torre",
    ivr: "IVR",
  },
  en: {
    coverage: "CRM & Coverage",
    service: "Customer care",
    planning: "Network planning",
    tower: "Tower",
    ivr: "IVR",
  },
};

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

// Geospatial network-planning workstation — a desk with a monitor showing
// a small section-drawing map (matches the "draw, calculate, and quote
// network sections by antenna and urban zone" experience).
function IsoNetworkPlanningStation({
  x,
  y,
  accent = "#5EEAD4",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const drawMap = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const gold = 0xe8b96b;
      // Screen position
      const p = iso(x + 0.55, y + 0.35, 1.25);
      // Grid lines on the "map"
      for (let i = 0; i <= 4; i += 1) {
        g.moveTo(p.x - 18 + i * 9, p.y - 18);
        g.lineTo(p.x - 18 + i * 9, p.y + 18);
        g.stroke({ color: colorHex, alpha: 0.25, width: 0.5 });
        g.moveTo(p.x - 18, p.y - 18 + i * 9);
        g.lineTo(p.x + 18, p.y - 18 + i * 9);
        g.stroke({ color: colorHex, alpha: 0.25, width: 0.5 });
      }
      // Drawn coverage section (polygon)
      g.poly([
        p.x - 12, p.y - 8,
        p.x + 4, p.y - 12,
        p.x + 14, p.y - 2,
        p.x + 8, p.y + 10,
        p.x - 8, p.y + 8,
      ]);
      g.fill({ color: colorHex, alpha: 0.28 });
      g.stroke({ color: colorHex, alpha: 0.85, width: 1.2 });
      // Antenna marker inside the section
      g.circle(p.x + 1, p.y, 2);
      g.fill({ color: gold, alpha: 0.95 });
      g.circle(p.x + 1, p.y, 5);
      g.stroke({ color: gold, alpha: 0.5, width: 0.8 });
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      {/* Desk */}
      <IsoCounter x={x} y={y} w={1.4} d={1.0} topColor="#14313A" faceColor="#0A1720" />
      {/* Monitor frame */}
      <IsoBox x={x + 0.18} y={y + 0.25} z={0.9} w={0.85} d={0.12} h={0.7} topColor="#070b14" leftColor={accent} rightColor="#0F1524" />
      {/* Drawn map on screen */}
      <pixiGraphics draw={drawMap} />
      {/* Drawing tablet on desk */}
      <IsoBox x={x + 0.25} y={y + 0.62} z={0.9} w={0.55} d={0.3} h={0.04} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      {/* Pen */}
      <IsoBox x={x + 0.85} y={y + 0.7} z={0.9} w={0.25} d={0.04} h={0.02} topColor="#E8B96B" leftColor="#7a4b12" rightColor="#4a2b08" />
    </pixiContainer>
  );
}

function IsoServiceKiosk({
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
      <IsoCounter x={x} y={y} w={2.0} d={1.05} topColor="#14313A" faceColor="#0A1720" />
      <IsoBox x={x + 0.45} y={y + 0.18} z={0.9} w={0.18} d={0.18} h={0.5} topColor="#070b14" leftColor="#1A2238" rightColor="#0B101D" />
      <IsoBox x={x + 0.35} y={y + 0.3} z={1.05} w={0.55} d={0.1} h={0.5} topColor="#070b14" leftColor={accent} rightColor="#0F1524" />
      <IsoBox x={x + 0.3} y={y + 0.65} z={0.9} w={0.7} d={0.22} h={0.04} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      <IsoBox x={x + 1.35} y={y + 0.2} z={0.9} w={0.45} d={0.32} h={0.25} topColor="#E8B96B" leftColor="#7a4b12" rightColor="#4a2b08" />
    </pixiContainer>
  );
}

function IsoIvrKeypad({
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
      <IsoBox x={x} y={y} w={0.8} d={0.6} h={0.85} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      <IsoBox x={x + 0.08} y={y + 0.12} z={0.85} w={0.6} d={0.16} h={0.08} topColor={accent} leftColor="#7a4b12" rightColor="#4a2b08" />
      {[0.95, 1.05, 1.15].map((z) => (
        <IsoBox
          key={z}
          x={x + 0.15}
          y={y + 0.5}
          z={z}
          w={0.5}
          d={0.06}
          h={0.05}
          topColor="#070b14"
          leftColor={accent}
          rightColor="#0F1524"
        />
      ))}
    </pixiContainer>
  );
}

export function TelecomScene({
  bounds,
  animate,
}: {
  bounds: ZoneBounds;
  animate: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  const { x, y, w, h } = bounds;
  const CYAN = "#5EEAD4";
  const GOLD = "#E8B96B";
  const RED = "#F87171";

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#0F2027" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#091418" />

      {/* Coverage board (top wall) */}
      <IsoCoverageMap x={x + 0.5} y={y + 0.1} accent={CYAN} />
      <IsoTagPlate x={x + 2.0} y={y + 0.1} z={2.45} label={t.coverage} accent={CYAN} />
      <SignalWaveFx x={x + 1.9} y={y + 0.2} color={CYAN} isActive={animate} />

      {/* Service counter (center-left) */}
      <IsoCarpet x={x + 0.5} y={y + 2.5} w={2.8} d={2.2} color={CYAN} alpha={0.13} />
      <IsoServiceKiosk x={x + 0.7} y={y + 2.7} accent={CYAN} />
      <IsoTagPlate x={x + 1.75} y={y + 2.7} z={1.85} label={t.service} accent={CYAN} />
      <Character
        x={x + 1.4}
        y={y + 3.95}
        facing="nw"
        pose="point"
        shirt="#123d46"
        accent={CYAN}
        accessory="headphones"
      />
      <Character
        x={x + 2.55}
        y={y + 4.25}
        facing="sw"
        pose="stand"
        shirt="#3a1a1a"
        accent={GOLD}
      />
      <TerminalGlow x={x + 0.95} y={y + 2.95} isActive={animate} />

      {/* Network planning workstation — geospatial tool for drawing,
          calculating and quoting network sections per antenna and urban
          zone. Replaces the previous phone display (which did not match
          the panel: this is an internal telecom carrier, not a retail
          phone store). */}
      <IsoNetworkPlanningStation x={x + 3.6} y={y + 2.7} accent={CYAN} />
      <IsoTagPlate x={x + 4.3} y={y + 2.7} z={1.85} label={t.planning} accent={CYAN} />

      {/* REC LIVE monitor (right wall) */}
      <IsoRecLiveMonitor x={x + 5.0} y={y + 0.15} accent={RED} />

      {/* Antenna corner */}
      <IsoCellTower x={x + 5.5} y={y + 4.6} accent={CYAN} />
      <IsoTagPlate x={x + 5.5} y={y + 4.55} z={2.3} label={t.tower} accent={CYAN} />
      <SignalWaveFx x={x + 5.5} y={y + 4.55} color={CYAN} isActive={animate} />

      {/* IVR keypad */}
      <IsoIvrKeypad x={x + 0.7} y={y + 5.6} accent={GOLD} />
      <IsoTagPlate x={x + 1.1} y={y + 5.6} z={1.25} label={t.ivr} accent={GOLD} />

      <DataPacketLine
        from={{ x: x + 1.7, y: y + 2.95 }}
        to={{ x: x + 2.5, y: y + 0.95 }}
        color={CYAN}
        isActive={animate}
        offset={0.2}
      />
      <DataPacketLine
        from={{ x: x + 5.45, y: y + 1.0 }}
        to={{ x: x + 5.85, y: y + 4.6 }}
        color={GOLD}
        isActive={animate}
        offset={0.5}
      />
      <DataPacketLine
        from={{ x: x + 1.4, y: y + 5.8 }}
        to={{ x: x + 1.95, y: y + 3.45 }}
        color={GOLD}
        isActive={animate}
        offset={0.7}
      />
    </pixiContainer>
  );
}
