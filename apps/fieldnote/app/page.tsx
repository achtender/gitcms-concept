import Link from "next/link";

import { formatDate, readingTime } from "@repo/content";
import {
  Avatar,
  Badge,
  ButtonLink,
  Container,
  Cover,
  EntryCard,
  Section,
  SectionHeading,
} from "@repo/ui";

import {
  getAuthors,
  getHandbookEntries,
  getJournalEntries,
} from "@/lib/content";
import { homepage, settings } from "@/lib/site";

export default function HomePage() {
  const journal = getJournalEntries();
  const handbook = getHandbookEntries();
  const authors = getAuthors();

  const featured = homepage.featured.length > 0
    ? homepage.featured
        .map((slug) => journal.find((entry) => entry.slug === slug))
        .filter((entry): entry is (typeof journal)[number] => Boolean(entry))
    : journal.filter((entry) => entry.data.featured);

  const featuredSlugs = new Set(featured.map((entry) => entry.slug));
  const latest = journal.filter((entry) => !featuredSlugs.has(entry.slug)).slice(0, 3);
  const handbookPreview = handbook.slice(0, 4);

  return (
    <>
      <section className="border-b border-border">
        <Container>
          <div className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="heading-meta text-primary">{homepage.hero.eyebrow}</p>
              <h1 className="display-hero mt-4 max-w-3xl">{homepage.hero.title}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {homepage.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {homepage.hero.actions.map((action) => (
                  <ButtonLink
                    key={action.href}
                    href={action.href}
                    variant={action.variant}
                  >
                    {action.label}
                  </ButtonLink>
                ))}
              </div>
            </div>

            {homepage.panel ? (
              <aside className="rounded-lg border border-border bg-surface-75 p-5">
                <Cover
                  title={homepage.panel.title}
                  seed={homepage.panel.href}
                  ratio="wide"
                />
                <p className="heading-meta mt-5 text-foreground-lighter">
                  {homepage.panel.label}
                </p>
                <h2 className="mt-2 text-base font-medium tracking-tight">
                  {homepage.panel.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {homepage.panel.body}
                </p>
                <Link
                  href={homepage.panel.href}
                  className="mt-4 inline-flex text-sm font-medium text-primary hover:text-primary-hover"
                >
                  {homepage.panel.linkLabel} <span aria-hidden="true">→</span>
                </Link>
              </aside>
            ) : null}
          </div>

          <dl className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
            {[
              { label: "Journal notes", value: journal.length },
              { label: "Handbook chapters", value: handbook.length },
              { label: "Contributors", value: authors.length },
            ].map((stat) => (
              <div key={stat.label} className="bg-background py-4 sm:px-5">
                <dt className="heading-meta text-foreground-lighter">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-medium tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading
            title="Featured notes"
            description="Longer pieces on craft, process, and the tools we keep returning to."
            action={{ label: "All journal entries", href: "/journal" }}
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {featured.map((entry) => (
              <EntryCard
                key={entry.slug}
                href={`/journal/${entry.slug}`}
                title={entry.data.title}
                description={entry.data.description}
                badge={entry.data.category}
                meta={`${formatDate(entry.data.date)} · ${readingTime(entry.body)} min read`}
                image={entry.data.cover}
                seed={entry.slug}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface-75">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading title="Latest from the notebook" />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Short observations and working notes. The journal is written slowly, so
                new entries arrive when they are ready.
              </p>
              <ButtonLink href="/journal" variant="secondary" size="sm" className="mt-5">
                Browse the archive
              </ButtonLink>
            </div>

            <ul className="divide-y divide-border border-y border-border">
              {latest.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/journal/${entry.slug}`}
                    className="group grid gap-2 py-5 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <time
                      dateTime={entry.data.date}
                      className="font-mono text-xs text-foreground-lighter"
                    >
                      {formatDate(entry.data.date)}
                    </time>
                    <span>
                      <span className="block text-sm font-medium text-foreground group-hover:underline group-hover:decoration-foreground-muted/50 group-hover:underline-offset-4">
                        {entry.data.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {entry.data.description}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden text-sm text-foreground-lighter sm:block"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading title="The handbook" />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                How the studio works: editorial process, writing standards, and the
                checklists we actually use.
              </p>
              <ButtonLink href="/handbook" variant="secondary" size="sm" className="mt-5">
                Open the handbook
              </ButtonLink>
            </div>

            <ol className="divide-y divide-border border-y border-border">
              {handbookPreview.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/handbook/${entry.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-4"
                  >
                    <span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-foreground-lighter">
                        {entry.data.section}
                      </span>
                      <span className="mt-1 block text-sm font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                        {entry.data.title}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-sm text-foreground-lighter">
                      {String(entry.data.order).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <SectionHeading
            title="Written by"
            description={`The people behind ${settings.name}.`}
            action={{ label: "Author profiles", href: "/authors" }}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {authors.map((author) => (
              <div
                key={author.slug}
                className="flex items-start gap-4 rounded-lg border border-border bg-surface-75 p-5"
              >
                <Avatar name={author.data.name} image={author.data.avatar} size="lg" />
                <div>
                  <p className="text-sm font-medium">{author.data.name}</p>
                  <p className="text-xs text-foreground-lighter">{author.data.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {author.data.bio}
                  </p>
                  <Link
                    href={`/authors/${author.slug}`}
                    className="mt-3 inline-flex text-xs font-medium text-primary hover:text-primary-hover"
                  >
                    View profile <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border-strong p-5">
            <Badge variant="primary">Try it</Badge>
            <p className="text-sm text-muted-foreground">
              Every page on this site is generated from Markdown and JSON in the
              repository. Edit it with GitCMS, publish with a pull request.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
