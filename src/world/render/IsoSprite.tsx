import { useEffect, useState } from "react";
import { Assets, Texture } from "pixi.js";
import { iso } from "../lib/iso";

export interface IsoSpriteProps {
  /** Source URL (relative to /public, e.g. "/assets/kenney/isometric-blocks/...png") */
  src: string;
  /** Isometric tile X coordinate */
  x: number;
  /** Isometric tile Y coordinate */
  y: number;
  /** Height offset in tile-heights (default 0 = floor level) */
  z?: number;
  /** Scale multiplier (default 1) */
  scale?: number;
  /** Anchor X (0-1, default 0.5 = center horizontal) */
  anchorX?: number;
  /** Anchor Y (0-1, default 1 = bottom of sprite) */
  anchorY?: number;
  /** Optional tint color as hex number */
  tint?: number;
  /** Optional alpha (0-1, default 1) */
  alpha?: number;
}

/**
 * Renders a PNG sprite at an isometric grid position using PixiJS.
 *
 * Requires Sprite to be registered via `extend({ Sprite })` in the
 * application root (WorldApp.tsx already does this).
 *
 * Falls back to null (renders nothing) if the texture fails to load,
 * letting callers use code-art as the fallback.
 */
export function IsoSprite({
  src,
  x,
  y,
  z = 0,
  scale = 1,
  anchorX = 0.5,
  anchorY = 1,
  tint,
  alpha = 1,
}: IsoSpriteProps) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const pos = iso(x, y, z);

  useEffect(() => {
    let cancelled = false;
    Assets.load(src)
      .then((tex: Texture) => {
        if (!cancelled) {
          setTexture(tex);
        }
      })
      .catch(() => {
        // Texture failed to load — renders nothing, caller uses code-art fallback
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!texture) return null;

  return (
    <pixiSprite
      texture={texture}
      x={pos.x}
      y={pos.y}
      scale={scale}
      alpha={alpha}
      anchor={{ x: anchorX, y: anchorY }}
      tint={tint}
    />
  );
}
