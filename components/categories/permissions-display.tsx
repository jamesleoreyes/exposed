"use client";

import { Shield } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { PermissionInfo } from "@/types/fingerprint";

interface Props {
  data: PermissionInfo[] | null;
  loading: boolean;
}

function formatPermissionName(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PermissionsDisplay({ data, loading }: Props) {
  const grantedCount = data ? data.filter(p => p.state === "granted").length : 0;
  const deniedCount = data ? data.filter(p => p.state === "denied").length : 0;
  const finding = data
    ? grantedCount > 0
      ? `You've granted ${grantedCount} permission${grantedCount !== 1 ? "s" : ""} to other sites. Each "granted" or "denied" state reveals something about how you use the web.`
      : `You've denied all ${deniedCount} permissions we checked — but even that pattern of denials is a distinguishing signal about you.`
    : "Querying your permission states...";

  return (
    <CategoryCard
      title="Permissions"
      icon={<Shield className="size-4" />}
      risk="medium"
      loading={loading}
      finding={finding}
      whyItMatters={EXPLANATIONS.permissions}
    >
      {data && (
        <>
          {data.map((perm) => (
            <DataRow
              key={perm.name}
              label={formatPermissionName(perm.name)}
              value={perm.state}
              tooltip={`The "${perm.name}" permission is currently "${perm.state}" — this state can be used to distinguish your browser from others.`}
            />
          ))}
        </>
      )}
    </CategoryCard>
  );
}
