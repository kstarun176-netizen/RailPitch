import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jmlufhrkscwvdcnekvae.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbHVmaHJrc2N3dmRjbmVrdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDQ4NzksImV4cCI6MjEwMzMyMDg3OX0.EZs49olU61MGJsjl4EREb-twIYx57bBifHnF2ThRqbA";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

function getLocalMessages(): any[] {
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

function saveLocalMessages(messages: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch {}
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const founder_email = (searchParams.get("founder_email") || "").toLowerCase().trim();
  const investor_email = (searchParams.get("investor_email") || "").toLowerCase().trim();

  let supabaseMessages: any[] = [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/matches?founder_company=eq.CHAT_MSG&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 0 },
      }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        for (const r of rows) {
          try {
            if (typeof r.status === "string" && r.status.startsWith("{")) {
              const meta = JSON.parse(r.status);
              supabaseMessages.push({
                id: meta.id || r.id,
                founder_email: (meta.founder_email || r.founder_name || "").toLowerCase().trim(),
                investor_email: (meta.investor_email || r.investor_name || "").toLowerCase().trim(),
                sender_role: meta.sender_role || "founder",
                sender_name: meta.sender_name || "Participant",
                sender_email: (meta.sender_email || "").toLowerCase().trim(),
                text: meta.text || "",
                created_at: meta.created_at || r.created_at,
              });
            }
          } catch {}
        }
      }
    }
  } catch {}

  const localMessages = getLocalMessages();
  const allMessages = [...localMessages];
  for (const sm of supabaseMessages) {
    if (!allMessages.some((lm) => lm.id === sm.id)) {
      allMessages.push(sm);
    }
  }

  // Filter messages between these two participants if specified
  let filtered = allMessages;
  if (founder_email && investor_email) {
    filtered = allMessages.filter((m) => {
      const fe = (m.founder_email || "").toLowerCase().trim();
      const ie = (m.investor_email || "").toLowerCase().trim();
      return (
        (fe === founder_email && ie === investor_email) ||
        (fe === investor_email && ie === founder_email)
      );
    });
  } else if (founder_email || investor_email) {
    const target = founder_email || investor_email;
    filtered = allMessages.filter((m) => {
      const fe = (m.founder_email || "").toLowerCase().trim();
      const ie = (m.investor_email || "").toLowerCase().trim();
      const se = (m.sender_email || "").toLowerCase().trim();
      return fe === target || ie === target || se === target;
    });
  }

  // Sort by created_at ascending
  filtered.sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { founder_email, investor_email, sender_role, sender_name, sender_email, text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    const cleanFounderEmail = (founder_email || "").toLowerCase().trim();
    const cleanInvestorEmail = (investor_email || "").toLowerCase().trim();
    const cleanSenderEmail = (sender_email || "").toLowerCase().trim();

    const messageRecord = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      founder_email: cleanFounderEmail,
      investor_email: cleanInvestorEmail,
      sender_role: sender_role || "founder",
      sender_name: sender_name || "Participant",
      sender_email: cleanSenderEmail,
      text: text.trim(),
      created_at: new Date().toISOString(),
    };

    const existing = getLocalMessages();
    existing.push(messageRecord);
    saveLocalMessages(existing);

    // Persist live chat message to Supabase
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          founder_name: cleanFounderEmail || "founder",
          investor_name: cleanInvestorEmail || "investor",
          founder_company: "CHAT_MSG",
          status: JSON.stringify(messageRecord),
        }),
      });
    } catch (err) {
      console.error("Supabase chat insert error:", err);
    }

    return NextResponse.json({ ok: true, data: messageRecord });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
