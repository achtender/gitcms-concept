"use client";

import {
  formatEventDate,
  formatEventTime,
  type CalendarEventSummary,
} from "@/lib/calendar";

import { useVisitorTimeZone } from "./use-visitor-environment";

type EventWhen = Pick<CalendarEventSummary, "start" | "end" | "allDay">;

export function EventDate({
  start,
  allDay,
  className,
}: Pick<EventWhen, "start" | "allDay"> & { className?: string }) {
  const timeZone = useVisitorTimeZone();

  return (
    <time dateTime={start} className={className}>
      {formatEventDate({ start, allDay }, timeZone)}
    </time>
  );
}

export function EventClock({
  start,
  end,
  allDay,
  className,
}: EventWhen & { className?: string }) {
  const timeZone = useVisitorTimeZone();

  return (
    <span className={className}>
      {formatEventTime({ start, end, allDay }, timeZone)}
    </span>
  );
}
