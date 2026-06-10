import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Camera,
  Car,
  Compass,
  CreditCard,
  FileBarChart,
  FileText,
  Hash,
  Heart,
  History,
  Landmark,
  Layers,
  Lock,
  Map as MapIcon,
  MapPin,
  Network,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";

export type IconKey =
  | "map-pin"
  | "map"
  | "compass"
  | "activity"
  | "hash"
  | "car"
  | "file-text"
  | "lock"
  | "landmark"
  | "shield-check"
  | "shield"
  | "history"
  | "bar-chart"
  | "users"
  | "server"
  | "smartphone"
  | "credit-card"
  | "zap"
  | "network"
  | "file-bar-chart"
  | "brain"
  | "camera"
  | "settings"
  | "heart"
  | "book-open"
  | "sparkles"
  | "layers";

export const ZONE_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  "map-pin": MapPin,
  map: MapIcon,
  compass: Compass,
  activity: Activity,
  hash: Hash,
  car: Car,
  "file-text": FileText,
  lock: Lock,
  landmark: Landmark,
  "shield-check": ShieldCheck,
  shield: Shield,
  history: History,
  "bar-chart": BarChart3,
  users: Users,
  server: Server,
  smartphone: Smartphone,
  "credit-card": CreditCard,
  zap: Zap,
  network: Network,
  "file-bar-chart": FileBarChart,
  brain: Brain,
  camera: Camera,
  settings: Settings,
  heart: Heart,
  "book-open": BookOpen,
  sparkles: Sparkles,
  layers: Layers,
};

export function getIcon(key: string): ComponentType<{ size?: number; className?: string }> {
  return ZONE_ICONS[key] ?? Layers;
}
