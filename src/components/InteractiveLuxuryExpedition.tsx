"use client";

import React, { useState } from "react";

type ExperienceId = "pitch" | "dine" | "lounge";

interface ExperienceItem {
  id: ExperienceId;
  title: string;
  tagline: string;
  badge: string;
  themeColor: string;
  glowColor: string;
  icon: string;
  headline: string;
  description: string;
  highlights: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "pitch",
    title: "The Pitch Pods",
    tagline: "Curated 1-on-1 Speed Pitches",
    badge: "SCREEN & FOCUS",
    themeColor: "#ea580c",
    glowColor: "rgba(234, 88, 12, 0.18)",
    icon: "🎯",
    headline: "High-signal conversations without digital noise.",
    description:
      "Private acoustic pods equipped with dual 4K OLED presentation displays. Paired strictly by investment thesis, sector overlap, and cheque size.",
    highlights: [
      "25-min private deep-dive sessions",
      "Wireless deck & live product demo screens",
      "Acoustically insulated privacy cabins",
    ],
  },
  {
    id: "dine",
    title: "Coastal Dining Car",
    tagline: "Authentic Konkan Culinary Table",
    badge: "CULINARY NETWORKING",
    themeColor: "#d97706",
    glowColor: "rgba(217, 119, 6, 0.18)",
    icon: "🍽️",
    headline: "Break bread and build trust over fresh regional cuisine.",
    description:
      "A multi-course coastal dining experience prepared fresh onboard. 4-person banquet tables designed for relaxed mentor breakout circles crossing the Panval Viaduct.",
    highlights: [
      "Freshly prepared coastal Malvani & Goan delicacies",
      "Spacious mahogany 4-person breakout booths",
      "Artisan chai, cold brews & kokum refreshments",
    ],
  },
  {
    id: "lounge",
    title: "Panoramic Scenic Lounge",
    tagline: "180° Ocean Vista Observation Deck",
    badge: "SUNSET MIXER & DEALS",
    themeColor: "#059669",
    glowColor: "rgba(5, 150, 105, 0.18)",
    icon: "🌅",
    headline: "Close term sheets while watching the Arabian Sea sunset.",
    description:
      "Floor-to-ceiling panoramic glass bays looking out at the lush Western Ghats and tropical coastline. Curved plush lounge seating for golden-hour networking.",
    highlights: [
      "180° panoramic glass observation bays",
      "Curved emerald lounge seating & cocktail tables",
      "Golden-hour arrival mixer approaching Goa",
    ],
  },
];

