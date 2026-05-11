"use client";

import { useEffect, useState } from "react";

export function ReadingMoon({ size = 52 }: { size?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 0 → new (shadow fully covers, offset cx = 30), 1 → full (shadow off-screen, offset cx = 30 + 48)
  // Disc radius 24; we sweep shadow centre from cx≈30 (covered) to cx≈78 (clear) along x.
  const shadowCx = 30 + progress * 48;

  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="rm-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="var(--moon-pale)" stopOpacity={0.25 + 0.5 * progress} />
          <stop offset="1" stopColor="var(--moon-pale)" stopOpacity="0" />
        </radialGradient>
        <mask id="rm-mask">
          <rect width="60" height="60" fill="black" />
          <circle cx="30" cy="30" r="24" fill="white" />
          <circle cx={shadowCx} cy="30" r="24" fill="black" />
        </mask>
      </defs>
      <circle cx="30" cy="30" r="29" fill="url(#rm-glow)" />
      <circle cx="30" cy="30" r="24" fill="var(--midnight)" opacity="0.25" />
      <rect width="60" height="60" fill="var(--moon)" mask="url(#rm-mask)" />
      <circle cx="20" cy="22" r="1.4" fill="var(--ink)" opacity={0.18 * progress} />
      <circle cx="17" cy="34" r="1.0" fill="var(--ink)" opacity={0.18 * progress} />
      <circle cx="22" cy="42" r="0.8" fill="var(--ink)" opacity={0.18 * progress} />
    </svg>
  );
}
