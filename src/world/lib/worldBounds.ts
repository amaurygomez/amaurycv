import { WORLD_COLS, WORLD_ROWS } from "../content/zones";
import { floorBounds } from "./iso";

export function getWorldBounds() {
  return floorBounds(WORLD_COLS, WORLD_ROWS);
}
