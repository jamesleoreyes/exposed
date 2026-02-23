import type { RiskLevel } from "@/types/fingerprint";

export interface CategoryMeta {
  id: string;
  title: string;
  icon: string;
  risk: RiskLevel;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "network",
    title: "Network & Location",
    icon: "Globe",
    risk: "high",
    description: "Your IP address and approximate physical location",
  },
  {
    id: "browser",
    title: "Browser & OS",
    icon: "Monitor",
    risk: "medium",
    description: "Your browser, operating system, and language preferences",
  },
  {
    id: "hardware",
    title: "Hardware Profile",
    icon: "Cpu",
    risk: "medium",
    description: "Your device's CPU, memory, screen, and GPU",
  },
  {
    id: "canvas",
    title: "Canvas Fingerprint",
    icon: "Paintbrush",
    risk: "high",
    description: "A unique image your GPU renders slightly differently than everyone else's",
  },
  {
    id: "webgl",
    title: "WebGL Fingerprint",
    icon: "Box",
    risk: "high",
    description: "Your graphics card's identity and capabilities",
  },
  {
    id: "audio",
    title: "Audio Fingerprint",
    icon: "AudioLines",
    risk: "high",
    description: "An inaudible sound your audio hardware processes uniquely",
  },
  {
    id: "fonts",
    title: "Font Detection",
    icon: "Type",
    risk: "medium",
    description: "Which fonts are installed on your system",
  },
  {
    id: "timezone",
    title: "Timezone & Locale",
    icon: "Clock",
    risk: "low",
    description: "Your timezone, locale, and formatting preferences",
  },
  {
    id: "storage",
    title: "Storage & Tracking",
    icon: "Database",
    risk: "low",
    description: "What persistent storage mechanisms your browser supports",
  },
  {
    id: "permissions",
    title: "Permissions",
    icon: "Shield",
    risk: "medium",
    description: "What your browser could grant access to if asked",
  },
  {
    id: "media",
    title: "Media Devices",
    icon: "Camera",
    risk: "medium",
    description: "Cameras, microphones, and supported media formats",
  },
  {
    id: "behavioral",
    title: "Behavioral Signals",
    icon: "MousePointer",
    risk: "high",
    description: "Live tracking of your mouse, scrolling, and attention patterns",
  },
];
