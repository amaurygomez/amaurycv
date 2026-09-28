import type { Locator, Page } from "@playwright/test";

// Marking the intro as seen up front avoids racing the intro mount.
async function setIntroSeen(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("introSeen", "1");
    } catch {
      // localStorage throws on opaque origins such as about:blank.
    }
  });
}

async function waitVisible(locator: Locator, timeout = 8000) {
  return locator
    .first()
    .waitFor({ state: "visible", timeout })
    .then(() => true)
    .catch(() => false);
}

export async function startExperience(page: Page) {
  await setIntroSeen(page);
  await page.goto("/");

  // Exact match: HeroPanel's tour button is "Start journey" and must not be
  // clicked here, only the intro's "Start Journey".
  const startButton = page.getByRole("button", { name: "Start Journey", exact: true });
  const skipButton = page.getByRole("button", { name: /Saltar|Skip/ });

  if (await waitVisible(startButton, 2000)) {
    await startButton.click();
    return;
  }

  if (await waitVisible(skipButton, 2000)) {
    await skipButton.click();
  }
}
