"use client";

import { useState, useEffect } from "react";

interface VpnDetection {
  vpnLikely: boolean;
  signals: string[];
  webrtcIPs: string[];
  loading: boolean;
}

/** Extract the continent/region prefix from a timezone string like "America/Chicago" */
function getTimezoneRegion(tz: string): string {
  return tz.split("/")[0] ?? "";
}

/**
 * Detect potential VPN usage via:
 * 1. WebRTC local IP discovery (VPN tunnel interfaces)
 * 2. Timezone mismatch between browser and IP geolocation
 */
export function useVpnDetection(
  ipTimezone: string | null,
  enriched: boolean
): VpnDetection {
  const [webrtcIPs, setWebrtcIPs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // WebRTC local IP discovery
  useEffect(() => {
    const ips = new Set<string>();

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.createDataChannel("");

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          // Gathering complete
          setWebrtcIPs(Array.from(ips));
          setLoading(false);
          pc.close();
          return;
        }

        const candidate = event.candidate.candidate;
        // Extract IP addresses from ICE candidates
        const ipRegex = /(?:\d{1,3}\.){3}\d{1,3}/;
        const match = candidate.match(ipRegex);
        if (match) {
          ips.add(match[0]);
        }
      };

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => {
          setLoading(false);
        });

      // Timeout after 3 seconds
      const timeout = setTimeout(() => {
        setWebrtcIPs(Array.from(ips));
        setLoading(false);
        pc.close();
      }, 3000);

      return () => {
        clearTimeout(timeout);
        pc.close();
      };
    } catch {
      setLoading(false);
    }
  }, []);

  // Compute VPN signals
  const signals: string[] = [];

  // Signal 1: Timezone mismatch
  if (enriched && ipTimezone) {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserRegion = getTimezoneRegion(browserTz);
    const ipRegion = getTimezoneRegion(ipTimezone);

    if (browserRegion && ipRegion && browserRegion !== ipRegion) {
      signals.push(
        `Your browser timezone is ${browserTz} but your IP locates to ${ipTimezone}`
      );
    } else if (browserTz && ipTimezone && browserTz !== ipTimezone) {
      // Same region but different city timezone — weaker signal but still notable
      signals.push(
        `Your browser timezone is ${browserTz} but your IP suggests ${ipTimezone}`
      );
    }
  }

  // Signal 2: VPN-typical local IP ranges from WebRTC
  for (const ip of webrtcIPs) {
    // 10.x.x.x is commonly used by VPN tunnel interfaces
    // (but also by corporate networks, so it's a soft signal)
    if (ip.startsWith("10.") && !ip.startsWith("10.0.0.")) {
      signals.push(`WebRTC revealed a local IP (${ip}) on a VPN-typical subnet`);
      break;
    }
  }

  return {
    vpnLikely: signals.length > 0,
    signals,
    webrtcIPs,
    loading,
  };
}
