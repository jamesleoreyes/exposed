"use client";

import { useState, useEffect, useCallback } from "react";
import type { NetworkInfo } from "@/types/fingerprint";

export function useNetworkInfo() {
  const [data, setData] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phase 1: Get IP from server headers only (no external call)
  useEffect(() => {
    async function collect() {
      try {
        const res = await fetch("/api/ip");
        if (!res.ok) throw new Error(`IP API returned ${res.status}`);
        const { ip } = await res.json();

        const conn = "connection" in navigator ? (navigator as Navigator & { connection: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection : null;

        setData({
          ip: ip ?? "",
          city: null,
          region: null,
          country: null,
          isp: null,
          lat: null,
          lon: null,
          connectionType: conn?.effectiveType ?? null,
          downlink: conn?.downlink ?? null,
          rtt: conn?.rtt ?? null,
          saveData: conn?.saveData ?? null,
          enriched: false,
          ipTimezone: null,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to collect network info"
        );
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  // Phase 2: User-initiated enrichment via ip-api.com
  const enrich = useCallback(async () => {
    setEnriching(true);
    try {
      const res = await fetch("/api/ip/enrich");
      if (!res.ok) throw new Error(`Enrich API returned ${res.status}`);
      const geo = await res.json();

      setData((prev) =>
        prev
          ? {
              ...prev,
              city: geo.city ?? null,
              region: geo.region ?? null,
              country: geo.country ?? null,
              isp: geo.isp ?? null,
              lat: geo.lat ?? null,
              lon: geo.lon ?? null,
              enriched: true,
              ipTimezone: geo.timezone ?? null,
            }
          : prev
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to enrich network info"
      );
    } finally {
      setEnriching(false);
    }
  }, []);

  return { data, loading, enriching, enrich, error };
}
