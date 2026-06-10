# Amaury Gómez — Personal Portfolio

Animated personal portfolio and CV for **Amaury Emmanuel Gómez Rodríguez**, Senior Software Engineer & Enterprise Systems Architect.

Built with a Tailwind-first approach — no custom CSS, just utility tokens, gradients, and motion.

## Tech

- **React** (latest)
- **TypeScript**
- **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Motion** (Framer Motion successor) for animations
- **lucide-react** for icons

## Features

- Animated hero with status indicator and live stats
- Glass card UI with gradient borders and floating background orbs
- Scroll-progress bar at the top of the page
- Two-sided animated timeline of professional experience
- Skill grid with animated progress bars
- Technology stack pills grouped by category
- Education and certifications grid
- Dark / light mode toggle (persisted in `localStorage`)
- Fully responsive, mobile-first layout

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# typecheck + production build
npm run build

# preview the production build locally
npm run preview
```

The dev server runs on http://localhost:5173 by default.

## Project structure

```
src/
├── components/        # UI sections (Hero, Experience, Skills, etc.)
├── data/cv.ts         # All CV content (single source of truth)
├── hooks/useTheme.ts  # Dark/light mode hook
├── App.tsx
├── main.tsx
└── index.css          # Tailwind v4 import only
```

To update the CV content, edit **`src/data/cv.ts`** — it is the single source of truth for the profile, experience, skills, stack, education, and certifications.

## Deploying to Vercel

This project is Vercel-ready.

### Option 1 — From the Vercel dashboard

1. Push the repository to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Vercel auto-detects Vite. Defaults are fine:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel            # first deploy (preview)
vercel --prod     # production deploy
```

A minimal `vercel.json` is included to lock framework detection and enable SPA-style rewrites.

## License

Personal portfolio — all rights reserved © Amaury Gómez.
