import type { Locator, Page } from "@playwright/test";

// Pre-mark the intro as seen so the test starts directly in the post-intro
// state. This avoids a class of flake where the test races the intro mount.
export async function setIntroSeen(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("introSeen", "1");
    } catch {
      // ignore — storage may be unavailable in some test contexts
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

  // After localStorage skip, the intro should already be gone. But if a
  // stale state shows the intro CTAs, click through them — never sleep
  // and guess.
  // Exact match: the intro CTA is "Start Journey" (capital J). Without exact,
  // this also matches HeroPanel's "Start journey" tour CTA and accidentally
  // starts the tour before the test does.
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
