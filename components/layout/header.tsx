"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-primary animate-recording" />
          <span className="font-mono text-[11px] font-medium tracking-widest text-primary uppercase">
            Exposed
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {minutes}:{seconds}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Session Active
          </span>
        </div>
      </div>
    </header>
  );
}
