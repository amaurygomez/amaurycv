import type { ReactNode } from "react";
import {
  AILabMetaphor,
  BankingAutomationMetaphor,
  DisciplineMetaphor,
  PosTerminalMetaphor,
  OriginMetaphor,
  PublicSectorAuditMetaphor,
  TelecomCoverageMetaphor,
} from "@/world/components/metaphors";
import type { ZoneId } from "@/world/types";

export function renderZoneMetaphor(zoneId: ZoneId, accent: string, className?: string): ReactNode {
  switch (zoneId) {
    case "telecom":
      return <TelecomCoverageMetaphor accent={accent} className={className} />;
    case "public-sector":
      return <PublicSectorAuditMetaphor accent={accent} className={className} />;
    case "banking":
      return <BankingAutomationMetaphor accent={accent} className={className} />;
    case "pos":
      return <PosTerminalMetaphor accent={accent} className={className} />;
    case "ai-lab":
      return <AILabMetaphor accent={accent} className={className} />;
    case "discipline":
      return <DisciplineMetaphor accent={accent} className={className} />;
    case "origin":
      return <OriginMetaphor accent={accent} className={className} />;
    default:
      return null;
  }
}
