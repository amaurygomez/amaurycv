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
import { useLanguage } from "../../hooks/useLanguage";
import { useWorld } from "../state/useWorld";
import { ZONE_META } from "../content/zones";

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
          className="
            pointer-events-none absolute z-40
            bottom-6 left-1/2 -translate-x-1/2
            max-w-[min(94vw,640px)]
            rounded-2xl border bg-[#0B1020]/92
            px-4 py-3 backdrop-blur-md
            shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)]
          "
          style={{
            borderColor: `${zone.accent}40`,
            boxShadow: `0 18px 40px -20px ${zone.accent}80`,
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            {/* Sector + title */}
            <div className="flex items-center gap-2.5">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: zone.accent, boxShadow: `0 0 12px ${zone.accent}` }}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: zone.accent }}
                >
                  {(lang === "es" ? zone.sectorEs : zone.sectorEn) ?? zone.category}
                </span>
                <span className="font-display text-[13.5px] text-[#F7F3EA]">
                  {lang === "es" ? zone.titleEs : zone.titleEn}
                </span>
              </div>
            </div>

            {/* Experience icons preview (up to 4) */}
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

            {/* Period */}
            <span className="ml-auto hidden text-[10px] uppercase tracking-[0.16em] text-[#A8B0C2] sm:inline">
              {lang === "es" ? zone.periodEs : zone.periodEn}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
