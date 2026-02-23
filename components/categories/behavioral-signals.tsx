"use client";

import { MousePointer } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import { MouseTracker } from "@/components/behavioral/mouse-tracker";
import { ActivityFeed } from "@/components/behavioral/activity-feed";
import type { BehavioralSignals as BehavioralSignalsType } from "@/types/fingerprint";

interface Props {
  data: BehavioralSignalsType | null;
  loading: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export function BehavioralSignalsDisplay({ data, loading }: Props) {
  const finding = data
    ? `We're tracking your every move right now. ${data.clickCount} click${data.clickCount !== 1 ? "s" : ""}, ${data.keyPressCount} keystroke${data.keyPressCount !== 1 ? "s" : ""}, scrolled ${data.scrollDepthMax}% of the page, and ${data.visibilityChanges} tab switch${data.visibilityChanges !== 1 ? "es" : ""}. Your mouse trail is being recorded below.`
    : "Monitoring your behavior...";

  return (
    <CategoryCard
      title="Behavioral Signals"
      icon={<MousePointer className="size-4" />}
      risk="high"
      loading={loading}
      finding={finding}
      whyItMatters={EXPLANATIONS.behavioral}
    >
      {data && (
        <>
          <DataRow
            label="Time on Page"
            value={formatTime(data.timeOnPage)}
            tooltip="How long you have been on this page"
          />
          <DataRow
            label="Mouse Position"
            value={`${data.mouseX}, ${data.mouseY}`}
            tooltip="Your current cursor position on the page"
          />
          <DataRow
            label="Scroll Depth"
            value={`${data.scrollDepth}% (max: ${data.scrollDepthMax}%)`}
            tooltip="How far down the page you have scrolled"
          />
          <DataRow
            label="Visibility Changes"
            value={data.visibilityChanges}
            tooltip="How many times you switched tabs or minimized the window"
          />
          <DataRow
            label="Click Count"
            value={data.clickCount}
            tooltip="Total number of clicks recorded on this page"
          />
          <DataRow
            label="Key Press Count"
            value={data.keyPressCount}
            tooltip="Total number of key presses recorded on this page"
          />
          <DataRow
            label="Viewport Size"
            value={`${data.viewportWidth}x${data.viewportHeight}`}
            tooltip="Your browser window's visible area dimensions"
          />

          <div className="mt-4 space-y-3">
            <MouseTracker
              mouseTrail={data.mouseTrail}
              mouseX={data.mouseX}
              mouseY={data.mouseY}
            />
            <ActivityFeed events={data.events} />
          </div>
        </>
      )}
    </CategoryCard>
  );
}
