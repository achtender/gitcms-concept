import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, readingTime } from "@repo/content";
import { Avatar, ButtonLink, Container, EntryCard, PageHeader } from "@repo/ui";

import { getAuthor, getAuthors, getJournalEntries } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);

  if (!author) {
    return {};
  }

  return {
    title: author.data.name,
    description: author.data.bio,
    alternates: { canonical: `/authors/${author.slug}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthor(slug);

  if (!author) {
    notFound();
  }

  const entries = getJournalEntries().filter(
    (entry) => entry.data.author === author.slug,
  );

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title={author.data.name}
        description={author.data.bio}
        meta={
          <>
            <span className="inline-flex items-center gap-2">
              <Avatar
                name={author.data.name}
                image={author.data.avatar}
                size="sm"
              />
              {author.data.role}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {entries.length} {entries.length === 1 ? "story" : "stories"}
            </span>
          </>
        }
      />

      <Container>
        <div className="grid gap-10 py-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside>
            <div className="rounded-lg border border-border bg-surface-75 p-5">
              <p className="heading-meta text-foreground-lighter">Links</p>
              <ul className="mt-3 space-y-2">
                {author.data.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      className="text-link text-sm"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-border pt-4">
                <ButtonLink href="/authors" variant="secondary" size="sm">
                  All authors
                </ButtonLink>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <h2 className="heading-section">Published stories</h2>
              <span className="font-mono text-xs text-foreground-lighter">
                {String(entries.length).padStart(2, "0")}
              </span>
            </div>

            {entries.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                Nothing published yet.{" "}
                <Link href="/journal" className="text-link">
                  Browse the journal
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
