# AG World — Concept (canonical)
**Owner:** Amaury Gómez · Claude as creative director / engineering partner
**Status:** Active build · Stage 1 (free foundation)
**Domain:** amaurygomez.dev
**Last rewrite:** 2026-05-16 — pivot to "world IS the page from intro" + strip all client names (NDA/IP safety)

---

## 1 · Identity

- **Name:** **AG World**
- **Tagline:** **"I build systems that move real operations."**
- **Spanish tagline option (when locale=es):** *"Construyo sistemas que mueven operaciones reales."*
- **Concept:** A living portfolio for an AI-powered systems builder.

AG World is an interactive premium pixel-isometric world that proves Amaury Gómez can take an idea, direct AI tools as serious engineering partners, and ship production-grade systems. Inspired by the feeling of classic virtual worlds — **never copying Habbo**, never using Habbo IP.

---

## 2 · Hard rules (do not break)

- **The world IS the page from the very first paint.** No "classic mode" toggle, no separate landing — the visitor lands directly inside AG Lobby. PixiJS loads eagerly because the world *is* the entry experience.
- **No client/project/employer names visible anywhere** — not on the public site, not in this repository. Real names are NDA / IP / trust sensitive and live only in private notes. The site references **thematic archetypes** of the work done (Recording Floor, Security Vault, Finance Wing, Operations Hub) — never the customer. The same rule covers employment dates, "Present/Current" labels, institution names, and any combination of details that could identify a real organization.
- **No Habbo assets, sprites, furniture, characters, audio, or copyrighted material.** Period.
- **No phrase "Habbo pack"** anywhere in code, docs, or UI.
- **Stage 1 = legal/free/CC0 only** (Kenney CC0, OpenGameArt CC0, code-generated). Stage 2 = optional paid upgrade later.
- **Update files in place.** No `CONCEPT-v2.md`, no `iso-new.ts`, no `WorldApp-v3.tsx`.
- **Dark-first.** Light mode exists for accessibility but dark is canon.
- **Strings in Spanish** by default (canonical), bilingual EN/ES toggled in the HUD.
- **SEO content is real HTML.** A hidden semantic block (sr-only) renders the full CV text so crawlers index it even though the visible UI is the world.
- **No commits without explicit user approval.**
- **No `Co-Authored-By: Claude`** or AI attribution in commit messages.

---

## 3 · Stage 1 — Free foundation (NOW)

Goal: a working prototype impressive enough to judge the concept and prove the architecture, using **zero paid assets**.

### Stack (free/open only)

| Layer | Tool | License | Why |
|---|---|---|---|
| Framework | **Vite 8 + React 19** | MIT | Already in place. No migration overhead per "don't over-engineer". |
| Styling | **Tailwind 4** (`@tailwindcss/vite`) | MIT | Already in place. |
| UI animation | **motion 12** (Framer successor) | MIT | Already in place. Used for HTML overlays, panels, transitions. |
| 2D engine | **PixiJS 8** + **@pixi/react** | MIT | Industrial WebGL 2D, lazy-loaded only in AG World. |
| Pathfinding | **easystarjs** | MIT | A* on tile grid for avatar (added in later phase). |
| Tilemap editor | **Tiled** (desktop) | GPL (tool only — JSON output is yours) | Paint maps externally, import JSON. |
| Pixel art editor | **Pixelorama** or **LibreSprite** | GPL/AGPL | For our own custom edits. |
| Asset packs | **Kenney CC0** + **OpenGameArt CC0** | CC0 | Placeholder furniture, tiles, characters. Free for commercial use without attribution. |
| Deploy | **Vercel** | free tier | Already in place. |
| Hosting | **GitHub** | free | Already in place. |

### What we explicitly do NOT install in Stage 1

- No router library (state-based mode toggle in `App.tsx` is enough for `classic` ↔ `world`).
- No Astro migration (per "don't over-engineer" — current Vite stack does the job).
- No Howler.js / audio yet (Stage 2 polish).
- No Three.js / R3F (overkill for iso pixel).
- No commercial asset packs.

### Performance budget (Stage 1)

| Surface | Target |
|---|---|
| Initial paint of `/` (AG Lobby + chrome) | LCP < 1.8s on 4G · TBT < 200ms · Lighthouse 90+ |
| Total JS at `/` (eager since world IS the page) | < 250 KB gzipped (Pixi + scenes + UI overlays + React) |
| SEO HTML payload (hidden semantic block) | full CV text content present in initial HTML for crawlers |
| Scene switch latency | < 250ms with fade transition |

---

## 4 · Information architecture · world IS the page

