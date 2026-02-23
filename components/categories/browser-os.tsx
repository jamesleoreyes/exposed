"use client";

import { Monitor } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { DataRow } from "@/components/categories/data-row";
import { EXPLANATIONS } from "@/lib/explanations";
import type { BrowserInfo } from "@/types/fingerprint";

interface Props {
  data: BrowserInfo | null;
  loading: boolean;
}

export function BrowserOs({ data, loading }: Props) {
  const finding = data
    ? `You're using ${data.browserName || "an unknown browser"} ${data.browserVersion || ""} on ${data.os || "an unknown OS"}. This combination, along with ${data.languages.length} language preference${data.languages.length !== 1 ? "s" : ""}, helps narrow down who you are.`
    : "Identifying your browser...";

  return (
    <CategoryCard
      title="Browser & OS"
      icon={<Monitor className="size-4" />}
      risk="medium"
      finding={finding}
      loading={loading}
      whyItMatters={EXPLANATIONS.browser}
    >
      {data && (
        <>
          <DataRow
            label="User Agent"
            value={data.userAgent}
            tooltip="The full identity string your browser sends with every request"
          />
          <DataRow
            label="Browser"
            value={data.browserName}
            tooltip="The browser application you are using"
          />
          <DataRow
            label="Browser Version"
            value={data.browserVersion}
            tooltip="Your browser's exact version number, which narrows your identity"
          />
          <DataRow
            label="Operating System"
            value={data.os}
            tooltip="The operating system running on your device"
          />
          <DataRow
            label="OS Version"
            value={data.osVersion}
            tooltip="Your OS version reveals how recently you update your system"
          />
          <DataRow
            label="Platform"
            value={data.platform}
            tooltip="The hardware platform or architecture of your device"
          />
          <DataRow
            label="Vendor"
            value={data.vendor}
            tooltip="The browser engine vendor (e.g., Google Inc.)"
          />
          <DataRow
            label="Languages"
            value={data.languages}
            tooltip="Your preferred language settings reveal nationality and background"
          />
          <DataRow
            label="Cookies Enabled"
            value={data.cookieEnabled}
            tooltip="Whether your browser accepts cookies"
          />
          <DataRow
            label="Do Not Track"
            value={data.doNotTrack}
            tooltip="Ironically, enabling DNT makes you more identifiable since few users enable it"
          />
          <DataRow
            label="PDF Viewer"
            value={data.pdfViewerEnabled}
            tooltip="Whether your browser has a built-in PDF viewer"
          />
          <DataRow
            label="WebDriver"
            value={data.webdriver}
            tooltip="Indicates if the browser is controlled by automation (e.g., Selenium)"
          />
        </>
      )}
    </CategoryCard>
  );
}
