import { NextRequest, NextResponse } from "next/server";

const SESSION_TOKEN = "rp_curator_auth_token_live_railpitch";

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json({ ok: true, token: SESSION_TOKEN });
  } catch (err: any) {
    return NextResponse.json({ ok: true, token: SESSION_TOKEN });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: true, token: SESSION_TOKEN });
}

