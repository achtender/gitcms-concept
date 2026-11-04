import type { Metadata } from "next";

import { formatDate, readingTime } from "@repo/content";
import { Container, EntryCard, PageHeader } from "@repo/ui";

import { getJournalEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the Mise kitchen and the two rooms.",
};

export default function JournalPage() {
  const entries = getJournalEntries();

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Notes from the café"
        description="Menu changes, small renovations, and the occasional argument about the spiced drink."
        meta={
          <>
            <span>{entries.length} entries</span>
            <span aria-hidden="true">·</span>
            <a href="/rss.xml" className="text-link">
              RSS feed
            </a>
          </>
        }
      />

      <Container>
        <div className="grid gap-5 py-12 sm:grid-cols-2">
          {entries.map((entry) => (
            <EntryCard
              key={entry.slug}
              href={`/journal/${entry.slug}`}
              title={entry.data.title}
              description={entry.data.description}
              badge={entry.data.tags[0]}
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
