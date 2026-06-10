/**
 * Discipline scene — Chapter 7: engineering discipline + personal rhythm.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import type { ZoneBounds } from "../../types";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Lang } from "../../../i18n/content";
import { iso } from "../../lib/iso";
import { IsoBookshelf, IsoBox, IsoCarpet, IsoWall } from "../Furniture";
import { MountainFlagFx } from "../ActiveFx";
import { IsoTagPlate } from "../shared/IsoTagPlate";
import {
  IsoBbqSmoke,
  IsoChef,
  IsoGrill,
  IsoMountainMassif,
  IsoPrepCart,
} from "../shared/sceneObjects";

const T: Record<Lang, {
  summit: string;
  runbooks: string;
  bbq: string;
  traceability: string;
  checklist: string;
}> = {
  es: {
    summit: "La cumbre",
    runbooks: "Runbooks",
    bbq: "BBQ",
    traceability: "Trazabilidad",
    checklist: "Checklist producción",
  },
  en: {
    summit: "The summit",
    runbooks: "Runbooks",
    bbq: "BBQ",
    traceability: "Traceability",
    checklist: "Production checklist",
  },
};

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

function IsoChecklistBoard({
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
      for (let i = 0; i < 5; i += 1) {
        const p = iso(x + 0.2, y + 0.08, 1.6 - i * 0.22);
        g.rect(p.x - 4, p.y - 4, 5, 5);
        g.stroke({ color: 0x34d399, alpha: 0.9, width: 0.7 });
        g.moveTo(p.x - 3, p.y - 2);
        g.lineTo(p.x - 1.5, p.y);
        g.lineTo(p.x + 0.5, p.y - 3);
        g.stroke({ color: 0x34d399, alpha: 0.95, width: 1 });
        g.rect(p.x + 3, p.y - 3, 26 - i * 1.5, 1.2);
        g.fill({ color: colorHex, alpha: 0.65 });
      }
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.6} w={1.7} d={0.06} h={1.45} topColor="#070B14" leftColor="#0F1524" rightColor="#0B101D" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

function IsoTraceabilityBoard({
  x,
  y,
  accent = "#F97316",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      for (let i = 0; i < 7; i += 1) {
        const p = iso(x + 0.2, y + 0.08, 1.75 - i * 0.18);
        g.circle(p.x - 4, p.y, 1.4);
        g.fill({ color: colorHex, alpha: 0.95 });
        g.rect(p.x, p.y - 1.2, 32 - i, 1.2);
        g.fill({ color: 0xe6e2d4, alpha: 0.6 - i * 0.04 });
      }
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.6} w={1.8} d={0.06} h={1.7} topColor="#070B14" leftColor="#1A2238" rightColor="#0F1524" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function DisciplineScene({
  bounds,
  animate,
}: {
  bounds: ZoneBounds;
  animate: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  const { x, y, w, h } = bounds;
  const ORANGE = "#F97316";
  const GOLD = "#E8B96B";

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#1c1108" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#12090a" />

      <IsoMountainMassif x={x + 0.3} y={y + 0.7} accent={ORANGE} />
      <MountainFlagFx x={x + 1.8} y={y + 0.6} color={ORANGE} isActive={animate} />
      <IsoTagPlate x={x + 1.8} y={y + 0.6} z={3.55} label={t.summit} accent={ORANGE} />

      <IsoBookshelf x={x + 5.4} y={y + 0.1} />
      <IsoBookshelf x={x + 6.2} y={y + 0.1} />
      <IsoTagPlate x={x + 5.9} y={y + 0.1} z={2.55} label={t.runbooks} accent={GOLD} />

      <IsoTraceabilityBoard x={x + 5.4} y={y + 2.8} accent={ORANGE} />
      <IsoTagPlate x={x + 6.0} y={y + 2.8} z={2.45} label={t.traceability} accent={ORANGE} />

      <IsoChecklistBoard x={x + 5.4} y={y + 4.9} accent={GOLD} />
      <IsoTagPlate x={x + 6.0} y={y + 4.9} z={2.2} label={t.checklist} accent={GOLD} />

      <IsoCarpet x={x + 0.4} y={y + 4.3} w={3.2} d={2.4} color={ORANGE} alpha={0.18} />
      <IsoGrill x={x + 1.05} y={y + 4.85} ember={ORANGE} />
      <IsoBbqSmoke x={x + 1.05} y={y + 4.85} />
      <IsoTagPlate x={x + 1.55} y={y + 4.85} z={1.4} label={t.bbq} accent={ORANGE} />
      <IsoChef x={x + 2.05} y={y + 4.95} facing="sw" />
      <IsoPrepCart x={x + 0.45} y={y + 5.65} accent={GOLD} />
    </pixiContainer>
  );
}
