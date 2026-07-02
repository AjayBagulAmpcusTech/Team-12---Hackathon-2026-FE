import Link from "next/link";
import { ConfigAdmin } from "@/components/admin/ConfigAdmin";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminPage() {
  return (
    <main className="app-shell">
      <div className="mesh-background" aria-hidden />
      <div className="orbital-ring" aria-hidden />
      <header className="stagger-in stagger-1 relative z-10 mx-auto mb-8 flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="btn-secondary magnetic rounded-2xl px-4 py-2 text-sm font-extrabold">
          Back to reviewer
        </Link>
        <ThemeToggle />
      </header>
      <div className="stagger-in stagger-2 relative z-10">
        <ConfigAdmin />
      </div>
    </main>
  );
}
