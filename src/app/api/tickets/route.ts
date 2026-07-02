import { NextRequest, NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/api/v1/tickets${query ? "?" + query : ""}`;
    const upstream = await fetch(url, { cache: "no-store" });
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error proxying tickets GET:", error);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
