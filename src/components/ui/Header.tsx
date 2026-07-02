"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isReviewer = pathname === "/";
  const isAdmin = pathname === "/admin";

  return (
    <header className="stagger-in stagger-1 relative z-50 mx-auto w-full max-w-[1600px] flex flex-col md:flex-row shrink-0 items-center justify-between gap-4 md:gap-4 px-4 py-4 sm:px-6 md:px-8 lg:px-12 backdrop-blur-xl border-b border-white/10 glass-panel sticky top-0 md:top-4 md:rounded-b-3xl md:rounded-t-xl mb-4 sm:mb-6 mt-0 md:mt-2 shadow-sm">
      <div className="flex w-full md:w-auto items-center justify-between">
        <Link href="/" className="group flex items-center gap-3 magnetic">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border font-black shadow-lg" style={{ borderColor: "var(--border-strong)", background: "var(--surface-soft)", color: "var(--accent)" }}>
            IC
          </span>
          <span>
            <span className="block text-sm font-extrabold uppercase tracking-[0.24em] text-muted">
              Incident Triage
            </span>
            <span className="block text-lg font-semibold tracking-tight text-primary">Copilot</span>
          </span>
        </Link>
        <button
          className="md:hidden glass-panel flex h-11 w-11 items-center justify-center rounded-2xl text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      <div className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0 animate-in fade-in slide-in-from-top-2 md:animate-none`}>
        <nav className="glass-panel flex flex-row items-center gap-1 rounded-2xl p-1 w-full md:w-auto">
          <Link
            href="/"
            className={`flex-1 md:flex-none rounded-xl px-2 py-2 sm:px-4 text-sm font-extrabold magnetic text-center ${
              isReviewer ? "" : "text-secondary hover:text-primary"
            }`}
            style={isReviewer ? { background: "var(--text)", color: "var(--text-inverse)" } : {}}
            onClick={() => setMenuOpen(false)}
          >
            Reviewer
          </Link>
          <Link
            href="/admin"
            className={`flex-1 md:flex-none rounded-xl px-2 py-2 sm:px-4 text-sm font-extrabold magnetic text-center ${
              isAdmin ? "" : "text-secondary hover:text-primary"
            }`}
            style={isAdmin ? { background: "var(--text)", color: "var(--text-inverse)" } : {}}
            onClick={() => setMenuOpen(false)}
          >
            Admin config
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
