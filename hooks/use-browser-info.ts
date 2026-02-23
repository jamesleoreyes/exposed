"use client";

import { useState, useEffect } from "react";
import { UAParser } from "ua-parser-js";
import type { BrowserInfo } from "@/types/fingerprint";

export function useBrowserInfo() {
  const [data, setData] = useState<BrowserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parser = new UAParser(navigator.userAgent);
      const result = parser.getResult();

      setData({
        userAgent: navigator.userAgent,
        browserName: result.browser.name ?? "Unknown",
        browserVersion: result.browser.version ?? "Unknown",
        os: result.os.name ?? "Unknown",
        osVersion: result.os.version ?? "Unknown",
        platform: navigator.platform,
        vendor: navigator.vendor,
        languages: Array.from(navigator.languages),
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        pdfViewerEnabled: (navigator as any).pdfViewerEnabled ?? false,
        webdriver: navigator.webdriver,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to collect browser info");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}
