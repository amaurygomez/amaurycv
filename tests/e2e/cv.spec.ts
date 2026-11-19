import { expect, test, type Page } from "@playwright/test";

// Replaces Cloudflare's widget: it hands out a token at once and counts resets.
const turnstileStub = `
  let options;
  let tokenCount = 0;
  function issueToken() {
    const token = "test-token-" + ++tokenCount;
    setTimeout(() => options.callback(token));
  }
  window.turnstileResets = 0;
  window.turnstileActions = [];
  window.turnstile = {
    render(container, config) {
      options = config;
      window.turnstileActions.push(config.action);
      issueToken();
      return "widget";
    },
    reset() {
      window.turnstileResets += 1;
      issueToken();
    },
    remove() {},
  };
`;

const turnstileResets = (page: Page) =>
  page.evaluate(() => Reflect.get(window, "turnstileResets") as number);

test("switching language updates the URL, storage and visible CV without a reload", async ({
  page,
}) => {
  await page.goto("/cv?lang=es");
  await expect(
    page.getByRole("heading", { level: 2, name: "Experiencia", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => Reflect.set(window, "samePage", true));

  await page.getByRole("button", { name: "English" }).click();

  await expect(page).toHaveURL(/[?&]lang=en\b/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { level: 2, name: "Experience", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Experiencia", exact: true }),
  ).toBeHidden();
  await expect(page.getByRole("button", { name: "English" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(await page.evaluate(() => localStorage.getItem("amaurycv-lang"))).toBe("en");
  expect(await page.evaluate(() => Reflect.get(window, "samePage"))).toBe(true);
});

test("the PDF link follows the language", async ({ page }) => {
  await page.goto("/cv?lang=es");
  const pdf = page.locator("a[download]").filter({ visible: true });
  await expect(pdf).toHaveAttribute("href", "/Amaury-Gomez-CV-ES.pdf");

  await page.getByRole("button", { name: "English" }).click();
  await expect(pdf).toHaveAttribute("href", "/Amaury-Gomez-CV-EN.pdf");

  const response = await page.request.get((await pdf.getAttribute("href"))!);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test.describe("full CV request dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/turnstile/v0/api.js*", (route) =>
      route.fulfill({ contentType: "text/javascript", body: turnstileStub }),
    );
    await page.goto("/cv?lang=en");
  });

  async function submitRequest(page: Page) {
    await page.locator("#full-cv").getByRole("button", { name: "Request full CV" }).click();
    const dialog = page.getByRole("dialog", { name: "Request the full CV" });
    await dialog.getByLabel("Name").fill("Ana Pérez");
    await dialog.getByLabel("Company").fill("Acme");
    await dialog.getByLabel("Work email").fill("ana@example.com");
    await dialog.getByLabel("Role you are hiring for").fill("Senior engineer");
    await dialog.getByRole("button", { name: "Send request" }).click();
    return dialog;
  }

  test("a 200 confirms the request and another request gets a new challenge", async ({ page }) => {
    const sent: unknown[] = [];
    await page.route("**/api/cv-request", (route) => {
      sent.push(route.request().postDataJSON());
      return route.fulfill({ json: { ok: true } });
    });

    const dialog = await submitRequest(page);

    await expect(
      dialog.getByRole("heading", { name: "Request received. I’ll reply to ana@example.com." }),
    ).toBeFocused();
    expect(sent).toEqual([
      {
        name: "Ana Pérez",
        company: "Acme",
        email: "ana@example.com",
        role: "Senior engineer",
        lang: "en",
        website: "",
        turnstileToken: "test-token-1",
      },
    ]);

    await dialog.getByRole("button", { name: "Make another request" }).click();
    await dialog.getByLabel("Work email").fill("other@example.com");
    await dialog.getByRole("button", { name: "Send request" }).click();
    await expect(
      dialog.getByRole("heading", { name: "Request received. I’ll reply to other@example.com." }),
    ).toBeFocused();
    expect(sent).toHaveLength(2);
    expect(sent[1]).toMatchObject({ email: "other@example.com", turnstileToken: "test-token-2" });
    expect(await page.evaluate(() => Reflect.get(window, "turnstileActions"))).toEqual([
      "cv-request",
      "cv-request",
    ]);
  });

  test("a 429 explains the wait and keeps sending locked", async ({ page }) => {
    await page.route("**/api/cv-request", (route) =>
      route.fulfill({
        status: 429,
        headers: { "retry-after": "300" },
        json: { error: "rate_limited", retryAfter: 300 },
      }),
    );

    const dialog = await submitRequest(page);

    await expect(dialog.getByRole("alert")).toContainText("Try again in 5 min");
    await expect.poll(() => turnstileResets(page)).toBe(1);
    await expect(dialog.getByRole("button", { name: "Send request" })).toBeDisabled();
  });

  test("a 502 keeps the form, offers email and gets a fresh token", async ({ page }) => {
    await page.route("**/api/cv-request", (route) =>
      route.fulfill({ status: 502, json: { error: "send_failed" } }),
    );

    const dialog = await submitRequest(page);

    const alert = dialog.getByRole("alert");
    await expect(alert).toContainText("Couldn’t send it.");
    await expect(alert.getByRole("link")).toHaveAttribute("href", /^mailto:/);
    await expect(dialog.getByLabel("Work email")).toHaveValue("ana@example.com");
    await expect.poll(() => turnstileResets(page)).toBe(1);
    await expect(dialog.getByRole("button", { name: "Send request" })).toBeEnabled();
  });
});
