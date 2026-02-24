export type RiskLevel = "low" | "medium" | "high";

export interface DataPoint {
  label: string;
  value: string | number | boolean | string[] | null;
  risk: RiskLevel;
  tooltip: string;
}

export interface NetworkInfo {
  ip: string;
  city: string | null;
  region: string | null;
  country: string | null;
  isp: string | null;
  lat: number | null;
  lon: number | null;
  connectionType: string | null;
  connectionMedium: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean | null;
  enriched: boolean;
  ipTimezone: string | null;
}

export interface BrowserInfo {
  userAgent: string;
  browserName: string;
  browserVersion: string;
  detectionMethod: string;
  os: string;
  osVersion: string;
  platform: string;
  vendor: string;
  languages: string[];
  cookieEnabled: boolean;
  doNotTrack: string | null;
  pdfViewerEnabled: boolean;
  webdriver: boolean;
}

export interface HardwareInfo {
  cpuCores: number;
  deviceMemory: number | null;
  screenWidth: number;
  screenHeight: number;
  screenColorDepth: number;
  pixelRatio: number;
  availWidth: number;
  availHeight: number;
  maxTouchPoints: number;
  gpuVendor: string | null;
  gpuRenderer: string | null;
}

export interface CanvasFingerprint {
  hash: string;
  dataUrl: string;
}

export interface WebGLFingerprint {
  vendor: string | null;
  renderer: string | null;
  version: string | null;
  shadingLanguageVersion: string | null;
  extensions: string[];
  maxTextureSize: number | null;
  maxRenderBufferSize: number | null;
  hash: string;
}

export interface AudioFingerprint {
  hash: string;
  sampleRate: number;
}

export interface FontDetection {
  tested: number;
  detected: string[];
  hash: string;
}

export interface TimezoneLocale {
  timezone: string;
  utcOffset: string;
  dateFormat: string;
  numberFormat: string;
  currencyFormat: string;
  locale: string;
}

export interface StorageCheck {
  cookies: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  serviceWorker: boolean;
}

export interface PermissionInfo {
  name: string;
  state: "granted" | "denied" | "prompt" | "unsupported";
}

export interface MediaDevicesInfo {
  audioinput: number;
  audiooutput: number;
  videoinput: number;
  supportedCodecs: string[];
}

export interface BehavioralSignals {
  mouseX: number;
  mouseY: number;
  mouseTrail: Array<{ x: number; y: number; t: number }>;
  scrollDepth: number;
  scrollDepthMax: number;
  timeOnPage: number;
  tabVisible: boolean;
  visibilityChanges: number;
  viewportWidth: number;
  viewportHeight: number;
  clickCount: number;
  keyPressCount: number;
  events: Array<{ type: string; detail: string; time: number }>;
}
