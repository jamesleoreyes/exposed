import type {
  BrowserInfo,
  HardwareInfo,
  CanvasFingerprint,
  WebGLFingerprint,
  AudioFingerprint,
  FontDetection,
  TimezoneLocale,
  StorageCheck,
  MediaDevicesInfo,
} from "@/types/fingerprint";

// Entropy estimates in bits based on AmIUnique and Panopticlick research
interface EntropyInput {
  browser: BrowserInfo | null;
  hardware: HardwareInfo | null;
  canvas: CanvasFingerprint | null;
  webgl: WebGLFingerprint | null;
  audio: AudioFingerprint | null;
  fonts: FontDetection | null;
  timezone: TimezoneLocale | null;
  storage: StorageCheck | null;
  media: MediaDevicesInfo | null;
}

interface EntropyBreakdown {
  label: string;
  bits: number;
}

export function computeUniquenessScore(input: EntropyInput): {
  score: number;
  totalBits: number;
  breakdown: EntropyBreakdown[];
} {
  const breakdown: EntropyBreakdown[] = [];
  let totalBits = 0;

  const add = (label: string, bits: number) => {
    breakdown.push({ label, bits });
    totalBits += bits;
  };

  // User agent / browser identity
  if (input.browser) {
    add("User Agent", 10);
    add("Languages", input.browser.languages.length > 2 ? 4 : 3);
    add("Platform", 3);
    add("Do Not Track", input.browser.doNotTrack ? 1 : 0);
  }

  // Hardware
  if (input.hardware) {
    add("Screen Resolution", 4);
    add("Color Depth", 1);
    add("Pixel Ratio", 2);
    add("CPU Cores", 2);
    add("Device Memory", input.hardware.deviceMemory ? 2 : 0);
    add("Touch Support", input.hardware.maxTouchPoints > 0 ? 2 : 1);
    add("GPU", input.hardware.gpuRenderer ? 5 : 0);
  }

  // Canvas
  if (input.canvas?.hash) {
    add("Canvas Fingerprint", 9);
  }

  // WebGL
  if (input.webgl?.hash) {
    add("WebGL Fingerprint", 7);
  }

  // Audio
  if (input.audio?.hash) {
    add("Audio Fingerprint", 6);
  }

  // Fonts
  if (input.fonts) {
    const fontCount = input.fonts.detected.length;
    // More detected fonts = more entropy
    add("Installed Fonts", Math.min(Math.floor(fontCount / 5) + 3, 8));
  }

  // Timezone
  if (input.timezone) {
    add("Timezone", 3);
    add("Locale Formats", 2);
  }

  // Storage
  if (input.storage) {
    add("Storage Support", 1);
  }

  // Media devices
  if (input.media) {
    add("Media Devices", 3);
    add("Codec Support", 2);
  }

  // Map total bits to 0-100 score
  // Research suggests ~33 bits uniquely identifies among all internet users
  // We cap the practical max around 65 bits
  const maxBits = 65;
  const score = Math.min(Math.round((totalBits / maxBits) * 100), 100);

  return { score, totalBits, breakdown };
}
