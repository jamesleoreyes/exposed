"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/fingerprint-hash";
import type { AudioFingerprint } from "@/types/fingerprint";

export function useAudioFingerprint() {
  const [data, setData] = useState<AudioFingerprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function collect() {
      try {
        const audioContext = new OfflineAudioContext(1, 44100, 44100);

        const oscillator = audioContext.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
        compressor.knee.setValueAtTime(40, audioContext.currentTime);
        compressor.ratio.setValueAtTime(12, audioContext.currentTime);
        compressor.attack.setValueAtTime(0, audioContext.currentTime);
        compressor.release.setValueAtTime(0.25, audioContext.currentTime);

        oscillator.connect(compressor);
        compressor.connect(audioContext.destination);

        oscillator.start(0);
        oscillator.stop(audioContext.length / audioContext.sampleRate);

        const renderedBuffer = await audioContext.startRendering();
        const channelData = renderedBuffer.getChannelData(0);

        let sum = 0;
        for (let i = 4500; i < 5000; i++) {
          sum += channelData[i];
        }

        const hash = await sha256(sum.toString());

        setData({
          hash,
          sampleRate: renderedBuffer.sampleRate,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to collect audio fingerprint");
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  return { data, loading, error };
}
