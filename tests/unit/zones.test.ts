import { describe, expect, it } from "vitest";
import { ZONE_META, ZONE_ORDER } from "../../src/world/content/zones";

describe("zone content", () => {
  it("keeps the canonical zone order", () => {
    expect(ZONE_ORDER).toEqual([
      "telecom",
      "public-sector",
      "banking",
      "pos",
      "ai-lab",
      "discipline",
      "origin",
    ]);
  });

  it("provides subtitle, period, and scale text for every zone", () => {
    for (const zone of Object.values(ZONE_META)) {
      expect(zone.subtitleEs.length).toBeGreaterThan(10);
      expect(zone.subtitleEn.length).toBeGreaterThan(10);
      expect(zone.periodEs).toMatch(/→/);
      expect(zone.periodEn).toMatch(/→/);
      expect(zone.scaleEs.length).toBeGreaterThan(2);
      expect(zone.scaleEn.length).toBeGreaterThan(2);
    }
  });

  it("keeps three-sentence bodies and at least three story items", () => {
    for (const zone of Object.values(ZONE_META)) {
      expect(zone.bodyEs.split(". ").length).toBe(3);
      expect(zone.bodyEn.split(". ").length).toBe(3);
      const items = zone.experiences?.length ?? zone.timeline?.length ?? 0;
      expect(items).toBeGreaterThanOrEqual(3);
    }
  });
});
