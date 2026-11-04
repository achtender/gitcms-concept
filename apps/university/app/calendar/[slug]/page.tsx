import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Mdx, PageHeader } from "@repo/ui";

import { EventClock, EventDate } from "@/components/event-time";
import { getCalendarEvent, getCalendarEvents } from "@/lib/content";
import { settings, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCalendarEvents().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCalendarEvent(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.data.title,
    description: entry.data.description,
    alternates: { canonical: `/calendar/${entry.slug}` },
  };
}

export default async function CalendarEventPage({ params }: Props) {
  const { slug } = await params;
  const entry = getCalendarEvent(slug);

  if (!entry) {
    notFound();
  }

  const isOnline = /^online$/i.test(entry.data.location.trim());
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: entry.data.title,
    description: entry.data.description,
    startDate: entry.data.start,
    ...(entry.data.end ? { endDate: entry.data.end } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": isOnline ? "VirtualLocation" : "Place",
      name: entry.data.location,
    },
    url: `${siteUrl}/calendar/${entry.slug}`,
    organizer: {
      "@type": "Organization",
      name: settings.name,
      url: siteUrl,
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHeader
        eyebrow={`Calendar / ${entry.data.category}`}
        title={entry.data.title}
        description={entry.data.description}
        meta={
          <>
            <EventDate start={entry.data.start} allDay={entry.data.allDay} />
            <span aria-hidden="true">·</span>
            <EventClock
              start={entry.data.start}
              end={entry.data.end}
              allDay={entry.data.allDay}
            />
            <span aria-hidden="true">·</span>
            <span>{entry.data.location}</span>
          </>
        }
      />

      <Container>
        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0">
            <Mdx source={entry.body} />

            <div className="mt-12 border-t border-border pt-6">
              <Link href="/calendar" className="text-link text-sm">
                ← Back to the calendar
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-surface-75 p-5">
              <p className="heading-meta text-foreground-lighter">Event details</p>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-foreground-lighter">Date</dt>
                  <dd className="mt-0.5">
                    <EventDate
                      start={entry.data.start}
                      allDay={entry.data.allDay}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground-lighter">Time</dt>
                  <dd className="mt-0.5">
                    <EventClock
                      start={entry.data.start}
                      end={entry.data.end}
                      allDay={entry.data.allDay}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground-lighter">Location</dt>
                  <dd className="mt-0.5">{entry.data.location}</dd>
                </div>
                {entry.data.audience ? (
                  <div>
                    <dt className="text-xs text-foreground-lighter">Audience</dt>
                    <dd className="mt-0.5">{entry.data.audience}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs text-foreground-lighter">Region</dt>
                  <dd className="mt-0.5">{entry.data.region}</dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground-lighter">Category</dt>
                  <dd className="mt-0.5">{entry.data.category}</dd>
                </div>
              </dl>

              <p className="mt-3 text-xs text-foreground-lighter">
                Times are shown in your local timezone.
              </p>

              {entry.data.registrationUrl ? (
                <a
                  href={entry.data.registrationUrl}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                  target="_blank"
                  rel="noreferrer"
                >
                  Register
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
