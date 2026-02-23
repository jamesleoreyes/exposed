"use client";

import { AudioLines } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { AudioFingerprint as AudioFingerprintType } from "@/types/fingerprint";

interface Props {
  data: AudioFingerprintType | null;
  loading: boolean;
}

export function AudioFingerprintDisplay({ data, loading }: Props) {
  const finding = data
    ? `Your device processes sound in a way no one else's does. We generated an inaudible tone and your hardware produced a unique signature: ${data.hash.slice(0, 12)}…`
    : "Generating audio signature...";

  return (
    <CategoryCard
      title="Audio Fingerprint"
      icon={<AudioLines className="size-4" />}
      risk="high"
      finding={finding}
      loading={loading}
      whyItMatters={EXPLANATIONS.audio}
    >
      {data ? (
        <>
          <DataRow
            label="Hash"
            value={data.hash.slice(0, 16) + "..."}
            tooltip="A unique hash from how your audio hardware processes sound"
          />
          <DataRow
            label="Sample Rate"
            value={`${data.sampleRate} Hz`}
            tooltip="The audio sample rate of your system's audio context"
          />
        </>
      ) : (
        !loading && (
          <p className="text-sm text-muted-foreground">
            Audio fingerprinting may require user interaction or is not
            supported in this browser.
          </p>
        )
      )}
    </CategoryCard>
  );
}
