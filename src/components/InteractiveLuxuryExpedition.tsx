"use client";

import React, { useState } from "react";

type ZoneId = "pitch-pods" | "dining-car" | "scenic-lounge";

interface ZoneInfo {
  id: ZoneId;
  name: string;
  badge: string;
  badgeColor: string;
  tooltip: string;
  subtitle: string;
}

const ZONES: Record<ZoneId, ZoneInfo> = {
  "pitch-pods": {
    id: "pitch-pods",
    name: "The Pitch Pods (Screen Place)",
    badge: "1:1 PITCH PODS",
    badgeColor: "#ea580c",
    tooltip:
      "Curated 1-on-1 Pitch Zones. High-signal conversations with verified investors, completely free from digital distractions.",
    subtitle: "Private acoustic pods paired strictly by stage, thesis & cheque fit.",
  },
  "dining-car": {
    id: "dining-car",
    name: "The Dining Car (Dine Place)",
    badge: "COASTAL DINING CAR",
    badgeColor: "#d97706",
    tooltip:
      "Coastal Culinary Experience. Break bread and build trust over authentic regional cuisine as the Konkan coast rolls by.",
    subtitle: "Fresh Konkan cuisine served crossing the dramatic Panval Viaduct.",
  },
  "scenic-lounge": {
    id: "scenic-lounge",
    name: "The Scenic Lounge (Networking View)",
    badge: "PANORAMIC SCENIC LOUNGE",
    badgeColor: "#059669",
    tooltip:
      "Panoramic Networking. Close term sheets while taking in the breathtaking landscapes of Incredible India.",
    subtitle: "180° coastal observation deck overlooking the Arabian Sea sunset.",
  },
};

