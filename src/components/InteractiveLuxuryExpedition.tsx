"use client";

import React, { useState } from "react";

type ZoneId = "pitch-pods" | "dining-car" | "scenic-lounge" | "route-map";

interface ZoneData {
  id: ZoneId;
  name: string;
  shortName: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  headline: string;
  tagline: string;
  tooltipContent: string;
  boardroomVsRail: {
    boardroom: string;
    rail: string;
  };
  features: string[];
  specs: { label: string; value: string }[];
  sceneryHighlight: string;
}

const ZONES: Record<ZoneId, ZoneData> = {
  "pitch-pods": {
    id: "pitch-pods",
    name: "The Pitch Pods (Screen Place)",
    shortName: "1:1 Pitch Pods",
    badge: "HIGH-CONVICTION 1-ON-1s",
    badgeBg: "#fff0eb",
    badgeColor: "#ea580c",
    headline: "Curated 1-on-1 Pitch Zones",
    tagline: "Private acoustic pods built for high-signal founder–investor chemistry.",
    tooltipContent:
      "Curated 1-on-1 Pitch Zones. High-signal conversations with verified investors, completely free from digital distractions.",
    boardroomVsRail: {
      boardroom: "Rushed 3-minute stage pitch under fluorescent lights with 200 distracting phones.",
      rail: "25-minute unhurried private deep-dive as the coastal scenery glides past.",
    },
    features: [
      "Acoustic soundproof partitions for confidential term sheet discussions",
      "Integrated dual wireless presentation displays for pitch decks & live product demos",
      "Ergonomic executive leather recliners with noise-dampening cabin design",
      "Curator-matched seating paired strictly by stage, thesis & cheque-fit",
    ],
    specs: [
      { label: "Session Length", value: "25 Mins Private" },
      { label: "Capacity", value: "2–4 Seats / Pod" },
      { label: "Format", value: "Screen & Deep-Dive" },
    ],
    sceneryHighlight: "Crossing the majestic Ulhas River & Sahyadri mountain foothills",
  },
  "dining-car": {
    id: "dining-car",
    name: "The Dining Car (Dine Place)",
    shortName: "Coastal Dining Car",
    badge: "CULINARY NETWORKING",
    badgeBg: "#fef3c7",
    badgeColor: "#d97706",
    headline: "Coastal Culinary Experience",
    tagline: "Break bread and build authentic trust over freshly curated Konkan cuisine.",
    tooltipContent:
      "Coastal Culinary Experience. Break bread and build trust over authentic regional cuisine as the Konkan coast rolls by.",
    boardroomVsRail: {
      boardroom: "Lukewarm catered box lunches standing awkwardly in a crowded hallway.",
      rail: "Multi-course coastal dining service crossing the dramatic Panval Viaduct.",
    },
    features: [
      "Authentic coastal Malvani & Goan culinary menu prepared fresh onboard",
      "Spacious mahogany dining booths designed for 4-person mentor breakout circles",
      "Artisan chai, cold brews, and seasonal Konkan kokum refreshments",
      "Natural conversation flow that builds enduring founder–investor rapport",
    ],
    specs: [
      { label: "Dining Service", value: "Multi-Course Coastal" },
      { label: "Breakout Format", value: "4-Founder Table" },
      { label: "Passage", value: "Panval Viaduct" },
    ],
    sceneryHighlight: "Sweeping views over Panval River Gorge & Ratnagiri mango orchards",
  },
  "scenic-lounge": {
    id: "scenic-lounge",
    name: "The Scenic Lounge (Networking View)",
    shortName: "Panoramic Scenic Lounge",
    badge: "PANORAMIC NETWORKING",
    badgeBg: "#ecfdf5",
    badgeColor: "#059669",
    headline: "Panoramic Networking & Open Deck",
    tagline: "Close term sheets while taking in the breathtaking landscapes of Incredible India.",
    tooltipContent:
      "Panoramic Networking. Close term sheets while taking in the breathtaking landscapes of Incredible India.",
    boardroomVsRail: {
      boardroom: "Staring at a blank wall projector in a windowless hotel basement.",
      rail: "Golden-hour sunset mixer overlooking the Arabian Sea and Goan palm groves.",
    },
    features: [
      "Floor-to-ceiling panoramic glass observation bays with 180° coastal vistas",
      "Curved plush modular lounge seating for spontaneous deal circles",
      "Barista-curated espresso bar and sundowner mocktail salon",
      "Informal term sheet celebration space as the train approaches Goa",
    ],
    specs: [
      { label: "Atmosphere", value: "Golden Hour Mixer" },
      { label: "Vista Angle", value: "180° Panoramic" },
      { label: "Arrival Hub", value: "Goa Terminus" },
    ],
    sceneryHighlight: "Sunset reflection across the Mandovi & Zuari coastal estuaries",
  },
  "route-map": {
    id: "route-map",
    name: "Konkan Coastal Corridor (Mumbai → Goa)",
    shortName: "Konkan Route Map",
    badge: "585 KM EXPEDITION",
    badgeBg: "#e0f2fe",
    badgeColor: "#0284c7",
    headline: "The Konkan Coast Expedition Corridor",
    tagline: "A 585 km engineering marvel through 91 tunnels, 2,000 bridges, and lush Western Ghats.",
    tooltipContent:
      "585 KM Konkan Railway Passage. Mumbai CSMT to Madgaon Goa—turning travel time into high-conviction deal momentum.",
    boardroomVsRail: {
      boardroom: "Commuting through city traffic just to sit in another generic meeting room.",
      rail: "Traversing world-famous railway bridges, waterfalls, and tropical coastal headlands.",
    },
    features: [
      "Mumbai CSMT flag-off (08:10 AM) to Goa waterfront arrival (06:45 PM)",
      "Engineered for deep uninterrupted focus away from everyday notifications",
      "Synchronized milestone pacing matched to each phase of the venture conversation",
      "Seamless transition from train boardroom to destination sunset villa reception",
    ],
    specs: [
      { label: "Total Distance", value: "585 KM Track" },
      { label: "Journey Time", value: "10 Hours Paced" },
      { label: "Stops", value: "4 Key Milestones" },
    ],
    sceneryHighlight: "Western Ghats UNESCO Biosphere & Arabian Sea coastal shoreline",
  },
};

