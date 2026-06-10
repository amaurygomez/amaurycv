import { Layers } from "lucide-react";
import { ZONE_ICONS } from "./iconMap";

/** Stable wrapper component — avoids dynamic-component-during-render lint rule. */
export function IconByKey({
  iconKey,
  size,
  className,
}: {
  iconKey: string;
  size?: number;
  className?: string;
}) {
  const Cmp = ZONE_ICONS[iconKey] ?? Layers;
  return <Cmp size={size} className={className} />;
}
