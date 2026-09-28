# amaurycv

Personal site of Amaury Gómez: an isometric portfolio world and a printable CV.
Live at https://amaurygomez.dev

## Stack

Astro 7 (static, Vercel adapter) · React 19 islands · PixiJS 8 via `@pixi/react` · Tailwind CSS 4 ·
TypeScript · Zod · Vitest · Playwright.

## Architecture

- `/` renders `WorldApp`: above 1023px it lazy-loads `DesktopEntry` and then the Pixi canvas once
  the world scrolls into view; below that, a scrollable story with no Pixi in the bundle.
- Zone copy lives in `src/world/content/zones.ts` and drives the map, the panels and the mobile
  list; each zone has its own Pixi scene under `src/world/render/scenes/`.
- `/cv` is the CV itself: static HTML, bilingual (`?lang=es|en`), with a print stylesheet.
  `npm run cv:pdf` drives headless Chromium over the running dev server and prints that same page
  into `public/Amaury-Gomez-CV-{ES,EN}.pdf`, failing if either PDF is not exactly two pages. Those
  two PDFs are committed: the Vercel build has no Chromium, so they are generated here and shipped
  as static files.
- `src/pages/api/contact.ts` and `src/pages/api/cv-request.ts` run as Vercel functions behind
  Cloudflare Turnstile and Upstash rate limits, and answer by email through Resend.
- The full CV is not in the public tree. `sealed/cv.{es,en}.pdf.enc` holds AES-256-GCM ciphertext
  produced by `npm run cv:seal` from a PDF kept outside the repo; `CV_FULL_KEY` exists only in the
  deployment environment, so the sealed files are inert without it.

## Scripts

| Script                            | What it does                                 |
| --------------------------------- | -------------------------------------------- |
| `npm run dev`                     | Astro dev server on http://127.0.0.1:4321    |
| `npm run build`                   | `astro check` then the production build      |
| `npm run preview`                 | Serve the built site                         |
| `npm run check`                   | `astro check`, ESLint and the unit tests     |
| `npm run lint` / `typecheck`      | ESLint / `astro check` alone                 |
| `npm run format` / `format:check` | Prettier write / verify                      |
| `npm run test:unit`               | Vitest (`tests/unit`)                        |
| `npm run test:e2e`                | Playwright (`tests/e2e`), needs a dev server |
| `npm run cv:pdf`                  | Print `/cv` into the two PDFs in `public/`   |
| `npm run cv:seal`                 | Encrypt a full CV into `sealed/`             |

Copy `.env.example` to `.env.local` for the API routes and `cv:seal`. Node 22.12+ (`.nvmrc`: 24).

## Layout

```
src/components/  Astro components: CV document, SEO, schema.org
src/i18n/        CV and site copy, ES and EN
src/lib/server/  API helpers: mail, rate limiting, Turnstile, sealed blobs
src/pages/       index.astro, cv.astro, api/
src/scripts/cv/  Client scripts for the CV page
src/world/       Isometric world: state, components, Pixi scenes, zone content
scripts/         cv-pdf.mjs (print), cv-seal.ts (encrypt)
sealed/          Encrypted full CV, useless without CV_FULL_KEY
tests/           Vitest units and Playwright end-to-end specs
```

## Privacy

Employer, client and institution names are generalized on the public site by design.
The full CV is sent on request.
