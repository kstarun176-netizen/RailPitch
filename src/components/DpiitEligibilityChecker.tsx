"use client";

import React, { useState } from "react";

export function DpiitEligibilityChecker({ onApply }: { onApply?: () => void }) {
  const [activeTab, setActiveTab] = useState<"normal" | "deeptech">("normal");

  // Quiz Form States
  const [showQuiz, setShowQuiz] = useState(false);
  const currentYear = new Date().getFullYear();
  const [incYear, setIncYear] = useState<number>(currentYear - 3);
  const [entityType, setEntityType] = useState<string>("pvt_ltd");
  const [turnover, setTurnover] = useState<number>(15); // in ₹ Crores
  const [isOriginal, setIsOriginal] = useState<boolean>(true);
  const [isInnovative, setIsInnovative] = useState<boolean>(true);
  const [isDeeptech, setIsDeeptech] = useState<boolean>(false);

  // Compute live eligibility
  const companyAge = currentYear - incYear;
  const isEligibleEntityType = ["pvt_ltd", "llp", "partnership", "coop"].includes(entityType);

  let resultStatus: "deeptech" | "normal" | "ineligible" = "ineligible";
  let failReasons: string[] = [];

  if (!isEligibleEntityType) {
    failReasons.push("Entity must be a Pvt Ltd, LLP, or Partnership Firm.");
  }
  if (!isOriginal) {
    failReasons.push("Must be an original entity (not split/reconstructed).");
  }
  if (!isInnovative) {
    failReasons.push("Must have an innovative product/service with scalable model.");
  }

  // Deeptech check
  if (isEligibleEntityType && isOriginal && isInnovative && isDeeptech) {
    if (companyAge <= 20 && turnover <= 300) {
      resultStatus = "deeptech";
    } else {
      if (companyAge > 20) failReasons.push("Deeptech age must be up to 20 years.");
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
      {/* Global Shared SVG Noise Filter */}
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
          {showQuiz ? "✕ Close Diagnostic Tool" : "⚡ Check My Startup Eligibility"}
        </button>
      </div>

      {/* ── High-End Diagnostic Calculator Box ──────────────────────────── */}
      {showQuiz && (
        <div className="dpiit-diagnostic-card">
          {/* Header Bar */}
          <div className="diagnostic-header-bar">
            <div>
              <span className="diagnostic-kicker">LIVE CRITERIA DIAGNOSTIC</span>
              <h3 className="diagnostic-title">Startup India Pre-Screening Assessment</h3>
              <p className="diagnostic-subtitle">
                Adjust the parameters below to verify statutory eligibility for DPIIT tax exemptions and RailPitch selection.
              </p>
            </div>
            
            {/* Live Status Pill */}
            <div className="diagnostic-verdict-pill">
              {resultStatus === "deeptech" && (
                <div className="verdict-tag deeptech">
                  <span className="verdict-beacon" />
                  <div>
                    <strong>Eligible for DPIIT Deeptech</strong>
                    <small>Up to 20 yrs · Max ₹300 Cr Revenue</small>
                  </div>
                </div>
              )}
              {resultStatus === "normal" && (
                <div className="verdict-tag normal">
                  <span className="verdict-beacon" />
                  <div>
                    <strong>Eligible for DPIIT Normal</strong>
                    <small>Up to 10 yrs · Max ₹200 Cr Revenue</small>
                  </div>
                </div>
              )}
              {resultStatus === "ineligible" && (
                <div className="verdict-tag ineligible">
                  <span className="verdict-beacon-red" />
                  <div>
                    <strong>Criteria Incomplete</strong>
                    <small>{failReasons[0] || "Review requirements"}</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Parameters Grid */}
          <div className="diagnostic-interactive-grid">
            {/* Control 1: Incorporation Year */}
            <div className="param-control-card">
              <div className="param-card-header">
                <span className="param-label">Year of Incorporation</span>
                <span className="param-value-pill">
                  {incYear} ({companyAge} yrs old)
                </span>
              </div>
              <input
                type="range"
                min={currentYear - 22}
                max={currentYear}
                value={incYear}
                onChange={(e) => setIncYear(Number(e.target.value))}
                className="param-custom-slider emerald"
              />
              <div className="param-preset-chips">
                <button
                  type="button"
                  className={companyAge <= 3 ? "preset-btn active" : "preset-btn"}
                  onClick={() => setIncYear(currentYear - 2)}
                >
                  Early (2 Yrs)
                </button>
                <button
                  type="button"
                  className={companyAge === 6 ? "preset-btn active" : "preset-btn"}
                  onClick={() => setIncYear(currentYear - 6)}
                >
                  Growth (6 Yrs)
                </button>
                <button
                  type="button"
                  className={companyAge === 10 ? "preset-btn active" : "preset-btn"}
                  onClick={() => setIncYear(currentYear - 10)}
                >
                  Standard Max (10 Yrs)
                </button>
              </div>
            </div>

            {/* Control 2: Legal Structure */}
            <div className="param-control-card">
              <div className="param-card-header">
                <span className="param-label">Entity Legal Structure</span>
                <span className="param-status-tag">
                  {isEligibleEntityType ? "✓ Eligible" : "✕ Ineligible"}
                </span>
              </div>
              <div className="param-select-wrapper">
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="param-custom-select"
                >
                  <option value="pvt_ltd">Private Limited Company (Pvt Ltd) — Eligible</option>
                  <option value="llp">Limited Liability Partnership (LLP) — Eligible</option>
                  <option value="partnership">Registered Partnership Firm — Eligible</option>
                  <option value="coop">Cooperative Society — Eligible</option>
                  <option value="sole_prop">Sole Proprietorship — Ineligible</option>
                  <option value="unregistered">Unregistered Firm — Ineligible</option>
                </select>
              </div>
              <small className="param-hint">
                Must be an incorporated body under Companies Act or LLP Act.
              </small>
            </div>

            {/* Control 3: Peak Annual Turnover */}
            <div className="param-control-card">
              <div className="param-card-header">
                <span className="param-label">Peak Annual Turnover</span>
                <span className="param-value-pill amber">₹{turnover} Crore / yr</span>
              </div>
              <input
                type="range"
                min={1}
                max={350}
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
                className="param-custom-slider amber"
              />
              <div className="param-preset-chips">
                <button
                  type="button"
                  className={turnover === 10 ? "preset-btn active" : "preset-btn"}
                  onClick={() => setTurnover(10)}
                >
                  ₹10 Cr
                </button>
                <button
                  type="button"
                  className={turnover === 50 ? "preset-btn active" : "preset-btn"}
                  onClick={() => setTurnover(50)}
                >
                  ₹50 Cr
                </button>
                <button
                  type="button"
                  className={turnover === 200 ? "preset-btn active" : "preset-btn"}
                  onClick={() => setTurnover(200)}
                >
                  ₹200 Cr Ceiling
                </button>
              </div>
            </div>

            {/* Control 4: Statutory Checkboxes */}
            <div className="param-control-card checks-column">
              <span className="param-label">Statutory Compliance Checkpoints</span>
              <div className="param-toggles-list">
                <button
                  type="button"
                  className={`param-toggle-item ${isOriginal ? "active" : ""}`}
                  onClick={() => setIsOriginal(!isOriginal)}
                >
                  <span className="toggle-box">{isOriginal ? "✓" : ""}</span>
                  <span className="toggle-text">100% Original Entity (Not formed by split/reconstruction)</span>
                </button>

                <button
                  type="button"
                  className={`param-toggle-item ${isInnovative ? "active" : ""}`}
                  onClick={() => setIsInnovative(!isInnovative)}
                >
                  <span className="toggle-box">{isInnovative ? "✓" : ""}</span>
                  <span className="toggle-text">Innovative Product/Service with Scalable Business Model</span>
                </button>

                <button
                  type="button"
                  className={`param-toggle-item deeptech ${isDeeptech ? "active" : ""}`}
                  onClick={() => setIsDeeptech(!isDeeptech)}
                >
                  <span className="toggle-box">{isDeeptech ? "✓" : ""}</span>
                  <span className="toggle-text">Deeptech / IP / Hardware / Proprietary Tech Focus</span>
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Footer Verdict Strip */}
          <div className="diagnostic-footer-strip">
            <div className="footer-verdict-summary">
              {resultStatus !== "ineligible" ? (
                <div className="verdict-success-msg">
                  <span className="icon">✓</span>
                  <div>
                    <strong>Pre-Screening Complete: High DPIIT Eligibility Match</strong>
                    <p>Qualifies for Section 80-IAC 3-year Tax Holiday, Angel Tax Exemption & RailPitch Cohort Review.</p>
                  </div>
                </div>
              ) : (
                <div className="verdict-fail-msg">
                  <span className="icon">⚠️</span>
                  <div>
                    <strong>Requirements Not Met: {failReasons[0]}</strong>
                    <p>Review the entity legal structure and turnover thresholds to ensure full statutory qualification.</p>
                  </div>
                </div>
              )}
            </div>

            {onApply && (
              <button
                type="button"
                className="diagnostic-apply-btn"
                onClick={onApply}
              >
                Apply for RailPitch Cohort →
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

              {/* Clean Kicker */}
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

        /* ── Modern Diagnostic Box Styles ────────────────────────── */
        .dpiit-diagnostic-card {
          background: #ffffff;
          border: 1.5px solid #0f6b61;
          border-radius: 18px;
          padding: 28px 30px;
          margin-bottom: 34px;
          box-shadow: 0 20px 48px -10px rgba(15, 107, 97, 0.12);
          display: flex;
          flex-direction: column;
          gap: 22px;
          animation: slideDown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .diagnostic-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          border-bottom: 1px solid #edf2ee;
          padding-bottom: 18px;
        }

        .diagnostic-kicker {
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.2px;
          color: #0f6b61;
          text-transform: uppercase;
        }

        .diagnostic-title {
          font-size: 22px;
          font-weight: 850;
          color: #102720;
          margin: 4px 0 2px;
          letter-spacing: -0.5px;
        }

        .diagnostic-subtitle {
          font-size: 13px;
          color: #556c62;
          margin: 0;
          line-height: 1.45;
        }

        .verdict-tag {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 18px;
          border-radius: 12px;
          border: 1.5px solid;
        }

        .verdict-tag.normal {
          background: #eef8f3;
          border-color: #a3d9c2;
          color: #0c564e;
        }

        .verdict-tag.deeptech {
          background: #e0f2fe;
          border-color: #7dd3fc;
          color: #0369a1;
        }

        .verdict-tag.ineligible {
          background: #fff1f2;
          border-color: #fecdd3;
          color: #9f1239;
        }

        .verdict-tag strong {
          display: block;
          font-size: 13px;
          font-weight: 850;
        }

        .verdict-tag small {
          display: block;
          font-size: 10.5px;
          opacity: 0.85;
          font-weight: 600;
        }

        .verdict-beacon {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: pulseBeacon 1.8s infinite;
        }

        .verdict-beacon-red {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ef4444;
        }

        @keyframes pulseBeacon {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.6;
          }
        }

        /* 4 Parameters Grid */
        .diagnostic-interactive-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .param-control-card {
          background: #fbfdfc;
          border: 1.5px solid #dbe6e0;
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 10px;
        }

        .param-control-card.checks-column {
          grid-column: span 2;
        }

        .param-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .param-label {
          font-size: 12px;
          font-weight: 800;
          color: #102720;
        }

        .param-value-pill {
          font-size: 11px;
          font-weight: 850;
          color: #0f6b61;
          background: #e6f4ed;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid #c2dfcf;
        }

        .param-value-pill.amber {
          color: #b45309;
          background: #fef3c7;
          border-color: #fde68a;
        }

        .param-status-tag {
          font-size: 10.5px;
          font-weight: 800;
          color: #0f6b61;
        }

        .param-custom-slider {
          width: 100%;
          height: 6px;
          border-radius: 4px;
          background: #e2ede7;
          outline: none;
          cursor: pointer;
        }

        .param-custom-slider.emerald {
          accent-color: #0f6b61;
        }

        .param-custom-slider.amber {
          accent-color: #d97706;
        }

        .param-preset-chips {
          display: flex;
          gap: 6px;
        }

        .preset-btn {
          border: 1px solid #d4e0d9;
          background: #ffffff;
          color: #556c60;
          font-size: 10px;
          font-weight: 750;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-btn:hover {
          border-color: #0f6b61;
          color: #0f6b61;
        }

        .preset-btn.active {
          background: #0f6b61;
          color: #ffffff;
          border-color: #0f6b61;
        }

        .param-select-wrapper {
          position: relative;
        }

        .param-custom-select {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid #ccdcd2;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 750;
          color: #102720;
          background: #ffffff;
          outline: none;
          cursor: pointer;
        }

        .param-hint {
          font-size: 10px;
          color: #6d8479;
        }

        /* Checkbox Toggle Buttons */
        .param-toggles-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .param-toggle-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1.5px solid #d6e2db;
          border-radius: 8px;
          padding: 10px 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .param-toggle-item:hover {
          border-color: #0f6b61;
        }

        .param-toggle-item.active {
          background: #eef8f3;
          border-color: #0f6b61;
        }

        .param-toggle-item.deeptech.active {
          background: #e0f2fe;
          border-color: #0284c7;
        }

        .toggle-box {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1.5px solid #a3baa0;
          display: grid;
          place-items: center;
          font-size: 11px;
          font-weight: 900;
          color: #ffffff;
          background: #ffffff;
          flex-shrink: 0;
        }

        .param-toggle-item.active .toggle-box {
          background: #0f6b61;
          border-color: #0f6b61;
        }

        .param-toggle-item.deeptech.active .toggle-box {
          background: #0284c7;
          border-color: #0284c7;
        }

        .toggle-text {
          font-size: 11px;
          font-weight: 750;
          color: #102720;
          line-height: 1.35;
        }

        /* Footer Verdict Strip */
        .diagnostic-footer-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #f4faf6;
          border: 1px solid #cce5d7;
          border-radius: 12px;
          padding: 14px 18px;
          flex-wrap: wrap;
        }

        .verdict-success-msg {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .verdict-success-msg .icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0f6b61;
          color: #ffffff;
          display: grid;
          place-items: center;
          font-size: 16px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .verdict-success-msg strong {
          display: block;
          font-size: 13px;
          color: #0f6b61;
          font-weight: 850;
        }

        .verdict-success-msg p {
          margin: 2px 0 0;
          font-size: 11.5px;
          color: #40574b;
        }

        .verdict-fail-msg {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .verdict-fail-msg .icon {
          font-size: 20px;
        }

        .verdict-fail-msg strong {
          display: block;
          font-size: 13px;
          color: #c2410c;
          font-weight: 850;
        }

        .verdict-fail-msg p {
          margin: 2px 0 0;
          font-size: 11.5px;
          color: #5d7166;
        }

        .diagnostic-apply-btn {
          background: #102720;
          color: #ffffff;
          border: 0;
          padding: 11px 20px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 39, 32, 0.2);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .diagnostic-apply-btn:hover {
          background: #0f6b61;
          transform: translateY(-1px);
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
          .param-toggles-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dpiit-section {
            padding: 60px 4vw;
          }
          .dpiit-cards-grid {
            grid-template-columns: 1fr;
          }
          .diagnostic-interactive-grid {
            grid-template-columns: 1fr;
          }
          .param-control-card.checks-column {
            grid-column: span 1;
          }
        }
      `}</style>
    </section>
  );
}
