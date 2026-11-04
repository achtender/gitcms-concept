import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, getHeadings, readingTime } from "@repo/content";
import { Badge, Container, Cover, Mdx, PageHeader, Toc } from "@repo/ui";

import { getJournalEntries, getJournalEntry } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getJournalEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.data.title,
    description: entry.data.description,
    openGraph: {
      type: "article",
      title: entry.data.title,
      description: entry.data.description,
      publishedTime: `${entry.data.date}T00:00:00Z`,
      tags: entry.data.tags,
    },
    alternates: { canonical: `/journal/${entry.slug}` },
  };
}

export default async function JournalEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) {
    notFound();
  }

  const headings = getHeadings(entry.body);

  return (
    <article>
      <PageHeader
        eyebrow={entry.data.tags[0] ?? "Journal"}
        title={entry.data.title}
        description={entry.data.description}
        meta={
          <>
            <span>{entry.data.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={entry.data.date}>{formatDate(entry.data.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{readingTime(entry.body)} min read</span>
          </>
        }
      />

      <Container>
        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            {entry.data.cover ? (
              <Cover
                title={entry.data.title}
                image={entry.data.cover}
                seed={entry.slug}
                ratio="wide"
                className="mb-10"
              />
            ) : null}

            <Mdx source={entry.body} />

            {entry.data.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
                <span className="heading-meta text-foreground-lighter">Tags</span>
                {entry.data.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <Toc headings={headings} />
              <div className="border-t border-border pt-4">
                <p className="heading-meta text-foreground-lighter">Published</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatDate(entry.data.date)}
                </p>
                <Link href="/journal" className="text-link mt-4 inline-flex text-xs">
                  ← Back to the journal
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
