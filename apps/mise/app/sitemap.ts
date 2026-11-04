import type { MetadataRoute } from "next";

import { getJournalEntries, getLocations, getPages } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const journal = getJournalEntries();
  const locations = getLocations();
  const pages = getPages();

  return [
    ...["/", "/menu", "/journal", "/locations"].map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
    ...locations.map((location) => ({
      url: `${siteUrl}/locations#${location.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...pages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: page.data.updated ? new Date(page.data.updated) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...journal.map((entry) => ({
      url: `${siteUrl}/journal/${entry.slug}`,
      lastModified: new Date(entry.data.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
