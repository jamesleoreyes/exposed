/**
 * Enhanced browser detection beyond user agent string parsing.
 *
 * Layers multiple detection techniques to identify Chromium forks
 * that all report as "Chrome" in the UA string:
 *
 * 1. User-Agent Client Hints API (navigator.userAgentData.brands)
 * 2. Brave dedicated API (navigator.brave.isBrave())
 * 3. Arc CSS variable injection (--arc-palette-*)
 * 4. Opera window object (window.opr)
 * 5. Fallback: ua-parser-js on raw UA string
 */

interface BrowserDetectionResult {
  name: string;
  version: string;
  method: "client-hints" | "brave-api" | "arc-css" | "opera-global" | "ua-string";
}

interface NavigatorUABrand {
  brand: string;
  version: string;
}

interface NavigatorUAData {
  brands: NavigatorUABrand[];
  mobile: boolean;
  platform: string;
}

// Brands to look for in userAgentData.brands, in priority order.
// "Chromium" and grease entries (e.g. "Not A;Brand") are skipped.
const KNOWN_BRANDS = [
  "Brave",
  "Microsoft Edge",
  "Opera",
  "Opera GX",
  "Samsung Internet",
  "Vivaldi",
  "Yandex",
  "Helium",
  "Google Chrome",
] as const;

function isGreaseOrEngine(brand: string): boolean {
  // UA-CH includes "grease" entries with special characters and "Chromium"
  return (
    brand === "Chromium" ||
    brand.includes("Not") ||
    brand.includes(";") ||
    brand.includes("?") ||
    brand.includes("(")
  );
}

/**
 * Attempt detection via User-Agent Client Hints API.
 * Modern Chromium browsers declare their real identity here.
 */
function detectViaClientHints(): BrowserDetectionResult | null {
  const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData;
  if (!uaData?.brands?.length) return null;

  for (const knownBrand of KNOWN_BRANDS) {
    const match = uaData.brands.find(
      (b) => b.brand.toLowerCase() === knownBrand.toLowerCase()
    );
    if (match && !isGreaseOrEngine(match.brand)) {
      return { name: match.brand, version: match.version, method: "client-hints" };
    }
  }

  return null;
}

/**
 * Brave exposes a dedicated detection API.
 * Returns a promise since navigator.brave.isBrave() is async.
 */
async function detectBrave(): Promise<BrowserDetectionResult | null> {
  try {
    const nav = navigator as Navigator & {
      brave?: { isBrave: () => Promise<boolean> };
    };
    if (nav.brave && typeof nav.brave.isBrave === "function") {
      const isBrave = await nav.brave.isBrave();
      if (isBrave) {
        return { name: "Brave", version: "", method: "brave-api" };
      }
    }
  } catch {
    // Brave may revoke access on certain sites
  }
  return null;
}

/**
 * Arc injects --arc-palette-* CSS custom properties on :root.
 * These are only available after page load, so we check with a small delay.
 */
function detectArc(): BrowserDetectionResult | null {
  try {
    const style = getComputedStyle(document.documentElement);
    const arcBg = style.getPropertyValue("--arc-palette-background").trim();
    if (arcBg) {
      return { name: "Arc", version: "", method: "arc-css" };
    }
  } catch {
    // getComputedStyle may fail in unusual contexts
  }
  return null;
}

/**
 * Opera (Chromium-based) exposes window.opr with an addons property.
 */
function detectOpera(): BrowserDetectionResult | null {
  const win = window as Window & {
    opr?: { addons?: unknown };
    opera?: unknown;
  };
  if (win.opr?.addons || win.opera) {
    return { name: "Opera", version: "", method: "opera-global" };
  }
  return null;
}

/**
 * Run all detection methods in priority order.
 * Returns the most specific browser identity we can determine.
 */
export async function detectBrowser(): Promise<BrowserDetectionResult | null> {
  // 1. Client Hints - most reliable for browsers that opt in
  const hints = detectViaClientHints();
  if (hints && hints.name !== "Google Chrome") {
    return hints;
  }

  // 2. Brave dedicated API - more reliable than client hints for Brave
  const brave = await detectBrave();
  if (brave) return brave;

  // 3. Arc CSS variables
  const arc = detectArc();
  if (arc) return arc;

  // 4. Opera window global
  const opera = detectOpera();
  if (opera) return opera;

  // 5. If client hints said "Google Chrome", return that (still better than UA parsing)
  if (hints) return hints;

  // 6. No enhanced detection matched - caller should fall back to ua-parser-js
  return null;
}
