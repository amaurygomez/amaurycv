import { expect, test } from "@playwright/test";

test("home shows the brand pitch and routes to AG World and the full CV", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Ingeniería de software para operaciones/ }),
  ).toBeVisible();
  await expect(page.locator('a[href="/world"]').first()).toBeAttached();
  await expect(page.locator('a[href="/cv#full-cv"]').first()).toBeAttached();
  await expect(page.getByText("hello@amaurygomez.dev").first()).toBeVisible();
});

test("home switches to English without a reload", async ({ page }) => {
  await page.goto("/");
  await page.locator('.lang-btn[data-lang="en"]').click();
  await expect(
    page.getByRole("heading", { level: 1, name: /Software engineering for operations/ }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
