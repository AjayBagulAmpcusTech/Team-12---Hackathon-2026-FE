import Link from "next/link";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Header } from "@/components/ui/Header";

export default function AdminPage() {
  return (
    <main className="app-shell flex flex-col h-screen overflow-hidden">
      <div className="mesh-background" aria-hidden />
      <div className="orbital-ring" aria-hidden />

      <Header />

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-12 w-full relative z-10 custom-scrollbar">
        <div className="stagger-in stagger-2 mx-auto max-w-[1600px] pt-4">
          <AdminPanel />
        </div>
      </div>
    </main>
  );
}
