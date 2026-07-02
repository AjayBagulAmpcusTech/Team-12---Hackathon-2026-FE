"use client";

import { useState } from "react";
import type { TriageResult } from "@/lib/types";
import { Badge, Button, Card } from "@/components/ui/primitives";

const URGENCY_COLORS: Record<string, string> = {
  critical: "#F43F5E",
  high: "#F97316",
  medium: "#FACC15",
  low: "#34D399",
};

export function SecurityBanner({ result }: { result: TriageResult }) {
  if (!result.security_sensitive) return null;

  return (
    <div className="mb-4 rounded-2xl border p-4" style={{ borderColor: "rgba(var(--accent-4-rgb), 0.32)", background: "rgba(var(--accent-4-rgb), 0.11)", boxShadow: "0 18px 60px rgba(var(--accent-4-rgb), 0.12)" }}>
      <div className="flex items-center gap-3 font-extrabold" style={{ color: "var(--accent-4)" }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent-4)", boxShadow: "0 0 22px rgba(var(--accent-4-rgb), 0.74)" }} aria-hidden />
        SECURITY SENSITIVE - Escalate outside normal queue
      </div>
      <p className="mt-2 text-sm text-secondary">
        Subtype: {result.security_subtype || "unspecified"}
        {result.heuristic_security_flag ? " (heuristic and LLM confirmed)" : " (LLM flagged)"}
      </p>
    </div>
  );
}

export function IncidentCard({ result }: { result: TriageResult }) {
  const [expanded, setExpanded] = useState(false);
  const urgencyColor = URGENCY_COLORS[result.urgency] || "#94A3B8";

  return (
    <Card
      className={
        result.security_sensitive
          ? "ring-2"
          : ""
      }
    >
      <div style={result.security_sensitive ? { boxShadow: "0 0 0 1px rgba(var(--accent-4-rgb), 0.24)", borderRadius: "1.35rem" } : undefined}>
        <SecurityBanner result={result} />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="surface-inset rounded-full px-2.5 py-1 font-mono text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-muted">
            {result.incident_id}
          </span>
          <Badge color="#64748B">{result.type.replace(/_/g, " ")}</Badge>
          <Badge color={urgencyColor}>{result.urgency}</Badge>
          <Badge color="#8B5CF6">{Math.round(result.confidence * 100)}% conf</Badge>
        </div>

        <p className="mb-5 line-clamp-3 text-sm leading-6 text-secondary">{result.raw_text}</p>

        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <InfoBlock label="Route to" value={result.routing_destination_label} />
          <InfoBlock label="Processed" value={String(result.processing_ms) + "ms"} />
          <InfoBlock label="Security" value={result.security_sensitive ? "Flagged" : "Clear"} />
        </div>

        <div className="mt-5 rounded-2xl surface-inset p-4">
          <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
            Suggested first response
          </h4>
          <p className="mt-2 text-sm leading-6 text-primary">{result.suggested_first_response}</p>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "Hide reasoning" : "Expand reasoning"}
          </Button>
        </div>

        <div className="expand-grid mt-4" data-open={expanded}>
          <div>
            <div className="grid gap-4 rounded-2xl surface-inset p-4 text-sm md:grid-cols-2">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">Reasoning</h4>
                <p className="mt-2 leading-6 text-secondary">{result.reason}</p>
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">Routing reason</h4>
                <p className="mt-2 leading-6 text-secondary">{result.routing_reason}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-inset rounded-2xl p-3">
      <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-primary">{value}</p>
    </div>
  );
}
