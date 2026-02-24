"use client";

import { useRef, useEffect } from "react";

interface MouseTrackerProps {
  mouseTrail: Array<{ x: number; y: number; t: number }>;
  mouseX: number;
  mouseY: number;
}

const MAX_TRAIL = 200;

export function MouseTracker({ mouseX, mouseY }: MouseTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const globalPosRef = useRef({ x: mouseX, y: mouseY });

  // Sync global viewport coords from props (for the text readout)
  useEffect(() => {
    globalPosRef.current.x = mouseX;
    globalPosRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      const rect = container!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Local mouse state - updated on every native event, bypasses React entirely
    const local = { x: w / 2, y: h / 2, inside: false };
    const trail: Array<{ x: number; y: number }> = [];
    const clicks: Array<{ x: number; y: number; t: number }> = [];

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      local.x = e.clientX - rect.left;
      local.y = e.clientY - rect.top;
      local.inside = true;
      trail.push({ x: local.x, y: local.y });
      if (trail.length > MAX_TRAIL) trail.shift();
    }

    function onMouseLeave() {
      local.inside = false;
    }

    function onClick() {
      clicks.push({ x: local.x, y: local.y, t: performance.now() });
    }

    container.addEventListener("mousemove", onMouseMove, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave, { passive: true });
    container.addEventListener("click", onClick, { passive: true });

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Trail - batch by opacity bands for fewer state changes
      if (trail.length > 1) {
        ctx!.lineWidth = 1;
        for (let i = 1; i < trail.length; i++) {
          const opacity = 0.05 + (i / trail.length) * 0.6;
          ctx!.beginPath();
          ctx!.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx!.lineTo(trail[i].x, trail[i].y);
          ctx!.strokeStyle = `rgba(220, 60, 60, ${opacity})`;
          ctx!.stroke();
        }
      }

      // Crosshair - only when mouse is inside the canvas area
      if (local.inside) {
        const cx = local.x;
        const cy = local.y;
        const crossSize = 10;

        ctx!.beginPath();
        ctx!.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(220, 60, 60, 0.3)";
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.moveTo(cx - crossSize, cy);
        ctx!.lineTo(cx + crossSize, cy);
        ctx!.moveTo(cx, cy - crossSize);
        ctx!.lineTo(cx, cy + crossSize);
        ctx!.strokeStyle = "rgba(220, 60, 60, 0.7)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      // Click ripples - expanding rings that fade out
      const now = performance.now();
      for (let i = clicks.length - 1; i >= 0; i--) {
        const age = now - clicks[i].t;
        if (age > 600) {
          clicks.splice(i, 1);
          continue;
        }
        const progress = age / 600;
        const radius = 4 + progress * 24;
        const opacity = 0.7 * (1 - progress);

        // Filled dot at impact point
        if (progress < 0.3) {
          ctx!.beginPath();
          ctx!.arc(clicks[i].x, clicks[i].y, 3 * (1 - progress / 0.3), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(220, 60, 60, ${opacity})`;
          ctx!.fill();
        }

        // Expanding ring
        ctx!.beginPath();
        ctx!.arc(clicks[i].x, clicks[i].y, radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(220, 60, 60, ${opacity})`;
        ctx!.lineWidth = 1.5 * (1 - progress);
        ctx!.stroke();
      }

      // Coordinate readout (global viewport position from props)
      ctx!.fillStyle = "rgba(140, 140, 160, 0.5)";
      ctx!.font = "10px monospace";
      ctx!.textAlign = "left";
      ctx!.fillText(
        `cursor: ${Math.round(globalPosRef.current.x)}, ${Math.round(globalPosRef.current.y)}`,
        6,
        h - 8
      );

      // TRACKING label
      ctx!.fillStyle = "rgba(220, 60, 60, 0.4)";
      ctx!.font = "9px monospace";
      ctx!.textAlign = "right";
      ctx!.fillText("TRACKING", w - 8, 14);
      ctx!.textAlign = "left";

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("click", onClick);
    };
    // Stable effect - reads from refs and local variables, never restarts
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[180px] w-full overflow-hidden border border-border bg-background"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
