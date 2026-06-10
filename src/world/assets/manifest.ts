/**
 * AG World asset manifest — maps logical object keys to PNG sprite paths
 * (relative to /public/). Falls back gracefully to code-art if path is null.
 *
 * Kenney CC0 packs (public domain — no attribution required):
 *   - isometric-blocks:    https://kenney.nl/assets/isometric-blocks
 *   - isometric-buildings: https://kenney.nl/assets/isometric-tiles-buildings
 *
 * Run `npm run assets:fetch` to download these packs.
 *
 * Pack structure after extraction:
 *   public/assets/isometric-blocks/PNG/
 *     Abstract tiles/  abstractTile_01..14.png
 *     Platformer tiles/ platformerTile_01..20.png
 *     Voxel tiles/     voxelTile_01..20.png
 *   public/assets/isometric-buildings/PNG/
 *     buildingTiles_000..128.png
 */

export const SPRITE_PATHS = {
  // --- Floor tiles (isometric-blocks: Voxel tiles) ---
  floorTile: "/assets/isometric-blocks/PNG/Voxel tiles/voxelTile_01.png",
  floorTileAlt: "/assets/isometric-blocks/PNG/Voxel tiles/voxelTile_02.png",

  // --- Abstract accent blocks ---
  abstractBlock: "/assets/isometric-blocks/PNG/Abstract tiles/abstractTile_01.png",
  abstractBlockAlt: "/assets/isometric-blocks/PNG/Abstract tiles/abstractTile_02.png",

  // --- Platformer-style blocks (desk / shelf stand-ins) ---
  desk: "/assets/isometric-blocks/PNG/Platformer tiles/platformerTile_01.png",
  shelf: "/assets/isometric-blocks/PNG/Platformer tiles/platformerTile_02.png",
  platformBlock: "/assets/isometric-blocks/PNG/Platformer tiles/platformerTile_03.png",

  // --- Voxel floor tiles for island grids ---
  voxelFloor: "/assets/isometric-blocks/PNG/Voxel tiles/voxelTile_01.png",
  voxelFloorAlt: "/assets/isometric-blocks/PNG/Voxel tiles/voxelTile_02.png",

  // --- Building tiles (isometric-buildings) ---
  building:    "/assets/isometric-buildings/PNG/buildingTiles_000.png",
  serverRack:  "/assets/isometric-buildings/PNG/buildingTiles_005.png",
  plant:       "/assets/isometric-buildings/PNG/buildingTiles_010.png",
  wall:        "/assets/isometric-buildings/PNG/buildingTiles_020.png",
  roof:        "/assets/isometric-buildings/PNG/buildingTiles_030.png",

  // --- Characters (use code-art — no Kenney character packs in this phase) ---
  character: null as string | null,
} as const;

export type SpriteKey = keyof typeof SPRITE_PATHS;

/** Returns the sprite path for a key, or null if not available. */
export function getSpritePath(key: SpriteKey): string | null {
  return SPRITE_PATHS[key];
}
