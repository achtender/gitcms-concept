import type { Metadata } from "next";

import { formatDate, readingTime } from "@repo/content";
import { Container, EntryCard, PageHeader } from "@repo/ui";

import { getJournalEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Stories about teaching, research, campus life, and the work of running a small university well.",
};

export default function JournalPage() {
  const entries = getJournalEntries();

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Notes from the quad"
        description="Stories about teaching, research, student life, and the everyday work of a university that stays small on purpose."
        meta={
          <>
            <span>{entries.length} published stories</span>
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
