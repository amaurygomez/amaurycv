import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/i18n/content";
import type { ZoneBounds } from "@/world/types";
import { ApprovalStampFx } from "@/world/render/fx/ApprovalStampFx";
import { DataPacketLine } from "@/world/render/fx/DataPacketLine";
import { ReceiptFeedFx } from "@/world/render/fx/ReceiptFeedFx";
import { Character } from "@/world/render/primitives/Character";
import { IsoCar } from "@/world/render/primitives/IsoCar";
import { IsoCarpet } from "@/world/render/primitives/IsoCarpet";
import { IsoTagPlate } from "@/world/render/primitives/IsoTagPlate";
import { IsoWall } from "@/world/render/primitives/IsoWall";
import { AMBER, CYAN, PURPLE } from "@/world/render/utils";
import {
  IsoLegacySystemCard,
  IsoLotteryKiosk,
  IsoPosArea,
  IsoPosHero,
  IsoPosTerminal,
  IsoReceiptStack,
  IsoTicketBoard,
  PosPulseFx,
} from "./props";

type Labels = {
  lottery: string;
  android: string;
  verifone: string;
  field: string;
  legacy: string;
};

const LABELS: Record<Lang, Labels> = {
  es: {
    lottery: "Lotería · Recargas",
    android: "Android POS",
    verifone: "Verifone",
    field: "En campo",
    legacy: "Legacy · Crystal",
  },
  en: {
    lottery: "Lottery · Top-up",
    android: "Android POS",
    verifone: "Verifone",
    field: "On the field",
    legacy: "Legacy · Crystal",
  },
};

export function PosScene({ bounds, animate }: { bounds: ZoneBounds; animate: boolean }) {
  const { lang } = useLanguage();
  const t = LABELS[lang];
  const { x, y, w, h } = bounds;

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#1B1530" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#160F26" />

      {/* Lottery corner */}
      <IsoLotteryKiosk x={x + 0.5} y={y + 1.2} accent={AMBER} />
      <IsoTagPlate x={x + 1.5} y={y + 1.2} z={2.05} label={t.lottery} accent={AMBER} />
      <IsoTicketBoard x={x + 0.85} y={y + 0.15} accent={AMBER} />

      <IsoLegacySystemCard x={x + 5.45} y={y + 0.85} accent={PURPLE} />
      <IsoTagPlate x={x + 5.95} y={y + 0.85} z={1.15} label={t.legacy} accent={PURPLE} />

      {/* Point of sale */}
      <IsoCarpet x={x + 2.45} y={y + 3.0} w={3.2} d={2.0} color={CYAN} alpha={0.14} />
      <IsoPosArea x={x + 2.6} y={y + 3.15} />
      <IsoPosHero x={x + 2.85} y={y + 3.35} screen={CYAN} />
      <IsoTagPlate x={x + 3.35} y={y + 3.35} z={2.05} label={t.android} accent={CYAN} />
      <IsoPosTerminal x={x + 4.4} y={y + 3.45} screenColor={PURPLE} />
      <IsoTagPlate x={x + 4.7} y={y + 3.45} z={1.65} label={t.verifone} accent={PURPLE} />
      <PosPulseFx x={x + 2.85} y={y + 3.35} color={CYAN} isActive={animate} />
      <PosPulseFx x={x + 4.4} y={y + 3.45} color={PURPLE} isActive={animate} />
      <IsoReceiptStack x={x + 5.05} y={y + 3.55} />
      <ReceiptFeedFx x={x + 5.05} y={y + 3.55} color={AMBER} isActive={animate} />
      <ApprovalStampFx x={x + 5.3} y={y + 2.85} color="#34D399" isActive={animate} />
      <Character x={x + 3.8} y={y + 5.05} facing="nw" pose="talk" shirt="#3a2d12" accent={AMBER} />

      {/* Field work */}
      <IsoCarpet x={x + 0.4} y={y + 5.0} w={2.0} d={1.8} color={AMBER} alpha={0.12} />
      <IsoCar x={x + 0.65} y={y + 5.4} color={CYAN} />
      <IsoTagPlate x={x + 1.15} y={y + 5.4} z={1.05} label={t.field} accent={AMBER} />
      <Character x={x + 2.1} y={y + 5.6} facing="sw" pose="stand" shirt="#1a1f2e" accent={AMBER} />

      <DataPacketLine
        from={{ x: x + 4.65, y: y + 3.95 }}
        to={{ x: x + 3.4, y: y + 3.95 }}
        color={CYAN}
        isActive={animate}
        offset={0.2}
      />
      <DataPacketLine
        from={{ x: x + 1.55, y: y + 1.45 }}
        to={{ x: x + 3.2, y: y + 3.55 }}
        color={AMBER}
        isActive={animate}
        offset={0.5}
      />
      <DataPacketLine
        from={{ x: x + 5.55, y: y + 1.45 }}
        to={{ x: x + 4.6, y: y + 3.55 }}
        color={PURPLE}
        isActive={animate}
        offset={0.7}
      />
    </pixiContainer>
  );
}
