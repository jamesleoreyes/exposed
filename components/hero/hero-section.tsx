"use client";

import { ChevronDown } from "lucide-react";
import { UniquenessScore } from "@/components/hero/uniqueness-score";

interface HeroSectionProps {
  ip: string | null;
  city: string | null;
  country: string | null;
  score: number;
  totalBits: number;
  loading: boolean;
}

export function HeroSection({
  ip,
  city,
  country,
  score,
  totalBits,
  loading,
}: HeroSectionProps) {
  return (
    <section className="flex min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-10 px-4 py-24">
        {/* The data hits first */}
        <div className="flex flex-col items-center gap-1">
          {ip ? (
            <span className="font-mono text-3xl font-bold tracking-tight text-primary md:text-5xl">
              {ip}
            </span>
          ) : (
            <span className="font-mono text-3xl text-muted-foreground md:text-5xl">
              ...
            </span>
          )}
          {city && country && city !== "Localhost" && country !== "Local" && (
            <span className="font-mono text-sm text-muted-foreground">
              {city}, {country}
            </span>
          )}
        </div>

        {/* The statement */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="max-w-xl text-center text-xl font-normal tracking-tight text-foreground/80 md:text-2xl">
            We know this because you loaded a webpage.
          </h1>
          <p className="max-w-xl text-center text-sm text-muted-foreground">
            No login. No cookies accepted. No permissions granted. Just a single
            page load.
          </p>
        </div>

        {/* Uniqueness Score */}
        <UniquenessScore
          score={score}
          totalBits={totalBits}
          loading={loading}
        />

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-1 opacity-40">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Scroll to see your full dossier
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
