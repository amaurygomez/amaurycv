import { expect, test } from "@playwright/test";
import { startExperience } from "./helpers";

test("mobile list opens a zone and closes back to cards", async ({ page }) => {
  test.setTimeout(60000);
  await startExperience(page);
  const telecomCard = page.getByRole("button", {
    name: /Telecom · (Cobertura y Operación|Coverage & Operations)/,
  });
  await expect(telecomCard).toBeVisible();
  await telecomCard.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText(/operadora de telecomunicaciones|telecom carrier/).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: /Volver atrás|Go back/i }).click();
  await expect(telecomCard).toBeVisible();
});

test("mobile world mode opens the iso map, enters a room, and exits back to the story", async ({
  page,
}) => {
  test.setTimeout(90000);
  await startExperience(page);

  await page.getByRole("button", { name: /Explorar AG World|Explore AG World/ }).click();

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible({ timeout: 20000 });
  expect(
    await canvas.evaluate((element) => (element as HTMLCanvasElement).width / element.clientWidth),
  ).toBeCloseTo(1.5);

  const telecomChip = page.getByRole("button", { name: /(Capítulo|Chapter) 04 · Telecom/ });
  await expect(telecomChip).toBeVisible();
  await telecomChip.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Telecom/).first()).toBeVisible();

  await dialog
    .getByRole("button", { name: /Cerrar|Close/i })
    .first()
    .click();
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: /Mi historia|My story/ }).click();
  await expect(
    page.getByRole("button", { name: /Explorar AG World|Explore AG World/ }),
  ).toBeVisible();
});
