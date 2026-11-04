import type { Metadata } from "next";
import Link from "next/link";

import { Avatar, Container, PageHeader } from "@repo/ui";

import { getAuthors, getJournalEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Authors",
  description: "The people who write and edit Fieldnote.",
};

export default function AuthorsPage() {
  const authors = getAuthors();
  const journal = getJournalEntries();

  return (
    <>
      <PageHeader
        eyebrow="Authors"
        title="The people behind the notes"
        description="A small editorial team. Every profile and every byline comes from the same content collection."
        meta={<span>{authors.length} contributors</span>}
      />

      <Container>
        <div className="grid gap-5 py-12 sm:grid-cols-2">
          {authors.map((author) => {
            const count = journal.filter(
              (entry) => entry.data.author === author.slug,
            ).length;

            return (
              <article
                key={author.slug}
                className="rounded-lg border border-border bg-surface-75 p-6"
              >
                <div className="flex items-start gap-4">
                  <Avatar
                    name={author.data.name}
                    image={author.data.avatar}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <h2 className="text-base font-medium tracking-tight">
                      <Link
                        href={`/authors/${author.slug}`}
                        className="hover:underline hover:underline-offset-4"
                      >
                        {author.data.name}
                      </Link>
                    </h2>
                    <p className="text-xs text-foreground-lighter">{author.data.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {author.data.bio}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-foreground-lighter">
                    {count} {count === 1 ? "note" : "notes"}
                  </span>
                  <Link
                    href={`/authors/${author.slug}`}
                    className="text-xs font-medium text-primary hover:text-primary-hover"
                  >
                    View profile <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </>
  );
}
