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

  const CRITERIA_CARDS = [
    {
      num: "01",
      kicker: "MAX COMPANY AGE",
      title: activeTab === "normal" ? "Up to 10 Years" : "Up to 20 Years",
      desc:
        activeTab === "normal"
          ? "From date of incorporation. Standard recognition applies for up to 10 years."
          : "Extended 20-year gestation window granted for registered Deeptech & IP startups.",
      pill: activeTab === "normal" ? "10 Yrs Standard Cap" : "20 Yrs Deeptech Window",
      highlight: false,
    },
    {
      num: "02",
      kicker: "ELIGIBLE ENTITY",
      title: "Pvt Ltd & LLP",
      desc: "Private Limited Company, Registered Partnership, or Limited Liability Partnership (LLP).",
      pill: "Sole Props Excluded",
      highlight: false,
    },
    {
      num: "03",
      kicker: "TURNOVER CAP",
      title: activeTab === "normal" ? "Max ₹200 Crore" : "Max ₹300 Crore",
      desc: "Turnover in any financial year since incorporation must not exceed statutory threshold.",
      pill: activeTab === "normal" ? "₹200 Cr Annual Ceiling" : "₹300 Cr Deeptech Ceiling",
      highlight: false,
    },
    {
      num: "04",
      kicker: "INDEPENDENT ENTITY",
      title: "100% Original",
      desc: "Must be a genuine original enterprise and not formed by splitting or reconstructing an existing business.",
      pill: "Genuine Enterprise",
      highlight: false,
    },
    {
      num: "05",
      kicker: "CORE THESIS",
      title: "Innovation & Scale",
      desc: "Developing innovative solutions with high potential for employment generation or wealth creation.",
      pill: "RailPitch Selection Priority",
      highlight: true,
    },
  ];

  return (
    <section className="dpiit-section" id="dpiit">
      {/* ── Section Header ─────────────────────────────────────────────── */}
      <div className="dpiit-header-wrap">
        <div>
          <span className="kicker">
            <b />
            GOVERNMENT OF INDIA RECOGNITION
          </span>
          <h2 className="dpiit-title">
            DPIIT Startup <em>Eligibility</em> Checker
          </h2>
        </div>
        <p className="dpiit-subtitle">
          Official statutory criteria under Startup India. Verify your eligibility for Section 80-IAC tax exemptions and RailPitch cohort selection.
        </p>
      </div>

      {/* ── Tabs & Diagnostic Drawer Button ────────────────────────────── */}
      <div className="dpiit-controls-bar">
        <div className="dpiit-tabs">
          <button
            type="button"
            className={`dpiit-tab-btn ${activeTab === "normal" ? "active" : ""}`}
            onClick={() => setActiveTab("normal")}
          >
            🇮🇳 Standard Recognised
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
          {showQuiz ? "✕ Close Diagnostic Calculator" : "⚡ Check My Startup Eligibility"}
        </button>
      </div>

      {/* ── Interactive Diagnostic Calculator ──────────────────────────── */}
      {showQuiz && (
        <div className="dpiit-diagnostic-card">
          <div className="diagnostic-header-bar">
            <div>
              <span className="diagnostic-kicker">INTERACTIVE DIAGNOSTIC</span>
              <h3 className="diagnostic-title">Startup India Pre-Screening Assessment</h3>
              <p className="diagnostic-subtitle">
                Adjust parameters to simulate your qualification status for Section 80-IAC tax holiday & Angel Tax relief.
              </p>
            </div>

            <div className="diagnostic-verdict-pill">
              {resultStatus === "deeptech" && (
                <div className="verdict-tag deeptech">
                  <span className="verdict-beacon" />
                  <div>
                    <strong>Eligible for DPIIT Deeptech</strong>
                    <small>Up to 20 yrs · Max ₹300 Cr</small>
                  </div>
                </div>
              )}
              {resultStatus === "normal" && (
                <div className="verdict-tag normal">
                  <span className="verdict-beacon" />
                  <div>
                    <strong>Eligible for DPIIT Normal</strong>
                    <small>Up to 10 yrs · Max ₹200 Cr</small>
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

          {/* Interactive Controls */}
          <div className="diagnostic-interactive-grid">
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
                className="param-custom-slider"
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
                  Max Limit (10 Yrs)
                </button>
              </div>
            </div>

            <div className="param-control-card">
              <div className="param-card-header">
                <span className="param-label">Entity Legal Structure</span>
                <span className="param-status-tag">
                  {isEligibleEntityType ? "✓ Eligible" : "✕ Ineligible"}
                </span>
              </div>
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
                <option value="unregistered">Unregistered Entity — Ineligible</option>
              </select>
              <small className="param-hint">
                Must be an incorporated body under Companies Act or LLP Act.
              </small>
            </div>

            <div className="param-control-card">
              <div className="param-card-header">
                <span className="param-label">Peak Annual Turnover</span>
                <span className="param-value-pill">₹{turnover} Crore / yr</span>
              </div>
              <input
                type="range"
                min={1}
                max={350}
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
                className="param-custom-slider"
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
                  ₹200 Cr Cap
                </button>
              </div>
            </div>

            <div className="param-control-card checks-column">
              <span className="param-label">Statutory Compliance Checkpoints</span>
              <div className="param-toggles-list">
                <button
                  type="button"
                  className={`param-toggle-item ${isOriginal ? "active" : ""}`}
                  onClick={() => setIsOriginal(!isOriginal)}
                >
                  <span className="toggle-box">{isOriginal ? "✓" : ""}</span>
                  <span className="toggle-text">100% Original Entity (Not formed by splitting existing firm)</span>
                </button>

                <button
                  type="button"
                  className={`param-toggle-item ${isInnovative ? "active" : ""}`}
                  onClick={() => setIsInnovative(!isInnovative)}
                >
                  <span className="toggle-box">{isInnovative ? "✓" : ""}</span>
                  <span className="toggle-text">Innovative Product/Service with Scalable Model</span>
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

          {/* Footer Bar */}
          <div className="diagnostic-footer-strip">
            <div className="footer-verdict-summary">
              {resultStatus !== "ineligible" ? (
                <div className="verdict-success-msg">
                  <span className="icon">✓</span>
                  <div>
                    <strong>Pre-Screening Verified: Eligible for DPIIT Status</strong>
                    <p>Qualifies for Section 80-IAC 3-year Tax Holiday, Angel Tax Exemption & RailPitch Priority.</p>
                  </div>
                </div>
              ) : (
                <div className="verdict-fail-msg">
                  <span className="icon">⚠️</span>
                  <div>
                    <strong>Requirements Incomplete: {failReasons[0]}</strong>
                    <p>Ensure legal entity type and revenue limits meet statutory DPIIT guidelines.</p>
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

      {/* ── 5 Criteria Cards (Theme-Aligned Executive Design) ──────────── */}
      <div className="dpiit-cards-grid">
        {CRITERIA_CARDS.map((card, idx) => (
          <article
            key={idx}
            className={`dpiit-theme-card ${card.highlight ? "highlighted-card" : ""}`}
          >
            {/* Top Header Row */}
            <div className="card-top-row">
              <span className="card-kicker">{card.kicker}</span>
              <span className="card-num">{card.num}</span>
            </div>

            {/* Bold Clear Title */}
            <h3 className="card-title">{card.title}</h3>

            {/* Concise Clean Description */}
            <p className="card-desc">{card.desc}</p>

            {/* Bottom Status Pill */}
            <div className={`card-pill ${card.highlight ? "highlight-pill" : ""}`}>
              <span>{card.pill}</span>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .dpiit-section {
          padding: 85px 5.2vw;
          background: #faf9f5;
          border-top: 1px solid #dbe1d9;
          border-bottom: 1px solid #dbe1d9;
        }

        .dpiit-header-wrap {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 34px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .dpiit-title {
          font-size: clamp(34px, 4.2vw, 56px);
          letter-spacing: -2.5px;
          line-height: 1;
          margin: 12px 0 0;
          color: #102720;
          font-weight: 850;
        }

        .dpiit-title em {
          font-family: Georgia, serif;
          color: #0f6b61;
          font-weight: 400;
          font-style: italic;
        }

        .dpiit-subtitle {
          max-width: 440px;
          color: #556c60;
          font-size: 14.5px;
          line-height: 1.6;
          margin: 0;
        }

        .dpiit-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
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
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dpiit-tab-btn.active {
          background: #ffffff;
          color: #0f6b61;
          box-shadow: 0 2px 8px rgba(16, 39, 32, 0.1);
        }

        .dpiit-tab-btn.active.deeptech {
          background: #0f6b61;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(15, 107, 97, 0.25);
        }

        .dpiit-quiz-toggle-btn {
          border: 1px solid #0f6b61;
          background: #eef7f3;
          color: #0f6b61;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dpiit-quiz-toggle-btn:hover {
          background: #0f6b61;
          color: #ffffff;
        }

        /* ── 5 Criteria Cards (Clean RailPitch Theme) ────────────── */
        .dpiit-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 18px;
        }

        .dpiit-theme-card {
          background: #ffffff;
          border: 1.5px solid #dce5e0;
          border-radius: 14px;
          padding: 24px 20px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 250px;
          box-shadow: 0 4px 16px rgba(16, 39, 32, 0.03);
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
        }

        .dpiit-theme-card:hover {
          transform: translateY(-4px);
          border-color: #0f6b61;
          box-shadow: 0 14px 32px rgba(15, 107, 97, 0.1);
        }

        .dpiit-theme-card.highlighted-card {
          background: #fbfdfc;
          border-color: #a3d9c2;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .card-kicker {
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #0f6b61;
        }

        .card-num {
          font-size: 11px;
          font-weight: 800;
          color: #9cb3a7;
          font-family: monospace;
        }

        .card-title {
          font-size: 21px;
          font-weight: 850;
          color: #102720;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin: 0 0 10px;
        }

        .card-desc {
          font-size: 12.5px;
          color: #556c60;
          line-height: 1.5;
          margin: 0 0 18px;
          flex: 1;
        }

        .card-pill {
          background: #f2f7f4;
          border: 1px solid #d4e5dc;
          border-radius: 20px;
          padding: 6px 12px;
          width: fit-content;
          margin-top: auto;
        }

        .card-pill span {
          font-size: 10.5px;
          font-weight: 800;
          color: #0f6b61;
          letter-spacing: 0.3px;
        }

        .card-pill.highlight-pill {
          background: #fff0eb;
          border-color: #ffd2c7;
        }

        .card-pill.highlight-pill span {
          color: #ea580c;
        }

        /* ── Diagnostic Calculator Styling ───────────────────────── */
        .dpiit-diagnostic-card {
          background: #ffffff;
          border: 1.5px solid #0f6b61;
          border-radius: 16px;
          padding: 26px 28px;
          margin-bottom: 30px;
          box-shadow: 0 16px 40px -10px rgba(15, 107, 97, 0.12);
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: slideDown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
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
          padding-bottom: 16px;
        }

        .diagnostic-kicker {
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.2px;
          color: #0f6b61;
          text-transform: uppercase;
        }

        .diagnostic-title {
          font-size: 21px;
          font-weight: 850;
          color: #102720;
          margin: 4px 0 2px;
          letter-spacing: -0.4px;
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
          border-radius: 10px;
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
        }

        .verdict-beacon-red {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ef4444;
        }

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
          accent-color: #0f6b61;
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
