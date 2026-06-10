import { describe, expect, it } from "vitest";
import { ZONE_META, ZONE_ORDER } from "../../src/world/content/zones";

describe("zone content", () => {
  it("keeps the canonical zone order", () => {
    expect(ZONE_ORDER).toEqual([
      "telecom-quality",
      "public-security",
      "banking-finance",
      "software-factory",
      "personal-lab",
      "discipline-life",
      "education-path",
    ]);
  });

  it("provides subtitle, period, scale, and thumb text for every zone", () => {
    for (const zone of Object.values(ZONE_META)) {
      expect(zone.subtitleEs.length).toBeGreaterThan(10);
      expect(zone.subtitleEn.length).toBeGreaterThan(10);
      expect(zone.periodEs).toMatch(/→/);
      expect(zone.periodEn).toMatch(/→/);
      expect(zone.scaleEs.length).toBeGreaterThan(2);
      expect(zone.scaleEn.length).toBeGreaterThan(2);
      expect(zone.thumbEs.length).toBeGreaterThan(5);
      expect(zone.thumbEn.length).toBeGreaterThan(5);
    }
  });

  it("keeps three-sentence bodies and at least three bullet points", () => {
    for (const zone of Object.values(ZONE_META)) {
      expect(zone.bodyEs.split(". ").length).toBe(3);
      expect(zone.bodyEn.split(". ").length).toBe(3);
      expect(zone.bulletsEs?.length).toBeGreaterThanOrEqual(3);
      expect(zone.bulletsEn?.length).toBeGreaterThanOrEqual(3);
    }
  });
});
