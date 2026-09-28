import type { FC } from "react";

type MetaphorProps = {
  accent: string;
  className?: string;
};

export const AILabMetaphor: FC<MetaphorProps> = ({ accent, className }) => {
  const navy = "#0B1020";
  const mid = "#1A2238";
  const slate = "#374151";
  const offWhite = "#F7F3EA";
  const muted = "#A8B0C2";
  const success = "#34D399";

  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Personal AI operations stack: workflow automation, LLM routing with local models, vector memory in Qdrant, observability traces, evals, and human-in-the-loop approval"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="ai-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <linearGradient id="ai-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} stopOpacity="0.9" />
          <stop offset="100%" stopColor={navy} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="ai-rack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={slate} stopOpacity="0.55" />
          <stop offset="100%" stopColor={navy} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g opacity="0.35">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={20 + i * 56}
            y="22"
            width="50"
            height="138"
            rx="2"
            fill="url(#ai-rack)"
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`led-${i}`}>
            <circle cx={26 + i * 56} cy="28" r="0.9" fill={success} />
            <circle cx={30 + i * 56} cy="28" r="0.9" fill={accent} opacity="0.85" />
          </g>
        ))}
      </g>

      <g transform="translate(8 8)">
        <rect
          x="0"
          y="0"
          width="304"
          height="22"
          rx="3"
          fill="url(#ai-panel)"
          stroke={slate}
          strokeWidth="0.7"
        />
        <text x="6" y="8" fontFamily="ui-monospace, monospace" fontSize="3.6" fill={muted}>
          OBSERVABILITY · LANGFUSE
        </text>
        <path
          d="M 6 16 L 26 16 L 30 12 L 36 18 L 42 14 L 58 14 L 64 10 L 72 16 L 84 16 L 90 13 L 96 17 L 110 17"
          fill="none"
          stroke={accent}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230].map((bx, i) => (
          <rect
            key={bx}
            x={bx}
            y={11 + (i % 3)}
            width="2"
            height={7 - (i % 3) * 1.5}
            fill={accent}
            opacity={0.5 + (i % 3) * 0.15}
          />
        ))}
        <g transform="translate(252 4)">
          <rect
            x="0"
            y="0"
            width="46"
            height="14"
            rx="7"
            fill={success}
            opacity="0.18"
            stroke={success}
            strokeWidth="0.8"
          />
          <path
            d="M 6 7 L 9 10 L 14 4"
            fill="none"
            stroke={success}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="18"
            y="9.5"
            fontFamily="ui-monospace, monospace"
            fontSize="4"
            fill={success}
            fontWeight="bold"
          >
            EVALS
          </text>
        </g>
      </g>

      <g transform="translate(160 96)">
        <rect
          x="-46"
          y="6"
          width="92"
          height="20"
          rx="2"
          fill={navy}
          stroke={slate}
          strokeWidth="0.8"
        />
        <rect
          x="-42"
          y="-30"
          width="84"
          height="38"
          rx="3"
          fill={navy}
          stroke={accent}
          strokeWidth="1.2"
        />
        <rect
          x="-42"
          y="-30"
          width="84"
          height="38"
          rx="3"
          fill="none"
          stroke={accent}
          strokeWidth="0.5"
          filter="url(#ai-glow)"
          opacity="0.6"
        />
        <rect x="-42" y="-30" width="84" height="6" rx="3" fill={mid} />
        <circle cx="-38" cy="-27" r="1.1" fill="#EF4444" />
        <circle cx="-34" cy="-27" r="1.1" fill="#F59E0B" />
        <circle cx="-30" cy="-27" r="1.1" fill={success} />
        <text
          x="0"
          y="-26"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="3.4"
          fill={muted}
        >
          ops-console
        </text>
        <g fontFamily="ui-monospace, monospace" fontSize="3.6">
          <text x="-38" y="-18" fill={accent}>
            $ project_command
          </text>
          <text x="-38" y="-13" fill={offWhite}>
            → classify · plan · critic
          </text>
          <text x="-38" y="-8" fill={muted}>
            retrieval: qdrant · context
          </text>
          <text x="-38" y="-3" fill={success}>
            draft reviewed · approved
          </text>
        </g>
        <rect x="20" y="-5.5" width="3" height="4.5" fill={accent}>
          <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
        </rect>
        <g transform="translate(0 18)">
          <circle cx="0" cy="0" r="2.4" fill={offWhite} opacity="0.9" />
          <path d="M -4 6 C -4 3 4 3 4 6 L 4 7 L -4 7 Z" fill={offWhite} opacity="0.75" />
        </g>
      </g>

      <g transform="translate(14 50)">
        <text x="0" y="-2" fontFamily="ui-monospace, monospace" fontSize="3.6" fill={muted}>
          n8n · WORKFLOW
        </text>
        {[
          { x: 0, y: 6, label: "TRG" },
          { x: 18, y: 18, label: "FN" },
          { x: 0, y: 30, label: "DB" },
          { x: 18, y: 42, label: "AI" },
          { x: 0, y: 54, label: "OUT" },
        ].map((n, i) => (
          <g key={i}>
            <rect
              x={n.x}
              y={n.y}
              width="14"
              height="9"
              rx="2"
              fill={navy}
              stroke={accent}
              strokeWidth="0.8"
            />
            <text
              x={n.x + 7}
              y={n.y + 6}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="3"
              fill={accent}
            >
              {n.label}
            </text>
          </g>
        ))}
        <g stroke={accent} strokeWidth="0.7" fill="none" opacity="0.7">
          <path d="M 14 10 L 18 22" />
          <path d="M 18 27 L 14 34" />
          <path d="M 14 34 L 18 46" />
          <path d="M 18 51 L 14 58" />
        </g>
        <g transform="translate(0 70)">
          <rect
            x="0"
            y="0"
            width="42"
            height="14"
            rx="2"
            fill={navy}
            stroke={success}
            strokeWidth="0.9"
          />
          <text x="3" y="5" fontFamily="ui-monospace, monospace" fontSize="3" fill={muted}>
            DRAFT
          </text>
          <path d="M 22 8 L 28 8" stroke={success} strokeWidth="1" />
          <path
            d="M 25 5 L 28 8 L 25 11"
            stroke={success}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="30"
            y="9.5"
            fontFamily="ui-monospace, monospace"
            fontSize="3"
            fill={success}
            fontWeight="bold"
          >
            OK
          </text>
        </g>
      </g>

      <g transform="translate(264 50)">
        <text
          x="0"
          y="-2"
          textAnchor="start"
          fontFamily="ui-monospace, monospace"
          fontSize="3.6"
          fill={muted}
        >
          LiteLLM · ROUTER
        </text>
        <rect
          x="-4"
          y="6"
          width="44"
          height="14"
          rx="2"
          fill={navy}
          stroke={accent}
          strokeWidth="1"
        />
        <text
          x="18"
          y="15"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="3.8"
          fill={accent}
          fontWeight="bold"
        >
          litellm
        </text>
        <g stroke={accent} strokeWidth="0.7" fill="none" opacity="0.7">
          <path d="M 18 20 L 18 34" />
        </g>
        <g transform="translate(5 34)">
          <rect
            x="0"
            y="0"
            width="26"
            height="22"
            rx="2"
            fill={navy}
            stroke={accent}
            strokeWidth="0.8"
          />
          <text
            x="13"
            y="6"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="3"
            fill={accent}
          >
            LOCAL
          </text>
          <text
            x="13"
            y="12"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="3.4"
            fill={offWhite}
            fontWeight="bold"
          >
            ollama
          </text>
          <rect
            x="6"
            y="14"
            width="14"
            height="6"
            rx="1"
            fill={mid}
            stroke={accent}
            strokeWidth="0.5"
          />
          <text
            x="13"
            y="18.5"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="2.6"
            fill={accent}
          >
            GPU
          </text>
        </g>
      </g>

      <g transform="translate(0 148)">
        <g transform="translate(26 -4)">
          <rect
            x="0"
            y="0"
            width="22"
            height="22"
            rx="1.5"
            fill={offWhite}
            opacity="0.92"
            stroke={slate}
            strokeWidth="0.7"
          />
          <path d="M 16 0 L 22 0 L 22 6 Z" fill={navy} opacity="0.85" />
          <line x1="3" y1="9" x2="19" y2="9" stroke={muted} strokeWidth="0.5" />
          <line x1="3" y1="12" x2="19" y2="12" stroke={muted} strokeWidth="0.5" />
          <line x1="3" y1="15" x2="14" y2="15" stroke={muted} strokeWidth="0.5" />
          <text
            x="11"
            y="28"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="2.8"
            fill={muted}
          >
            CONTEXT
          </text>
        </g>
        <path d="M 52 8 L 96 8" stroke={accent} strokeWidth="0.8" />
        <path
          d="M 93 5 L 96 8 L 93 11"
          fill="none"
          stroke={accent}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="74"
          y="5"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="2.6"
          fill={muted}
        >
          embed
        </text>

        <g transform="translate(100 -2)">
          <ellipse cx="24" cy="2" rx="24" ry="3.8" fill={mid} stroke={accent} strokeWidth="0.9" />
          <path
            d="M 0 2 L 0 18 C 0 20 11 23 24 23 C 37 23 48 20 48 18 L 48 2"
            fill={navy}
            stroke={accent}
            strokeWidth="0.9"
          />
          <ellipse
            cx="24"
            cy="2"
            rx="24"
            ry="3.8"
            fill="none"
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.6"
          />
          <ellipse
            cx="24"
            cy="9"
            rx="24"
            ry="3"
            fill="none"
            stroke={accent}
            strokeWidth="0.3"
            opacity="0.45"
          />
          <ellipse
            cx="24"
            cy="15"
            rx="24"
            ry="3"
            fill="none"
            stroke={accent}
            strokeWidth="0.3"
            opacity="0.35"
          />
          <text
            x="24"
            y="14"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="4.2"
            fill={accent}
            fontWeight="bold"
          >
            qdrant
          </text>
          <text
            x="24"
            y="30"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="2.8"
            fill={muted}
          >
            VECTOR MEMORY
          </text>
        </g>

        <path d="M 158 8 L 232 8" stroke={success} strokeWidth="0.9" />
        <path
          d="M 229 5 L 232 8 L 229 11"
          fill="none"
          stroke={success}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="195"
          y="5"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="2.8"
          fill={muted}
        >
          retrieve · critic
        </text>

        <g transform="translate(234 -4)">
          <rect
            x="0"
            y="0"
            width="62"
            height="22"
            rx="2"
            fill={success}
            opacity="0.18"
            stroke={success}
            strokeWidth="0.9"
          />
          <path
            d="M 8 11 L 12 15 L 20 7"
            stroke={success}
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="40"
            y="13"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="3.4"
            fill={success}
            fontWeight="bold"
          >
            HUMAN OK
          </text>
          <text
            x="31"
            y="28"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="2.8"
            fill={muted}
          >
            APPROVAL GATE
          </text>
        </g>
      </g>
    </svg>
  );
};
