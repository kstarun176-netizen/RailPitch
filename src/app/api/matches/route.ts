import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jmlufhrkscwvdcnekvae.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbHVmaHJrc2N3dmRjbmVrdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDQ4NzksImV4cCI6MjEwMzMyMDg3OX0.EZs49olU61MGJsjl4EREb-twIYx57bBifHnF2ThRqbA";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "matches.json");

function getLocalMatches(): any[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch {}
  return [];
}

function saveLocalMatches(matches: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(matches, null, 2), "utf-8");
  } catch {}
}

export async function GET(req: NextRequest) {
  let supabaseMatches: any[] = [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/matches?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) supabaseMatches = data;
    }
  } catch {}

  const localMatches = getLocalMatches();

  const mergedMap = new Map();
  for (const m of localMatches) {
    if (
      !m ||
      !m.founder_name ||
      !m.investor_name ||
      m.founder_name.startsWith("__") ||
      m.investor_name.startsWith("__") ||
      m.status === "deleted"
    ) {
      continue;
    }
    const key = `${(m.founder_email || m.founder_name || "").toLowerCase()}_${(m.investor_email || m.investor_name || "").toLowerCase()}`;
    mergedMap.set(key, m);
  }

  for (const row of supabaseMatches) {
    // Strictly filter out any deleted application markers or incomplete rows
    if (
      !row ||
      !row.founder_name ||
      !row.investor_name ||
      row.founder_name.startsWith("__") ||
      row.investor_name.startsWith("__") ||
      row.founder_company === "CHAT_MSG" ||
      (typeof row.status === "string" && row.status.includes('"is_chat":true')) ||
      row.status === "deleted"
    ) {
      continue;
    }

    let fEmail = row.founder_email || "";
    let iEmail = row.investor_email || "";
    let sector = row.sector || "Clean Energy & Mobility";
    let approvedAt = row.approved_at || row.created_at || new Date().toISOString();

    if (typeof row.status === "string" && row.status.startsWith("{")) {
      try {
        const meta = JSON.parse(row.status);
        if (meta.founder_email) fEmail = meta.founder_email;
        if (meta.investor_email) iEmail = meta.investor_email;
        if (meta.sector) sector = meta.sector;
        if (meta.approved_at) approvedAt = meta.approved_at;
      } catch {}
    }

    const matchObj = {
      id: row.id,
      founder_name: row.founder_name || "",
      founder_company: row.founder_company || "",
      founder_email: fEmail,
      investor_name: row.investor_name || "",
      investor_company: row.investor_firm || row.investor_company || "",
      investor_email: iEmail,
      sector,
      approved_at: approvedAt,
    };

    const key = `${(fEmail || row.founder_name || "").toLowerCase()}_${(iEmail || row.investor_name || "").toLowerCase()}`;
    mergedMap.set(key, matchObj);
  }

  const allMatches = Array.from(mergedMap.values());
  return NextResponse.json(allMatches);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records = Array.isArray(body) ? body : [body];

    const existing = getLocalMatches();
    for (const rec of records) {
      const recordWithId = {
        id: rec.id || `match_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        approved_at: rec.approved_at || new Date().toISOString(),
        ...rec,
      };
      existing.unshift(recordWithId);

      // Forward to Supabase formatted to match the Supabase table columns
      try {
        const supabasePayload = {
          founder_name: rec.founder_name || null,
          founder_company: rec.founder_company || null,
          investor_name: rec.investor_name || null,
          investor_firm: rec.investor_company || null,
          status: JSON.stringify({
            founder_email: rec.founder_email || "",
            investor_email: rec.investor_email || "",
            sector: rec.sector || "",
            approved_at: rec.approved_at || new Date().toISOString(),
            status: "approved",
          }),
        };

        await fetch(`${SUPABASE_URL}/rest/v1/matches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify(supabasePayload),
        });
      } catch (e) {
        console.error("Supabase match insert error:", e);
      }
    }
    saveLocalMatches(existing);

    return NextResponse.json({ ok: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { founder_email, investor_email, id, founder_name, investor_name } = body;

    let existing = getLocalMatches();
    if (founder_email && investor_email) {
      existing = existing.filter(
        (m: any) =>
          !(
            m.founder_email?.toLowerCase() === founder_email.toLowerCase() &&
            m.investor_email?.toLowerCase() === investor_email.toLowerCase()
          )
      );
    } else if (id) {
      existing = existing.filter((m: any) => m.id !== id);
    } else if (founder_email) {
      existing = existing.filter((m: any) => m.founder_email?.toLowerCase() !== founder_email.toLowerCase());
    } else if (investor_email) {
      existing = existing.filter((m: any) => m.investor_email?.toLowerCase() !== investor_email.toLowerCase());
    }
    saveLocalMatches(existing);

    // Forward deletion to Supabase
    try {
      if (id) {
        await fetch(`${SUPABASE_URL}/rest/v1/matches?id=eq.${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        });
      }
      if (founder_email) {
        await fetch(`${SUPABASE_URL}/rest/v1/matches?status=like.*${encodeURIComponent(founder_email)}*`, {
          method: "DELETE",
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        });
      }
      if (investor_email) {
        await fetch(`${SUPABASE_URL}/rest/v1/matches?status=like.*${encodeURIComponent(investor_email)}*`, {
          method: "DELETE",
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        });
      }
      if (founder_name && investor_name) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/matches?founder_name=eq.${encodeURIComponent(founder_name)}&investor_name=eq.${encodeURIComponent(investor_name)}`,
          {
            method: "DELETE",
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
          }
        );
      }
    } catch {}

    return NextResponse.json({ ok: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
