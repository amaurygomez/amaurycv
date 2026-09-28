import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/i18n/content";
import type { ZoneBounds } from "@/world/types";
import { Character } from "@/world/render/primitives/Character";
import { IsoBookshelf } from "@/world/render/primitives/IsoBookshelf";
import { IsoCarpet } from "@/world/render/primitives/IsoCarpet";
import { IsoTagPlate } from "@/world/render/primitives/IsoTagPlate";
import { IsoWall } from "@/world/render/primitives/IsoWall";
import { BLUE, GOLD, GREEN } from "@/world/render/utils";
import {
  BadgeGlowFx,
  IsoCertFrame,
  IsoChildAtCRT,
  IsoDiplomaWithRibbon,
  IsoGradCap,
  IsoTrailPath,
  IsoVintageCRT,
  PageFlipFx,
} from "./props";

type Labels = {
  mother: string;
  firstPc: string;
  training: string;
  scholarship: string;
  milestones: string;
};

const LABELS: Record<Lang, Labels> = {
  es: {
    mother: "Mi madre estudiaba",
    firstPc: "Mi primer PC",
    training: "Formación técnica",
    scholarship: "Beca nacional",
    milestones: "Logros",
  },
  en: {
    mother: "My mother was learning",
    firstPc: "My first PC",
    training: "Technical training",
    scholarship: "National scholarship",
    milestones: "Milestones",
  },
};

export function OriginScene({ bounds, animate }: { bounds: ZoneBounds; animate: boolean }) {
  const { lang } = useLanguage();
  const t = LABELS[lang];
  const { x, y, w, h } = bounds;

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#181B2A" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#101522" />

      {/* Childhood corner */}
      <IsoCarpet x={x + 0.6} y={y + 2.4} w={2.6} d={2.0} color={GOLD} alpha={0.16} />
      <IsoBookshelf x={x + 0.55} y={y + 0.9} />
      <IsoTagPlate x={x + 1.0} y={y + 0.9} z={2.55} label={t.mother} accent={GOLD} />
      <IsoVintageCRT x={x + 0.85} y={y + 2.95} screen={BLUE} />
      <IsoTagPlate x={x + 2.05} y={y + 2.95} z={1.85} label={t.firstPc} accent={BLUE} />
      <IsoChildAtCRT x={x + 0.65} y={y + 3.65} shirt="#5EAEDF" />

      {/* Technical training */}
      <IsoCarpet x={x + 4.2} y={y + 2.7} w={2.2} d={1.7} color={BLUE} alpha={0.14} />
      <IsoVintageCRT x={x + 4.35} y={y + 3.05} screen={GREEN} />
      <IsoTagPlate x={x + 5.5} y={y + 3.05} z={1.85} label={t.training} accent={GREEN} />
      <PageFlipFx x={x + 5.6} y={y + 3.35} color={GREEN} isActive={animate} />
      <Character
        x={x + 5.4}
        y={y + 4.35}
        facing="nw"
        pose="point"
        shirt="#2e2238"
        accent={GREEN}
        accessory="headphones"
      />

      {/* Scholarship */}
      <IsoCarpet x={x + 4.0} y={y + 5.0} w={2.7} d={1.7} color={GOLD} alpha={0.15} />
      <IsoGradCap x={x + 4.2} y={y + 5.25} accent={GOLD} />
      <IsoDiplomaWithRibbon x={x + 5.4} y={y + 5.2} accent={GOLD} />
      <IsoTagPlate x={x + 5.55} y={y + 5.2} z={1.45} label={t.scholarship} accent={GOLD} />
      <BadgeGlowFx x={x + 4.3} y={y + 5.3} color={GOLD} isActive={animate} />

      <IsoCertFrame x={x + 4.2} y={y + 0.15} z={1.5} accent={GOLD} />
      <IsoCertFrame x={x + 4.7} y={y + 0.15} z={1.5} accent={BLUE} />
      <IsoCertFrame x={x + 5.2} y={y + 0.15} z={1.5} accent={GREEN} />
      <IsoTagPlate x={x + 4.7} y={y + 0.15} z={2.25} label={t.milestones} accent={GOLD} />

      <IsoTrailPath
        points={[
          { x: x + 1.7, y: y + 4.4 },
          { x: x + 2.7, y: y + 5.0 },
          { x: x + 4.0, y: y + 5.4 },
          { x: x + 5.0, y: y + 5.7 },
        ]}
        color={BLUE}
      />
    </pixiContainer>
  );
}