```
amaurygomez.dev/                      ← lands DIRECTLY inside AG World
│
└── AG Lobby (initial scene on load)
    │
    Navigator menu (HUD button or "M" key) routes to:
    │
    ├── ai-lab            →  AI LAB · how Amaury directs AI (★ priority)
    ├── ops-command       →  OPS COMMAND · full-system thinking (★ priority)
    ├── project-district  →  PROJECT DISTRICT · thematic work archetypes
    ├── ui-studio         →  UI STUDIO · design taste, before/after
    ├── personal-signal   →  PERSONAL SIGNAL · discipline, taste, identity
    └── contact-portal    →  CONTACT PORTAL · vCard, links, handshake
```

**No mode toggle. No classic page.** The static React components that previously composed the CV are removed from the rendered tree; their content lives inside scene hotspots and inside the hidden SEO semantic block.

Navigation = HUD button (top right) + keyboard `M` opens the Navigator overlay. Scene swaps animate with a fade + gold flash transition.

### CV content → scene mapping

| Old static section | Where it lives now in AG World |
|---|---|
| Hero (name + tagline + stats) | **AG Lobby** central podium + ambient floating stats |
| About (4 pillars) | **AG Lobby** 4 floor pillars, each clickable |
| Experience (4 jobs, anonymized) | **Project District** + **AI Lab** thematic archetypes |
| Skills (4 groups, leveled bars) | **AI Lab** skill rack + **Ops Command** stack panel |
| Stack (5 categories) | **Ops Command** stack panel |
| Education + Certifications | **Personal Signal** bookshelf and certification wall |
| Footer CTA (contact) | **Contact Portal** front desk + vCard |

### SEO strategy

A hidden `<div className="sr-only">` rendered as the first child of `<body>` contains the full CV in semantic HTML (`<h1>` name, `<h2>` sections, `<ul>` experience items, etc.) — Googlebot, LinkedIn previewer, and screen readers see the complete CV. The visible UI is the world.

`<title>`, `<meta description>`, OG tags, JSON-LD `Person` schema are all populated at build time. The visible canvas world is bonus, not a barrier.

---

## 5 · Scene blueprints

### · AG Lobby
- **Purpose:** entry, set the tone, surface 3 destinations.
- **Visual:** dark navy floor with warm gold accent lines; 3 backlit doorways labeled. Subtle scanlines, no particles.
- **Hotspots:** central pedestal with name + tagline, doorway → AI Lab, doorway → Ops Command, doorway → Project District.
- **Interactive baseline:** click hotspot → InfoPanel slides in from right; click doorway → scene transition to that room.

### · AI Lab  ★ PRIORITY
- **Purpose:** the killer room. Prove "I do not just use AI. I direct AI."
- **Visual:** lab interior — terminal pedestal centered, holographic workflow diagram on the wall, "agents" rack with 4 stations (Reviewer / Architect / Tester / Builder).
- **Hotspots:**
  1. Terminal → typewriter shows a real prompt Amaury used, then the diff/output.
  2. Workflow board → animated arrows: idea → spec → plan → impl → review → ship.
  3. Agents rack → 4 cards, each = one role Amaury delegates to AI.
  4. "This site" plaque → meta: AG World itself was built directing AI.
- **Message hierarchy:**
  - Headline: **"I do not just use AI. I direct AI."**
  - Sub: how Claude Code / Codex / MCP servers / custom subagents fit his actual workflow.

### · Ops Command  ★ PRIORITY
- **Purpose:** prove "I understand the full system, not just the screen."
- **Visual:** command-center room — wall of dashboards (animated tickers), DB schema panel, deployment pipeline visualization, audit log feed scrolling.
- **Hotspots:**
  1. Dashboards wall → click to expand → real metrics he's instrumented (auth events, latency p95, deploy events).
  2. Schema panel → toy ER diagram with explainer of his approach to data design.
  3. Pipeline → CI/CD stages with green/amber/red states; click to read his deployment philosophy.
  4. Incident binder → 1 redacted incident anecdote per row (without violating NDA).
- **Message:** **"I understand the full system, not just the screen."**

### · Project District
- **Purpose:** showcase work as thematic archetypes. **No client names. No project names.** Visitors see the *kind* of system Amaury has built, not who paid for it.
- **Visual:** small district with 4 distinct mini-buildings, each a different silhouette + accent color.
- **Buildings (thematic, NDA-safe):**
  - **Recording Floor** — media / recording / streaming systems archetype
  - **Security Vault** — identity, auditing, authorization, secure institutional systems archetype
  - **Finance Wing** — loan management, banking workflows, transactional systems archetype
  - **Operations Hub** — telco / enterprise operational platforms, dashboards, internal tooling archetype
- **Hotspots per building:** Problema resuelto · Tu rol · Stack · Lo difícil · Outcome (escala, uptime, alcance — sin identificar al cliente).

