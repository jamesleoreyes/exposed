"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useNetworkInfo } from "@/hooks/use-network-info";
import { useBrowserInfo } from "@/hooks/use-browser-info";
import { useHardwareInfo } from "@/hooks/use-hardware-info";
import { useCanvasFingerprint } from "@/hooks/use-canvas-fingerprint";
import { useWebGLFingerprint } from "@/hooks/use-webgl-fingerprint";
import { useAudioFingerprint } from "@/hooks/use-audio-fingerprint";
import { useFontDetection } from "@/hooks/use-font-detection";
import { useTimezoneLocale } from "@/hooks/use-timezone-locale";
import { useStorageCheck } from "@/hooks/use-storage-check";
import { usePermissions } from "@/hooks/use-permissions";
import { useMediaDevices } from "@/hooks/use-media-devices";
import { useBehavioral } from "@/hooks/use-behavioral";
import { hashCombined } from "@/lib/fingerprint-hash";
import { computeUniquenessScore } from "@/lib/uniqueness-score";

export function useFingerprint() {
  const network = useNetworkInfo();
  const browser = useBrowserInfo();
  const hardware = useHardwareInfo();
  const canvas = useCanvasFingerprint();
  const webgl = useWebGLFingerprint();
  const audio = useAudioFingerprint();
  const fonts = useFontDetection();
  const timezone = useTimezoneLocale();
  const storage = useStorageCheck();
  const permissions = usePermissions();
  const media = useMediaDevices();
  const behavioral = useBehavioral();

  const [compositeHash, setCompositeHash] = useState<string | null>(null);
  const [collectionTimeMs, setCollectionTimeMs] = useState<number | null>(null);
  const startTime = useRef(0);
  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const allLoaded =
    !network.loading &&
    !browser.loading &&
    !hardware.loading &&
    !canvas.loading &&
    !webgl.loading &&
    !audio.loading &&
    !fonts.loading &&
    !timezone.loading &&
    !storage.loading &&
    !permissions.loading &&
    !media.loading;

  // Record collection time when all hooks finish
  useEffect(() => {
    if (!allLoaded) return;
    setCollectionTimeMs(Date.now() - startTime.current);
  }, [allLoaded]);

  // Compute composite hash when all data hooks finish loading (async, needs effect)
  useEffect(() => {
    if (!allLoaded) return;

    async function compute() {
      try {
        const hash = await hashCombined(
          canvas.data?.hash,
          webgl.data?.hash,
          audio.data?.hash,
          fonts.data?.hash
        );
        setCompositeHash(hash);
      } catch {
        // Hash computation failed silently
      }
    }

    compute();
  }, [allLoaded, canvas.data?.hash, webgl.data?.hash, audio.data?.hash, fonts.data?.hash]);

  // Compute uniqueness score synchronously via useMemo (no async needed)
  const uniquenessScore = useMemo(() => {
    if (!allLoaded) return null;

    return computeUniquenessScore({
      browser: browser.data,
      hardware: hardware.data,
      canvas: canvas.data,
      webgl: webgl.data,
      audio: audio.data,
      fonts: fonts.data,
      timezone: timezone.data,
      storage: storage.data,
      media: media.data,
    });
  }, [
    allLoaded,
    browser.data,
    hardware.data,
    canvas.data,
    webgl.data,
    audio.data,
    fonts.data,
    timezone.data,
    storage.data,
    media.data,
  ]);

  return {
    network,
    browser,
    hardware,
    canvas,
    webgl,
    audio,
    fonts,
    timezone,
    storage,
    permissions,
    media,
    behavioral,
    compositeHash,
    uniquenessScore,
    collectionTimeMs,
    loading: !allLoaded,
    breakdown: uniquenessScore?.breakdown ?? null,
  };
}
