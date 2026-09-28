import { AnimatePresence, motion } from "motion/react";
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
  Users,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useWorld } from "@/world/state/useWorld";
import { ZONE_META } from "@/world/content/zones";

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
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
};

export function ZonePill() {
  const { hoveredZone, activeZone } = useWorld();
  const { lang } = useLanguage();
  const zone = !activeZone && hoveredZone ? ZONE_META[hoveredZone] : null;

  return (
    <AnimatePresence>
      {zone && (
        <motion.div
          key={zone.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-40 max-w-[min(94vw,640px)] -translate-x-1/2 rounded-2xl border bg-ag-panel/92 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md"
          style={{
            borderColor: `${zone.accent}40`,
            boxShadow: `0 18px 40px -20px ${zone.accent}80`,
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: zone.accent, boxShadow: `0 0 12px ${zone.accent}` }}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[9px] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: zone.accent }}
                >
                  {(lang === "es" ? zone.sectorEs : zone.sectorEn) ?? zone.category}
                </span>
                <span className="font-display text-[13.5px] text-ag-text">
                  {lang === "es" ? zone.titleEs : zone.titleEn}
                </span>
              </div>
            </div>

            {zone.experiences && zone.experiences.length > 0 && (
              <>
                <span
                  className="hidden h-6 w-px sm:inline-block"
                  style={{ background: `${zone.accent}40` }}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  {zone.experiences.slice(0, 4).map((exp) => {
                    const Icon = ICONS[exp.iconKey] ?? Layers;
                    return (
                      <span
                        key={exp.iconKey + exp.titleEn}
                        className="inline-flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-[10px] font-medium"
                        style={{
                          borderColor: `${zone.accent}45`,
                          color: zone.accent,
                          background: `${zone.accent}10`,
                        }}
                      >
                        <Icon size={11} />
                        <span className="hidden md:inline">
                          {lang === "es" ? exp.titleEs : exp.titleEn}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </>
            )}

            <span className="ml-auto hidden text-[10px] tracking-[0.16em] text-ag-text-muted uppercase sm:inline">
              {lang === "es" ? zone.periodEs : zone.periodEn}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
