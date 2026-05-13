type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const PHASE_NAMES = [
  "New",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
] as const;

export const PHASE_SHORT = [
  "New",
  "Waxing",
  "First Q.",
  "Waxing G.",
  "Full",
  "Waning G.",
  "Last Q.",
  "Waning",
] as const;

export function phaseName(p: Phase) {
  return PHASE_NAMES[p];
}

let glowSeq = 0;
function nextGlowId() {
  glowSeq += 1;
  return `mg${glowSeq}`;
}

export function Moon({
  phase,
  size = 16,
  title,
  tone = "vellum",
  glow = false,
}: {
  phase: Phase;
  size?: number;
  title?: string;
  tone?: "vellum" | "gold" | "silver";
  glow?: boolean;
}) {
  const r = 10;
  const cx = 12;
  const cy = 12;
  const lit = tone === "gold" ? "var(--moon)" : tone === "silver" ? "#e8e0c4" : "var(--vellum)";
  const shadow = "var(--ink)";
  const stroke = "var(--rule)";
  const label = title ?? PHASE_NAMES[phase];
  const gradId = glow ? nextGlowId() : null;

  const wrap = (children: React.ReactNode) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      style={{ display: "block", overflow: "visible" }}
    >
      {glow && gradId && (
        <defs>
          <radialGradient id={`${gradId}-g`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--moon)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--moon)" stopOpacity="0" />
          </radialGradient>
        </defs>
      )}
      {glow && gradId && <circle cx={cx} cy={cy} r={r * 1.8} fill={`url(#${gradId}-g)`} />}
      {children}
    </svg>
  );

  if (phase === 0) {
    if (tone === "gold") {
      return wrap(
        <>
          <circle cx={cx} cy={cy} r={r} fill={shadow} />
          <circle
            cx={cx}
            cy={cy}
            r={r - 0.5}
            fill="none"
            stroke="var(--moon)"
            strokeWidth="1.2"
            strokeDasharray="2 1.5"
            opacity="0.85"
          />
        </>,
      );
    }
    return wrap(<circle cx={cx} cy={cy} r={r} fill={shadow} stroke={stroke} strokeWidth="0.5" />);
  }
  if (phase === 4) {
    return wrap(<circle cx={cx} cy={cy} r={r} fill={lit} stroke={stroke} strokeWidth="0.5" />);
  }
  if (phase === 2 || phase === 6) {
    const litRight = phase === 2;
    return wrap(
      <>
        <circle cx={cx} cy={cy} r={r} fill={shadow} />
        <path
          d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 ${litRight ? 1 : 0} ${cx} ${cy + r} Z`}
          fill={lit}
        />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="0.5" />
      </>,
    );
  }

  const litRight = phase === 1 || phase === 3;
  const isCrescent = phase === 1 || phase === 7;
  const firstSweep = litRight ? 1 : 0;
  const returnSweep = isCrescent ? firstSweep : 1 - firstSweep;
  const rx = r * 0.55;

  const d = `M ${cx} ${cy - r}
             A ${r} ${r} 0 0 ${firstSweep} ${cx} ${cy + r}
             A ${rx} ${r} 0 0 ${returnSweep} ${cx} ${cy - r} Z`;

  return wrap(
    <>
      <circle cx={cx} cy={cy} r={r} fill={shadow} />
      <path d={d} fill={lit} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="0.5" />
    </>,
  );
}

export type { Phase };
