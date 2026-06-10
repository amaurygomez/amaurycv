# Room Asset Visual Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make each room visually sell its story in 5 seconds without depending on the right panel.

**Architecture:** All 7 isometric rooms live in `WorldMap.tsx` as PixiJS components. Objects already exist — the issues are label density, object scale, and hero-object prominence.

**Tech Stack:** React, PixiJS (pixi-react), isometric coordinate system (`iso()` helper), TypeScript.

---

## File Map

| File | What changes |
|------|-------------|
| `src/world/render/WorldMap.tsx` | All room scenes: label reduction, object scaling, new visual elements |
| `src/world/render/SceneProps.tsx` | IsoPosTerminal: add scale prop |

---

### Task 1: AI Lab — Remove 4 excess tag plates (P0)

**Files:**
- Modify: `src/world/render/WorldMap.tsx` (personal-lab case, lines ~251-276)

Current: 10 IsoTagPlates. Target: 6.

- [ ] Remove `IsoTagPlate` for **LANGFUSE** (line ~252)
- [ ] Remove `IsoTagPlate` for **OPEN WEBUI** (line ~253)
- [ ] Remove `IsoTagPlate` for **EVALS** (line ~254)
- [ ] Remove `IsoTagPlate` for **DOCKER** (line ~258)
- [ ] Keep: OLLAMA·GPU, OPS CONSOLE, n8n, QDRANT, LiteLLM, HUMAN OK
- [ ] Build check: no TS errors

---

### Task 2: AI Lab — Enhance HUMAN_OK approval gate (P0)

**Files:**
- Modify: `src/world/render/WorldMap.tsx` (`IsoApprovalGate` function, line ~481)
- Modify: `src/world/render/WorldMap.tsx` (personal-lab case: add ServerLedPulse)

- [ ] Widen `IsoApprovalGate`: change w=0.9 → w=1.4, h=1.2 → h=1.6
- [ ] Add a green signal box (top of gate) that reads as "approved/green light"
- [ ] In personal-lab case, add `ServerLedPulse` at the gate position
- [ ] Verify gate is visually dominant in the room

---

### Task 3: AI Lab — Upgrade server rack to be recognizable (P0)

**Files:**
- Modify: `src/world/render/WorldMap.tsx` (`IsoOpsServerRack` function, line ~408)

- [ ] Add a second server rack in personal-lab case for visual weight
- [ ] Verify rack reads as "servers" not "boxes"

---

### Task 4: POS Room — Scale up POS terminals (P1)

**Files:**
- Modify: `src/world/render/SceneProps.tsx` (`IsoPosTerminal`, line ~539)
- Modify: `src/world/render/WorldMap.tsx` (software-factory case)

- [ ] Add `scale?: number` prop to `IsoPosTerminal`
- [ ] In WorldMap.tsx software-factory, render a larger hero POS terminal (w=1.2, d=1.0, h=0.9)
- [ ] Keep receipt roll and pulse effects

---

### Task 5: Origin Room — Enlarge family PC desk and add warm carpet (P0)

**Files:**
- Modify: `src/world/render/WorldMap.tsx` (`IsoFamilyPcDesk` function, line ~520)
- Modify: `src/world/render/WorldMap.tsx` (education-path case)

- [ ] IsoFamilyPcDesk: make CRT screen bigger (w=0.62→0.85, h=0.5→0.65)
- [ ] Add `IsoCarpet` with warm color `#E8B96B` alpha=0.08 under the desk area
- [ ] Move desk to center-front of room (more prominent position)

---

### Task 6: Engineering Discipline — Scale up BBQ kettle (P1)

**Files:**
- Modify: `src/world/render/WorldMap.tsx` (`IsoBbqKettle` function, line ~912)

- [ ] Increase ellipse radii: rx=14→20, ry=5→7 for bowl
- [ ] Increase lid bezier curve spread proportionally
- [ ] Increase smoke wisp circles proportionally
- [ ] Verify BBQ reads immediately as a BBQ, not a generic box

---

### Task 7: Banking Room — Make report printer more prominent (P1)

**Files:**
- Modify: `src/world/render/WorldMap.tsx` (`IsoPrinter` function, line ~713)
- Modify: `src/world/render/WorldMap.tsx` (banking-finance case)

- [ ] IsoPrinter: increase size (w=0.85→1.2, d=0.75→1.0, h=0.42→0.65)
- [ ] Add document stack beside printer to reinforce JasperReports story

---

### Task 8: Build and verify

- [ ] `npm run lint`
- [ ] `npx astro check`
- [ ] `npm run build`
- [ ] Manual visual QA at 1440x900 and 1920x1080
