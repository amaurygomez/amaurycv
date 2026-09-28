import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/i18n/content";
import type { ZoneBounds } from "@/world/types";
import { Character } from "@/world/render/primitives/Character";
import { IsoCarpet } from "@/world/render/primitives/IsoCarpet";
import { IsoTagPlate } from "@/world/render/primitives/IsoTagPlate";
import { IsoWall } from "@/world/render/primitives/IsoWall";
import { CYAN, GOLD, GREEN } from "@/world/render/utils";
import {
  ChartBarsFx,
  DashboardFlicker,
  IsoAdminDesk,
  IsoAuditTrailBoard,
  IsoBigWallMap,
  IsoConfidentialBadge,
  IsoFloorMap,
  IsoMeetingTable,
  IsoRoleMatrix,
  IsoServerRack,
  MapPinBlinkFx,
} from "./props";

type Labels = {
  mapStats: string;
  liveOps: string;
  confidential: string;
  apis: string;
  hr: string;
};

const LABELS: Record<Lang, Labels> = {
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

export function PublicSectorScene({ bounds, animate }: { bounds: ZoneBounds; animate: boolean }) {
  const { lang } = useLanguage();
  const t = LABELS[lang];
  const { x, y, w, h } = bounds;

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

      <IsoFloorMap
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

      {/* API integrations and internal HR tooling */}
      <IsoCarpet x={x + 5.0} y={y + 5.0} w={1.9} d={1.8} color={CYAN} alpha={0.1} />
      <IsoServerRack x={x + 5.15} y={y + 5.15} />
      <IsoTagPlate x={x + 5.6} y={y + 5.15} z={2.55} label={t.apis} accent={CYAN} />
      <IsoAdminDesk x={x + 6.1} y={y + 5.4} accent={GOLD} />
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
