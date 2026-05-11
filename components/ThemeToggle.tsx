"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const EVT = "mm-theme-change";

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
}
function getSnapshot(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "light";
}
function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lit = theme === "light";

  const toggle = () => {
    const next: Theme = lit ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("mm-theme", next); } catch {}
    window.dispatchEvent(new Event(EVT));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={lit ? "Extinguish the lamp" : "Light the lamp"}
      title={lit ? "Extinguish the lamp" : "Light the lamp"}
      suppressHydrationWarning
    >
      <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true" suppressHydrationWarning>
        {lit ? (
          <>
            <ellipse cx="5.5" cy="3.2" rx="1.6" ry="2.4" fill="currentColor" opacity="0.95" />
            <ellipse cx="5.5" cy="2.8" rx="0.6" ry="1.2" fill="#fff8d8" opacity="0.85" />
            <rect x="5.1" y="5.4" width="0.8" height="2.2" fill="currentColor" opacity="0.7" />
            <path d="M 3 8 L 8 8 L 7.4 12 L 3.6 12 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </>
        ) : (
          <>
            <rect x="5.1" y="3.4" width="0.8" height="4.2" fill="currentColor" opacity="0.5" />
            <path d="M 3 8 L 8 8 L 7.4 12 L 3.6 12 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
            <path d="M 4.4 2.6 Q 6.6 3.4 5.2 4.6" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.6" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span suppressHydrationWarning>{lit ? "lamp on" : "lamp out"}</span>
    </button>
  );
}
