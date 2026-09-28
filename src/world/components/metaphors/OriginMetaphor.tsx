import type { FC } from "react";

type MetaphorProps = {
  accent: string;
  className?: string;
};

export const OriginMetaphor: FC<MetaphorProps> = ({ accent, className }) => {
  const navy = "#0B1020";
  const mid = "#1A2238";
  const slate = "#374151";
  const offWhite = "#F7F3EA";
  const muted = "#A8B0C2";

  const nodeY = 86;
  const stepXs = [36, 96, 160, 224, 286];
  const years = ["01", "02", "03", "04", "05"];

  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Origin timeline: childhood CRT and book, national scholarship medal, uncle's desktop tower and floppy, technical-training graduation cap with Java coffee, and first job briefcase"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="origin-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <g>
        <line
          x1={stepXs[0]}
          y1={nodeY}
          x2={stepXs[stepXs.length - 1]}
          y2={nodeY}
          stroke={slate}
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <line
          x1={stepXs[0]}
          y1={nodeY}
          x2={stepXs[stepXs.length - 1]}
          y2={nodeY}
          stroke={accent}
          strokeWidth="1.2"
          opacity="0.85"
          strokeDasharray="120 200"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-320"
            dur="9s"
            repeatCount="indefinite"
          />
        </line>
        {stepXs.map((x, i) => (
          <g key={i} transform={`translate(${x} ${nodeY})`}>
            <circle cx="0" cy="0" r="3.4" fill={navy} stroke={accent} strokeWidth="1.2" />
            <circle cx="0" cy="0" r="1.4" fill={accent} />
          </g>
        ))}
      </g>

      <g transform={`translate(${stepXs[0]} ${nodeY - 36})`}>
        <rect
          x="-14"
          y="-14"
          width="22"
          height="18"
          rx="1.2"
          fill={mid}
          stroke={offWhite}
          strokeWidth="1"
        />
        <rect
          x="-12"
          y="-12"
          width="18"
          height="14"
          rx="0.8"
          fill={navy}
          stroke={accent}
          strokeWidth="0.6"
        />
        <line x1="-12" y1="-8" x2="6" y2="-8" stroke={accent} strokeWidth="0.4" opacity="0.5" />
        <line x1="-12" y1="-4" x2="6" y2="-4" stroke={accent} strokeWidth="0.4" opacity="0.5" />
        <line x1="-12" y1="0" x2="6" y2="0" stroke={accent} strokeWidth="0.4" opacity="0.5" />
        <path d="M -10 4 L 4 4 L 6 8 L -12 8 Z" fill={mid} stroke={offWhite} strokeWidth="0.8" />
        <g transform="translate(12 0)">
          <rect x="0" y="0" width="10" height="3" rx="0.5" fill={accent} opacity="0.85" />
          <rect x="0" y="3" width="10" height="3" rx="0.5" fill={offWhite} opacity="0.85" />
          <rect
            x="0"
            y="6"
            width="10"
            height="3"
            rx="0.5"
            fill={mid}
            stroke={offWhite}
            strokeWidth="0.5"
          />
        </g>
      </g>

      <g transform={`translate(${stepXs[1]} ${nodeY - 36})`}>
        <path d="M -8 -22 L -4 -8 L 0 -14 L 4 -8 L 8 -22 Z" fill={accent} opacity="0.85" />
        <path d="M -6 -22 L -4 -10" fill="none" stroke={navy} strokeWidth="0.5" />
        <path d="M 6 -22 L 4 -10" fill="none" stroke={navy} strokeWidth="0.5" />
        <circle
          cx="0"
          cy="0"
          r="10"
          fill={mid}
          stroke={accent}
          strokeWidth="1.4"
          filter="url(#origin-glow)"
        />
        <circle cx="0" cy="0" r="10" fill={mid} stroke={accent} strokeWidth="1.2" />
        <circle cx="0" cy="0" r="6.5" fill="none" stroke={offWhite} strokeWidth="0.5" />
        <path
          d="M 0 -5 L 1.4 -1.6 L 5 -1.4 L 2.2 1 L 3 4.6 L 0 2.6 L -3 4.6 L -2.2 1 L -5 -1.4 L -1.4 -1.6 Z"
          fill={accent}
        />
      </g>

      <g transform={`translate(${stepXs[2]} ${nodeY - 36})`}>
        <rect
          x="-10"
          y="-18"
          width="14"
          height="26"
          rx="0.8"
          fill={mid}
          stroke={offWhite}
          strokeWidth="1"
        />
        <rect
          x="-8"
          y="-15"
          width="10"
          height="2"
          rx="0.3"
          fill={navy}
          stroke={slate}
          strokeWidth="0.4"
        />
        <rect
          x="-8"
          y="-11"
          width="10"
          height="1.4"
          rx="0.3"
          fill={navy}
          stroke={slate}
          strokeWidth="0.4"
        />
        <circle cx="-2" cy="-7" r="0.8" fill={accent} />
        <line x1="-8" y1="-4" x2="2" y2="-4" stroke={slate} strokeWidth="0.5" />
        <line x1="-8" y1="-2" x2="2" y2="-2" stroke={slate} strokeWidth="0.5" />
        <line x1="-8" y1="0" x2="2" y2="0" stroke={slate} strokeWidth="0.5" />
        <line x1="-8" y1="2" x2="2" y2="2" stroke={slate} strokeWidth="0.5" />
        <g transform="translate(10 -2)">
          <rect
            x="0"
            y="0"
            width="11"
            height="11"
            rx="0.6"
            fill={navy}
            stroke={offWhite}
            strokeWidth="0.8"
          />
          <rect
            x="1.5"
            y="0"
            width="6"
            height="3.5"
            fill={mid}
            stroke={offWhite}
            strokeWidth="0.4"
          />
          <rect x="2" y="6" width="7" height="5" fill={mid} stroke={offWhite} strokeWidth="0.4" />
          <rect x="3" y="7" width="3" height="3" fill={navy} />
        </g>
      </g>

      <g transform={`translate(${stepXs[3]} ${nodeY - 36})`}>
        <g>
          <path
            d="M -14 -8 L 0 -14 L 14 -8 L 0 -2 Z"
            fill={navy}
            stroke={offWhite}
            strokeWidth="1"
          />
          <path
            d="M -8 -5 L -8 2 C -8 5 8 5 8 2 L 8 -5"
            fill={mid}
            stroke={offWhite}
            strokeWidth="0.9"
          />
          <line x1="10" y1="-7" x2="14" y2="2" stroke={accent} strokeWidth="0.9" />
          <circle cx="14" cy="2.5" r="1.4" fill={accent} />
          <circle cx="0" cy="-8" r="0.9" fill={accent} />
        </g>
        <g transform="translate(4 8)">
          <path d="M -5 0 L 5 0 L 4 8 L -4 8 Z" fill={offWhite} stroke={slate} strokeWidth="0.7" />
          <path d="M 5 2 C 8 2 8 6 5 6" fill="none" stroke={slate} strokeWidth="0.8" />
          <path
            d="M -2 -1 C -1 -3 -3 -4 -2 -6"
            fill="none"
            stroke={accent}
            strokeWidth="0.7"
            opacity="0.85"
          >
            <animate
              attributeName="opacity"
              values="0.85;0.3;0.85"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 1 -1 C 2 -3 0 -4 1 -6"
            fill="none"
            stroke={accent}
            strokeWidth="0.7"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.7;0.2;0.7"
              dur="2.2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>

      <g transform={`translate(${stepXs[4]} ${nodeY - 36})`}>
        <path d="M -5 -10 C -5 -14 5 -14 5 -10" fill="none" stroke={offWhite} strokeWidth="1.2" />
        <rect
          x="-12"
          y="-10"
          width="24"
          height="18"
          rx="1.5"
          fill={mid}
          stroke={offWhite}
          strokeWidth="1.1"
        />
        <rect x="-2" y="-10" width="4" height="3" rx="0.5" fill={accent} />
        <line x1="-12" y1="-2" x2="12" y2="-2" stroke={accent} strokeWidth="0.7" opacity="0.85" />
        <line x1="-9" y1="-10" x2="-9" y2="8" stroke={slate} strokeWidth="0.5" />
        <line x1="9" y1="-10" x2="9" y2="8" stroke={slate} strokeWidth="0.5" />
        <rect
          x="-12"
          y="-10"
          width="24"
          height="18"
          rx="1.5"
          fill="none"
          stroke={accent}
          strokeWidth="0.6"
          filter="url(#origin-glow)"
          opacity="0.55"
        />
      </g>

      {stepXs.map((x, i) => (
        <text
          key={i}
          x={x}
          y={nodeY + 18}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="5"
          fill={muted}
        >
          {years[i]}
        </text>
      ))}

      <g fontFamily="ui-monospace, monospace" fontSize="3.5" fill={slate}>
        <text x={stepXs[0]} y={nodeY + 28} textAnchor="middle">
          FIRST PC
        </text>
        <text x={stepXs[1]} y={nodeY + 28} textAnchor="middle">
          SCHOLARSHIP
        </text>
        <text x={stepXs[2]} y={nodeY + 28} textAnchor="middle">
          LINUX
        </text>
        <text x={stepXs[3]} y={nodeY + 28} textAnchor="middle">
          JAVA TRACK
        </text>
        <text x={stepXs[4]} y={nodeY + 28} textAnchor="middle">
          FIRST JOB
        </text>
      </g>

      <g transform="translate(14 18)">
        <circle cx="0" cy="0" r="2" fill={accent} />
        <text x="6" y="2.5" fontFamily="ui-monospace, monospace" fontSize="4.5" fill={muted}>
          ORIGIN · CURIOSITY → CRAFT
        </text>
      </g>
    </svg>
  );
};
