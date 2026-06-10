import { useContext } from "react";
import { WorldContext } from "./context";

export function useWorld() {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorld must be used within <WorldProvider>");
  return ctx;
}
