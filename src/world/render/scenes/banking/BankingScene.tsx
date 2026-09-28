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
import { CYAN, GOLD, GREEN, RED } from "@/world/render/utils";
import {
  IsoBatConsole,
  IsoDocumentDesk,
  IsoEventTent,
  IsoFileCabinet,
  IsoJasperPrinter,
  IsoLoanBoard,
  IsoLoanCounter,
} from "./props";

type Labels = {
  reports: string;
  advisor: string;
  jasper: string;
  fair: string;
  docs: string;
  batScript: string;
};

const LABELS: Record<Lang, Labels> = {
  es: {
    reports: "Cartera · Reportes",
    advisor: "Asesor de crédito",
    jasper: "Jasper",
    fair: "Préstamos",
    docs: "Gestión documental",
    batScript: "Script .bat",
  },
  en: {
    reports: "Portfolio · Reports",
    advisor: "Loan officer",
    jasper: "Jasper",
    fair: "Loans",
    docs: "Document handling",
    batScript: ".bat script",
  },
};

// The loan desk sits in the left half so the zone panel never covers it; the
// far-right strip (file cabinet and script) is allowed to sit under the panel.
export function BankingScene({ bounds, animate }: { bounds: ZoneBounds; animate: boolean }) {
  const { lang } = useLanguage();
  const t = LABELS[lang];
  const { x, y, w, h } = bounds;

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#211E16" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#18150F" />

      <IsoLoanBoard x={x + 0.4} y={y + 0.15} accent={GREEN} />
      <IsoTagPlate x={x + 1.5} y={y + 0.15} z={2.15} label={t.reports} accent={GREEN} />

      {/* Loan desk */}
      <IsoCarpet x={x + 0.3} y={y + 2.2} w={3.8} d={2.2} color={GOLD} alpha={0.18} />
      <IsoLoanCounter x={x + 0.5} y={y + 2.45} accent={GOLD} />
      <IsoTagPlate x={x + 1.8} y={y + 2.45} z={1.75} label={t.advisor} accent={GOLD} />
      <Character
        x={x + 1.55}
        y={y + 3.75}
        facing="nw"
        pose="stand"
        shirt="#1a1f2e"
        accent={GOLD}
        accessory="tie"
      />
      <IsoJasperPrinter x={x + 3.05} y={y + 2.65} accent={GREEN} />
      <IsoTagPlate x={x + 3.6} y={y + 2.65} z={1.45} label={t.jasper} accent={GREEN} />
      <ReceiptFeedFx x={x + 3.05} y={y + 2.65} color={GREEN} isActive={animate} />
      <ApprovalStampFx x={x + 3.9} y={y + 2.65} color={GREEN} isActive={animate} />
      <DataPacketLine
        from={{ x: x + 2.35, y: y + 2.85 }}
        to={{ x: x + 3.35, y: y + 3.0 }}
        color={GREEN}
        isActive={animate}
        offset={0.35}
      />

      {/* Loan campaign */}
      <IsoCarpet x={x + 0.3} y={y + 4.7} w={2.5} d={1.9} color={GOLD} alpha={0.11} />
      <IsoEventTent x={x + 0.5} y={y + 4.9} accent={GOLD} />
      <IsoCar x={x + 0.9} y={y + 5.8} color={CYAN} />
      <IsoTagPlate x={x + 1.4} y={y + 5.8} z={1.0} label={t.fair} accent={GOLD} />
      <Character x={x + 2.55} y={y + 5.6} facing="sw" pose="talk" shirt="#3a2d12" accent={GOLD} />

      {/* Loan paperwork */}
      <IsoCarpet x={x + 3.1} y={y + 4.7} w={2.2} d={2.0} color={CYAN} alpha={0.1} />
      <IsoDocumentDesk x={x + 3.4} y={y + 5.0} accent={GOLD} />
      <IsoTagPlate x={x + 4.2} y={y + 5.0} z={1.45} label={t.docs} accent={GOLD} />
      <Character
        x={x + 4.45}
        y={y + 6.05}
        facing="nw"
        pose="stand"
        shirt="#1a1f2e"
        accent={GOLD}
        accessory="tie"
      />

      <IsoFileCabinet x={x + 5.85} y={y + 1.0} accent={CYAN} />
      <IsoBatConsole x={x + 5.85} y={y + 2.65} accent={GREEN} />
      <IsoTagPlate x={x + 6.15} y={y + 2.65} z={1.4} label={t.batScript} accent={GREEN} />
      <DataPacketLine
        from={{ x: x + 6.15, y: y + 1.55 }}
        to={{ x: x + 6.15, y: y + 2.85 }}
        color={RED}
        isActive={animate}
        offset={0.2}
      />
    </pixiContainer>
  );
}
