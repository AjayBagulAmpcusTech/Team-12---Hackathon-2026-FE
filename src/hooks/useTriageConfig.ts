"use client";

import { useEffect, useState } from "react";
import type { TriageConfig } from "@/lib/types";
import { fetchConfig } from "@/lib/api";

export function useTriageConfig() {
  const [config, setConfig] = useState<TriageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load config"))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
