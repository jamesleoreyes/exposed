"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const cycle = { dark: "light", light: "system", system: "dark" } as const;

const icons = {
  dark: Moon,
  light: Sun,
  system: Monitor,
} as const;

const labels = {
  dark: "Switch to light mode",
  light: "Switch to system mode",
  system: "Switch to dark mode",
} as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return <div className="size-4" />;
  }

  const current = (theme as keyof typeof cycle) ?? "dark";
  const Icon = icons[current] ?? Moon;

  return (
    <button
      onClick={() => setTheme(cycle[current] ?? "dark")}
      className="text-muted-foreground hover:text-foreground cursor-pointer"
      aria-label={labels[current] ?? "Switch theme"}
      title={labels[current] ?? "Switch theme"}
    >
      <Icon className="size-4" />
    </button>
  );
}
