"use client";

import { useRef, useEffect } from "react";

interface MouseTrackerProps {
  mouseTrail: Array<{ x: number; y: number; t: number }>;
  mouseX: number;
  mouseY: number;
}

export function MouseTracker({
  mouseTrail,
  mouseX,
  mouseY,
}: MouseTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      const rect = container!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw trail - surveillance red, fading from transparent to visible
      if (mouseTrail.length > 1) {
        for (let i = 1; i < mouseTrail.length; i++) {
          const opacity = 0.05 + (i / mouseTrail.length) * 0.6;
          ctx!.beginPath();
          ctx!.moveTo(mouseTrail[i - 1].x, mouseTrail[i - 1].y);
          ctx!.lineTo(mouseTrail[i].x, mouseTrail[i].y);
          ctx!.strokeStyle = `rgba(220, 60, 60, ${opacity})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }

      // Crosshair at current position
      const cx = mouseX;
      const cy = mouseY;
      const crossSize = 10;

      // Outer targeting circle
      ctx!.beginPath();
      ctx!.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(220, 60, 60, 0.3)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // Crosshair lines
      ctx!.beginPath();
      ctx!.moveTo(cx - crossSize, cy);
      ctx!.lineTo(cx + crossSize, cy);
      ctx!.moveTo(cx, cy - crossSize);
      ctx!.lineTo(cx, cy + crossSize);
      ctx!.strokeStyle = "rgba(220, 60, 60, 0.7)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // Coordinates - bottom left, monospace, dim
      ctx!.fillStyle = "rgba(140, 140, 160, 0.5)";
      ctx!.font = "10px monospace";
      ctx!.fillText(
        `cursor: ${Math.round(mouseX)}, ${Math.round(mouseY)}`,
        6,
        canvas!.height - 8
      );

      // "RECORDING" label top-right
      ctx!.fillStyle = "rgba(220, 60, 60, 0.4)";
      ctx!.font = "9px monospace";
      ctx!.textAlign = "right";
      ctx!.fillText("TRACKING", canvas!.width - 8, 14);
      ctx!.textAlign = "left";

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [mouseTrail, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative h-[180px] w-full overflow-hidden border border-border bg-background"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
