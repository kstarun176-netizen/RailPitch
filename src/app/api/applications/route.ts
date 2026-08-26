import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jmlufhrkscwvdcnekvae.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "applications.json");
const MATCHES_FILE = path.join(DATA_DIR, "matches.json");

function getLocalApps(): any[] {
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

function saveLocalApps(apps: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), "utf-8");
  } catch {}
}

export async function GET(req: NextRequest) {
  let supabaseApps: any[] = [];
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
      if (Array.isArray(data)) supabaseApps = data;
    }
  } catch {}

  const localApps = getLocalApps();

  const mergedMap = new Map();
  for (const a of localApps) {
    if (a.email) mergedMap.set(a.email.toLowerCase(), a);
  }
  for (const a of supabaseApps) {
    if (a.email) mergedMap.set(a.email.toLowerCase(), a);
  }

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
    }
    saveLocalApps(existing);

    // Forward to Supabase in background
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
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
    const { email, id } = body;

    let existing = getLocalApps();
    if (email) {
      existing = existing.filter((a: any) => a.email?.toLowerCase() !== email.toLowerCase());
    } else if (id) {
      existing = existing.filter((a: any) => a.id !== id);
    }
    saveLocalApps(existing);

    // Also clean up any associated matches
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

    // Forward deletion to Supabase
    try {
      if (email) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/applications?email=eq.${encodeURIComponent(email)}`,
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
