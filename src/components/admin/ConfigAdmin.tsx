"use client";

import { useEffect, useState } from "react";
import type { TriageConfig } from "@/lib/types";
import { fetchConfig, saveConfig } from "@/lib/api";
import { Button, Card } from "@/components/ui/primitives";

export function ConfigAdmin() {
  const [config, setConfig] = useState<TriageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .catch((err) => setMessage(err instanceof Error ? err.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await saveConfig(config);
      setConfig(updated);
      setMessage("Configuration saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-zinc-500">Loading configuration...</p>;
  if (!config) return <p className="text-red-600">{message || "Failed to load config"}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Triage configuration</h1>
          <p className="text-sm text-zinc-500">
            Non-engineers can define categories, urgency levels, and routing rules here.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {message && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          {message}
        </div>
      )}

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="space-y-3">
          {config.categories.map((cat, index) => (
            <div key={cat.id} className="grid gap-2 md:grid-cols-3">
              <input
                className="rounded border px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                value={cat.label}
                onChange={(e) => {
                  const categories = [...config.categories];
                  categories[index] = { ...cat, label: e.target.value };
                  setConfig({ ...config, categories });
                }}
              />
              <input
                className="rounded border px-2 py-1 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                value={cat.id}
                readOnly
              />
              <input
                className="rounded border px-2 py-1 text-sm md:col-span-1 dark:border-zinc-700 dark:bg-zinc-950"
                value={cat.description}
                onChange={(e) => {
                  const categories = [...config.categories];
                  categories[index] = { ...cat, description: e.target.value };
                  setConfig({ ...config, categories });
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Urgency levels</h2>
        <div className="space-y-3">
          {config.urgency_levels.map((level, index) => (
            <div key={level.id} className="grid gap-2 md:grid-cols-4">
              <input
                className="rounded border px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                value={level.label}
                onChange={(e) => {
                  const urgency_levels = [...config.urgency_levels];
                  urgency_levels[index] = { ...level, label: e.target.value };
                  setConfig({ ...config, urgency_levels });
                }}
              />
              <input
                type="number"
                className="rounded border px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                value={level.sla_minutes}
                onChange={(e) => {
                  const urgency_levels = [...config.urgency_levels];
                  urgency_levels[index] = { ...level, sla_minutes: Number(e.target.value) };
                  setConfig({ ...config, urgency_levels });
                }}
              />
              <input
                type="color"
                className="h-9 w-full rounded border dark:border-zinc-700"
                value={level.color}
                onChange={(e) => {
                  const urgency_levels = [...config.urgency_levels];
                  urgency_levels[index] = { ...level, color: e.target.value };
                  setConfig({ ...config, urgency_levels });
                }}
              />
              <span className="self-center font-mono text-xs text-zinc-500">{level.id}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Routing rules</h2>
        <p className="mb-3 text-sm text-zinc-500">
          Evaluated in priority order. Security-sensitive incidents always route to security on-call.
        </p>
        <div className="space-y-2">
          {config.routing_rules.map((rule, index) => (
            <div
              key={rule.id ?? index}
              className="grid gap-2 rounded-lg border border-zinc-100 p-3 text-sm dark:border-zinc-800 md:grid-cols-5"
            >
              <span>Priority {rule.priority}</span>
              <span className="font-mono">{rule.condition_type}</span>
              <span>{rule.condition_value || "—"}</span>
              <span>→ {rule.destination_id}</span>
              <span>{rule.override_urgency ? `urgency: ${rule.override_urgency}` : ""}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
