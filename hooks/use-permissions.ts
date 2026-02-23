"use client";

import { useState, useEffect } from "react";
import type { PermissionInfo } from "@/types/fingerprint";

const PERMISSION_NAMES = [
  "camera",
  "microphone",
  "geolocation",
  "notifications",
  "clipboard-read",
  "clipboard-write",
] as const;

export function usePermissions() {
  const [data, setData] = useState<PermissionInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function collect() {
      try {
        const results: PermissionInfo[] = await Promise.all(
          PERMISSION_NAMES.map(async (name) => {
            try {
              const status = await navigator.permissions.query({
                name: name as PermissionName,
              });
              return { name, state: status.state as PermissionInfo["state"] };
            } catch {
              return { name, state: "unsupported" as const };
            }
          })
        );

        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to query permissions");
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  return { data, loading, error };
}
