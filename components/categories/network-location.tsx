"use client";

import { Globe, ExternalLink } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { NetworkInfo } from "@/types/fingerprint";

interface Props {
  data: NetworkInfo | null;
  loading: boolean;
  enriching: boolean;
  onEnrich: () => void;
}

export function NetworkLocation({ data, loading, enriching, onEnrich }: Props) {
  const finding = data
    ? data.enriched
      ? `We know you're in ${data.city || "an unknown city"}, ${data.country || "an unknown country"}. Your ISP is ${data.isp || "unknown"}. Your IP address ${data.ip} is visible to every site you visit.`
      : `Your IP address is ${data.ip}. Every website you visit sees this. With one additional lookup, we could pinpoint your city, country, and internet provider.`
    : "Reading your connection...";

  return (
    <CategoryCard
      title="Network & Location"
      icon={<Globe className="size-4" />}
      risk="high"
      finding={finding}
      loading={loading}
      whyItMatters={EXPLANATIONS.network}
    >
      {data && (
        <>
          <DataRow
            label="IP Address"
            value={data.ip}
            tooltip="Your public IP address, visible to every website you visit"
          />
          <DataRow
            label="Connection Type"
            value={data.connectionType}
            tooltip="Network connection type (e.g., 4g, wifi)"
          />
          <DataRow
            label="Downlink Speed"
            value={data.downlink !== null ? `${data.downlink} Mbps` : null}
            tooltip="Estimated download bandwidth of your connection"
          />
          <DataRow
            label="RTT Latency"
            value={data.rtt !== null ? `${data.rtt} ms` : null}
            tooltip="Round-trip time estimate for your connection"
          />
          <DataRow
            label="Data Saver"
            value={data.saveData}
            tooltip="Whether you have data saver mode enabled"
          />

          {data.enriched ? (
            <>
              <div className="mt-3 mb-1 border-t border-border pt-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
                  Geolocation data from ip-api.com
                </span>
              </div>
              <DataRow
                label="City"
                value={data.city}
                tooltip="Approximate city derived from your IP address"
              />
              <DataRow
                label="Region"
                value={data.region}
                tooltip="State or province inferred from your IP"
              />
              <DataRow
                label="Country"
                value={data.country}
                tooltip="Country determined from your IP geolocation"
              />
              <DataRow
                label="ISP"
                value={data.isp}
                tooltip="Your Internet Service Provider, which can narrow down your identity"
              />
              <DataRow
                label="Latitude"
                value={data.lat}
                tooltip="Approximate latitude coordinate of your connection"
              />
              <DataRow
                label="Longitude"
                value={data.lon}
                tooltip="Approximate longitude coordinate of your connection"
              />
            </>
          ) : (
            <div className="mt-3 border-t border-border pt-3">
              <div className="space-y-2">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  To show what a website can learn about your location, we can
                  look up your IP address using a third-party geolocation
                  service. Here&apos;s exactly what happens:
                </p>
                <ul className="space-y-1 text-[11px] leading-relaxed text-muted-foreground/80">
                  <li className="flex gap-2">
                    <span className="text-primary/60">&#8250;</span>
                    <span>
                      Your IP address ({data.ip}) is sent to{" "}
                      <span className="font-mono text-foreground/60">
                        ip-api.com
                      </span>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary/60">&#8250;</span>
                    <span>
                      They return your approximate city, region, country, ISP, and coordinates
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary/60">&#8250;</span>
                    <span>
                      No data is stored by us — but ip-api.com may log the
                      request per their{" "}
                      <a
                        href="https://ip-api.com/docs/legal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-foreground/60 underline underline-offset-2 hover:text-foreground/80"
                      >
                        privacy policy
                        <ExternalLink className="size-2.5" />
                      </a>
                    </span>
                  </li>
                </ul>
                <button
                  onClick={onEnrich}
                  disabled={enriching}
                  className="mt-2 w-full border border-primary/30 bg-primary/5 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                >
                  {enriching ? "Looking up..." : "Look up my location"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </CategoryCard>
  );
}
