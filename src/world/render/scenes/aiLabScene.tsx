/**
 * AI Lab scene — Chapter 6: personal AI operations infrastructure.
 *
 * Reduced text. The architecture board already names n8n / LiteLLM /
 * Qdrant / Langfuse on its nodes, so we only label the two objects that
 * are NOT on the board: Ollama·GPU and the HUMAN OK approval gate.
 */
import type { ZoneBounds } from "../../types";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Lang } from "../../../i18n/content";
import { IsoBox, IsoCarpet, IsoWall } from "../Furniture";
import {
  DataOrbitFx,
  DataPacketLine,
  ServerLedPulse,
  TerminalGlow,
} from "../ActiveFx";
import { Character } from "../Character";
import { IsoTagPlate } from "../shared/IsoTagPlate";
import {
  IsoArchitectureBoard,
  IsoHumanApprovalGate,
  IsoLangfusePanel,
  IsoN8nNodes,
  IsoOpsDesk,
  IsoOpsRack,
  IsoQdrantCylinder,
} from "../shared/sceneObjects";

const T: Record<Lang, {
  ollama: string;
  humanOk: string;
}> = {
  es: {
    ollama: "Ollama · GPU",
    humanOk: "Aprobación humana",
  },
  en: {
    ollama: "Ollama · GPU",
    humanOk: "Human approval",
  },
};

function IsoRouterChip({
  x,
  y,
  accent = "#E8B96B",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} w={0.9} d={0.6} h={0.2} topColor={accent} leftColor="#3a2d12" rightColor="#0B101D" />
      <IsoBox x={x + 0.12} y={y + 0.12} z={0.2} w={0.65} d={0.08} h={0.06} topColor="#0B1020" leftColor="#0B1020" rightColor="#0B1020" />
      {[0.1, 0.3, 0.5, 0.7].map((dx) => (
        <IsoBox
          key={dx}
          x={x + dx}
          y={y + 0.62}
          z={0.05}
          w={0.05}
          d={0.04}
          h={0.04}
          topColor="#cfc9b8"
          leftColor="#a8a395"
          rightColor="#7a7156"
        />
      ))}
    </pixiContainer>
  );
}

function IsoGpuWorkstation({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} w={1.2} d={0.85} h={0.85} topColor="#1A2238" leftColor="#0B101D" rightColor="#070B14" />
      <IsoBox x={x + 0.15} y={y + 0.78} z={0.25} w={0.95} d={0.06} h={0.42} topColor="#070b14" leftColor={accent} rightColor="#0b101d" outline={false} />
      {[0.15, 0.45, 0.75].map((dx) => (
        <IsoBox
          key={dx}
          x={x + dx}
          y={y + 0.15}
          z={0.85}
          w={0.08}
          d={0.06}
          h={0.05}
          topColor={accent}
          leftColor={accent}
          rightColor={accent}
        />
      ))}
    </pixiContainer>
  );
}

export function AILabScene({
  bounds,
  animate,
}: {
  bounds: ZoneBounds;
  animate: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  const { x, y, w, h } = bounds;
  const CYAN = "#5EEAD4";
  const GREEN = "#34D399";
  const GOLD = "#E8B96B";
  const PURPLE = "#A78BFA";

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