### · UI Studio
- **Purpose:** prove "I care about how software feels, not only how it works."
- **Visual:** atelier — easel with a monitor frame on it, palette swatches on the wall, components mounted as picture frames.
- **Hotspots:**
  1. Easel → before/after slider of generic redesigns (no client names — show the *kind* of transformation: cluttered table → premium dashboard).
  2. Component wall → hoverable component cards rendered live.
  3. Palette swatch → design philosophy distilled in 3-5 bullets.

### · Personal Signal
- **Purpose:** humanize without oversharing. Discipline + taste + curiosity + subtle DR warmth.
- **Visual:** loft-style room — reading nook, hi-fi corner with turntable, gym corner with kettlebell, a wall map of DR with running/hiking pins.
- **Hotspots (need Amaury content drop):**
  - Bookshelf → 2-3 current books/podcasts.
  - Turntable → favorite album / hi-fi gear note.
  - Kettlebell → gym cadence (frequency, focus).
  - Wall map → 1-2 routes (San Cristóbal, Cordillera, Los Tres Ojos, wherever real).
  - Coffee cup → 1 sentence about coffee or Cibao or DR identity, sparingly.

### · Contact Portal
- **Purpose:** professional handshake without a generic contact form.
- **Visual:** small front desk with a business card and a portal mirror.
- **Hotspots:**
  - Business card → tap to copy email; flips to reveal vCard download.
  - GitHub / LinkedIn / X(?) → outbound.
  - Calendly (optional, Amaury decides) → embedded scheduling.

---

## 6 · Visual identity (Stage 1 baseline)

### Palette

```
BACKGROUND
--bg-deep        #070B14    Midnight navy, deeper than current
--bg-surface     #0F1524    Cards, panels
--bg-elevated    #1A2238    Hovered/focused
--bg-glass       rgba(15, 21, 36, 0.65) + backdrop-blur(20px)

TEXT
--text-primary   #F0EAD6    Warm cream (never cold #FFFFFF)
--text-muted     #8FA0BD
--text-dim       #5A6788

ACCENTS
--accent-gold        #E8B96B    Warm, never metallic literal
--accent-gold-soft   rgba(232,185,107,0.18)
--accent-gold-glow   rgba(232,185,107,0.45) + blur
--accent-teal        #5EEAD4    Electric teal, CTAs only
--accent-clay        #B85C38    Dominican warmth, sparingly (1-2 surfaces)

STATUS
--success #34D399
--warning #FBBF24
--danger  #F87171

HAIRLINES
gold 12%: rgba(232,185,107,0.12)
neutral:   rgba(255,255,255,0.06)
```

### Type stack
- **Display + body:** **Geist Sans** (variable, geometric grotesque)
- **Mono / data:** **Geist Mono**
- **Pixel signage** (AG World room labels only): **VT323** or **Pixel Operator** — small sizes, 10–12px, gold color, surgical.

### Motion principles
- Microinteraction: 200ms · cubic-bezier(0.22, 1, 0.36, 1)
- Element in/out: 480ms
- Scene transition: 800ms cinematic fade + scale
- Ambient drift in scenes: 12-18s linear loop (light rays, scanlines)

### Forbidden in Stage 1
- Particle systems by default
- Auto-play audio
- Cursor confetti
- Generic glassmorphism on every surface
- Letter-by-letter typewriter outside AI Lab terminal

---

## 7 · Architecture (Stage 1 → Stage 2 compatible)

```
src/
├── App.tsx                     Renders WorldApp + SeoFallback. No mode toggle.
├── components/                 LEGACY (Hero, About, Experience, …) — kept in repo
│                               but NOT rendered. Content was migrated to scenes
│                               and to the hidden SeoFallback semantic block.
├── hooks/
│   ├── useLanguage.tsx
│   └── useTheme.ts
├── i18n/
│   └── content.ts              CV source of truth — used by SeoFallback and by
│                               scene hotspots (single source, no duplication).
├── seo/
│   └── SeoFallback.tsx         sr-only semantic CV for crawlers.
├── world/                      AG WORLD (canonical visible UI)
│   ├── WorldApp.tsx            Pixi <Application> + HUD overlay
│   ├── lib/iso.ts              2:1 iso math
│   ├── state/
│   │   ├── context.ts          React Context + WorldState type
│   │   ├── WorldContext.tsx    WorldProvider component
│   │   └── useWorld.ts         hook
│   ├── content/
│   │   └── scenes.ts           Scene metadata + hotspot registry (data only)
│   ├── components/
│   │   ├── Navigator.tsx       HTML overlay: menu of 7 scenes (M key)
│   │   ├── InfoPanel.tsx       HTML overlay: hotspot detail
│   │   └── WorldOverlay.tsx    HUD: top bar, language/theme toggle, blurb
│   ├── scenes/
│   │   ├── LobbyScene.tsx           ★ furnished
│   │   ├── AiLabScene.tsx           ★ furnished
│   │   ├── OpsCommandScene.tsx      ★ furnished
│   │   ├── ProjectDistrictScene.tsx (Phase 2)
│   │   ├── UiStudioScene.tsx        (Phase 2)
│   │   ├── PersonalSignalScene.tsx  (Phase 2)
│   │   ├── ContactPortalScene.tsx   (Phase 2)
│   │   ├── SceneStub.tsx            placeholder used by Phase 2 stubs
│   │   └── index.tsx                renderScene(id) registry
│   └── render/
│       ├── IsoFloor.tsx        Pixi component: tiles a floor with color/tex
│       ├── IsoSprite.tsx       Pixi component: place a sprite on iso grid
│       └── Hotspot.tsx         Invisible clickable region at iso coords
└── types.ts                    Shared types
```

