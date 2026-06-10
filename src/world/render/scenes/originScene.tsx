/**
 * Origin scene — Chapter 1: where the career started.
 *
 * Story corners:
 *   - Childhood corner (mother's course PC + bookshelf + child).
 *   - Technical-training study corner.
 *   - Scholarship corner (graduation cap + diploma + cert frames).
 *   - Subtle floor trail connecting the milestones.
 */
import type { ZoneBounds } from "../../types";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Lang } from "../../../i18n/content";
import { IsoBookshelf, IsoCarpet, IsoCertFrame, IsoWall } from "../Furniture";
import { BadgeGlowFx, PageFlipFx } from "../ActiveFx";
import { Character } from "../Character";
import { IsoTagPlate } from "../shared/IsoTagPlate";
import {
  IsoChildAtCRT,
  IsoDiplomaWithRibbon,
  IsoGradCap,
  IsoTrailPath,
  IsoVintageCRT,
} from "../shared/sceneObjects";

const T: Record<Lang, {
  mother: string;
  firstPc: string;
  training: string;
  scholarship: string;
  milestones: string;
}> = {
  es: {
    mother: "Mi madre estudiaba",
    firstPc: "Mi primer PC · 9 años",
    training: "Formación técnica",
    scholarship: "Beca nacional",
    milestones: "Logros",
  },
  en: {
    mother: "My mother was learning",
    firstPc: "My first PC · age 9",
    training: "Technical training",
    scholarship: "National scholarship",
    milestones: "Milestones",
  },
};

export function OriginScene({
  bounds,
  animate,
}: {
  bounds: ZoneBounds;
  animate: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  const { x, y, w, h } = bounds;
  const ACCENT = "#60A5FA";
  const WARM = "#E8B96B";
  const GREEN = "#34D399";

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#181B2A" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#101522" />

      {/* Childhood corner */}
      <IsoCarpet x={x + 0.6} y={y + 2.4} w={2.6} d={2.0} color={WARM} alpha={0.16} />
      <IsoBookshelf x={x + 0.55} y={y + 0.9} />
      <IsoTagPlate x={x + 1.0} y={y + 0.9} z={2.55} label={t.mother} accent={WARM} />
      <IsoVintageCRT x={x + 0.85} y={y + 2.95} screen={ACCENT} />
      <IsoTagPlate x={x + 2.05} y={y + 2.95} z={1.85} label={t.firstPc} accent={ACCENT} />
      <IsoChildAtCRT x={x + 0.65} y={y + 3.65} shirt="#5EAEDF" screen={ACCENT} />

      {/* Technical-training study corner */}
      <IsoCarpet x={x + 4.2} y={y + 2.7} w={2.2} d={1.7} color={ACCENT} alpha={0.14} />
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

      {/* Scholarship corner */}
      <IsoCarpet x={x + 4.0} y={y + 5.0} w={2.7} d={1.7} color={WARM} alpha={0.15} />
      <IsoGradCap x={x + 4.2} y={y + 5.25} accent={WARM} />
      <IsoDiplomaWithRibbon x={x + 5.4} y={y + 5.2} accent={WARM} />
      <IsoTagPlate x={x + 5.55} y={y + 5.2} z={1.45} label={t.scholarship} accent={WARM} />
      <BadgeGlowFx x={x + 4.3} y={y + 5.3} color={WARM} isActive={animate} />

      {/* Certificate frames on north wall */}
      <IsoCertFrame x={x + 4.2} y={y + 0.15} z={1.5} accent={WARM} />
      <IsoCertFrame x={x + 4.7} y={y + 0.15} z={1.5} accent={ACCENT} />
      <IsoCertFrame x={x + 5.2} y={y + 0.15} z={1.5} accent={GREEN} />
      <IsoTagPlate x={x + 4.7} y={y + 0.15} z={2.25} label={t.milestones} accent={WARM} />

      {/* Floor trail */}
      <IsoTrailPath
        points={[
          { x: x + 1.7, y: y + 4.4 },
          { x: x + 2.7, y: y + 5.0 },
          { x: x + 4.0, y: y + 5.4 },
          { x: x + 5.0, y: y + 5.7 },
        ]}
        color={ACCENT}
      />
    </pixiContainer>
  );
}
