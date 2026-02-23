import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/fingerprint";

interface ThreatBadgeProps {
  risk: RiskLevel;
}

const threatLabels: Record<RiskLevel, string> = {
  low: "Adds context",
  medium: "Narrows who you are",
  high: "Can identify you",
};

const threatStyles: Record<RiskLevel, string> = {
  low: "text-risk-low border-risk-low/30",
  medium: "text-risk-medium border-risk-medium/30",
  high: "text-risk-high border-risk-high/30",
};

export function ThreatBadge({ risk }: ThreatBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        threatStyles[risk]
      )}
    >
      {threatLabels[risk]}
    </span>
  );
}

// Keep backward compat export
export const RiskBadge = ThreatBadge;