const STOPS = [
  { id: "csmt", name: "Mumbai CSMT", time: "08:10 AM", km: "000 KM", zone: "pitch-pods", cx: 80, cy: 50 },
  { id: "panvel", name: "Panvel Jcn", time: "09:05 AM", km: "068 KM", zone: "pitch-pods", cx: 145, cy: 130 },
  { id: "ratnagiri", name: "Ratnagiri", time: "01:30 PM", km: "360 KM", zone: "dining-car", cx: 105, cy: 260 },
  { id: "madgaon", name: "Goa (Madgaon)", time: "06:45 PM", km: "585 KM", zone: "scenic-lounge", cx: 175, cy: 390 },
];

export function InteractiveLuxuryExpedition() {
  const [activeZone, setActiveZone] = useState<ZoneId>("pitch-pods");
  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);

  const currentZone = ZONES[hoveredZone || activeZone];

  // SVG curved railway path
  const railwayPath = "M 80,50 C 110,85 138,105 145,130 C 160,175 120,225 105,260 C 88,305 155,355 175,390";

  return (
    <section className="luxury-expedition-section" id="journey">
      {/* ── 1. Unified Hero Headline & Minimal Copy ───────────────────────── */}
      <div className="luxury-expedition-header">
        <span className="kicker">
          <b>✦</b> THE LUXURY OF MOVEMENT · BEYOND THE FOUR WALLS
        </span>
        <h2 className="luxury-main-title">
          Beyond the <em>Boardroom.</em>
        </h2>
        <p className="luxury-main-subtitle">
          Connect with the brightest Indian brains while exploring Incredible India. Experience the luxury of Indian Railways—where panoramic coastal views, authentic dining, and high-conviction pitches replace traditional four walls.
        </p>
      </div>

      {/* ── Zone Navigation Tabs ──────────────────────────────────────────── */}
      <div className="luxury-zone-tabs" role="tablist">
        {(["pitch-pods", "dining-car", "scenic-lounge", "route-map"] as ZoneId[]).map((zid) => {
          const z = ZONES[zid];
          const isSelected = activeZone === zid;
          return (
            <button
              key={zid}
              role="tab"
              aria-selected={isSelected}
              className={`luxury-tab-btn ${isSelected ? "active" : ""}`}
              onClick={() => setActiveZone(zid)}
              onMouseEnter={() => setHoveredZone(zid)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <span className="tab-icon">
                {zid === "pitch-pods" && "🎯"}
                {zid === "dining-car" && "🍽️"}
                {zid === "scenic-lounge" && "🌅"}
                {zid === "route-map" && "🗺️"}
              </span>
              <span className="tab-label">{z.shortName}</span>
              {isSelected && <span className="tab-indicator" />}
            </button>
          );
        })}
      </div>

      {/* ── 2. Interactive Coach & Coastal Corridor Canvas ────────────────── */}
      <div className="luxury-showcase-grid">
        {/* Left / Main: Interactive Vande Bharat Luxury Coach Architectural Interior */}
        <div className="luxury-coach-card">
          <div className="luxury-card-topbar">
            <div className="flex items-center gap-2">
              <span className="coach-live-dot" />
              <strong className="text-xs tracking-wider uppercase text-[#102720]">
                Vande Bharat Luxury Coach · Cutaway Blueprint
              </strong>
            </div>
            <span className="text-[11px] font-bold text-[#0f6b61]">
              Hover or tap zones to explore ↗
            </span>
          </div>

          {/* Detailed Interactive SVG of Train Coach Interior */}
          <div className="luxury-coach-svg-container">
            <svg
              viewBox="0 0 780 230"
              className="luxury-coach-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Saffron Gradient for Livery */}
                <linearGradient id="vbSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="40%" stopColor="#f97316" />
                  <stop offset="70%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>

                {/* Dark Trim Gradient */}
                <linearGradient id="vbDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Zone Glow Filters */}
                <filter id="zoneGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Pitch Pod Tech Glow */}
                <linearGradient id="pitchGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff0eb" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ffe4dc" stopOpacity="0.85" />
                </linearGradient>

                {/* Dining Warm Glow */}
                <linearGradient id="diningGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#fde68a" stopOpacity="0.85" />
                </linearGradient>

                {/* Lounge Ocean Vista Glow */}
                <linearGradient id="loungeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* ── Coach Outer Body Outline & Shadow ────────────────────── */}
              <rect x="10" y="16" width="760" height="198" rx="20" fill="#0c1813" opacity="0.08" />
              <rect
                x="8"
                y="14"
                width="764"
                height="202"
                rx="18"
                fill="#ffffff"
                stroke="#1e293b"
                strokeWidth="2.5"
              />

              {/* Vande Bharat Saffron Roof Ribbon (Top & Bottom Accent Bands) */}
              <path d="M 12,18 L 768,18 L 768,28 L 12,28 Z" fill="url(#vbSaffron)" />
              <path d="M 12,202 L 768,202 L 768,212 L 12,212 Z" fill="url(#vbSaffron)" />

              {/* Coach Window Bands (Exterior Top-Down Profile) */}
              <line x1="20" y1="34" x2="760" y2="34" stroke="#0f172a" strokeWidth="3" strokeDasharray="24 6" />
              <line x1="20" y1="196" x2="760" y2="196" stroke="#0f172a" strokeWidth="3" strokeDasharray="24 6" />

              {/* Central Aisle Carpet Runner */}
              <rect x="20" y="106" width="740" height="18" fill="#e2e8f0" rx="2" />
              <line x1="20" y1="115" x2="760" y2="115" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6 6" />

              {/* ── ZONE 1: THE PITCH PODS (Screen Place - Left Section: x=24 to 260) ── */}
              <g
                className={`coach-interactive-zone ${activeZone === "pitch-pods" || hoveredZone === "pitch-pods" ? "active-zone" : ""}`}
                onClick={() => setActiveZone("pitch-pods")}
                onMouseEnter={() => setHoveredZone("pitch-pods")}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Zone Background Highlight */}
                <rect
                  x="22"
                  y="38"
                  width="234"
                  height="154"
                  rx="10"
                  fill={activeZone === "pitch-pods" || hoveredZone === "pitch-pods" ? "url(#pitchGlow)" : "#f8fafc"}
                  stroke={activeZone === "pitch-pods" || hoveredZone === "pitch-pods" ? "#ea580c" : "#e2e8f0"}
                  strokeWidth={activeZone === "pitch-pods" || hoveredZone === "pitch-pods" ? "2" : "1"}
                  style={{ transition: "all 0.25s ease" }}
                />

                {/* Zone Label Badge */}
                <rect x="32" y="44" width="108" height="18" rx="4" fill="#ea580c" />
                <text x="86" y="56.5" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                  🎯 PITCH PODS · 1:1s
                </text>

                {/* Pod 1 (Top Side) */}
                <rect x="32" y="68" width="98" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                {/* Recliner Seats facing each other */}
                <rect x="36" y="73" width="18" height="24" rx="3" fill="#1e293b" />
                <rect x="108" y="73" width="18" height="24" rx="3" fill="#0f6b61" />
                {/* Center Pitch Table */}
                <rect x="58" y="76" width="46" height="18" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
                {/* OLED Display Screen (Glowing Saffron) */}
                <rect x="66" y="80" width="30" height="10" rx="1.5" fill="#ea580c" />
                <text x="81" y="87.5" fill="#ffffff" fontSize="5.5" fontWeight="800" textAnchor="middle">
                  DECK OLED
                </text>

                {/* Pod 2 (Bottom Side) */}
                <rect x="32" y="128" width="98" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="36" y="133" width="18" height="24" rx="3" fill="#0f6b61" />
                <rect x="108" y="133" width="18" height="24" rx="3" fill="#1e293b" />
                <rect x="58" y="136" width="46" height="18" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="66" y="140" width="30" height="10" rx="1.5" fill="#ea580c" />
                <text x="81" y="147.5" fill="#ffffff" fontSize="5.5" fontWeight="800" textAnchor="middle">
                  DECK OLED
                </text>

                {/* Pod 3 (Right sub-pod) */}
                <rect x="142" y="68" width="104" height="94" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="148" y="75" width="22" height="30" rx="4" fill="#1e293b" />
                <rect x="218" y="75" width="22" height="30" rx="4" fill="#0f6b61" />
                <rect x="174" y="80" width="40" height="20" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
                {/* Wall Presentation Monitor */}
                <rect x="156" y="136" width="76" height="18" rx="3" fill="#0f172a" />
                <text x="194" y="148" fill="#38bdf8" fontSize="7" fontWeight="900" textAnchor="middle">
                  🖥️ LIVE PITCH CONSOLE
                </text>

                {/* Floating Interactive Trigger Dot */}
                <circle cx="140" cy="115" r="9" fill="#ea580c" className="zone-pulse-beacon" />
                <text x="140" y="118" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">1</text>
              </g>

              {/* Zone Partition Separator Line */}
              <line x1="262" y1="38" x2="262" y2="192" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* ── ZONE 2: THE DINING CAR (Dine Place - Middle Section: x=268 to 516) ── */}
              <g
                className={`coach-interactive-zone ${activeZone === "dining-car" || hoveredZone === "dining-car" ? "active-zone" : ""}`}
                onClick={() => setActiveZone("dining-car")}
                onMouseEnter={() => setHoveredZone("dining-car")}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Zone Background Highlight */}
                <rect
                  x="268"
                  y="38"
                  width="244"
                  height="154"
                  rx="10"
                  fill={activeZone === "dining-car" || hoveredZone === "dining-car" ? "url(#diningGlow)" : "#f8fafc"}
                  stroke={activeZone === "dining-car" || hoveredZone === "dining-car" ? "#d97706" : "#e2e8f0"}
                  strokeWidth={activeZone === "dining-car" || hoveredZone === "dining-car" ? "2" : "1"}
                  style={{ transition: "all 0.25s ease" }}
                />

                {/* Zone Label Badge */}
                <rect x="278" y="44" width="124" height="18" rx="4" fill="#d97706" />
                <text x="340" y="56.5" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                  🍽️ COASTAL DINING TABLE
                </text>

                {/* Dining Table 1 (Top) */}
                <rect x="278" y="68" width="104" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="282" y="73" width="18" height="24" rx="3" fill="#b45309" />
                <rect x="360" y="73" width="18" height="24" rx="3" fill="#b45309" />
                <rect x="304" y="74" width="52" height="22" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
                {/* Culinary Plates & Glasses */}
                <circle cx="316" cy="85" r="4" fill="#d97706" />
                <circle cx="344" cy="85" r="4" fill="#d97706" />
                <circle cx="330" cy="85" r="2.5" fill="#f59e0b" />

                {/* Dining Table 2 (Bottom) */}
                <rect x="278" y="128" width="104" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="282" y="133" width="18" height="24" rx="3" fill="#b45309" />
                <rect x="360" y="133" width="18" height="24" rx="3" fill="#b45309" />
                <rect x="304" y="134" width="52" height="22" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
                <circle cx="316" cy="145" r="4" fill="#d97706" />
                <circle cx="344" cy="145" r="4" fill="#d97706" />
                <circle cx="330" cy="145" r="2.5" fill="#f59e0b" />

                {/* Gourmet Chef Bar & Beverage Counter (Right Side) */}
                <rect x="394" y="68" width="110" height="94" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="402" y="75" width="94" height="28" rx="3" fill="#78350f" />
                <text x="449" y="92" fill="#fde68a" fontSize="7.5" fontWeight="900" textAnchor="middle">
                  ☕ ARTISAN COFFEE & BAR
                </text>
                {/* Mentor Breakout Banquettes */}
                <rect x="402" y="112" width="44" height="42" rx="4" fill="#b45309" />
                <rect x="452" y="112" width="44" height="42" rx="4" fill="#b45309" />
                <text x="449" y="140" fill="#ffffff" fontSize="6.5" fontWeight="800" textAnchor="middle">
                  TABLE
                </text>

                {/* Floating Interactive Trigger Dot */}
                <circle cx="390" cy="115" r="9" fill="#d97706" className="zone-pulse-beacon" />
                <text x="390" y="118" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">2</text>
              </g>

              {/* Zone Partition Separator Line */}
              <line x1="518" y1="38" x2="518" y2="192" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* ── ZONE 3: THE SCENIC LOUNGE (Networking View - Right Section: x=524 to 768) ── */}
              <g
                className={`coach-interactive-zone ${activeZone === "scenic-lounge" || hoveredZone === "scenic-lounge" ? "active-zone" : ""}`}
                onClick={() => setActiveZone("scenic-lounge")}
                onMouseEnter={() => setHoveredZone("scenic-lounge")}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Zone Background Highlight */}
                <rect
                  x="524"
                  y="38"
                  width="240"
                  height="154"
                  rx="10"
                  fill={activeZone === "scenic-lounge" || hoveredZone === "scenic-lounge" ? "url(#loungeGlow)" : "#f8fafc"}
                  stroke={activeZone === "scenic-lounge" || hoveredZone === "scenic-lounge" ? "#059669" : "#e2e8f0"}
                  strokeWidth={activeZone === "scenic-lounge" || hoveredZone === "scenic-lounge" ? "2" : "1"}
                  style={{ transition: "all 0.25s ease" }}
                />

                {/* Zone Label Badge */}
                <rect x="534" y="44" width="136" height="18" rx="4" fill="#059669" />
                <text x="602" y="56.5" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                  🌅 PANORAMIC SCENIC LOUNGE
                </text>

                {/* Curved Panoramic Observation Sofas */}
                <path
                  d="M 536,75 C 570,75 580,95 580,115 C 580,135 570,155 536,155 L 536,135 C 555,135 560,125 560,115 C 560,105 555,95 536,95 Z"
                  fill="#065f46"
                />
                {/* Coffee Table in center of curve */}
                <circle cx="550" cy="115" r="10" fill="#f0fdf4" stroke="#059669" strokeWidth="1" />
                <circle cx="550" cy="115" r="4" fill="#059669" />

                {/* 180° Floor-to-Ceiling Vista Bay */}
                <rect x="596" y="68" width="158" height="94" rx="8" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
                {/* Coastal Horizon graphic inside window */}
                <path d="M 598,110 Q 640,95 680,112 Q 720,125 752,108 L 752,160 L 598,160 Z" fill="#cbf3e4" />
                {/* Sunset Sun */}
                <circle cx="675" cy="98" r="14" fill="#fcd34d" />
                <text x="675" y="145" fill="#047857" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">
                  ARABIAN SEA SUNSET VISTA
                </text>

                {/* Standing Cocktail Networking Tables */}
                <circle cx="616" cy="85" r="7" fill="#0f172a" />
                <circle cx="734" cy="85" r="7" fill="#0f172a" />

                {/* Floating Interactive Trigger Dot */}
                <circle cx="640" cy="115" r="9" fill="#059669" className="zone-pulse-beacon" />
                <text x="640" y="118" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">3</text>
              </g>
            </svg>
          </div>

          {/* Bottom Coach Legend */}
          <div className="luxury-coach-legend">
            <div className="legend-pill" onClick={() => setActiveZone("pitch-pods")}>
              <span className="dot bg-[#ea580c]" />
              <b>Zone 1:</b> Pitch Pods (Screen Place)
            </div>
            <div className="legend-pill" onClick={() => setActiveZone("dining-car")}>
              <span className="dot bg-[#d97706]" />
              <b>Zone 2:</b> Dining Car (Dine Place)
            </div>
            <div className="legend-pill" onClick={() => setActiveZone("scenic-lounge")}>
              <span className="dot bg-[#059669]" />
              <b>Zone 3:</b> Scenic Lounge (Networking View)
            </div>
          </div>
        </div>

        {/* Right / Side Panel: Dynamic Experience Card & Synchronized Coastal Route Map */}
        <div className="luxury-experience-panel">
          {activeZone === "route-map" ? (
            /* ── Integrated Coastal Route Map View ── */
            <div className="luxury-map-integrated-card">
              <div className="map-card-header">
                <div>
                  <span className="badge-pill bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
                    585 KM EXPEDITION ROUTE
                  </span>
                  <h3 className="text-lg font-black text-[#102720] mt-1.5 mb-0">
                    Konkan Coastline Track
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#0f6b61]">
                  Mumbai ➔ Goa
                </span>
              </div>

              <div className="map-svg-wrap">
                <svg viewBox="0 0 250 440" className="map-integrated-svg">
                  <defs>
                    <linearGradient id="mapSea" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="mapPulseBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Sea Coastline */}
                  <rect width="250" height="440" fill="#f8fafc" />
                  <path d="M 0,0 L 70,0 Q 110,60 120,120 Q 150,190 90,260 Q 60,320 90,390 Q 120,420 140,440 L 0,440 Z" fill="url(#mapSea)" />
                  <text x="18" y="210" fill="#0284c7" opacity="0.4" fontSize="9" fontWeight="900" letterSpacing="2" transform="rotate(-90 18,210)">
                    ARABIAN SEA
                  </text>

                  {/* Railway Track */}
                  <path d={railwayPath} fill="none" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" strokeDasharray="1.5 4" />
                  <path id="int-route-path" d={railwayPath} fill="none" stroke="#0f6b61" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={railwayPath} fill="none" stroke="#2fd9ab" strokeWidth="1.2" strokeDasharray="8 120" className="konkan-pulse-track" />

                  {/* Station Stops */}
                  {STOPS.map((st, idx) => (
                    <g key={st.id} className="map-station-node" onClick={() => setActiveZone(st.zone as ZoneId)}>
                      <circle cx={st.cx} cy={st.cy} r="6.5" fill="#ffffff" stroke="#102720" strokeWidth="2" />
                      <circle cx={st.cx} cy={st.cy} r="3" fill="#0f6b61" />
                      <rect x={st.cx + 10} y={st.cy - 10} width="88" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                      <text x={st.cx + 14} y={st.cy + 3} fill="#102720" fontSize="8" fontWeight="800">
                        {idx + 1}. {st.name}
                      </text>
                    </g>
                  ))}

                  {/* Moving Beacon */}
                  <g>
                    <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#int-route-path" />
                    </animateMotion>
                    <circle cx="0" cy="0" r="10" fill="rgba(47, 217, 171, 0.3)" />
                    <circle cx="0" cy="0" r="5" fill="#0f6b61" stroke="#2fd9ab" strokeWidth="1.5" />
                    <polygon points="1,-3 14,-6 14,6 1,3" fill="url(#mapPulseBeam)" opacity="0.8" />
                  </g>
                </svg>
              </div>

              <div className="map-card-footer">
                <span className="text-[11px] font-bold text-[#556e62]">
                  ✦ Paced across 10 hours for meaningful deal chemistry
                </span>
                <button
                  className="text-xs font-black text-[#0f6b61] hover:underline"
                  onClick={() => setActiveZone("pitch-pods")}
                >
                  Explore Coach Interior →
                </button>
              </div>
            </div>
          ) : (
            /* ── Dynamic Zone Glassmorphism Detail Card ── */
            <div className="luxury-zone-detail-card">
              {/* Card Header */}
              <div className="detail-card-head">
                <span
                  className="badge-pill"
                  style={{
                    background: currentZone.badgeBg,
                    color: currentZone.badgeColor,
                    borderColor: `${currentZone.badgeColor}40`,
                  }}
                >
                  {currentZone.badge}
                </span>
                <h3 className="detail-title">{currentZone.headline}</h3>
                <p className="detail-tagline">{currentZone.tagline}</p>
              </div>

              {/* Tooltip Content Callout */}
              <div className="detail-tooltip-box">
                <span className="text-base mr-1.5">💡</span>
                <p className="m-0 text-xs font-semibold text-[#1e3a2f] leading-relaxed">
                  {currentZone.tooltipContent}
                </p>
              </div>

              {/* Boardroom vs RailPitch Comparison Box */}
              <div className="detail-comparison-box">
                <div className="comp-item comp-boardroom">
                  <span className="comp-label">❌ Traditional 4-Walled Boardroom</span>
                  <p>{currentZone.boardroomVsRail.boardroom}</p>
                </div>
                <div className="comp-item comp-rail">
                  <span className="comp-label">✅ RailPitch Luxury Experience</span>
                  <p>{currentZone.boardroomVsRail.rail}</p>
                </div>
              </div>

              {/* Zone Features Checklist */}
              <div className="detail-features-list">
                <h4 className="text-xs font-extrabold uppercase text-[#102720] tracking-wider mb-2">
                  Luxury Experience Highlights
                </h4>
                <ul>
                  {currentZone.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="check-icon">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs & Scenery Bar */}
              <div className="detail-specs-bar">
                {currentZone.specs.map((sp, idx) => (
                  <div key={idx} className="spec-item">
                    <small>{sp.label}</small>
                    <b>{sp.value}</b>
                  </div>
                ))}
              </div>

              <div className="scenery-callout">
                <span className="scenery-icon">🏞️</span>
                <div>
                  <small>SCENIC BACKDROP</small>
                  <strong>{currentZone.sceneryHighlight}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
