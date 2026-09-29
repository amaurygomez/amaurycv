import { expect, test } from "@playwright/test";
import { startExperience } from "./helpers";

test("desktop journey finishes and reveals floating CTA", async ({ page }) => {
  test.setTimeout(60000);
  await startExperience(page);
  await page
    .getByRole("button", { name: /Iniciar recorrido guiado|Start guided journey/i })
    .click();

  for (let index = 0; index < 7; index += 1) {
    const nextButton = page
      .getByRole("toolbar", { name: /Tour controls|Controles de recorrido/i })
      .getByRole("button")
      .nth(1);
    await expect(nextButton).toBeVisible();
    await nextButton.click({ force: true });
    await page.waitForTimeout(180);
  }

  const ctaNav = page.getByRole("navigation", {
    name: /Journey actions|Acciones finales del recorrido/i,
  });
  await expect(ctaNav.getByRole("link", { name: /Contacto|Contact/i })).toBeVisible();
  await expect(ctaNav.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(ctaNav.getByRole("link", { name: /Ver CV|View CV/i })).toBeVisible();
});

test("keyboard navigation selects, opens, and closes zones", async ({ page }) => {
  test.setTimeout(60000);
  await startExperience(page);
  await page.waitForFunction(() => Boolean(document.querySelector("canvas")));
  await page.mouse.click(900, 520);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("intro can be skipped", async ({ page }) => {
  await page.goto("/world");
  await expect(page.getByRole("button", { name: /Saltar|Skip/ })).toBeVisible();
  await page.getByRole("button", { name: /Saltar|Skip/ }).click();
  await expect(page.getByText("AG World")).toBeVisible();
});

test("cta links point to the expected targets", async ({ page }) => {
  test.setTimeout(60000);
  await startExperience(page);
  await page
    .getByRole("button", { name: /Iniciar recorrido guiado|Start guided journey/i })
    .click();

  for (let index = 0; index < 7; index += 1) {
    const nextButton = page
      .getByRole("toolbar", { name: /Tour controls|Controles de recorrido/i })
      .getByRole("button")
      .nth(1);
    await expect(nextButton).toBeVisible();
    await nextButton.click({ force: true });
    await page.waitForTimeout(180);
  }

  const ctaNav = page.getByRole("navigation", {
    name: /Journey actions|Acciones finales del recorrido/i,
  });

  await expect(ctaNav.getByRole("link", { name: /Contacto|Contact/i })).toHaveAttribute(
    "href",
    /mailto:/,
  );
  await expect(ctaNav.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    /github\.com\/amaurygomez/,
  );
  await expect(ctaNav.getByRole("link", { name: /Ver CV|View CV/i })).toHaveAttribute(
    "href",
    /\/cv\?lang=(es|en)$/,
  );
});
