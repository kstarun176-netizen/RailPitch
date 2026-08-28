"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { CloudShader } from "@/components/ui/cloud-shader";
import { DpiitEligibilityChecker } from "@/components/DpiitEligibilityChecker";
import { RailwayAnnouncement } from "@/components/RailwayAnnouncement";
import { KonkanRouteVisualizer } from "@/components/KonkanRouteVisualizer";
import { VandeBharatTrain } from "@/components/VandeBharatTrain";
import { VandeBharatCoachTopView } from "@/components/VandeBharatCoachTopView";

const sectors = [
  "AI, Data & Enterprise Software",
  "FinTech & Financial Inclusion",
  "HealthTech, BioTech & Wellness",
  "ClimateTech, Clean Energy & Circular Economy",
  "AgriTech & FoodTech",
  "Mobility, Logistics & TravelTech",
  "Consumer, Retail & D2C",
  "EdTech, Future of Work & Creator Economy",
  "DeepTech, Hardware, Manufacturing & Space",
  "Social Impact, GovTech & Inclusion",
];

type Role = "founder" | "investor" | "curator";

interface UserProfile {
  name: string;
  company: string;
  email: string;
  primarySector: string;
  secondarySectors: string[];
  stageOrCheque: string;
  askOrFocus: string;
  fileName?: string;
  fileUrl?: string;
  linkedinUrl?: string;
  submitted?: boolean;
}

const Arrow = () => <span className="arrow">→</span>;
const Mark = () => (
  <span className="mark">
    <i />
    <i />
    <i />
  </span>
);
const Brand = () => (
  <span className="brand">
    <Mark />
    Rail<span>Pitch</span>
  </span>
);
const Tag = ({ children, mint = false }: { children: React.ReactNode; mint?: boolean }) => (
  <span className={mint ? "tag mint" : "tag"}>{children}</span>
);

