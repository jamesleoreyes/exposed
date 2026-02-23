"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface UniquenessScoreProps {
  score: number;
  loading: boolean;
  totalBits: number;
}

function formatPopulation(bits: number): { number: string; label: string } {
  if (bits <= 0) return { number: "1", label: "" };
  const population = Math.pow(2, bits);
  if (population < 1_000)
    return { number: Math.round(population).toLocaleString(), label: "" };
  if (population < 1_000_000)
    return {
      number: Math.round(population / 1_000).toLocaleString(),
      label: "thousand",
    };
  if (population < 1_000_000_000) {
    const m = population / 1_000_000;
    return {
      number: String(m >= 100 ? Math.round(m) : +m.toFixed(1)),
      label: "million",
    };
  }
  if (population < 1_000_000_000_000) {
    const b = population / 1_000_000_000;
    return {
      number: String(b >= 100 ? Math.round(b) : +b.toFixed(1)),
      label: "billion",
    };
  }
  if (population < 1e15) {
    const t = population / 1_000_000_000_000;
    return {
      number: String(t >= 100 ? Math.round(t) : +t.toFixed(1)),
      label: "trillion",
    };
  }
  if (population < 1e18) {
    const q = population / 1e15;
    return {
      number: String(q >= 100 ? Math.round(q) : +q.toFixed(1)),
      label: "quadrillion",
    };
  }
  const qi = population / 1e18;
  return {
    number: String(qi >= 100 ? Math.round(qi) : +qi.toFixed(1)),
    label: "quintillion",
  };
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

  const pop = formatPopulation(totalBits);

  return (
    <div className="flex flex-col items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <text
          x={center}
          y={pop.label ? center - 8 : center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground"
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}
        >
          1 in {pop.number}
        </text>
        {pop.label && (
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {pop.label}
          </text>
        )}
      </svg>

      {/* Clarifying text */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm text-foreground/80">
          people share your exact browser fingerprint
        </p>
        <span className="font-mono text-[10px] text-muted-foreground/70">
          {totalBits} bits of identifying entropy
        </span>
      </div>
    </div>
  );
}
