/**
 * Banking scene — Chapter 3: Bank · Loans, Reports, Fair, Automation.
 *
 * Layout discipline:
 *   - The HERO (banker desk + Jasper printer) lives on the LEFT third of
 *     the room so the right panel never covers it.
 *   - Loan-campaign tent + car: bottom-left.
 *   - Teller window + queue: bottom-center (inside the safe area).
 *   - File cabinet + .bat script: far right strip — intentionally outside
 *     the hero frame; the right panel can cover this without losing story.
 */
import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import type { ZoneBounds } from "../../types";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Lang } from "../../../i18n/content";
import { iso } from "../../lib/iso";
import { IsoBox, IsoCarpet, IsoWall } from "../Furniture";
import {
  ApprovalStampFx,
  DataPacketLine,
  ReceiptFeedFx,
} from "../ActiveFx";
import { Character } from "../Character";
import { IsoCar } from "../SceneProps";
import { IsoTagPlate } from "../shared/IsoTagPlate";
import {
  IsoBatConsole,
  IsoEventTent,
  IsoFileCabinet,
  IsoLoanCounter,
} from "../shared/sceneObjects";

const T: Record<Lang, {
  reports: string;
  officer: string;
  jasper: string;
  fair: string;
  docs: string;
  batScript: string;
}> = {
  es: {
    reports: "Cartera · Reportes",
    officer: "Asesor de crédito",
    jasper: "Jasper",
    fair: "Préstamos",
    docs: "Gestión documental",
    batScript: "Script .bat",
  },
  en: {
    reports: "Portfolio · Reports",
    officer: "Loan officer",
    jasper: "Jasper",
    fair: "Loans",
    docs: "Document handling",
    batScript: ".bat script",
  },
};

