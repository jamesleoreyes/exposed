"use client";

import { Clock } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { TimezoneLocale as TimezoneLocaleType } from "@/types/fingerprint";

interface Props {
  data: TimezoneLocaleType | null;
  loading: boolean;
}

export function TimezoneLocaleDisplay({ data, loading }: Props) {
  const finding = data
    ? `You're in the ${data.timezone} timezone, your locale is ${data.locale}, and you format dates as ${data.dateFormat}. These preferences reveal your region and cultural context.`
    : "Reading your locale settings...";

  return (
    <CategoryCard
      title="Timezone & Locale"
      icon={<Clock className="size-4" />}
      risk="low"
      loading={loading}
      finding={finding}
      whyItMatters={EXPLANATIONS.timezone}
    >
      {data && (
        <>
          <DataRow
            label="Timezone"
            value={data.timezone}
            tooltip="Your system's timezone, reveals your geographic region"
          />
          <DataRow
            label="UTC Offset"
            value={data.utcOffset}
            tooltip="Your offset from UTC time"
          />
          <DataRow
            label="Locale"
            value={data.locale}
            tooltip="Your locale setting for language and regional formatting"
          />
          <DataRow
            label="Date Format"
            value={data.dateFormat}
            tooltip="How dates are formatted in your locale"
          />
          <DataRow
            label="Number Format"
            value={data.numberFormat}
            tooltip="How numbers are formatted (decimal separator, grouping)"
          />
          <DataRow
            label="Currency Format"
            value={data.currencyFormat}
            tooltip="How currency values are displayed in your locale"
          />
        </>
      )}
    </CategoryCard>
  );
}