**Asset swap path (Stage 2 ready):**
- Scenes render via `<IsoFloor texture={tileSrc?} fallbackColor="#…" />` — when `tileSrc` becomes a Kenney PNG path, the floor uses it; until then, code-generated diamonds.
- Hotspots are data-defined in `content/scenes.ts` (positions, IDs, content). Visual representation can upgrade independently.
- `IsoSprite` accepts `src` (PNG/atlas frame) OR a render function (vector primitive fallback). One swap point per object.

---

## 8 · Stage 2 — Paid/legal visual upgrade (LATER)

**Do not implement now. Architecture must support it cleanly.**

When the free version proves the concept, Stage 2 adds:
- Commercial pixel-isometric pack (e.g., **pixel_Salvaje · Isometric Interiors** ~$10-15 USD on itch.io)
- Custom Amaury avatar (commissioned, ~$50-150 USD)
- Custom AG pixel logo / mascot (~$20-40 USD)
- 5-7 signature objects (own server rack, his turntable, his kettlebell, route map) (~$80-150 USD bundle)
- Audio: ambient hotel lobby loop per scene (Howler.js, royalty-free or commissioned)
- Avatar walk + pathfinding (easystarjs already pencilled in)
- Day/night cycle (optional)

Total Stage 2 estimated: **$150-400 USD one-time**.

---

## 9 · Build phases (Stage 1 only — Stage 2 deferred)

### Phase 0 — Foundation (DONE)
- world/ scaffolding, Pixi + helpers installed, lazy-loaded mode toggle.
- LobbyScene with floor + 4 hotspots; 6 scenes stubbed.

### Phase 0.5 — World-as-page pivot (THIS SESSION)
- Remove classic mode toggle. App.tsx renders WorldApp directly.
- Add SeoFallback (sr-only semantic CV) for crawlers.
- Build furniture primitives library (IsoBox, IsoMonitor, IsoChair, etc).
- Furnish AG Lobby + AI Lab + Ops Command with code-gen objects.
- Strip every client/project name from data + scenes.
- Wire hotspots to real CV content via i18n/content.ts.

### Phase 1 — Polish + Project District + UI Studio
- Build Project District with 4 thematic buildings (no client names).
- Build UI Studio with before/after slider (generic redesigns).
- Geist font integration.
- View Transitions API for scene swaps.

### Phase 2 — Personal Signal + Contact Portal
- Personal Signal needs Amaury content drop (see §10).
- Contact Portal: vCard, copy email, GitHub/LinkedIn.

### Phase 3 — Hardening + launch
- CSP, security headers, Lighthouse 90+, OG image, sitemap, hreflang.
- Domain config `amaurygomez.dev`.

---

## 10 · Content drop still needed from Amaury

**For Project District (5 lines per archetype — describe the work, NOT the client):**
- Recording Floor — problem solved / your role / tech / difficulty / outcome
- Security Vault — same
- Finance Wing — same
- Operations Hub — same

**For Personal Signal:**
- Daily setup (PC, OS, monitor)
- 2-3 books / podcasts / channels current
- Hi-fi gear or favorite album
- 1-2 hiking/running routes in DR (real, named)
- Gym cadence
- One subtle DR identity element (coffee, dish, place, music)

---

## 11 · The promise

Open **amaurygomez.dev**:
1. Classic CV loads in < 1s, Lighthouse 95+.
2. Gold "Entrar a AG World" CTA pulses softly in the navbar.
3. Click → smooth transition → Pixi chunk loads.
4. Visitor lands in **AG Lobby** — name + tagline + 3 doorways.
5. Walks to **AI Lab** — sees real prompts, real workflow, the meta plaque "this site was built directing AI".
6. Visits **Ops Command** — animated dashboards, sees a builder who understands production.
7. Closes the tab thinking: *"this guy is different."*
