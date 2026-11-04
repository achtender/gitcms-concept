import { renderRss } from "@repo/content";

import { getJournalEntries } from "@/lib/content";
import { settings } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const entries = getJournalEntries();
  const xml = renderRss({
    title: `${settings.name} journal`,
    description: settings.description,
    siteUrl: settings.url,
    language: settings.locale,
    items: entries.map((entry) => ({
      title: entry.data.title,
      link: `/journal/${entry.slug}`,
      description: entry.data.description,
      date: entry.data.date,
    })),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
