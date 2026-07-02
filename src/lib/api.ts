import type { TriageConfig } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchConfig(): Promise<TriageConfig> {
  const res = await fetch(`${API_BASE}/api/v1/config`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load config");
  return res.json();
}

export async function saveConfig(config: TriageConfig): Promise<TriageConfig> {
  const res = await fetch(`${API_BASE}/api/v1/config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error("Failed to save config");
  return res.json();
}

export function parseIncidents(raw: string): string[] {
  const text = raw.trim();
  if (!text) return [];

  if (text.includes("---")) {
    return text.split("---").map((p) => p.trim()).filter(Boolean);
  }

  const blocks = text.split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length > 1) return blocks;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const numbered: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (/^\d+[\).\]]\s+/.test(line)) {
      if (current.length) numbered.push(current.join("\n"));
      current = [line.replace(/^\d+[\).\]]\s+/, "")];
    } else {
      current.push(line);
    }
  }
  if (current.length) numbered.push(current.join("\n"));

  return numbered.length > 1 ? numbered : [text];
}
