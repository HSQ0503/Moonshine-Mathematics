export function FeaturedFigure() {
  return (
    <svg viewBox="0 0 380 320" width="100%" style={{ maxWidth: 380 }}>
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="rgba(244,232,194,0.45)" />
          <stop offset="1" stopColor="rgba(244,232,194,0)" />
        </radialGradient>
        <mask id="ff-moon-mask">
          <rect width="380" height="320" fill="black" />
          <circle cx="280" cy="80" r="44" fill="white" />
          <circle cx="298" cy="72" r="40" fill="black" />
        </mask>
      </defs>
      <circle cx="280" cy="80" r="80" fill="url(#moonGlow)" />
      <rect width="380" height="320" fill="#c9a14b" mask="url(#ff-moon-mask)" />
      <circle cx="60"  cy="40"  r="1.2" fill="#f4e8c2" />
      <circle cx="120" cy="70"  r="1.6" fill="#f4e8c2" />
      <circle cx="40"  cy="120" r="1.0" fill="#f4e8c2" />
      <circle cx="180" cy="40"  r="1.4" fill="#f4e8c2" />
      <circle cx="200" cy="130" r="1.2" fill="#f4e8c2" />
      <circle cx="90"  cy="200" r="1.0" fill="#f4e8c2" />
      <circle cx="150" cy="180" r="1.6" fill="#f4e8c2" />
      <line x1="40"  y1="260" x2="340" y2="260" stroke="rgba(244,232,194,0.4)" strokeWidth="0.8" />
      <line x1="60"  y1="50"  x2="60"  y2="280" stroke="rgba(244,232,194,0.4)" strokeWidth="0.8" />
      <line x1="60" y1="260" x2="230" y2="120" stroke="#f4e8c2" strokeWidth="1.6" />
      <circle cx="230" cy="120" r="3" fill="#f4e8c2" />
      <line x1="60" y1="260" x2="200" y2="230" stroke="#c9a14b" strokeWidth="1.6" />
      <circle cx="200" cy="230" r="3" fill="#c9a14b" />
      <line x1="60" y1="260" x2="300" y2="62" stroke="rgba(244,232,194,0.6)" strokeWidth="0.6" strokeDasharray="3 3" />
      <line x1="60" y1="260" x2="270" y2="215" stroke="rgba(201,161,75,0.7)" strokeWidth="0.6" strokeDasharray="3 3" />
      <text x="240" y="115" fontFamily="EB Garamond, serif" fontSize="13" fontStyle="italic" fill="#f4e8c2">v₁</text>
      <text x="210" y="242" fontFamily="EB Garamond, serif" fontSize="13" fontStyle="italic" fill="#c9a14b">v₂</text>
      <text x="307" y="58"  fontFamily="EB Garamond, serif" fontSize="11" fill="rgba(244,232,194,0.7)" fontStyle="italic">λ₁v₁</text>
      <text x="277" y="225" fontFamily="EB Garamond, serif" fontSize="11" fill="rgba(244,232,194,0.7)" fontStyle="italic">λ₂v₂</text>
      <text x="20" y="305" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(244,232,194,0.55)" letterSpacing="0.1em">FIG. I — A SELF-ADJOINT OPERATOR, BY MOONLIGHT</text>
    </svg>
  );
}
