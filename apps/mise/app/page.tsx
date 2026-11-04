import Link from "next/link";

import { formatDate, readingTime } from "@repo/content";
import {
  Badge,
  ButtonLink,
  Container,
  Cover,
  Section,
  SectionHeading,
} from "@repo/ui";

import { getJournalEntries, getLocations, getMenuItems } from "@/lib/content";
import { formatPrice, homepage, settings } from "@/lib/site";

export default function HomePage() {
  const menu = getMenuItems();
  const journal = getJournalEntries();
  const locations = getLocations();

  const featuredMenu = homepage.featuredMenu.length > 0
    ? homepage.featuredMenu
        .map((slug) => menu.find((item) => item.slug === slug))
        .filter((item): item is (typeof menu)[number] => Boolean(item))
    : menu.filter((item) => item.data.featured);

  const featuredJournal =
    journal.find((entry) => entry.slug === homepage.featuredJournal[0]) ??
    journal[0];

  const featuredLocations = homepage.locations
    .map((slug) => locations.find((location) => location.slug === slug))
    .filter((location): location is (typeof locations)[number] => Boolean(location));

  const mainLocation = locations.find((location) => location.data.featured) ?? locations[0];

  return (
    <>
      <section className="border-b border-border">
        <Container>
          <div className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
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

            <aside className="rounded-lg border border-border bg-surface-75 p-5">
              <Cover title="Mise counter" seed="mise-counter" ratio="wide" />
              <p className="heading-meta mt-5 text-foreground-lighter">Opening hours</p>
              <dl className="mt-3 space-y-2">
                {homepage.hours.map((row) => (
                  <div
                    key={row.days}
                    className="flex items-baseline justify-between gap-4 border-b border-border pb-2 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-muted-foreground">{row.days}</dt>
                    <dd className="font-mono text-xs text-foreground">{row.hours}</dd>
                  </div>
                ))}
              </dl>
              {mainLocation ? (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-medium">{mainLocation.data.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {mainLocation.data.street}, {mainLocation.data.city}
                  </p>
                </div>
              ) : null}
              <Link
                href="/locations"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:text-primary-hover"
              >
                Both locations <span aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading
            title="On the counter"
            description="A short menu that changes with the market. These are the things we make most often."
            action={{ label: "Full menu", href: "/menu" }}
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredMenu.map((item) => (
              <article
                key={item.slug}
                className="flex flex-col rounded-lg border border-border bg-surface-75 p-5"
              >
                <Cover
                  title={item.data.title}
                  seed={item.slug}
                  ratio="wide"
                  className="mb-4"
                />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="heading-meta text-foreground-lighter">
                    {item.data.category}
                  </p>
                  <p className="font-mono text-xs text-foreground">
                    {formatPrice(item.data.price)}
                  </p>
                </div>
                <h3 className="mt-2 text-base font-medium tracking-tight">
                  {item.data.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.data.description}
                </p>
                {item.data.dietary.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.data.dietary.map((diet) => (
                      <Badge key={diet}>{diet}</Badge>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {featuredJournal ? (
        <Section className="border-y border-border bg-surface-75">
          <Container>
            <SectionHeading
              title="From the journal"
              description="Notes from the kitchen, the room, and whatever is on the bar this week."
              action={{ label: "All entries", href: "/journal" }}
            />

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <Cover
                title={featuredJournal.data.title}
                seed={featuredJournal.slug}
                image={featuredJournal.data.cover}
                ratio="wide"
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="primary">{featuredJournal.data.tags[0] ?? "Journal"}</Badge>
                  <time
                    dateTime={featuredJournal.data.date}
                    className="font-mono text-xs text-foreground-lighter"
                  >
                    {formatDate(featuredJournal.data.date)}
                  </time>
                  <span className="text-xs text-foreground-lighter">
                    {readingTime(featuredJournal.body)} min read
                  </span>
                </div>
                <h3 className="display-section mt-4 text-3xl">{featuredJournal.data.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {featuredJournal.data.description}
                </p>
                <ButtonLink
                  href={`/journal/${featuredJournal.slug}`}
                  variant="secondary"
                  size="sm"
                  className="mt-6"
                >
                  Read the note
                </ButtonLink>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <SectionHeading
            title="Two rooms"
            description="One kitchen, two counters. Both are for sitting, not just for passing through."
            action={{ label: "Locations and hours", href: "/locations" }}
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {featuredLocations.map((location) => (
              <article
                key={location.slug}
                className="rounded-lg border border-border bg-surface-75 p-6"
              >
                <p className="heading-meta text-foreground-lighter">
                  {location.data.neighborhood}
                </p>
                <h3 className="mt-2 text-base font-medium tracking-tight">
                  {location.data.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {location.body.split("\n")[0]}
                </p>
                <dl className="mt-4 space-y-1.5 border-t border-border pt-4">
                  {location.data.hours.map((row) => (
                    <div key={row.days} className="flex justify-between gap-4 text-sm">
                      <dt className="text-muted-foreground">{row.days}</dt>
                      <dd className="font-mono text-xs text-foreground">{row.hours}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-foreground-lighter">
                  {location.data.street}, {location.data.city}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed border-border-strong p-5">
            <p className="text-sm text-muted-foreground">
              {settings.name} is an example site running on the same monorepo as a
              journal and a shared design system.
            </p>
            <ButtonLink href="/about" variant="ghost" size="sm">
              About the project
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
