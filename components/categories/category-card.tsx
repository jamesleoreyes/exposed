"use client";

import type { RiskLevel } from "@/types/fingerprint";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreatBadge } from "@/components/categories/threat-badge";

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  risk: RiskLevel;
  loading: boolean;
  children: React.ReactNode;
  whyItMatters: string;
  finding: string;
}

export function CategoryCard({
  title,
  icon,
  risk,
  loading,
  children,
  whyItMatters,
  finding,
}: CategoryCardProps) {
  return (
    <div className="border border-border bg-card">
      {/* Card header — minimal, institutional */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="font-mono text-[11px] uppercase tracking-widest">
            {title}
          </span>
        </div>
        <ThreatBadge risk={risk} />
      </div>

      {/* Finding — the plain-English revelation */}
      <div className="border-b border-border/50 px-4 py-4">
        {loading ? (
          <Skeleton className="h-5 w-3/4" />
        ) : (
          <p className="text-[15px] leading-relaxed text-foreground">
            {finding}
          </p>
        )}
      </div>

      {/* Evidence — the raw data */}
      <div className="px-4 py-3">
        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          children
        )}
      </div>

      {/* Why this matters — expandable */}
      <div className="border-t border-border/50 px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="why-it-matters" className="border-b-0">
            <AccordionTrigger className="py-2.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground hover:no-underline">
              Why this matters
            </AccordionTrigger>
            <AccordionContent>
              <p className="pb-2 text-sm leading-relaxed text-muted-foreground">
                {whyItMatters}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
