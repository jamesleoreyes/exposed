import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Exposed Browser Fingerprinting Tool",
  description:
    "Privacy policy for Exposed, an educational browser fingerprinting tool. No personal information is stored, no cookies are set, and no tracking scripts are loaded.",
  alternates: {
    canonical: "https://howami.exposed/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-3xl items-center px-4">
          <Link
            href="/"
            className="font-mono text-[11px] font-medium tracking-widest text-primary uppercase hover:text-primary/80"
          >
            Exposed
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Last updated:</strong> February
            2025
          </p>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              What Exposed Does
            </h2>
            <p>
              Exposed is an educational tool that demonstrates the information a
              website can gather about your browser and device just by loading a
              page. It reveals browser fingerprinting techniques including canvas
              rendering, WebGL profiling, audio context analysis, font
              enumeration, hardware detection, and more. All fingerprinting and
              detection runs entirely in your browser. Nothing is sent to our
              servers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              Data Collection
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Nothing is stored.</strong>{" "}
                All fingerprint results are computed locally in your browser and
                displayed during your session only. When you close the tab,
                everything is gone.
              </li>
              <li>
                <strong className="text-foreground">No cookies.</strong> Exposed
                does not set any tracking cookies or use local storage for
                identification purposes.
              </li>
              <li>
                <strong className="text-foreground">No analytics.</strong> We do
                not use Google Analytics, Mixpanel, or any other analytics
                service to monitor visitors.
              </li>
              <li>
                <strong className="text-foreground">No third-party scripts.</strong>{" "}
                No external tracking or advertising scripts are loaded on any
                page.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              IP Geolocation (Opt-In)
            </h2>
            <p>
              The only external request Exposed makes is the optional IP
              geolocation lookup. This is explicitly opt-in: you must click a
              button to trigger it. When you do, your IP address is sent to a
              geolocation API to retrieve approximate location data. This data
              is displayed in your browser and is not stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              Hosting
            </h2>
            <p>
              Exposed is hosted on Vercel. Vercel may collect standard server
              logs (IP addresses, request timestamps) as part of their
              infrastructure. See{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-primary"
              >
                Vercel&apos;s Privacy Policy
              </a>{" "}
              for details.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              Open Source
            </h2>
            <p>
              Exposed is fully open source. You can inspect the entire codebase
              on{" "}
              <a
                href="https://github.com/jamesleoreyes/exposed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-primary"
              >
                GitHub
              </a>{" "}
              to verify these claims.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              Your Rights
            </h2>
            <p>
              Since Exposed does not collect, store, or process any personal
              information, there is nothing to request access to, correct, or
              delete. You are always in full control of your browsing session.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              Changes to This Policy
            </h2>
            <p>
              If this policy is updated, the changes will be reflected on this
              page with an updated revision date. Because no personal
              information is collected, changes are expected to be minimal.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-foreground">
              Contact
            </h2>
            <p>
              For privacy concerns or questions, open an issue on the{" "}
              <a
                href="https://github.com/jamesleoreyes/exposed/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-primary"
              >
                GitHub repository
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
