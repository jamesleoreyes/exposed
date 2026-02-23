"use client";

import { useState, useEffect } from "react";
import type { MediaDevicesInfo } from "@/types/fingerprint";

const CODECS_TO_TEST = [
  "video/webm;codecs=vp8",
  "video/webm;codecs=vp9",
  "video/webm;codecs=av1",
  "video/mp4;codecs=avc1",
  "audio/webm;codecs=opus",
  "audio/mp4;codecs=mp4a.40.2",
];

export function useMediaDevices() {
  const [data, setData] = useState<MediaDevicesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function collect() {
      try {
        let audioinput = 0;
        let audiooutput = 0;
        let videoinput = 0;

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          for (const device of devices) {
            if (device.kind === "audioinput") audioinput++;
            else if (device.kind === "audiooutput") audiooutput++;
            else if (device.kind === "videoinput") videoinput++;
          }
        } catch {
          // mediaDevices may not be available
        }

        const supportedCodecs: string[] = [];
        for (const codec of CODECS_TO_TEST) {
          try {
            if (
              (typeof MediaRecorder !== "undefined" &&
                MediaRecorder.isTypeSupported(codec)) ||
              (typeof MediaSource !== "undefined" &&
                MediaSource.isTypeSupported(codec))
            ) {
              supportedCodecs.push(codec);
            }
          } catch {
            // Codec check not supported
          }
        }

        setData({
          audioinput,
          audiooutput,
          videoinput,
          supportedCodecs,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to enumerate media devices");
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  return { data, loading, error };
}
