import type { Page } from "@playwright/test";

// AG World opens straight onto the map: there is no intro gate to clear.
export async function startExperience(page: Page) {
  await page.goto("/world");
}
