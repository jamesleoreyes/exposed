"use client";

import { useRef, useEffect } from "react";

interface ActivityFeedProps {
  events: Array<{ type: string; detail: string; time: number }>;
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 1) return "now";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h`;
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div
      ref={scrollRef}
      className="max-h-[160px] overflow-y-auto border border-border bg-background p-2 font-mono text-[11px]"
    >
      {events.length === 0 ? (
        <p className="py-4 text-center text-muted-foreground/40">
          Waiting for interactions...
        </p>
      ) : (
        <div className="space-y-px">
          {events.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-0.5 text-muted-foreground"
            >
              <span className="shrink-0 tabular-nums text-muted-foreground/40 w-6 text-right">
                {formatRelativeTime(event.time)}
              </span>
              <span className="shrink-0 uppercase text-[10px] tracking-wider text-primary/60 w-14">
                {event.type}
              </span>
              <span className="truncate text-muted-foreground/70">
                {event.detail}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
