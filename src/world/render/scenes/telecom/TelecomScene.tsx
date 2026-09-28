import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/i18n/content";
import type { ZoneBounds } from "@/world/types";
import { DataPacketLine } from "@/world/render/fx/DataPacketLine";
import { TerminalGlow } from "@/world/render/fx/TerminalGlow";
import { Character } from "@/world/render/primitives/Character";
import { IsoCarpet } from "@/world/render/primitives/IsoCarpet";
import { IsoTagPlate } from "@/world/render/primitives/IsoTagPlate";
import { IsoWall } from "@/world/render/primitives/IsoWall";
import { CYAN, GOLD, RED } from "@/world/render/utils";
import {
  IsoCellTower,
  IsoCoverageMap,
  IsoIvrKeypad,
  IsoNetworkPlanningStation,
  IsoRecLiveMonitor,
  IsoServiceKiosk,
  SignalWaveFx,
} from "./props";

type Labels = {
  coverage: string;
  service: string;
  planning: string;
  tower: string;
  ivr: string;
};

const LABELS: Record<Lang, Labels> = {
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

export function TelecomScene({ bounds, animate }: { bounds: ZoneBounds; animate: boolean }) {
  const { lang } = useLanguage();
  const t = LABELS[lang];
  const { x, y, w, h } = bounds;

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#0F2027" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#091418" />

      <IsoCoverageMap x={x + 0.5} y={y + 0.1} accent={CYAN} />
      <IsoTagPlate x={x + 2.0} y={y + 0.1} z={2.45} label={t.coverage} accent={CYAN} />
      <SignalWaveFx x={x + 1.9} y={y + 0.2} color={CYAN} isActive={animate} />

      {/* Customer care */}
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
      <Character x={x + 2.55} y={y + 4.25} facing="sw" pose="stand" shirt="#3a1a1a" accent={GOLD} />
      <TerminalGlow x={x + 0.95} y={y + 2.95} isActive={animate} />

      <IsoNetworkPlanningStation x={x + 3.6} y={y + 2.7} accent={CYAN} />
      <IsoTagPlate x={x + 4.3} y={y + 2.7} z={1.85} label={t.planning} accent={CYAN} />

      <IsoRecLiveMonitor x={x + 5.0} y={y + 0.15} accent={RED} />

      <IsoCellTower x={x + 5.5} y={y + 4.6} accent={CYAN} />
      <IsoTagPlate x={x + 5.5} y={y + 4.55} z={2.3} label={t.tower} accent={CYAN} />
      <SignalWaveFx x={x + 5.5} y={y + 4.55} color={CYAN} isActive={animate} />

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
