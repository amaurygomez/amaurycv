import type { FC } from "react";

type MetaphorProps = {
  accent: string;
  className?: string;
};

// DisciplineMetaphor — mountains, dumbbell, book, running track, heart-rate
export const DisciplineMetaphor: FC<MetaphorProps> = ({ accent, className }) => {
  const navy = "#0B1020";
  const mid = "#1A2238";
  const slate = "#374151";
  const offWhite = "#F7F3EA";
  const muted = "#A8B0C2";

  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Discipline and personal rhythm: snow-capped mountains, a small BBQ kettle grill with thermometer, open book, running track curve, and heart-rate line"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="discipline-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.1" />
          <stop offset="100%" stopColor={navy} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* sky wash behind mountain */}
      <rect x="100" y="20" width="120" height="100" fill="url(#sky)" />

      {/* Center: mountain composition */}
      <g transform="translate(160 110)">
        {/* back ridge */}
        <path
          d="M -60 0 L -20 -50 L 10 -20 L 30 -40 L 60 0 Z"
          fill={mid}
          stroke={slate}
          strokeWidth="0.8"
          opacity="0.7"
        />
        {/* main peak */}
        <path
          d="M -42 0 L 0 -68 L 42 0 Z"
          fill={navy}
          stroke={offWhite}
          strokeWidth="1.2"
        />
        {/* snow cap */}
        <path
          d="M -14 -22 L -8 -28 L -4 -24 L 0 -32 L 4 -26 L 10 -32 L 14 -22 L 8 -38 L 0 -68 L -8 -38 Z"
          fill={offWhite}
          opacity="0.92"
        />
        {/* secondary ridge */}
        <path
          d="M 18 0 L 38 -32 L 56 0 Z"
          fill={mid}
          stroke={offWhite}
          strokeWidth="0.9"
          opacity="0.85"
        />
        <path
          d="M 28 -16 L 32 -20 L 38 -32 L 44 -20 L 48 -16 L 38 -10 Z"
          fill={offWhite}
          opacity="0.8"
        />
        {/* ridge shadow line */}
        <path
          d="M 0 -68 L -10 -30 L -20 -8"
          fill="none"
          stroke={accent}
          strokeWidth="0.8"
          opacity="0.6"
        />
        {/* sun / dot above peak */}
        <circle cx="-30" cy="-58" r="3.5" fill={accent} filter="url(#discipline-glow)" opacity="0.9" />
      </g>

      {/* Left: BBQ grill corner — small, secondary, "paciencia + fuego correcto" */}
      <g transform="translate(30 72)">
        {/* legs */}
        <line x1="2" y1="6" x2="0" y2="20" stroke={slate} strokeWidth="1" />
        <line x1="34" y1="6" x2="36" y2="20" stroke={slate} strokeWidth="1" />
        {/* kettle body */}
        <path
          d="M -2 -2 C -2 -10 38 -10 38 -2 L 36 8 C 36 12 0 12 0 8 Z"
          fill={navy}
          stroke={accent}
          strokeWidth="1.1"
        />
        {/* lid handle */}
        <rect x="14" y="-12" width="8" height="3" rx="1" fill={offWhite} opacity="0.85" />
        {/* lid seam */}
        <path d="M -2 -2 C 6 -4 30 -4 38 -2" fill="none" stroke={offWhite} strokeWidth="0.6" opacity="0.7" />
        {/* grill grate lines (visible at top) */}
        <line x1="2" y1="-3" x2="34" y2="-3" stroke={offWhite} strokeWidth="0.4" opacity="0.5" />
        <line x1="2" y1="-1.5" x2="34" y2="-1.5" stroke={offWhite} strokeWidth="0.4" opacity="0.5" />
        {/* embers / fire glow inside */}
        <g opacity="0.85">
          <ellipse cx="10" cy="4" rx="3" ry="1.4" fill="#F97316" opacity="0.65">
            <animate attributeName="opacity" values="0.45;0.85;0.45" dur="2.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="20" cy="5" rx="3.5" ry="1.6" fill="#FBBF24" opacity="0.7">
            <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.0s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="28" cy="4" rx="2.6" ry="1.3" fill="#F97316" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.7s" repeatCount="indefinite" />
          </ellipse>
        </g>
        {/* thermometer dial — "fuego correcto" */}
        <g transform="translate(38 -8)">
          <circle cx="0" cy="0" r="4.5" fill={mid} stroke={accent} strokeWidth="0.7" />
          <circle cx="0" cy="0" r="4.5" fill="none" stroke={accent} strokeWidth="0.3" filter="url(#discipline-glow)" opacity="0.7" />
          {/* needle pointing to upper-right ("on temp") */}
          <line x1="0" y1="0" x2="2.4" y2="-2.4" stroke={offWhite} strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="0" cy="0" r="0.7" fill={offWhite} />
        </g>
        <text x="16" y="26" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          BBQ
        </text>
      </g>

      {/* Right: open book */}
      <g transform="translate(244 60)">
        {/* shadow */}
        <path d="M 0 28 L 18 24 L 36 28 L 36 30 L 18 26 L 0 30 Z" fill={navy} opacity="0.5" />
        {/* left page */}
        <path
          d="M 0 4 C 0 4 8 0 18 2 L 18 26 C 8 24 0 28 0 28 Z"
          fill={offWhite}
          stroke={slate}
          strokeWidth="0.9"
        />
        {/* right page */}
        <path
          d="M 36 4 C 36 4 28 0 18 2 L 18 26 C 28 24 36 28 36 28 Z"
          fill={offWhite}
          stroke={slate}
          strokeWidth="0.9"
        />
        {/* spine line */}
        <line x1="18" y1="2" x2="18" y2="26" stroke={accent} strokeWidth="0.8" />
        {/* text lines */}
        {[8, 12, 16, 20].map((y, i) => (
          <g key={i}>
            <line x1="2" y1={y} x2={14 - i} y2={y} stroke={slate} strokeWidth="0.5" />
            <line x1={22 + i} y1={y} x2="34" y2={y} stroke={slate} strokeWidth="0.5" />
          </g>
        ))}
        <text x="18" y="38" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          READING
        </text>
      </g>

      {/* Bottom: running track curve */}
      <g transform="translate(0 154)">
        <path
          d="M 10 18 C 50 -2 100 -2 160 6 C 220 14 270 12 310 -2"
          fill="none"
          stroke={accent}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 10 22 C 50 2 100 2 160 10 C 220 18 270 16 310 2"
          fill="none"
          stroke={slate}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 3"
          opacity="0.7"
        />
        {/* runner dot animated along track */}
        <circle cx="0" cy="0" r="2.4" fill={accent} filter="url(#discipline-glow)">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M 10 18 C 50 -2 100 -2 160 6 C 220 14 270 12 310 -2"
          />
        </circle>
      </g>

      {/* Top-right: heart-rate line */}
      <g transform="translate(214 18)">
        <rect x="-4" y="-8" width="100" height="24" rx="2" fill={mid} opacity="0.6" stroke={slate} strokeWidth="0.6" />
        <path
          d="M 0 4 L 10 4 L 14 -4 L 18 10 L 22 -6 L 26 4 L 38 4 L 42 -2 L 46 8 L 50 4 L 62 4 L 66 -4 L 70 10 L 74 -6 L 78 4 L 90 4"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="-2" y="-2" fontFamily="ui-monospace, monospace" fontSize="3.5" fill={muted}>
          TRACE · AUDIT
        </text>
      </g>
    </svg>
  );
};
