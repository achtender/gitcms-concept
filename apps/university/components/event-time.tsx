"use client";

import { useEffect, useState } from "react";

import {
  formatEventDate,
  formatEventTime,
  getVisitorTimeZone,
  type CalendarEventSummary,
} from "@/lib/calendar";

type EventWhen = Pick<CalendarEventSummary, "start" | "end" | "allDay">;

/**
 * The server cannot know the visitor's timezone, so these components render in
 * UTC first (the SSR-safe value) and switch to the browser's zone after mount.
 */
function useVisitorTimeZone() {
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    setTimeZone(getVisitorTimeZone());
  }, []);

  return timeZone;
}

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
