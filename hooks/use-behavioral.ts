"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { BehavioralSignals } from "@/types/fingerprint";

const MAX_TRAIL = 200;
const MAX_EVENTS = 50;
const UPDATE_INTERVAL = 100;

export function useBehavioral() {
  const [data, setData] = useState<BehavioralSignals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stateRef = useRef<BehavioralSignals>({
    mouseX: 0,
    mouseY: 0,
    mouseTrail: [],
    scrollDepth: 0,
    scrollDepthMax: 0,
    timeOnPage: 0,
    tabVisible: true,
    visibilityChanges: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    clickCount: 0,
    keyPressCount: 0,
    events: [],
  });

  const pushEvent = useCallback((type: string, detail: string) => {
    const s = stateRef.current;
    s.events.push({ type, detail, time: Date.now() });
    if (s.events.length > MAX_EVENTS) {
      s.events.shift();
    }
  }, []);

  useEffect(() => {
    try {
      const s = stateRef.current;

      // Initialize viewport
      s.viewportWidth = window.innerWidth;
      s.viewportHeight = window.innerHeight;
      s.tabVisible = !document.hidden;

      const onMouseMove = (e: MouseEvent) => {
        s.mouseX = e.clientX;
        s.mouseY = e.clientY;
        s.mouseTrail.push({ x: e.clientX, y: e.clientY, t: Date.now() });
        if (s.mouseTrail.length > MAX_TRAIL) {
          s.mouseTrail.shift();
        }
      };

      const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        const depth = Math.round((scrollTop / docHeight) * 100);
        s.scrollDepth = depth;
        if (depth > s.scrollDepthMax) {
          s.scrollDepthMax = depth;
        }
        pushEvent("scroll", `${depth}%`);
      };

      const onVisibilityChange = () => {
        s.tabVisible = !document.hidden;
        s.visibilityChanges++;
        pushEvent("visibility", document.hidden ? "hidden" : "visible");
      };

      const onResize = () => {
        s.viewportWidth = window.innerWidth;
        s.viewportHeight = window.innerHeight;
        pushEvent("resize", `${window.innerWidth}x${window.innerHeight}`);
      };

      const onClick = (e: MouseEvent) => {
        s.clickCount++;
        pushEvent("click", `${e.clientX},${e.clientY}`);
      };

      const onKeyDown = () => {
        s.keyPressCount++;
        pushEvent("keydown", `count:${s.keyPressCount}`);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange);
      window.addEventListener("resize", onResize);
      window.addEventListener("click", onClick);
      window.addEventListener("keydown", onKeyDown);

      // Time on page counter
      const timeInterval = setInterval(() => {
        s.timeOnPage++;
      }, 1000);

      // Sync ref to state for consumers
      const updateInterval = setInterval(() => {
        setData({ ...s, mouseTrail: [...s.mouseTrail], events: [...s.events] });
      }, UPDATE_INTERVAL);

      // Set initial data and mark loaded
      setData({ ...s });
      setLoading(false);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("click", onClick);
        window.removeEventListener("keydown", onKeyDown);
        clearInterval(timeInterval);
        clearInterval(updateInterval);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track behavioral signals");
      setLoading(false);
    }
  }, [pushEvent]);

  return { data, loading, error };
}
