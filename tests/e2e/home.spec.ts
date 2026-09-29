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

test("home has no serious or critical accessibility violations", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const blocking = results.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
  expect(blocking).toEqual([]);
});
