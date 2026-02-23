"use client";

import { Database } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { StorageCheck } from "@/types/fingerprint";

interface Props {
  data: StorageCheck | null;
  loading: boolean;
}

export function StorageTracking({ data, loading }: Props) {
  const storageCount = data
    ? [data.cookies, data.localStorage, data.sessionStorage, data.indexedDB, data.serviceWorker].filter(Boolean).length
    : 0;
  const finding = data
    ? `Your browser supports ${storageCount} out of 5 tracking storage mechanisms. ${storageCount >= 4 ? "That's enough for trackers to store persistent identifiers that survive clearing cookies." : "Trackers can still use the available mechanisms to identify you."}`
    : "Checking storage capabilities...";

  return (
    <CategoryCard
      title="Storage & Tracking"
      icon={<Database className="size-4" />}
      risk="low"
      loading={loading}
      finding={finding}
      whyItMatters={EXPLANATIONS.storage}
    >
      {data && (
        <>
          <DataRow
            label="Cookies"
            value={data.cookies}
            tooltip="Whether your browser supports cookies for tracking"
          />
          <DataRow
            label="Local Storage"
            value={data.localStorage}
            tooltip="Persistent key-value storage that survives browser restarts"
          />
          <DataRow
            label="Session Storage"
            value={data.sessionStorage}
            tooltip="Temporary storage that clears when the tab is closed"
          />
          <DataRow
            label="IndexedDB"
            value={data.indexedDB}
            tooltip="Full database in your browser, can store large amounts of tracking data"
          />
          <DataRow
            label="Service Worker"
            value={data.serviceWorker}
            tooltip="Background scripts that can intercept requests and persist data"
          />
        </>
      )}
    </CategoryCard>
  );
}
