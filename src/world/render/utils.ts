export const INK = "#070B14";
export const CYAN = "#5EEAD4";
export const GOLD = "#E8B96B";
export const AMBER = "#FBBF24";
export const GREEN = "#34D399";
export const PURPLE = "#A78BFA";
export const BLUE = "#60A5FA";
export const RED = "#F87171";
export const ORANGE = "#F97316";

export function hex(color: string): number {
  return parseInt(color.replace(/^#/, ""), 16);
}
