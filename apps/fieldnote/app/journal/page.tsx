import type { Metadata } from "next";

import { formatDate, readingTime } from "@repo/content";
import { Container, EntryCard, PageHeader } from "@repo/ui";

import { getJournalEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Long-form notes on software craft, design systems, editorial process, and the tools we keep returning to.",
};

export default function JournalPage() {
  const entries = getJournalEntries();

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Notes from the field"
        description="Long-form pieces on software craft, design systems, and the quiet work of shipping things that last."
        meta={
          <>
            <span>{entries.length} published notes</span>
            <span aria-hidden="true">·</span>
            <a href="/rss.xml" className="text-link">
              RSS feed
            </a>
          </>
        }
      />

      <Container>
        <div className="grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.slug}
              href={`/journal/${entry.slug}`}
              title={entry.data.title}
              description={entry.data.description}
              badge={entry.data.category}
              meta={`${formatDate(entry.data.date)} · ${readingTime(entry.body)} min`}
              image={entry.data.cover}
              seed={entry.slug}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
