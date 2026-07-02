import Link from "next/link";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminPage() {
  return (
    <main className="app-shell flex flex-col h-screen overflow-hidden">
      <div className="mesh-background" aria-hidden />
      <div className="orbital-ring" aria-hidden />

      {/* Fixed Header with Glassmorphism */}
      <header className="stagger-in stagger-1 relative z-50 mx-auto w-full max-w-7xl flex shrink-0 items-center justify-between gap-4 px-4 py-4 md:px-6 backdrop-blur-xl border-b border-white/10 glass-panel sticky top-0 md:top-4 md:rounded-b-3xl md:rounded-t-xl mb-2 sm:mb-6 mt-0 md:mt-2 shadow-sm">
        <Link href="/" className="group flex items-center gap-3 magnetic">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border font-black shadow-lg" style={{ borderColor: "var(--border-strong)", background: "var(--surface-soft)", color: "var(--accent)" }}>
            IC
          </span>
          <span>
            <span className="block text-sm font-extrabold uppercase tracking-[0.24em] text-muted">
              Incident Triage
            </span>
            <span className="block text-lg font-semibold tracking-tight text-primary">Copilot</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="glass-panel flex items-center gap-2 rounded-2xl p-1">
            <Link href="/" className="rounded-xl px-4 py-2 text-sm font-extrabold text-secondary magnetic hover:text-primary">
              Reviewer
            </Link>
            <Link href="/admin" className="rounded-xl px-4 py-2 text-sm font-extrabold magnetic" style={{ background: "var(--text)", color: "var(--text-inverse)" }}>
              Admin config
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-12 w-full relative z-10 custom-scrollbar">
        <div className="stagger-in stagger-2 mx-auto max-w-7xl pt-4">
          <AdminPanel />
        </div>
      </div>
    </main>
  );
}
