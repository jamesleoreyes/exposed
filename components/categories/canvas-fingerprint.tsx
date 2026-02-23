"use client";

import { Paintbrush } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { CanvasFingerprint as CanvasFingerprintType } from "@/types/fingerprint";

interface Props {
  data: CanvasFingerprintType | null;
  loading: boolean;
}

export function CanvasFingerprintDisplay({ data, loading }: Props) {
  const finding = data
    ? `We drew invisible shapes on your screen and read back the pixels. Your GPU rendered them in a way that's unique to your device. Fingerprint: ${data.hash.slice(0, 12)}…`
    : "Rendering canvas fingerprint...";

  return (
    <CategoryCard
      title="Canvas Fingerprint"
      icon={<Paintbrush className="size-4" />}
      risk="high"
      finding={finding}
      loading={loading}
      whyItMatters={EXPLANATIONS.canvas}
    >
      {data && (
        <>
          <DataRow
            label="Hash"
            value={data.hash.slice(0, 16) + "..."}
            tooltip="A unique hash derived from how your GPU renders invisible graphics"
          />
          {data.dataUrl && (
            <div className="mt-3 space-y-1">
              <img
                src={data.dataUrl}
                alt="Canvas fingerprint rendering"
                width={280}
                height={60}
                className="w-full rounded border border-border/50"
              />
              <p className="text-xs text-muted-foreground">
                Your unique canvas rendering
              </p>
            </div>
          )}
        </>
      )}
    </CategoryCard>
  );
}
