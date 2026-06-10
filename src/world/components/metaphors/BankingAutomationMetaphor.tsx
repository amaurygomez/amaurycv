import type { FC } from "react";

type MetaphorProps = {
  accent: string;
  className?: string;
};

// BankingAutomationMetaphor — shared folder collision, .bat automation, JasperReports, vehicle loan
export const BankingAutomationMetaphor: FC<MetaphorProps> = ({ accent, className }) => {
  const navy = "#0B1020";
  const mid = "#1A2238";
  const slate = "#374151";
  const offWhite = "#F7F3EA";
  const muted = "#A8B0C2";
  const danger = "#F87171";
  const success = "#34D399";

  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Banking automation flow showing shared folder conflict, batch script terminal, resolved file, JasperReports chart, and vehicle loan"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="banking-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {/* Left: folder + collision */}
      <g transform="translate(10 18)">
        {/* folder */}
        <path
          d="M 0 8 L 0 56 C 0 58 1.5 59 3 59 L 75 59 C 76.5 59 78 58 78 56 L 78 14 C 78 12.5 76.5 11 75 11 L 36 11 L 30 6 L 3 6 C 1.5 6 0 7.5 0 8 Z"
          fill={mid}
          stroke={accent}
          strokeWidth="1"
          opacity="0.9"
        />
        {/* file in folder */}
        <g transform="translate(30 24)">
          <rect x="0" y="0" width="18" height="22" rx="1.5" fill={navy} stroke={offWhite} strokeWidth="0.8" />
          <line x1="3" y1="6" x2="15" y2="6" stroke={muted} strokeWidth="0.5" />
          <line x1="3" y1="10" x2="15" y2="10" stroke={muted} strokeWidth="0.5" />
          <line x1="3" y1="14" x2="12" y2="14" stroke={muted} strokeWidth="0.5" />
        </g>
        {/* 3 user silhouettes around */}
        {[
          { x: 8, y: 22 },
          { x: 60, y: 22 },
          { x: 34, y: 50 },
        ].map((u, i) => (
          <g key={i} transform={`translate(${u.x} ${u.y})`}>
            <circle cx="0" cy="0" r="3" fill={offWhite} opacity="0.85" />
            <path d="M -5 9 C -5 5 5 5 5 9 L 5 11 L -5 11 Z" fill={offWhite} opacity="0.7" />
          </g>
        ))}
        {/* collision X */}
        <g transform="translate(39 35)" filter="url(#banking-glow)">
          <circle cx="0" cy="0" r="6" fill={danger} opacity="0.95" />
          <path d="M -2.5 -2.5 L 2.5 2.5 M 2.5 -2.5 L -2.5 2.5" stroke={offWhite} strokeWidth="1.4" strokeLinecap="round" />
        </g>
        {/* label */}
        <text x="0" y="74" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          \\SHARED\REPORTS
        </text>
      </g>

      {/* Arrow → */}
      <g transform="translate(92 50)">
        <path d="M 0 0 L 18 0" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 14 -3 L 18 0 L 14 3" fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Center: terminal / .bat window */}
      <g transform="translate(112 14)">
        <rect x="0" y="0" width="100" height="72" rx="3" fill={navy} stroke={slate} strokeWidth="1" />
        {/* title bar */}
        <rect x="0" y="0" width="100" height="10" rx="3" fill={mid} />
        <circle cx="5" cy="5" r="1.4" fill="#EF4444" />
        <circle cx="11" cy="5" r="1.4" fill="#F59E0B" />
        <circle cx="17" cy="5" r="1.4" fill="#10B981" />
        <text x="50" y="7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          cmd.exe — resolve.bat
        </text>
        {/* script lines */}
        <g fontFamily="ui-monospace, monospace" fontSize="4.5">
          <text x="6" y="20" fill={accent}>@echo off</text>
          <text x="6" y="28" fill={offWhite}>
            <tspan fill={accent}>set</tspan> SRC=\\shared\reports
          </text>
          <text x="6" y="36" fill={offWhite}>
            <tspan fill={accent}>for</tspan> %%f in (%SRC%\*.xls) do (
          </text>
          <text x="14" y="44" fill={offWhite}>
            move %%f %SRC%\queue\
          </text>
          <text x="6" y="52" fill={offWhite}>)</text>
          <text x="6" y="60" fill={success}>
            &gt; queue flushed · OK
          </text>
          <text x="6" y="68" fill={offWhite}>
            C:\&gt;<tspan>
              <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
              _
            </tspan>
          </text>
        </g>
      </g>

      {/* Arrow → */}
      <g transform="translate(216 50)">
        <path d="M 0 0 L 18 0" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 14 -3 L 18 0 L 14 3" fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Right: resolved file with green check */}
      <g transform="translate(240 18)">
        <rect x="0" y="0" width="42" height="54" rx="2" fill={mid} stroke={offWhite} strokeWidth="0.9" />
        <path d="M 30 0 L 42 0 L 42 12 Z" fill={navy} stroke={offWhite} strokeWidth="0.7" />
        <line x1="6" y1="20" x2="36" y2="20" stroke={muted} strokeWidth="0.6" />
        <line x1="6" y1="26" x2="36" y2="26" stroke={muted} strokeWidth="0.6" />
        <line x1="6" y1="32" x2="32" y2="32" stroke={muted} strokeWidth="0.6" />
        <line x1="6" y1="38" x2="28" y2="38" stroke={muted} strokeWidth="0.6" />
        {/* check badge */}
        <g transform="translate(34 46)" filter="url(#banking-glow)">
          <circle cx="0" cy="0" r="7" fill={success} />
          <path d="M -3 0 L -1 2.5 L 3.5 -2" stroke={offWhite} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="0" y="66" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          RESOLVED
        </text>
      </g>

      {/* Bottom-left: JasperReports doc with bar chart */}
      <g transform="translate(14 104)">
        <rect x="0" y="0" width="74" height="64" rx="2" fill={offWhite} opacity="0.95" stroke={slate} strokeWidth="0.8" />
        <rect x="4" y="4" width="66" height="6" rx="1" fill={navy} />
        <text x="7" y="9" fontFamily="ui-monospace, monospace" fontSize="4" fill={offWhite}>
          JASPER · REPORT
        </text>
        {/* chart */}
        <g transform="translate(8 18)">
          <line x1="0" y1="36" x2="60" y2="36" stroke={slate} strokeWidth="0.8" />
          <line x1="0" y1="0" x2="0" y2="36" stroke={slate} strokeWidth="0.8" />
          {[
            { x: 4, h: 16 },
            { x: 18, h: 28 },
            { x: 32, h: 22 },
            { x: 46, h: 32 },
          ].map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={36 - b.h}
              width="10"
              height={b.h}
              fill={accent}
              opacity={0.5 + i * 0.12}
              rx="1"
            />
          ))}
        </g>
        <line x1="6" y1="58" x2="50" y2="58" stroke={slate} strokeWidth="0.6" />
      </g>

      {/* Bottom-right: car silhouette + peso */}
      <g transform="translate(186 116)">
        <rect x="-6" y="-6" width="120" height="56" rx="3" fill={mid} opacity="0.5" stroke={slate} strokeWidth="0.6" />
        {/* car body */}
        <g transform="translate(20 22)">
          <path
            d="M 0 18 L 4 8 C 6 4 10 2 16 2 L 48 2 C 54 2 60 6 64 12 L 72 16 C 76 17 78 19 78 22 L 78 26 L 72 28 L 0 28 Z"
            fill={navy}
            stroke={offWhite}
            strokeWidth="1.2"
            opacity="0.95"
          />
          {/* windows */}
          <path d="M 10 8 L 14 4 L 38 4 L 42 10 Z" fill={accent} opacity="0.35" stroke={accent} strokeWidth="0.6" />
          <path d="M 42 10 L 38 4 L 54 4 C 58 4 62 6 64 10 Z" fill={accent} opacity="0.35" stroke={accent} strokeWidth="0.6" />
          {/* wheels */}
          <circle cx="16" cy="28" r="5" fill={offWhite} />
          <circle cx="16" cy="28" r="2.4" fill={navy} />
          <circle cx="58" cy="28" r="5" fill={offWhite} />
          <circle cx="58" cy="28" r="2.4" fill={navy} />
          {/* headlight */}
          <circle cx="76" cy="22" r="1.4" fill={accent} />
        </g>
        {/* peso symbol above */}
        <g transform="translate(96 12)">
          <circle cx="0" cy="0" r="8" fill={accent} opacity="0.95" />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fontWeight="600"
            fill={navy}
          >
            $
          </text>
        </g>
        <text x="0" y="62" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          PRÉSTAMOS · CRÉDITO
        </text>
      </g>
    </svg>
  );
};
