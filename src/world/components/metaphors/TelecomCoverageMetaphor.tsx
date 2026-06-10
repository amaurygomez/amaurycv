import type { FC } from "react";

type MetaphorProps = {
  accent: string;
  className?: string;
};

// TelecomCoverageMetaphor — Carrier CRM coverage map, signal layers, IVR & recording
export const TelecomCoverageMetaphor: FC<MetaphorProps> = ({ accent, className }) => {
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
      aria-label="Telecom coverage dashboard with cell tower, signal rings, CRM service tiles, hexagonal coverage grid, waveform and IVR keypad"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="telecom-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <linearGradient id="telecom-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} stopOpacity="0.9" />
          <stop offset="100%" stopColor={navy} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Central cell tower */}
      <g transform="translate(160 92)">
        {/* Concentric signal rings */}
        <g opacity="0.55" fill="none" stroke={accent} strokeWidth="1">
          <circle cx="0" cy="0" r="18" />
          <circle cx="0" cy="0" r="32" opacity="0.5" />
          <circle cx="0" cy="0" r="46" opacity="0.3" />
        </g>
        {/* Animated outward pulse ring */}
        <g opacity="0.9" filter="url(#telecom-glow)">
          <circle cx="0" cy="0" r="18" fill="none" stroke={accent} strokeWidth="1.2">
            <animate attributeName="r" values="18;52;18" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Tower base */}
        <g stroke={offWhite} strokeWidth="1.2" fill="none">
          <path d="M -7 26 L 0 -18 L 7 26 Z" />
          <line x1="-4" y1="8" x2="4" y2="8" />
          <line x1="-5" y1="16" x2="5" y2="16" />
          <line x1="-2" y1="0" x2="2" y2="0" />
        </g>
        {/* Antenna top */}
        <circle cx="0" cy="-20" r="2" fill={accent} />
      </g>

      {/* Left: CRM coverage card with 4 service tiles + availability strip */}
      <g transform="translate(14 24)">
        <rect x="0" y="0" width="86" height="78" rx="4" fill="url(#telecom-card)" stroke={slate} strokeWidth="1" />
        <rect x="6" y="6" width="74" height="6" rx="1.5" fill={mid} />
        <circle cx="10" cy="9" r="1.4" fill={accent} />
        <text x="16" y="11" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>CRM · COVERAGE</text>
        {/* small subtitle */}
        <text x="6" y="69" fontFamily="ui-monospace, monospace" fontSize="3" fill={muted} opacity="0.85">
          SERVICE AVAILABILITY
        </text>
        {/* availability sparkline */}
        <path
          d="M 6 74 L 14 74 L 18 71 L 24 75 L 30 70 L 36 73 L 44 72 L 50 75 L 58 71 L 66 73 L 74 70 L 80 73"
          fill="none"
          stroke={accent}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4 service tiles 2x2 */}
        {[
          { x: 6, y: 18, label: "HFC" },
          { x: 46, y: 18, label: "FIBER" },
          { x: 6, y: 42, label: "4G" },
          { x: 46, y: 42, label: "5G" },
        ].map((tile, i) => (
          <g key={i} transform={`translate(${tile.x} ${tile.y})`}>
            <rect x="0" y="0" width="34" height="20" rx="2" fill={navy} stroke={slate} strokeWidth="0.8" />
            <text x="5" y="9" fontFamily="ui-monospace, monospace" fontSize="4.5" fill={offWhite}>
              {tile.label}
            </text>
            {/* check mark */}
            <path
              d={`M 24 12 L 26 14 L 30 10`}
              stroke={accent}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="5" y1="14" x2="20" y2="14" stroke={slate} strokeWidth="0.6" />
          </g>
        ))}
      </g>

      {/* Right: hexagonal coverage grid */}
      <g transform="translate(220 22)">
        {/* hex helper coords */}
        {(() => {
          const hexes: { cx: number; cy: number; filled?: boolean }[] = [
            { cx: 14, cy: 12, filled: true },
            { cx: 34, cy: 12 },
            { cx: 54, cy: 12, filled: true },
            { cx: 24, cy: 28 },
            { cx: 44, cy: 28, filled: true },
            { cx: 64, cy: 28 },
            { cx: 14, cy: 44, filled: true },
            { cx: 34, cy: 44 },
            { cx: 54, cy: 44 },
            { cx: 24, cy: 60 },
            { cx: 44, cy: 60, filled: true },
            { cx: 64, cy: 60 },
          ];
          const r = 9;
          const hexPath = (cx: number, cy: number) => {
            const pts: string[] = [];
            for (let i = 0; i < 6; i++) {
              const a = (Math.PI / 3) * i + Math.PI / 6;
              pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
            }
            return `M ${pts.join(" L ")} Z`;
          };
          return (
            <g>
              {hexes.map((h, i) => (
                <path
                  key={i}
                  d={hexPath(h.cx, h.cy)}
                  fill={h.filled ? accent : "none"}
                  fillOpacity={h.filled ? 0.18 : 0}
                  stroke={h.filled ? accent : slate}
                  strokeWidth={h.filled ? 1 : 0.8}
                  opacity={h.filled ? 1 : 0.7}
                />
              ))}
              {/* tramo lines connecting antennas */}
              <g stroke={accent} strokeWidth="0.8" opacity="0.7" fill="none">
                <path d="M 14 12 L 44 28 L 14 44 L 44 60" strokeDasharray="2 2" />
              </g>
              {/* antenna markers */}
              {hexes
                .filter((h) => h.filled)
                .map((h, i) => (
                  <circle key={`a-${i}`} cx={h.cx} cy={h.cy} r="1.6" fill={offWhite} />
                ))}
            </g>
          );
        })()}
      </g>

      {/* Bottom-left: waveform (call recording) */}
      <g transform="translate(14 134)">
        <rect x="0" y="0" width="130" height="34" rx="3" fill={mid} opacity="0.7" stroke={slate} strokeWidth="0.8" />
        <circle cx="9" cy="17" r="2.4" fill={accent}>
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="15" y="9" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>REC · LIVE</text>
        <path
          d="M 18 22 L 22 14 L 26 24 L 30 12 L 34 26 L 38 16 L 42 22 L 46 14 L 50 24 L 54 12 L 58 26 L 62 16 L 66 22 L 70 14 L 74 24 L 78 12 L 82 26 L 86 16 L 90 22 L 94 14 L 98 24 L 102 16 L 106 22 L 110 14 L 114 24 L 118 18 L 122 22"
          stroke={accent}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </g>

      {/* Bottom-right: IVR keypad 3x4 */}
      <g transform="translate(220 102)">
        <rect x="-4" y="-4" width="92" height="74" rx="4" fill={mid} opacity="0.7" stroke={slate} strokeWidth="0.8" />
        <text x="0" y="2" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>IVR · ASTERISK</text>
        {(() => {
          const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
          const highlight = 4; // index of "5"
          return keys.map((k, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = col * 28;
            const y = 8 + row * 15;
            const isHi = i === highlight;
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="12"
                  rx="2"
                  fill={isHi ? accent : navy}
                  fillOpacity={isHi ? 0.25 : 1}
                  stroke={isHi ? accent : slate}
                  strokeWidth="0.8"
                />
                <text
                  x="12"
                  y="8.5"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="6"
                  fill={isHi ? accent : offWhite}
                >
                  {k}
                </text>
              </g>
            );
          });
        })()}
      </g>
    </svg>
  );
};
