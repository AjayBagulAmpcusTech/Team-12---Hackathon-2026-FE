"use client";

import { useMemo, useState } from "react";
import { SAMPLE_INCIDENTS } from "@/data/sample-incidents";
import { useTriageStream } from "@/hooks/useTriageStream";
import { parseIncidents } from "@/lib/api";
import { IncidentCard } from "@/components/triage/IncidentCard";
import { Button } from "@/components/ui/primitives";

type Filter = "all" | "security" | "critical";

export function TriageReviewer() {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
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

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
      <section className="space-y-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 text-lg font-semibold">Incident batch input</h2>
          <p className="mb-4 text-sm text-zinc-500">
            Paste one or more incidents separated by blank lines or <code>---</code>.
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            placeholder="Paste incident descriptions here..."
            className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => setInput(SAMPLE_INCIDENTS)} variant="secondary">
              Load sample batch
            </Button>
            <Button
              onClick={() => startTriage(incidents)}
              disabled={!incidents.length || isStreaming}
            >
              {isStreaming ? "Triaging..." : `Triage ${incidents.length || 0} incident(s)`}
            </Button>
            <Button onClick={reset} variant="secondary" disabled={isStreaming}>
              Clear results
            </Button>
          </div>
          {incidents.length > 0 && (
            <p className="mt-2 text-xs text-zinc-500">Detected {incidents.length} incident(s) in input.</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Triage results</h2>
            <p className="text-sm text-zinc-500">
              {isStreaming
                ? `Streaming ${progress}/${total}...`
                : filteredResults.length
                  ? `${filteredResults.length} shown`
                  : "Results will appear here as they stream in"}
              {securityCount > 0 && (
                <span className="ml-2 font-medium text-red-600">· {securityCount} security flag(s)</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {(["all", "security", "critical"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {isStreaming && (
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: total ? `${(progress / total) * 100}%` : "0%" }}
            />
          </div>
        )}

        <div className="space-y-4">
          {filteredResults.map((result) => (
            <IncidentCard key={result.incident_id} result={result} />
          ))}
        </div>
      </section>
    </div>
  );
}
