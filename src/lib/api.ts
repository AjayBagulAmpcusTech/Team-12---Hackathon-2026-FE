import type { TriageConfig } from "./types";

export async function fetchConfig(): Promise<TriageConfig> {
  const res = await fetch("/api/config", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load config");
  return res.json();
}

export async function saveConfig(config: TriageConfig): Promise<TriageConfig> {
  const res = await fetch("/api/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error("Failed to save config");
  return res.json();
}

export function getCategoryLabel(config: TriageConfig | null, typeId: string): string {
  const match = config?.categories.find((category) => category.id === typeId);
  return match?.label ?? typeId.replace(/_/g, " ");
}

export function getUrgencyColor(config: TriageConfig | null, urgencyId: string): string {
  const match = config?.urgency_levels.find((level) => level.id === urgencyId);
  return match?.color ?? "#94A3B8";
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
