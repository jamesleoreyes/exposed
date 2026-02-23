"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface DataRowProps {
  label: string;
  value: string | number | boolean | string[] | null;
  tooltip: string;
}

function formatValue(value: DataRowProps["value"]): React.ReactNode {
  if (value === null) {
    return <span className="text-muted-foreground/40">&mdash;</span>;
  }

  if (typeof value === "boolean") {
    return (
      <span className={value ? "text-risk-low" : "text-risk-high"}>
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (Array.isArray(value)) {
    const joined = value.join(", ");
    if (joined.length > 60) {
      return joined.slice(0, 60) + "\u2026";
    }
    return joined;
  }

  const str = String(value);
  if (str.length > 80) {
    return str.slice(0, 80) + "\u2026";
  }
  return str;
}

export function DataRow({ label, value, tooltip }: DataRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-[11px] text-muted-foreground/70">
          {label}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="size-2.5 shrink-0 cursor-help text-muted-foreground/30 hover:text-muted-foreground/60" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <span className="truncate text-right font-mono text-[12px] text-foreground/90">
        {formatValue(value)}
      </span>
    </div>
  );
}
