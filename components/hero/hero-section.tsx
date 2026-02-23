"use client";

import { motion } from "motion/react";
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
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Surveillance vignette — dark edges, slightly lighter center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.10 0.01 260 / 40%) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 px-4 py-24">
        {/* The data hits first — your IP, stark and exposed */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
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
            <motion.span
              className="font-mono text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {city}, {country}
            </motion.span>
          )}
        </motion.div>

        {/* The statement — after they see their own data */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h1 className="max-w-xl text-center text-xl font-normal tracking-tight text-foreground/80 md:text-2xl">
            We know this because you loaded a webpage.
          </h1>
          <p className="max-w-xl text-center text-sm text-muted-foreground">
            No login. No cookies accepted. No permissions granted. Just a single
            page load.
          </p>
        </motion.div>

        {/* Uniqueness Score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <UniquenessScore
            score={score}
            totalBits={totalBits}
            loading={loading}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Scroll to see your full dossier
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="size-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
