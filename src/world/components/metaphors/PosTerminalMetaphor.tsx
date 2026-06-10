import type { FC } from "react";

type MetaphorProps = {
  accent: string;
  className?: string;
};

// PosTerminalMetaphor — Android POS, payment terminal, recharge / lottery / Crystal Reports, socket link
export const PosTerminalMetaphor: FC<MetaphorProps> = ({ accent, className }) => {
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
      aria-label="Point of sale scene with Android phone transaction, Verifone terminal, recharge, lottery and Crystal Reports icons, and socket connection"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="pos-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>

      {/* Top-right: "first formal production environment" badge — 2014 milestone */}
      <g transform="translate(196 6)">
        <rect
          x="0"
          y="0"
          width="118"
          height="20"
          rx="10"
          fill={navy}
          stroke={accent}
          strokeWidth="0.9"
          opacity="0.95"
        />
        <rect
          x="0"
          y="0"
          width="118"
          height="20"
          rx="10"
          fill="none"
          stroke={accent}
          strokeWidth="0.4"
          filter="url(#pos-glow)"
          opacity="0.6"
        />
        {/* small spark badge icon */}
        <g transform="translate(11 10)">
          <circle cx="0" cy="0" r="5" fill={accent} opacity="0.18" />
          <path
            d="M 0 -3.4 L 1.1 -1 L 3.6 -0.6 L 1.8 1.2 L 2.2 3.8 L 0 2.6 L -2.2 3.8 L -1.8 1.2 L -3.6 -0.6 L -1.1 -1 Z"
            fill={accent}
          />
        </g>
        <text
          x="22"
          y="9"
          fontFamily="ui-monospace, monospace"
          fontSize="3.4"
          fill={muted}
          letterSpacing="0.4"
        >
          MILESTONE · FIRST JOB
        </text>
        <text
          x="22"
          y="16"
          fontFamily="ui-sans-serif, system-ui"
          fontSize="5"
          fontWeight="600"
          fill={offWhite}
        >
          First production environment
        </text>
      </g>

      {/* Left: Android phone */}
      <g transform="translate(14 18)">
        <rect x="0" y="0" width="58" height="106" rx="8" fill={mid} stroke={offWhite} strokeWidth="1.2" />
        {/* speaker */}
        <rect x="22" y="4" width="14" height="1.6" rx="0.8" fill={slate} />
        {/* screen */}
        <rect x="3" y="10" width="52" height="84" rx="3" fill={navy} stroke={slate} strokeWidth="0.6" />
        {/* status bar */}
        <text x="6" y="16" fontFamily="ui-monospace, monospace" fontSize="3.5" fill={muted}>
          POS · 14:32
        </text>
        <circle cx="50" cy="14.5" r="1" fill={accent} />
        {/* transaction screen */}
        <text x="29" y="30" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          PAGAR
        </text>
        <text x="29" y="50" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="14" fontWeight="600" fill={offWhite}>
          $1,250
        </text>
        <text x="29" y="58" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3" fill={muted}>
          DOP
        </text>
        {/* approve button */}
        <rect x="8" y="68" width="42" height="14" rx="3" fill={accent} opacity="0.95" filter="url(#pos-glow)" />
        <text x="29" y="77" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="6" fontWeight="600" fill={navy}>
          APROBAR
        </text>
        <rect x="8" y="85" width="42" height="6" rx="1" fill={navy} stroke={slate} strokeWidth="0.5" />
        {/* home button */}
        <rect x="22" y="98" width="14" height="4" rx="1.5" fill={slate} />
      </g>

      {/* Connecting cable from phone to Verifone */}
      <g fill="none" stroke={accent} strokeWidth="1.4" opacity="0.85">
        <path d="M 72 80 C 90 96 100 108 124 110" strokeLinecap="round" />
        <path d="M 72 80 C 90 96 100 108 124 110" stroke={accent} strokeWidth="0.6" filter="url(#pos-glow)" />
      </g>

      {/* Center: Verifone POS terminal */}
      <g transform="translate(122 38)">
        <rect x="0" y="0" width="78" height="98" rx="6" fill={mid} stroke={offWhite} strokeWidth="1.2" />
        {/* display */}
        <rect x="6" y="6" width="66" height="28" rx="2" fill={navy} stroke={slate} strokeWidth="0.6" />
        <text x="10" y="14" fontFamily="ui-monospace, monospace" fontSize="3.5" fill={muted}>
          VERIFONE · VX
        </text>
        <text x="10" y="24" fontFamily="ui-monospace, monospace" fontSize="6" fill={accent}>
          APPROVED
        </text>
        <text x="10" y="31" fontFamily="ui-monospace, monospace" fontSize="3" fill={muted}>
          ********4521
        </text>
        {/* keypad 4x3 */}
        {(() => {
          const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
          return keys.map((k, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = 8 + col * 21;
            const y = 40 + row * 12;
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <rect x="0" y="0" width="18" height="10" rx="1.5" fill={navy} stroke={slate} strokeWidth="0.6" />
                <text
                  x="9"
                  y="7.5"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="5"
                  fill={offWhite}
                >
                  {k}
                </text>
              </g>
            );
          });
        })()}
        {/* action keys */}
        <rect x="8" y="88" width="18" height="6" rx="1.2" fill="#EF4444" opacity="0.85" />
        <rect x="30" y="88" width="18" height="6" rx="1.2" fill="#F59E0B" opacity="0.85" />
        <rect x="52" y="88" width="18" height="6" rx="1.2" fill={accent} opacity="0.95" />
        {/* receipt paper */}
        <path d="M 78 14 L 92 14 L 90 8 L 80 8 Z" fill={offWhite} opacity="0.85" stroke={slate} strokeWidth="0.5" />
      </g>

      {/* Right: 3 vertical icons */}
      <g transform="translate(220 18)">
        {/* lightning bolt — recharge */}
        <g transform="translate(0 0)">
          <rect x="0" y="0" width="86" height="34" rx="3" fill={mid} opacity="0.7" stroke={slate} strokeWidth="0.6" />
          <g transform="translate(14 17)">
            <path
              d="M 0 -9 L -5 1 L -1 1 L -3 9 L 4 -2 L 0 -2 Z"
              fill={accent}
              stroke={accent}
              strokeWidth="0.6"
              filter="url(#pos-glow)"
            />
          </g>
          <text x="30" y="14" fontFamily="ui-monospace, monospace" fontSize="4.5" fill={offWhite}>
            RECARGA
          </text>
          <text x="30" y="22" fontFamily="ui-monospace, monospace" fontSize="3.5" fill={muted}>
            móvil · prepago
          </text>
        </g>

        {/* lottery ticket with stars */}
        <g transform="translate(0 38)">
          <rect x="0" y="0" width="86" height="34" rx="3" fill={mid} opacity="0.7" stroke={slate} strokeWidth="0.6" />
          <g transform="translate(14 17)">
            <path
              d="M -8 -7 L 8 -7 L 8 7 L -8 7 Z"
              fill={navy}
              stroke={accent}
              strokeWidth="0.9"
            />
            {/* perforation */}
            <line x1="-8" y1="-1" x2="8" y2="-1" stroke={accent} strokeDasharray="1 1" strokeWidth="0.5" />
            {/* stars */}
            {[-5, 0, 5].map((sx, i) => (
              <path
                key={i}
                d={`M ${sx} 1 L ${sx + 0.7} 3 L ${sx + 2.5} 3 L ${sx + 1.1} 4.3 L ${sx + 1.7} 6.2 L ${sx} 5 L ${sx - 1.7} 6.2 L ${sx - 1.1} 4.3 L ${sx - 2.5} 3 L ${sx - 0.7} 3 Z`}
                fill={accent}
              />
            ))}
          </g>
          <text x="30" y="14" fontFamily="ui-monospace, monospace" fontSize="4.5" fill={offWhite}>
            LOTERÍA
          </text>
          <text x="30" y="22" fontFamily="ui-monospace, monospace" fontSize="3.5" fill={muted}>
            jugadas · premios
          </text>
        </g>

        {/* Crystal Reports doc with bars */}
        <g transform="translate(0 76)">
          <rect x="0" y="0" width="86" height="34" rx="3" fill={mid} opacity="0.7" stroke={slate} strokeWidth="0.6" />
          <g transform="translate(14 17)">
            <rect x="-7" y="-9" width="14" height="18" rx="1" fill={offWhite} stroke={slate} strokeWidth="0.6" />
            <rect x="-5" y="2" width="2" height="5" fill={accent} />
            <rect x="-2" y="-1" width="2" height="8" fill={accent} opacity="0.8" />
            <rect x="1" y="0" width="2" height="7" fill={accent} opacity="0.7" />
            <rect x="4" y="-3" width="2" height="10" fill={accent} />
            <line x1="-5" y1="-7" x2="3" y2="-7" stroke={slate} strokeWidth="0.6" />
            <line x1="-5" y1="-5" x2="5" y2="-5" stroke={slate} strokeWidth="0.6" />
          </g>
          <text x="30" y="14" fontFamily="ui-monospace, monospace" fontSize="4.5" fill={offWhite}>
            CRYSTAL
          </text>
          <text x="30" y="22" fontFamily="ui-monospace, monospace" fontSize="3.5" fill={muted}>
            reportes · ASP.NET
          </text>
        </g>
      </g>

      {/* Bottom: socket connection */}
      <g transform="translate(14 152)">
        <rect x="0" y="0" width="20" height="14" rx="2" fill={navy} stroke={accent} strokeWidth="1" />
        <text x="10" y="9.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" fill={accent}>
          API
        </text>
        {/* wavy line */}
        <path
          d="M 20 7 C 30 -2 40 16 50 7 C 60 -2 70 16 80 7 C 90 -2 100 16 110 7 C 120 -2 130 16 140 7 C 150 -2 160 16 170 7 C 180 -2 186 12 196 7"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          opacity="0.75"
          strokeDasharray="4 2"
        >
          <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.4s" repeatCount="indefinite" />
        </path>
        {/* arrows bidirectional */}
        <path d="M 80 0 L 84 4 L 80 4 Z" fill={accent} opacity="0.85" />
        <path d="M 130 14 L 126 10 L 130 10 Z" fill={accent} opacity="0.85" />
        <rect x="196" y="0" width="20" height="14" rx="2" fill={navy} stroke={accent} strokeWidth="1" />
        <text x="206" y="9.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" fill={accent}>
          POS
        </text>
        <text x="225" y="9.5" fontFamily="ui-monospace, monospace" fontSize="3.5" fill={muted}>
          TCP · SOCKETS
        </text>
      </g>
    </svg>
  );
};
