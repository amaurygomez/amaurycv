// 2:1 isometric projection. x runs along grid columns, y along grid rows and
// z lifts a point off the floor, measured in tile heights.

export const TILE_W = 64;
export const TILE_H = 32;

export function iso(x: number, y: number, z = 0): { x: number; y: number } {
  return {
    x: (x - y) * (TILE_W / 2),
    y: (x + y) * (TILE_H / 2) - z * TILE_H,
  };
}

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
