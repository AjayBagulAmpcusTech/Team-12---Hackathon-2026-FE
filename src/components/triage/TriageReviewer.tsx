"use client";

import { useMemo, useState } from "react";
import { SAMPLE_INCIDENTS } from "@/data/sample-incidents";
import { useTriageConfig } from "@/hooks/useTriageConfig";
import { useTriageStream } from "@/hooks/useTriageStream";
import { parseIncidents } from "@/lib/api";
import { IncidentCard } from "@/components/triage/IncidentCard";
import { Button } from "@/components/ui/primitives";

type Filter = "all" | "security" | "critical";

const filters: Filter[] = ["all", "security", "critical"];

export function TriageReviewer() {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { config, loading: configLoading, error: configError } = useTriageConfig();
  const { results, total, securityCount, isStreaming, error, progress, startTriage, reset } =
    useTriageStream();

  const incidents = useMemo(() => parseIncidents(input), [input]);

  const sortedResults = useMemo(() => {
    const valid = results.filter(Boolean);
    return [...valid].sort((a, b) => {
      if (a.security_sensitive && !b.security_sensitive) return -1;
      if (!a.security_sensitive && b.security_sensitive) return 1;
      return 0;
    });
  }, [results]);

  const filteredResults = useMemo(() => {
    if (filter === "security") return sortedResults.filter((r) => r.security_sensitive);
    if (filter === "critical") return sortedResults.filter((r) => r.urgency === "critical");
    return sortedResults;
  }, [sortedResults, filter]);

  const criticalCount = sortedResults.filter((r) => r.urgency === "critical").length;
  const completedCount = sortedResults.length;
  const progressWidth = total ? String((progress / total) * 100) + "%" : "0%";

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricCard label="Detected" value={incidents.length} tone="accent" delay="stagger-3" />
          <MetricCard label="Reviewed" value={completedCount} tone="success" delay="stagger-4" />
          <MetricCard label="Critical" value={criticalCount} tone="danger" delay="stagger-5" />
        </div>

        <div className="glass-panel stagger-in stagger-4 relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Batch Intake</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">
                Incident intelligence queue
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-secondary">
                Paste incidents separated by blank lines or triple dashes. The copilot streams routing, urgency, and security decisions as each item resolves.
              </p>
            </div>
            <div className="surface-inset rounded-2xl px-3 py-2 text-right">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-muted">Stream</p>
              <p className="mt-1 flex items-center justify-end gap-2 text-sm font-extrabold text-primary">
                <span className="status-dot" />
                {isStreaming ? String(progress) + "/" + String(total) + " active" : "Ready"}
              </p>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            placeholder="Paste incident descriptions here..."
            className="input-premium mt-5 min-h-[24rem] w-full resize-y rounded-2xl p-4 font-mono text-sm leading-6"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => setInput(SAMPLE_INCIDENTS)} variant="secondary">
              Load sample batch
            </Button>
            <Button
              onClick={() => startTriage(incidents)}
              disabled={!incidents.length || isStreaming}
            >
              {isStreaming ? "Triaging..." : "Triage " + String(incidents.length || 0) + " incident(s)"}
            </Button>
            <Button onClick={reset} variant="secondary" disabled={isStreaming}>
              Clear results
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="glass-panel stagger-in stagger-4 rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Live Review</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">Triage results</h2>
              <p className="mt-1 text-sm text-secondary">
                {isStreaming
                  ? "Streaming " + String(progress) + "/" + String(total)
                  : filteredResults.length
                    ? String(filteredResults.length) + " result" + (filteredResults.length === 1 ? "" : "s") + " shown"
                    : "Results will appear here as they stream in"}
                {securityCount > 0 && (
                  <span className="ml-2 font-extrabold" style={{ color: "var(--accent-4)" }}>
                    / {securityCount} security flag{securityCount === 1 ? "" : "s"}
                  </span>
                )}
              </p>
            </div>
            <div className="surface-inset flex flex-wrap rounded-2xl p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={
                    "magnetic rounded-xl px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] " +
                    (filter === f ? "" : "text-secondary hover:text-primary")
                  }
                  style={
                    filter === f
                      ? { background: "var(--text)", color: "var(--text-inverse)", boxShadow: "0 10px 30px var(--shadow-color)" }
                      : undefined
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {configError && (
            <div className="mt-5 rounded-2xl border p-4 text-sm" style={{ borderColor: "rgba(var(--accent-4-rgb), 0.3)", background: "rgba(var(--accent-4-rgb), 0.1)", color: "var(--accent-4)" }}>
              Config unavailable: {configError}. Urgency colors and category labels may use defaults.
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border p-4 text-sm" style={{ borderColor: "rgba(var(--accent-4-rgb), 0.3)", background: "rgba(var(--accent-4-rgb), 0.1)", color: "var(--accent-4)" }}>
              {error}
            </div>
          )}

          <div className="progress-bar mt-5">
            <div className="progress-bar__fill" style={{ width: progressWidth }} />
          </div>
        </div>

        <div className="space-y-4">
          {filteredResults.length ? (
            filteredResults.map((result, index) => (
              <div className="stagger-in" style={{ animationDelay: String(120 + index * 80) + "ms" }} key={result.incident_id}>
                <IncidentCard result={result} config={configLoading ? null : config} />
              </div>
            ))
          ) : (
            <div className="glass-panel stagger-in stagger-5 rounded-[1.75rem] border-dashed p-8 text-center">
              <div className="float-slow mx-auto mb-4 h-16 w-16 rounded-2xl surface-inset shadow-lg" />
              <h3 className="text-lg font-semibold text-primary">Awaiting incident signal</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-secondary">
                Load the sample batch or paste your own incidents to begin streaming analysis.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
  delay,
}: {
  label: string;
  value: number;
  tone: "accent" | "success" | "danger";
  delay: string;
}) {
  const colorVar = tone === "accent" ? "--accent-rgb" : tone === "success" ? "--accent-3-rgb" : "--accent-4-rgb";
  const color = tone === "accent" ? "var(--accent)" : tone === "success" ? "var(--accent-3)" : "var(--accent-4)";

  return (
    <div
      className={"glass-panel stagger-in magnetic rounded-2xl p-4 " + delay}
      style={{ boxShadow: "0 18px 60px rgba(var(" + colorVar + "), 0.13)" }}
    >
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
