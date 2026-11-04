import type { Metadata } from "next";

import { Container, PageHeader } from "@repo/ui";

import { getCalendarEvents } from "@/lib/content";
import {
  eventDateKey,
  initialCalendarMonth,
  todayInZone,
} from "@/lib/calendar";
import { settings } from "@/lib/site";

import { CalendarView } from "./calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
  description:
    "Lectures, open days, workshops, and student life at Northbridge University.",
};

export default function CalendarPage() {
  const entries = getCalendarEvents();
  const serverToday = todayInZone("UTC");

  const events = entries.map((entry) => ({
    slug: entry.slug,
    title: entry.data.title,
    description: entry.data.description,
    start: entry.data.start,
    end: entry.data.end,
    allDay: entry.data.allDay,
    region: entry.data.region,
    location: entry.data.location,
    category: entry.data.category,
    audience: entry.data.audience,
    featured: entry.data.featured,
  }));

  const initialMonth = initialCalendarMonth(
    events.map((event) => eventDateKey(event, "UTC")),
    serverToday,
  );

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title="What is happening on campus"
        description={`Lectures, open days, workshops, and student life at ${settings.name}. Every event is a Markdown entry in the repository, edited through GitCMS and rendered as a calendar.`}
        meta={
          <>
            <span>{entries.length} events published</span>
            <span aria-hidden="true">·</span>
            <span>Updated when a new event is published</span>
          </>
        }
      />

      <Container>
        <div className="py-12">
          <CalendarView
            events={events}
            initialMonth={initialMonth}
            serverToday={serverToday}
          />
        </div>
      </Container>
    </>
  );
}
