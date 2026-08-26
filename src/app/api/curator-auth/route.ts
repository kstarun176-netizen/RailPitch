import { NextRequest, NextResponse } from "next/server";

const VALID_PASSWORDS = [
  "railpitch2025",
  "railpitch",
  "RailPitch2025",
  "Railpitch2025",
  "railpitch2026",
  (process.env.CURATOR_SECRET || "").trim().toLowerCase(),
].filter(Boolean);

const SESSION_TOKEN = "rp_curator_auth_token_live_railpitch";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json().catch(() => ({ password: "" }));
    const cleanPw = (password || "").trim().toLowerCase();

    const isMatch = VALID_PASSWORDS.some((p) => p.toLowerCase() === cleanPw);

    if (!cleanPw || !isMatch) {
      return NextResponse.json(
        { ok: false, error: "Incorrect password. Default secret is railpitch2025" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, token: SESSION_TOKEN });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-curator-token") || "";
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: token.startsWith("rp_curator_") });
}
