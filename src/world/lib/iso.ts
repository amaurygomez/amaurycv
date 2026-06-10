/**
 * Isometric projection helpers (2:1 ratio — Habbo-style).
 *
 * Coordinate system:
 *   x: grid columns (→)
 *   y: grid rows    (↓)
 *   z: height level (↑ out of the floor)
 *
 * Screen coords:
 *   px = (x - y) * (TILE_W / 2)
 *   py = (x + y) * (TILE_H / 2) - z * TILE_H
 */

export const TILE_W = 64;
export const TILE_H = 32;

export function iso(x: number, y: number, z = 0): { x: number; y: number } {
  return {
    x: (x - y) * (TILE_W / 2),
    y: (x + y) * (TILE_H / 2) - z * TILE_H,
  };
}

/** Diamond polygon points for a floor tile at (x,y). */
export function tileDiamond(x: number, y: number): string {
  const { x: cx, y: cy } = iso(x, y);
  const w = TILE_W / 2;
  const h = TILE_H / 2;
  return `${cx},${cy} ${cx + w},${cy + h} ${cx},${cy + TILE_H} ${cx - w},${cy + h}`;
}

/** Bounding box of an N×M floor in iso projection. */
export function floorBounds(cols: number, rows: number) {
  const tl = iso(0, rows - 1);
  const tr = iso(cols - 1, 0);
  const bl = iso(0, 0);
  const br = iso(cols - 1, rows - 1);
  const minX = Math.min(tl.x, tr.x, bl.x, br.x) - TILE_W / 2;
  const maxX = Math.max(tl.x, tr.x, bl.x, br.x) + TILE_W / 2;
  const minY = Math.min(tl.y, tr.y, bl.y, br.y);
  const maxY = Math.max(tl.y, tr.y, bl.y, br.y) + TILE_H;
  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
