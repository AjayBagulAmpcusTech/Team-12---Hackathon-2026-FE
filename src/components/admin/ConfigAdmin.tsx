"use client";

import { useEffect, useState } from "react";
import type { TriageConfig } from "@/lib/types";
import { fetchConfig, saveConfig } from "@/lib/api";
import { Button, Card } from "@/components/ui/primitives";

const inputClass = "input-premium rounded-xl px-3 py-2 text-sm";

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

  if (loading) return <p className="text-secondary">Loading configuration...</p>;
  if (!config) return <p style={{ color: "var(--accent-4)" }}>{message || "Failed to load config"}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Control plane</p>
          <h1 className="hero-title mt-3 text-4xl font-semibold">Triage configuration</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">
            Tune categories, urgency levels, and routing rules without touching the model workflow.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {message && (
        <div className="glass-panel rounded-2xl p-4 text-sm font-semibold" style={{ color: "var(--accent)" }}>
          {message}
        </div>
      )}

      <Card className="stagger-in stagger-3">
        <SectionHeader title="Categories" subtitle="Define the language reviewers see when incidents are classified." />
        <div className="space-y-3">
          {config.categories.map((cat, index) => (
            <div key={cat.id} className="grid gap-2 md:grid-cols-[0.9fr_0.7fr_1.4fr]">
              <input
                className={inputClass}
                value={cat.label}
                onChange={(e) => {
                  const categories = [...config.categories];
                  categories[index] = { ...cat, label: e.target.value };
                  setConfig({ ...config, categories });
                }}
              />
              <input className={inputClass + " font-mono text-muted"} value={cat.id} readOnly />
              <input
                className={inputClass}
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

      <Card className="stagger-in stagger-4">
        <SectionHeader title="Urgency levels" subtitle="Shape SLA expectations and the color language of the queue." />
        <div className="space-y-3">
          {config.urgency_levels.map((level, index) => (
            <div key={level.id} className="grid gap-2 md:grid-cols-[1fr_0.65fr_0.5fr_0.65fr]">
              <input
                className={inputClass}
                value={level.label}
                onChange={(e) => {
                  const urgency_levels = [...config.urgency_levels];
                  urgency_levels[index] = { ...level, label: e.target.value };
                  setConfig({ ...config, urgency_levels });
                }}
              />
              <input
                type="number"
                className={inputClass}
                value={level.sla_minutes}
                onChange={(e) => {
                  const urgency_levels = [...config.urgency_levels];
                  urgency_levels[index] = { ...level, sla_minutes: Number(e.target.value) };
                  setConfig({ ...config, urgency_levels });
                }}
              />
              <input
                type="color"
                className="input-premium h-10 w-full rounded-xl p-1"
                value={level.color}
                onChange={(e) => {
                  const urgency_levels = [...config.urgency_levels];
                  urgency_levels[index] = { ...level, color: e.target.value };
                  setConfig({ ...config, urgency_levels });
                }}
              />
              <span className="surface-inset self-center rounded-xl px-3 py-2 font-mono text-xs text-muted">
                {level.id}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="stagger-in stagger-4">
        <SectionHeader title="Routing destinations" subtitle="Teams and queues incidents can be routed to." />
        <div className="space-y-3">
          {config.routing_destinations.map((destination, index) => (
            <div key={destination.id} className="grid gap-2 md:grid-cols-[0.9fr_1fr_0.7fr]">
              <input
                className={inputClass}
                value={destination.label}
                onChange={(e) => {
                  const routing_destinations = [...config.routing_destinations];
                  routing_destinations[index] = { ...destination, label: e.target.value };
                  setConfig({ ...config, routing_destinations });
                }}
              />
              <input
                className={inputClass}
                value={destination.team}
                onChange={(e) => {
                  const routing_destinations = [...config.routing_destinations];
                  routing_destinations[index] = { ...destination, team: e.target.value };
                  setConfig({ ...config, routing_destinations });
                }}
              />
              <span className="surface-inset self-center rounded-xl px-3 py-2 font-mono text-xs text-muted">
                {destination.id}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="stagger-in stagger-5">
        <SectionHeader title="Routing rules" subtitle="Evaluated in priority order; security-sensitive incidents always route to security on-call." />
        <div className="space-y-2">
          {config.routing_rules.map((rule, index) => {
            const destinationLabel =
              config.routing_destinations.find((destination) => destination.id === rule.destination_id)?.label ??
              rule.destination_id;

            return (
            <div
              key={rule.id ?? index}
              className="surface-inset grid gap-2 rounded-2xl p-3 text-sm text-secondary md:grid-cols-5"
            >
              <span className="font-extrabold text-primary">Priority {rule.priority}</span>
              <span className="font-mono text-muted">{rule.condition_type}</span>
              <span>{rule.condition_value || "-"}</span>
              <span style={{ color: "var(--accent)" }}>to {destinationLabel}</span>
              <span>{rule.override_urgency ? "urgency: " + rule.override_urgency : ""}</span>
            </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
      <p className="mt-1 text-sm text-secondary">{subtitle}</p>
    </div>
  );
}
