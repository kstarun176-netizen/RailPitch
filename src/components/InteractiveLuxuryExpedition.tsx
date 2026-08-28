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
  { id: "pitch",  title: "1:1 Pitch Pods",         icon: "🎯", themeColor: "#ea580c", glowColor: "rgba(234,88,12,0.16)"  },
  { id: "dine",   title: "Coastal Dining Car",      icon: "🍽️", themeColor: "#d97706", glowColor: "rgba(217,119,6,0.16)" },
  { id: "lounge", title: "Panoramic Scenic Lounge", icon: "🌅", themeColor: "#059669", glowColor: "rgba(5,150,105,0.16)" },
];

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
                {exp.id === "pitch" && <PitchScene />}
                {exp.id === "dine"  && <DineScene />}
                {exp.id === "lounge" && <LoungeScene />}
              </div>

              {/* One-line label */}
              <div className="exp-label-row" style={{ color: exp.themeColor }}>
                <span className="exp-icon">{exp.icon}</span>
                <span className="exp-title">{exp.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Route Ribbon ──────────────────────────────────────────────── */}
      <div className="luxury-route-ribbon">
        <div className="ribbon-milestones">
          <div className="ribbon-node">
            <span className="dot active" />
            <b>Mumbai CSMT</b>
            <small>08:10 AM</small>
          </div>
          <span className="ribbon-line" />
          <div className="ribbon-node">
            <span className="dot" />
            <b>Panvel</b>
            <small>09:05 AM</small>
          </div>
          <span className="ribbon-line" />
          <div className="ribbon-node">
            <span className="dot" />
            <b>Ratnagiri</b>
            <small>01:30 PM</small>
          </div>
          <span className="ribbon-line" />
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
/*  Scene Illustrations                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

function PitchScene() {
  return (
    <svg viewBox="0 0 400 220" className="exp-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#102720" />
          <stop offset="100%" stopColor="#071510" />
        </linearGradient>
        <linearGradient id="chartG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2fd9ab" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Wall */}
      <rect width="400" height="220" rx="0" fill="url(#pw)" />

      {/* Scenic window */}
      <rect x="50" y="18" width="300" height="65" rx="10" fill="#0c4a6e" />
      <path d="M50,64 Q150,45 200,60 Q280,38 350,58 L350,83 L50,83 Z" fill="#22c55e" opacity=".6" />
      <path d="M50,74 Q130,58 200,70 Q300,55 350,70 L350,83 L50,83 Z" fill="#166534" />
      {/* glass glare */}
      <path d="M62,24 L150,24 L115,80 L62,80 Z" fill="#fff" opacity=".06" />

      {/* OLED screen */}
      <rect x="120" y="52" width="160" height="96" rx="5" fill="#0f172a" stroke="#ea580c" strokeWidth="2" />
      <rect x="125" y="57" width="150" height="86" rx="3" fill="#090d16" />
      {/* chart */}
      <path d="M133,118 Q158,106 178,95 T228,72 T250,68"
        fill="none" stroke="url(#chartG)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="250" cy="68" r="3" fill="#2fd9ab" />
      {/* metric tags */}
      <rect x="133" y="126" width="48" height="10" rx="2" fill="#1e293b" />
      <text x="157" y="133.5" fill="#2fd9ab" fontSize="6" fontWeight="800" textAnchor="middle">+320% ARR</text>
      <rect x="188" y="126" width="52" height="10" rx="2" fill="#1e293b" />
      <text x="214" y="133.5" fill="#38bdf8" fontSize="6" fontWeight="800" textAnchor="middle">₹1.2CR CHEQUE</text>

      {/* Founder seat */}
      <rect x="26" y="100" width="68" height="98" rx="10" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
      <rect x="34" y="116" width="52" height="70" rx="6" fill="#1e293b" />
      <circle cx="60" cy="108" r="11" fill="#fcd34d" />

      {/* Investor seat */}
      <rect x="306" y="100" width="68" height="98" rx="10" fill="#0f6b61" stroke="#08423b" strokeWidth="1.5" />
      <rect x="314" y="116" width="52" height="70" rx="6" fill="#1e293b" />
      <circle cx="340" cy="108" r="11" fill="#fcd34d" />

      {/* Desk */}
      <rect x="100" y="155" width="200" height="28" rx="5" fill="#1e293b" stroke="#334155" />
      <rect x="148" y="150" width="30" height="16" rx="2" fill="#cbd5e1" />
      <rect x="151" y="152" width="24" height="12" rx="1" fill="#0f172a" />
      <circle cx="250" cy="169" r="5" fill="#fff" stroke="#cbd5e1" strokeWidth=".5" />
      <circle cx="250" cy="169" r="3" fill="#78350f" />
    </svg>
  );
}