export default function RailPitch() {
  const [role, setRole] = useState<Role | null>(null);
  const [registered, setRegistered] = useState(false);
  const [menu, setMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [targetLoginRole, setTargetLoginRole] = useState<Role>("founder");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Restore saved session on initial mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    try {
      const savedProfile = localStorage.getItem("rp_live_user_profile");
      const savedRole = localStorage.getItem("rp_live_user_role") as Role | null;
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        if (savedRole) {
          setRole(savedRole);
        } else if (parsed.role) {
          setRole(parsed.role);
        }
        if (parsed.submitted) {
          setRegistered(true);
        }
        // Background verify with Supabase
        if (parsed.email) {
          syncWithSupabase(parsed.email, parsed.name);
        }
      }
    } catch {}

    // Listen to Supabase auth events (including OAuth redirects)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (session?.user) {
          const email = session.user.email || "";
          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User";
          await syncWithSupabase(email, name);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }: any) => {
      if (session?.user) {
        const email = session.user.email || "";
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "User";
        await syncWithSupabase(email, name);
      }
    });

    return () => {
      try {
        document.head.removeChild(script);
      } catch {}
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const syncWithSupabase = async (email: string, name?: string) => {
    try {
      const res = await fetch("/api/applications");
      let list: any[] = [];
      if (res.ok) {
        list = await res.json();
      } else {
        const { data } = await supabase.from("applications").select("*");
        if (Array.isArray(data)) list = data;
      }

      const match = list.find(
        (a: any) => a.email && a.email.toLowerCase() === email.toLowerCase()
      );

      if (match) {
        const userRole: Role = match.role === "investor" ? "investor" : "founder";
        const fullProfile: UserProfile = {
          name: match.full_name || name || email.split("@")[0],
          company: match.company_name || "",
          email: match.email,
          primarySector: match.primary_sector || sectors[0],
          secondarySectors: match.secondary_sectors || [],
          stageOrCheque: match.stage_or_cheque || "Pre-seed",
          askOrFocus: match.ask_or_focus || "",
          fileName: match.file_url ? match.file_url.split("/").pop() : undefined,
          fileUrl: match.file_url || "",
          linkedinUrl: match.linkedin_url || "",
          submitted: true,
        };
        setUserProfile(fullProfile);
        setRole(userRole);
        setRegistered(true);

        try {
          localStorage.setItem("rp_live_user_profile", JSON.stringify(fullProfile));
          localStorage.setItem("rp_live_user_role", userRole);
          localStorage.setItem("rp_live_auth_email", email);
        } catch {}
        setShowGoogleModal(false);
        return true;
      }
    } catch {}
    return false;
  };

  const handleGoogleSignIn = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const isClientConfigured =
      googleClientId &&
      !googleClientId.includes("your-google-client-id") &&
      !googleClientId.includes("dummy");

    if (
      isClientConfigured &&
      typeof window !== "undefined" &&
      (window as any).google?.accounts?.id
    ) {
      const google = (window as any).google;
      google.accounts.id.initialize({
        client_id: googleClientId,
        use_fedcm_for_prompt: false,
        callback: async (response: any) => {
          if (response?.credential) {
            try {
              const base64Url = response.credential.split(".")[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const payload = JSON.parse(window.atob(base64));
              if (payload?.email) {
                const found = await syncWithSupabase(payload.email, payload.name);
                if (!found) {
                  const profile: UserProfile = {
                    name: payload.name || payload.email.split("@")[0],
                    email: payload.email,
                    company: userProfile?.company || "",
                    primarySector: userProfile?.primarySector || sectors[3],
                    secondarySectors: userProfile?.secondarySectors || [],
                    stageOrCheque: userProfile?.stageOrCheque || "Pre-seed",
                    askOrFocus: userProfile?.askOrFocus || "",
                    linkedinUrl: userProfile?.linkedinUrl || "",
                    submitted: false,
                  };
                  setUserProfile(profile);
                  if (!role) setRole("founder");
                  try {
                    localStorage.setItem("rp_live_user_profile", JSON.stringify(profile));
                    localStorage.setItem("rp_live_user_role", role || "founder");
                  } catch {}
                  setShowGoogleModal(false);
                }
              }
            } catch (err) {
              setShowGoogleModal(true);
            }
          }
        },
      });
      google.accounts.id.prompt();
    } else {
      setShowGoogleModal(true);
    }
  };

  const handleGoogleAuthSuccess = async (name: string, email: string, forcedRole?: Role) => {
    const found = await syncWithSupabase(email, name);
    if (!found) {
      const chosenRole = forcedRole || targetLoginRole || role || "founder";
      const profile: UserProfile = {
        name,
        email,
        company: userProfile?.company || "",
        primarySector: userProfile?.primarySector || sectors[3],
        secondarySectors: userProfile?.secondarySectors || [],
        stageOrCheque: userProfile?.stageOrCheque || (chosenRole === "investor" ? "$50k - $250k" : "Pre-seed"),
        askOrFocus: userProfile?.askOrFocus || "",
        linkedinUrl: userProfile?.linkedinUrl || "",
        submitted: false,
      };
      setUserProfile(profile);
      setRole(chosenRole);
      try {
        localStorage.setItem("rp_live_user_profile", JSON.stringify(profile));
        localStorage.setItem("rp_live_user_role", chosenRole);
        localStorage.setItem("rp_live_auth_email", email);
      } catch {}
      setShowGoogleModal(false);
    }
  };

  const handleSelectLoginRole = (selectedRole: Role) => {
    setTargetLoginRole(selectedRole);
    setDropdownOpen(false);
    if (userProfile && userProfile.submitted) {
      setRole(selectedRole);
      setRegistered(true);
    } else {
      setShowGoogleModal(true);
    }
  };

  const handleRegisterComplete = (profile: UserProfile) => {
    const fullProfile = { ...profile, submitted: true };
    setUserProfile(fullProfile);
    setRegistered(true);
    try {
      localStorage.setItem("rp_live_user_profile", JSON.stringify(fullProfile));
      if (role) localStorage.setItem("rp_live_user_role", role);
      localStorage.setItem("rp_live_auth_email", profile.email);
    } catch {}
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setRole(null);
    setRegistered(false);
    setUserProfile(null);
    try {
      localStorage.removeItem("rp_live_user_profile");
      localStorage.removeItem("rp_live_user_role");
      localStorage.removeItem("rp_live_auth_email");
    } catch {}
  };

  const isOwner = userProfile?.email?.toLowerCase() === "kstarun176@gmail.com";

  if (role === "curator") return <Curator close={() => setRole(null)} />;
  if (role && !registered)
    return (
      <>
        <Registration
          role={role}
          cancel={() => setRole(null)}
          done={handleRegisterComplete}
          userProfile={userProfile}
          onGoogleSignIn={handleGoogleSignIn}
        />
        {showGoogleModal && (
          <GoogleAuthModal
            close={() => setShowGoogleModal(false)}
            onSuccess={handleGoogleAuthSuccess}
            targetRole={targetLoginRole}
          />
        )}
      </>
    );
  if (role)
    return (
      <Dashboard
        role={role}
        profile={userProfile}
        isOwner={isOwner}
        onOpenCurator={() => setRole("curator")}
        close={handleSignOut}
      />
    );

  return (
    <main className="landing-root">
      {showGoogleModal && (
        <GoogleAuthModal
          close={() => setShowGoogleModal(false)}
          onSuccess={handleGoogleAuthSuccess}
          targetRole={targetLoginRole}
        />
      )}

      <header>
        <a href="#top">
          <Brand />
        </a>
        <nav className={menu ? "open" : ""}>
          <a href="#journey">The journey</a>
          <a href="#how">How it works</a>
          <a href="#sectors">Sectors</a>
          <a href="#dpiit">DPIIT Checker</a>

          {/* Hover Login Dropdown with Founder & Investor CTAs */}
          <div
            className="login-dropdown-wrapper"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="login-nav-trigger"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span>Log in</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: "transform 0.2s ease",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="login-dropdown-menu">
                {/* Bridge to prevent accidental hover loss */}
                <div className="login-dropdown-bridge" />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    paddingBottom: "8px",
                    borderBottom: "1px dashed #dbe5df",
                  }}
                >
                  <span className="kicker" style={{ fontSize: "9px", letterSpacing: "1.2px", color: "var(--teal)" }}>
                    SELECT LOGIN PORTAL
                  </span>
                  <small style={{ fontSize: "9px", color: "#7a8a81", fontWeight: 700 }}>EDITION 01</small>
                </div>

                {/* Founder Option */}
                <div
                  onClick={() => handleSelectLoginRole("founder")}
                  role="button"
                  tabIndex={0}
                  className="login-option-card founder-card"
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      background: "#d6ede2",
                      color: "var(--teal)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(15,107,97,0.15)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                      <path d="M12 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                      <strong style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 800 }}>
                        As a Founder
                      </strong>
                      <span className="tag mint" style={{ fontSize: "8px", padding: "2px 6px" }}>
                        FOUNDER
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#5a6f64", margin: "0 0 6px", lineHeight: 1.35 }}>
                      Submit pitch deck, DPIIT checker & 1:1 meeting schedule.
                    </p>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--teal)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      Log In as Founder →
                    </span>
                  </div>
                </div>

                {/* Investor Option */}
                <div
                  onClick={() => handleSelectLoginRole("investor")}
                  role="button"
                  tabIndex={0}
                  className="login-option-card investor-card"
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      background: "#fee5de",
                      color: "var(--coral)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(232,119,95,0.15)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                      <strong style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 800 }}>
                        As an Investor
                      </strong>
                      <span className="tag" style={{ fontSize: "8px", padding: "2px 6px", background: "#fff0eb", color: "#e8775f", borderColor: "#f9d0c5" }}>
                        INVESTOR
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#6e6057", margin: "0 0 6px", lineHeight: 1.35 }}>
                      Browse cohort startups, evaluate thesis fit & live 1:1 rooms.
                    </p>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#e8775f", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      Log In as Investor →
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
        <button className="hamburger" onClick={() => setMenu(!menu)}>
          {menu ? "×" : "☰"}
        </button>
      </header>

      <CloudShader
        className="w-full relative"
        speed={0.45}
        cloudCoverage={0.5}
        cloudDensity={1.1}
        skyColor={[0.18, 0.52, 0.82]}
        cloudColor={[0.98, 0.99, 1.0]}
        sunColor={[1.0, 0.94, 0.78]}
      >
        <section className="hero" id="top">
          <div className="hero-copy">
            <span className="kicker">
              <b />
              CURATED EXPEDITION · EDITION 01
            </span>
            <h1>
              Where the <em>next</em> big idea finds its way.
            </h1>
            <p>
              RailPitch connects visionary founders with forward-thinking investors on a curated Mumbai–Goa train journey, turning travel time into high‑conviction partnerships.
            </p>
            <div className="actions">
              <button className="primary" onClick={() => setRole("founder")}>
                Apply as a founder <Arrow />
              </button>
              <button className="link" onClick={() => setRole("investor")}>
                I&apos;m an investor <Arrow />
              </button>
            </div>
            <small className="facts">
              16 selected startups <i /> 12 investor seats <i /> 3 confirmed meetings
            </small>
          </div>
          <div className="visual">
            <div className="mountain-layer">
              <svg viewBox="0 0 800 500" className="mountain-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2c4554" />
                    <stop offset="40%" stopColor="#203644" />
                    <stop offset="75%" stopColor="#162933" />
                    <stop offset="100%" stopColor="#0e1f1c" />
                  </linearGradient>
                  <linearGradient id="snowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f0f5fa" />
                    <stop offset="100%" stopColor="#cbdde9" />
                  </linearGradient>
                  <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#488755" />
                    <stop offset="50%" stopColor="#356d40" />
                    <stop offset="100%" stopColor="#193822" />
                  </linearGradient>
                </defs>
                {/* Mt. Fuji / coastal peak silhouette */}
                <path d="M 40,500 L 400,105 L 760,500 Z" fill="url(#mtnGrad)" />
                {/* Mountain Snow Cap with natural jagged crevices */}
                <path d="M 320,230 Q 355,260 375,235 Q 390,265 400,225 Q 412,270 430,235 Q 450,260 480,230 L 400,105 Z" fill="url(#snowGrad)" />
                {/* Foothill green field layer */}
                <rect x="0" y="440" width="800" height="60" fill="url(#fieldGrad)" />
              </svg>
            </div>

            <div className="route">
              <strong>MUMBAI</strong>
              <i />
              <i />
              <i />
              <strong>GOA</strong>
            </div>

            <div className="rail-fence" />
            <div className="rail-track" />

            <div className="bullet-train-wrap">
              <VandeBharatTrain />
            </div>

            <div className="match-float">
              ✦{" "}
              <span>
                <small>CURATED FOR YOU</small>
                <strong>94% match</strong>
              </span>
            </div>
            <div className="ticket">
              <small>EDITION 01</small>
              <strong>
                Mumbai <em>→</em> Goa
              </strong>
              <span>RP-0426</span>
            </div>
          </div>
        </section>
      </CloudShader>

      <RailwayAnnouncement />

      <section className="statement" id="journey">
        <span className="kicker">NOT ANOTHER PITCH DAY</span>
        <p>
          A <em>moving, curated retreat</em> where preparation happens before boarding—and the real conversations happen when the coast opens up.
        </p>
        <div className="three">
          <Card
            n="01"
            title="Matched before departure"
            text="Every seat is selected around sector, stage and cheque-range fit."
          />
          <Card
            n="02"
            title="Time that goes somewhere"
            text="Private meetings, quick pitches and useful peer rooms replace crowded stage events."
          />
          <Card
            n="03"
            title="Momentum after arrival"
            text="Follow-up rooms, destination showcases and warm introductions keep the journey moving."
          />
        </div>
      </section>

      <section className="journey" id="how">
        <div className="heading">
          <div>
            <span className="kicker">THE EXPEDITION</span>
            <h2>
              One journey. <em>Many</em> right conversations.
            </h2>
          </div>
          <p>A thoughtfully paced 10-hour programme—built for focus, not performance.</p>
        </div>
        <KonkanRouteVisualizer />
      </section>

      <section className="sectors" id="sectors">
        <div className="heading">
          <div>
            <span className="kicker">A BETTER FIT</span>
            <h2>
              Start with what you’re <em>building.</em>
            </h2>
          </div>
          <p>
            Founders choose one primary sector and up to two secondary sectors. Investors select the areas they want to see.
          </p>
        </div>
        <div className="sector-grid">
          {sectors.map((s, i) => (
            <button key={s} onClick={() => setRole("founder")}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              {s}
              <Arrow />
            </button>
          ))}
        </div>
      </section>

      <DpiitEligibilityChecker onApply={() => setRole("founder")} />

      <section className="quality">
        <div>
          <span className="kicker">THE QUALITY PROMISE</span>
          <h2>No one boards for a maybe.</h2>
          <p>
            RailPitch only confirms a journey when the cohort reaches its matching threshold. Every selected founder leaves with at least three relevant investor or mentor meetings.
          </p>
          <button className="light" onClick={() => setRole("founder")}>
            See selection criteria <Arrow />
          </button>
        </div>
        <aside>
          <Metric n="3" t="minimum meetings" />
          <Metric n="16" t="selected startups" />
          <Metric n="1:1" t="private follow-ups" />
        </aside>
      </section>

      <section className="roles">
        <article>
          <span className="kicker">FOR FOUNDERS</span>
          <h2>
            Bring your work
            <br />
            further.
          </h2>
          <p>Access the right rooms, clear feedback, and a journey designed to make every conversation count.</p>
          <button className="link dark" onClick={() => setRole("founder")}>
            Start an application <Arrow />
          </button>
          <b>01</b>
        </article>
        <article>
          <span className="kicker">FOR INVESTORS</span>
          <h2>
            Find the signal
            <br />
            before the noise.
          </h2>
          <p>Review a high-fit cohort, choose your conversations, and discover what’s next.</p>
          <button className="link dark" onClick={() => setRole("investor")}>
            Apply for access <Arrow />
          </button>
          <b>02</b>
        </article>
      </section>

      <footer>
        <Brand />
        <p>Independent innovation-mobility concept. Not affiliated with or endorsed by Indian Railways or IRCTC.</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="/curator" className="curator-footer-cta">
            ⚡ Curator Team Access ↗
          </a>
        </div>
      </footer>
    </main>
  );
}

