import { type CSSProperties } from "react";

type GlyphProps = {
  idx?: number;
  size?: number;
  light?: string;
  dark?: string;
  className?: string;
  style?: CSSProperties;
};

let glyphCounter = 0;
function nextId(prefix: string) {
  glyphCounter += 1;
  return `${prefix}-${glyphCounter}`;
}

export function MoonPhaseGlyph({
  idx = 4,
  size = 16,
  light = "var(--moon-pale)",
  dark = "var(--midnight)",
  className = "",
  style,
}: GlyphProps) {
  const id = nextId(`mp-${idx}`);
  const r = 9;
  const cx = 10, cy = 10;

  let shadowCx = cx;
  let shadowR = r;
  let halfRectX: number | null = null;

  switch (idx) {
    case 0: shadowCx = cx; shadowR = r + 1; break;
    case 1: shadowCx = cx + 4; shadowR = r; break;
    case 2: halfRectX = cx; break;
    case 3: shadowCx = cx + 11; shadowR = r; break;
    case 4: shadowR = 0; break;
    case 5: shadowCx = cx - 11; shadowR = r; break;
    case 6: halfRectX = cx - r; break;
    case 7: shadowCx = cx - 4; shadowR = r; break;
  }

  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className} style={style} aria-hidden="true">
      <defs>
        <mask id={id}>
          <rect width="20" height="20" fill="black" />
          <circle cx={cx} cy={cy} r={r} fill="white" />
          {halfRectX !== null ? (
            <rect x={halfRectX} y={cy - r - 1} width={r + 1} height={(r + 1) * 2} fill="black" />
          ) : (
            <circle cx={shadowCx} cy={cy} r={shadowR} fill="black" />
          )}
        </mask>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={dark} opacity="0.35" />
      <rect width="20" height="20" fill={light} mask={`url(#${id})`} />
    </svg>
  );
}

export function BigMoon({ size = 56 }: { size?: number }) {
  const id = nextId("bm");
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="var(--moon-pale)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--moon-pale)" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="60" height="60" fill="black" />
          <circle cx="30" cy="30" r="24" fill="white" />
          <circle cx="38" cy="26" r="22" fill="black" />
        </mask>
      </defs>
      <circle cx="30" cy="30" r="29" fill={`url(#${id}-glow)`} />
      <rect width="60" height="60" fill="var(--moon)" mask={`url(#${id}-mask)`} />
      <circle cx="20" cy="22" r="1.4" fill="var(--ink)" opacity="0.18" />
      <circle cx="17" cy="34" r="1.0" fill="var(--ink)" opacity="0.18" />
      <circle cx="22" cy="42" r="0.8" fill="var(--ink)" opacity="0.18" />
    </svg>
  );
}