function hex(c: string) {
  return parseInt(c.replace(/^#/, ""), 16);
}

function IsoJasperPrinter({
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
      <IsoBox x={x} y={y} w={1.15} d={1.0} h={0.58} topColor="#f6f1e6" leftColor="#a8a395" rightColor="#7a7156" />
      <IsoBox x={x + 0.15} y={y + 0.1} z={0.58} w={0.85} d={0.12} h={0.06} topColor={accent} leftColor={accent} rightColor={accent} />
      <IsoBox x={x + 0.18} y={y + 0.06} z={0.64} w={0.8} d={0.04} h={0.42} topColor="#f6f1e6" leftColor="#cfc9b8" rightColor="#a8a395" />
      <IsoBox x={x + 0.22} y={y + 0.07} z={0.76} w={0.55} d={0.03} h={0.04} topColor={accent} leftColor={accent} rightColor={accent} />
      <IsoBox x={x + 0.22} y={y + 0.07} z={0.86} w={0.45} d={0.03} h={0.04} topColor={accent} leftColor={accent} rightColor={accent} />
      <IsoBox x={x + 0.22} y={y + 0.07} z={0.96} w={0.6} d={0.03} h={0.04} topColor={accent} leftColor={accent} rightColor={accent} />
    </pixiContainer>
  );
}

// Wall-mounted loan portfolio / Jasper chart board.
function IsoLoanBoardWall({
  x,
  y,
  accent = "#34D399",
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const colorHex = hex(accent);
      const bars = [12, 22, 16, 28, 20, 32, 24];
      bars.forEach((height, index) => {
        const p = iso(x + 0.2 + index * 0.27, y + 0.08, 1.4);
        g.rect(p.x, p.y - height, 6, height);
        g.fill({ color: colorHex, alpha: 0.78 });
      });
      const trendPts: { x: number; y: number }[] = [];
      bars.forEach((height, i) => {
        const p = iso(x + 0.2 + i * 0.27, y + 0.08, 1.4);
        trendPts.push({ x: p.x + 3, y: p.y - height - 2 });
      });
      for (let i = 0; i < trendPts.length - 1; i += 1) {
        g.moveTo(trendPts[i].x, trendPts[i].y);
        g.lineTo(trendPts[i + 1].x, trendPts[i + 1].y);
        g.stroke({ color: 0xe8b96b, alpha: 0.95, width: 1.4 });
      }
    },
    [x, y, accent]
  );
  return (
    <pixiContainer>
      <IsoBox x={x} y={y} z={0.6} w={2.2} d={0.06} h={1.45} topColor="#070B14" leftColor="#1A2238" rightColor="#0F1524" />
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}

export function BankingScene({
  bounds,
  animate,
}: {
  bounds: ZoneBounds;
  animate: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  const { x, y, w, h } = bounds;
  const GOLD = "#E8B96B";
  const GREEN = "#34D399";
  const CYAN = "#5EEAD4";
  const RED = "#F87171";

  return (
    <pixiContainer>
      <IsoWall x={x} y={y} side="north" length={w} color="#211E16" />
      <IsoWall x={x} y={y} side="west" length={h - 1} color="#18150F" />

      {/* North wall: loan board with single label */}
      <IsoLoanBoardWall x={x + 0.4} y={y + 0.15} accent={GREEN} />
      <IsoTagPlate x={x + 1.5} y={y + 0.15} z={2.15} label={t.reports} accent={GREEN} />

      {/* HERO: banker desk + Jasper printer — anchored to the LEFT half */}
      <IsoCarpet x={x + 0.3} y={y + 2.2} w={3.8} d={2.2} color={GOLD} alpha={0.18} />
      <IsoLoanCounter x={x + 0.5} y={y + 2.45} accent={GOLD} />
      <IsoTagPlate x={x + 1.8} y={y + 2.45} z={1.75} label={t.officer} accent={GOLD} />
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

      {/* Loan campaign (bottom-left) */}
      <IsoCarpet x={x + 0.3} y={y + 4.7} w={2.5} d={1.9} color={GOLD} alpha={0.11} />
      <IsoEventTent x={x + 0.5} y={y + 4.9} accent={GOLD} />
      <IsoCar x={x + 0.9} y={y + 5.8} color={CYAN} />
      <IsoTagPlate x={x + 1.4} y={y + 5.8} z={1.0} label={t.fair} accent={GOLD} />
      <Character
        x={x + 2.55}
        y={y + 5.6}
        facing="sw"
        pose="talk"
        shirt="#3a2d12"
        accent={GOLD}
      />

      {/* Document handling — loan-campaign paperwork (matches the
          "calculation, documentation, and management" experience). A small
          worktable with stacked loan documents + approval stamp. Replaces
          the generic teller window which did not match the lending
          story (it was Java enterprise loans + Jasper, not retail teller). */}
      <IsoCarpet x={x + 3.1} y={y + 4.7} w={2.2} d={2.0} color={CYAN} alpha={0.1} />
      <IsoBox x={x + 3.4} y={y + 5.0} w={1.6} d={1.0} h={0.75} topColor="#3a2415" leftColor="#23170D" rightColor="#160E07" />
      {/* Document stacks on top */}
      <IsoBox x={x + 3.55} y={y + 5.15} z={0.75} w={0.55} d={0.4} h={0.08} topColor="#f6f1e6" leftColor="#cfc9b8" rightColor="#a8a395" />
      <IsoBox x={x + 3.58} y={y + 5.18} z={0.83} w={0.5} d={0.36} h={0.06} topColor="#f6f1e6" leftColor="#cfc9b8" rightColor="#a8a395" />
      <IsoBox x={x + 4.2} y={y + 5.15} z={0.75} w={0.55} d={0.4} h={0.06} topColor="#f6f1e6" leftColor="#cfc9b8" rightColor="#a8a395" />
      {/* Gold approval stamp on the right edge of the table */}
      <IsoBox x={x + 4.78} y={y + 5.3} z={0.75} w={0.18} d={0.22} h={0.12} topColor={GOLD} leftColor="#7a4b12" rightColor="#4a2b08" />
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

      {/* Far-right strip: file cabinet + .bat. Intentionally beyond the
          hero frame — the right panel may cover part of this strip. */}
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
