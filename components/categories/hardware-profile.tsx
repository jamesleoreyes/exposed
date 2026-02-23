"use client";

import { Cpu } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { HardwareInfo } from "@/types/fingerprint";

interface Props {
  data: HardwareInfo | null;
  loading: boolean;
}

export function HardwareProfile({ data, loading }: Props) {
  const finding = data
    ? `Your device has ${data.cpuCores} CPU cores, ${data.deviceMemory ? data.deviceMemory + " GB of memory, " : ""}a ${data.screenWidth}x${data.screenHeight} display${data.gpuRenderer ? `, and a ${data.gpuRenderer.split(",")[0].replace("ANGLE (", "").replace(")", "")} GPU` : ""}. This hardware profile is surprisingly distinctive.`
    : "Scanning your hardware...";

  return (
    <CategoryCard
      title="Hardware Profile"
      icon={<Cpu className="size-4" />}
      risk="medium"
      finding={finding}
      loading={loading}
      whyItMatters={EXPLANATIONS.hardware}
    >
      {data && (
        <>
          <DataRow
            label="CPU Cores"
            value={data.cpuCores}
            tooltip="Number of logical processor cores available"
          />
          <DataRow
            label="Device Memory"
            value={data.deviceMemory !== null ? `${data.deviceMemory} GB` : null}
            tooltip="Approximate amount of RAM on your device"
          />
          <DataRow
            label="Screen Resolution"
            value={`${data.screenWidth}x${data.screenHeight}`}
            tooltip="Your display's native resolution in pixels"
          />
          <DataRow
            label="Color Depth"
            value={`${data.screenColorDepth}-bit`}
            tooltip="Number of bits used for each pixel's color"
          />
          <DataRow
            label="Pixel Ratio"
            value={data.pixelRatio}
            tooltip="Ratio of physical to CSS pixels, reveals Retina/HiDPI displays"
          />
          <DataRow
            label="Available Screen"
            value={`${data.availWidth}x${data.availHeight}`}
            tooltip="Screen area excluding taskbar/dock, reveals your desktop setup"
          />
          <DataRow
            label="Touch Points"
            value={data.maxTouchPoints}
            tooltip="Maximum simultaneous touch points, indicates touchscreen capability"
          />
          <DataRow
            label="GPU Vendor"
            value={data.gpuVendor}
            tooltip="Your graphics card manufacturer, a strong fingerprinting signal"
          />
          <DataRow
            label="GPU Renderer"
            value={data.gpuRenderer}
            tooltip="Your exact GPU model, highly identifying when combined with other data"
          />
        </>
      )}
    </CategoryCard>
  );
}
