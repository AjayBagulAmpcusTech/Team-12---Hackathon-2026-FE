"use client";

import { useCallback, useEffect, useState } from "react";
import type { Ticket, TicketStats, TriageConfig } from "@/lib/types";
import { fetchConfig, fetchTicketStats, fetchTickets, getCategoryLabel, getUrgencyColor } from "@/lib/api";
import { Badge, Button, Card } from "@/components/ui/primitives";

type CategoryFilter = "all" | string;

export function RequestDashboard() {
  const [config, setConfig] = useState<TriageConfig | null>(null);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [configData, statsData, ticketsData] = await Promise.all([
        fetchConfig(),
        fetchTicketStats(),
        fetchTickets({
          category: category && category !== "all" ? category : undefined,
          limit: 100,
        }),
      ]);
      setConfig(configData);
      setStats(statsData);
      setTickets(ticketsData.tickets);
      setTotal(ticketsData.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(categoryFilter === "all" ? undefined : categoryFilter);
  }, [categoryFilter, loadData]);

  if (loading && !stats) {
    return <p className="text-secondary">Loading request dashboard...</p>;
  }

  if (error && !stats) {
    return (
      <p style={{ color: "var(--accent-4)" }}>
        {error}
      </p>
    );
  }

  const categories = config?.categories ?? [];
  const categoryCounts = new Map(stats?.by_category.map((c) => [c.category_id, c.count]) ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="hero-title mt-3 text-4xl font-semibold">Request dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">
            View all triaged requests grouped by category with live counts and ticket details.
          </p>
        </div>
        <Button variant="secondary" onClick={() => loadData(categoryFilter === "all" ? undefined : categoryFilter)}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total requests" value={stats?.total ?? 0} />
        <MetricCard label="Open tickets" value={stats?.open_count ?? 0} tone="accent" />
        <MetricCard label="Security flagged" value={stats?.security_count ?? 0} tone="danger" />
        <MetricCard label="Categories" value={stats?.by_category.length ?? 0} tone="success" />
      </div>

      <Card>
        <SectionHeader
          title="By category"
          subtitle="Click a category to filter the ticket list below."
        />
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label="All"
            count={stats?.total ?? 0}
            active={categoryFilter === "all"}
            onClick={() => setCategoryFilter("all")}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              count={categoryCounts.get(cat.id) ?? 0}
              active={categoryFilter === cat.id}
              onClick={() => setCategoryFilter(cat.id)}
            />
          ))}
        </div>
      </Card>

      {stats && stats.by_category.length > 0 && (
        <Card>
          <SectionHeader title="Category breakdown" subtitle="Request volume per classification type." />
          <div className="space-y-3">
            {stats.by_category.map((item) => {
              const pct = stats.total ? Math.round((item.count / stats.total) * 100) : 0;
              return (
                <div key={item.category_id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">{item.label}</span>
                    <span className="text-muted">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full surface-inset">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: pct + "%",
                        background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card>
        <SectionHeader
          title="Tickets"
          subtitle={
            categoryFilter === "all"
              ? `Showing ${tickets.length} of ${total} total tickets`
              : `Showing ${tickets.length} of ${total} in ${getCategoryLabel(config, categoryFilter)}`
          }
        />

        {tickets.length === 0 ? (
          <p className="text-sm text-secondary">
            No tickets yet. Triage incidents on the reviewer page to populate this dashboard.
          </p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} config={config} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function TicketRow({ ticket, config }: { ticket: Ticket; config: TriageConfig | null }) {
  const categoryLabel = getCategoryLabel(config, ticket.category_id);
  const urgencyColor = getUrgencyColor(config, ticket.urgency);
  const created = new Date(ticket.created_at).toLocaleString();

  return (
    <div className="surface-inset rounded-2xl p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-muted">
          #{ticket.id}
        </span>
        <span className="font-mono text-[0.7rem] text-muted">{ticket.incident_id}</span>
        <Badge color="#64748B">{categoryLabel}</Badge>
        <Badge color={urgencyColor}>{ticket.urgency}</Badge>
        <Badge color={statusColor(ticket.status)}>{ticket.status}</Badge>
        {ticket.security_sensitive && <Badge color="#DC2626">Security</Badge>}
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-secondary">{ticket.raw_text}</p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span>Route: {ticket.routing_destination_label}</span>
        <span>Confidence: {Math.round(ticket.confidence * 100)}%</span>
        <span>{created}</span>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "magnetic rounded-full border px-4 py-2 text-sm font-extrabold transition " +
        (active ? "btn-premium" : "btn-secondary")
      }
    >
      {label}
      <span className="ml-2 opacity-70">{count}</span>
    </button>
  );
}

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "accent" | "danger" | "success";
}) {
  const colors = {
    default: "var(--text-primary)",
    accent: "var(--accent)",
    danger: "var(--accent-4)",
    success: "var(--accent-2)",
  };

  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold" style={{ color: colors[tone] }}>
        {value}
      </p>
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

function statusColor(status: string): string {
  switch (status) {
    case "open":
      return "#3B82F6";
    case "in_progress":
      return "#F59E0B";
    case "resolved":
      return "#16A34A";
    case "closed":
      return "#6B7280";
    default:
      return "#94A3B8";
  }
}
