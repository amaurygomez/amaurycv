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
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const blocking = results.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map(
      (v) =>
        `${v.id}: ${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 3)
          .join(" | ")}`,
    );
  expect(blocking).toEqual([]);
});

test("home contact form sends the message with the project type", async ({ page }) => {
  await page.route("**/turnstile/v0/api.js*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.turnstile = {
        render(_el, options) { setTimeout(() => options.callback("test-token-123"), 0); return "w1"; },
        reset() {}, remove() {},
      };`,
    }),
  );
  let sent: Record<string, string> | undefined;
  await page.route("**/api/contact", (route) => {
    sent = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true } });
  });

  await page.goto("/");
  const form = page.locator("#contact-form");
  await form.scrollIntoViewIfNeeded();

  // An incomplete form is stopped in the browser and says why.
  await form.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(form.getByRole("alert")).toContainText("nombre");
  expect(sent).toBeUndefined();

  await form.getByLabel("Nombre").fill("Ada Lovelace");
  await form.getByLabel("Correo de trabajo").fill("ada@example.com");
  await form.getByLabel("Tipo de proyecto").selectOption({ label: "Integración o API" });
  await form.getByLabel("¿Qué necesita?").fill("Necesitamos integrar dos sistemas internos.");
  await form.getByRole("button", { name: "Enviar mensaje" }).click();

  await expect(page.getByRole("heading", { name: "Mensaje recibido" })).toBeVisible();
  expect(sent).toMatchObject({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Tipo: Integración o API\n\nNecesitamos integrar dos sistemas internos.",
    website: "",
    turnstileToken: "test-token-123",
  });
});
