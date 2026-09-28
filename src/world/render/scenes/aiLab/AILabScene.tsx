import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/i18n/content";
import type { ZoneBounds } from "@/world/types";
import { DataPacketLine } from "@/world/render/fx/DataPacketLine";
import { TerminalGlow } from "@/world/render/fx/TerminalGlow";
import { Character } from "@/world/render/primitives/Character";
import { IsoCarpet } from "@/world/render/primitives/IsoCarpet";
import { IsoTagPlate } from "@/world/render/primitives/IsoTagPlate";
import { IsoWall } from "@/world/render/primitives/IsoWall";
import { CYAN, GOLD, GREEN, PURPLE } from "@/world/render/utils";
import {
  DataOrbitFx,
  IsoArchitectureBoard,
  IsoGpuWorkstation,
  IsoHumanApprovalGate,
  IsoLangfusePanel,
  IsoN8nNodes,
  IsoOpsDesk,
  IsoOpsRack,
  IsoQdrantCylinder,
  IsoRouterChip,
  ServerLedPulse,
} from "./props";

// The architecture board already names most services, so only the pieces
// missing from it get a tag plate.
type Labels = { ollama: string; humanOk: string };

const LABELS: Record<Lang, Labels> = {
  es: { ollama: "Ollama · GPU", humanOk: "Aprobación humana" },
  en: { ollama: "Ollama · GPU", humanOk: "Human approval" },
};

export function AILabScene({ bounds, animate }: { bounds: ZoneBounds; animate: boolean }) {
  const { lang } = useLanguage();
  const t = LABELS[lang];
  const { x, y, w, h } = bounds;

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#102026" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#0D1A20" />

      <IsoArchitectureBoard x={x + 0.5} y={y + 0.1} accent={CYAN} />
      <IsoLangfusePanel x={x + 5.0} y={y + 0.15} accent={PURPLE} />

      <IsoCarpet x={x + 0.5} y={y + 2.5} w={2.0} d={3.0} color={CYAN} alpha={0.1} />
      <IsoOpsRack x={x + 0.7} y={y + 2.7} accent={CYAN} />
      <ServerLedPulse x={x + 0.9} y={y + 2.9} isActive={animate} />
      <IsoTagPlate x={x + 1.35} y={y + 2.85} z={3.15} label={t.ollama} accent={CYAN} />
      <IsoGpuWorkstation x={x + 0.85} y={y + 5.0} accent={GREEN} />

      <IsoCarpet x={x + 2.7} y={y + 2.6} w={2.6} d={2.4} color={GREEN} alpha={0.1} />
      <IsoOpsDesk x={x + 2.85} y={y + 2.85} accent={CYAN} />
      <Character
        x={x + 3.85}
        y={y + 4.3}
        facing="nw"
        pose="point"
        shirt="#0e7a6c"
        accent={CYAN}
        accessory="headphones"
      />
      <DataOrbitFx x={x + 3.6} y={y + 3.4} color={CYAN} isActive={animate} />
      <TerminalGlow x={x + 3.05} y={y + 3.05} isActive={animate} />

      <IsoN8nNodes x={x + 2.5} y={y + 5.5} accent={GREEN} />
      <IsoRouterChip x={x + 4.55} y={y + 4.3} accent={GOLD} />
      <IsoQdrantCylinder x={x + 5.4} y={y + 4.85} accent={CYAN} />

      <IsoHumanApprovalGate x={x + 5.2} y={y + 2.5} accent={GREEN} />
      <IsoTagPlate x={x + 5.85} y={y + 2.4} z={2.25} label={t.humanOk} accent={GREEN} />

      <DataPacketLine
        from={{ x: x + 3.4, y: y + 5.6 }}
        to={{ x: x + 4.55, y: y + 4.55 }}
        color={GREEN}
        isActive={animate}
        offset={0.2}
      />
      <DataPacketLine
        from={{ x: x + 4.95, y: y + 4.45 }}
        to={{ x: x + 5.55, y: y + 5.0 }}
        color={GOLD}
        isActive={animate}
        offset={0.4}
      />
      <DataPacketLine
        from={{ x: x + 5.55, y: y + 4.85 }}
        to={{ x: x + 5.55, y: y + 2.85 }}
        color={CYAN}
        isActive={animate}
        offset={0.6}
      />
      <DataPacketLine
        from={{ x: x + 4.0, y: y + 3.65 }}
        to={{ x: x + 5.55, y: y + 2.85 }}
        color={CYAN}
        isActive={animate}
        offset={0.8}
      />
    </pixiContainer>
  );
}
