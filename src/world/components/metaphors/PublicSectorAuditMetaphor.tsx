import type { FC } from "react";

type MetaphorProps = {
  accent: string;
  className?: string;
};

// PublicSectorAuditMetaphor — secure API gateway, audit trail, RD map, permissions
export const PublicSectorAuditMetaphor: FC<MetaphorProps> = ({ accent, className }) => {
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
      aria-label="Public sector platform: secure API gateway and identity shield, institutional servers, Dominican Republic operational map with pins, role/permissions matrix and immutable audit log"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="audit-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <linearGradient id="audit-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} stopOpacity="0.85" />
          <stop offset="100%" stopColor={navy} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Center-left: shield + API connectors */}
      <g transform="translate(80 50)">
        {/* shield */}
        <g>
          <path
            d="M 0 -22 L 18 -14 L 18 6 C 18 18 10 26 0 30 C -10 26 -18 18 -18 6 L -18 -14 Z"
            fill={mid}
            stroke={accent}
            strokeWidth="1.2"
            opacity="0.95"
          />
          <path
            d="M 0 -22 L 18 -14 L 18 6 C 18 18 10 26 0 30 C -10 26 -18 18 -18 6 L -18 -14 Z"
            fill="none"
            stroke={accent}
            strokeWidth="0.6"
            filter="url(#audit-glow)"
            opacity="0.7"
          />
          {/* keyhole */}
          <circle cx="0" cy="0" r="3" fill={accent} />
          <rect x="-1" y="2" width="2" height="6" rx="0.5" fill={accent} />
        </g>

        {/* 4 server nodes around shield */}
        {[
          { x: -50, y: -30, label: "MIN" },
          { x: 50, y: -30, label: "GOB" },
          { x: -50, y: 32, label: "ID" },
          { x: 50, y: 32, label: "OPS" },
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x} ${n.y})`}>
            <line
              x1="0"
              y1="0"
              x2={-n.x * 0.5}
              y2={-n.y * 0.5}
              stroke={accent}
              strokeWidth="0.7"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            <rect x="-10" y="-7" width="20" height="14" rx="2" fill={navy} stroke={slate} strokeWidth="0.8" />
            <line x1="-7" y1="-3" x2="7" y2="-3" stroke={muted} strokeWidth="0.5" />
            <line x1="-7" y1="0" x2="7" y2="0" stroke={muted} strokeWidth="0.5" />
            <line x1="-7" y1="3" x2="7" y2="3" stroke={muted} strokeWidth="0.5" />
            <circle cx="-8" cy="-5" r="0.8" fill={accent} />
            <text
              x="0"
              y="14"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="3.5"
              fill={muted}
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>

      {/* Right: stylized RD map silhouette */}
      <g transform="translate(178 22)">
        <path
          d="M 4 26
             C 8 18 18 14 28 14
             C 40 10 56 12 70 16
             C 86 18 104 22 116 28
             C 124 32 128 38 124 44
             C 120 50 110 52 100 50
             C 86 48 72 50 60 52
             C 48 54 36 56 26 54
             C 14 52 6 46 4 38 Z"
          fill={mid}
          stroke={accent}
          strokeWidth="1"
          opacity="0.85"
        />
        {/* coastline accent */}
        <path
          d="M 4 26 C 8 18 18 14 28 14 C 40 10 56 12 70 16"
          fill="none"
          stroke={accent}
          strokeWidth="0.6"
          opacity="0.8"
        />
        {/* static location pins — identity-grade markers, not radar pulses */}
        {[
          { x: 36, y: 28 },
          { x: 64, y: 34 },
          { x: 92, y: 30 },
          { x: 108, y: 40 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <circle cx="0" cy="0" r="2.2" fill={accent} opacity="0.95" />
            <circle cx="0" cy="0" r="3.4" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.55" />
          </g>
        ))}
        {/* one slow gentle pulse only — keeps the map alive without radar feel */}
        <g transform="translate(64 34)">
          <circle cx="0" cy="0" r="3" fill="none" stroke={accent} strokeWidth="0.7">
            <animate attributeName="r" values="3;8;3" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0;0.55" dur="3.6s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>

      {/* Mid-right: ROLE MATRIX panel — identity/permissions made first-class */}
      <g transform="translate(178 84)">
        <rect x="0" y="0" width="130" height="42" rx="3" fill="url(#audit-panel)" stroke={slate} strokeWidth="0.7" />
        <text x="6" y="8" fontFamily="ui-monospace, monospace" fontSize="3.6" fill={muted}>
          ROLE MATRIX · IDENTITY
        </text>
        {/* column headers */}
        <text x="56" y="15" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="2.8" fill={muted}>READ</text>
        <text x="80" y="15" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="2.8" fill={muted}>WRITE</text>
        <text x="104" y="15" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="2.8" fill={muted}>AUDIT</text>
        {/* rows */}
        {[
          { y: 21, label: "admin", grants: [true, true, true] },
          { y: 28, label: "operator", grants: [true, true, false] },
          { y: 35, label: "auditor", grants: [true, false, true] },
        ].map((row, i) => (
          <g key={i}>
            <text x="6" y={row.y + 2} fontFamily="ui-monospace, monospace" fontSize="3" fill={offWhite}>
              {row.label}
            </text>
            {row.grants.map((g, ci) => (
              <g key={ci} transform={`translate(${56 + ci * 24} ${row.y})`}>
                {g ? (
                  <>
                    <circle cx="0" cy="0" r="2" fill={accent} opacity="0.85" />
                    <path d="M -1 0 L 0 1 L 1.5 -1" stroke={navy} strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ) : (
                  <line x1="-1.6" y1="0" x2="1.6" y2="0" stroke={slate} strokeWidth="0.8" />
                )}
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* Top-left: stacked permission badges */}
      <g transform="translate(8 8)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 3} ${i * 5})`}>
            <rect x="0" y="0" width="56" height="14" rx="3" fill={navy} stroke={slate} strokeWidth="0.8" />
            {/* lock */}
            <g transform="translate(6 7)">
              <rect x="-2.4" y="-1" width="4.8" height="4" rx="0.8" fill={accent} />
              <path
                d="M -1.6 -1 L -1.6 -2.4 C -1.6 -3.6 -0.6 -4.4 0 -4.4 C 0.6 -4.4 1.6 -3.6 1.6 -2.4 L 1.6 -1"
                fill="none"
                stroke={accent}
                strokeWidth="0.8"
              />
            </g>
            <line x1="15" y1="5" x2="50" y2="5" stroke={muted} strokeWidth="0.6" />
            <line x1="15" y1="9" x2="42" y2="9" stroke={slate} strokeWidth="0.6" />
          </g>
        ))}
      </g>

      {/* Bottom: audit log */}
      <g transform="translate(14 132)">
        <rect x="-4" y="-6" width="298" height="42" rx="3" fill="url(#audit-panel)" stroke={slate} strokeWidth="0.8" />
        <text x="0" y="0" fontFamily="ui-monospace, monospace" fontSize="4" fill={muted}>
          AUDIT · IMMUTABLE
        </text>
        {[
          { y: 8, w: 230 },
          { y: 16, w: 200 },
          { y: 24, w: 250 },
          { y: 32, w: 180 },
        ].map((l, i) => (
          <g key={i}>
            <circle cx="2" cy={l.y + 4} r="1.4" fill={accent} opacity={1 - i * 0.15} />
            <text
              x="8"
              y={l.y + 6}
              fontFamily="ui-monospace, monospace"
              fontSize="3.5"
              fill={muted}
            >
              {`14:0${i + 1}:2${i}`}
            </text>
            <line
              x1="28"
              y1={l.y + 4.5}
              x2={28 + l.w * 0.9}
              y2={l.y + 4.5}
              stroke={offWhite}
              strokeOpacity="0.4"
              strokeWidth="1.2"
            />
          </g>
        ))}
      </g>

      {/* Confidential stamp */}
      <g transform="translate(266 14) rotate(-12)" opacity="0.45">
        <rect x="0" y="0" width="48" height="14" rx="1" fill="none" stroke={accent} strokeWidth="1" />
        <rect x="2" y="2" width="44" height="10" rx="0.5" fill="none" stroke={accent} strokeWidth="0.4" />
        <text
          x="24"
          y="9.5"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="4.5"
          fill={accent}
          letterSpacing="0.5"
        >
          CONFIDENTIAL
        </text>
      </g>
    </svg>
  );
};
