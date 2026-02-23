"use client";

import { useFingerprint } from "@/hooks/use-fingerprint";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/hero/hero-section";
import { NetworkLocation } from "@/components/categories/network-location";
import { BrowserOs } from "@/components/categories/browser-os";
import { HardwareProfile } from "@/components/categories/hardware-profile";
import { CanvasFingerprintDisplay } from "@/components/categories/canvas-fingerprint";
import { WebGLFingerprintDisplay } from "@/components/categories/webgl-fingerprint";
import { AudioFingerprintDisplay } from "@/components/categories/audio-fingerprint";
import { FontDetectionDisplay } from "@/components/categories/font-detection";
import { TimezoneLocaleDisplay } from "@/components/categories/timezone-locale";
import { StorageTracking } from "@/components/categories/storage-tracking";
import { PermissionsDisplay } from "@/components/categories/permissions-display";
import { MediaDevicesDisplay } from "@/components/categories/media-devices-display";
import { BehavioralSignalsDisplay } from "@/components/categories/behavioral-signals";

export function HomePage() {
  const {
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
    uniquenessScore,
    collectionTimeMs,
    loading,
  } = useFingerprint();

  const categories = [
    {
      key: "network",
      component: (
        <NetworkLocation
          data={network.data}
          loading={network.loading}
          enriching={network.enriching}
          onEnrich={network.enrich}
        />
      ),
    },
    {
      key: "browser",
      component: <BrowserOs data={browser.data} loading={browser.loading} />,
    },
    {
      key: "hardware",
      component: (
        <HardwareProfile data={hardware.data} loading={hardware.loading} />
      ),
    },
    {
      key: "canvas",
      component: (
        <CanvasFingerprintDisplay
          data={canvas.data}
          loading={canvas.loading}
        />
      ),
    },
    {
      key: "webgl",
      component: (
        <WebGLFingerprintDisplay data={webgl.data} loading={webgl.loading} />
      ),
    },
    {
      key: "audio",
      component: (
        <AudioFingerprintDisplay data={audio.data} loading={audio.loading} />
      ),
    },
    {
      key: "fonts",
      component: (
        <FontDetectionDisplay data={fonts.data} loading={fonts.loading} />
      ),
    },
    {
      key: "timezone",
      component: (
        <TimezoneLocaleDisplay
          data={timezone.data}
          loading={timezone.loading}
        />
      ),
    },
    {
      key: "storage",
      component: (
        <StorageTracking data={storage.data} loading={storage.loading} />
      ),
    },
    {
      key: "permissions",
      component: (
        <PermissionsDisplay
          data={permissions.data}
          loading={permissions.loading}
        />
      ),
    },
    {
      key: "media",
      component: (
        <MediaDevicesDisplay data={media.data} loading={media.loading} />
      ),
    },
    {
      key: "behavioral",
      component: (
        <BehavioralSignalsDisplay
          data={behavioral.data}
          loading={behavioral.loading}
        />
      ),
      fullWidth: true,
    },
  ];

  const totalDataPoints = categories.length;

  return (
    <div className="min-h-screen scan-lines">
      <Header />
      <main className="pt-12">
        <HeroSection
          ip={network.data?.ip ?? null}
          city={network.data?.city ?? null}
          country={network.data?.country ?? null}
          score={uniquenessScore?.score ?? 0}
          totalBits={uniquenessScore?.totalBits ?? 0}
          loading={loading}
        />

        {/* Section divider */}
        <div className="mx-auto max-w-6xl px-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              {totalDataPoints} categories of data collected
              {collectionTimeMs !== null && (
                <> in {collectionTimeMs.toLocaleString()}ms</>
              )}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className={cat.fullWidth ? "md:col-span-2" : ""}
              >
                {cat.component}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
