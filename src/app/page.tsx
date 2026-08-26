"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { CloudShader } from "@/components/ui/cloud-shader";
import { DpiitEligibilityChecker } from "@/components/DpiitEligibilityChecker";

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

  const handleGoogleAuthSuccess = async (name: string, email: string) => {
    const found = await syncWithSupabase(email, name);
    if (!found) {
      const profile: UserProfile = {
        name,
        email,
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
        localStorage.setItem("rp_live_auth_email", email);
      } catch {}
      setShowGoogleModal(false);
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
          <button onClick={() => setShowGoogleModal(true)}>
            Log in <Arrow />
          </button>
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
          <div className="hero-copy" style={{ background: "rgba(250, 249, 245, 0.82)", backdropFilter: "blur(10px)", borderRadius: "12px", margin: "20px 0 20px 5.2vw", border: "1px solid rgba(219, 225, 217, 0.6)" }}>
            <span className="kicker">
              <b />
              CURATED EXPEDITION · EDITION 01
            </span>
            <h1>
              Where the <em>next</em> big idea finds its way.
            </h1>
            <p>
              RailPitch brings exceptional founders and investors together for a focused Mumbai–Goa journey built around meaningful conversations—not random pitches.
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
              <div className="bullet-train">
                <div className="train-nose" />
                <div className="train-headlamp" />
                <div className="train-blue-stripe" />
                <div className="train-window-row">
                  <span className="train-win" />
                  <span className="train-win" />
                  <span className="train-win" />
                  <span className="train-win" />
                  <span className="train-win" />
                  <span className="train-win" />
                  <span className="train-win" />
                  <span className="train-win" />
                </div>
              </div>
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
        <div className="programme">
          <div className="map">
            <div className="mapline" />
            <span>
              Mumbai
              <br />
              <b>08:10</b>
            </span>
            <span>
              Panvel
              <br />
              <b>09:05</b>
            </span>
            <span>
              Ratnagiri
              <br />
              <b>13:30</b>
            </span>
            <span>
              Goa
              <br />
              <b>18:45</b>
            </span>
          </div>
          <div className="times">
            {[
              ["08:45", "Opening circle", "Set the intention. Meet your cohort."],
              ["10:30", "Curated 1:1s", "Three pre-confirmed conversations."],
              ["13:15", "Coastal table", "Lunch, product showcase & peer circles."],
              ["15:20", "Founder studio", "Mentor office hours and follow-up plans."],
              ["18:45", "Goa arrival", "Destination showcase and next steps."],
            ].map((x, i) => (
              <div key={x[0]}>
                <time>{x[0]}</time>
                <i className={i === 1 ? "hot" : ""} />
                <p>
                  <strong>{x[1]}</strong>
                  <small>{x[2]}</small>
                </p>
              </div>
            ))}
          </div>
        </div>
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
        <a href="/curator" style={{ border: 0, background: "none", color: "#708078", fontSize: "11px", textAlign: "right", cursor: "pointer", textDecoration: "none" }}>Curator team access</a>
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
}: {
  close: () => void;
  onSuccess: (name: string, email: string) => void;
}) {
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuickSelect = async (name: string, email: string) => {
    setLoading(true);
    await onSuccess(name, email);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (googleEmail.trim()) {
      setLoading(true);
      const nameToUse = googleName.trim() || googleEmail.split("@")[0];
      await onSuccess(nameToUse, googleEmail.trim());
      setLoading(false);
    }
  };

  const savedEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("rp_live_auth_email") || "kstarun176@gmail.com"
      : "kstarun176@gmail.com";

  return (
    <div className="overlay">
      <section className="meeting-modal" style={{ maxWidth: "460px", padding: "32px" }}>
        <button className="close" onClick={close}>
          ×
        </button>
        <span className="kicker">AUTHENTICATION & SESSION</span>
        <h2 style={{ fontSize: "24px", margin: "8px 0" }}>Sign In to RailPitch</h2>
        <p className="modal-copy" style={{ marginBottom: "20px", fontSize: "12px" }}>
          Log in with your Google account or email. Your login info, role, and matches will be remembered securely.
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
            border: "1.5px solid #0f6b61",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#102720",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(15, 107, 97, 0.08)",
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
              <small style={{ fontSize: "10px", color: "#0f6b61", fontWeight: 600 }}>
                1-Click Instant Google Sign-In
              </small>
            </div>
          </div>
          <span style={{ color: "#0f6b61", fontSize: "14px" }}>→</span>
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
              placeholder="founder@startup.com"
              style={{ width: "100%", padding: "10px", marginTop: "4px", border: "1px solid #d5ddd4", borderRadius: "4px" }}
            />
          </label>
          <button className="primary" disabled={loading} style={{ width: "100%", marginTop: "8px" }}>
            {loading ? "Checking Supabase Records…" : "Sign In & Remember Me →"}
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
  const [uploading, setUploading] = useState(false);

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
      } catch {}

      // Fire database insert with verified file_url
      supabase.from("applications").insert([
        {
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
        },
      ]).catch(() => {});

      // Transition immediately to dashboard!
      setUploading(false);
      done(profile);
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
          <button className="primary" disabled={uploading}>
            {uploading ? "Saving application..." : step === 3 ? "Submit application" : "Continue"} <Arrow />
          </button>
        </form>
      </section>
      <aside>
        <span>EDITION 01</span>
        <h2>
          Mumbai
          <br />
          <em>→</em> Goa
        </h2>
        <p>
          18 October 2026
          <br />
          Innovation Coach
        </p>
        <div>
          <b>16</b>
          <small>founder seats</small>
          <b>12</b>
          <small>investor seats</small>
        </div>
      </aside>
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
      if (!profile?.email) {
        setLoadingMatch(false);
        return;
      }
      try {
        const { data } = await supabase.from("matches").select("*");
        const list = Array.isArray(data) ? data : [];
        const match = list.find((m: any) =>
          founder
            ? m.founder_email?.toLowerCase() === profile.email.toLowerCase()
            : m.investor_email?.toLowerCase() === profile.email.toLowerCase()
        );
        if (match) {
          setApprovedMatch(match);
          setUnreadCount(1);
        }
      } catch {}
      setLoadingMatch(false);
    }
    checkCuratorApproval();
  }, [profile?.email, founder]);

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
      <span className="kicker">{title}</span>
      <h3>{name}</h3>
      <b className="score">{score}</b>
      <p>{copy}</p>
      <Tag mint>Selected Focus</Tag> <Tag>Active</Tag>
      <button className="panel-cta" onClick={click}>
        {action} <Arrow />
      </button>
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
      time: "08:10",
      title: "Boarding & Welcome Coffee",
      sub: "Innovation Coach · CSMT Platform 8",
      coachCode: "CARRIAGE 01 · WELCOME SALON",
      coachType: "Barista & Check-In Lounge",
      confirmed: false,
      seats: 4,
    },
    {
      time: "08:45",
      title: "Opening Circle & Cohort Intro",
      sub: "Carriage A · all 28 participants",
      coachCode: "CARRIAGE 02 · MAIN AUDITORIUM",
      coachType: "Cohort Keynote Coach",
      confirmed: false,
      seats: 6,
    },
    {
      time: "10:30",
      title: "Curated 1:1 Pod Session 01",
      sub: approvedMatch
        ? `Private Meeting Pod 01 · Confirmed with ${approvedMatch.founder_company || approvedMatch.investor_company || "Partner"}`
        : "Private Meeting Pod 01 · Pending Curator Match",
      coachCode: "CARRIAGE 03 · 1:1 POD 01",
      coachType: approvedMatch ? "Private Meeting Pod 01 · Confirmed" : "Private Meeting Pod 01 · Locked",
      confirmed: !!approvedMatch,
      seats: 2,
    },
    {
      time: "12:40",
      title: "Curated 1:1 Pod Session 02",
      sub: approvedMatch
        ? "Private Meeting Pod 02 · Confirmed Session"
        : "Private Meeting Pod 02 · Pending Curator Match",
      coachCode: "CARRIAGE 04 · 1:1 POD 02",
      coachType: approvedMatch ? "Private Meeting Pod 02 · Confirmed" : "Private Meeting Pod 02 · Locked",
      confirmed: !!approvedMatch,
      seats: 2,
    },
    {
      time: "13:15",
      title: "Coastal Table & Product Showcase",
      sub: "Dining Salon · Carriage D",
      coachCode: "CARRIAGE 05 · DINING GALLEY",
      coachType: "Coastal Gastronomy Salon",
      confirmed: false,
      seats: 4,
    },
    {
      time: "16:20",
      title: "Sunset Pitch Sprint & Open Deck",
      sub: "Observation Lounge · Carriage C",
      coachCode: "CARRIAGE 06 · OBSERVATION DECK",
      coachType: "Panoramic Observation Lounge",
      confirmed: false,
      seats: 4,
    },
    {
      time: "18:45",
      title: "Goa Arrival & Waterfront Reception",
      sub: "Panjim Waterfront Terrace",
      coachCode: "TERMINUS · PANJIM WATERFRONT",
      coachType: "Arrival & Celebration Terrace",
      confirmed: false,
      seats: 0,
    },
  ];

  return (
    <section className="page">
      <span className="kicker">18 OCTOBER · MUMBAI TO GOA</span>
      <h2>Your journey, mapped.</h2>
      <p>
        Every session has a purpose. Train bogie sequence mapped from Mumbai
        CSMT to Panjim Goa. Your confirmed meeting pods and boarding passes unlock upon curator approval.
      </p>

      {approvedMatch ? (
        <button className="ticket-cta" onClick={onTicket}>
          View RailPitch journey ticket <Arrow />
        </button>
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff", padding: "10px 18px", borderRadius: "6px", border: "1px dashed #cad8cf", margin: "0 0 18px" }}>
          <span style={{ fontSize: "11px", color: "#63756d", fontWeight: 700 }}>
            🔒 RailPitch Journey Ticket Locked — Issued after Curator approves your match
          </span>
        </div>
      )}

      <div className="bogie-train-timeline">
        {/* Train track background spine */}
        <div className="bogie-track-line" />

        {/* Locomotive Head */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "#102720", color: "#a6f4d0", borderRadius: "10px", marginBottom: "4px", zIndex: 2, border: "2px solid #234135" }}>
          <span style={{ fontSize: "16px" }}>🚆</span>
          <div>
            <b style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>RAILPITCH EXPRESS LOCOMOTIVE · MUMBAI → GOA</b>
            <small style={{ display: "block", fontSize: "9px", color: "#8fc4ae", marginTop: "2px" }}>Departure: CSMT Platform 8 · Expedition Convoy Active</small>
          </div>
        </div>

        {bogies.map((b, i) => (
          <div className="bogie-item" key={b.time}>
            {/* Bogie Coupler Connector */}
            <div className="bogie-coupler" />

            {/* Coach Bogie Card */}
            <div className={`bogie-coach-card ${b.confirmed ? "bogie-confirmed" : ""}`}>
              {/* Top roof identifier */}
              <div className="bogie-roof-strip">
                <div className="bogie-coach-id">
                  <span className="bogie-status-dot" />
                  {b.coachCode}
                </div>
                <div className="bogie-interior-tag">
                  {b.coachType}
                </div>
              </div>

              {/* Main Content Row */}
              <div className="bogie-main-row">
                <div className="bogie-time-block">
                  {b.time}
                </div>

                <div className="bogie-info">
                  <h3>
                    {b.title}
                    {b.confirmed && <span className="bogie-badge">POD POD MATCH</span>}
                  </h3>
                  <p>{b.sub}</p>

                  {/* Top-down compartment seating blueprint */}
                  <div className="bogie-interior-layout">
                    <span style={{ fontSize: "8px", fontWeight: 800, color: "#8ca296", letterSpacing: "0.5px", marginRight: "4px" }}>
                      CABIN PLAN:
                    </span>
                    {Array.from({ length: Math.max(1, b.seats) }).map((_, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        <span className={`bogie-seat-pod ${b.confirmed ? "active" : ""}`} />
                        {idx % 2 === 0 && <span className="bogie-seat-table" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bogie-actions">
                  {b.confirmed ? (
                    <button className="mini-cta" onClick={onTicket}>
                      View ticket
                    </button>
                  ) : (i === 2 || i === 3) ? (
                    <span className="bogie-badge" style={{ background: "#f0f4f1", color: "#6a7c73", borderColor: "#cbd8cf" }}>
                      🔒 Pass Pending Curation
                    </span>
                  ) : null}
                </div>
              </div>
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

  const founderEmail = approvedMatch?.founder_email || "";
  const investorEmail = approvedMatch?.investor_email || "";
  const myEmail = (profile?.email || "").toLowerCase();

  const loadMessages = useCallback(async () => {
    if (!approvedMatch || !founderEmail || !investorEmail) return;
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
              out: m.sender_email?.toLowerCase() === myEmail,
            }))
          );
        }
      }
    } catch {}
  }, [approvedMatch, founderEmail, investorEmail, myEmail]);

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
