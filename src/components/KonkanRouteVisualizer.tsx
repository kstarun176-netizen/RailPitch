"use client";

import React, { useState } from "react";

interface StopInfo {
  id: string;
  name: string;
  stationCode: string;
  time: string;
  km: string;
  stageName: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  headline: string;
  description: string;
  format: string;
  carriage: string;
  tags: string[];
  cx: number;
  cy: number;
  elevation: string;
  scenery: string;
}

const STOPS: StopInfo[] = [
  {
    id: "csmt",
    name: "Mumbai CSMT",
    stationCode: "CSMT",
    time: "08:10 AM",
    km: "000 KM",
    stageName: "FLAG-OFF & COFFEE KEYNOTE",
    badge: "DEPARTURE",
    badgeColor: "#0f6b61",
    badgeBg: "#e4f6ef",
    headline: "Flag-Off & Opening Keynote",
    description:
      "Heritage concourse departure, opening coffee keynote circle and cohort introductions.",
    format: "Cohort Gathering",
    carriage: "Executive Lounge",
    tags: [],
    cx: 88,
    cy: 62,
    elevation: "14m ASL",
    scenery: "Mumbai Harbour & Skyline",
  },
  {
    id: "panvel",
    name: "Panvel Junction",
    stationCode: "PNVL",
    time: "09:05 AM",
    km: "068 KM",
    stageName: "CURATED 1-ON-1 PITCHES",
    badge: "MATCHING ROUND 01",
    badgeColor: "#e8775f",
    badgeBg: "#fff0eb",
    headline: "Curated 1-on-1 Pitches (Round 1)",
    description:
      "Pre-matched 25-minute private speed pitches between founders and verified investors.",
    format: "Speed Pitching",
    carriage: "Innovation Pods",
    tags: [],
    cx: 172,
    cy: 168,
    elevation: "28m ASL",
    scenery: "Sahyadri Foothills & Rivers",
  },
  {
    id: "ratnagiri",
    name: "Ratnagiri Station",
    stationCode: "RN",
    time: "01:30 PM",
    km: "360 KM",
    stageName: "COASTAL TABLE & FOUNDER STUDIO",
    badge: "LUNCH & MENTORSHIP",
    badgeColor: "#d97706",
    badgeBg: "#fef3c7",
    headline: "Konkan Lunch & Deep-Dive Discussions",
    description:
      "Authentic coastal dining service, mentor breakout circles and founder studio reviews.",
    format: "Coastal Table",
    carriage: "Dining Lounge",
    tags: [],
    cx: 118,
    cy: 338,
    elevation: "125m ASL",
    scenery: "Panval Viaduct & Mango Orchards",
  },
  {
    id: "madgaon",
    name: "Madgaon / Goa",
    stationCode: "MAO",
    time: "06:45 PM",
    km: "585 KM",
    stageName: "DESTINATION MIXER & DEALS",
    badge: "ARRIVAL & MIXER",
    badgeColor: "#059669",
    badgeBg: "#ecfdf5",
    headline: "Sunset Mixer & Deal Commitments",
    description:
      "Arrival in tropical Goa, term sheet commitment rooms and destination networking reception.",
    format: "Destination Reception",
    carriage: "Villa Reception",
    tags: [],
    cx: 206,
    cy: 508,
    elevation: "18m ASL",
    scenery: "Zuari River & Mandovi Coastline",
  },
];

