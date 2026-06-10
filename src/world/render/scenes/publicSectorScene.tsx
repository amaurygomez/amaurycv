/**
 * Public Sector scene — Chapter 5: confidential institutional operations.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import type { ZoneBounds } from "../../types";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Lang } from "../../../i18n/content";
import { iso } from "../../lib/iso";
import { IsoBox, IsoCarpet, IsoWall } from "../Furniture";
import {
  ChartBarsFx,
  DashboardFlicker,
  MapPinBlinkFx,
} from "../ActiveFx";
import { IsoMapDR } from "../SceneProps";
import { IsoTagPlate } from "../shared/IsoTagPlate";
import {
  IsoConfidentialBadge,
  IsoMeetingTable,
} from "../shared/sceneObjects";
import { Character } from "../Character";
import { IsoServerRack } from "../Furniture";

const T: Record<Lang, {
  mapStats: string;
  liveOps: string;
  confidential: string;
  apis: string;
  hr: string;
}> = {
  es: {
    mapStats: "Mapa & estadísticas",
    liveOps: "Operación en vivo",
    confidential: "Confidencial",
    apis: "APIs institucionales",
    hr: "RRHH & módulos",
  },
  en: {
    mapStats: "Map & stats",
    liveOps: "Live ops",
    confidential: "Confidential",
    apis: "Institutional APIs",
    hr: "HR & modules",
  },
};

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

function IsoRoleMatrix({
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
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          const p = iso(x + 0.2 + col * 0.34, y + 0.08, 1.85 - row * 0.22);
          g.rect(p.x - 4, p.y - 4, 8, 6);
          g.fill({ color: col <= row ? colorHex : 0x1a2238, alpha: col <= row ? 0.85 : 0.9 });
          g.stroke({ color: 0x070b14, alpha: 0.7, width: 0.5 });
        }
      }
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.5} w={1.7} d={0.06} h={1.45} topColor="#070B14" leftColor="#0F1524" rightColor="#0B101D" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

function IsoAuditTrailBoard({
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
      const colorHex = hex(accent);
      for (let i = 0; i < 6; i += 1) {
        const p = iso(x + 0.22, y + 0.08, 1.9 - i * 0.16);
        g.rect(p.x, p.y, 38 - i * 3, 1.4);
        g.fill({ color: colorHex, alpha: 0.65 });
      }
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.5} w={1.5} d={0.06} h={1.45} topColor="#070B14" leftColor="#0F1524" rightColor="#0B101D" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

function IsoBigWallMap({
  x,
  y,
  accent = "#5EEAD4",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const gold = 0xe8b96b;
      const green = 0x34d399;
      const p = iso(x + 1.5, y + 0.05, 1.85);
      g.moveTo(p.x - 40, p.y - 4);
      g.lineTo(p.x - 16, p.y - 14);
      g.lineTo(p.x + 10, p.y - 16);
      g.lineTo(p.x + 30, p.y - 10);
      g.lineTo(p.x + 36, p.y + 0);
      g.lineTo(p.x + 26, p.y + 12);
      g.lineTo(p.x + 4, p.y + 16);
      g.lineTo(p.x - 22, p.y + 12);
      g.lineTo(p.x - 36, p.y + 4);
      g.closePath();
      g.fill({ color: 0x0c1f24, alpha: 0.96 });
      g.stroke({ color: colorHex, alpha: 0.85, width: 1.2 });
      [
        { dx: -22, dy: -6, c: green },
        { dx: -4, dy: -10, c: gold },
        { dx: 18, dy: -6, c: green },
        { dx: 8, dy: 6, c: colorHex },
        { dx: -16, dy: 4, c: gold },
      ].forEach((h) => {
        g.circle(p.x + h.dx, p.y + h.dy, 2.5);
        g.fill({ color: h.c, alpha: 0.92 });
      });
      [0.45, 0.55, 0.65].forEach((s, i) => {
        g.rect(p.x + 22, p.y - 12 + i * 6, 12 * s, 2.4);
        g.fill({ color: i === 0 ? green : i === 1 ? gold : colorHex, alpha: 0.85 });
      });
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.5} w={3.2} d={0.08} h={2.0} topColor="#070B14" leftColor="#1A2238" rightColor="#0F1524" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function PublicSectorScene({
  bounds,
  animate,
}: {
  bounds: ZoneBounds;
  animate: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  const { x, y, w, h } = bounds;
  const GREEN = "#34D399";
  const CYAN = "#5EEAD4";
  const GOLD = "#E8B96B";

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#13201F" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#101B1A" />

      <IsoBigWallMap x={x + 1.7} y={y + 0.1} accent={CYAN} />
      <IsoTagPlate x={x + 3.3} y={y + 0.1} z={2.55} label={t.mapStats} accent={CYAN} />
      <ChartBarsFx x={x + 4.1} y={y + 0.15} color={GREEN} isActive={animate} />
      <DashboardFlicker x={x + 1.7} y={y + 0.15} isActive={animate} />

      <IsoRoleMatrix x={x + 0.5} y={y + 0.15} accent={GREEN} />
      <IsoAuditTrailBoard x={x + 5.05} y={y + 0.15} accent={GOLD} />

      <IsoCarpet x={x + 1.0} y={y + 2.4} w={5.0} d={2.4} color={GREEN} alpha={0.14} />
      <IsoMeetingTable x={x + 1.4} y={y + 2.85} w={4.0} d={1.6} accent={GREEN} />

      <IsoMapDR
        x={x + 2.5}
        y={y + 4.9}
        w={2.0}
        d={1.0}
        base="#0E2A22"
        outline={CYAN}
        pins={[
          { dx: 0.5, dy: 0.3, color: GREEN },
          { dx: 1.3, dy: 0.5, color: GOLD },
        ]}
      />
      <MapPinBlinkFx
        points={[
          { x: x + 3.0, y: y + 5.2 },
          { x: x + 3.85, y: y + 5.5 },
        ]}
        color={GREEN}
        isActive={animate}
      />
      <IsoTagPlate x={x + 3.5} y={y + 4.9} z={1.0} label={t.liveOps} accent={CYAN} />

      {/* API integrations hub + HR/admin workstation. Replaces the
          previous patrol-car + officers + K9 corner — that scene was
          police-themed and did not match the panel text, which
          intentionally generalizes the institution. The panel text DOES
          mention "Backend integrations with multiple institutional APIs"
          and "Internal HR tooling" — so this corner shows both. */}
      <IsoCarpet x={x + 5.0} y={y + 5.0} w={1.9} d={1.8} color={CYAN} alpha={0.1} />
      {/* Server rack standing in for the institutional API hub */}
      <IsoServerRack x={x + 5.15} y={y + 5.15} />
      <IsoTagPlate x={x + 5.6} y={y + 5.15} z={2.55} label={t.apis} accent={CYAN} />
      {/* Internal admin / HR workstation: small desk + monitor + person */}
      <IsoBox x={x + 6.1} y={y + 5.4} w={0.7} d={0.55} h={0.7} topColor="#1A2238" leftColor="#0F1524" rightColor="#0B101D" />
      <IsoBox x={x + 6.18} y={y + 5.5} z={0.7} w={0.5} d={0.08} h={0.35} topColor="#070b14" leftColor={GOLD} rightColor="#0F1524" />
      <IsoTagPlate x={x + 6.4} y={y + 5.4} z={1.45} label={t.hr} accent={GOLD} />
      <Character
        x={x + 6.0}
        y={y + 6.2}
        facing="nw"
        pose="stand"
        shirt="#142d3e"
        accent={GOLD}
        accessory="tie"
      />

      <IsoConfidentialBadge x={x + 0.6} y={y + 4.9} accent={GREEN} />
      <IsoTagPlate x={x + 1.05} y={y + 4.9} z={1.35} label={t.confidential} accent={GREEN} />
    </pixiContainer>
  );
}
