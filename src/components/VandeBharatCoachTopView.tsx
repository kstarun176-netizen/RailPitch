"use client";

import React from "react";

interface CoachTopViewProps {
  type: "lead" | "coach" | "tail";
  coachNum: string;
  confirmed?: boolean;
}

export function VandeBharatCoachTopView({
  type,
  coachNum,
  confirmed = false,
}: CoachTopViewProps) {
  const saffronMain = confirmed ? "#ea580c" : "#f97316";
  const saffronLight = confirmed ? "#f97316" : "#fb923c";
  const darkGrey = "#1e293b";
  const darkSlate = "#0f172a";

  return (
    <div className={`vb-top-coach-wrapper ${confirmed ? "vb-coach-confirmed" : ""}`}>
      <svg
        viewBox="0 0 52 100"
        className="vb-top-coach-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`saffronGrad-${coachNum}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={saffronMain} />
            <stop offset="25%" stopColor={saffronLight} />
            <stop offset="75%" stopColor={saffronLight} />
            <stop offset="100%" stopColor={saffronMain} />
          </linearGradient>

          <linearGradient id={`roofGrad-${coachNum}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* ── Top Coupler (for intermediate & tail coaches) ── */}
        {type !== "lead" && (
          <g id="top-coupler">
            <rect x="20" y="0" width="12" height="6" rx="1" fill="#090d12" />
            <line x1="22" y1="2" x2="30" y2="2" stroke="#475569" strokeWidth="1" />
            <line x1="22" y1="4" x2="30" y2="4" stroke="#475569" strokeWidth="1" />
          </g>
        )}

        {/* ── Coach Main Body ── */}
        {type === "lead" ? (
          /* Aerodynamic Lead Nose Cone */
          <path
            d="M 26,4 C 36,4 46,14 46,30 L 46,94 C 46,96 44,98 42,98 L 10,98 C 8,98 6,96 6,94 L 6,30 C 6,14 16,4 26,4 Z"
            fill={`url(#saffronGrad-${coachNum})`}
            stroke={confirmed ? "#c2410c" : "#9a3412"}
            strokeWidth="1.2"
          />
        ) : type === "tail" ? (
          /* Streamlined Tail End */
          <path
            d="M 10,2 L 42,2 C 44,2 46,4 46,6 L 46,70 C 46,86 36,96 26,96 C 16,96 6,86 6,70 L 6,6 C 6,4 8,2 10,2 Z"
            fill={`url(#saffronGrad-${coachNum})`}
            stroke={confirmed ? "#c2410c" : "#9a3412"}
            strokeWidth="1.2"
          />
        ) : (
          /* Standard Intermediate Coach */
          <rect
            x="6"
            y="2"
            width="40"
            height="96"
            rx="4"
            fill={`url(#saffronGrad-${coachNum})`}
            stroke={confirmed ? "#c2410c" : "#9a3412"}
            strokeWidth="1.2"
          />
        )}

        {/* ── Dark Side Edge Bands (Vande Bharat Livery Accent) ── */}
        <line x1="9" y1="8" x2="9" y2="92" stroke={darkGrey} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="43" y1="8" x2="43" y2="92" stroke={darkGrey} strokeWidth="1.8" strokeLinecap="round" />

        {/* ── Lead Cab Aerodynamic Windshield ── */}
        {type === "lead" && (
          <g id="lead-windshield">
            <path
              d="M 26,8 C 32,8 39,15 39,24 L 13,24 C 13,15 20,8 26,8 Z"
              fill={darkSlate}
              stroke="#000000"
              strokeWidth="0.8"
            />
            {/* Front Headlights */}
            <circle cx="16" cy="11" r="1.5" fill="#fef08a" />
            <circle cx="36" cy="11" r="1.5" fill="#fef08a" />
            {/* Indian Flag Decal */}
            <rect x="22" y="16" width="8" height="1.6" fill="#ff9933" />
            <rect x="22" y="17.6" width="8" height="1.6" fill="#ffffff" />
            <rect x="22" y="19.2" width="8" height="1.6" fill="#138808" />
          </g>
        )}

        {/* ── Tail Coach Red Lights ── */}
        {type === "tail" && (
          <g id="tail-lights">
            <circle cx="16" cy="89" r="1.8" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            <circle cx="36" cy="89" r="1.8" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
          </g>
        )}

        {/* ── Roof AC Pod Unit ── */}
        <rect
          x="15"
          y={type === "lead" ? 38 : 28}
          width="22"
          height="42"
          rx="2"
          fill={`url(#roofGrad-${coachNum})`}
          stroke="#475569"
          strokeWidth="0.8"
        />
        {/* AC Ventilation Grilles */}
        <line x1="18" y1={type === "lead" ? 44 : 34} x2="34" y2={type === "lead" ? 44 : 34} stroke="#334155" strokeWidth="0.8" />
        <line x1="18" y1={type === "lead" ? 49 : 39} x2="34" y2={type === "lead" ? 49 : 39} stroke="#334155" strokeWidth="0.8" />
        <line x1="18" y1={type === "lead" ? 69 : 59} x2="34" y2={type === "lead" ? 69 : 59} stroke="#334155" strokeWidth="0.8" />

        {/* ── Coach Number Badge Pill ── */}
        <rect
          x="18"
          y={type === "lead" ? 54 : 44}
          width="16"
          height="10"
          rx="2"
          fill="#0f172a"
        />
        <text
          x="26"
          y={type === "lead" ? 61.5 : 51.5}
          fill="#f8fafc"
          fontSize="6.5"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="0.4"
        >
          {coachNum}
        </text>

        {/* ── Bottom Coupler (for lead & intermediate coaches) ── */}
        {type !== "tail" && (
          <g id="bottom-coupler">
            <rect x="20" y="94" width="12" height="6" rx="1" fill="#090d12" />
            <line x1="22" y1="96" x2="30" y2="96" stroke="#475569" strokeWidth="1" />
            <line x1="22" y1="98" x2="30" y2="98" stroke="#475569" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
}
