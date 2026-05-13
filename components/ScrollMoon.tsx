"use client";

import { useEffect, useState } from "react";
import { Moon, type Phase, phaseName } from "./Moon";

function useScrollPhase(): Phase {
  const [phase, setPhase] = useState<Phase>(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduce) {
        setPhase(4);
        return;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const idx = Math.min(7, Math.floor(p * 8));
      setPhase(idx as Phase);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    if (reduce) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return phase;
}

export function ScrollMoon({ size = 36 }: { size?: number }) {
  const phase = useScrollPhase();
  return <Moon phase={phase} size={size} tone="gold" glow />;
}

export function FloatingScrollMoon() {
  const phase = useScrollPhase();
  return (
    <div className="scroll-moon-floating" aria-hidden>
      <Moon phase={phase} size={72} tone="gold" glow />
      <span className="label">{phaseName(phase)}</span>
    </div>
  );
}
