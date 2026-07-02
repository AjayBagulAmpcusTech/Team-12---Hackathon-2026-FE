import { NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

export async function GET() {
  try {
    const upstream = await fetch(`${BACKEND_URL}/api/v1/tickets/stats`, { cache: "no-store" });
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error proxying ticket stats GET:", error);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
