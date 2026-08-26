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

  return (
    <section className="dpiit-section" id="dpiit">
      <div className="heading" style={{ marginBottom: "32px" }}>
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

      {/* Interactive Quiz Drawer / Modal */}
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
                <span>{currentYear - 10}</span>
                <span>{currentYear} (New)</span>
              </div>
            </div>

            <div className="dpiit-quiz-field">
              <label>Entity Structure</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              >
                <option value="pvt_ltd">Private Limited Company</option>
                <option value="llp">Limited Liability Partnership (LLP)</option>
                <option value="partnership">Registered Partnership Firm</option>
                <option value="coop">Cooperative Society</option>
                <option value="sole_prop">Sole Proprietorship / Unregistered</option>
                <option value="public_ltd">Public Limited Company</option>
              </select>
            </div>

            <div className="dpiit-quiz-field">
              <label>
                Max Annual Turnover in any FY: <b>₹{turnover} Crore</b>
              </label>
              <input
                type="range"
                min={0}
                max={400}
                step={5}
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
              />
              <div className="dpiit-range-labels">
                <span>₹0 Cr</span>
                <span>₹200 Cr</span>
                <span>₹300 Cr</span>
                <span>₹400 Cr</span>
              </div>
            </div>

            <div className="dpiit-quiz-field" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label>Business Characteristics</label>
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

      {/* 5 Dynamic Criteria Cards Grid */}
      <div className="dpiit-cards-grid">
        {/* Card 1: Company Age */}
        <article className="dpiit-card">
          <div className="dpiit-card-icon">⏳</div>
          <span className="dpiit-card-kicker">MAX COMPANY AGE</span>
          <h3>
            {activeTab === "normal" ? "Up to 10 Years" : "Up to 20 Years"}
          </h3>
          <p>
            From the date of incorporation or registration.{" "}
            {activeTab === "deeptech"
              ? "Deeptech startups receive an extended 20-year gestation window."
              : "Standard recognition applies for up to 10 years from inception."}
          </p>
          <div className="dpiit-card-pill">
            {activeTab === "normal" ? "Standard (10 Yrs)" : "Extended Deeptech (20 Yrs)"}
          </div>
        </article>

        {/* Card 2: Company Type */}
        <article className="dpiit-card">
          <div className="dpiit-card-icon">🏛️</div>
          <span className="dpiit-card-kicker">ELIGIBLE ENTITY TYPE</span>
          <h3>Pvt Ltd, LLP, Partnership</h3>
          <p>
            Private Limited Company, Registered Partnership Firm, Limited Liability
            Partnership (LLP), or Cooperative Society.
          </p>
          <div className="dpiit-card-pill">
            Sole Proprietorships Not Eligible
          </div>
        </article>

        {/* Card 3: Annual Turnover */}
        <article className="dpiit-card">
          <div className="dpiit-card-icon">📈</div>
          <span className="dpiit-card-kicker">TURNOVER CAP</span>
          <h3>
            {activeTab === "normal" ? "Max ₹200 Crore" : "Max ₹300 Crore"}
          </h3>
          <p>
            Turnover of the entity for any of the financial years since
            incorporation/registration must not exceed this statutory threshold.
          </p>
          <div className="dpiit-card-pill">
            {activeTab === "normal" ? "₹200 Cr Ceiling" : "₹300 Cr Deeptech Ceiling"}
          </div>
        </article>

        {/* Card 4: Original Entity */}
        <article className="dpiit-card">
          <div className="dpiit-card-icon">🛡️</div>
          <span className="dpiit-card-kicker">INDEPENDENT ENTITY</span>
          <h3>Not Formed by Splitting Up</h3>
          <p>
            The entity must be an original enterprise and must not be formed by
            splitting up or reconstructing an existing business.
          </p>
          <div className="dpiit-card-pill">
            100% Genuine New Enterprise
          </div>
        </article>

        {/* Card 5: Innovation & Scalability */}
        <article className="dpiit-card featured">
          <div className="dpiit-card-icon">🚀</div>
          <span className="dpiit-card-kicker">CORE THESIS</span>
          <h3>Innovation & Scalability</h3>
          <p>
            Must work towards development or improvement of products, processes,
            or services, or have a scalable business model with high potential for
            employment or wealth creation.
          </p>
          <div className="dpiit-card-pill highlight">
            Key Curation & Matching Factor
          </div>
        </article>
      </div>

      <style jsx>{`
        .dpiit-section {
          padding: 85px 5.2vw;
          background: #faf9f5;
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

        /* 5 Cards Grid */
        .dpiit-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px;
        }

        .dpiit-card {
          background: #ffffff;
          border: 1px solid #dce2d9;
          border-radius: 10px;
          padding: 24px 20px;
          box-shadow: 0 4px 16px rgba(16, 39, 32, 0.04);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .dpiit-card:hover {
          transform: translateY(-2px);
          border-color: #0f6b61;
          box-shadow: 0 8px 24px rgba(15, 107, 97, 0.08);
        }

        .dpiit-card.featured {
          background: #f8faf8;
          border-color: #9ac2b1;
        }

        .dpiit-card-icon {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .dpiit-card-kicker {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #0f6b61;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .dpiit-card h3 {
          font-size: 18px;
          letter-spacing: -0.6px;
          margin: 0 0 8px;
          color: var(--ink);
        }

        .dpiit-card p {
          font-size: 11.5px;
          line-height: 1.5;
          color: #607368;
          margin: 0 0 16px;
          flex: 1;
        }

        .dpiit-card-pill {
          background: #f4f7f4;
          border: 1px solid #dbe4dc;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 9px;
          font-weight: 700;
          color: #4b6154;
          display: inline-block;
          margin-top: auto;
        }

        .dpiit-card-pill.highlight {
          background: #def1e6;
          border-color: #b8dcce;
          color: #0f6b61;
        }

        @media (max-width: 800px) {
          .dpiit-section {
            padding: 60px 7vw;
          }
          .dpiit-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
