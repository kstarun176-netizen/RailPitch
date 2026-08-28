"use client";

import React, { useState } from "react";

export function DpiitEligibilityChecker({ onApply }: { onApply?: () => void }) {
  const [activeTab, setActiveTab] = useState<"normal" | "deeptech">("normal");
  const [showQuiz, setShowQuiz] = useState(false);

  // Simplified Clean Diagnostic State
  const [ageCategory, setAgeCategory] = useState<"early" | "growth" | "max" | "deeptech">("early");
  const [entity, setEntity] = useState<"pvt_ltd" | "llp" | "partnership" | "sole_prop">("pvt_ltd");
  const [revenue, setRevenue] = useState<"under_50" | "under_100" | "under_200" | "above_200">("under_50");
  const [isOriginal, setIsOriginal] = useState<boolean>(true);
  const [isInnovative, setIsInnovative] = useState<boolean>(true);

  // Live evaluation
  const isEligibleEntity = entity !== "sole_prop";
  const isAgeValid = ageCategory !== "deeptech" || activeTab === "deeptech";
  const isRevenueValid = revenue !== "above_200";
  const isEligible = isEligibleEntity && isRevenueValid && isOriginal && isInnovative;

  const CRITERIA_CARDS = [
    {
      num: "01",
      kicker: "MAX COMPANY AGE",
      title: activeTab === "normal" ? "Up to 10 Years" : "Up to 20 Years",
      desc:
        activeTab === "normal"
          ? "From date of incorporation. Standard recognition applies for up to 10 years."
          : "Extended 20-year gestation window granted for registered Deeptech startups.",
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

      {/* ── Tabs & Quick Diagnostic Button ─────────────────────────────── */}
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
          {showQuiz ? "✕ Close Quick Check" : "⚡ 30-Second Eligibility Check"}
        </button>
      </div>

      {/* ── Ultra-Clean Minimalist Diagnostic Drawer ───────────────────── */}
      {showQuiz && (
        <div className="dpiit-clean-diagnostic">
          <div className="clean-diagnostic-grid">
            {/* Step 1: Incorporation Age */}
            <div className="diagnostic-step">
              <span className="step-label">1. Company Age</span>
              <div className="step-pill-group">
                <button
                  type="button"
                  className={`step-pill ${ageCategory === "early" ? "active" : ""}`}
                  onClick={() => setAgeCategory("early")}
                >
                  1–3 Yrs
                </button>
                <button
                  type="button"
                  className={`step-pill ${ageCategory === "growth" ? "active" : ""}`}
                  onClick={() => setAgeCategory("growth")}
                >
                  4–7 Yrs
                </button>
                <button
                  type="button"
                  className={`step-pill ${ageCategory === "max" ? "active" : ""}`}
                  onClick={() => setAgeCategory("max")}
                >
                  8–10 Yrs
                </button>
                <button
                  type="button"
                  className={`step-pill ${ageCategory === "deeptech" ? "active" : ""}`}
                  onClick={() => setAgeCategory("deeptech")}
                >
                  11–20 Yrs
                </button>
              </div>
            </div>

            {/* Step 2: Legal Structure */}
            <div className="diagnostic-step">
              <span className="step-label">2. Entity Structure</span>
              <div className="step-pill-group">
                <button
                  type="button"
                  className={`step-pill ${entity === "pvt_ltd" ? "active" : ""}`}
                  onClick={() => setEntity("pvt_ltd")}
                >
                  Pvt Ltd
                </button>
                <button
                  type="button"
                  className={`step-pill ${entity === "llp" ? "active" : ""}`}
                  onClick={() => setEntity("llp")}
                >
                  LLP
                </button>
                <button
                  type="button"
                  className={`step-pill ${entity === "partnership" ? "active" : ""}`}
                  onClick={() => setEntity("partnership")}
                >
                  Partnership
                </button>
                <button
                  type="button"
                  className={`step-pill ${entity === "sole_prop" ? "active-ineligible" : ""}`}
                  onClick={() => setEntity("sole_prop")}
                >
                  Sole Prop
                </button>
              </div>
            </div>

            {/* Step 3: Peak Annual Turnover */}
            <div className="diagnostic-step">
              <span className="step-label">3. Annual Turnover</span>
              <div className="step-pill-group">
                <button
                  type="button"
                  className={`step-pill ${revenue === "under_50" ? "active" : ""}`}
                  onClick={() => setRevenue("under_50")}
                >
                  &lt; ₹50 Cr
                </button>
                <button
                  type="button"
                  className={`step-pill ${revenue === "under_100" ? "active" : ""}`}
                  onClick={() => setRevenue("under_100")}
                >
                  ₹50–100 Cr
                </button>
                <button
                  type="button"
                  className={`step-pill ${revenue === "under_200" ? "active" : ""}`}
                  onClick={() => setRevenue("under_200")}
                >
                  ₹100–200 Cr
                </button>
                <button
                  type="button"
                  className={`step-pill ${revenue === "above_200" ? "active-ineligible" : ""}`}
                  onClick={() => setRevenue("above_200")}
                >
                  &gt; ₹200 Cr
                </button>
              </div>
            </div>

            {/* Step 4: Verification Toggles */}
            <div className="diagnostic-step">
              <span className="step-label">4. Key Criteria</span>
              <div className="step-pill-group">
                <button
                  type="button"
                  className={`step-pill ${isOriginal ? "active" : ""}`}
                  onClick={() => setIsOriginal(!isOriginal)}
                >
                  {isOriginal ? "✓ Original Entity" : "✕ Split/Reconstructed"}
                </button>
                <button
                  type="button"
                  className={`step-pill ${isInnovative ? "active" : ""}`}
                  onClick={() => setIsInnovative(!isInnovative)}
                >
                  {isInnovative ? "✓ Scalable Model" : "✕ Standard Model"}
                </button>
              </div>
            </div>
          </div>

          {/* Clean Instant Result Bar */}
          <div className="clean-verdict-bar">
            <div className="verdict-left">
              {isEligible ? (
                <div className="verdict-badge-success">
                  <span className="verdict-dot" />
                  <strong>DPIIT Eligible Candidate</strong>
                  <span>Qualifies for 80-IAC Tax Holiday &amp; RailPitch Cohort</span>
                </div>
              ) : (
                <div className="verdict-badge-warning">
                  <span className="verdict-dot red" />
                  <strong>Criteria Incomplete</strong>
                  <span>Entity structure or turnover exceeds statutory limit</span>
                </div>
              )}
            </div>

            {onApply && (
              <button
                type="button"
                className="clean-apply-cta"
                onClick={onApply}
              >
                Apply for RailPitch Journey →
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
            <div className="card-top-row">
              <span className="card-kicker">{card.kicker}</span>
              <span className="card-num">{card.num}</span>
            </div>

            <h3 className="card-title">{card.title}</h3>
            <p className="card-desc">{card.desc}</p>

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

        /* ── Ultra-Clean Minimalist Diagnostic Drawer ────────────── */
        .dpiit-clean-diagnostic {
          background: #ffffff;
          border: 1.5px solid #0f6b61;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 28px;
          box-shadow: 0 12px 32px -8px rgba(15, 107, 97, 0.08);
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .clean-diagnostic-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 20px;
        }

        .diagnostic-step {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .step-label {
          font-size: 11px;
          font-weight: 850;
          color: #102720;
          letter-spacing: 0.2px;
        }

        .step-pill-group {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .step-pill {
          flex: 1;
          min-width: 60px;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1.5px solid #dce5e0;
          background: #fbfdfc;
          font-size: 11.5px;
          font-weight: 750;
          color: #40574b;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
          white-space: nowrap;
        }

        .step-pill:hover {
          border-color: #0f6b61;
          color: #0f6b61;
        }

        .step-pill.active {
          background: #0f6b61;
          color: #ffffff;
          border-color: #0f6b61;
          box-shadow: 0 2px 8px rgba(15, 107, 97, 0.2);
        }

        .step-pill.active-ineligible {
          background: #fff1f2;
          color: #be123c;
          border-color: #fecdd3;
        }

        .clean-verdict-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-top: 1px solid #edf2ee;
          padding-top: 18px;
          flex-wrap: wrap;
        }

        .verdict-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .verdict-badge-success,
        .verdict-badge-warning {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
        }

        .verdict-badge-success {
          background: #eef8f3;
          border: 1px solid #c2dfcf;
          color: #0c564e;
        }

        .verdict-badge-warning {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #9f1239;
        }

        .verdict-badge-success strong,
        .verdict-badge-warning strong {
          font-weight: 850;
        }

        .verdict-badge-success span,
        .verdict-badge-warning span {
          color: #556c60;
          font-size: 11.5px;
        }

        .verdict-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          flex-shrink: 0;
        }

        .verdict-dot.red {
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
        }

        .clean-apply-cta {
          background: #102720;
          color: #ffffff;
          border: 0;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .clean-apply-cta:hover {
          background: #0f6b61;
          transform: translateY(-1px);
        }

        /* ── 5 Criteria Cards ────────────────────────────────────── */
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

        @media (max-width: 1100px) {
          .dpiit-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .clean-diagnostic-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dpiit-section {
            padding: 60px 4vw;
          }
          .dpiit-cards-grid {
            grid-template-columns: 1fr;
          }
          .clean-diagnostic-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
