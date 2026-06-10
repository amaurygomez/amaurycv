import type { ReactNode } from "react";
import {
  AILabMetaphor,
  BankingAutomationMetaphor,
  DisciplineMetaphor,
  PosTerminalMetaphor,
  OriginMetaphor,
  PublicSectorAuditMetaphor,
  TelecomCoverageMetaphor,
} from "../metaphors";
import type { ZoneId } from "../../types";

export function renderZoneMetaphor(zoneId: ZoneId, accent: string, className?: string): ReactNode {
  switch (zoneId) {
    case "telecom-quality":
      return <TelecomCoverageMetaphor accent={accent} className={className} />;
    case "public-security":
      return <PublicSectorAuditMetaphor accent={accent} className={className} />;
    case "banking-finance":
      return <BankingAutomationMetaphor accent={accent} className={className} />;
    case "software-factory":
      return <PosTerminalMetaphor accent={accent} className={className} />;
    case "personal-lab":
      return <AILabMetaphor accent={accent} className={className} />;
    case "discipline-life":
      return <DisciplineMetaphor accent={accent} className={className} />;
    case "education-path":
      return <OriginMetaphor accent={accent} className={className} />;
    default:
      return null;
  }
}
