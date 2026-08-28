"use client";

import React from "react";

export function VandeBharatTrain() {
  return (
    <svg
      viewBox="0 0 1120 76"
      className="vande-bharat-svg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Saffron / Orange Body Gradient */}
        <linearGradient id="vbSaffron" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff8a3d" />
          <stop offset="35%" stopColor="#f36c14" />
          <stop offset="85%" stopColor="#e25705" />
          <stop offset="100%" stopColor="#c24600" />
        </linearGradient>

        {/* Dark Charcoal / Grey Band Gradient */}
        <linearGradient id="vbDarkGrey" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#303841" />
          <stop offset="40%" stopColor="#222830" />
          <stop offset="100%" stopColor="#14181d" />
        </linearGradient>

        {/* Tinted Continuous Window Glass Ribbon */}
        <linearGradient id="vbGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1b2530" />
          <stop offset="40%" stopColor="#0d141b" />
          <stop offset="70%" stopColor="#080c10" />
          <stop offset="100%" stopColor="#030507" />
        </linearGradient>

        {/* Glass Reflection Flare */}
        <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#60a5fa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Roof AC Shroud Gradient */}
        <linearGradient id="vbRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Headlamp Beam / Glow Filter */}
        <filter id="headlampGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ═════════════════════════════════════════════════════════════════════
          COACH 1: LEAD DRIVING CAB (AERODYNAMIC NOSE) — X: 0 to 280
          ═════════════════════════════════════════════════════════════════════ */}
      <g id="coach-1-lead">
        {/* Roof AC Shrouds */}
        <path d="M 125,8 L 132,4 L 210,4 L 217,8 Z" fill="url(#vbRoof)" stroke="#64748b" strokeWidth="0.8" />
        <line x1="145" y1="4" x2="145" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="165" y1="4" x2="165" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="185" y1="4" x2="185" y2="8" stroke="#64748b" strokeWidth="0.8" />

        <path d="M 230,8 L 235,5 L 270,5 L 275,8 Z" fill="url(#vbRoof)" stroke="#64748b" strokeWidth="0.8" />

        {/* Coach 1 Main Body Shell */}
        {/* Aerodynamic bullet nose profile */}
        <path
          d="M 280,8 L 105,8 C 75,8 48,15 32,28 C 18,39 6,52 0,55 L 0,59 C 6,61 18,61 38,61 L 280,61 Z"
          fill="url(#vbSaffron)"
        />

        {/* Lower Charcoal Grey Band with Vande Bharat Angle Cut */}
        <path
          d="M 0,55 L 18,39 C 28,30 46,24 68,23 L 95,23 L 95,61 L 38,61 C 18,61 6,61 0,59 Z"
          fill="url(#vbDarkGrey)"
        />
        <path
          d="M 95,30 L 155,30 L 175,23 L 280,23 L 280,61 L 95,61 Z"
          fill="url(#vbDarkGrey)"
        />

        {/* Saffron Angled Chevron Stripe into Grey Band */}
        <path
          d="M 95,23 L 170,23 L 150,30 L 95,30 Z"
          fill="url(#vbSaffron)"
        />
        <path
          d="M 195,44 L 280,44 L 280,48 L 185,48 Z"
          fill="url(#vbSaffron)"
        />

        {/* Aerodynamic Driver Windshield (Raked Black Glass) */}
        <path
          d="M 52,14 C 40,20 28,30 18,40 L 32,40 C 45,30 58,22 75,18 Z"
          fill="#0a0e13"
          stroke="#000000"
          strokeWidth="1"
        />
        {/* Windshield Reflection */}
        <path
          d="M 46,16 C 36,22 26,31 22,37 L 27,37 C 38,28 48,22 62,19 Z"
          fill="url(#glassReflection)"
        />

        {/* Driver Cab Side Window */}
        <rect x="78" y="16" width="14" height="11" rx="2" fill="#0f172a" stroke="#000" strokeWidth="0.8" />
        <line x1="85" y1="16" x2="85" y2="27" stroke="#475569" strokeWidth="0.8" />

        {/* Driver Door */}
        <rect x="96" y="15" width="16" height="43" rx="1.5" fill="none" stroke="#2b323b" strokeWidth="0.9" />
        <rect x="100" y="18" width="8" height="10" rx="1" fill="#0f172a" stroke="#000" strokeWidth="0.6" />
        <circle cx="98" cy="38" r="0.9" fill="#94a3b8" />

        {/* Indian Tricolor Flag Decal 🇮🇳 */}
        <g transform="translate(118, 22)">
          <rect x="0" y="0" width="12" height="2.4" fill="#ff9933" />
          <rect x="0" y="2.4" width="12" height="2.4" fill="#ffffff" />
          <rect x="0" y="4.8" width="12" height="2.4" fill="#138808" />
          <circle cx="6" cy="3.6" r="1" fill="#000080" />
        </g>

        {/* "VANDE BHARAT" / "RAILPITCH" Typography Outline */}
        <text x="117" y="36" fill="#f8fafc" fontSize="4.5" fontWeight="900" letterSpacing="0.8" opacity="0.85">
          VANDE BHARAT
        </text>

        {/* Passenger Door at Rear of Coach 1 */}
        <rect x="260" y="13" width="16" height="47" rx="1.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <rect x="264" y="17" width="8" height="16" rx="1" fill="#0b1118" stroke="#000" strokeWidth="0.6" />

        {/* Continuous Passenger Window Ribbon */}
        <rect x="136" y="25" width="118" height="17" rx="2" fill="url(#vbGlass)" stroke="#000000" strokeWidth="0.8" />
        {/* Window Dividers */}
        {[155, 174, 193, 212, 231].map((wx) => (
          <line key={wx} x1={wx} y1="25" x2={wx} y2="42" stroke="#2d3748" strokeWidth="1" />
        ))}
        {/* Glass Glare Line */}
        <line x1="138" y1="27" x2="252" y2="27" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

        {/* Dual LED Headlamps */}
        <ellipse cx="6" cy="53" rx="3.5" ry="2.2" fill="#fffbeb" filter="url(#headlampGlow)" />
        <ellipse cx="6" cy="53" rx="1.8" ry="1.2" fill="#ffffff" />

        {/* Cowcatcher / Lower Front Pilot Wedge */}
        <path d="M 0,59 L 8,66 L 36,66 L 38,61 Z" fill="#c24600" stroke="#000000" strokeWidth="0.8" />

        {/* Underframe Equipment Skirt */}
        <rect x="95" y="60" width="80" height="4.5" fill="#1e293b" />
        <rect x="180" y="60" width="70" height="4.5" fill="#0f172a" />

        {/* Bogie 1 (Front Wheelset) */}
        <g transform="translate(42, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>

        {/* Bogie 2 (Rear Wheelset) */}
        <g transform="translate(205, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>
      </g>

      {/* ── Gangway / Vestibule Coupler 1-2 (X: 280 to 290) ──────────────── */}
      <g id="gangway-1">
        <rect x="280" y="11" width="10" height="49" fill="#14181d" stroke="#090b0e" strokeWidth="0.8" />
        <line x1="283" y1="12" x2="283" y2="59" stroke="#334155" strokeWidth="0.9" />
        <line x1="287" y1="12" x2="287" y2="59" stroke="#334155" strokeWidth="0.9" />
      </g>

      {/* ═════════════════════════════════════════════════════════════════════
          COACH 2: INTERMEDIATE EXECUTIVE CHAIR CAR — X: 290 to 555
          ═════════════════════════════════════════════════════════════════════ */}
      <g id="coach-2">
        {/* Roof AC Unit */}
        <path d="M 360,8 L 366,4 L 485,4 L 491,8 Z" fill="url(#vbRoof)" stroke="#64748b" strokeWidth="0.8" />
        <line x1="390" y1="4" x2="390" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="425" y1="4" x2="425" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="460" y1="4" x2="460" y2="8" stroke="#64748b" strokeWidth="0.8" />

        {/* Coach 2 Main Body Shell */}
        <rect x="290" y="8" width="265" height="53" rx="2" fill="url(#vbSaffron)" />

        {/* Lower Charcoal Grey Band */}
        <path d="M 290,23 L 555,23 L 555,61 L 290,61 Z" fill="url(#vbDarkGrey)" />

        {/* Saffron Dynamic Accent Stripes */}
        <path d="M 290,23 L 340,23 L 325,30 L 290,30 Z" fill="url(#vbSaffron)" />
        <path d="M 330,44 L 520,44 L 520,48 L 320,48 Z" fill="url(#vbSaffron)" />
        <path d="M 505,30 L 555,30 L 555,23 L 520,23 Z" fill="url(#vbSaffron)" />

        {/* Boarding Doors (Left and Right) */}
        <rect x="294" y="13" width="16" height="47" rx="1.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <rect x="298" y="17" width="8" height="16" rx="1" fill="#0b1118" stroke="#000" strokeWidth="0.6" />

        <rect x="535" y="13" width="16" height="47" rx="1.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <rect x="539" y="17" width="8" height="16" rx="1" fill="#0b1118" stroke="#000" strokeWidth="0.6" />

        {/* Continuous Passenger Window Ribbon */}
        <rect x="316" y="25" width="212" height="17" rx="2" fill="url(#vbGlass)" stroke="#000000" strokeWidth="0.8" />
        {/* Window Dividers */}
        {[337, 358, 379, 400, 421, 442, 463, 484, 505].map((wx) => (
          <line key={wx} x1={wx} y1="25" x2={wx} y2="42" stroke="#2d3748" strokeWidth="1" />
        ))}
        {/* Glass Glare Line */}
        <line x1="318" y1="27" x2="526" y2="27" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

        {/* Coach Underframe Boxes */}
        <rect x="345" y="60" width="70" height="4.5" fill="#1e293b" />
        <rect x="430" y="60" width="70" height="4.5" fill="#0f172a" />

        {/* Bogie 1 */}
        <g transform="translate(305, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>

        {/* Bogie 2 */}
        <g transform="translate(485, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>
      </g>

      {/* ── Gangway / Vestibule Coupler 2-3 (X: 555 to 565) ──────────────── */}
      <g id="gangway-2">
        <rect x="555" y="11" width="10" height="49" fill="#14181d" stroke="#090b0e" strokeWidth="0.8" />
        <line x1="558" y1="12" x2="558" y2="59" stroke="#334155" strokeWidth="0.9" />
        <line x1="562" y1="12" x2="562" y2="59" stroke="#334155" strokeWidth="0.9" />
      </g>

      {/* ═════════════════════════════════════════════════════════════════════
          COACH 3: INTERMEDIATE STANDARD CHAIR CAR — X: 565 to 830
          ═════════════════════════════════════════════════════════════════════ */}
      <g id="coach-3">
        {/* Roof AC Unit */}
        <path d="M 635,8 L 641,4 L 760,4 L 766,8 Z" fill="url(#vbRoof)" stroke="#64748b" strokeWidth="0.8" />
        <line x1="665" y1="4" x2="665" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="700" y1="4" x2="700" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="735" y1="4" x2="735" y2="8" stroke="#64748b" strokeWidth="0.8" />

        {/* Coach 3 Main Body Shell */}
        <rect x="565" y="8" width="265" height="53" rx="2" fill="url(#vbSaffron)" />

        {/* Lower Charcoal Grey Band */}
        <path d="M 565,23 L 830,23 L 830,61 L 565,61 Z" fill="url(#vbDarkGrey)" />

        {/* Saffron Dynamic Accent Stripes */}
        <path d="M 565,23 L 615,23 L 600,30 L 565,30 Z" fill="url(#vbSaffron)" />
        <path d="M 605,44 L 795,44 L 795,48 L 595,48 Z" fill="url(#vbSaffron)" />
        <path d="M 780,30 L 830,30 L 830,23 L 795,23 Z" fill="url(#vbSaffron)" />

        {/* Boarding Doors */}
        <rect x="569" y="13" width="16" height="47" rx="1.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <rect x="573" y="17" width="8" height="16" rx="1" fill="#0b1118" stroke="#000" strokeWidth="0.6" />

        <rect x="810" y="13" width="16" height="47" rx="1.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <rect x="814" y="17" width="8" height="16" rx="1" fill="#0b1118" stroke="#000" strokeWidth="0.6" />

        {/* Continuous Passenger Window Ribbon */}
        <rect x="591" y="25" width="212" height="17" rx="2" fill="url(#vbGlass)" stroke="#000000" strokeWidth="0.8" />
        {/* Window Dividers */}
        {[612, 633, 654, 675, 696, 717, 738, 759, 780].map((wx) => (
          <line key={wx} x1={wx} y1="25" x2={wx} y2="42" stroke="#2d3748" strokeWidth="1" />
        ))}
        {/* Glass Glare Line */}
        <line x1="593" y1="27" x2="801" y2="27" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

        {/* Underframe Equipment */}
        <rect x="620" y="60" width="70" height="4.5" fill="#1e293b" />
        <rect x="705" y="60" width="70" height="4.5" fill="#0f172a" />

        {/* Bogie 1 */}
        <g transform="translate(580, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>

        {/* Bogie 2 */}
        <g transform="translate(760, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>
      </g>

      {/* ── Gangway / Vestibule Coupler 3-4 (X: 830 to 840) ──────────────── */}
      <g id="gangway-3">
        <rect x="830" y="11" width="10" height="49" fill="#14181d" stroke="#090b0e" strokeWidth="0.8" />
        <line x1="833" y1="12" x2="833" y2="59" stroke="#334155" strokeWidth="0.9" />
        <line x1="837" y1="12" x2="837" y2="59" stroke="#334155" strokeWidth="0.9" />
      </g>

      {/* ═════════════════════════════════════════════════════════════════════
          COACH 4: REAR TRAILING COACH — X: 840 to 1115
          ═════════════════════════════════════════════════════════════════════ */}
      <g id="coach-4-tail">
        {/* Roof AC Unit */}
        <path d="M 910,8 L 916,4 L 1035,4 L 1041,8 Z" fill="url(#vbRoof)" stroke="#64748b" strokeWidth="0.8" />
        <line x1="940" y1="4" x2="940" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="975" y1="4" x2="975" y2="8" stroke="#64748b" strokeWidth="0.8" />
        <line x1="1010" y1="4" x2="1010" y2="8" stroke="#64748b" strokeWidth="0.8" />

        {/* Coach 4 Main Body Shell with Rounded Tail Profile */}
        <path
          d="M 840,8 L 1095,8 C 1108,8 1115,15 1115,26 L 1115,59 C 1115,61 1108,61 1095,61 L 840,61 Z"
          fill="url(#vbSaffron)"
        />

        {/* Lower Charcoal Grey Band */}
        <path
          d="M 840,23 L 1095,23 C 1105,23 1112,28 1115,35 L 1115,59 C 1115,61 1108,61 1095,61 L 840,61 Z"
          fill="url(#vbDarkGrey)"
        />

        {/* Saffron Dynamic Accent Stripes */}
        <path d="M 840,23 L 890,23 L 875,30 L 840,30 Z" fill="url(#vbSaffron)" />
        <path d="M 880,44 L 1070,44 L 1070,48 L 870,48 Z" fill="url(#vbSaffron)" />

        {/* Boarding Door */}
        <rect x="844" y="13" width="16" height="47" rx="1.5" fill="none" stroke="#334155" strokeWidth="0.9" />
        <rect x="848" y="17" width="8" height="16" rx="1" fill="#0b1118" stroke="#000" strokeWidth="0.6" />

        {/* Continuous Passenger Window Ribbon */}
        <rect x="866" y="25" width="216" height="17" rx="2" fill="url(#vbGlass)" stroke="#000000" strokeWidth="0.8" />
        {/* Window Dividers */}
        {[887, 908, 929, 950, 971, 992, 1013, 1034, 1055].map((wx) => (
          <line key={wx} x1={wx} y1="25" x2={wx} y2="42" stroke="#2d3748" strokeWidth="1" />
        ))}
        {/* Glass Glare Line */}
        <line x1="868" y1="27" x2="1080" y2="27" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

        {/* Rear Red Marker Light */}
        <circle cx="1111" cy="52" r="2.2" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />

        {/* Underframe Equipment */}
        <rect x="895" y="60" width="70" height="4.5" fill="#1e293b" />
        <rect x="980" y="60" width="70" height="4.5" fill="#0f172a" />

        {/* Bogie 1 */}
        <g transform="translate(855, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>

        {/* Bogie 2 */}
        <g transform="translate(1040, 60)">
          <rect x="0" y="0" width="46" height="5" rx="1" fill="#334155" />
          <circle cx="8" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#94a3b8" />
          <circle cx="38" cy="8" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="38" cy="8" r="2" fill="#94a3b8" />
        </g>
      </g>
    </svg>
  );
}
