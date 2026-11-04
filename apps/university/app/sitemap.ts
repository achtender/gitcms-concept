import type { MetadataRoute } from "next";

import {
  getAuthors,
  getCalendarEvents,
  getHandbookEntries,
  getJournalEntries,
  getPages,
} from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const journal = getJournalEntries();
  const calendar = getCalendarEvents();
  const handbook = getHandbookEntries();
  const authors = getAuthors();
  const pages = getPages();

  const staticRoutes = ["/", "/calendar", "/journal", "/handbook", "/authors"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.7,
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
      priority: 0.8,
    })),
    ...calendar.map((entry) => ({
      url: `${siteUrl}/calendar/${entry.slug}`,
      lastModified: new Date(entry.data.start),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...handbook.map((entry) => ({
      url: `${siteUrl}/handbook/${entry.slug}`,
      lastModified: entry.data.updated ? new Date(entry.data.updated) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...authors.map((author) => ({
      url: `${siteUrl}/authors/${author.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