export function InteractiveLuxuryExpedition() {
  const [activeExp, setActiveExp] = useState<ExperienceId>("pitch");

  return (
    <section className="luxury-expedition-section" id="journey">
      {/* ── Main Section Header ────────────────────────────────────────── */}
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

      {/* ── 3 Visual Experience Cards Grid ─────────────────────────────── */}
      <div className="luxury-cards-showcase-grid">
        {EXPERIENCES.map((exp) => {
          const isSelected = activeExp === exp.id;
          return (
            <div
              key={exp.id}
              className={`visual-exp-card ${isSelected ? "selected-card" : ""}`}
              onClick={() => setActiveExp(exp.id)}
              onMouseEnter={() => setActiveExp(exp.id)}
              style={{
                borderColor: isSelected ? exp.themeColor : "#dbe4de",
                boxShadow: isSelected ? `0 16px 36px ${exp.glowColor}` : "0 4px 16px rgba(16, 39, 32, 0.04)",
              }}
            >
              {/* Card Header & Badge */}
              <div className="exp-card-header">
                <div className="flex items-center gap-2">
                  <span className="exp-icon-pill" style={{ background: `${exp.themeColor}18`, color: exp.themeColor }}>
                    {exp.icon}
                  </span>
                  <div>
                    <h3 className="exp-title">{exp.title}</h3>
                    <small className="exp-tagline">{exp.tagline}</small>
                  </div>
                </div>
                <span
                  className="exp-badge"
                  style={{
                    background: isSelected ? exp.themeColor : "#f1f5f3",
                    color: isSelected ? "#ffffff" : "#435d51",
                  }}
                >
                  {exp.badge}
                </span>
              </div>

              {/* ── Rich Visual Illustration Canvas ────────────────────── */}
              <div className="exp-illustration-wrapper">
                {exp.id === "pitch" && (
                  /* 🎯 Scene 1: High-Tech Pitch Pod with OLED Monitor & Acoustic Booth */
                  <svg viewBox="0 0 400 240" className="exp-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="pitchWallGrad" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#102720" />
                        <stop offset="100%" stopColor="#0a1a15" />
                      </linearGradient>
                      <linearGradient id="oledGlow" x1="0" y1="0" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="chartLine" x1="0" y1="0" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2fd9ab" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>

                    {/* Cabin Wall Background with acoustic vertical louvres */}
                    <rect width="400" height="240" rx="8" fill="url(#pitchWallGrad)" />
                    <line x1="20" y1="20" x2="20" y2="220" stroke="#1d4034" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="380" y1="20" x2="380" y2="220" stroke="#1d4034" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Train Window with Scenic Motion Backdrop */}
                    <rect x="50" y="24" width="300" height="70" rx="12" fill="#0369a1" />
                    <path d="M 50,70 Q 120,40 200,65 Q 280,35 350,60 L 350,94 L 50,94 Z" fill="#38bdf8" opacity="0.6" />
                    <path d="M 50,80 Q 150,55 240,75 Q 300,60 350,75 L 350,94 L 50,94 Z" fill="#22c55e" opacity="0.7" />
                    {/* Window Frame Glass Reflection */}
                    <path d="M 60,30 L 160,30 L 120,88 L 60,88 Z" fill="#ffffff" opacity="0.1" />

                    {/* Central 4K OLED Presentation Monitor */}
                    <rect x="110" y="55" width="180" height="105" rx="6" fill="url(#oledGlow)" stroke="#ea580c" strokeWidth="2" />
                    <rect x="115" y="60" width="170" height="95" rx="4" fill="#090d16" />
                    
                    {/* Pitch Presentation UI on Screen */}
                    <rect x="122" y="66" width="45" height="10" rx="2" fill="#ea580c" />
                    <text x="144" y="73.5" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle">
                      PITCH DECK
                    </text>
                    <text x="180" y="74" fill="#94a3b8" fontSize="6.5" fontWeight="700">
                      SEED ROUND • ₹3.5 CR
                    </text>
                    {/* Traction Growth Chart */}
                    <path d="M 125,125 Q 160,115 190,100 T 255,80 T 275,76" fill="none" stroke="url(#chartLine)" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="275" cy="76" r="3" fill="#2fd9ab" />
                    {/* Metrics Pillars */}
                    <rect x="130" y="132" width="36" height="16" rx="2" fill="#1e293b" />
                    <text x="148" y="142" fill="#2fd9ab" fontSize="6" fontWeight="900" textAnchor="middle">
                      +320% ARR
                    </text>
                    <rect x="174" y="132" width="46" height="16" rx="2" fill="#1e293b" />
                    <text x="197" y="142" fill="#38bdf8" fontSize="6" fontWeight="900" textAnchor="middle">
                      94% RETENTION
                    </text>
                    <rect x="228" y="132" width="48" height="16" rx="2" fill="#1e293b" />
                    <text x="252" y="142" fill="#fb923c" fontSize="6" fontWeight="900" textAnchor="middle">
                      ₹1.2CR CHEQUE
                    </text>

                    {/* Executive Leather Recliners (Founder Left, Investor Right) */}
                    {/* Left Recliner (Founder Seat) */}
                    <rect x="30" y="110" width="60" height="90" rx="10" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
                    <rect x="36" y="125" width="48" height="65" rx="6" fill="#1e293b" />
                    <circle cx="60" cy="115" r="10" fill="#fcd34d" />
                    <rect x="42" y="195" width="36" height="8" rx="2" fill="#334155" />

                    {/* Right Recliner (Investor Seat) */}
                    <rect x="310" y="110" width="60" height="90" rx="10" fill="#0f6b61" stroke="#08423b" strokeWidth="1.5" />
                    <rect x="316" y="125" width="48" height="65" rx="6" fill="#1e293b" />
                    <circle cx="340" cy="115" r="10" fill="#fcd34d" />
                    <rect x="322" y="195" width="36" height="8" rx="2" fill="#334155" />

                    {/* Pitch Table Console */}
                    <rect x="100" y="170" width="200" height="35" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                    {/* Laptop on desk */}
                    <rect x="140" y="165" width="34" height="18" rx="2" fill="#cbd5e1" />
                    <rect x="143" y="167" width="28" height="14" rx="1" fill="#0f172a" />
                    {/* Coffee cups */}
                    <circle cx="250" cy="182" r="5" fill="#ffffff" stroke="#cbd5e1" />
                    <circle cx="250" cy="182" r="3" fill="#78350f" />

                    {/* Floating Privacy Pill */}
                    <rect x="135" y="210" width="130" height="20" rx="10" fill="#ea580c" />
                    <text x="200" y="223" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="0.5">
                      🔒 ACOUSTIC PRIVACY ZONE
                    </text>
                  </svg>
                )}

                {exp.id === "dine" && (
                  /* 🍽️ Scene 2: Coastal Dining Table with Konkan Cuisine & Viaduct Vista */
                  <svg viewBox="0 0 400 240" className="exp-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="dineWallGrad" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#451a03" />
                        <stop offset="100%" stopColor="#1c0a00" />
                      </linearGradient>
                      <linearGradient id="tableWood" x1="0" y1="0" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#78350f" />
                        <stop offset="50%" stopColor="#92400e" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                      <linearGradient id="lampGlow" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Dining Car Wall */}
                    <rect width="400" height="240" rx="8" fill="url(#dineWallGrad)" />

                    {/* Large Arched Window showing Panval Viaduct & Palms */}
                    <rect x="40" y="16" width="320" height="90" rx="14" fill="#e0f2fe" />
                    {/* Sky & River Gorge */}
                    <path d="M 40,65 Q 120,45 200,60 Q 280,45 360,65 L 360,106 L 40,106 Z" fill="#0284c7" opacity="0.6" />
                    {/* Railway Viaduct Arches in Distance */}
                    <path d="M 60,60 L 340,60" stroke="#b45309" strokeWidth="4" />
                    <rect x="100" y="60" width="12" height="35" fill="#78350f" />
                    <rect x="170" y="60" width="12" height="35" fill="#78350f" />
                    <rect x="240" y="60" width="12" height="35" fill="#78350f" />
                    <rect x="310" y="60" width="12" height="35" fill="#78350f" />
                    {/* Coastal Palm Trees */}
                    <path d="M 80,70 Q 75,50 85,38 M 85,38 Q 70,36 68,44 M 85,38 Q 98,34 96,44" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 280,68 Q 275,48 285,36 M 285,36 Q 270,34 268,42 M 285,36 Q 298,32 296,42" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Hanging Warm Brass Pendant Lamps */}
                    <line x1="140" y1="0" x2="140" y2="40" stroke="#f59e0b" strokeWidth="1.5" />
                    <polygon points="132,40 148,40 152,50 128,50" fill="#d97706" />
                    <polygon points="120,50 160,50 190,130 90,130" fill="url(#lampGlow)" />

                    <line x1="260" y1="0" x2="260" y2="40" stroke="#f59e0b" strokeWidth="1.5" />
                    <polygon points="252,40 268,40 272,50 248,50" fill="#d97706" />
                    <polygon points="240,50 280,50 310,130 210,130" fill="url(#lampGlow)" />

                    {/* Dining Booth Seating (Left & Right) */}
                    <rect x="25" y="115" width="55" height="95" rx="8" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                    <rect x="320" y="115" width="55" height="95" rx="8" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />

                    {/* Mahogany Dining Table (Center) */}
                    <rect x="85" y="130" width="230" height="75" rx="8" fill="url(#tableWood)" stroke="#d97706" strokeWidth="1.5" />
                    <rect x="95" y="136" width="210" height="63" rx="4" fill="#fef3c7" />

                    {/* Coastal Gourmet Dishes & Culinary Service */}
                    {/* Banana Leaf Platter (Center) */}
                    <ellipse cx="200" cy="165" rx="38" ry="20" fill="#15803d" stroke="#166534" strokeWidth="1" />
                    <circle cx="185" cy="165" r="5" fill="#f59e0b" />
                    <circle cx="200" cy="165" r="6" fill="#ea580c" />
                    <circle cx="215" cy="165" r="5" fill="#fef08a" />

                    {/* Left & Right Fine Porcelain Plates */}
                    <circle cx="130" cy="165" r="14" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
                    <circle cx="130" cy="165" r="8" fill="#d97706" />

                    <circle cx="270" cy="165" r="14" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
                    <circle cx="270" cy="165" r="8" fill="#d97706" />

                    {/* Steaming Chai & Kokum Glasses */}
                    <rect x="155" y="145" width="10" height="15" rx="2" fill="#b45309" />
                    <rect x="235" y="145" width="10" height="15" rx="2" fill="#be123c" />

                    {/* Floating Culinary Pill */}
                    <rect x="125" y="210" width="150" height="20" rx="10" fill="#d97706" />
                    <text x="200" y="223" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="0.5">
                      🍽️ FRESH KONKAN GASTRONOMY
                    </text>
                  </svg>
                )}

                {exp.id === "lounge" && (
                  /* 🌅 Scene 3: Panoramic Scenic Lounge overlooking Arabian Sea Sunset */
                  <svg viewBox="0 0 400 240" className="exp-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="loungeWallGrad" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#064e3b" />
                        <stop offset="100%" stopColor="#022c22" />
                      </linearGradient>
                      <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="40%" stopColor="#fbbf24" />
                        <stop offset="70%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                      <linearGradient id="sunGlow" x1="0" y1="0" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>

                    {/* Lounge Wall */}
                    <rect width="400" height="240" rx="8" fill="url(#loungeWallGrad)" />

                    {/* Giant 180° Floor-to-Ceiling Curved Panoramic Window Bay */}
                    <rect x="25" y="14" width="350" height="120" rx="14" fill="url(#sunsetSky)" stroke="#34d399" strokeWidth="1.5" />

                    {/* Glowing Arabian Sea Sunset Sun */}
                    <circle cx="200" cy="65" r="26" fill="url(#sunGlow)" />
                    <circle cx="200" cy="65" r="38" fill="#fef08a" opacity="0.25" />

                    {/* Ocean Wave Horizons */}
                    <path d="M 25,95 Q 110,88 200,94 Q 290,100 375,93 L 375,134 L 25,134 Z" fill="#047857" opacity="0.8" />
                    <path d="M 25,108 Q 100,104 200,108 Q 300,112 375,106 L 375,134 L 25,134 Z" fill="#065f46" />

                    {/* Tropical Palm Tree Silhouettes against Sunset */}
                    <path d="M 50,110 Q 55,80 70,60 M 70,60 Q 50,56 45,66 M 70,60 Q 88,52 86,65 M 70,60 Q 65,45 80,48" stroke="#022c22" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 350,110 Q 345,80 330,60 M 330,60 Q 350,56 355,66 M 330,60 Q 312,52 314,65 M 330,60 Q 335,45 320,48" stroke="#022c22" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Curved Emerald Velvet Observation Sofa (Center) */}
                    <path
                      d="M 60,165 C 100,135 300,135 340,165 L 350,205 C 290,175 110,175 50,205 Z"
                      fill="#059669"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <path
                      d="M 80,175 C 120,152 280,152 320,175 L 310,195 C 275,178 125,178 90,195 Z"
                      fill="#047857"
                    />

                    {/* Marble Cocktail & Networking Table */}
                    <ellipse cx="200" cy="188" rx="36" ry="14" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
                    <ellipse cx="200" cy="188" rx="20" ry="8" fill="#f0fdf4" />

                    {/* Sparkling Celebration Champagne Flutes */}
                    <polygon points="188,180 192,180 191,186 189,186" fill="#fef08a" stroke="#d97706" strokeWidth="0.6" />
                    <polygon points="212,180 216,180 215,186 213,186" fill="#fef08a" stroke="#d97706" strokeWidth="0.6" />

                    {/* Floating Sunset Mixer Pill */}
                    <rect x="115" y="210" width="170" height="20" rx="10" fill="#059669" />
                    <text x="200" y="223" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="0.5">
                      🌅 180° OCEAN SUNSET MIXER
                    </text>
                  </svg>
                )}
              </div>

              {/* Card Footer Summary Points */}
              <div className="exp-card-body">
                <h4 className="exp-card-headline">{exp.headline}</h4>
                <p className="exp-card-desc">{exp.description}</p>
                <ul className="exp-card-bullets">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>
                      <span className="bullet-check" style={{ color: exp.themeColor }}>
                        ✓
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Route Sequence Ribbon ─────────────────────────────────────── */}
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
    </section>
  );
}
