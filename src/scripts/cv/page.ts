import type { Lang } from "@/i18n/content";

const STORAGE_KEY = "amaurycv-lang";
const root = document.documentElement;
const langButtons = document.querySelectorAll<HTMLButtonElement>("[data-lang-option]");
const railLinks = document.querySelectorAll<HTMLElement>("[data-rail-link]");
const barLabel = document.querySelector<HTMLElement>("[data-bar-label]");
const paperToggle = document.querySelector<HTMLButtonElement>("[data-paper-toggle]");
const paperQuery = window.matchMedia("(min-width: 80rem)");

// null forces the next update; undefined means no section has been reached yet.
let activeKey: string | undefined | null = null;

function currentLang(): Lang {
  return root.dataset.lang === "en" ? "en" : "es";
}

function sectionsOf(lang: Lang) {
  return [...document.querySelectorAll<HTMLElement>(`article[data-l="${lang}"] [data-section]`)];
}

// The active section is the last one whose top has passed 30% of the viewport.
function activeSection() {
  const line = window.innerHeight * 0.3;
  return sectionsOf(currentLang())
    .filter((section) => section.getBoundingClientRect().top <= line)
    .at(-1);
}

// Language and paper view reflow the page; this keeps the reader at the same spot of the same section.
function keepPlace(change: () => void) {
  const section = activeSection();
  const offset = section ? -section.getBoundingClientRect().top / section.offsetHeight : 0;
  change();
  const target =
    section &&
    sectionsOf(currentLang()).find((item) => item.dataset.section === section.dataset.section);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY + offset * target.offsetHeight;
  window.scrollTo({ top, behavior: "instant" });
}

function updateSpy() {
  const section = activeSection();
  if (section?.dataset.section === activeKey) return;
  activeKey = section?.dataset.section;
  for (const link of railLinks) {
    if (link.dataset.railLink === activeKey) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  if (barLabel) {
    barLabel.textContent = section
      ? `${section.dataset.index} ${section.dataset.label}`
      : (barLabel.dataset.default ?? "");
  }
}

function setLang(lang: Lang) {
  if (lang === currentLang()) return;
  const hashSection = location.hash
    ? document.getElementById(decodeURIComponent(location.hash.slice(1)))?.dataset.section
    : undefined;

  keepPlace(() => {
    root.dataset.lang = lang;
    root.lang = lang;
  });
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Private mode: the choice still applies to this page through the URL.
  }

  const url = new URL(location.href);
  url.searchParams.set("lang", lang);
  const translated =
    hashSection && sectionsOf(lang).find((item) => item.dataset.section === hashSection);
  if (translated) url.hash = translated.id;
  history.replaceState(history.state, "", url);

  syncLangButtons();
  activeKey = null;
  updateSpy();
}

function syncLangButtons() {
  for (const button of langButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.langOption === currentLang()));
  }
}

function setPaper(on: boolean) {
  keepPlace(() => {
    if (on) root.dataset.surface = "paper";
    else delete root.dataset.surface;
  });
  paperToggle?.setAttribute("aria-pressed", String(on));
}

for (const button of langButtons) {
  button.addEventListener("click", () => setLang(button.dataset.langOption === "en" ? "en" : "es"));
}

paperToggle?.addEventListener("click", () => setPaper(root.dataset.surface !== "paper"));
paperQuery.addEventListener("change", (event) => {
  if (!event.matches && root.dataset.surface === "paper") setPaper(false);
});

let frame = 0;
window.addEventListener(
  "scroll",
  () => {
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      updateSpy();
    });
  },
  { passive: true },
);

document.addEventListener("click", async (event) => {
  const trigger = (event.target as Element).closest<HTMLElement>("[data-request-open]");
  if (!trigger) return;
  const { openRequest } = await import("./request");
  openRequest(trigger);
});

syncLangButtons();
updateSpy();
