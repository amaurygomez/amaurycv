/**
 * POS scene — Chapter 2: POS · Sockets · Recharges · Lottery.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import type { ZoneBounds } from "../../types";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Lang } from "../../../i18n/content";
import { iso } from "../../lib/iso";
import { IsoBox, IsoCarpet, IsoCounter, IsoWall } from "../Furniture";
import {
  ApprovalStampFx,
  DataPacketLine,
  PosPulseFx,
  ReceiptFeedFx,
} from "../ActiveFx";
import { Character } from "../Character";
import { IsoCar, IsoPosTerminal } from "../SceneProps";
import { IsoTagPlate } from "../shared/IsoTagPlate";
import {
  IsoLegacySystemCard,
  IsoLotteryKiosk,
  IsoTicketBoard,
} from "../shared/sceneObjects";

const T: Record<Lang, {
  lottery: string;
  android: string;
  verifone: string;
  field: string;
  legacy: string;
}> = {
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

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

function IsoPosHero({
  x,
  y,
  screen = "#5EEAD4",
}: {
  x: number;
  y: number;
  screen?: string;
}) {
  const drawScreen = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(screen);
      const p = iso(x + 0.55, y + 0.5, 1.1);
      for (let i = 0; i < 3; i += 1) {
        g.rect(p.x - 9, p.y - 16 + i * 6, 18, 1.4);
        g.fill({ color: colorHex, alpha: 0.45 });
      }
      g.circle(p.x + 8, p.y - 20, 4);
      g.fill({ color: 0x34d399, alpha: 0.95 });
    },
    [x, y, screen]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} w={1.1} d={1.0} h={0.72} topColor="#1A1F2E" leftColor="#0F1524" rightColor="#0B101D" />
      <IsoBox x={x + 0.08} y={y + 0.18} z={0.72} w={0.95} d={0.6} h={0.42} topColor={screen} leftColor="#0F1524" rightColor="#0B101D" />
      <IsoBox x={x + 0.08} y={y + 0.05} z={0.72} w={0.95} d={0.14} h={0.08} topColor="#0F1524" leftColor="#070B14" rightColor="#070B14" />
      <pixiGraphics draw={drawScreen} />
    </pixiContainer>
  );
}

function IsoPosArea({ x, y }: { x: number; y: number }) {
  return <IsoCounter x={x} y={y} w={2.8} d={1.1} topColor="#2A2147" faceColor="#151023" />;
}

function IsoReceiptStack({ x, y }: { x: number; y: number }) {
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} w={0.45} d={0.32} h={0.06} topColor="#f6f1e6" leftColor="#cfc9b8" rightColor="#a8a395" />
      <IsoBox x={x + 0.02} y={y + 0.02} z={0.06} w={0.42} d={0.3} h={0.04} topColor="#f6f1e6" leftColor="#cfc9b8" rightColor="#a8a395" />
      <IsoBox x={x + 0.08} y={y + 0.06} z={0.1} w={0.28} d={0.06} h={0.02} topColor="#34D399" leftColor="#0c3a2a" rightColor="#08251b" />
    </pixiContainer>
  );
}

export function PosScene({
  bounds,
  animate,
}: {
  bounds: ZoneBounds;
  animate: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  const { x, y, w, h } = bounds;
  const PURPLE = "#A78BFA";
  const CYAN = "#5EEAD4";
  const GOLD = "#FBBF24";

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#1B1530" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#160F26" />

      {/* Lottery corner */}
      <IsoLotteryKiosk x={x + 0.5} y={y + 1.2} accent={GOLD} />
      <IsoTagPlate x={x + 1.5} y={y + 1.2} z={2.05} label={t.lottery} accent={GOLD} />
      <IsoTicketBoard x={x + 0.85} y={y + 0.15} accent={GOLD} />

      {/* Legacy card */}
      <IsoLegacySystemCard x={x + 5.45} y={y + 0.85} accent={PURPLE} />
      <IsoTagPlate x={x + 5.95} y={y + 0.85} z={1.15} label={t.legacy} accent={PURPLE} />

      {/* POS sale area */}
      <IsoCarpet x={x + 2.45} y={y + 3.0} w={3.2} d={2.0} color={CYAN} alpha={0.14} />
      <IsoPosArea x={x + 2.6} y={y + 3.15} />
      <IsoPosHero x={x + 2.85} y={y + 3.35} screen={CYAN} />
      <IsoTagPlate x={x + 3.35} y={y + 3.35} z={2.05} label={t.android} accent={CYAN} />
      <IsoPosTerminal x={x + 4.4} y={y + 3.45} screenColor={PURPLE} />
      <IsoTagPlate x={x + 4.7} y={y + 3.45} z={1.65} label={t.verifone} accent={PURPLE} />
      <PosPulseFx x={x + 2.85} y={y + 3.35} color={CYAN} isActive={animate} />
      <PosPulseFx x={x + 4.4} y={y + 3.45} color={PURPLE} isActive={animate} />
      <IsoReceiptStack x={x + 5.05} y={y + 3.55} />
      <ReceiptFeedFx x={x + 5.05} y={y + 3.55} color={GOLD} isActive={animate} />
      <ApprovalStampFx x={x + 5.3} y={y + 2.85} color="#34D399" isActive={animate} />
      <Character
        x={x + 3.8}
        y={y + 5.05}
        facing="nw"
        pose="talk"
        shirt="#3a2d12"
        accent={GOLD}
      />

      {/* Field metaphor */}
      <IsoCarpet x={x + 0.4} y={y + 5.0} w={2.0} d={1.8} color={GOLD} alpha={0.12} />
      <IsoCar x={x + 0.65} y={y + 5.4} color={CYAN} />
      <IsoTagPlate x={x + 1.15} y={y + 5.4} z={1.05} label={t.field} accent={GOLD} />
      <Character
        x={x + 2.1}
        y={y + 5.6}
        facing="sw"
        pose="stand"
        shirt="#1a1f2e"
        accent={GOLD}
      />

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
        color={GOLD}
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
