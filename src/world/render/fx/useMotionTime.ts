import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Seconds since mount, scaled by `speed`. Frozen at `offset` when the user
// prefers reduced motion; throttled to ~30 fps on narrow screens.
export function useMotionTime(speed = 1, offset = 0) {
  const [time, setTime] = useState(offset);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const frameMs = window.innerWidth < 640 ? 33 : 16;
    const loop = (now: number) => {
      if (now - last >= frameMs) {
        last = now;
        setTime(((now - start) / 1000) * speed + offset);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [offset, reduced, speed]);

  return time;
}
