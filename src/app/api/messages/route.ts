import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jmlufhrkscwvdcnekvae.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
  const founder_email = searchParams.get("founder_email")?.toLowerCase();
  const investor_email = searchParams.get("investor_email")?.toLowerCase();

  let supabaseMessages: any[] = [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) supabaseMessages = data;
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
      const fe = m.founder_email?.toLowerCase();
      const ie = m.investor_email?.toLowerCase();
      return (
        (fe === founder_email && ie === investor_email) ||
        (fe === investor_email && ie === founder_email)
      );
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

    const messageRecord = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      founder_email: founder_email?.toLowerCase() || "",
      investor_email: investor_email?.toLowerCase() || "",
      sender_role: sender_role || "founder",
      sender_name: sender_name || "Participant",
      sender_email: sender_email?.toLowerCase() || "",
      text: text.trim(),
      created_at: new Date().toISOString(),
    };

    const existing = getLocalMessages();
    existing.push(messageRecord);
    saveLocalMessages(existing);

    // Forward to Supabase in background
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify([messageRecord]),
      });
    } catch {}

    return NextResponse.json({ ok: true, data: messageRecord });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
