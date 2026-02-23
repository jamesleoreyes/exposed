"use client";

import { useState, useEffect } from "react";
import type { StorageCheck } from "@/types/fingerprint";

export function useStorageCheck() {
  const [data, setData] = useState<StorageCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cookies = navigator.cookieEnabled;

      let localStorageAvailable = false;
      try {
        window.localStorage.setItem("__test", "1");
        window.localStorage.removeItem("__test");
        localStorageAvailable = true;
      } catch {
        localStorageAvailable = false;
      }

      let sessionStorageAvailable = false;
      try {
        window.sessionStorage.setItem("__test", "1");
        window.sessionStorage.removeItem("__test");
        sessionStorageAvailable = true;
      } catch {
        sessionStorageAvailable = false;
      }

      const indexedDB = !!window.indexedDB;
      const serviceWorker = "serviceWorker" in navigator;

      setData({
        cookies,
        localStorage: localStorageAvailable,
        sessionStorage: sessionStorageAvailable,
        indexedDB,
        serviceWorker,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check storage capabilities");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}
