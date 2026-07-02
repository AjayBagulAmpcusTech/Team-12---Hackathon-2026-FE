"use client";

import { useState } from "react";
import { ConfigAdmin } from "@/components/admin/ConfigAdmin";
import { RequestDashboard } from "@/components/admin/RequestDashboard";

type AdminTab = "requests" | "config";

export function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>("requests");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "requests"} onClick={() => setTab("requests")}>
          Request dashboard
        </TabButton>
        <TabButton active={tab === "config"} onClick={() => setTab("config")}>
          Configuration
        </TabButton>
      </div>

      {tab === "requests" ? <RequestDashboard /> : <ConfigAdmin />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "magnetic rounded-2xl px-5 py-2.5 text-sm font-extrabold transition " +
        (active ? "btn-premium" : "btn-secondary")
      }
    >
      {children}
    </button>
  );
}
