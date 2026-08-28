"use client";

import React, { useState } from "react";

type ExperienceId = "pitch" | "dine" | "lounge";

const EXPERIENCES: {
  id: ExperienceId;
  title: string;
  themeColor: string;
  glowColor: string;
}[] = [
  { id: "pitch",  title: "1:1 Pitch Pods",         themeColor: "#ea580c", glowColor: "rgba(234,88,12,0.12)"  },
  { id: "dine",   title: "Coastal Dining Car",      themeColor: "#d97706", glowColor: "rgba(217,119,6,0.12)" },
  { id: "lounge", title: "Panoramic Scenic Lounge", themeColor: "#059669", glowColor: "rgba(5,150,105,0.12)" },
];

const STATIONS = [
  { name: "Mumbai CSMT", time: "08:10 AM", detail: "Flag-off & Onboarding", active: true },
  { name: "Panvel", time: "09:05 AM", detail: "1:1 Pitch Pods", active: false },
  { name: "Ratnagiri", time: "01:30 PM", detail: "Coastal Dining", active: false },
  { name: "Goa (Madgaon)", time: "06:45 PM", detail: "Sunset Mixer & Deals", active: true },
];

export function InteractiveLuxuryExpedition() {
  const [active, setActive] = useState<ExperienceId>("pitch");

  return (
    <section className="luxury-expedition-section" id="journey">
      {/* ── Section Header ─────────────────────────────────────────────── */}
      <div className="luxury-expedition-header">
        <h2 className="luxury-main-title">
          Beyond the <em>Boardroom.</em>
        </h2>
        <p className="luxury-main-subtitle">
          Where panoramic coastal views, authentic dining, and high-conviction pitches replace four walls.
        </p>
      </div>

      {/* ── 3 Visual Experience Cards (Minimal Architectural Aesthetic) ─ */}
      <div className="luxury-cards-showcase-grid">
        {EXPERIENCES.map((exp) => {
          const isActive = active === exp.id;
          return (
            <div
              key={exp.id}
              className={`visual-exp-card${isActive ? " selected-card" : ""}`}
              onClick={() => setActive(exp.id)}
              onMouseEnter={() => setActive(exp.id)}
              style={{
                borderColor: isActive ? exp.themeColor : "#dbe4de",
                boxShadow: isActive ? `0 18px 42px ${exp.glowColor}` : "0 4px 16px rgba(16,39,32,0.04)",
              }}
            >
              <div className="exp-illustration-wrapper">
                {exp.id === "pitch"  && <PitchScene />}
                {exp.id === "dine"   && <DineScene />}
                {exp.id === "lounge" && <LoungeScene />}
              </div>
              <div className="exp-label-row" style={{ color: exp.themeColor }}>
                <span className="exp-title">{exp.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Clean Realistic Railway Track Timeline ─────────────────────── */}
      <div className="luxury-timeline-track-card">
        <div className="track-stations-grid">
          {STATIONS.map((st, idx) => (
            <div key={idx} className={`track-station-item ${st.active ? "station-active" : ""}`}>
              <div className="station-meta-box">
                <span className="station-time-pill">{st.time}</span>
                <strong className="station-city-name">{st.name}</strong>
                <small className="station-subtext">{st.detail}</small>
              </div>
              <div className="station-track-pin">
                <span className="pin-dot" />
                <span className="pin-stem" />
              </div>
            </div>
          ))}
        </div>

        {/* Continuous Realistic Railway Track Vector */}
        <div className="realistic-track-container">
          <svg
            viewBox="0 0 1000 36"
            className="realistic-track-svg"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="realRailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="30%" stopColor="#f8fafc" />
                <stop offset="70%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              <linearGradient id="realWoodSleeper" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b48348" />
                <stop offset="35%" stopColor="#8d5b28" />
                <stop offset="85%" stopColor="#623a13" />
                <stop offset="100%" stopColor="#452709" />
              </linearGradient>
            </defs>

            <rect x="0" y="2" width="1000" height="32" rx="4" fill="#edf2ee" />
            <line x1="0" y1="18" x2="1000" y2="18" stroke="#d5ded8" strokeWidth="1" strokeDasharray="3 6" />

            {Array.from({ length: 44 }).map((_, i) => {
              const x = 8 + i * 22.5;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y="3"
                    width="11"
                    height="30"
                    rx="1.5"
                    fill="url(#realWoodSleeper)"
                    stroke="#3b2108"
                    strokeWidth="0.5"
                  />
                  <rect x={x + 1.5} y="8" width="8" height="3" fill="#64748b" rx="0.5" />
                  <rect x={x + 1.5} y="25" width="8" height="3" fill="#64748b" rx="0.5" />
                </g>
              );
            })}

            <rect x="0" y="7" width="1000" height="5.5" rx="1.5" fill="url(#realRailGrad)" />
            <line x1="0" y1="7.8" x2="1000" y2="7.8" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />

            <rect x="0" y="23.5" width="1000" height="5.5" rx="1.5" fill="url(#realRailGrad)" />
            <line x1="0" y1="24.3" x2="1000" y2="24.3" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Clean Architectural Style Vector Illustrations (Matching Reference)       */
/* ─────────────────────────────────────────────────────────────────────────── */

/* 🎯 Scene 1: 1:1 Pitch Pods (High-Back Acoustic Chairs & Desktop Screen) */
function PitchScene() {
  return (
    <svg viewBox="0 0 400 240" className="exp-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="podScreenGrad" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="podBackdrop" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>

      {/* Clean White/Airy Background */}
      <rect width="400" height="240" fill="#ffffff" />

      {/* Subtle Train Window Arch in Background */}
      <path
        d="M 120,195 L 120,90 Q 200,45 280,90 L 280,195 Z"
        fill="#f1f5f9"
        opacity="0.75"
      />
      {/* Distant soft hill silhouette in window */}
      <path d="M 120,165 Q 160,135 200,150 Q 240,130 280,155 L 280,195 L 120,195 Z" fill="#e2e8f0" opacity="0.6" />

      {/* Floor Shadow Line */}
      <ellipse cx="200" cy="202" rx="170" ry="4" fill="#cbd5e1" opacity="0.5" />

      {/* ── Left High-Back Acoustic Pod Chair ── */}
      {/* Outer Shell (High-Back Acoustic Wing) */}
      <path
        d="M 52,192 L 52,70 Q 52,58 64,58 L 78,58 Q 90,58 90,70 L 90,192 Z"
        fill="#b0c4de"
      />
      {/* Inner Dark Acoustic Padding */}
      <path
        d="M 68,190 L 68,68 Q 68,62 76,62 L 98,62 Q 106,62 106,68 L 106,190 Z"
        fill="#2c3e50"
      />
      {/* Plush Light Seat Cushion & Armrest */}
      <path
        d="M 68,145 L 86,145 L 86,118 Q 86,112 94,112 L 108,112 L 108,162 L 68,162 Z"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <rect x="65" y="152" width="46" height="14" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
      {/* Chair Wooden Legs */}
      <line x1="68" y1="166" x2="56" y2="198" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <line x1="102" y1="166" x2="114" y2="198" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />

      {/* ── Right High-Back Acoustic Pod Chair ── */}
      {/* Outer Shell */}
      <path
        d="M 348,192 L 348,70 Q 348,58 336,58 L 322,58 Q 310,58 310,70 L 310,192 Z"
        fill="#b0c4de"
      />
      {/* Inner Dark Acoustic Padding */}
      <path
        d="M 332,190 L 332,68 Q 332,62 324,62 L 302,62 Q 294,62 294,68 L 294,190 Z"
        fill="#2c3e50"
      />
      {/* Plush Light Seat Cushion & Armrest */}
      <path
        d="M 332,145 L 314,145 L 314,118 Q 314,112 306,112 L 292,112 L 292,162 L 332,162 Z"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <rect x="289" y="152" width="46" height="14" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
      {/* Chair Wooden Legs */}
      <line x1="332" y1="166" x2="344" y2="198" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <line x1="298" y1="166" x2="286" y2="198" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />

      {/* ── Center Presentation Desktop Display ── */}
      {/* Monitor Shadow */}
      <ellipse cx="200" cy="182" rx="16" ry="2" fill="#94a3b8" opacity="0.4" />
      {/* Stand Base */}
      <path d="M 188,180 L 212,180 L 208,172 L 192,172 Z" fill="#94a3b8" />
      <rect x="198" y="140" width="4" height="34" fill="#cbd5e1" />
      {/* Monitor Bezel */}
      <rect
        x="142"
        y="90"
        width="116"
        height="76"
        rx="6"
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Monitor Screen Glass */}
      <rect x="146" y="94" width="108" height="68" rx="4" fill="url(#podScreenGrad)" />
      {/* Glass Diagonal Glare */}
      <polygon points="146,94 195,94 175,162 146,162" fill="#ffffff" opacity="0.5" />
      {/* Mini UI Pitch Line Chart on Screen */}
      <path d="M 160,140 Q 180,132 195,120 T 235,108" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="235" cy="108" r="2.5" fill="#ea580c" />
    </svg>
  );
}

/* 🍽️ Scene 2: Coastal Dining Car (Draped Table, Warm Pendant Lamp, Wine & Glasses) */
function DineScene() {
  return (
    <svg viewBox="0 0 400 240" className="exp-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lampWarmGlow" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#ffedd5" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="clothGrad" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#f5d0b5" />
          <stop offset="60%" stopColor="#e2b191" />
          <stop offset="100%" stopColor="#c89270" />
        </linearGradient>
      </defs>

      {/* Clean White Background */}
      <rect width="400" height="240" fill="#ffffff" />

      {/* Arched Warm Peach / Sunlight Backdrop Arch */}
      <path
        d="M 110,210 L 110,120 A 90,90 0 0 1 290,120 L 290,210 Z"
        fill="#ffedd5"
      />

      {/* Hanging Brass Pendant Lamp & Downward Light Cone */}
      <line x1="200" y1="0" x2="200" y2="46" stroke="#b45309" strokeWidth="1.5" />
      <polygon points="186,46 214,46 222,60 178,60" fill="#d97706" />
      <circle cx="200" cy="60" r="4" fill="#ffffff" />
      {/* Light Cone */}
      <polygon points="178,60 222,60 310,210 90,210" fill="url(#lampWarmGlow)" />

      {/* Floor Shadow */}
      <ellipse cx="200" cy="204" rx="140" ry="5" fill="#e2e8f0" />

      {/* ── Left Dining Chair ── */}
      <rect x="110" y="118" width="50" height="12" rx="2" fill="#78350f" transform="rotate(-6 110 118)" />
      <line x1="114" y1="128" x2="114" y2="198" stroke="#5c2406" strokeWidth="3" strokeLinecap="round" />
      <line x1="148" y1="128" x2="148" y2="198" stroke="#5c2406" strokeWidth="3" strokeLinecap="round" />

      {/* ── Right Dining Chair ── */}
      <rect x="250" y="128" width="56" height="14" rx="3" fill="#5c2406" />
      <line x1="256" y1="140" x2="252" y2="200" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="294" y1="140" x2="300" y2="200" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
      {/* Chair Backrest */}
      <rect x="250" y="148" width="56" height="8" rx="2" fill="#78350f" />

      {/* ── Draped Dining Table ── */}
      <polygon
        points="130,126 270,126 288,188 274,188 260,192 245,188 230,194 215,188 200,192 185,188 170,194 155,188 140,192 112,188"
        fill="url(#clothGrad)"
        stroke="#b45309"
        strokeWidth="0.8"
      />
      {/* Table Top Surface Highlight */}
      <polygon points="130,126 270,126 264,136 136,136" fill="#fde6d2" />

      {/* Table Dinnerware Setup */}
      {/* Left Plate & Glass */}
      <ellipse cx="160" cy="132" rx="14" ry="4" fill="#ffffff" stroke="#c2410c" strokeWidth="0.8" />
      <ellipse cx="160" cy="132" rx="8" ry="2" fill="#ffedd5" />
      {/* Wine Glass Left */}
      <path d="M 174,124 Q 170,116 174,112 L 180,112 Q 184,116 180,124 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.6" />
      <line x1="177" y1="124" x2="177" y2="132" stroke="#c2410c" strokeWidth="0.8" />

      {/* Center Wine Bottle & Candle */}
      <rect x="196" y="104" width="8" height="24" rx="1.5" fill="#92400e" stroke="#451a03" strokeWidth="0.6" />
      <rect x="198" y="98" width="4" height="7" fill="#78350f" />
      {/* Candle */}
      <line x1="210" y1="106" x2="210" y2="128" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="210" cy="103" r="2.5" fill="#f59e0b" />

      {/* Right Plate & Glass */}
      <ellipse cx="240" cy="132" rx="14" ry="4" fill="#ffffff" stroke="#c2410c" strokeWidth="0.8" />
      <ellipse cx="240" cy="132" rx="8" ry="2" fill="#ffedd5" />
      {/* Wine Glass Right */}
      <path d="M 224,124 Q 220,116 224,112 L 230,112 Q 234,116 230,124 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.6" />
      <line x1="227" y1="124" x2="227" y2="132" stroke="#c2410c" strokeWidth="0.8" />
    </svg>
  );
}

/* 🌅 Scene 3: Panoramic Scenic Lounge (Sunset Window, Ocean Horizon & Chaise Lounge) */
function LoungeScene() {
  return (
    <svg viewBox="0 0 400 240" className="exp-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunsetSkyArch" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="30%" stopColor="#fed7aa" />
          <stop offset="65%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id="sunDisc" cx="50%" cy="100%" r="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fde047" />
        </radialGradient>
      </defs>

      {/* Clean White Background */}
      <rect width="400" height="240" fill="#ffffff" />

      {/* Semi-Circular Panoramic Window Frame overlooking Sunset */}
      <path
        d="M 80,180 L 80,120 A 120,120 0 0 1 320,120 L 320,180 Z"
        fill="url(#sunsetSkyArch)"
      />

      {/* Glowing Sunset Sun on Horizon */}
      <circle cx="250" cy="120" r="28" fill="url(#sunDisc)" />
      <circle cx="250" cy="120" r="38" fill="#fef08a" opacity="0.3" />

      {/* Ocean Water Horizon */}
      <rect x="80" y="120" width="240" height="60" fill="#0284c7" opacity="0.85" />
      {/* Sun Golden Water Reflections */}
      <ellipse cx="250" cy="126" rx="32" ry="2" fill="#ffffff" opacity="0.6" />
      <ellipse cx="250" cy="132" rx="26" ry="1.5" fill="#fef08a" opacity="0.5" />
      <ellipse cx="250" cy="138" rx="20" ry="1.2" fill="#fef08a" opacity="0.4" />
      <ellipse cx="250" cy="144" rx="14" ry="1" fill="#fef08a" opacity="0.3" />

      {/* Balcony / Window Lower Railing */}
      <line x1="80" y1="150" x2="320" y2="150" stroke="#0f172a" strokeWidth="2" opacity="0.7" />
      <line x1="200" y1="150" x2="200" y2="180" stroke="#0f172a" strokeWidth="1.5" opacity="0.7" />
      <line x1="280" y1="150" x2="280" y2="180" stroke="#0f172a" strokeWidth="1.5" opacity="0.7" />

      {/* Floor Shadow for Lounger */}
      <ellipse cx="190" cy="204" rx="100" ry="6" fill="#cbd5e1" opacity="0.7" />

      {/* ── Modern Curved Teakwood Chaise Lounge Recliner ── */}
      {/* Wooden Underframe Legs */}
      <line x1="126" y1="175" x2="114" y2="202" stroke="#5c2406" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="210" y1="172" x2="216" y2="202" stroke="#5c2406" strokeWidth="4" strokeLinecap="round" />
      <line x1="280" y1="172" x2="292" y2="198" stroke="#5c2406" strokeWidth="4" strokeLinecap="round" />

      {/* Curved Wooden Frame Backbone */}
      <path
        d="M 104,136 Q 110,165 140,172 Q 190,178 220,160 Q 250,154 286,172"
        fill="none"
        stroke="#78350f"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Plush Light Cream Contoured Cushion Mattress */}
      <path
        d="M 106,134 Q 112,162 142,168 Q 192,174 222,156 Q 252,150 286,168"
        fill="none"
        stroke="#fef3c7"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Cushion Edge Highlight */}
      <path
        d="M 107,133 Q 113,161 143,167 Q 193,173 223,155 Q 253,149 285,167"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
