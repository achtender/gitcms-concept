"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useHasMounted, useVisitorTimeZone } from "@/components/use-visitor-environment";
import {
  CALENDAR_WEEKDAYS,
  addMonths,
  buildMonthGrid,
  eventDateKey,
  eventsInMonth,
  formatEventClock,
  formatEventDate,
  formatEventTime,
  groupEventsByDate,
  initialCalendarMonth,
  monthLabel,
  todayInZone,
  type CalendarEventSummary,
  type EventRegion,
} from "@/lib/calendar";

type RegionFilter = "all" | EventRegion;

const REGION_OPTIONS: { value: RegionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "EU", label: "EU" },
  { value: "NA", label: "NA" },
];

export function CalendarView({
  events,
  initialMonth,
  serverToday,
}: {
  events: CalendarEventSummary[];
  initialMonth: string;
  serverToday: string;
}) {
  const [month, setMonth] = useState(initialMonth);
  const timeZone = useVisitorTimeZone();
  const [region, setRegion] = useState<RegionFilter>("all");
  const hasMounted = useHasMounted();
  const adjustedMonth = useRef(false);

  useEffect(() => {
    if (!hasMounted || adjustedMonth.current) {
      return;
    }

    adjustedMonth.current = true;
    setMonth(
      initialCalendarMonth(
        events.map((event) => eventDateKey(event, timeZone)),
        todayInZone(timeZone),
      ),
    );
  }, [events, hasMounted, timeZone]);

  const visibleEvents = useMemo(
    () =>
      region === "all"
        ? events
        : events.filter((event) => event.region === region),
    [events, region],
  );

  const days = useMemo(() => buildMonthGrid(month), [month]);
  const eventsByDate = useMemo(
    () => groupEventsByDate(visibleEvents, timeZone),
    [visibleEvents, timeZone],
  );
  const monthEvents = useMemo(
    () => eventsInMonth(visibleEvents, month, timeZone),
    [visibleEvents, month, timeZone],
  );

  const today = hasMounted ? todayInZone(timeZone) : serverToday;
  const currentMonth = today.slice(0, 7);
  const isCurrentMonth = month === currentMonth;
  const regionDescription = region === "all" ? "all regions" : `${region} events`;

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-border pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="heading-meta text-primary">Month view</p>
            <h2 className="display-section mt-2 text-3xl" aria-live="polite">
              {monthLabel(month)}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {monthEvents.length === 0
                ? `No ${regionDescription} scheduled this month.`
                : `${monthEvents.length} ${
                    monthEvents.length === 1 ? "event" : "events"
                  } for ${regionDescription} this month.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMonth((value) => addMonths(value, -1))}
              className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => setMonth(currentMonth)}
              disabled={isCurrentMonth}
              className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              This month
            </button>
            <button
              type="button"
              onClick={() => setMonth((value) => addMonths(value, 1))}
              className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="heading-meta text-foreground-lighter">Region</span>
          {REGION_OPTIONS.map((option) => {
            const isActive = region === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRegion(option.value)}
                aria-pressed={isActive}
                className={
                  isActive
                    ? "rounded-md bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground"
                    : "rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                }
              >
                {option.label}
              </button>
            );
          })}
          <span className="ml-auto text-xs text-foreground-lighter">
            {hasMounted
              ? `Times shown in ${timeZone}.`
              : "Detecting your timezone…"}
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[44rem]">
          <div className="grid grid-cols-7 border-l border-t border-border">
            {CALENDAR_WEEKDAYS.map((weekday) => (
              <div
                key={weekday}
                className="border-b border-r border-border bg-surface-100 px-2 py-2 font-mono text-[11px] uppercase tracking-wider text-foreground-lighter"
              >
                {weekday}
              </div>
            ))}

            {days.map((day) => {
              const dayEvents = eventsByDate[day.dateKey] ?? [];
              const isToday = day.dateKey === today;
              const extra = dayEvents.length - 3;

              return (
                <div
                  key={day.dateKey}
                  className={
                    day.inMonth
                      ? "min-h-28 border-b border-r border-border bg-background p-1.5"
                      : "min-h-28 border-b border-r border-border bg-surface-75 p-1.5"
                  }
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        isToday
                          ? "inline-flex size-6 items-center justify-center rounded-full bg-primary font-mono text-xs text-primary-foreground"
                          : day.inMonth
                            ? "inline-flex size-6 items-center justify-center font-mono text-xs text-foreground"
                            : "inline-flex size-6 items-center justify-center font-mono text-xs text-foreground-lighter"
                      }
                    >
                      {day.day}
                    </span>
                    {extra > 0 ? (
                      <span className="font-mono text-[10px] text-foreground-lighter">
                        +{extra}
                      </span>
                    ) : null}
                  </div>

                  {dayEvents.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <li key={event.slug}>
                          <Link
                            href={`/calendar/${event.slug}`}
                            title={`${event.title} · ${formatEventTime(
                              event,
                              timeZone,
                            )}`}
                            className="block rounded-sm border border-primary/20 bg-primary/5 px-1.5 py-1 text-[11px] leading-tight text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
                          >
                            <span className="font-mono text-[10px] text-foreground-lighter">
                              {formatEventClock(event, timeZone)}{" "}
                            </span>
                            <span className="line-clamp-2">{event.title}</span>
                          </Link>
                        </li>
                      ))}
                      {extra > 0 ? (
                        <li className="px-1 text-[10px] text-foreground-lighter">
                          {extra} more below
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-foreground-lighter">
        On small screens the month grid scrolls horizontally. The agenda below
        lists every event in the selected month, converted to your timezone.
      </p>

      <section className="mt-10">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h3 className="heading-section">
            {region === "all" ? "Events" : `${region} events`} in{" "}
            {monthLabel(month)}
          </h3>
          <span className="font-mono text-xs text-foreground-lighter">
            {String(monthEvents.length).padStart(2, "0")}
          </span>
        </div>

        {monthEvents.length > 0 ? (
          <ol className="divide-y divide-border">
            {monthEvents.map((event) => (
              <li key={event.slug}>
                <Link
                  href={`/calendar/${event.slug}`}
                  className="group grid gap-2 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6"
                >
                  <span>
                    <time
                      dateTime={event.start}
                      className="block font-mono text-xs uppercase tracking-wider text-foreground-lighter"
                    >
                      {formatEventDate(event, timeZone)}
                    </time>
                    <span className="mt-1 block text-xs text-foreground-lighter">
                      {formatEventTime(event, timeZone)}
                    </span>
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                        {event.category}
                      </span>
                      <span className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground-lighter">
                        {event.region}
                      </span>
                      {event.featured ? (
                        <span className="rounded-sm border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                          Featured
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                      {event.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </span>
                    <span className="mt-2 block text-xs text-foreground-lighter">
                      {event.location}
                      {event.audience ? ` · ${event.audience}` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            There are no {regionDescription} in this month. Use the month
            controls above to look ahead, choose another region, or select{" "}
            <strong>This month</strong> to return to today.
          </p>
        )}
      </section>
    </div>
  );
}
