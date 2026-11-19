import { expect, test } from "@playwright/test";

const turnstileStub = `window.turnstile = {
  render(_el, options) {
    window.turnstileAction = options.action;
    setTimeout(() => options.callback("test-token-123"), 0);
    return "w1";
  },
  reset() {}, remove() {},
};
const loadCallbackName = new URL(document.currentScript.src).searchParams.get("onload");
if (loadCallbackName) window[loadCallbackName]?.();`;

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
  await expect(page).toHaveURL(/\/en$/);
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
    route.fulfill({ contentType: "text/javascript", body: turnstileStub }),
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
  expect(await page.evaluate(() => Reflect.get(window, "turnstileAction"))).toBe("contact");
  expect(sent).toMatchObject({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Tipo: Integración o API\n\nNecesitamos integrar dos sistemas internos.",
    website: "",
    turnstileToken: "test-token-123",
  });
});

test("AG World contact uses the same Turnstile action as the home contact form", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/turnstile/v0/api.js*", (route) =>
    route.fulfill({ contentType: "text/javascript", body: turnstileStub }),
  );
  let sent: unknown;
  await page.route("**/api/contact", (route) => {
    sent = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true } });
  });

  await page.goto("/world");
  await page
    .getByRole("button", { name: /^(Contacto|Contact)$/ })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/Tu nombre|Your name/).fill("Ada Lovelace");
  await dialog.getByLabel(/Tu email|Your email/).fill("ada@example.com");
  await dialog.getByLabel(/^(Mensaje|Message)$/).fill("We want to integrate two internal systems.");
  await dialog.getByRole("button", { name: /Enviar mensaje|Send message/ }).click();

  await expect(dialog.getByText(/Te respondo pronto|I'll reply soon/)).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window, "turnstileAction"))).toBe("contact");
  expect(sent).toEqual({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "We want to integrate two internal systems.",
    website: "",
    turnstileToken: "test-token-123",
  });
});

test("/en is served in English, with hreflang alternates, and shares the language with /cv", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { level: 1, name: /Software engineering for operations/ }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute("href", /amaurygomez\.dev\/$/);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", /\/en$/);
  expect(await page.evaluate(() => localStorage.getItem("amaurycv-lang"))).toBe("en");
});