export function KonkanRouteVisualizer() {
  const [activeStopId, setActiveStopId] = useState<string>("csmt");
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);

  const activeStop = STOPS.find((s) => s.id === (hoveredStopId || activeStopId)) || STOPS[0];

  // SVG Smooth Curved Path for Konkan Railway
  const railwayPath = "M 88,62 C 122,102 160,132 172,168 C 188,218 138,284 118,338 C 96,398 178,460 206,508";

  return (
    <div className="konkan-visualizer-root">
      {/* Visualizer Header Controls */}
      <div className="konkan-top-bar">
        <div className="flex items-center gap-3">
          <span className="konkan-live-pill">
            <span className="konkan-pulse-dot" />
            LIVE EXPEDITION CORRIDOR
          </span>
          <span className="text-xs font-bold text-[#557165]">
            MUMBAI (CSMT) → GOA (MADGAON) • 585 KM
          </span>
        </div>
        <div className="konkan-speed-stat">
          <span className="text-[10px] text-[#71857c] uppercase font-bold tracking-wider">Average Speed</span>
          <strong className="text-xs text-[#102720] font-mono font-black ml-1.5">92 KM/H · EXPRESS</strong>
        </div>
      </div>

      {/* Main Grid: Coastal Map Canvas on Left, Interactive Timeline Cards on Right */}
      <div className="konkan-main-grid">
        {/* ── Left Column: Stylized Coastal SVG Map ────────────────────────── */}
        <div className="konkan-map-card">
          <div className="konkan-map-header">
            <div>
              <small className="konkan-map-kicker">WESTERN RAILWAY PASSAGE</small>
              <h3 className="konkan-map-title">Konkan Coast Route Map</h3>
            </div>
            <span className="konkan-map-compass">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f6b61" strokeWidth="2">
                <polygon points="12 2 15 9 12 7 9 9 12 2" fill="#0f6b61" />
                <polygon points="12 22 9 15 12 17 15 15 12 22" fill="#d3e4dc" stroke="#5a8b79" />
                <circle cx="12" cy="12" r="1.5" fill="#102720" />
              </svg>
              <b>N</b>
            </span>
          </div>

          <div className="konkan-svg-wrapper">
            <svg
              viewBox="0 0 310 570"
              className="konkan-svg-canvas"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Coastal Sea Gradient */}
                <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c5e3d7" stopOpacity="0.95" />
                  <stop offset="70%" stopColor="#d9ece3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#eaf5ef" stopOpacity="0.3" />
                </linearGradient>

                {/* Land & Ghats Mountain Gradient */}
                <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#eef7f2" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#e1efe7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#cbdcd2" stopOpacity="1" />
                </linearGradient>

                {/* Train Beam Gradient */}
                <linearGradient id="trainBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#2fd9ab" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2fd9ab" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Arabian Sea Background Coastline Body */}
              <rect x="0" y="0" width="310" height="570" fill="#f4f9f6" />
              <path
                d="M 0,0 L 95,0 Q 130,70 145,130 Q 185,200 130,280 Q 90,340 120,420 Q 150,480 180,570 L 0,570 Z"
                fill="url(#seaGrad)"
              />

              {/* Water Contour Waves */}
              <path
                d="M 10,80 Q 40,95 15,140 Q 60,210 25,290 Q 55,370 20,440"
                fill="none"
                stroke="rgba(15,107,97,0.18)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <path
                d="M 25,120 Q 60,150 35,210 Q 75,290 40,380"
                fill="none"
                stroke="rgba(15,107,97,0.14)"
                strokeWidth="1.2"
                strokeDasharray="3 5"
              />

              {/* Western Ghats Mountain Ridges (East of Track) */}
              <g opacity="0.6">
                <path
                  d="M 200,30 Q 235,50 220,90 Q 255,130 240,180 Q 275,240 230,310 Q 260,380 245,440 Q 285,500 260,560"
                  fill="none"
                  stroke="#4b7865"
                  strokeWidth="2"
                  strokeDasharray="2 4"
                />
                <path
                  d="M 230,60 Q 265,90 250,140 Q 285,190 265,260 Q 295,330 270,410 Q 295,470 280,540"
                  fill="none"
                  stroke="#62927e"
                  strokeWidth="1.5"
                  strokeDasharray="1 5"
                />
              </g>

              {/* Geographical Region Watermarks */}
              <text x="24" y="240" fill="rgba(15, 107, 97, 0.35)" fontSize="10" fontWeight="900" letterSpacing="3" transform="rotate(-90 24,240)">
                ARABIAN SEA
              </text>
              <text x="245" y="270" fill="rgba(65, 105, 87, 0.4)" fontSize="9" fontWeight="800" letterSpacing="2.5" transform="rotate(90 245,270)">
                WESTERN GHATS (SAHYADRI)
              </text>

              {/* Elevation & Landmark Badges on Map */}
              <g transform="translate(195, 230)" opacity="0.75">
                <rect x="0" y="0" width="70" height="18" rx="3" fill="#102720" />
                <text x="35" y="12" fill="#a8e6cf" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="0.5">
                  SAHYADRI MTNS
                </text>
              </g>
              <g transform="translate(35, 340)" opacity="0.8">
                <rect x="0" y="0" width="68" height="18" rx="3" fill="#ffffff" stroke="#c0dcd1" />
                <text x="34" y="12" fill="#0f6b61" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="0.5">
                  KONKAN COAST
                </text>
              </g>

              {/* ── Railway Track System ─────────────────────────────────── */}
              {/* 1. Track Shadow Layer */}
              <path
                d={railwayPath}
                fill="none"
                stroke="#102720"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.12"
              />

              {/* 2. Track Base Sleeper Ties (Repeating Bed) */}
              <path
                d={railwayPath}
                fill="none"
                stroke="#2a473b"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeDasharray="1.5 4"
              />

              {/* 3. Primary Steel Rail Track Line */}
              <path
                id="konkan-route-path"
                d={railwayPath}
                fill="none"
                stroke="#0f6b61"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* 4. Glowing Electric Pulse Rail */}
              <path
                d={railwayPath}
                fill="none"
                stroke="#2fd9ab"
                strokeWidth="1.2"
                strokeDasharray="12 180"
                className="konkan-pulse-track"
              />

              {/* ── Station Stop Nodes ───────────────────────────────────── */}
              {STOPS.map((stop, idx) => {
                const isSelected = activeStop.id === stop.id;
                return (
                  <g
                    key={stop.id}
                    className="konkan-node-group"
                    onClick={() => setActiveStopId(stop.id)}
                    onMouseEnter={() => setHoveredStopId(stop.id)}
                    onMouseLeave={() => setHoveredStopId(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Animated Outer Concentric Rings on Active Station */}
                    {isSelected && (
                      <>
                        <circle
                          cx={stop.cx}
                          cy={stop.cy}
                          r="22"
                          fill="none"
                          stroke={stop.badgeColor}
                          strokeWidth="1"
                          opacity="0.4"
                          className="konkan-station-ring-ping"
                        />
                        <circle
                          cx={stop.cx}
                          cy={stop.cy}
                          r="15"
                          fill={stop.badgeColor}
                          opacity="0.18"
                          className="konkan-station-glow"
                        />
                      </>
                    )}

                    {/* Outer Solid Ring */}
                    <circle
                      cx={stop.cx}
                      cy={stop.cy}
                      r={isSelected ? "9" : "7.5"}
                      fill="#ffffff"
                      stroke={isSelected ? stop.badgeColor : "#102720"}
                      strokeWidth={isSelected ? "3" : "2"}
                      style={{ transition: "all 0.25s ease" }}
                    />

                    {/* Inner Core Station Dot */}
                    <circle
                      cx={stop.cx}
                      cy={stop.cy}
                      r={isSelected ? "4.5" : "3"}
                      fill={isSelected ? stop.badgeColor : "#0f6b61"}
                      style={{ transition: "all 0.25s ease" }}
                    />

                    {/* Station Tag Floating Label Card */}
                    <g
                      transform={`translate(${stop.cx + (stop.cx > 150 ? -120 : 16)}, ${stop.cy - 14})`}
                      className="konkan-station-badge"
                    >
                      <rect
                        x="0"
                        y="0"
                        width="104"
                        height="30"
                        rx="5"
                        fill={isSelected ? "#102720" : "#ffffff"}
                        stroke={isSelected ? stop.badgeColor : "#c5d7cd"}
                        strokeWidth={isSelected ? "1.8" : "1"}
                        style={{
                          filter: isSelected ? "drop-shadow(0 4px 10px rgba(16,39,32,0.3))" : "drop-shadow(0 2px 5px rgba(0,0,0,0.06))",
                          transition: "all 0.25s ease",
                        }}
                      />
                      {/* Station Stop Number Indicator */}
                      <circle
                        cx="12"
                        cy="15"
                        r="6"
                        fill={isSelected ? stop.badgeColor : "#eaf4ee"}
                      />
                      <text
                        x="12"
                        y="18"
                        fill={isSelected ? "#ffffff" : "#0f6b61"}
                        fontSize="8"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {idx + 1}
                      </text>
                      {/* Station Name */}
                      <text
                        x="24"
                        y="13"
                        fill={isSelected ? "#ffffff" : "#102720"}
                        fontSize="9.5"
                        fontWeight="800"
                        letterSpacing="-0.2"
                      >
                        {stop.name.split(" ")[0]}
                      </text>
                      {/* Time & KM */}
                      <text
                        x="24"
                        y="23"
                        fill={isSelected ? "#2fd9ab" : "#688075"}
                        fontSize="7.5"
                        fontWeight="700"
                      >
                        {stop.time} · {stop.km}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* ── Animated Travelling Train / Beacon ────────────────── */}
              <g>
                <animateMotion
                  dur="11s"
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href="#konkan-route-path" />
                </animateMotion>

                {/* Train Glow Halo */}
                <circle cx="0" cy="0" r="14" fill="rgba(47, 217, 171, 0.25)" />
                <circle cx="0" cy="0" r="7" fill="#0f6b61" stroke="#2fd9ab" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />

                {/* Forward Headlight Beam */}
                <polygon
                  points="2,-4 26,-9 26,9 2,4"
                  fill="url(#trainBeam)"
                  opacity="0.8"
                />
              </g>
            </svg>
          </div>

          <div className="konkan-map-footer">
            <span className="text-[10px] text-[#5d7369] font-bold">
              ✦ Click any station node on the map to inspect session details
            </span>
          </div>
        </div>

        {/* ── Right Column: Clean Milestone Itinerary Cards ────────── */}
        <div className="konkan-cards-column">
          <div className="konkan-timeline-track">
            {STOPS.map((stop, idx) => {
              const isSelected = activeStop.id === stop.id;
              return (
                <div
                  key={stop.id}
                  onClick={() => setActiveStopId(stop.id)}
                  className={`konkan-stop-card ${isSelected ? "active-card" : ""}`}
                  style={{
                    borderLeftColor: isSelected ? stop.badgeColor : "#d2ded7",
                  }}
                >
                  {/* Card Top Row: Station + Time + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="konkan-card-num"
                        style={{
                          background: isSelected ? stop.badgeColor : "#e8f2ec",
                          color: isSelected ? "#ffffff" : "#102720",
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#102720] leading-tight">
                          {stop.name}
                        </h4>
                        <span className="text-[11px] font-bold text-[#60796e]">
                          {stop.time} • {stop.km}
                        </span>
                      </div>
                    </div>

                    <span
                      className="konkan-stage-badge"
                      style={{
                        background: stop.badgeBg,
                        color: stop.badgeColor,
                        border: `1px solid ${stop.badgeColor}33`,
                      }}
                    >
                      {stop.badge}
                    </span>
                  </div>

                  {/* Headline & Clean Concise Summary */}
                  <h5 className="text-xs font-black text-[#102720] mt-1.5 mb-0.5">
                    {stop.headline}
                  </h5>
                  <p className="text-xs text-[#52695f] leading-relaxed m-0">
                    {stop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
