"use client";

import React, { useState } from "react";

export function DpiitEligibilityChecker({ onApply }: { onApply?: () => void }) {
  const [activeTab, setActiveTab] = useState<"normal" | "deeptech">("normal");

  // Quiz Form States
  const [showQuiz, setShowQuiz] = useState(false);
  const currentYear = new Date().getFullYear();
  const [incYear, setIncYear] = useState<number>(currentYear - 3);
  const [entityType, setEntityType] = useState<string>("pvt_ltd");
  const [turnover, setTurnover] = useState<number>(12); // in ₹ Crores
  const [isOriginal, setIsOriginal] = useState<boolean>(true);
  const [isInnovative, setIsInnovative] = useState<boolean>(true);
  const [isDeeptech, setIsDeeptech] = useState<boolean>(false);

  // Compute live eligibility
  const companyAge = currentYear - incYear;
  const isEligibleEntityType = ["pvt_ltd", "llp", "partnership", "coop"].includes(entityType);

  let resultStatus: "deeptech" | "normal" | "ineligible" = "ineligible";
  let failReasons: string[] = [];

  if (!isEligibleEntityType) {
    failReasons.push("Entity must be a Pvt Ltd, LLP, Partnership, or Cooperative Society.");
  }
  if (!isOriginal) {
    failReasons.push("Must be an original entity (not formed by splitting/reconstructing an existing business).");
  }
  if (!isInnovative) {
    failReasons.push("Must be working on innovative products/services with scalable potential.");
  }

  // Deeptech check
  if (isEligibleEntityType && isOriginal && isInnovative && isDeeptech) {
    if (companyAge <= 20 && turnover <= 300) {
      resultStatus = "deeptech";
    } else {
      if (companyAge > 20) failReasons.push("Deeptech company age must be up to 20 years.");
      if (turnover > 300) failReasons.push("Deeptech turnover must not exceed ₹300 Crore.");
    }
  }

  // Normal check
  if (resultStatus !== "deeptech" && isEligibleEntityType && isOriginal && isInnovative) {
    if (companyAge <= 10 && turnover <= 200) {
      resultStatus = "normal";
    } else {
      if (companyAge > 10) failReasons.push("Normal startup age must be up to 10 years.");
      if (turnover > 200) failReasons.push("Normal startup turnover must not exceed ₹200 Crore.");
    }
  }

  const CARDS = [
    {
      kicker: "MAX COMPANY AGE",
      title: activeTab === "normal" ? "Up to 10 Years" : "Up to 20 Years",
      desc: activeTab === "normal" ? "From date of incorporation" : "Extended gestation window",
      badge: activeTab === "normal" ? "10 Yrs Standard" : "20 Yrs Deeptech",
      accentColor: "#0f6b61",
      color1: "#fef08a",
      color2: "#bbf7d0",
      color3: "#f4fbf7",
    },
    {
      kicker: "ELIGIBLE ENTITY",
      title: "Pvt Ltd & LLP",
      desc: "Registered partnership or entity",
      badge: "Sole Props Excluded",
      accentColor: "#0f6b61",
      color1: "#a7f3d0",
      color2: "#dbeafe",
      color3: "#f8fafc",
    },
    {
      kicker: "TURNOVER CAP",
      title: activeTab === "normal" ? "Max ₹200 Cr" : "Max ₹300 Cr",
      desc: "Annual revenue statutory ceiling",
      badge: activeTab === "normal" ? "₹200 Cr Ceiling" : "₹300 Cr Deeptech",
      accentColor: "#b45309",
      color1: "#fde68a",
      color2: "#fed7aa",
      color3: "#fffbeb",
    },
    {
      kicker: "INDEPENDENT ENTITY",
      title: "100% Original",
      desc: "Not formed by split or merger",
      badge: "Genuine Enterprise",
      accentColor: "#0f6b61",
      color1: "#bae6fd",
      color2: "#ccfbf1",
      color3: "#f0fdf4",
    },
    {
      kicker: "CORE THESIS",
      title: "Innovation & Scale",
      desc: "Scalable model & jobs creation",
      badge: "Curation Priority",
      accentColor: "#ea580c",
      color1: "#fed7aa",
      color2: "#fecdd3",
      color3: "#fff7ed",
    },
  ];

  return (
    <section className="dpiit-section" id="dpiit">
      {/* ── Global Shared SVG Noise Filter ─────────────────────────────── */}
      <svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true">
        <filter id="dpiit-noise-light">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.85"
            numOctaves={2}
            seed={2}
            stitchTiles="stitch"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale={22}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="heading" style={{ marginBottom: "28px" }}>
        <div>
          <span className="kicker" style={{ color: "#d97706" }}>
            <b style={{ background: "#d97706" }} />
            GOVERNMENT OF INDIA RECOGNITION
          </span>
          <h2 style={{ fontSize: "clamp(32px, 3.8vw, 52px)", margin: "10px 0" }}>
            DPIIT Startup <em>Eligibility</em> Checker
          </h2>
        </div>
        <p style={{ maxWidth: "420px", color: "#63756d", fontSize: "14px", lineHeight: "1.6" }}>
          Compare the criteria for Startup India recognition and run our instant pre-screening assessment for your venture.
        </p>
      </div>

      {/* Tabs & Quiz Toggle */}
      <div className="dpiit-controls">
        <div className="dpiit-tabs">
          <button
            type="button"
            className={`dpiit-tab-btn ${activeTab === "normal" ? "active normal" : ""}`}
            onClick={() => setActiveTab("normal")}
          >
            🇮🇳 Normal Recognised
          </button>
          <button
            type="button"
            className={`dpiit-tab-btn ${activeTab === "deeptech" ? "active deeptech" : ""}`}
            onClick={() => setActiveTab("deeptech")}
          >
            🔬 Deeptech Recognised
          </button>
        </div>

        <button
          type="button"
          className="dpiit-quiz-toggle-btn"
          onClick={() => setShowQuiz(!showQuiz)}
        >
          {showQuiz ? "✕ Hide Pre-Screening Quiz" : "⚡ Check My Startup Eligibility"}
        </button>
      </div>

      {/* Interactive Quiz Drawer */}
      {showQuiz && (
        <div className="dpiit-quiz-box">
          <div className="dpiit-quiz-header">
            <div>
              <span className="kicker" style={{ color: "#0f6b61" }}>
                INSTANT DIAGNOSTIC
              </span>
              <h3 style={{ margin: "4px 0", fontSize: "18px" }}>
                Startup India Pre-Screening Calculator
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#63756d" }}>
                Answer 5 quick questions to verify your DPIIT qualification category.
              </p>
            </div>
            <div className="dpiit-status-badge-wrap">
              {resultStatus === "deeptech" && (
                <div className="dpiit-badge deeptech">
                  ✓ Eligible for DPIIT Deeptech
                  <small>Up to 20 yrs · Max ₹300 Cr</small>
                </div>
              )}
              {resultStatus === "normal" && (
                <div className="dpiit-badge normal">
                  ✓ Eligible for DPIIT Normal
                  <small>Up to 10 yrs · Max ₹200 Cr</small>
                </div>
              )}
              {resultStatus === "ineligible" && (
                <div className="dpiit-badge ineligible">
                  ✕ Ineligible for Recognition
                  <small>{failReasons[0] || "Requirements not met"}</small>
                </div>
              )}
            </div>
          </div>

          <div className="dpiit-quiz-grid">
            <div className="dpiit-quiz-field">
              <label>
                Year of Incorporation: <b>{incYear}</b> ({companyAge} yrs old)
              </label>
              <input
                type="range"
                min={currentYear - 25}
                max={currentYear}
                value={incYear}
                onChange={(e) => setIncYear(Number(e.target.value))}
              />
              <div className="dpiit-range-labels">
                <span>{currentYear - 25}</span>
                <span>{currentYear}</span>
              </div>
            </div>

            <div className="dpiit-quiz-field">
              <label>Registered Legal Entity Structure</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              >
                <option value="pvt_ltd">Private Limited Company (Pvt Ltd)</option>
                <option value="llp">Limited Liability Partnership (LLP)</option>
                <option value="partnership">Registered Partnership Firm</option>
                <option value="coop">Cooperative Society</option>
                <option value="sole_prop">Sole Proprietorship (Ineligible)</option>
                <option value="unregistered">Unregistered Entity (Ineligible)</option>
              </select>
            </div>

            <div className="dpiit-quiz-field">
              <label>
                Peak Turnover in Any Fiscal Year: <b>₹{turnover} Cr</b>
              </label>
              <input
                type="range"
                min={1}
                max={400}
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
              />
              <div className="dpiit-range-labels">
                <span>₹1 Cr</span>
                <span>₹400 Cr</span>
              </div>
            </div>

            <div className="dpiit-quiz-field" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label className="dpiit-checkbox">
                <input
                  type="checkbox"
                  checked={isOriginal}
                  onChange={(e) => setIsOriginal(e.target.checked)}
                />
                <span>Original entity (not split/reconstructed)</span>
              </label>
              <label className="dpiit-checkbox">
                <input
                  type="checkbox"
                  checked={isInnovative}
                  onChange={(e) => setIsInnovative(e.target.checked)}
                />
                <span>Innovative product/service with scalable model</span>
              </label>
              <label className="dpiit-checkbox">
                <input
                  type="checkbox"
                  checked={isDeeptech}
                  onChange={(e) => setIsDeeptech(e.target.checked)}
                />
                <span style={{ fontWeight: 700, color: "#0f6b61" }}>
                  🔬 Deeptech / IP / Hardware / Proprietary Tech focus
                </span>
              </label>
            </div>
          </div>

          <div className="dpiit-quiz-footer">
            <div>
              {resultStatus !== "ineligible" ? (
                <span style={{ color: "#0f6b61", fontSize: "12px", fontWeight: 700 }}>
                  ✓ Your startup qualifies for DPIIT tax exemptions (80-IAC), Angel Tax relief & RailPitch curation priority!
                </span>
              ) : (
                <span style={{ color: "#c2410c", fontSize: "12px", fontWeight: 600 }}>
                  ⚠️ {failReasons.join(" · ")}
                </span>
              )}
            </div>
            {onApply && (
              <button
                type="button"
                className="primary"
                onClick={onApply}
                style={{ padding: "10px 18px", fontSize: "11px" }}
              >
                Apply for RailPitch Journey →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 5 Aesthetic Light-Theme Noise Gradient Cards ──────────────── */}
      <div className="dpiit-cards-grid">
        {CARDS.map((card, idx) => (
          <div key={idx} className="dpiit-noise-wrapper">
            <div
              className="dpiit-noise-card"
              style={
                {
                  "--color-1": card.color1,
                  "--color-2": card.color2,
                  "--color-3": card.color3,
                } as React.CSSProperties
              }
            >
              <div className="dpiit-noise-bg" />

              {/* Clean Kicker (No icon) */}
              <div className="dpiit-noise-kicker" style={{ color: card.accentColor }}>
                {card.kicker}
              </div>

              {/* Big, Clear, High-Contrast Title */}
              <h3 className="dpiit-noise-title">{card.title}</h3>

              {/* Clear, Readable Description */}
              <p className="dpiit-noise-desc">{card.desc}</p>

              {/* Bottom Clean Pill */}
              <div className="dpiit-noise-badge">
                <span style={{ color: card.accentColor }}>{card.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dpiit-section {
          padding: 85px 5.2vw;
          background: #f7f6f0;
          border-top: 1px solid #dbe1d9;
          border-bottom: 1px solid #dbe1d9;
        }

        .dpiit-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }

        .dpiit-tabs {
          display: inline-flex;
          background: #eaf1eb;
          padding: 4px;
          border-radius: 30px;
          border: 1px solid #d1ded5;
        }

        .dpiit-tab-btn {
          border: 0;
          background: transparent;
          color: #556c60;
          padding: 9px 20px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dpiit-tab-btn.active.normal {
          background: #ffffff;
          color: #0f6b61;
          box-shadow: 0 2px 8px rgba(16, 39, 32, 0.12);
        }

        .dpiit-tab-btn.active.deeptech {
          background: #0f6b61;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(15, 107, 97, 0.25);
        }

        .dpiit-quiz-toggle-btn {
          border: 1px solid #d97706;
          background: #fffbeb;
          color: #b45309;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dpiit-quiz-toggle-btn:hover {
          background: #fef3c7;
          border-color: #b45309;
        }

        /* Quiz Box */
        .dpiit-quiz-box {
          background: #ffffff;
          border: 2px solid #0f6b61;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
          box-shadow: 0 16px 36px rgba(15, 107, 97, 0.1);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .dpiit-quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #eef2ed;
          padding-bottom: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .dpiit-status-badge-wrap {
          display: flex;
          align-items: center;
        }

        .dpiit-badge {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          text-align: right;
        }

        .dpiit-badge small {
          display: block;
          font-size: 10px;
          font-weight: 600;
          opacity: 0.85;
          margin-top: 2px;
        }

        .dpiit-badge.normal {
          background: #e3f2e9;
          color: #0f6b61;
          border: 1px solid #c2dfcf;
        }

        .dpiit-badge.deeptech {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }

        .dpiit-badge.ineligible {
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
        }

        .dpiit-quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .dpiit-quiz-field {
          background: #fbfcf9;
          border: 1px solid #e1e7e0;
          border-radius: 8px;
          padding: 14px;
        }

        .dpiit-quiz-field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #3b5045;
          margin-bottom: 8px;
        }

        .dpiit-quiz-field select,
        .dpiit-quiz-field input[type="range"] {
          width: 100%;
        }

        .dpiit-quiz-field select {
          padding: 8px;
          border: 1px solid #ccd8cf;
          border-radius: 4px;
          font-size: 12px;
          background: #ffffff;
        }

        .dpiit-range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #798980;
          margin-top: 4px;
        }

        .dpiit-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #3b5045;
          cursor: pointer;
        }

        .dpiit-quiz-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eef2ed;
          padding-top: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* ── 5 Aesthetic Light-Theme Noise Gradient Cards ────────── */
        .dpiit-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        .dpiit-noise-wrapper {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(16, 39, 32, 0.05);
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .dpiit-noise-wrapper:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(16, 39, 32, 0.12);
        }

        .dpiit-noise-card {
          width: 100%;
          min-height: 250px;
          position: relative;
          background-color: #ffffff;
          overflow: hidden;
          padding: 24px 20px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          border: 1.5px solid #dce5df;
          border-radius: 16px;
        }

        .dpiit-noise-bg {
          position: absolute;
          inset: -10%;
          width: 120%;
          height: 120%;
          filter: url("#dpiit-noise-light");
          background: radial-gradient(
              circle at 50% 115%,
              var(--color-1) 15%,
              var(--color-2) 45%,
              var(--color-3) 75%
            )
            no-repeat center / cover;
          opacity: 0.9;
          pointer-events: none;
          z-index: 1;
        }

        .dpiit-noise-kicker {
          position: relative;
          z-index: 2;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .dpiit-noise-title {
          position: relative;
          z-index: 2;
          font-size: 23px;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.6px;
          color: #102720;
          margin: 0 0 8px;
          transition: all 0.3s ease;
        }

        .dpiit-noise-wrapper:hover .dpiit-noise-title {
          letter-spacing: -0.3px;
          transform: translateY(-2px);
          color: #04251e;
        }

        .dpiit-noise-desc {
          position: relative;
          z-index: 2;
          color: #40574b;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.45;
          margin: 0 0 16px;
          transition: all 0.3s ease;
        }

        .dpiit-noise-badge {
          position: relative;
          z-index: 2;
          margin-top: auto;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(16, 39, 32, 0.12);
          box-shadow: 0 2px 8px rgba(16, 39, 32, 0.04);
          width: fit-content;
        }

        .dpiit-noise-badge span {
          font-size: 10.5px;
          font-weight: 850;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        @media (max-width: 1100px) {
          .dpiit-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dpiit-section {
            padding: 60px 4vw;
          }
          .dpiit-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
