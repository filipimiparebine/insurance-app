import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categories, version, timestamp } = body;

    // In production, this would log to a consents_log table in the database.
    // For now, we acknowledge receipt. The consent is stored client-side
    // in localStorage and this endpoint serves as a firewall-friendly
    // server-side record without blocking the user experience.
    console.log("[consent]", { categories, version, timestamp });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
