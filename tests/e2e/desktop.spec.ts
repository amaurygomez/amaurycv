import { expect, test } from "@playwright/test";
import { startExperience } from "./helpers";

test("desktop journey visits each chapter and reveals the expected actions", async ({ page }) => {
  test.setTimeout(60000);
  await startExperience(page);
  await page
    .getByRole("button", { name: /Iniciar recorrido guiado|Start guided journey/i })
    .click();

  const tour = page.getByRole("toolbar", { name: /Tour controls|Controles de recorrido/i });
  const nextButton = tour.getByRole("button", { name: /Siguiente|Next/i });
  for (let chapter = 1; chapter < 7; chapter += 1) {
    await expect(tour.getByText(new RegExp(`^${chapter} / 7`))).toBeVisible();
    await nextButton.click();
  }
  await expect(tour.getByText(/^7 \/ 7/)).toBeVisible();
  await tour.getByRole("button", { name: /Finalizar|Finish/i }).click();

  const ctaNav = page.getByRole("navigation", {
    name: /Journey actions|Acciones finales del recorrido/i,
  });
  const contact = ctaNav.getByRole("link", { name: /Contacto|Contact/i });
  const github = ctaNav.getByRole("link", { name: "GitHub" });
  const cv = ctaNav.getByRole("link", { name: /Ver CV|View CV/i });
  await expect(contact).toBeVisible();
  await expect(contact).toHaveAttribute("href", /mailto:/);
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute("href", /github\.com\/amaurygomez/);
  await expect(cv).toBeVisible();
  await expect(cv).toHaveAttribute("href", /\/cv\?lang=(es|en)$/);
});

test("keyboard navigation selects, opens, and closes zones", async ({ page }) => {
  test.setTimeout(60000);
  await startExperience(page);
  await expect(page.locator("canvas")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("the world opens without an intro gate", async ({ page }) => {
  await page.goto("/world");
  await expect(page.getByRole("button", { name: /Saltar|Skip|Enter AG World/ })).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: /Career chapters|Capítulos profesionales/ }),
  ).toBeVisible();
});
