import { createContext } from "react";
import type { ZoneId } from "@/world/types";

export interface WorldState {
  activeZone: ZoneId | null;
  setActiveZone: (z: ZoneId | null) => void;
  hoveredZone: ZoneId | null;
  setHoveredZone: (z: ZoneId | null) => void;
  avatarPos: { x: number; y: number };
  tourActive: boolean;
  tourStep: number;
  journeyCompleted: boolean;
  startTour: () => void;
  exitTour: () => void;
  tourNext: () => void;
  tourPrev: () => void;
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  stackOpen: boolean;
  setStackOpen: (open: boolean) => void;
  /** Multiplier on top of the per-zone framing, clamped to [ZOOM_MIN, ZOOM_MAX]. */
  userZoom: number;
  setUserZoom: (z: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  /** Bumped on reset so the camera re-frames even when userZoom is already 1. */
  cameraResetNonce: number;
}

export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 2.2;
export const ZOOM_STEP = 1.18;

export const WorldContext = createContext<WorldState | null>(null);
