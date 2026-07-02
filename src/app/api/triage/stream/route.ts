import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const upstream = await fetch(`${BACKEND_URL}/api/v1/triage/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text();
    return new Response(detail || "Upstream triage stream failed", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
