"use client";

import { Camera } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import { Badge } from "@/components/ui/badge";
import type { MediaDevicesInfo } from "@/types/fingerprint";

interface Props {
  data: MediaDevicesInfo | null;
  loading: boolean;
}

export function MediaDevicesDisplay({ data, loading }: Props) {
  const totalDevices = data ? data.audioinput + data.audiooutput + data.videoinput : 0;
  const finding = data
    ? `We can count ${totalDevices} media device${totalDevices !== 1 ? "s" : ""} connected to your system — ${data.videoinput} camera${data.videoinput !== 1 ? "s" : ""}, ${data.audioinput} microphone${data.audioinput !== 1 ? "s" : ""}, and ${data.audiooutput} audio output${data.audiooutput !== 1 ? "s" : ""}. Plus ${data.supportedCodecs.length} supported codecs.`
    : "Enumerating your media devices...";

  return (
    <CategoryCard
      title="Media Devices"
      icon={<Camera className="size-4" />}
      risk="medium"
      loading={loading}
      finding={finding}
      whyItMatters={EXPLANATIONS.media}
    >
      {data && (
        <>
          <DataRow
            label="Audio Inputs"
            value={data.audioinput}
            tooltip="Number of microphones detected on your device"
          />
          <DataRow
            label="Audio Outputs"
            value={data.audiooutput}
            tooltip="Number of audio output devices (speakers, headphones)"
          />
          <DataRow
            label="Video Inputs"
            value={data.videoinput}
            tooltip="Number of cameras detected on your device"
          />
          {data.supportedCodecs.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Supported Codecs
              </p>
              <div className="max-h-[100px] overflow-y-auto">
                <div className="flex flex-wrap gap-1">
                  {data.supportedCodecs.map((codec) => (
                    <Badge
                      key={codec}
                      variant="outline"
                      className="border-border/50 text-[10px] font-mono font-normal text-muted-foreground"
                    >
                      {codec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </CategoryCard>
  );
}
