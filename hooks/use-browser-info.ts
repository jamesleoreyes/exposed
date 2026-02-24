"use client";

import { useState, useEffect } from "react";
import { UAParser } from "ua-parser-js";
import { detectBrowser } from "@/lib/detect-browser";
import type { BrowserInfo } from "@/types/fingerprint";

export function useBrowserInfo() {
  const [data, setData] = useState<BrowserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function collect() {
      try {
        const parser = new UAParser(navigator.userAgent);
        const result = parser.getResult();

        // Start with ua-parser-js as baseline
        let browserName = result.browser.name ?? "Unknown";
        let browserVersion = result.browser.version ?? "Unknown";
        let detectionMethod = "ua-string";

        // Layer enhanced detection on top
        const detected = await detectBrowser();
        if (detected) {
          browserName = detected.name;
          detectionMethod = detected.method;
          // Use version from enhanced detection if available,
          // otherwise keep the ua-parser version
          if (detected.version) {
            browserVersion = detected.version;
          }
        }

        setData({
          userAgent: navigator.userAgent,
          browserName,
          browserVersion,
          detectionMethod,
          os: result.os.name ?? "Unknown",
          osVersion: result.os.version ?? "Unknown",
          platform: navigator.platform,
          vendor: navigator.vendor,
          languages: Array.from(navigator.languages),
          cookieEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack,
          pdfViewerEnabled:
            "pdfViewerEnabled" in navigator
              ? (navigator as Navigator & { pdfViewerEnabled: boolean })
                  .pdfViewerEnabled
              : false,
          webdriver: navigator.webdriver,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to collect browser info"
        );
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  return { data, loading, error };
}
