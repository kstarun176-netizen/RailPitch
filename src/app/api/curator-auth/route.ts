import { NextRequest, NextResponse } from "next/server";

const CURATOR_SECRET = process.env.CURATOR_SECRET || "";
// Simple session token — derived from the secret so it's stable across restarts
const SESSION_TOKEN = `rp_curator_${Buffer.from(CURATOR_SECRET).toString("base64").slice(0, 20)}`;

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));

  if (!CURATOR_SECRET) {
    return NextResponse.json(
      { ok: false, error: "CURATOR_SECRET not configured in .env.local" },
      { status: 500 }
    );
  }

  if (!password || password !== CURATOR_SECRET) {
    // Small delay to prevent brute force
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true, token: SESSION_TOKEN });
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-curator-token") || "";
  if (!CURATOR_SECRET || !token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const expected = `rp_curator_${Buffer.from(CURATOR_SECRET).toString("base64").slice(0, 20)}`;
  return NextResponse.json({ ok: token === expected });
}
