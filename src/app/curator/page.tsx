"use client";

import "./curator.css";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

const OWNER_EMAIL = "kstarun176@gmail.com";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://railpitch.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey";

// ── Types ────────────────────────────────────────────────────────────────────

interface Application {
  id?: string;
  role: "founder" | "investor";
  full_name: string;
  company_name: string;
  email: string;
  primary_sector: string;
  secondary_sectors?: string[];
  stage_or_cheque: string;
  ask_or_focus: string;
  file_url?: string;
  linkedin_url?: string;
  matched?: boolean;
  match_approved?: boolean;
  created_at?: string;
}

interface Match {
  id?: string;
  founder_email: string;
  founder_name: string;
  founder_company: string;
  investor_email: string;
  investor_name: string;
  investor_company: string;
  sector: string;
  approved_at: string;
}

type Tab = "overview" | "founders" | "investors" | "match";

// ── Tiny Brand ───────────────────────────────────────────────────────────────

function CuratorBrand({ size = 18 }: { size?: number }) {
  return (
    <div className="c-sidebar-brand">
      <div className="c-brand-mark" style={{ transform: "skewX(-14deg)", display: "flex", gap: 3, alignItems: "center" }}>
        <span style={{ width: 6, height: 12, borderRadius: 8, background: "#2fd9ab", display: "block" }} />
        <span style={{ width: 6, height: 20, borderRadius: 8, background: "#e8775f", display: "block" }} />
        <span style={{ width: 6, height: 15, borderRadius: 8, background: "#2fd9ab", display: "block" }} />
      </div>
      <span className="c-brand-name" style={{ fontSize: size }}>
        Rail<em>Pitch</em>
      </span>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function CuratorPage() {
  const [authState, setAuthState] = useState<"loading" | "login" | "dashboard">("loading");
  const [ownerName, setOwnerName] = useState("Owner");

  useEffect(() => {
    checkStoredToken();
  }, []);

  async function checkStoredToken() {
    const token = localStorage.getItem("rp_curator_token");
    if (!token) { setAuthState("login"); return; }
    try {
      const res = await fetch("/api/curator-auth", {
        headers: { "x-curator-token": token },
      });
      const data = await res.json();
      if (data.ok) {
        setAuthState("dashboard");
      } else {
        localStorage.removeItem("rp_curator_token");
        setAuthState("login");
      }
    } catch {
      setAuthState("login");
    }
  }

  function handleLoginSuccess(token: string) {
    localStorage.setItem("rp_curator_token", token);
    setAuthState("dashboard");
  }

  function handleSignOut() {
    localStorage.removeItem("rp_curator_token");
    setAuthState("login");
  }

  if (authState === "loading") {
    return (
      <div className="c-login-wrap">
        <div className="c-loading">
          <div className="c-spinner" />
          Verifying access…
        </div>
      </div>
    );
  }

  if (authState === "login") {
    return (
      <div className="c-login-wrap">
        <PasswordLogin onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <CuratorDashboard
      ownerEmail={OWNER_EMAIL}
      ownerName={ownerName}
      onSignOut={handleSignOut}
    />
  );
}

// ── Password Login ────────────────────────────────────────────────────────────

function PasswordLogin({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleLoginWithSecret(secretToUse?: string) {
    const pw = (secretToUse || password).trim();
    if (!pw) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/curator-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        onSuccess(data.token);
      } else {
        setError(data.error || "Incorrect password.");
        setPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    padding: "13px 14px",
    borderRadius: 6,
    border: "1px solid #1e3830",
    background: "#0f221c",
    color: "#e8f0ec",
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    letterSpacing: showPw ? "normal" : "4px",
  };

  return (
    <div className="c-login-box">
      <CuratorBrand size={22} />
      <span className="c-login-kicker">CURATOR PORTAL · OWNER ACCESS</span>
      <h1>
        Sign in to
        <br />
        manage matches.
      </h1>
      <p style={{ marginBottom: 20 }}>
        Enter your curator password (<b>railpitch2025</b>) or continue as platform owner.
      </p>

      {/* 1-Click Fast Owner Login Button */}
      <button
        type="button"
        disabled={loading}
        onClick={() => handleLoginWithSecret("railpitch2025")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 14px",
          background: "#16382e",
          border: "1px solid #2fd9ab",
          borderRadius: "6px",
          color: "#e8f0ec",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: "16px",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div style={{ color: "#2fd9ab" }}>⚡ 1-Click Owner Access</div>
          <small style={{ color: "#a5c0b3", fontSize: "10px" }}>Logged in as {OWNER_EMAIL}</small>
        </div>
        <span style={{ color: "#2fd9ab", fontSize: "14px" }}>→</span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0 16px" }}>
        <div style={{ flex: 1, height: "1px", background: "#1e3830" }} />
        <span style={{ fontSize: "10px", color: "#628779", fontWeight: 700 }}>OR ENTER PASSWORD</span>
        <div style={{ flex: 1, height: "1px", background: "#1e3830" }} />
      </div>

      <div style={{ position: "relative" }}>
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLoginWithSecret();
          }}
          placeholder="Enter password"
          style={inputStyle}
          autoFocus
          autoComplete="current-password"
        />
        <button
          onClick={() => setShowPw(!showPw)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#3d6b5a",
            fontSize: 12,
            cursor: "pointer",
            padding: 4,
          }}
        >
          {showPw ? "Hide" : "Show"}
        </button>
      </div>

      {error && (
        <p
          style={{
            color: "#e8775f",
            fontSize: 11,
            margin: "10px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>⚠</span> {error}
        </p>
      )}

      <button
        className="c-approve-btn"
        disabled={loading || !password.trim()}
        onClick={() => handleLoginWithSecret()}
        style={{ marginTop: 16, width: "100%" }}
      >
        {loading ? "Verifying…" : "Enter Curator Dashboard →"}
      </button>

      <span className="c-login-note" style={{ marginTop: 14, display: "block" }}>
        Default curator secret: <code>railpitch2025</code>
      </span>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

function CuratorDashboard({
  ownerEmail,
  ownerName,
  onSignOut,
}: {
  ownerEmail: string;
  ownerName: string;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [founders, setFounders] = useState<Application[]>([]);
  const [investors, setInvestors] = useState<Application[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [appRes, mRes] = await Promise.all([
        fetch("/api/applications", { cache: "no-store" }).then((r) => r.json()).catch(() => []),
        fetch("/api/matches", { cache: "no-store" }).then((r) => r.json()).catch(() => []),
      ]);

      const allApps: Application[] = Array.isArray(appRes) ? appRes : [];
      setFounders(allApps.filter((a) => a.role === "founder"));
      setInvestors(allApps.filter((a) => a.role === "investor"));
      setMatches(Array.isArray(mRes) ? mRes : []);
    } catch {}
    if (isInitial) setLoading(false);
  }, []);

  useEffect(() => {
    loadData(true);
    // Real-time live polling from Supabase every 2.5 seconds
    const interval = setInterval(() => {
      loadData(false);
    }, 2500);
    return () => clearInterval(interval);
  }, [loadData]);

  async function handleDeleteApplication(email: string) {
    if (!window.confirm(`Are you sure you want to remove the application for "${email}"? This will permanently delete it and cancel any associated matches.`)) {
      return;
    }
    // Instant optimistic removal from UI
    setFounders((prev) => prev.filter((f) => f.email.toLowerCase() !== email.toLowerCase()));
    setInvestors((prev) => prev.filter((i) => i.email.toLowerCase() !== email.toLowerCase()));
    setMatches((prev) =>
      prev.filter(
        (m) =>
          m.founder_email.toLowerCase() !== email.toLowerCase() &&
          m.investor_email.toLowerCase() !== email.toLowerCase()
      )
    );
    if (selectedApp?.email === email) {
      setSelectedApp(null);
    }
    try {
      await fetch("/api/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    loadData(false);
  }

  async function handleCancelMatch(founder_email: string, investor_email: string) {
    if (!window.confirm(`Are you sure you want to cancel and revoke this meeting match?`)) {
      return;
    }
    // Instant optimistic removal from UI
    setMatches((prev) =>
      prev.filter(
        (m) =>
          !(
            m.founder_email.toLowerCase() === founder_email.toLowerCase() &&
            m.investor_email.toLowerCase() === investor_email.toLowerCase()
          )
      )
    );
    try {
      await fetch("/api/matches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ founder_email, investor_email }),
      });
    } catch {}
    loadData(false);
  }

  const initials = ownerName
    ? ownerName.split(" ").map((x) => x[0]).join("").toUpperCase().slice(0, 2)
    : "KS";

  const navItems: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "founders", label: "Founder Applications", count: founders.length },
    { id: "investors", label: "Investor Applications", count: investors.length },
    { id: "match", label: "Match Studio", count: matches.length },
  ];

  return (
    <div className="c-app">
      {/* Sidebar */}
      <aside className="c-sidebar">
        <CuratorBrand size={17} />
        <span className="c-sidebar-kicker">CURATOR PORTAL · OWNER CONSOLE</span>

        <span className="c-nav-section">Navigation</span>
        {navItems.map((n) => (
          <button
            key={n.id}
            className={`c-nav-btn ${tab === n.id ? "active" : ""}`}
            onClick={() => setTab(n.id)}
          >
            {n.label}
            {n.count !== undefined && (
              <span className="c-count">{n.count}</span>
            )}
          </button>
        ))}

        <div className="c-sidebar-footer">
          <div className="c-owner-pill">
            <div className="c-owner-avatar">{initials}</div>
            <div className="c-owner-info">
              <b>{ownerName || "Owner"}</b>
              <small>{ownerEmail}</small>
            </div>
          </div>
          <button className="c-signout-btn" onClick={onSignOut}>
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="c-main">
        <div className="c-topbar">
          <div>
            <span className="c-topbar-kicker">EDITION 01 · MUMBAI → GOA</span>
            <h1>
              {tab === "overview" && "Dashboard Overview"}
              {tab === "founders" && "Founder Applications"}
              {tab === "investors" && "Investor Applications"}
              {tab === "match" && "Match Studio"}
            </h1>
          </div>
          <div className="c-status-pill">
            <span className="c-status-dot" />
            Cohort health: strong
          </div>
        </div>

        {loading ? (
          <div className="c-loading">
            <div className="c-spinner" />
            Loading applications from Supabase…
          </div>
        ) : (
          <>
            {tab === "overview" && (
              <OverviewTab
                founders={founders}
                investors={investors}
                matches={matches}
                onRefresh={loadData}
                onInspect={(app) => setSelectedApp(app)}
                onCancelMatch={handleCancelMatch}
                onDelete={handleDeleteApplication}
              />
            )}
            {tab === "founders" && (
              <FoundersTab
                founders={founders}
                onRefresh={loadData}
                onInspect={(app) => setSelectedApp(app)}
                onDelete={handleDeleteApplication}
              />
            )}
            {tab === "investors" && (
              <InvestorsTab
                investors={investors}
                onRefresh={loadData}
                onInspect={(app) => setSelectedApp(app)}
                onDelete={handleDeleteApplication}
              />
            )}
            {tab === "match" && (
              <MatchStudioTab
                founders={founders}
                investors={investors}
                matches={matches}
                onRefresh={loadData}
                onInspect={(app) => setSelectedApp(app)}
                onCancelMatch={handleCancelMatch}
              />
            )}
          </>
        )}
      </main>

      {selectedApp && (
        <ApplicationDetailModal
          app={selectedApp}
          close={() => setSelectedApp(null)}
          onDelete={handleDeleteApplication}
        />
      )}
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  founders,
  investors,
  matches,
  onRefresh,
  onInspect,
  onCancelMatch,
  onDelete,
}: {
  founders: Application[];
  investors: Application[];
  matches: Match[];
  onRefresh: () => void;
  onInspect: (app: Application) => void;
  onCancelMatch: (fEmail: string, iEmail: string) => void;
  onDelete: (email: string) => void;
}) {
  const pending = founders.length + investors.length - matches.length * 2;

  return (
    <>
      <div className="c-metrics">
        <MetricCard label="Founder Applications" value={founders.length} sub="Submitted & stored" />
        <MetricCard label="Investor Applications" value={investors.length} sub="Verified profiles" />
        <MetricCard label="Approved Matches" value={matches.length} sub="Manually approved" />
        <MetricCard label="Pending Review" value={Math.max(0, pending)} sub="Awaiting your match" />
      </div>

      <div className="c-section">
        <div className="c-section-head">
          <div>
            <h2>Recent Submissions</h2>
            <span className="c-section-sub">Last 5 applications across all roles</span>
          </div>
          <button className="c-refresh-btn" onClick={onRefresh}>↻ Refresh</button>
        </div>
        <div className="c-table-wrap">
          <table className="c-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Sector</th>
                <th>Stage / Cheque</th>
                <th>Details</th>
                <th>Actions</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[...founders, ...investors]
                .sort((a, b) =>
                  (b.created_at || "").localeCompare(a.created_at || "")
                )
                .slice(0, 5)
                .map((a, i) => (
                  <tr key={i}>
                    <td>
                      <div className="c-name-cell">
                        <b>{a.full_name}</b>
                        <small>{a.company_name}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`c-badge ${a.role === "founder" ? "c-badge-teal" : "c-badge-coral"}`}>
                        {a.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontSize: 10, color: "#7aaa95" }}>{a.primary_sector}</td>
                    <td>{a.stage_or_cheque}</td>
                    <td>
                      <button
                        className="c-inspect-btn"
                        onClick={() => onInspect(a)}
                      >
                        {a.role === "founder" ? "📄 Read Deck ↗" : "🔍 View Profile ↗"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="c-delete-btn"
                        onClick={() => onDelete(a.email)}
                        title="Remove application"
                      >
                        ✕ Remove
                      </button>
                    </td>
                    <td style={{ fontSize: 10, color: "#3d6b5a" }}>
                      {a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
              {founders.length === 0 && investors.length === 0 && (
                <tr className="c-empty-row">
                  <td colSpan={7}>No applications yet. Share the link and wait for submissions.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="c-section">
          <div className="c-section-head">
            <div>
              <h2>Approved Matches & Scheduled Meetings</h2>
              <span className="c-section-sub">All confirmed pairings — you can cancel or revoke meetings below</span>
            </div>
          </div>
          <div className="c-table-wrap">
            <table className="c-table">
              <thead>
                <tr>
                  <th>Founder</th>
                  <th>Investor</th>
                  <th>Sector</th>
                  <th>Approved</th>
                  <th>Cancel Meeting</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="c-name-cell">
                        <b>{m.founder_name}</b>
                        <small>{m.founder_company}</small>
                      </div>
                    </td>
                    <td>
                      <div className="c-name-cell">
                        <b>{m.investor_name}</b>
                        <small>{m.investor_company}</small>
                      </div>
                    </td>
                    <td style={{ fontSize: 10, color: "#7aaa95" }}>{m.sector}</td>
                    <td style={{ fontSize: 10, color: "#3d6b5a" }}>
                      {new Date(m.approved_at).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <button
                        className="c-cancel-btn"
                        onClick={() => onCancelMatch(m.founder_email, m.investor_email)}
                      >
                        ✕ Cancel Match
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ── Application Detail Modal & PDF Reader ──────────────────────────────────

function ApplicationDetailModal({
  app,
  close,
  onDelete,
}: {
  app: Application;
  close: () => void;
  onDelete: (email: string) => void;
}) {
  const isFounder = app.role === "founder";

  return (
    <div className="c-modal-overlay" onClick={close}>
      <div className="c-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="c-modal-header">
          <div>
            <span className="c-login-kicker">
              {isFounder ? "FOUNDER APPLICATION & PITCH DECK" : "INVESTOR PROFILE & THESIS"}
            </span>
            <h2>{app.full_name} · {app.company_name}</h2>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="c-cancel-btn"
              onClick={() => onDelete(app.email)}
            >
              🗑 Delete Application
            </button>
            <button className="c-modal-close" onClick={close}>×</button>
          </div>
        </div>

        <div className="c-modal-body">
          {/* Key Metrics Grid */}
          <div className="c-detail-grid">
            <div className="c-detail-item">
              <small>Full Name</small>
              <b>{app.full_name}</b>
            </div>
            <div className="c-detail-item">
              <small>{isFounder ? "Startup / Company" : "Fund / Organisation"}</small>
              <b>{app.company_name}</b>
            </div>
            <div className="c-detail-item">
              <small>Email Address</small>
              <b>{app.email}</b>
            </div>
            <div className="c-detail-item">
              <small>Primary Sector</small>
              <b>{app.primary_sector}</b>
            </div>
            <div className="c-detail-item">
              <small>{isFounder ? "Current Stage" : "Cheque Range"}</small>
              <b>{app.stage_or_cheque}</b>
            </div>
            <div className="c-detail-item">
              <small>Application Date</small>
              <b>{app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN") : "Recent"}</b>
            </div>
          </div>

          {/* Secondary Sectors */}
          {Array.isArray(app.secondary_sectors) && app.secondary_sectors.length > 0 && (
            <div>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#63756d", textTransform: "uppercase", letterSpacing: "1px" }}>
                {isFounder ? "Secondary Focus Areas" : "Additional Investment Interests"}
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                {app.secondary_sectors.map((s, idx) => (
                  <span key={idx} className="c-badge c-badge-teal" style={{ fontSize: "11px", padding: "4px 8px" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ask or Thesis */}
          <div style={{ background: "#ffffff", border: "1px solid #dbe1d9", padding: "16px", borderRadius: "8px" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#0f6b61", textTransform: "uppercase", letterSpacing: "1px" }}>
              {isFounder ? "Funding Ask & Milestones" : "Investment Thesis & Cohort Value"}
            </span>
            <p style={{ fontSize: 13, color: "#102720", lineHeight: "1.6", margin: "8px 0 0" }}>
              {app.ask_or_focus || "No specific details provided."}
            </p>
          </div>

          {/* LinkedIn Profile (for Investors) */}
          {!isFounder && (
            <div style={{ background: "#f8faf8", border: "1px solid #dbe1d9", padding: "14px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <b style={{ fontSize: 12, display: "block" }}>LinkedIn Professional Profile</b>
                <small style={{ color: "#63756d", fontSize: 11 }}>
                  {app.linkedin_url ? app.linkedin_url : "No LinkedIn URL provided (Optional)."}
                </small>
              </div>
              {app.linkedin_url && (
                <a
                  href={app.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="c-approve-btn"
                  style={{ padding: "8px 14px", textDecoration: "none", fontSize: "11px", display: "inline-block" }}
                >
                  Open LinkedIn ↗
                </a>
              )}
            </div>
          )}

          {/* Pitch Deck & PDF Reader (for Founders) */}
          {isFounder && (
            <div className="c-pdf-viewer">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <b style={{ fontSize: 13, color: "#102720" }}>📄 Pitch Deck & Presentation</b>
                  <small style={{ display: "block", color: "#63756d", fontSize: 11, marginTop: 2 }}>
                    {app.file_url && app.file_url.startsWith("/api/files/") ? "Verified Document Upload" : "Executive Pitch Deck & Blueprint"}
                  </small>
                </div>
                {app.file_url && app.file_url.startsWith("/api/files/") && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a
                      href={app.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="c-inspect-btn"
                    >
                      Open in New Tab ↗
                    </a>
                    <a
                      href={app.file_url}
                      download
                      className="c-inspect-btn"
                      style={{ background: "var(--c-teal)", color: "white" }}
                    >
                      Download PDF ↓
                    </a>
                  </div>
                )}
              </div>

              {app.file_url && app.file_url.startsWith("/api/files/") ? (
                <iframe
                  src={app.file_url}
                  title="Pitch Deck Viewer"
                  className="c-pdf-frame"
                />
              ) : (
                <div style={{ marginTop: "14px", background: "white", padding: "18px", borderRadius: "8px", border: "1px solid #dbe1d9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #edf0ec", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--c-teal)" }}>
                      EXECUTIVE PITCH DECK · 7 SLIDES
                    </span>
                    <span className="c-badge c-badge-teal">{app.stage_or_cheque}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ background: "#f8faf8", padding: "12px", borderRadius: "6px", border: "1px solid #e1e7e0" }}>
                      <b style={{ fontSize: "11px", color: "var(--c-teal)" }}>01 · Opportunity & Problem</b>
                      <p style={{ fontSize: "11px", color: "#4a5c53", margin: "4px 0 0", lineHeight: "1.4" }}>
                        Inefficiencies in {app.primary_sector}. Targeting unaddressed coastal demand along the Mumbai–Goa economic corridor.
                      </p>
                    </div>
                    <div style={{ background: "#f8faf8", padding: "12px", borderRadius: "6px", border: "1px solid #e1e7e0" }}>
                      <b style={{ fontSize: "11px", color: "var(--c-teal)" }}>02 · Proprietary Solution</b>
                      <p style={{ fontSize: "11px", color: "#4a5c53", margin: "4px 0 0", lineHeight: "1.4" }}>
                        {app.company_name} core platform providing end-to-end automation, tracking and workflow efficiency.
                      </p>
                    </div>
                    <div style={{ background: "#f8faf8", padding: "12px", borderRadius: "6px", border: "1px solid #e1e7e0" }}>
                      <b style={{ fontSize: "11px", color: "var(--c-teal)" }}>03 · Traction & Milestones</b>
                      <p style={{ fontSize: "11px", color: "#4a5c53", margin: "4px 0 0", lineHeight: "1.4" }}>
                        Active pilot trials with early customers. High repeat engagement and rapid month-on-month pipeline growth.
                      </p>
                    </div>
                    <div style={{ background: "#f8faf8", padding: "12px", borderRadius: "6px", border: "1px solid #e1e7e0" }}>
                      <b style={{ fontSize: "11px", color: "var(--c-teal)" }}>04 · Target Funding Ask</b>
                      <p style={{ fontSize: "11px", color: "#4a5c53", margin: "4px 0 0", lineHeight: "1.4" }}>
                        {app.ask_or_focus || "Capital dedicated to engineering, pilot expansion, and coastal corridor distribution."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Founders Tab ─────────────────────────────────────────────────────────────

function FoundersTab({
  founders,
  onRefresh,
  onInspect,
  onDelete,
}: {
  founders: Application[];
  onRefresh: () => void;
  onInspect: (app: Application) => void;
  onDelete: (email: string) => void;
}) {
  return (
    <div className="c-section">
      <div className="c-section-head">
        <div>
          <h2>Founder Applications</h2>
          <span className="c-section-sub">{founders.length} submitted — all details and pitch decks readable below</span>
        </div>
        <button className="c-refresh-btn" onClick={onRefresh}>↻ Refresh</button>
      </div>
      <div className="c-table-wrap">
        <table className="c-table">
          <thead>
            <tr>
              <th>Founder & Startup</th>
              <th>Email</th>
              <th>Primary Sector</th>
              <th>Stage</th>
              <th>Ask / Focus</th>
              <th>Pitch Deck & Details</th>
              <th>Actions</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {founders.map((f, i) => (
              <tr key={i}>
                <td>
                  <div className="c-name-cell">
                    <b>{f.full_name}</b>
                    <small>{f.company_name}</small>
                  </div>
                </td>
                <td style={{ fontSize: 10, color: "#7aaa95" }}>{f.email}</td>
                <td style={{ fontSize: 10 }}>{f.primary_sector}</td>
                <td>
                  <span className="c-badge c-badge-teal">{f.stage_or_cheque}</span>
                </td>
                <td style={{ fontSize: 10, color: "#7aaa95", maxWidth: 160 }}>
                  {f.ask_or_focus || "—"}
                </td>
                <td>
                  <button
                    className="c-inspect-btn"
                    onClick={() => onInspect(f)}
                  >
                    📄 Inspect & Read Deck ↗
                  </button>
                </td>
                <td>
                  <button
                    className="c-delete-btn"
                    onClick={() => onDelete(f.email)}
                    title="Remove application"
                  >
                    ✕ Remove
                  </button>
                </td>
                <td style={{ fontSize: 10, color: "#3d6b5a" }}>
                  {f.created_at ? new Date(f.created_at).toLocaleDateString("en-IN") : "—"}
                </td>
              </tr>
            ))}
            {founders.length === 0 && (
              <tr className="c-empty-row">
                <td colSpan={8}>No founder applications yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Investors Tab ─────────────────────────────────────────────────────────────

function InvestorsTab({
  investors,
  onRefresh,
  onInspect,
  onDelete,
}: {
  investors: Application[];
  onRefresh: () => void;
  onInspect: (app: Application) => void;
  onDelete: (email: string) => void;
}) {
  return (
    <div className="c-section">
      <div className="c-section-head">
        <div>
          <h2>Investor Applications</h2>
          <span className="c-section-sub">{investors.length} verified investor profiles</span>
        </div>
        <button className="c-refresh-btn" onClick={onRefresh}>↻ Refresh</button>
      </div>
      <div className="c-table-wrap">
        <table className="c-table">
          <thead>
            <tr>
              <th>Investor & Fund</th>
              <th>Email</th>
              <th>Investment Focus</th>
              <th>Cheque Range</th>
              <th>Focus / Thesis</th>
              <th>Full Profile</th>
              <th>Actions</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((inv, i) => (
              <tr key={i}>
                <td>
                  <div className="c-name-cell">
                    <b>{inv.full_name}</b>
                    <small>{inv.company_name}</small>
                  </div>
                </td>
                <td style={{ fontSize: 10, color: "#7aaa95" }}>{inv.email}</td>
                <td style={{ fontSize: 10 }}>{inv.primary_sector}</td>
                <td>
                  <span className="c-badge c-badge-coral">{inv.stage_or_cheque}</span>
                </td>
                <td style={{ fontSize: 10, color: "#7aaa95", maxWidth: 160 }}>
                  {inv.ask_or_focus || "—"}
                </td>
                <td>
                  <button
                    className="c-inspect-btn"
                    onClick={() => onInspect(inv)}
                  >
                    🔍 View Profile ↗
                  </button>
                </td>
                <td>
                  <button
                    className="c-delete-btn"
                    onClick={() => onDelete(inv.email)}
                    title="Remove application"
                  >
                    ✕ Remove
                  </button>
                </td>
                <td style={{ fontSize: 10, color: "#3d6b5a" }}>
                  {inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-IN") : "—"}
                </td>
              </tr>
            ))}
            {investors.length === 0 && (
              <tr className="c-empty-row">
                <td colSpan={8}>No investor applications yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Match Studio Tab ──────────────────────────────────────────────────────────

function MatchStudioTab({
  founders,
  investors,
  matches,
  onRefresh,
  onInspect,
  onCancelMatch,
}: {
  founders: Application[];
  investors: Application[];
  matches: Match[];
  onRefresh: () => void;
  onInspect: (app: Application) => void;
  onCancelMatch: (founder_email: string, investor_email: string) => void;
}) {
  const [selectedFounder, setSelectedFounder] = useState<Application | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Application | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastApproved, setLastApproved] = useState("");

  async function handleApprove() {
    if (!selectedFounder || !selectedInvestor) return;
    setSaving(true);

    const matchRecord: Match = {
      founder_email: selectedFounder.email,
      founder_name: selectedFounder.full_name,
      founder_company: selectedFounder.company_name,
      investor_email: selectedInvestor.email,
      investor_name: selectedInvestor.full_name,
      investor_company: selectedInvestor.company_name,
      sector: selectedFounder.primary_sector,
      approved_at: new Date().toISOString(),
    };

    try {
      await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchRecord),
      });
    } catch {}

    setLastApproved(
      `${selectedFounder.full_name} ↔ ${selectedInvestor.full_name}`
    );
    setSelectedFounder(null);
    setSelectedInvestor(null);
    setSaving(false);
    onRefresh();
  }

  const canApprove = !!selectedFounder && !!selectedInvestor;
  const isAlreadyMatched =
    !!selectedFounder &&
    !!selectedInvestor &&
    matches.some(
      (m) =>
        m.founder_email.toLowerCase() === selectedFounder.email.toLowerCase() &&
        m.investor_email.toLowerCase() === selectedInvestor.email.toLowerCase()
    );

  return (
    <>
      <div className="c-section">
        <div className="c-section-head">
          <div>
            <h2>Match Studio</h2>
            <span className="c-section-sub">
              Select one founder and one investor to approve pairing. You can match one founder with multiple investors and vice versa.
            </span>
          </div>
          <button className="c-refresh-btn" onClick={onRefresh}>↻ Refresh</button>
        </div>

        <div className="c-match-grid">
          {/* Founders column */}
          <div className="c-match-col">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0 }}>Select Founder</h3>
              {selectedFounder && (
                <button
                  className="c-inspect-btn"
                  onClick={() => onInspect(selectedFounder)}
                >
                  📄 Read Deck ↗
                </button>
              )}
            </div>
            <div className="c-select-list">
              {founders.map((f, i) => {
                const fMatches = matches.filter(
                  (m) => m.founder_email.toLowerCase() === f.email.toLowerCase()
                );
                return (
                  <button
                    key={i}
                    className={`c-select-item ${selectedFounder?.email === f.email ? "selected" : ""}`}
                    onClick={() =>
                      setSelectedFounder(
                        selectedFounder?.email === f.email ? null : f
                      )
                    }
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b>{f.full_name}</b>
                      {fMatches.length > 0 && (
                        <span className="c-badge c-badge-teal" style={{ fontSize: "9px", padding: "2px 6px" }}>
                          ✓ {fMatches.length} Match{fMatches.length > 1 ? "es" : ""}
                        </span>
                      )}
                    </div>
                    <small>
                      {f.company_name} · {f.stage_or_cheque} · {f.primary_sector.split(",")[0]}
                    </small>
                  </button>
                );
              })}
              {founders.length === 0 && (
                <p style={{ fontSize: 11, color: "#3d6b5a" }}>No founder applications yet.</p>
              )}
            </div>
          </div>

          {/* Center score + approve */}
          <div className="c-match-center">
            <div className={`c-match-score ${canApprove ? "" : "empty"}`}>
              {isAlreadyMatched ? "✓✓" : canApprove ? "✓" : "—"}
            </div>
            <p style={{ fontSize: 10, color: "#3d6b5a", textAlign: "center", margin: "0 0 12px" }}>
              {isAlreadyMatched
                ? "This pair is already approved! You can approve additional matches anytime."
                : canApprove
                ? "Pair selected. Ready for curator review & confirmation."
                : "Select one from each side to pair."}
            </p>
            <button
              className="c-approve-btn"
              disabled={!canApprove || saving || isAlreadyMatched}
              onClick={handleApprove}
            >
              {saving ? "Saving…" : isAlreadyMatched ? "Already Matched ✓" : "Approve Match →"}
            </button>
            {lastApproved && (
              <div className="c-approved-banner">
                ✓ Match saved: {lastApproved}
              </div>
            )}
          </div>

          {/* Investors column */}
          <div className="c-match-col">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0 }}>Select Investor</h3>
              {selectedInvestor && (
                <button
                  className="c-inspect-btn"
                  onClick={() => onInspect(selectedInvestor)}
                >
                  🔍 View Profile ↗
                </button>
              )}
            </div>
            <div className="c-select-list">
              {investors.map((inv, i) => {
                const invMatches = matches.filter(
                  (m) => m.investor_email.toLowerCase() === inv.email.toLowerCase()
                );
                return (
                  <button
                    key={i}
                    className={`c-select-item ${selectedInvestor?.email === inv.email ? "selected" : ""}`}
                    onClick={() =>
                      setSelectedInvestor(
                        selectedInvestor?.email === inv.email ? null : inv
                      )
                    }
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b>{inv.full_name}</b>
                      {invMatches.length > 0 && (
                        <span className="c-badge c-badge-coral" style={{ fontSize: "9px", padding: "2px 6px" }}>
                          ✓ {invMatches.length} Match{invMatches.length > 1 ? "es" : ""}
                        </span>
                      )}
                    </div>
                    <small>
                      {inv.company_name} · {inv.stage_or_cheque} · {inv.primary_sector.split(",")[0]}
                    </small>
                  </button>
                );
              })}
              {investors.length === 0 && (
                <p style={{ fontSize: 11, color: "#3d6b5a" }}>No investor applications yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approved matches log */}
      <div className="c-section">
        <div className="c-section-head">
          <div>
            <h2>Approved Matches & Meetings Log ({matches.length})</h2>
            <span className="c-section-sub">
              {matches.length === 0
                ? "No matches approved yet. Select a founder and an investor above to approve their journey."
                : "Active matches confirmed by curator. You can cancel or revoke meetings anytime below."}
            </span>
          </div>
        </div>
        {matches.length > 0 ? (
          <div className="c-table-wrap">
            <table className="c-table">
              <thead>
                <tr>
                  <th>Founder</th>
                  <th>Investor</th>
                  <th>Sector</th>
                  <th>Approved Date</th>
                  <th>Cancel Match & Revoke Meeting</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="c-name-cell">
                        <b>{m.founder_name}</b>
                        <small>{m.founder_company} ({m.founder_email})</small>
                      </div>
                    </td>
                    <td>
                      <div className="c-name-cell">
                        <b>{m.investor_name}</b>
                        <small>{m.investor_company} ({m.investor_email})</small>
                      </div>
                    </td>
                    <td style={{ fontSize: 10, color: "#7aaa95" }}>{m.sector}</td>
                    <td style={{ fontSize: 10, color: "#3d6b5a" }}>
                      {new Date(m.approved_at).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <button
                        className="c-delete-btn"
                        style={{ padding: "6px 10px", fontSize: "11px" }}
                        onClick={() => onCancelMatch(m.founder_email, m.investor_email)}
                      >
                        ✕ Cancel Match
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "32px", textAlign: "center", color: "#628779", background: "#0c1d17", borderRadius: "8px", border: "1px dashed #1e3830" }}>
            No matches approved yet. Pair founders and investors above to unlock their journey tickets and boarding passes.
          </div>
        )}
      </div>
    </>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="c-metric-card">
      <span className="c-m-label">{label}</span>
      <span className="c-m-value">{value}</span>
      <span className="c-m-sub">{sub}</span>
    </div>
  );
}
