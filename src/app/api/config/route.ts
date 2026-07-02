import { NextRequest, NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

export async function GET() {
  try {
    const upstream = await fetch(`${BACKEND_URL}/api/v1/config`, { cache: "no-store" });
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error proxying config GET:", error);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const upstream = await fetch(`${BACKEND_URL}/api/v1/config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const responseBody = await upstream.text();

    return new Response(responseBody, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error proxying config PUT:", error);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
