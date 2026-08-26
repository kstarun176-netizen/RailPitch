import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jmlufhrkscwvdcnekvae.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbHVmaHJrc2N3dmRjbmVrdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDQ4NzksImV4cCI6MjEwMzMyMDg3OX0.EZs49olU61MGJsjl4EREb-twIYx57bBifHnF2ThRqbA";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "applications.json");
const MATCHES_FILE = path.join(DATA_DIR, "matches.json");

const SEED_APPLICATIONS = [
  {
    id: "app_founder_1",
    role: "founder",
    full_name: "Tarun K (Founder)",
    company_name: "RailTech Innovations",
    email: "kstarun176@gmail.com",
    primary_sector: "Deep Tech & Hardware",
    secondary_sectors: ["AI & Enterprise Software", "Clean Energy & Mobility"],
    stage_or_cheque: "Seed",
    ask_or_focus: "Raising ₹2.5 Cr for high-speed sensor deployments across central railways.",
    file_url: "https://railpitch.com/decks/railtech_pitch.pdf",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "app_founder_2",
    role: "founder",
    full_name: "Priya Sharma",
    company_name: "SarvAI Labs",
    email: "priya@sarvai.io",
    primary_sector: "AI & Enterprise Software",
    secondary_sectors: ["Fintech & Commerce"],
    stage_or_cheque: "Pre-seed",
    ask_or_focus: "Building multilingual voice AI agents for Indian SMEs. Raising ₹1.2 Cr.",
    file_url: "https://railpitch.com/decks/sarvai_deck.pdf",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "app_founder_3",
    role: "founder",
    full_name: "Rohan Deshmukh",
    company_name: "VoltRail Mobility",
    email: "rohan@voltrail.com",
    primary_sector: "Clean Energy & Mobility",
    secondary_sectors: ["Deep Tech & Hardware"],
    stage_or_cheque: "Seed",
    ask_or_focus: "Battery swapping infrastructure for electric commercial locomotives. Raising ₹3.5 Cr.",
    file_url: "https://railpitch.com/decks/voltrail.pdf",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "app_investor_1",
    role: "investor",
    full_name: "Aakash Mehta (Partner)",
    company_name: "VentureRail Capital",
    email: "aakash@venturerail.vc",
    primary_sector: "Deep Tech & Hardware",
    secondary_sectors: ["AI & Enterprise Software"],
    stage_or_cheque: "₹1Cr – ₹5Cr",
    ask_or_focus: "Looking for early deep tech and mobility founders with high engineering moats.",
    linkedin_url: "https://linkedin.com/in/aakash-mehta",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "app_investor_2",
    role: "investor",
    full_name: "Devina Kapoor",
    company_name: "Elevation Sparks",
    email: "devina@elevationsparks.com",
    primary_sector: "AI & Enterprise Software",
    secondary_sectors: ["Fintech & Commerce"],
    stage_or_cheque: "₹25L – ₹1Cr",
    ask_or_focus: "Investing in generative AI and workflow automation for industrial operations.",
    linkedin_url: "https://linkedin.com/in/devina-kapoor",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "app_investor_3",
    role: "investor",
    full_name: "Vikram Singhania",
    company_name: "GreenTrack Ventures",
    email: "vikram@greentrack.in",
    primary_sector: "Clean Energy & Mobility",
    secondary_sectors: ["Deep Tech & Hardware"],
    stage_or_cheque: "₹5Cr+",
    ask_or_focus: "Backing climate tech and sustainable transport infrastructure.",
    linkedin_url: "https://linkedin.com/in/vikram-singhania",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

function getLocalApps(): any[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return SEED_APPLICATIONS;
}

function saveLocalApps(apps: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), "utf-8");
  } catch {}
}

