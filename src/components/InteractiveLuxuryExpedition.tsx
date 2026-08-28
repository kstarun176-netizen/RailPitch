"use client";

import React, { useState } from "react";

type ExperienceId = "pitch" | "dine" | "lounge";

const EXPERIENCES: {
  id: ExperienceId;
  title: string;
  icon: string;
  themeColor: string;
  glowColor: string;
}[] = [
  { id: "pitch",  title: "1:1 Pitch Pods",         icon: "🎯", themeColor: "#ea580c", glowColor: "rgba(234,88,12,0.14)"  },
  { id: "dine",   title: "Coastal Dining Car",      icon: "🍽️", themeColor: "#d97706", glowColor: "rgba(217,119,6,0.14)" },
  { id: "lounge", title: "Panoramic Scenic Lounge", icon: "🌅", themeColor: "#059669", glowColor: "rgba(5,150,105,0.14)" },
];

/* ── Railway Track SVG — realistic perspective with metallic rails & wooden sleepers ─── */
function RailwayTrack() {
  return (
    <svg className="ribbon-track-svg" viewBox="0 0 300 32" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="railL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="40%" stopColor="#f3f4f6" />
          <stop offset="60%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="sleeperG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4a06a" />
          <stop offset="50%" stopColor="#a07840" />
          <stop offset="100%" stopColor="#7a5c28" />
        </linearGradient>
      </defs>

      {/* ── Ballast / gravel bed ── */}
      <rect x="0" y="22" width="300" height="10" fill="#e5e7eb" rx="1" />

      {/* ── Wooden sleepers (ties) — brown, evenly spaced ── */}
      {[4, 26, 48, 70, 92, 114, 136, 158, 180, 202, 224, 246, 268, 290].map((x) => (
        <rect key={x} x={x} y="14" width="14" height="10" rx="2" fill="url(#sleeperG)" stroke="#8B6520" strokeWidth="0.6" />
      ))}

      {/* ── Left rail — metallic silver with sheen ── */}
      <rect x="0" y="14" width="300" height="5" rx="1.5" fill="url(#railL)" />
      <rect x="0" y="14.5" width="300" height="1.5" rx="0.5" fill="#ffffff" opacity="0.5" />

      {/* ── Right rail — offset below ── */}
      <rect x="0" y="22" width="300" height="5" rx="1.5" fill="url(#railL)" />
      <rect x="0" y="22.5" width="300" height="1.5" rx="0.5" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

export function InteractiveLuxuryExpedition() {
  const [active, setActive] = useState<ExperienceId>("pitch");

  return (
    <section className="luxury-expedition-section" id="journey">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="luxury-expedition-header">
        <h2 className="luxury-main-title">
          Beyond the <em>Boardroom.</em>
        </h2>
        <p className="luxury-main-subtitle">
          Where panoramic coastal views, authentic dining, and high-conviction pitches replace four walls.
        </p>
      </div>

      {/* ── 3 Visual Cards ─────────────────────────────────────────────── */}
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
              {/* Illustration */}
              <div className="exp-illustration-wrapper">
                {exp.id === "pitch"  && <PitchScene />}
                {exp.id === "dine"   && <DineScene />}
                {exp.id === "lounge" && <LoungeScene />}
              </div>

              {/* One-line label — text only, no icon */}
              <div className="exp-label-row" style={{ color: exp.themeColor }}>
                <span className="exp-title">{exp.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Route Timeline with Railway Track ────────────────────────── */}
      <div className="luxury-route-ribbon">
        <div className="ribbon-milestones">

          <div className="ribbon-node">
            <span className="dot active" />
            <b>Mumbai CSMT</b>
            <small>08:10 AM</small>
          </div>

          <div className="ribbon-track-wrap"><RailwayTrack /></div>

          <div className="ribbon-node">
            <span className="dot" />
            <b>Panvel</b>
            <small>09:05 AM</small>
          </div>

          <div className="ribbon-track-wrap"><RailwayTrack /></div>

          <div className="ribbon-node">
            <span className="dot" />
            <b>Ratnagiri</b>
            <small>01:30 PM</small>
          </div>

          <div className="ribbon-track-wrap"><RailwayTrack /></div>

          <div className="ribbon-node">
            <span className="dot active" />
            <b>Goa (Madgaon)</b>
            <small>06:45 PM</small>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Scene Illustrations — lighter, theme-warm palette                         */
/* ─────────────────────────────────────────────────────────────────────────── */

function PitchScene() {
  return (
    <svg viewBox="0 0 400 220" className="exp-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6ede5" />
          <stop offset="100%" stopColor="#c4e0d5" />
        </linearGradient>
        <linearGradient id="chartG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0f6b61" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="screenBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f2d26" />
          <stop offset="100%" stopColor="#071a14" />
        </linearGradient>
      </defs>

      {/* Wall */}
      <rect width="400" height="220" fill="url(#pw)" />
      {/* Subtle wall panels */}
      <rect x="0" y="0" width="400" height="220" fill="none" stroke="#b8d9cc" strokeWidth="0" />
      <line x1="0" y1="130" x2="400" y2="130" stroke="#b8d9cc" strokeWidth="1" strokeDasharray="4 8" />

      {/* Scenic window */}
      <rect x="50" y="16" width="300" height="64" rx="10" fill="#a7d4e8" stroke="#7ec8e3" strokeWidth="1.5" />
      {/* Hills */}
      <path d="M50,66 Q110,44 170,58 Q230,40 290,56 Q330,48 350,60 L350,80 L50,80 Z" fill="#5ebd7c" opacity=".8" />
      <path d="M50,72 Q130,58 200,68 Q300,54 350,70 L350,80 L50,80 Z" fill="#38a35a" />
      {/* glass glare */}
      <path d="M62,22 L140,22 L108,76 L62,76 Z" fill="#fff" opacity=".12" />

      {/* OLED screen — dark inside, warm accent */}
      <rect x="118" y="50" width="164" height="100" rx="6" fill="url(#screenBg)" stroke="#ea580c" strokeWidth="2" />
      <rect x="123" y="55" width="154" height="90" rx="3" fill="#0c2118" />
      {/* chart line */}
      <path d="M131,122 Q155,110 178,96 T228,74 T252,68"
        fill="none" stroke="url(#chartG)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="252" cy="68" r="3.5" fill="#0f6b61" />
      {/* metric tags */}
      <rect x="131" y="130" width="46" height="10" rx="2" fill="#0f3a2d" />
      <text x="154" y="137.5" fill="#2fd9ab" fontSize="6" fontWeight="800" textAnchor="middle">+320% ARR</text>
      <rect x="184" y="130" width="50" height="10" rx="2" fill="#0f3a2d" />
      <text x="209" y="137.5" fill="#fb923c" fontSize="6" fontWeight="800" textAnchor="middle">₹1.2CR CHEQUE</text>

      {/* Founder seat — warm saffron */}
      <rect x="24" y="98" width="68" height="100" rx="10" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" />
      <rect x="32" y="114" width="52" height="72" rx="6" fill="#7a2e0a" />
      <circle cx="58" cy="106" r="12" fill="#fcd34d" stroke="#f59e0b" strokeWidth="1" />

      {/* Investor seat — teal */}
      <rect x="308" y="98" width="68" height="100" rx="10" fill="#0f6b61" stroke="#0a4a43" strokeWidth="1.2" />
      <rect x="316" y="114" width="52" height="72" rx="6" fill="#073d36" />
      <circle cx="342" cy="106" r="12" fill="#fcd34d" stroke="#f59e0b" strokeWidth="1" />

      {/* Desk */}
      <rect x="98" y="156" width="204" height="26" rx="5" fill="#d0e8de" stroke="#afd0c5" strokeWidth="1" />
      <rect x="148" y="150" width="30" height="16" rx="2" fill="#e2ede7" stroke="#afd0c5" strokeWidth="1" />
      <rect x="152" y="153" width="22" height="11" rx="1" fill="#102720" />
      <circle cx="252" cy="169" r="5" fill="#fff" stroke="#b5d4c6" strokeWidth="1" />
      <circle cx="252" cy="169" r="3" fill="#92400e" />
    </svg>
  );
}

function DineScene() {
  return (
    <svg viewBox="0 0 400 220" className="exp-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3e2" />
          <stop offset="100%" stopColor="#fde8c4" />
        </linearGradient>
        <linearGradient id="tw" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="lampG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity=".3" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="220" fill="url(#dw)" />

      {/* Arched window — sky-blue */}
      <rect x="40" y="14" width="320" height="80" rx="14" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1.2" />
      <path d="M40,58 Q120,42 200,54 Q280,40 360,56 L360,94 L40,94 Z" fill="#4ade80" opacity=".5" />
      <path d="M40,72 Q130,60 200,70 Q300,58 360,70 L360,94 L40,94 Z" fill="#22c55e" opacity=".6" />
      {/* viaduct */}
      <path d="M60,56 L340,56" stroke="#d97706" strokeWidth="3" />
      <rect x="102" y="56" width="9" height="32" fill="#b45309" />
      <rect x="174" y="56" width="9" height="32" fill="#b45309" />
      <rect x="248" y="56" width="9" height="32" fill="#b45309" />
      <rect x="316" y="56" width="9" height="32" fill="#b45309" />
      {/* palms */}
      <path d="M80,68 Q76,48 84,35 M84,35 Q70,32 68,42 M84,35 Q97,31 94,41" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <path d="M292,68 Q288,48 296,35 M296,35 Q282,32 280,42 M296,35 Q309,31 306,41" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />

      {/* pendant lamps */}
      <line x1="140" y1="0" x2="140" y2="38" stroke="#d97706" strokeWidth="1.5" />
      <polygon points="133,38 147,38 150,47 130,47" fill="#d97706" />
      <polygon points="118,47 162,47 190,120 92,120" fill="url(#lampG)" />

      <line x1="260" y1="0" x2="260" y2="38" stroke="#d97706" strokeWidth="1.5" />
      <polygon points="253,38 267,38 270,47 250,47" fill="#d97706" />
      <polygon points="238,47 282,47 308,120 212,120" fill="url(#lampG)" />

      {/* booth seats — warm amber */}
      <rect x="22" y="106" width="50" height="92" rx="7" fill="#d97706" stroke="#b45309" strokeWidth="1" />
      <rect x="328" y="106" width="50" height="92" rx="7" fill="#d97706" stroke="#b45309" strokeWidth="1" />

      {/* dining table */}
      <rect x="78" y="116" width="244" height="70" rx="7" fill="url(#tw)" stroke="#f59e0b" strokeWidth="1" />
      <rect x="88" y="122" width="224" height="58" rx="4" fill="#fffbeb" />

      {/* banana leaf platter */}
      <ellipse cx="200" cy="150" rx="36" ry="17" fill="#4ade80" stroke="#16a34a" strokeWidth=".8" />
      <circle cx="185" cy="150" r="5" fill="#f59e0b" />
      <circle cx="200" cy="150" r="6" fill="#ea580c" />
      <circle cx="215" cy="150" r="5" fill="#fef08a" />

      {/* side plates */}
      <circle cx="128" cy="150" r="13" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="128" cy="150" r="7" fill="#d97706" />
      <circle cx="272" cy="150" r="13" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="272" cy="150" r="7" fill="#d97706" />

      {/* drinks */}
      <rect x="158" y="134" width="8" height="13" rx="2" fill="#92400e" />
      <rect x="234" y="134" width="8" height="13" rx="2" fill="#be123c" />
    </svg>
  );
}

function LoungeScene() {
  return (
    <svg viewBox="0 0 400 220" className="exp-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#a7f3d0" />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="35%" stopColor="#fbbf24" />
          <stop offset="65%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      <rect width="400" height="220" fill="url(#lw)" />

      {/* panoramic window */}
      <rect x="22" y="12" width="356" height="106" rx="12" fill="url(#sky)" stroke="#6ee7b7" strokeWidth="1.5" />

      {/* sun */}
      <circle cx="200" cy="56" r="22" fill="url(#sg)" />
      <circle cx="200" cy="56" r="34" fill="#fef08a" opacity=".22" />

      {/* ocean */}
      <path d="M22,86 Q110,78 200,84 Q290,90 378,83 L378,118 L22,118 Z" fill="#059669" opacity=".75" />
      <path d="M22,100 Q100,94 200,100 Q300,106 378,98 L378,118 L22,118 Z" fill="#047857" />

      {/* palm silhouettes — softer on light bg */}
      <path d="M52,102 Q57,74 70,54 M70,54 Q51,50 47,61 M70,54 Q87,48 84,60 M70,54 Q65,40 78,44" stroke="#065f46" strokeWidth="2" strokeLinecap="round" />
      <path d="M348,102 Q343,74 330,54 M330,54 Q349,50 353,61 M330,54 Q313,48 316,60 M330,54 Q335,40 322,44" stroke="#065f46" strokeWidth="2" strokeLinecap="round" />

      {/* curved lounge sofa — emerald */}
      <path d="M55,150 C95,124 305,124 345,150 L354,192 C290,166 110,166 46,192 Z" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
      <path d="M74,160 C110,142 290,142 326,160 L316,182 C278,168 122,168 84,182 Z" fill="#047857" />

      {/* cocktail table */}
      <ellipse cx="200" cy="180" rx="30" ry="11" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" />
      <ellipse cx="200" cy="180" rx="16" ry="6" fill="#d1fae5" />

      {/* champagne flutes */}
      <polygon points="188,173 191,173 190,180 189,180" fill="#fef08a" stroke="#d97706" strokeWidth=".5" />
      <polygon points="211,173 214,173 213,180 212,180" fill="#fef08a" stroke="#d97706" strokeWidth=".5" />
    </svg>
  );
}