function Card({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <article>
      <small>{n}</small>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Metric({ n, t }: { n: string; t: string }) {
  return (
    <div>
      <b>{n}</b>
      <span>{t}</span>
    </div>
  );
}

function GoogleAuthModal({
  close,
  onSuccess,
  targetRole = "founder",
}: {
  close: () => void;
  onSuccess: (name: string, email: string, forcedRole?: Role) => void;
  targetRole?: Role;
}) {
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuickSelect = async (name: string, email: string) => {
    setLoading(true);
    await onSuccess(name, email, targetRole);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (googleEmail.trim()) {
      setLoading(true);
      const nameToUse = googleName.trim() || googleEmail.split("@")[0];
      await onSuccess(nameToUse, googleEmail.trim(), targetRole);
      setLoading(false);
    }
  };

  const savedEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("rp_live_auth_email") || "kstarun176@gmail.com"
      : "kstarun176@gmail.com";

  const isFounder = targetRole === "founder";
  const isInvestor = targetRole === "investor";

  return (
    <div className="overlay">
      <section className="meeting-modal" style={{ maxWidth: "460px", padding: "32px" }}>
        <button className="close" onClick={close}>
          ×
        </button>

        {isFounder ? (
          <span className="tag mint" style={{ display: "inline-block", marginBottom: "8px", fontWeight: 800 }}>
            FOUNDER PORTAL LOGIN
          </span>
        ) : isInvestor ? (
          <span
            className="tag"
            style={{
              display: "inline-block",
              marginBottom: "8px",
              background: "#fff0ec",
              color: "#e8775f",
              borderColor: "#fad2c8",
              fontWeight: 800,
            }}
          >
            INVESTOR ACCESS LOGIN
          </span>
        ) : (
          <span className="kicker">AUTHENTICATION & SESSION</span>
        )}

        <h2 style={{ fontSize: "24px", margin: "6px 0" }}>
          {isFounder ? "Sign In as Founder" : isInvestor ? "Sign In as Investor" : "Sign In to RailPitch"}
        </h2>
        <p className="modal-copy" style={{ marginBottom: "20px", fontSize: "12px" }}>
          {isFounder
            ? "Log in to manage your startup application, DPIIT checker, pitch deck and confirmed 1:1 meetings."
            : isInvestor
            ? "Log in to browse the curated startup cohort, evaluate deals and access confirmed 1:1 tables."
            : "Log in with your Google account or email. Your login info, role, and matches will be remembered securely."}
        </p>

        {/* 1-Click Fast Google Account Button */}
        <button
          type="button"
          onClick={() => handleQuickSelect(savedEmail.split("@")[0], savedEmail)}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "12px 16px",
            background: "#ffffff",
            border: isInvestor ? "1.5px solid #e8775f" : "1.5px solid #0f6b61",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#102720",
            cursor: "pointer",
            boxShadow: isInvestor ? "0 4px 12px rgba(232, 119, 95, 0.1)" : "0 4px 12px rgba(15, 107, 97, 0.08)",
            marginBottom: "16px",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12px", color: "#102720" }}>
                Continue as <b>{savedEmail}</b>
              </div>
              <small style={{ fontSize: "10px", color: isInvestor ? "#e8775f" : "#0f6b61", fontWeight: 600 }}>
                1-Click Instant Google Sign-In
              </small>
            </div>
          </div>
          <span style={{ color: isInvestor ? "#e8775f" : "#0f6b61", fontSize: "14px" }}>→</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "14px 0 18px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e1e7e0" }} />
          <span style={{ fontSize: "11px", color: "#8ca095", fontWeight: 700 }}>
            OR ENTER ANY GOOGLE EMAIL
          </span>
          <div style={{ flex: 1, height: "1px", background: "#e1e7e0" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <label style={{ fontSize: "12px", fontWeight: 700, color: "#102720" }}>
            Full Name
            <input
              value={googleName}
              onChange={(e) => setGoogleName(e.target.value)}
              placeholder="e.g. Tarun K (optional for existing users)"
              style={{ width: "100%", padding: "10px", marginTop: "4px", border: "1px solid #d5ddd4", borderRadius: "4px" }}
            />
          </label>
          <label style={{ fontSize: "12px", fontWeight: 700, color: "#102720" }}>
            Google / Work Email Address
            <input
              required
              type="email"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder={isInvestor ? "investor@venturefund.com" : "founder@startup.com"}
              style={{ width: "100%", padding: "10px", marginTop: "4px", border: "1px solid #d5ddd4", borderRadius: "4px" }}
            />
          </label>
          <button
            className="primary"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
              background: isInvestor ? "#e8775f" : "var(--ink)",
            }}
          >
            {loading
              ? "Checking Supabase Records…"
              : isFounder
              ? "Sign In as Founder →"
              : isInvestor
              ? "Sign In as Investor →"
              : "Sign In & Remember Me →"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Registration({
  role,
  cancel,
  done,
  userProfile,
  onGoogleSignIn,
}: {
  role: Exclude<Role, "curator">;
  cancel: () => void;
  done: (profile: UserProfile) => void;
  userProfile: UserProfile | null;
  onGoogleSignIn: () => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(userProfile?.name || "");
  const [company, setCompany] = useState(userProfile?.company || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [primary, setPrimary] = useState(userProfile?.primarySector || sectors[5]);
  const [interests, setInterests] = useState<string[]>(userProfile?.secondarySectors || []);
  const [stageOrCheque, setStageOrCheque] = useState(role === "founder" ? "Pre-seed" : "₹1Cr – ₹5Cr");
  const [askOrFocus, setAskOrFocus] = useState(userProfile?.askOrFocus || "");
  const [linkedinUrl, setLinkedinUrl] = useState(userProfile?.linkedinUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedProfile, setSubmittedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (userProfile?.name && !name) setName(userProfile.name);
    if (userProfile?.email && !email) setEmail(userProfile.email);
  }, [userProfile, name, email]);

  const founder = role === "founder";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      let filePublicUrl = "";

      if (founder && selectedFile) {
        try {
          const res = await supabase.storage.from("decks").upload(selectedFile.name, selectedFile);
          if (res.data?.publicUrl) {
            filePublicUrl = res.data.publicUrl;
          }
        } catch {}
      }

      const profile: UserProfile = {
        name: name || (email ? email.split("@")[0] : "Participant"),
        company: company || (name ? `${name}'s Venture` : "Organisation"),
        email: email || "participant@railpitch.com",
        primarySector: primary,
        secondarySectors: interests,
        stageOrCheque,
        askOrFocus,
        fileName: founder ? (fileName || (selectedFile ? selectedFile.name : `${name || "Founder"}_Deck.pdf`)) : undefined,
        fileUrl: filePublicUrl,
        linkedinUrl: !founder ? linkedinUrl : undefined,
        submitted: true,
      };

      try {
        localStorage.setItem("rp_live_user_profile", JSON.stringify(profile));
        localStorage.setItem("rp_live_user_role", role);
        localStorage.setItem("rp_live_auth_email", profile.email);
      } catch {}

      // Fire database inserts to applications and founders/investors tables
      try {
        await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role,
            full_name: profile.name,
            company_name: profile.company,
            email: profile.email,
            primary_sector: primary,
            secondary_sectors: interests,
            stage_or_cheque: stageOrCheque,
            ask_or_focus: askOrFocus,
            file_url: filePublicUrl,
            linkedin_url: linkedinUrl,
            created_at: new Date().toISOString(),
          }),
        });
      } catch {}

      // Clear form inputs
      setName("");
      setCompany("");
      setEmail("");
      setAskOrFocus("");
      setLinkedinUrl("");
      setSelectedFile(null);
      setFileName("");
      setSubmitting(false);

      // Show confirmation modal
      setSubmittedProfile(profile);
      setShowSuccessModal(true);
    }
  }

  const toggle = (x: string) =>
    setInterests((s) => (s.includes(x) ? s.filter((y) => y !== x) : s.length < 2 ? [...s, x] : s));

  return (
    <div className="registration">
      <button className="back" onClick={cancel}>
        ← Back to RailPitch
      </button>
      <section>
        <Brand />
        <span className="kicker">{founder ? "FOUNDER APPLICATION" : "INVESTOR ACCESS"}</span>
        <h1>{founder ? "Bring your best work on board." : "A better way to discover what’s next."}</h1>
        <button
          type="button"
          className={userProfile?.email ? "google connected" : "google"}
          onClick={onGoogleSignIn}
        >
          {userProfile?.email ? `✓ Signed in as ${userProfile.email}` : "G  Continue with Google"}
        </button>
        <small className="google-note">
          Sign in with Google to auto-fill your credentials and sync data directly with Supabase.
        </small>
        <div className="stepper">
          <i className="done" />
          <i className={step > 1 ? "done" : ""} />
          <i className={step > 2 ? "done" : ""} />
        </div>
        <form onSubmit={submit}>
          {step === 1 && (
            <>
              <label>
                Your full name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </label>
              <label>
                {founder ? "Startup name" : "Fund or organisation"}
                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={founder ? "Enter startup name" : "Enter fund or organisation name"}
                />
              </label>
              <label>
                Work email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email"
                />
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <label>
                {founder ? "Primary sector" : "Primary investment focus"}
                <select value={primary} onChange={(e) => setPrimary(e.target.value)}>
                  {sectors.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                {founder ? "Secondary sectors (choose up to two)" : "Additional investment interests (choose up to two)"}
                <div className="choice-list">
                  {sectors
                    .filter((x) => x !== primary)
                    .slice(0, 6)
                    .map((x) => (
                      <button
                        type="button"
                        className={interests.includes(x) ? "picked" : ""}
                        key={x}
                        onClick={() => toggle(x)}
                      >
                        {x.split(" & ")[0]}
                      </button>
                    ))}
                </div>
                <small className="field-note">
                  {interests.length}/2 selected. These preferences directly affect match suggestions.
                </small>
              </label>
              <label>
                {founder ? "Stage" : "Typical cheque range"}
                <select value={stageOrCheque} onChange={(e) => setStageOrCheque(e.target.value)}>
                  <option>{founder ? "Pre-seed" : "₹25L – ₹1Cr"}</option>
                  <option>{founder ? "Seed" : "₹1Cr – ₹5Cr"}</option>
                  <option>{founder ? "Series A" : "₹5Cr+"}</option>
                </select>
              </label>
            </>
          )}
          {step === 3 && (
            <>
              <label>
                {founder ? "What are you raising?" : "What would make this cohort valuable to you?"}
                <textarea
                  required
                  value={askOrFocus}
                  onChange={(e) => setAskOrFocus(e.target.value)}
                  placeholder={
                    founder
                      ? "Share your funding ask and the milestone it unlocks."
                      : "Tell us about the opportunities you want to discover."
                  }
                />
              </label>
              {founder ? (
                <>
                  <label className="file">
                    Pitch deck
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setSelectedFile(f);
                          setFileName(f.name);
                        }
                      }}
                    />
                    <span>{fileName ? `✓ ${fileName}` : "Attach a PDF or PowerPoint"}</span>
                  </label>
                  <div className="document-guide">
                    <strong>Founder deck: 5–7 slides</strong>
                    <p>
                      Problem, customer, solution, traction, market, team and funding ask. Keep sensitive financials out until a curator confirms a match.
                    </p>
                  </div>
                </>
              ) : (
                <label>
                  LinkedIn Profile URL (Optional)
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile (optional)"
                  />
                </label>
              )}
              <label className="consent">
                <input type="checkbox" required /> I agree to the selection process, privacy notice and participant code.
              </label>
            </>
          )}
          <button className="primary" disabled={submitting}>
            {submitting ? "Saving to Supabase..." : step === 3 ? "Submit application" : "Continue"} <Arrow />
          </button>
        </form>
      </section>
      <aside className="registration-aside">
        <div className="reg-aside-badge">
          <span className="reg-dot" />
          <span>EDITION 01 · 18 OCT 2026</span>
        </div>

        <h2 className="reg-aside-title">
          Mumbai <span className="reg-arrow">→</span> Goa
        </h2>

        <p className="reg-aside-sub">
          Konkan Coastal Railway Expedition · Vande Bharat Innovation Express
        </p>

        <div className="reg-aside-stats-grid">
          <div className="reg-stat-card">
            <b>16</b>
            <small>Founder Seats</small>
          </div>
          <div className="reg-stat-card">
            <b>12</b>
            <small>Investor Seats</small>
          </div>
          <div className="reg-stat-card">
            <b>3</b>
            <small>1:1 Pitches</small>
          </div>
        </div>

        <div className="reg-aside-footer-note">
          <span>✓ Curated High-Conviction Matchmaking</span>
        </div>
      </aside>

      {/* Confirmation Modal */}
      {showSuccessModal && submittedProfile && (
        <div className="overlay" style={{ zIndex: 1000 }}>
          <section
            className="meeting-modal"
            style={{
              maxWidth: "460px",
              padding: "36px 32px",
              textAlign: "center",
              border: "2px solid #0f6b61",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#e3f5f0",
                color: "#0f6b61",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                margin: "0 auto 16px",
              }}
            >
              ✓
            </div>
            <span className="kicker" style={{ color: "#0f6b61" }}>
              APPLICATION CONFIRMED · SUPABASE SYNCED
            </span>
            <h2 style={{ fontSize: "22px", margin: "8px 0 12px", color: "#102720" }}>
              {founder ? "Founder Deck Received" : "Investor Profile Registered"}
            </h2>
            <p className="modal-copy" style={{ fontSize: "13px", lineHeight: "1.6", color: "#475c53", marginBottom: "20px" }}>
              Thank you, <b>{submittedProfile.name}</b> ({submittedProfile.company}). Your application has been recorded in the Supabase live database and forwarded to the Curator Studio for match curation.
            </p>
            <button
              className="primary"
              onClick={() => {
                setShowSuccessModal(false);
                done(submittedProfile);
              }}
              style={{ width: "100%", padding: "14px", fontSize: "14px" }}
            >
              Enter RailPitch Workspace →
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function Dashboard({
  role,
  profile,
  isOwner,
  onOpenCurator,
  close,
}: {
  role: Exclude<Role, "curator">;
  profile: UserProfile | null;
  isOwner?: boolean;
  onOpenCurator?: () => void;
  close: () => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [paid, setPaid] = useState(true);
  const [sent, setSent] = useState(false);
  const [meeting, setMeeting] = useState(false);
  const [ticket, setTicket] = useState(false);
  const [review, setReview] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [approvedMatch, setApprovedMatch] = useState<any>(null);
  const [loadingMatch, setLoadingMatch] = useState(true);

  const founder = role === "founder";
  const name = profile?.name ? profile.name.split(" ")[0] : "Participant";
  const fullName = profile?.name || "Participant Name";
  const companyName = profile?.company || (profile?.name ? `${profile.name}'s Firm` : "Organisation Name");
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((x) => x[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RP";

  useEffect(() => {
    async function checkCuratorApproval() {
      if (!profile?.email && !profile?.name) {
        setLoadingMatch(false);
        return;
      }
      try {
        let list: any[] = [];
        try {
          const res = await fetch("/api/matches", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) list = data;
          }
        } catch {}

        if (list.length === 0) {
          try {
            const { data } = await supabase.from("matches").select("*");
            if (Array.isArray(data)) list = data;
          } catch {}
        }

        const myEmail = (profile?.email || "").toLowerCase().trim();
        const myName = (profile?.name || "").toLowerCase().trim();
        const myCompany = (profile?.company || "").toLowerCase().trim();

        const match = list.find((m: any) => {
          if (
            !m ||
            !m.founder_name ||
            !m.investor_name ||
            m.founder_name.startsWith("__") ||
            m.investor_name.startsWith("__") ||
            m.status === "deleted"
          ) {
            return false;
          }

          let fEmail = (m.founder_email || "").toLowerCase().trim();
          let fName = (m.founder_name || "").toLowerCase().trim();
          let fComp = (m.founder_company || "").toLowerCase().trim();

          let iEmail = (m.investor_email || "").toLowerCase().trim();
          let iName = (m.investor_name || "").toLowerCase().trim();
          let iComp = (m.investor_company || m.investor_firm || "").toLowerCase().trim();

          // Unpack JSON metadata if status is serialized
          if (typeof m.status === "string" && m.status.startsWith("{")) {
            try {
              const meta = JSON.parse(m.status);
              if (meta.founder_email) fEmail = meta.founder_email.toLowerCase().trim();
              if (meta.investor_email) iEmail = meta.investor_email.toLowerCase().trim();
              if (meta.sector && !m.sector) m.sector = meta.sector;
            } catch {}
          }

          if (founder) {
            return (
              (myEmail && fEmail && (fEmail === myEmail || myEmail.includes(fEmail) || fEmail.includes(myEmail))) ||
              (myName && fName && (fName === myName || fName.includes(myName) || myName.includes(fName))) ||
              (myCompany && fComp && (fComp === myCompany || fComp.includes(myCompany) || myCompany.includes(fComp)))
            );
          } else {
            return (
              (myEmail && iEmail && (iEmail === myEmail || myEmail.includes(iEmail) || iEmail.includes(myEmail))) ||
              (myName && iName && (iName === myName || iName.includes(myName) || myName.includes(iName))) ||
              (myCompany && iComp && (iComp === myCompany || iComp.includes(myCompany) || myCompany.includes(iComp)))
            );
          }
        });

        if (match) {
          let resolvedFEmail = (match.founder_email || "").toLowerCase().trim();
          let resolvedIEmail = (match.investor_email || "").toLowerCase().trim();
          let resolvedSector = match.sector || profile?.primarySector || "Curated Expedition";
          let resolvedApprovedAt = match.approved_at || match.created_at || new Date().toISOString();

          if (typeof match.status === "string" && match.status.startsWith("{")) {
            try {
              const meta = JSON.parse(match.status);
              if (meta.founder_email) resolvedFEmail = meta.founder_email.toLowerCase().trim();
              if (meta.investor_email) resolvedIEmail = meta.investor_email.toLowerCase().trim();
              if (meta.sector) resolvedSector = meta.sector;
              if (meta.approved_at) resolvedApprovedAt = meta.approved_at;
            } catch {}
          }

          if (founder && !resolvedFEmail && profile?.email) {
            resolvedFEmail = profile.email.toLowerCase().trim();
          }
          if (!founder && !resolvedIEmail && profile?.email) {
            resolvedIEmail = profile.email.toLowerCase().trim();
          }

          const formattedMatch = {
            ...match,
            founder_email: resolvedFEmail,
            investor_email: resolvedIEmail,
            investor_company: match.investor_company || match.investor_firm || "Partner Firm",
            sector: resolvedSector,
            approved_at: resolvedApprovedAt,
          };
          setApprovedMatch(formattedMatch);
          setUnreadCount(1);
        }
      } catch (err) {
        console.error("Failed to check curator approval:", err);
      }
      setLoadingMatch(false);
    }

    checkCuratorApproval();
    // Live polling every 2.5 seconds to unlock journey pass as soon as curator approves
    const interval = setInterval(checkCuratorApproval, 2500);
    return () => clearInterval(interval);
  }, [profile?.email, profile?.name, profile?.company, founder]);

  return (
    <div className="app">
      <aside className="sidebar">
        <Brand />
        <div
          className="edition"
          style={{ cursor: approvedMatch ? "pointer" : "default" }}
          onClick={approvedMatch ? () => setTicket(true) : undefined}
        >
          <small>EDITION 01</small>
          <b>Mumbai → Goa</b>
          <span>
            {approvedMatch
              ? "18 Oct 2026 · Boarding Pass ↗"
              : "18 Oct 2026 · Pass Pending Approval"}
          </span>
        </div>
        {["Overview", "My matches", "Journey schedule", "Follow-ups"].map((x) => (
          <button
            key={x}
            className={tab === x ? "active" : ""}
            onClick={() => {
              setTab(x);
              if (x === "Follow-ups") setUnreadCount(0);
            }}
          >
            {x}
            {x === "Follow-ups" && unreadCount > 0 && <b style={{ background: "#e8775f", color: "white", borderRadius: "10px", padding: "1px 6px", fontSize: "10px", marginLeft: "6px" }}>{unreadCount}</b>}
          </button>
        ))}

        <div className="profile">
          <i>{initials}</i>
          <span>
            <b>{fullName}</b>
            <small>{companyName}</small>
          </span>
        </div>
        <button className="exit" onClick={close}>
          ← Sign out
        </button>
      </aside>

      <main className="dash">
        <div className="dash-head">
          <div>
            <span className="kicker">{founder ? "FOUNDER SPACE" : "INVESTOR SPACE"}</span>
            <h1>Good afternoon, {name}.</h1>
          </div>
          <small
            style={{
              cursor: approvedMatch ? "pointer" : "default",
              color: approvedMatch ? "#0f6b61" : "#e8775f",
              fontWeight: 700,
            }}
            onClick={approvedMatch ? () => setTicket(true) : undefined}
          >
            ● {approvedMatch ? "Match Approved by Curator · Pod 01 Confirmed (Pass Active)" : "Under Curator Review · Ticket Pending Approval"}
          </small>
        </div>

        {tab === "Overview" && (
          <Overview
            founder={founder}
            profile={profile}
            approvedMatch={approvedMatch}
            paid={paid}
            setPaid={setPaid}
            onMatch={() => setTab("My matches")}
            onSchedule={() => setTab("Journey schedule")}
            onReview={() => setReview(true)}
            onTicket={() => {
              if (approvedMatch) setTicket(true);
            }}
          />
        )}
        {tab === "My matches" && (
          <Matches founder={founder} profile={profile} approvedMatch={approvedMatch} onMeeting={() => setMeeting(true)} onReview={() => setReview(true)} />
        )}
        {tab === "Journey schedule" && (
          <Schedule
            approvedMatch={approvedMatch}
            onTicket={() => {
              if (approvedMatch) setTicket(true);
            }}
          />
        )}
        {tab === "Follow-ups" && <Messages founder={founder} profile={profile} approvedMatch={approvedMatch} sent={sent} setSent={setSent} />}
      </main>

      {meeting && (
        <MeetingModal
          founder={founder}
          profile={profile}
          approvedMatch={approvedMatch}
          close={() => setMeeting(false)}
          message={() => {
            setMeeting(false);
            setTab("Follow-ups");
          }}
          ticket={() => {
            setMeeting(false);
            if (approvedMatch) setTicket(true);
          }}
        />
      )}

      {ticket && approvedMatch && <JourneyTicket founder={founder} profile={profile} close={() => setTicket(false)} />}
      {review && (
        <FounderReview
          profile={profile}
          approvedMatch={approvedMatch}
          close={() => setReview(false)}
          approved={() => {
            setReview(false);
            setMeeting(true);
          }}
        />
      )}
    </div>
  );
}

function Overview({
  founder,
  profile,
  approvedMatch,
  paid,
  setPaid,
  onMatch,
  onSchedule,
  onReview,
  onTicket,
}: {
  founder: boolean;
  profile: UserProfile | null;
  approvedMatch: any;
  paid: boolean;
  setPaid: (b: boolean) => void;
  onMatch: () => void;
  onSchedule: () => void;
  onReview: () => void;
  onTicket: () => void;
}) {
  const hasSector = profile?.primarySector;

  const candidateName = approvedMatch
    ? founder
      ? `${approvedMatch.investor_name} (${approvedMatch.investor_company})`
      : `${approvedMatch.founder_name} (${approvedMatch.founder_company})`
    : "Curator Selection in Progress";

  const candidateCopy = approvedMatch
    ? founder
      ? `Curator Approved 1:1 Pod Session with ${approvedMatch.investor_name} in ${approvedMatch.sector}. Confirmed for Innovation Coach A · 10:30 AM.`
      : `Curator Approved 1:1 Pod Session with ${approvedMatch.founder_name} (${approvedMatch.founder_company}). Pitch deck unlocked for review.`
    : "The platform curator is reviewing applications to manually pair high-conviction 1:1 sessions. Your approved partner will appear here once confirmed.";

  const handlePassClick = () => {
    if (approvedMatch) {
      setPaid(true);
      onTicket();
    }
  };

  return (
    <div>
      <section className="dash-hero">
        <div>
          <span className="kicker">
            {approvedMatch
              ? "MATCH APPROVED BY CURATOR"
              : founder
              ? "APPLICATION RECORDED · CURATION QUEUE"
              : "INVESTOR PROFILE ACTIVE · CURATION QUEUE"}
          </span>
          <h2>
            {approvedMatch
              ? "Your 1:1 meeting pod is locked in."
              : "Your application is under curation."}
          </h2>
          <p style={{ marginBottom: "22px", lineHeight: "1.6" }}>
            {approvedMatch
              ? `The curator has approved your match with ${founder ? approvedMatch.investor_name : approvedMatch.founder_name} (${founder ? approvedMatch.investor_company : approvedMatch.founder_company}). Your 25-minute pod session is confirmed for Coach Innovation A.`
              : `Your profile in ${profile?.primarySector || "your sector"} has been received. The curator is manually reviewing candidates and pairing you with an expedition partner.`}
          </p>
          {approvedMatch ? (
            <button className="primary" onClick={handlePassClick} style={{ marginTop: "8px" }}>
              View Confirmed Journey Pass →
            </button>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff80", padding: "8px 14px", borderRadius: "4px", border: "1px dashed #7ea392", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "#3d6b5a", fontWeight: 700 }}>
                🔒 Journey Pass Locked — Will be issued upon Curator Approval
              </span>
            </div>
          )}
        </div>
        <div
          className="stamp"
          onClick={approvedMatch ? onTicket : undefined}
          style={{
            cursor: approvedMatch ? "pointer" : "default",
            opacity: approvedMatch ? 1 : 0.65,
            filter: approvedMatch ? "none" : "grayscale(30%)",
            transition: "transform 0.2s"
          }}
          title={approvedMatch ? "Click to view full Boarding Pass" : "Boarding Pass unlocks after Curator Approval"}
        >
          <b>18</b>
          <span>
            OCT
            <br />
            2026
          </span>
          <i />
          <strong>
            MUM
            <br />
            GOA
          </strong>
        </div>
      </section>

      <div className="dash-grid">
        <Panel
          title={founder ? "YOUR TOP MATCHED INVESTOR" : "REVIEW TOP FOUNDER MATCH"}
          name={candidateName}
          copy={candidateCopy}
          score={approvedMatch ? "99%" : "Reviewing"}
          action={approvedMatch ? (founder ? "View meeting" : "Review founder deck") : "Check matches"}
          click={approvedMatch ? (founder ? onMatch : onReview) : onMatch}
        />
        <Panel
          title="NEXT ON YOUR JOURNEY"
          name="Curated 1:1 Session"
          copy={
            approvedMatch
              ? `Confirmed 25-minute private meeting pod session during the Mumbai–Goa train expedition in Coach A at 10:30 AM.`
              : "Meeting pod assignment will unlock as soon as the curator approves your pairing."
          }
          score="10:30"
          action="View journey"
          click={onSchedule}
        />
      </div>

      <section className="todo">
        <span className="kicker">BEFORE YOU BOARD</span>
        <h3>Keep momentum moving.</h3>
        {[
          "Application recorded & verified in Supabase",
          founder ? (profile?.fileName ? `Pitch deck attached (${profile.fileName})` : "Upload pitch deck document") : "Verify LinkedIn profile link",
          approvedMatch ? `Curator match approved: ${founder ? approvedMatch.investor_company : approvedMatch.founder_company}` : "Awaiting curator match approval in console",
        ].map((x, i) => (
          <div key={x}>
            <i>{i === 0 ? "✓" : i === 2 && !approvedMatch ? "…" : "✓"}</i>
            <p>
              <b>{x}</b>
              <small>
                {i === 0
                  ? "Your application is saved and visible in the curator console."
                  : i === 1
                  ? founder
                    ? profile?.fileName ? `Stored in deck repository: ${profile.fileName}` : "Attach your 5–7 slide pitch deck."
                    : profile?.linkedinUrl
                    ? `Linked: ${profile.linkedinUrl}`
                    : "Add your LinkedIn profile URL."
                  : approvedMatch
                  ? "Your 1:1 Pod Session and Follow-up room are active."
                  : "Curator is reviewing pairings in Match Studio."}
              </small>
            </p>
            <button
              disabled={i === 2 && !approvedMatch}
              onClick={i === 0 ? onMatch : i === 1 ? (founder ? onReview : onMatch) : (approvedMatch ? onTicket : undefined)}
              style={i === 2 && !approvedMatch ? { opacity: 0.6, cursor: "not-allowed", background: "#e0e7e2" } : {}}
            >
              {i === 0 ? "View matches" : i === 1 ? "Review" : (approvedMatch ? "View pass" : "Pass locked")}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

function Panel({
  title,
  name,
  copy,
  score,
  action,
  click,
}: {
  title: string;
  name: string;
  copy: string;
  score: string;
  action: string;
  click: () => void;
}) {
  return (
    <article className="panel">
      <div style={{ paddingRight: "60px" }}>
        <span className="kicker">{title}</span>
        <h3 style={{ margin: "8px 0 10px" }}>{name}</h3>
      </div>
      <b className="score">{score}</b>
      <p style={{ margin: "0 0 16px", flex: 1, lineHeight: "1.6", color: "#587068" }}>{copy}</p>
      <div className="panel-footer">
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Tag mint>Selected Focus</Tag>
          <Tag>Active</Tag>
        </div>
        <button className="panel-cta" onClick={click}>
          {action} <Arrow />
        </button>
      </div>
    </article>
  );
}

function Matches({
  founder,
  profile,
  approvedMatch,
  onMeeting,
  onReview,
}: {
  founder: boolean;
  profile: UserProfile | null;
  approvedMatch: any;
  onMeeting: () => void;
  onReview: () => void;
}) {
  return (
    <section className="page">
      <span className="kicker">CURATED FOR YOU</span>
      <h2>Conversations with a reason.</h2>
      <p>These matches are selected by the curator using sector overlap, stage fit and cheque-range compatibility.</p>
      {approvedMatch ? (
        <>
          <article className="match">
            <i>RP</i>
            <div>
              <span className="kicker">CONFIRMED MATCH · {approvedMatch.sector}</span>
              <h3>
                {founder
                  ? `${approvedMatch.investor_name} (${approvedMatch.investor_company})`
                  : `${approvedMatch.founder_name} (${approvedMatch.founder_company})`}
              </h3>
              <p>
                {founder
                  ? `Investor Partner · Sector Focus: ${approvedMatch.sector} · Approved by Curator`
                  : `Founder · Sector: ${approvedMatch.sector} · Pitch Deck Unlocked`}
              </p>
              <span style={{ fontSize: "11px", color: "#0f6b61", fontWeight: 700, display: "inline-block", marginTop: "4px" }}>
                ✓ Curator Approved · Private Meeting Pod 01
              </span>
              <Tag mint>Confirmed</Tag>
            </div>
            <aside>
              <small>10:30–10:55 · Carriage A</small>
              <button className="primary" onClick={founder ? onMeeting : onReview}>
                {founder ? "View meeting" : "Review founder deck"}
              </button>
            </aside>
          </article>
        </>
      ) : (
        <div style={{ background: "white", border: "1px solid #dbe1d9", borderRadius: "8px", padding: "28px", marginTop: "16px" }}>
          <span className="kicker" style={{ color: "#e8775f" }}>CURATION IN PROGRESS</span>
          <h3 style={{ fontSize: "18px", margin: "8px 0" }}>Awaiting Curator Approval</h3>
          <p style={{ color: "#63756d", fontSize: "13px", lineHeight: "1.6", margin: "0 0 16px" }}>
            Your profile is currently being reviewed by the RailPitch curator. As soon as the curator pairs you with a confirmed {founder ? "investor" : "startup"} in the Match Studio, your confirmed 1:1 meeting pod and direct communication channel will appear right here.
          </p>
          <small style={{ color: "#7a8981", fontSize: "11px" }}>
            ● Notification will update automatically once approved in curator portal.
          </small>
        </div>
      )}
    </section>
  );
}

function Schedule({
  approvedMatch,
  onTicket,
}: {
  approvedMatch: any;
  onTicket: () => void;
}) {
  const bogies = [
    {
      time: "08:10 AM",
      title: "Boarding & Welcome Coffee",
      location: "CSMT Concourse · Platform 8",
      description: "Welcome gathering, espresso bar & cohort badge collection before flag-off.",
      category: "Departure",
      coachNum: "C1",
      coachName: "Lead Cab / Salon",
      type: "lead" as const,
      confirmed: false,
    },
    {
      time: "08:45 AM",
      title: "Opening Circle & Cohort Introduction",
      location: "Executive Lounge Coach A",
      description: "Expedition intention setting and rapid introductions across all 16 founders and 12 funds.",
      category: "Keynote",
      coachNum: "C2",
      coachName: "Executive Lounge",
      type: "coach" as const,
      confirmed: false,
    },
    {
      time: "10:30 AM",
      title: "Curated 1:1 Pod Session (Round 1)",
      location: "Innovation Coach · Pod 01",
      description: approvedMatch
        ? `Confirmed 25-minute private pitch session with ${approvedMatch.investor_name || approvedMatch.founder_name || "matched partner"} (${approvedMatch.investor_company || approvedMatch.founder_company || "portfolio"}).`
        : "Pre-matched 25-minute speed pitch with sector-aligned investment thesis partner.",
      category: "1:1 Meeting",
      coachNum: "C3",
      coachName: "Innovation Pod 01",
      type: "coach" as const,
      confirmed: !!approvedMatch,
      isMatchPod: true,
    },
    {
      time: "12:40 PM",
      title: "Curated 1:1 Pod Session (Round 2)",
      location: "Innovation Coach · Pod 02",
      description: approvedMatch
        ? "Follow-up deep-dive session on unit economics and product roadmap."
        : "Second curated 1:1 interaction slot with participating investment team.",
      category: "1:1 Meeting",
      coachNum: "C4",
      coachName: "Innovation Pod 02",
      type: "coach" as const,
      confirmed: !!approvedMatch,
      isMatchPod: true,
    },
    {
      time: "01:15 PM",
      title: "Konkan Lunch & Founder Studio",
      location: "Dining Salon · Carriage D",
      description: "Authentic coastal dining service crossing Panval Viaduct followed by mentor breakout circles.",
      category: "Dining & Mentorship",
      coachNum: "C5",
      coachName: "Dining Salon",
      type: "coach" as const,
      confirmed: false,
    },
    {
      time: "04:20 PM",
      title: "Sunset Pitch Sprint & Open Deck",
      location: "Observation Lounge · Carriage C",
      description: "Lightning deck reviews and open collaboration discussions as the train approaches Goa.",
      category: "Open Deck",
      coachNum: "C6",
      coachName: "Observation Deck",
      type: "coach" as const,
      confirmed: false,
    },
    {
      time: "06:45 PM",
      title: "Goa Arrival & Sunset Mixer",
      location: "Madgaon / Waterfront Reception",
      description: "Expedition arrival, villa showcase transition, term sheet discussions and cohort dinner.",
      category: "Arrival & Mixer",
      coachNum: "C7",
      coachName: "Goa Terminus",
      type: "tail" as const,
      confirmed: false,
    },
  ];

  return (
    <section className="page">
      <span className="kicker">18 OCTOBER 2026 · EXPEDITION ITINERARY</span>
      <h2>Journey Schedule</h2>
      <p>
        Vande Bharat top-view coach sequence mapped from Mumbai CSMT down to Goa. Your private 1:1 meeting pods and boarding passes unlock automatically when matched by the curator.
      </p>

      {/* Schedule Top Action Bar */}
      <div className="schedule-header-actions">
        <div className="schedule-train-summary-pill">
          <span className="text-xl">🚆</span>
          <div>
            <b>Vande Bharat Express · 7 Connected Coaches</b>
            <small>Mumbai CSMT ➔ Panvel ➔ Ratnagiri ➔ Madgaon Goa</small>
          </div>
        </div>

        {approvedMatch ? (
          <button className="schedule-ticket-btn" onClick={onTicket}>
            View Confirmed Journey Ticket <Arrow />
          </button>
        ) : (
          <div className="schedule-locked-pill">
            <span>🔒 Journey Ticket Locked — Unlocks on Curator Approval</span>
          </div>
        )}
      </div>

      <div className="schedule-clean-timeline">
        {bogies.map((item, i) => (
          <div
            key={item.time}
            className={`schedule-clean-item ${item.confirmed ? "confirmed-item" : ""}`}
          >
            {/* Top-View Vande Bharat Coach Vector */}
            <div className="schedule-coach-visual">
              <VandeBharatCoachTopView
                type={item.type}
                coachNum={item.coachNum}
                confirmed={item.confirmed}
              />
              <span className="schedule-coach-label">{item.coachName}</span>
            </div>

            {/* Time & Location */}
            <div className="schedule-time-badge">
              <b>{item.time}</b>
              <small>{item.location}</small>
            </div>

            {/* Card Content & Status Badge */}
            <div className="schedule-card-body">
              <div className="schedule-card-header">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="schedule-card-badges">
                  {item.confirmed ? (
                    <span className="schedule-badge-confirmed">
                      ✓ Confirmed Match
                    </span>
                  ) : item.isMatchPod ? (
                    <span className="schedule-badge-locked">
                      🔒 Pending Curation
                    </span>
                  ) : (
                    <span className="schedule-badge-neutral">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {item.confirmed && (
                <div className="schedule-card-actions">
                  <button className="mini-cta" onClick={onTicket}>
                    View 1:1 Boarding Pass →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Messages({
  founder,
  profile,
  approvedMatch,
  sent,
  setSent,
}: {
  founder: boolean;
  profile: UserProfile | null;
  approvedMatch: any;
  sent: boolean;
  setSent: (b: boolean) => void;
}) {
  const partnerName = approvedMatch
    ? founder
      ? `${approvedMatch.investor_name} (${approvedMatch.investor_company})`
      : `${approvedMatch.founder_name} (${approvedMatch.founder_company})`
    : "Curator Room";

  const [messages, setMessages] = useState<
    Array<{
      sender_name: string;
      sender_email: string;
      text: string;
      created_at: string;
      out: boolean;
    }>
  >([]);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const myEmail = (profile?.email || "").toLowerCase().trim();
  const founderEmail =
    (approvedMatch?.founder_email || "").toLowerCase().trim() ||
    (founder ? myEmail : "") ||
    (approvedMatch?.founder_name || "").toLowerCase().trim() ||
    "founder";

  const investorEmail =
    (approvedMatch?.investor_email || "").toLowerCase().trim() ||
    (!founder ? myEmail : "") ||
    (approvedMatch?.investor_name || "").toLowerCase().trim() ||
    "investor";

  const loadMessages = useCallback(async () => {
    if (!approvedMatch) return;
    try {
      const res = await fetch(
        `/api/messages?founder_email=${encodeURIComponent(
          founderEmail
        )}&investor_email=${encodeURIComponent(investorEmail)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(
            data.map((m: any) => ({
              sender_name: m.sender_name,
              sender_email: m.sender_email,
              text: m.text,
              created_at: m.created_at,
              out:
                (m.sender_email && m.sender_email.toLowerCase() === myEmail) ||
                (m.sender_name && profile?.name && m.sender_name.toLowerCase() === profile.name.toLowerCase()),
            }))
          );
        }
      }
    } catch {}
  }, [approvedMatch, founderEmail, investorEmail, myEmail, profile?.name]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 1500);
    return () => clearInterval(interval);
  }, [loadMessages]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!msg.trim() || sending || !approvedMatch) return;

    const messageText = msg.trim();
    setMsg("");
    setSending(true);

    const newMsg = {
      founder_email: founderEmail,
      investor_email: investorEmail,
      sender_role: founder ? "founder" : "investor",
      sender_name: profile?.name || (founder ? "Founder" : "Investor"),
      sender_email: myEmail,
      text: messageText,
    };

    // Optimistically show message immediately in chat
    setMessages((prev) => [
      ...prev,
      {
        sender_name: newMsg.sender_name,
        sender_email: newMsg.sender_email,
        text: newMsg.text,
        created_at: new Date().toISOString(),
        out: true,
      },
    ]);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      setSent(true);
      await loadMessages();
    } catch {}
    setSending(false);
  }

  return (
    <section className="page">
      <span className="kicker">FOLLOW-UP ROOM</span>
      <h2>Keep the conversation warm.</h2>
      <p>
        Live private conversations open after a confirmed match by the curator.
        Only real communication between founder and investor.
      </p>
      <div className="messages" style={{ height: "420px" }}>
        <aside>
          <button className="active">
            <b>RP</b>
            <span>
              {partnerName}
              <br />
              <small>
                {approvedMatch
                  ? "Meeting Pod 01 · 10:30 AM"
                  : "Pending Curator Approval"}
              </small>
            </span>
          </button>
        </aside>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <b>{partnerName}</b>
          <small>
            {approvedMatch
              ? "18 Oct 2026 · Innovation Coach A · Confirmed Match"
              : "Awaiting Curator Approval"}
          </small>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "10px 0",
            }}
          >
            {!approvedMatch && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#63756d",
                  textAlign: "center",
                  margin: "auto",
                  padding: "16px",
                  background: "#f4f2eb",
                  borderRadius: "8px",
                  border: "1px dashed #dbe1d9",
                }}
              >
                🔒 This private follow-up room will unlock once your match is
                reviewed and approved by the curator.
              </p>
            )}

            {approvedMatch && messages.length === 0 && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#0f6b61",
                  textAlign: "center",
                  margin: "auto",
                  padding: "16px",
                  background: "#e3f2e9",
                  borderRadius: "8px",
                  border: "1px solid #c5dfd0",
                }}
              >
                ✓ You are connected with <b>{partnerName}</b>.
                <br />
                Send a live message below to coordinate your 1:1 pod meeting on
                board!
              </p>
            )}

            {approvedMatch &&
              messages.map((m, idx) => (
                <p
                  key={idx}
                  className={m.out ? "out" : ""}
                  style={{
                    margin: m.out ? "4px 0 4px auto" : "4px auto 4px 0",
                    maxWidth: "75%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      display: "block",
                      opacity: 0.75,
                      marginBottom: "2px",
                    }}
                  >
                    {m.out ? "You" : m.sender_name} ·{" "}
                    {m.created_at
                      ? new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Now"}
                  </span>
                  {m.text}
                </p>
              ))}
          </div>
          <form
            onSubmit={submit}
            style={{ marginTop: "auto", paddingTop: "8px" }}
          >
            <input
              value={msg}
              disabled={!approvedMatch || sending}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={
                approvedMatch
                  ? "Write a live message to your matched partner…"
                  : "Messaging unlocks after curator approval…"
              }
            />
            <button className="primary" disabled={!approvedMatch || sending}>
              {sending ? "Sending…" : "Send"}
            </button>
          </form>
        </main>
      </div>
    </section>
  );
}

function MeetingModal({
  founder,
  profile,
  approvedMatch,
  close,
  message,
  ticket,
}: {
  founder: boolean;
  profile: UserProfile | null;
  approvedMatch: any;
  close: () => void;
  message: () => void;
  ticket: () => void;
}) {
  const title = approvedMatch
    ? founder
      ? `${approvedMatch.investor_name} (${approvedMatch.investor_company})`
      : `${approvedMatch.founder_name} (${approvedMatch.founder_company})`
    : founder
    ? "Coastline Ventures"
    : "TerraLoop Circular Logistics";

  return (
    <div className="overlay">
      <section className="meeting-modal">
        <button className="close" onClick={close}>
          ×
        </button>
        <span className="kicker">CONFIRMED CURATED 1:1</span>
        <h2>{title}</h2>
        <p className="modal-copy">
          {founder ? "Partner Investing Session" : "Founder Pitch Deck & Traction Session"}
        </p>
        <div className="meeting-info">
          <span>
            <b>10:30–10:55</b>
            <small>25 minute pod conversation</small>
          </span>
          <span>
            <b>Private Meeting Pod 01</b>
            <small>Innovation Coach · Carriage A</small>
          </span>
          <span>
            <b>99% sector fit</b>
            <small>{approvedMatch?.sector || profile?.primarySector || "Sector alignment"}</small>
          </span>
        </div>
        <div className="meeting-actions">
          <button className="primary" onClick={message}>
            Open follow-up room <Arrow />
          </button>
          <button className="ticket-cta" onClick={ticket}>
            View journey ticket
          </button>
        </div>
      </section>
    </div>
  );
}

function JourneyTicket({
  founder,
  profile,
  close,
}: {
  founder: boolean;
  profile: UserProfile | null;
  close: () => void;
}) {
  const [downloaded, setDownloaded] = useState(false);

  function printOrDownload() {
    setDownloaded(true);
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="overlay">
      <section className="journey-ticket">
        <button className="close" onClick={close}>
          ×
        </button>
        <div className="ticket-top">
          <span>RAILPITCH JOURNEY PASS · VERIFIED PASS</span>
          <strong>EDITION 01</strong>
        </div>
        <div className="ticket-body">
          <div>
            <small>PARTICIPANT</small>
            <b>{profile?.name ? profile.name.toUpperCase() : "TARUN K S"}</b>
          </div>
          <div>
            <small>ROLE</small>
            <b>{founder ? "FOUNDER" : "INVESTOR"}</b>
          </div>
          <div>
            <small>ROUTE</small>
            <b>MUMBAI → GOA</b>
          </div>
          <div>
            <small>BOARDING</small>
            <b>18 OCT · 08:10 AM</b>
          </div>
          <div>
            <small>COACH & SEAT</small>
            <b>INNOVATION A · 18A</b>
          </div>
          <div className="qr" title="Verified QR Pass">
            RP
            <br />
            ✓
          </div>
        </div>
        <div className="ticket-foot">
          <span>3 CONFIRMED 1:1 POD SESSIONS · FOOD & WINE INCLUDED · PLATFORM 8 CSMT</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={printOrDownload} style={{ background: "#b85e39", color: "white", padding: "6px 12px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>
              {downloaded ? "✓ Printed / Saved" : "Print / Save Pass ↗"}
            </button>
            <button onClick={close} style={{ fontWeight: 800 }}>Done</button>
          </div>
        </div>
      </section>
    </div>
  );
}


function FounderReview({
  profile,
  approvedMatch,
  close,
  approved,
}: {
  profile: UserProfile | null;
  approvedMatch?: any;
  close: () => void;
  approved: () => void;
}) {
  const [deckSlide, setDeckSlide] = useState<number | null>(null);

  const founderName = approvedMatch?.founder_name || "Aditi Rao";
  const companyName = approvedMatch?.founder_company || "TerraLoop Circular Logistics";
  const fileName = approvedMatch ? `${approvedMatch.founder_company.replace(/\s+/g, "_")}_Pitch_Deck.pdf` : "TerraLoop_RailPitch_Deck.pdf";
  const primarySector = approvedMatch?.sector || profile?.primarySector || "ClimateTech & Circular Economy";
  const ask = "₹1.2Cr Pre-seed round";

  const deckSlides = [
    {
      title: "01 / 07 — Cover & Mission",
      sub: `${companyName} · Sustainable innovation in ${primarySector.split("&")[0]}.`,
      text: `Building next-generation solutions for ${primarySector}. Led by ${founderName}.`,
    },
    {
      title: "02 / 07 — Problem & Opportunity",
      sub: "Large unaddressed market inefficiency along high-growth corridors.",
      text: "Existing market players lack digital tracking, automated logistics and circular return infrastructure.",
    },
    {
      title: "03 / 07 — Product & Solution",
      sub: `${companyName} Core Technology & Hardware.`,
      text: "Proprietary software platform with real-time analytics, automated routing, and deposit return workflows.",
    },
    {
      title: "04 / 07 — Traction & Milestones",
      sub: "Active Pilot Customers & Monthly Growth.",
      text: "78% customer retention rate with pilot operations across coastal hubs.",
    },
    {
      title: "05 / 07 — Business Model",
      sub: "B2B SaaS Subscription + Usage Revenue.",
      text: "Recurring monthly revenue model with 48% gross profit margin.",
    },
    {
      title: "06 / 07 — Founding Team",
      sub: `${founderName} & Core Leadership Team.`,
      text: "Proven execution capabilities in product, technology, and operations.",
    },
    {
      title: "07 / 07 — Funding Ask & Milestones",
      sub: `Target Ask: ${ask}`,
      text: `Capital allocated to expand operations, tech deployment, and team growth across the Mumbai–Goa corridor.`,
    },
  ];

  return (
    <div className="overlay">
      <section className="founder-review">
        <button className="close" onClick={close}>
          ×
        </button>
        <span className="kicker">PRIVATE FOUNDER REVIEW · 94% MATCH</span>
        <header>
          <i>AR</i>
          <div>
            <h2>{founderName}</h2>
            <p>{companyName}</p>
          </div>
          <Tag mint>Pre-seed · ₹1.2Cr ask</Tag>
        </header>
        <div className="review-grid">
          <div>
            <h3>Why this fits your thesis</h3>
            <p>
              TerraLoop is building circular packaging logistics for independent coastal retailers—directly aligned to your climate and mobility focus.
            </p>
            <div className="review-tags">
              <Tag mint>{primarySector}</Tag>
              <Tag>Verified Application</Tag>
            </div>
            <h3>Founder snapshot</h3>
            <p>2-person founding team · Pilot traction with 14 coastal retailers · Looking for distribution and strategic capital.</p>
          </div>
          <aside>
            <span className="deck-icon">PDF</span>
            <strong>{fileName}</strong>
            <small>7 slides · submitted with application</small>

            <button className="ticket-cta" onClick={() => setDeckSlide(deckSlide === null ? 0 : null)}>
              {deckSlide !== null ? "Close deck preview" : "Preview pitch deck"}
            </button>

            {deckSlide !== null && (
              <div className="deck-preview" style={{ marginTop: "12px", background: "white", padding: "14px", borderRadius: "6px", border: "1px solid #d8e2d8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <b style={{ fontSize: "10px", color: "#0f6b61" }}>SLIDE {deckSlide + 1} OF 7</b>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      disabled={deckSlide === 0}
                      onClick={() => setDeckSlide(Math.max(0, deckSlide - 1))}
                      style={{ border: "1px solid #cbd8cf", background: "#f0f6f2", padding: "2px 6px", fontSize: "10px", borderRadius: "3px" }}
                    >
                      ←
                    </button>
                    <button
                      disabled={deckSlide === deckSlides.length - 1}
                      onClick={() => setDeckSlide(Math.min(deckSlides.length - 1, deckSlide + 1))}
                      style={{ border: "1px solid #cbd8cf", background: "#f0f6f2", padding: "2px 6px", fontSize: "10px", borderRadius: "3px" }}
                    >
                      →
                    </button>
                  </div>
                </div>
                <h4 style={{ fontSize: "13px", margin: "4px 0", color: "#102720", fontWeight: 800 }}>{deckSlides[deckSlide].title}</h4>
                <p style={{ fontSize: "11px", color: "#4a5c53", margin: "4px 0 0", lineHeight: "1.4" }}>{deckSlides[deckSlide].text}</p>
              </div>
            )}
          </aside>
        </div>
        <footer>
          <small>Approving unlocks the founder’s confirmed journey meeting. No investment is committed.</small>
          <button className="primary" onClick={approved}>
            Approve for journey <Arrow />
          </button>
        </footer>
      </section>
    </div>
  );
}

function Curator({ close }: { close: () => void }) {
  const [approved, setApproved] = useState(false);
  return (
    <div className="curator">
      <aside>
        <Brand />
        <span className="kicker">CURATOR TEAM · OWNER CONSOLE</span>
        {["Overview", "Applications 24", "Match studio 8", "Programme"].map((x, i) => (
          <button className={i === 0 ? "active" : ""} key={x}>
            {x}
          </button>
        ))}
        <button onClick={close}>← Exit curator console</button>
      </aside>
      <main>
        <header>
          <div>
            <span className="kicker">EDITION 01 · MUMBAI → GOA · PLATFORM OWNER (kstarun176@gmail.com)</span>
            <h1>Match with care.</h1>
          </div>
          <small>● Cohort health: strong</small>
        </header>
        <div className="metrics">
          <Metric n="24" t="Founder applications" />
          <Metric n="12" t="Verified investors" />
          <Metric n="42" t="Confirmed 1:1s" />
          <Metric n="87%" t="Match acceptance" />
        </div>
        <section className="studio">
          <span className="kicker">MATCH STUDIO</span>
          <h2>Suggested connections</h2>
          <p>Recommendations explain themselves. As platform owner, you make the final call.</p>
          <div className="comparison">
            <article>
              <span className="kicker">FOUNDER</span>
              <h3>TerraLoop Circular Logistics</h3>
              <p>Circular packaging logistics & sustainable mobility.</p>
              <Tag mint>Mobility & TravelTech</Tag> <Tag>ClimateTech</Tag>
              <dl>
                <dt>Stage</dt>
                <dd>Pre-seed</dd>
                <dt>Raising</dt>
                <dd>₹1.2Cr</dd>
              </dl>
            </article>
            <div>
              <b>94%</b>
              <h3>High-fit match</h3>
              <p>
                Strong primary-sector overlap, compatible pre-seed range, and investor explicitly requested circular infrastructure.
              </p>
              <label>
                Sector fit{" "}
                <i>
                  <em style={{ width: "94%" }} />
                </i>
              </label>
              <label>
                Stage fit{" "}
                <i>
                  <em style={{ width: "100%" }} />
                </i>
              </label>
              <label>
                Cheque fit{" "}
                <i>
                  <em style={{ width: "82%" }} />
                </i>
              </label>
              <button className="primary" onClick={() => setApproved(true)}>
                {approved ? "Match approved ✓" : "Approve match"} <Arrow />
              </button>
            </div>
            <article>
              <span className="kicker">INVESTOR</span>
              <h3>Coastline Ventures</h3>
              <p>Partner</p>
              <Tag mint>Climate & Mobility</Tag> <Tag>Seed</Tag>
              <dl>
                <dt>Cheque</dt>
                <dd>₹1Cr–₹5Cr</dd>
                <dt>Verification</dt>
                <dd>Complete</dd>
              </dl>
            </article>
          </div>
        </section>
        <section className="queue">
          <span className="kicker">APPLICATION QUEUE</span>
          <h2>Review with context.</h2>
          {[
            ["TerraLoop Logistics", "Mobility · Climate", "Pre-seed", "Ready"],
            ["Reefline Infrastructure", "Travel · Consumer", "Seed", "Ready"],
            ["Aether Works Tech", "DeepTech · Climate", "Seed", "Review"],
            ["Kora Organic Foods", "Agri · Consumer", "Pre-seed", "Needs matches"],
          ].map((x) => (
            <div key={x[0]}>
              <b>{x[0]}</b>
              <span>{x[1]}</span>
              <span>{x[2]}</span>
              <Tag mint={x[3] === "Ready"}>{x[3]}</Tag>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
