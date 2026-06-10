import { expect, test } from "@playwright/test";
import { startExperience } from "./helpers";

test("mobile list opens a zone and closes back to cards", async ({ page }) => {
  test.setTimeout(60000);
  await startExperience(page);
  const telecomCard = page.getByRole("button", {
    name: /Calidad y Monitoreo Telecom|Telecom Quality & Monitoring/,
  });
  await expect(telecomCard).toBeVisible();
  await telecomCard.click({ force: true });
  await page.waitForTimeout(300);

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText(/Compania de telecom|Telecom carrier/)).toBeVisible();
  await page.getByRole("button", { name: /Volver atras|Go back/i }).click();
  await expect(telecomCard).toBeVisible();
});

test("mobile world mode opens the iso map, enters a room, and exits back to the story", async ({
  page,
}) => {
  test.setTimeout(90000);
  await startExperience(page);

  await page.getByRole("button", { name: /Explorar AG World|Explore AG World/ }).click();

  // Pixi canvas boots lazily.
  await expect(page.locator("canvas")).toBeVisible({ timeout: 20000 });

  // Zone chips (chapter navigator) are reachable on touch.
  const telecomChip = page.getByRole("button", { name: /(Capítulo|Chapter) 04 · Telecom/ });
  await expect(telecomChip).toBeVisible();
  await telecomChip.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Telecom/).first()).toBeVisible();

  // Exit world mode → back to the vertical story.
  await page.getByRole("button", { name: /Cerrar|Close/i }).first().click();
  await page.getByRole("button", { name: /Mi historia|My story/ }).click();
  await expect(
    page.getByRole("button", { name: /Explorar AG World|Explore AG World/ })
  ).toBeVisible();
});
