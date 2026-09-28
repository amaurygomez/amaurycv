import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/i18n/content";
import type { ZoneBounds } from "@/world/types";
import { IsoBookshelf } from "@/world/render/primitives/IsoBookshelf";
import { IsoCarpet } from "@/world/render/primitives/IsoCarpet";
import { IsoTagPlate } from "@/world/render/primitives/IsoTagPlate";
import { IsoWall } from "@/world/render/primitives/IsoWall";
import { GOLD, ORANGE } from "@/world/render/utils";
import {
  IsoBbqSmoke,
  IsoChecklistBoard,
  IsoChef,
  IsoGrill,
  IsoMountainMassif,
  IsoPrepCart,
  IsoTraceabilityBoard,
  MountainFlagFx,
} from "./props";

type Labels = {
  summit: string;
  runbooks: string;
  bbq: string;
  traceability: string;
  checklist: string;
};

const LABELS: Record<Lang, Labels> = {
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

export function DisciplineScene({ bounds, animate }: { bounds: ZoneBounds; animate: boolean }) {
  const { lang } = useLanguage();
  const t = LABELS[lang];
  const { x, y, w, h } = bounds;

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

      {/* BBQ corner */}
      <IsoCarpet x={x + 0.4} y={y + 4.3} w={3.2} d={2.4} color={ORANGE} alpha={0.18} />
      <IsoGrill x={x + 1.05} y={y + 4.85} ember={ORANGE} />
      <IsoBbqSmoke x={x + 1.05} y={y + 4.85} />
      <IsoTagPlate x={x + 1.55} y={y + 4.85} z={1.4} label={t.bbq} accent={ORANGE} />
      <IsoChef x={x + 2.05} y={y + 4.95} facing="sw" />
      <IsoPrepCart x={x + 0.45} y={y + 5.65} accent={GOLD} />
    </pixiContainer>
  );
}
