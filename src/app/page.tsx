import Link from "next/link";
import { TriageReviewer } from "@/components/triage/TriageReviewer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <header className="mx-auto mb-8 flex max-w-7xl items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Triage Copilot</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Classify incidents, flag security risks, and route to the right owner — with streaming reasoning.
          </p>
        </div>
        <nav className="flex gap-3 text-sm">
          <Link href="/" className="font-medium text-blue-600">
            Reviewer
          </Link>
          <Link href="/admin" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
            Admin config
          </Link>
        </nav>
      </header>
      <TriageReviewer />
    </main>
  );
}
