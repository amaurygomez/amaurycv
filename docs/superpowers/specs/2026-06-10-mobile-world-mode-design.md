# Mobile World Mode — Design

**Date:** 2026-06-10
**Goal:** Make the isometric AG World rooms playable on mobile without losing the concept or the fast vertical story experience.

## Approach (hybrid, opt-in)

Mobile keeps the vertical career story as the default (fast, recruiter-friendly). A prominent "Explorar AG World" card in the hero lazy-loads the real isometric world — same zones, scenes, avatar, tour, and panels as desktop — adapted for touch.

Alternatives considered:
- Full world as mobile default: rejected — heavy Pixi bundle on first load, worse for recruiters skimming.
- Card-carousel "fake world": rejected — loses the playable-map concept.

## Components

- `WorldStageCanvas`: touch drag-pan (8px threshold so taps still hit hotspots; canvas pointer-events muted mid-gesture) + pinch-zoom around the centroid (clamped to 0.7× overview fit … 4×). Manual gestures enter a "free camera" state; any zone change, zoom button, or reset re-engages the auto-framing animation. Overview camera now respects `userZoom` (also enables wheel/button zoom in overview on desktop).
- `WorldContext`: `cameraResetNonce` bumped by `resetZoom` so reset re-frames even when `userZoom` is already 1 (post-pan case).
- `ZoneNavigator`: visible below 640px as a horizontally scrollable chip strip under the top bar (was `hidden sm:flex`).
- `MobileWorld` (new): fixed-viewport world view = canvas + top bar (back to story, tour) + ZoneNavigator + ZonePanel (existing bottom drawer) + TourControls + ZoomControls + FloatingJourneyCta + Contact/Stack panels + one-time gesture hint (7s).
- `MobileEntry`: `worldOpen` state; `MobileWorld` is `lazy()` so the story bundle stays Pixi-free.
- `MobileExperience`: accepts `onEnterWorld`, renders the entry card after the hero CTAs.

## Testing

- Mobile e2e: enter world → canvas boots → tap zone chip → room dialog → close → exit back to story.
- `tests/e2e/helpers.ts`: intro button locator now `exact: true` ("Start Journey" vs HeroPanel's "Start journey") — fixed 2 desktop tests that accidentally started the tour twice.
- `playwright.config.ts`: `workers: 2` — >2 concurrent WebGL worlds saturate dev machines and time out the journey tests.
