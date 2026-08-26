import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jmlufhrkscwvdcnekvae.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
    const key = `${m.founder_email}_${m.investor_email}`;
    mergedMap.set(key, m);
  }
  for (const m of supabaseMatches) {
    const key = `${m.founder_email}_${m.investor_email}`;
    mergedMap.set(key, m);
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
    }
    saveLocalMatches(existing);

    // Forward to Supabase in background
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(records),
      });
    } catch {}

    return NextResponse.json({ ok: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { founder_email, investor_email, id } = body;

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
      if (founder_email && investor_email) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/matches?founder_email=eq.${encodeURIComponent(founder_email)}&investor_email=eq.${encodeURIComponent(investor_email)}`,
          {
            method: "DELETE",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
      }
    } catch {}

    return NextResponse.json({ ok: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