export function InteractiveLuxuryExpedition() {
  const [hoveredZone, setHoveredZone] = useState<ZoneId>("pitch-pods");

  const current = ZONES[hoveredZone];

  return (
    <section className="luxury-expedition-section" id="journey">
      {/* ── Main Heading & Subheadline ──────────────────────────────────── */}
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

      {/* ── Interactive Luxury Coach Canvas ──────────────────────────────── */}
      <div className="luxury-single-canvas-card">
        {/* Top bar with active zone badge */}
        <div className="luxury-canvas-topbar">
          <div className="flex items-center gap-2">
            <span className="coach-live-dot" />
            <strong className="text-xs font-bold uppercase tracking-wider text-[#102720]">
              Vande Bharat Luxury Coach · Interactive Cutaway Blueprint
            </strong>
          </div>
          <span
            className="zone-active-pill"
            style={{
              borderColor: current.badgeColor,
              color: current.badgeColor,
              background: `${current.badgeColor}15`,
            }}
          >
            ● {current.badge}
          </span>
        </div>

        {/* SVG Coach Graphic */}
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

              {/* Zone Highlight Gradients */}
              <linearGradient id="pitchGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff0eb" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffe4dc" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="diningGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="loungeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Coach Outer Body */}
            <rect x="10" y="16" width="760" height="198" rx="20" fill="#0c1813" opacity="0.06" />
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

            {/* Vande Bharat Saffron Roof Accent Strips */}
            <path d="M 12,18 L 768,18 L 768,28 L 12,28 Z" fill="url(#vbSaffron)" />
            <path d="M 12,202 L 768,202 L 768,212 L 12,212 Z" fill="url(#vbSaffron)" />

            {/* Windows profile */}
            <line x1="20" y1="34" x2="760" y2="34" stroke="#0f172a" strokeWidth="3" strokeDasharray="24 6" />
            <line x1="20" y1="196" x2="760" y2="196" stroke="#0f172a" strokeWidth="3" strokeDasharray="24 6" />

            {/* Central Aisle */}
            <rect x="20" y="106" width="740" height="18" fill="#e2e8f0" rx="2" />
            <line x1="20" y1="115" x2="760" y2="115" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6 6" />

            {/* ── ZONE 1: THE PITCH PODS (Screen Place) ────────────────── */}
            <g
              className={`coach-interactive-zone ${hoveredZone === "pitch-pods" ? "active-zone" : ""}`}
              onMouseEnter={() => setHoveredZone("pitch-pods")}
              onClick={() => setHoveredZone("pitch-pods")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="22"
                y="38"
                width="234"
                height="154"
                rx="10"
                fill={hoveredZone === "pitch-pods" ? "url(#pitchGlow)" : "#f8fafc"}
                stroke={hoveredZone === "pitch-pods" ? "#ea580c" : "#e2e8f0"}
                strokeWidth={hoveredZone === "pitch-pods" ? "2.5" : "1"}
                style={{ transition: "all 0.25s ease" }}
              />

              <rect x="32" y="44" width="112" height="18" rx="4" fill="#ea580c" />
              <text x="88" y="56.5" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                🎯 1:1 PITCH PODS
              </text>

              {/* Pod 1 */}
              <rect x="32" y="68" width="98" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="36" y="73" width="18" height="24" rx="3" fill="#1e293b" />
              <rect x="108" y="73" width="18" height="24" rx="3" fill="#0f6b61" />
              <rect x="58" y="76" width="46" height="18" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
              <rect x="66" y="80" width="30" height="10" rx="1.5" fill="#ea580c" />
              <text x="81" y="87.5" fill="#ffffff" fontSize="5.5" fontWeight="800" textAnchor="middle">
                DECK OLED
              </text>

              {/* Pod 2 */}
              <rect x="32" y="128" width="98" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="36" y="133" width="18" height="24" rx="3" fill="#0f6b61" />
              <rect x="108" y="133" width="18" height="24" rx="3" fill="#1e293b" />
              <rect x="58" y="136" width="46" height="18" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
              <rect x="66" y="140" width="30" height="10" rx="1.5" fill="#ea580c" />
              <text x="81" y="147.5" fill="#ffffff" fontSize="5.5" fontWeight="800" textAnchor="middle">
                DECK OLED
              </text>

              {/* Pod 3 */}
              <rect x="142" y="68" width="104" height="94" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="148" y="75" width="22" height="30" rx="4" fill="#1e293b" />
              <rect x="218" y="75" width="22" height="30" rx="4" fill="#0f6b61" />
              <rect x="174" y="80" width="40" height="20" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
              <rect x="156" y="136" width="76" height="18" rx="3" fill="#0f172a" />
              <text x="194" y="148" fill="#38bdf8" fontSize="7" fontWeight="900" textAnchor="middle">
                🖥️ PITCH CONSOLE
              </text>

              <circle cx="140" cy="115" r="9" fill="#ea580c" className="zone-pulse-beacon" />
              <text x="140" y="118" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">1</text>
            </g>

            <line x1="262" y1="38" x2="262" y2="192" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* ── ZONE 2: THE DINING CAR (Dine Place) ──────────────────── */}
            <g
              className={`coach-interactive-zone ${hoveredZone === "dining-car" ? "active-zone" : ""}`}
              onMouseEnter={() => setHoveredZone("dining-car")}
              onClick={() => setHoveredZone("dining-car")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="268"
                y="38"
                width="244"
                height="154"
                rx="10"
                fill={hoveredZone === "dining-car" ? "url(#diningGlow)" : "#f8fafc"}
                stroke={hoveredZone === "dining-car" ? "#d97706" : "#e2e8f0"}
                strokeWidth={hoveredZone === "dining-car" ? "2.5" : "1"}
                style={{ transition: "all 0.25s ease" }}
              />

              <rect x="278" y="44" width="128" height="18" rx="4" fill="#d97706" />
              <text x="342" y="56.5" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                🍽️ COASTAL DINING CAR
              </text>

              {/* Table 1 */}
              <rect x="278" y="68" width="104" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="282" y="73" width="18" height="24" rx="3" fill="#b45309" />
              <rect x="360" y="73" width="18" height="24" rx="3" fill="#b45309" />
              <rect x="304" y="74" width="52" height="22" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
              <circle cx="316" cy="85" r="4" fill="#d97706" />
              <circle cx="344" cy="85" r="4" fill="#d97706" />

              {/* Table 2 */}
              <rect x="278" y="128" width="104" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="282" y="133" width="18" height="24" rx="3" fill="#b45309" />
              <rect x="360" y="133" width="18" height="24" rx="3" fill="#b45309" />
              <rect x="304" y="134" width="52" height="22" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
              <circle cx="316" cy="145" r="4" fill="#d97706" />
              <circle cx="344" cy="145" r="4" fill="#d97706" />

              {/* Counter */}
              <rect x="394" y="68" width="110" height="94" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="402" y="75" width="94" height="28" rx="3" fill="#78350f" />
              <text x="449" y="92" fill="#fde68a" fontSize="7.5" fontWeight="900" textAnchor="middle">
                ☕ REGIONAL CULINARY BAR
              </text>
              <rect x="402" y="112" width="44" height="42" rx="4" fill="#b45309" />
              <rect x="452" y="112" width="44" height="42" rx="4" fill="#b45309" />

              <circle cx="390" cy="115" r="9" fill="#d97706" className="zone-pulse-beacon" />
              <text x="390" y="118" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">2</text>
            </g>

            <line x1="518" y1="38" x2="518" y2="192" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* ── ZONE 3: THE SCENIC LOUNGE (Networking View) ──────────── */}
            <g
              className={`coach-interactive-zone ${hoveredZone === "scenic-lounge" ? "active-zone" : ""}`}
              onMouseEnter={() => setHoveredZone("scenic-lounge")}
              onClick={() => setHoveredZone("scenic-lounge")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="524"
                y="38"
                width="240"
                height="154"
                rx="10"
                fill={hoveredZone === "scenic-lounge" ? "url(#loungeGlow)" : "#f8fafc"}
                stroke={hoveredZone === "scenic-lounge" ? "#059669" : "#e2e8f0"}
                strokeWidth={hoveredZone === "scenic-lounge" ? "2.5" : "1"}
                style={{ transition: "all 0.25s ease" }}
              />

              <rect x="534" y="44" width="140" height="18" rx="4" fill="#059669" />
              <text x="604" y="56.5" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                🌅 PANORAMIC SCENIC LOUNGE
              </text>

              {/* Curved Sofas */}
              <path
                d="M 536,75 C 570,75 580,95 580,115 C 580,135 570,155 536,155 L 536,135 C 555,135 560,125 560,115 C 560,105 555,95 536,95 Z"
                fill="#065f46"
              />
              <circle cx="550" cy="115" r="10" fill="#f0fdf4" stroke="#059669" strokeWidth="1" />

              {/* Vista Window */}
              <rect x="596" y="68" width="158" height="94" rx="8" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
              <path d="M 598,110 Q 640,95 680,112 Q 720,125 752,108 L 752,160 L 598,160 Z" fill="#cbf3e4" />
              <circle cx="675" cy="98" r="14" fill="#fcd34d" />
              <text x="675" y="145" fill="#047857" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">
                ARABIAN SEA SUNSET
              </text>

              <circle cx="616" cy="85" r="7" fill="#0f172a" />
              <circle cx="734" cy="85" r="7" fill="#0f172a" />

              <circle cx="640" cy="115" r="9" fill="#059669" className="zone-pulse-beacon" />
              <text x="640" y="118" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">3</text>
            </g>
          </svg>
        </div>

        {/* ── Clean Floating Experience Tooltip Card ─────────────────────── */}
        <div className="luxury-floating-tooltip">
          <div className="tooltip-icon-badge" style={{ background: current.badgeColor }}>
            {hoveredZone === "pitch-pods" && "🎯"}
            {hoveredZone === "dining-car" && "🍽️"}
            {hoveredZone === "scenic-lounge" && "🌅"}
          </div>
          <div className="tooltip-text-content">
            <h4 style={{ color: current.badgeColor }}>{current.name}</h4>
            <p>{current.tooltip}</p>
          </div>
        </div>

        {/* ── Sleek Konkan Corridor Footer Ribbon ────────────────────────── */}
        <div className="luxury-route-ribbon">
          <div className="ribbon-milestones">
            <div className="ribbon-node">
              <span className="dot active" />
              <b>Mumbai CSMT</b>
              <small>08:10 AM • Flag-off</small>
            </div>
            <span className="ribbon-line" />
            <div className="ribbon-node">
              <span className="dot" />
              <b>Panvel Junction</b>
              <small>09:05 AM • 1:1 Pitches</small>
            </div>
            <span className="ribbon-line" />
            <div className="ribbon-node">
              <span className="dot" />
              <b>Ratnagiri</b>
              <small>01:30 PM • Coastal Table</small>
            </div>
            <span className="ribbon-line" />
            <div className="ribbon-node">
              <span className="dot active" />
              <b>Goa (Madgaon)</b>
              <small>06:45 PM • Sunset Mixer</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
