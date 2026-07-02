import type { TriageResult } from "@/lib/types";
import { Badge, Card } from "@/components/ui/primitives";

const URGENCY_COLORS: Record<string, string> = {
  critical: "#DC2626",
  high: "#EA580C",
  medium: "#CA8A04",
  low: "#16A34A",
};

export function SecurityBanner({ result }: { result: TriageResult }) {
  if (!result.security_sensitive) return null;

  return (
    <div className="mb-4 rounded-lg border-2 border-red-500 bg-red-50 p-4 dark:bg-red-950/30">
      <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300">
        <span aria-hidden>🛡️</span>
        SECURITY SENSITIVE — Do not queue as normal ticket
      </div>
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
        Subtype: {result.security_subtype || "unspecified"}
        {result.heuristic_security_flag ? " (heuristic + LLM confirmed)" : " (LLM flagged)"}
      </p>
    </div>
  );
}

export function IncidentCard({ result }: { result: TriageResult }) {
  const urgencyColor = URGENCY_COLORS[result.urgency] || "#6B7280";

  return (
    <Card
      className={
        result.security_sensitive
          ? "border-red-400 ring-2 ring-red-200 dark:ring-red-900"
          : ""
      }
    >
      <SecurityBanner result={result} />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-zinc-500">{result.incident_id}</span>
        <Badge color="#4B5563">{result.type.replace(/_/g, " ")}</Badge>
        <Badge color={urgencyColor}>{result.urgency}</Badge>
        <Badge color="#6366F1">{Math.round(result.confidence * 100)}% conf</Badge>
      </div>

      <p className="mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">{result.raw_text}</p>

      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Reasoning</h4>
          <p className="text-zinc-600 dark:text-zinc-400">{result.reason}</p>
        </div>

        <div>
          <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Suggested first response</h4>
          <p className="rounded-lg bg-zinc-50 p-3 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {result.suggested_first_response}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Route to</h4>
            <p className="text-zinc-600 dark:text-zinc-400">{result.routing_destination_label}</p>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Routing reason</h4>
            <p className="text-zinc-600 dark:text-zinc-400">{result.routing_reason}</p>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Processed in</h4>
            <p className="text-zinc-600 dark:text-zinc-400">{result.processing_ms}ms</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
