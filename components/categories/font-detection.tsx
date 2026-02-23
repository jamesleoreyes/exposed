"use client";

import { Type } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import { Badge } from "@/components/ui/badge";
import type { FontDetection as FontDetectionType } from "@/types/fingerprint";

interface Props {
  data: FontDetectionType | null;
  loading: boolean;
}

export function FontDetectionDisplay({ data, loading }: Props) {
  const finding = data
    ? `We silently detected ${data.detected.length} fonts installed on your computer out of ${data.tested} tested. Your font collection is remarkably distinctive — like a fingerprint made of typefaces.`
    : "Probing your installed fonts...";

  return (
    <CategoryCard
      title="Font Detection"
      icon={<Type className="size-4" />}
      risk="medium"
      loading={loading}
      finding={finding}
      whyItMatters={EXPLANATIONS.fonts}
    >
      {data && (
        <>
          <DataRow
            label="Fonts Tested"
            value={data.tested}
            tooltip="Total number of fonts tested for availability"
          />
          <DataRow
            label="Fonts Detected"
            value={data.detected.length}
            tooltip="Number of fonts found installed on your system"
          />
          <DataRow
            label="Hash"
            value={data.hash.slice(0, 16) + "..."}
            tooltip="A hash of your detected font combination"
          />
          {data.detected.length > 0 && (
            <div className="mt-3 max-h-[120px] overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {data.detected.map((font) => (
                  <Badge
                    key={font}
                    variant="outline"
                    className="border-border/50 text-[10px] font-mono font-normal text-muted-foreground"
                  >
                    {font}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </CategoryCard>
  );
}
