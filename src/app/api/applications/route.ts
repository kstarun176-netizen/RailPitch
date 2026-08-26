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
  const mergedMap = new Map();

  // 1. Fetch from Supabase applications table
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
          if (a.email) mergedMap.set(a.email.toLowerCase(), a);
        }
      }
    }
  } catch {}

  // 2. Fetch from Supabase founders table
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
          if (f.email && !mergedMap.has(f.email.toLowerCase())) {
            mergedMap.set(f.email.toLowerCase(), {
              id: f.id,
              role: "founder",
              full_name: f.full_name,
              company_name: f.company_name,
              email: f.email,
              primary_sector: f.primary_sector,
              secondary_sectors: f.secondary_sectors,
              stage_or_cheque: f.stage || f.stage_or_cheque,
              ask_or_focus: f.ask || f.ask_or_focus,
              file_url: f.file_url,
              created_at: f.created_at,
            });
          }
        }
      }
    }
  } catch {}

  // 3. Fetch from Supabase investors table
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
          if (i.email && !mergedMap.has(i.email.toLowerCase())) {
            mergedMap.set(i.email.toLowerCase(), {
              id: i.id,
              role: "investor",
              full_name: i.full_name,
              company_name: i.company_name,
              email: i.email,
              primary_sector: i.primary_sector,
              secondary_sectors: i.secondary_sectors,
              stage_or_cheque: i.cheque_size || i.stage_or_cheque,
              ask_or_focus: i.thesis || i.ask_or_focus,
              linkedin_url: i.linkedin_url,
              created_at: i.created_at,
            });
          }
        }
      }
    }
  } catch {}

  // 4. Merge with local backup
  const localApps = getLocalApps();
  for (const a of localApps) {
    if (a.email && !mergedMap.has(a.email.toLowerCase())) {
      mergedMap.set(a.email.toLowerCase(), a);
    }
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

      // Forward to Supabase:
      // A. Insert/upsert into 'applications' table
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: "return=representation,resolution=merge-duplicates",
          },
          body: JSON.stringify(recordWithId),
        });
      } catch {}

      // B. If founder, insert into 'founders' table
      if (rec.role === "founder") {
        try {
          const founderPayload = {
            id: recordWithId.id,
            full_name: recordWithId.full_name,
            company_name: recordWithId.company_name,
            email: recordWithId.email,
            primary_sector: recordWithId.primary_sector,
            secondary_sectors: recordWithId.secondary_sectors,
            stage: recordWithId.stage_or_cheque,
            ask: recordWithId.ask_or_focus,
            file_url: recordWithId.file_url || null,
            created_at: recordWithId.created_at,
          };
          await fetch(`${SUPABASE_URL}/rest/v1/founders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              Prefer: "return=representation,resolution=merge-duplicates",
            },
            body: JSON.stringify(founderPayload),
          });
        } catch {}
      }

      // C. If investor, insert into 'investors' table
      if (rec.role === "investor") {
        try {
          const investorPayload = {
            id: recordWithId.id,
            full_name: recordWithId.full_name,
            company_name: recordWithId.company_name,
            email: recordWithId.email,
            primary_sector: recordWithId.primary_sector,
            secondary_sectors: recordWithId.secondary_sectors,
            cheque_size: recordWithId.stage_or_cheque,
            thesis: recordWithId.ask_or_focus,
            linkedin_url: recordWithId.linkedin_url || null,
            created_at: recordWithId.created_at,
          };
          await fetch(`${SUPABASE_URL}/rest/v1/investors`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              Prefer: "return=representation,resolution=merge-duplicates",
            },
            body: JSON.stringify(investorPayload),
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
