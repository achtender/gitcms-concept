import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, getHeadings } from "@repo/content";
import { Container, Mdx, PageHeader, Toc } from "@repo/ui";

import { getHandbookEntries, getHandbookEntry } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getHandbookEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getHandbookEntry(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.data.title,
    description: entry.data.description,
    alternates: { canonical: `/handbook/${entry.slug}` },
  };
}

export default async function HandbookEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getHandbookEntry(slug);

  if (!entry) {
    notFound();
  }

  const headings = getHeadings(entry.body);
  const siblings = getHandbookEntries().filter(
    (candidate) => candidate.data.section === entry.data.section,
  );

  return (
    <article>
      <PageHeader
        eyebrow={`Student handbook / ${entry.data.section}`}
        title={entry.data.title}
        description={entry.data.description}
        meta={
          <>
            <span>Chapter {String(entry.data.order).padStart(2, "0")}</span>
            {entry.data.updated ? (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {formatDate(entry.data.updated)}</span>
              </>
            ) : null}
          </>
        }
      />

      <Container>
        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            <Mdx source={entry.body} />

            <div className="mt-12 border-t border-border pt-6">
              <Link href="/handbook" className="text-link text-sm">
                ← All handbook chapters
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-8">
              <Toc headings={headings} />
              <nav aria-label="Chapters in this section">
                <p className="heading-meta text-foreground-lighter">
                  {entry.data.section}
                </p>
                <ul className="mt-3 space-y-2">
                  {siblings.map((sibling) => (
                    <li key={sibling.slug}>
                      <Link
                        href={`/handbook/${sibling.slug}`}
                        aria-current={sibling.slug === entry.slug ? "page" : undefined}
                        className={
                          sibling.slug === entry.slug
                            ? "text-sm font-medium text-foreground"
                            : "text-sm text-muted-foreground transition-colors hover:text-foreground"
                        }
                      >
                        {sibling.data.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
