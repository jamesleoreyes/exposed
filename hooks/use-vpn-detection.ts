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

function isPrivateIP(ip: string): boolean {
  return (
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") || // 172.20-29
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip === "127.0.0.1" ||
    ip === "0.0.0.0"
  );
}

/**
 * Detect potential VPN usage via:
 * 1. WebRTC local IP discovery (VPN tunnel interfaces)
 * 2. Timezone mismatch between browser and IP geolocation
 * 3. STUN server-reflexive IP vs server-reported IP mismatch
 */
export function useVpnDetection(
  ipTimezone: string | null,
  enriched: boolean,
  serverIP: string | null
): VpnDetection {
  const [webrtcIPs, setWebrtcIPs] = useState<string[]>([]);
  const [stunPublicIP, setStunPublicIP] = useState<string | null>(null);
  const [hasMdns, setHasMdns] = useState(false);
  const [loading, setLoading] = useState(true);

  // WebRTC IP discovery (local + STUN server-reflexive)
  useEffect(() => {
    const localIPs = new Set<string>();
    let foundStunIP: string | null = null;
    let foundMdns = false;

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.createDataChannel("");

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          // Gathering complete
          setWebrtcIPs(Array.from(localIPs));
          setStunPublicIP(foundStunIP);
          setHasMdns(foundMdns);
          setLoading(false);
          pc.close();
          return;
        }

        const candidate = event.candidate.candidate;

        // Detect mDNS obfuscation (browser hiding local IPs)
        if (candidate.includes(".local")) {
          foundMdns = true;
        }

        // Extract IP addresses from ICE candidates
        const ipRegex = /(?:\d{1,3}\.){3}\d{1,3}/;
        const match = candidate.match(ipRegex);
        if (match) {
          const ip = match[0];
          // ICE candidate types:
          // "host" = local interface, "srflx" = STUN server-reflexive (public IP)
          if (candidate.includes("typ srflx")) {
            foundStunIP = ip;
          } else if (candidate.includes("typ host")) {
            localIPs.add(ip);
          } else {
            // Classify by IP range
            if (isPrivateIP(ip)) {
              localIPs.add(ip);
            } else {
              foundStunIP = ip;
            }
          }
        }
      };

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => {
          setLoading(false);
        });

      // Timeout after 3 seconds
      const timeout = setTimeout(() => {
        setWebrtcIPs(Array.from(localIPs));
        setStunPublicIP(foundStunIP);
        setHasMdns(foundMdns);
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

  // Signal 1: Timezone mismatch (strong when cross-continent, softer within same continent)
  if (enriched && ipTimezone) {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserRegion = getTimezoneRegion(browserTz);
    const ipRegion = getTimezoneRegion(ipTimezone);

    if (browserRegion && ipRegion && browserRegion !== ipRegion) {
      signals.push(
        `Your browser timezone is ${browserTz} but your IP locates to ${ipTimezone}`
      );
    } else if (browserTz && ipTimezone && browserTz !== ipTimezone) {
      signals.push(
        `Your browser timezone is ${browserTz} but your IP suggests ${ipTimezone}`
      );
    }
  }

  // Signal 2: STUN public IP differs from server-reported IP (strong signal)
  if (
    serverIP &&
    stunPublicIP &&
    serverIP !== "127.0.0.1" &&
    serverIP !== "::1" &&
    stunPublicIP !== serverIP
  ) {
    signals.push(
      `WebRTC sees your public IP as ${stunPublicIP} but the server sees ${serverIP}`
    );
  }

  // Signal 3: VPN-typical local IP ranges from WebRTC
  for (const ip of webrtcIPs) {
    // 10.x.x.x is commonly used by VPN tunnel interfaces
    // (but also by corporate networks, so it's a soft signal)
    if (ip.startsWith("10.") && !ip.startsWith("10.0.0.")) {
      signals.push(`WebRTC revealed a local IP (${ip}) on a VPN-typical subnet`);
      break;
    }
  }

  // If WebRTC is fully blocked by mDNS and we have no local IPs, note it
  // (this alone isn't a VPN signal, but combined with other signals it's interesting)
  if (hasMdns && webrtcIPs.length === 0 && signals.length > 0) {
    signals.push(
      "Your browser is hiding local IPs via mDNS obfuscation"
    );
  }

  return {
    vpnLikely: signals.length > 0,
    signals,
    webrtcIPs,
    loading,
  };
}