function DineScene() {
  return (
    <svg viewBox="0 0 400 220" className="exp-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#1c0a00" />
        </linearGradient>
        <linearGradient id="tw" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="lampG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity=".35" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="220" rx="0" fill="url(#dw)" />

      {/* Arched window */}
      <rect x="40" y="14" width="320" height="82" rx="14" fill="#e0f2fe" />
      <path d="M40,60 Q120,44 200,56 Q280,42 360,58 L360,96 L40,96 Z" fill="#0284c7" opacity=".5" />
      <path d="M40,75 Q130,62 200,72 Q300,60 360,72 L360,96 L40,96 Z" fill="#22c55e" opacity=".6" />
      {/* viaduct */}
      <path d="M60,58 L340,58" stroke="#b45309" strokeWidth="3.5" />
      <rect x="100" y="58" width="10" height="32" fill="#78350f" />
      <rect x="175" y="58" width="10" height="32" fill="#78350f" />
      <rect x="250" y="58" width="10" height="32" fill="#78350f" />
      <rect x="315" y="58" width="10" height="32" fill="#78350f" />
      {/* palms */}
      <path d="M80,70 Q76,50 84,37 M84,37 Q70,34 68,44 M84,37 Q97,33 94,43" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <path d="M290,70 Q286,50 294,37 M294,37 Q280,34 278,44 M294,37 Q307,33 304,43" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />

      {/* pendant lamps */}
      <line x1="140" y1="0" x2="140" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
      <polygon points="133,38 147,38 150,47 130,47" fill="#d97706" />
      <polygon points="118,47 162,47 190,120 92,120" fill="url(#lampG)" />

      <line x1="260" y1="0" x2="260" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
      <polygon points="253,38 267,38 270,47 250,47" fill="#d97706" />
      <polygon points="238,47 282,47 308,120 212,120" fill="url(#lampG)" />

      {/* booth seats */}
      <rect x="22" y="108" width="50" height="90" rx="7" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
      <rect x="328" y="108" width="50" height="90" rx="7" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />

      {/* dining table */}
      <rect x="78" y="118" width="244" height="70" rx="7" fill="url(#tw)" stroke="#d97706" strokeWidth="1.2" />
      <rect x="88" y="124" width="224" height="58" rx="4" fill="#fef3c7" />

      {/* banana leaf platter */}
      <ellipse cx="200" cy="152" rx="36" ry="18" fill="#15803d" stroke="#166534" strokeWidth=".8" />
      <circle cx="185" cy="152" r="5" fill="#f59e0b" />
      <circle cx="200" cy="152" r="6" fill="#ea580c" />
      <circle cx="215" cy="152" r="5" fill="#fef08a" />

      {/* side plates */}
      <circle cx="128" cy="152" r="14" fill="#fff" stroke="#d97706" strokeWidth="1.2" />
      <circle cx="128" cy="152" r="7" fill="#d97706" />
      <circle cx="272" cy="152" r="14" fill="#fff" stroke="#d97706" strokeWidth="1.2" />
      <circle cx="272" cy="152" r="7" fill="#d97706" />

      {/* drinks */}
      <rect x="156" y="134" width="9" height="14" rx="2" fill="#b45309" />
      <rect x="235" y="134" width="9" height="14" rx="2" fill="#be123c" />
    </svg>
  );
}

function LoungeScene() {
  return (
    <svg viewBox="0 0 400 220" className="exp-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="35%" stopColor="#fbbf24" />
          <stop offset="65%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <rect width="400" height="220" rx="0" fill="url(#lw)" />

      {/* panoramic window */}
      <rect x="22" y="12" width="356" height="108" rx="12" fill="url(#sky)" stroke="#34d399" strokeWidth="1.2" />

      {/* sun */}
      <circle cx="200" cy="58" r="24" fill="url(#sg)" />
      <circle cx="200" cy="58" r="36" fill="#fef08a" opacity=".2" />

      {/* ocean */}
      <path d="M22,88 Q110,80 200,86 Q290,92 378,85 L378,120 L22,120 Z" fill="#047857" opacity=".85" />
      <path d="M22,102 Q100,96 200,102 Q300,108 378,100 L378,120 L22,120 Z" fill="#065f46" />

      {/* palm silhouettes */}
      <path d="M52,104 Q57,76 70,56 M70,56 Q51,52 47,63 M70,56 Q87,50 84,62 M70,56 Q65,42 78,46" stroke="#022c22" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M348,104 Q343,76 330,56 M330,56 Q349,52 353,63 M330,56 Q313,50 316,62 M330,56 Q335,42 322,46" stroke="#022c22" strokeWidth="2.2" strokeLinecap="round" />

      {/* curved lounge sofa */}
      <path d="M55,152 C95,126 305,126 345,152 L354,196 C290,168 110,168 46,196 Z" fill="#059669" stroke="#10b981" strokeWidth="1.5" />
      <path d="M74,162 C110,144 290,144 326,162 L316,184 C278,170 122,170 84,184 Z" fill="#047857" />

      {/* cocktail table */}
      <ellipse cx="200" cy="182" rx="32" ry="12" fill="#fff" stroke="#a7f3d0" strokeWidth="1.2" />
      <ellipse cx="200" cy="182" rx="18" ry="7" fill="#f0fdf4" />

      {/* champagne flutes */}
      <polygon points="188,175 191,175 190,182 189,182" fill="#fef08a" stroke="#d97706" strokeWidth=".5" />
      <polygon points="211,175 214,175 213,182 212,182" fill="#fef08a" stroke="#d97706" strokeWidth=".5" />
    </svg>
  );
}
