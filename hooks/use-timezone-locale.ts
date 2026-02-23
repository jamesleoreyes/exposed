"use client";

import { useState, useEffect } from "react";
import type { TimezoneLocale } from "@/types/fingerprint";

export function useTimezoneLocale() {
  const [data, setData] = useState<TimezoneLocale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const offsetMinutes = new Date().getTimezoneOffset();
      const sign = offsetMinutes <= 0 ? "+" : "-";
      const absMinutes = Math.abs(offsetMinutes);
      const hours = Math.floor(absMinutes / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (absMinutes % 60).toString().padStart(2, "0");
      const utcOffset = `UTC${sign}${hours}:${minutes}`;

      const dateFormat = new Intl.DateTimeFormat().format(new Date());
      const numberFormat = new Intl.NumberFormat().format(1234567.89);
      const currencyFormat = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
      }).format(1234.56);
      const locale = navigator.language;

      setData({
        timezone,
        utcOffset,
        dateFormat,
        numberFormat,
        currencyFormat,
        locale,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to collect timezone/locale info");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}