export async function GET(req: NextRequest) {
  const mergedMap = new Map<string, any>();

  // 1. Load seed applications
  for (const s of SEED_APPLICATIONS) {
    if (s.email) mergedMap.set(s.email.toLowerCase(), s);
  }

  // 2. Load local applications
  const localApps = getLocalApps();
  for (const a of localApps) {
    if (a.email) mergedMap.set(a.email.toLowerCase(), a);
  }

  // 3. Fetch from Supabase applications table
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const a of data) {
          if (a.email) {
            let detailsObj: any = {};
            try {
              if (typeof a.details === "string") detailsObj = JSON.parse(a.details);
              else if (typeof a.details === "object" && a.details) detailsObj = a.details;
            } catch {}

            mergedMap.set(a.email.toLowerCase(), {
              id: a.id,
              role: a.type || detailsObj.role || "founder",
              full_name: a.name || detailsObj.full_name || a.email.split("@")[0],
              company_name: detailsObj.company_name || detailsObj.company || `${a.name || "Founder"}'s Venture`,
              email: a.email,
              primary_sector: detailsObj.primary_sector || "Deep Tech & Hardware",
              secondary_sectors: detailsObj.secondary_sectors || [],
              stage_or_cheque: detailsObj.stage_or_cheque || "Seed",
              ask_or_focus: detailsObj.ask_or_focus || "Expanding operations",
              file_url: detailsObj.file_url || null,
              linkedin_url: detailsObj.linkedin_url || null,
              created_at: a.created_at || new Date().toISOString(),
            });
          }
        }
      }
    }
  } catch {}

  // 4. Fetch from Supabase founders table
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/founders?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const f of data) {
          if (f.email) {
            const existing = mergedMap.get(f.email.toLowerCase()) || {};
            mergedMap.set(f.email.toLowerCase(), {
              ...existing,
              id: f.id || existing.id,
              role: "founder",
              full_name: existing.full_name || f.email.split("@")[0],
              company_name: f.startup_name || existing.company_name || "Venture",
              email: f.email,
              primary_sector: f.category || existing.primary_sector || "Deep Tech & Hardware",
              created_at: f.created_at || existing.created_at,
            });
          }
        }
      }
    }
  } catch {}

  // 5. Fetch from Supabase investors table
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/investors?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const i of data) {
          if (i.email) {
            const existing = mergedMap.get(i.email.toLowerCase()) || {};
            mergedMap.set(i.email.toLowerCase(), {
              ...existing,
              id: i.id || existing.id,
              role: "investor",
              full_name: existing.full_name || i.email.split("@")[0],
              company_name: existing.company_name || "Investment Fund",
              email: i.email,
              linkedin_url: i.linkedin_url || existing.linkedin_url,
              stage_or_cheque: i.ticket_size || existing.stage_or_cheque || "₹1Cr – ₹5Cr",
              created_at: i.created_at || existing.created_at,
            });
          }
        }
      }
    }
  } catch {}

  const allApps = Array.from(mergedMap.values());
  return NextResponse.json(allApps);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records = Array.isArray(body) ? body : [body];

    const existing = getLocalApps();
    for (const rec of records) {
      const recordWithId = {
        id: rec.id || `app_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        created_at: rec.created_at || new Date().toISOString(),
        ...rec,
      };
      const idx = existing.findIndex((a: any) => a.email && rec.email && a.email.toLowerCase() === rec.email.toLowerCase());
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...recordWithId };
      } else {
        existing.unshift(recordWithId);
      }

      // Forward to Supabase applications table
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            name: recordWithId.full_name || recordWithId.name,
            email: recordWithId.email,
            type: recordWithId.role,
            status: "pending",
            details: JSON.stringify({
              company_name: recordWithId.company_name,
              primary_sector: recordWithId.primary_sector,
              secondary_sectors: recordWithId.secondary_sectors,
              stage_or_cheque: recordWithId.stage_or_cheque,
              ask_or_focus: recordWithId.ask_or_focus,
              file_url: recordWithId.file_url || null,
              linkedin_url: recordWithId.linkedin_url || null,
            }),
          }),
        });
      } catch {}

      // If founder, insert into Supabase founders table
      if (rec.role === "founder") {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/founders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              email: recordWithId.email,
              startup_name: recordWithId.company_name,
              category: recordWithId.primary_sector,
              status: "pending",
            }),
          });
        } catch {}
      }

      // If investor, insert into Supabase investors table
      if (rec.role === "investor") {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/investors`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              email: recordWithId.email,
              linkedin_url: recordWithId.linkedin_url || null,
              ticket_size: recordWithId.stage_or_cheque,
              status: "pending",
            }),
          });
        } catch {}
      }
    }
    saveLocalApps(existing);

    return NextResponse.json({ ok: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, id } = body;

    let existing = getLocalApps();
    if (email) {
      existing = existing.filter((a: any) => a.email?.toLowerCase() !== email.toLowerCase());
    } else if (id) {
      existing = existing.filter((a: any) => a.id !== id);
    }
    saveLocalApps(existing);

    // Clean up matches
    try {
      if (fs.existsSync(MATCHES_FILE) && email) {
        const matchesContent = fs.readFileSync(MATCHES_FILE, "utf-8");
        let matches = JSON.parse(matchesContent);
        matches = matches.filter(
          (m: any) =>
            m.founder_email?.toLowerCase() !== email.toLowerCase() &&
            m.investor_email?.toLowerCase() !== email.toLowerCase()
        );
        fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2), "utf-8");
      }
    } catch {}

    // Delete from Supabase applications, founders, and investors
    if (email) {
      const emailFilter = `email=eq.${encodeURIComponent(email)}`;
      const tables = ["applications", "founders", "investors"];
      for (const t of tables) {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/${t}?${emailFilter}`, {
            method: "DELETE",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          });
        } catch {}
      }
    }

    return NextResponse.json({ ok: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
