"use client";

import { useCallback, useState } from "react";
import type { StreamState, TriageResult } from "@/lib/types";

function parseSseChunk(buffer: string): { events: Array<{ event: string; data: unknown }>; rest: string } {
  const events: Array<{ event: string; data: unknown }> = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";

  for (const part of parts) {
    if (!part.trim()) continue;
    let event = "message";
    let dataLine = "";
    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      if (line.startsWith("data:")) dataLine = line.slice(5).trim();
    }
    if (dataLine) {
      try {
        events.push({ event, data: JSON.parse(dataLine) });
      } catch {
        // skip malformed chunk
      }
    }
  }

  return { events, rest };
}

export function useTriageStream() {
  const [state, setState] = useState<StreamState>({
    results: [],
    total: 0,
    securityCount: 0,
    isStreaming: false,
    error: null,
    progress: 0,
  });

  const startTriage = useCallback(async (incidents: string[]) => {
    setState({
      results: [],
      total: incidents.length,
      securityCount: 0,
      isStreaming: true,
      error: null,
      progress: 0,
    });

    try {
      const response = await fetch("/api/triage/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidents }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Triage failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, rest } = parseSseChunk(buffer);
        buffer = rest;

        for (const { event, data } of events) {
          if (event === "triage_start") {
            const payload = data as { total: number };
            setState((prev) => ({ ...prev, total: payload.total }));
          }

          if (event === "triage_item") {
            const payload = data as { index: number; result: TriageResult };
            setState((prev) => {
              const next = [...prev.results];
              next[payload.index] = payload.result;
              const securityCount = next.filter((r) => r?.security_sensitive).length;
              return {
                ...prev,
                results: next,
                securityCount,
                progress: next.filter(Boolean).length,
              };
            });
          }

          if (event === "triage_complete") {
            const payload = data as { total: number; security_count: number };
            setState((prev) => ({
              ...prev,
              total: payload.total,
              securityCount: payload.security_count,
              isStreaming: false,
              progress: payload.total,
            }));
          }
        }
      }

      setState((prev) => ({ ...prev, isStreaming: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        error: err instanceof Error ? err.message : "Stream failed",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      results: [],
      total: 0,
      securityCount: 0,
      isStreaming: false,
      error: null,
      progress: 0,
    });
  }, []);

  return { ...state, startTriage, reset };
}
