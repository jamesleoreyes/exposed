"use client";

import { Box } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { WebGLFingerprint as WebGLFingerprintType } from "@/types/fingerprint";

interface Props {
  data: WebGLFingerprintType | null;
  loading: boolean;
}

export function WebGLFingerprintDisplay({ data, loading }: Props) {
  const finding = data
    ? `Your graphics card has a readable signature. We can see it's ${data.renderer ? `a ${data.renderer.split(",")[0].replace("ANGLE (", "").replace(")", "")}` : "present"} with ${data.extensions.length} supported extensions — a combination that persists across browsers.`
    : "Reading your GPU signature...";

  return (
    <CategoryCard
      title="WebGL Fingerprint"
      icon={<Box className="size-4" />}
      risk="high"
      finding={finding}
      loading={loading}
      whyItMatters={EXPLANATIONS.webgl}
    >
      {data && (
        <>
          <DataRow
            label="Vendor"
            value={data.vendor}
            tooltip="The GPU vendor string exposed through WebGL"
          />
          <DataRow
            label="Renderer"
            value={data.renderer}
            tooltip="Your exact GPU model as reported by the WebGL API"
          />
          <DataRow
            label="WebGL Version"
            value={data.version}
            tooltip="The WebGL specification version your browser supports"
          />
          <DataRow
            label="Shading Language"
            value={data.shadingLanguageVersion}
            tooltip="The GLSL shading language version supported by your GPU"
          />
          <DataRow
            label="Extensions Count"
            value={data.extensions.length}
            tooltip="Number of WebGL extensions your GPU supports"
          />
          <DataRow
            label="Max Texture Size"
            value={data.maxTextureSize}
            tooltip="Maximum texture dimension your GPU can handle"
          />
          <DataRow
            label="Max Renderbuffer"
            value={data.maxRenderBufferSize}
            tooltip="Maximum renderbuffer size supported by your GPU"
          />
          <DataRow
            label="Hash"
            value={data.hash.slice(0, 16) + "..."}
            tooltip="Combined hash of all WebGL parameters for fingerprinting"
          />
        </>
      )}
    </CategoryCard>
  );
}
