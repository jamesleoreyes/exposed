"use client";

import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

interface UniquenessScoreProps {
  score: number;
  loading: boolean;
  totalBits: number;
}

function formatPopulation(bits: number): string {
  if (bits <= 0) return "1";
  const population = Math.pow(2, bits);
  if (population < 1_000) return Math.round(population).toLocaleString();
  if (population < 1_000_000) {
    return Math.round(population / 1_000).toLocaleString() + " thousand";
  }
  if (population < 1_000_000_000) {
    const m = population / 1_000_000;
    return (m >= 100 ? Math.round(m) : +m.toFixed(1)) + " million";
  }
  if (population < 1_000_000_000_000) {
    const b = population / 1_000_000_000;
    return (b >= 100 ? Math.round(b) : +b.toFixed(1)) + " billion";
  }
  if (population < 1e15) {
    const t = population / 1_000_000_000_000;
    return (t >= 100 ? Math.round(t) : +t.toFixed(1)) + " trillion";
  }
  if (population < 1e18) {
    const q = population / 1e15;
    return (q >= 100 ? Math.round(q) : +q.toFixed(1)) + " quadrillion";
  }
  const qi = population / 1e18;
  return (qi >= 100 ? Math.round(qi) : +qi.toFixed(1)) + " quintillion";
}

export function UniquenessScore({
  score,
  loading,
  totalBits,
}: UniquenessScoreProps) {
  const radius = 50;
  const strokeWidth = 2;
  const size = 120;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  function getColor(s: number): string {
    if (s <= 33) return "var(--color-risk-low)";
    if (s <= 66) return "var(--color-risk-medium)";
    return "var(--color-risk-high)";
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="size-28 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  const populationStr = formatPopulation(totalBits);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Ring with score percentage inside */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground"
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}
        >
          {score}%
        </text>
      </svg>

      {/* The "1 in X" statement — outside the ring, bigger and clearer */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm text-foreground/80">
          <span className="font-mono font-bold text-foreground">
            1 in {populationStr}
          </span>{" "}
          people share your browser fingerprint
        </p>
        <span className="font-mono text-[10px] text-muted-foreground/40">
          {totalBits} bits of identifying entropy
        </span>
      </div>
    </div>
  );
}
