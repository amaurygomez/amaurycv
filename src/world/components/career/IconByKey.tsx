import { Layers } from "lucide-react";
import { ZONE_ICONS } from "./iconMap";

// Resolving the icon inside this component keeps callers from creating a
// component during render.
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
