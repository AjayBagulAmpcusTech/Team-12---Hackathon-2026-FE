import Link from "next/link";
import { ConfigAdmin } from "@/components/admin/ConfigAdmin";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to reviewer
        </Link>
      </header>
      <ConfigAdmin />
    </main>
  );
}
