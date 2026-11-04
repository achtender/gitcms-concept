/**
 * Small, dependency-free date and timezone helpers for the calendar. They are
 * imported by both server pages and the client month view, so they must stay
 * free of Node APIs and content-loader imports.
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = MONTHS.map((month) => month.slice(0, 3));

export const CALENDAR_WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export type EventRegion = "EU" | "NA";

export type CalendarEventSummary = {
  slug: string;
  title: string;
  description: string;
  /** ISO date (`YYYY-MM-DD`) for all-day events, ISO instant for timed events. */
  start: string;
  /** ISO instant for timed events, ISO date for all-day events. */
  end?: string;
  allDay: boolean;
  region: EventRegion;
  location: string;
  category: string;
  audience?: string;
  featured: boolean;
};

export type CalendarDay = {
  dateKey: string;
  day: number;
  inMonth: boolean;
};

type EventBoundary = Pick<CalendarEventSummary, "start" | "end" | "allDay">;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isAbsoluteDateTime(value: string) {
  return /^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/.test(value);
}

export function isNaiveDateTime(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value);
}

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function offsetMilliseconds(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return asUtc - date.getTime();
}

/**
 * Turn a wall-clock date-time in an IANA zone into a UTC instant. Two passes
 * are enough to resolve the usual DST boundary cases.
 */
export function zonedDateTimeToUtc(value: string, timeZone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    value,
  );

  if (!match) {
    throw new Error(`Expected a local date-time, received "${value}"`);
  }

  const [, year, month, day, hour, minute, second] = match;
  const wallClock = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? 0),
  );

  let instant = wallClock;
  for (let pass = 0; pass < 2; pass += 1) {
    instant = wallClock - offsetMilliseconds(new Date(instant), timeZone);
  }

  return new Date(instant);
}

function embeddedOffsetMilliseconds(value: string) {
  const match = /([+-])(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return 0;
  }

  const sign = match[1] === "+" ? 1 : -1;
  return sign * (Number(match[2]) * 60 + Number(match[3])) * 60_000;
}

/** Normalize a timed event boundary to a UTC instant. */
export function resolveEventInstant(value: string, timeZone?: string) {
  if (isAbsoluteDateTime(value)) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid event date-time "${value}"`);
    }
    return date.toISOString();
  }

  if (isNaiveDateTime(value)) {
    if (!timeZone) {
      throw new Error(
        `Event date-time "${value}" has no offset. Add an offset or set timeZone.`,
      );
    }
    return zonedDateTimeToUtc(value, timeZone).toISOString();
  }

  throw new Error(`Invalid event date-time "${value}"`);
}

/** Normalize an all-day event boundary to a plain `YYYY-MM-DD` date. */
export function resolveAllDayDate(value: string, timeZone?: string) {
  if (isDateOnly(value)) {
    return value;
  }

  if (isAbsoluteDateTime(value) || isNaiveDateTime(value)) {
    if (isNaiveDateTime(value)) {
      return value.slice(0, 10);
    }

    const date = new Date(value);
    if (timeZone) {
      return toDateKey(date, timeZone);
    }

    return toDateKey(
      new Date(date.getTime() + embeddedOffsetMilliseconds(value)),
      "UTC",
    );
  }

  throw new Error(`Invalid all-day date "${value}"`);
}

/** Local date key in the given zone, e.g. `2026-11-07`. */
export function toDateKey(date: Date, timeZone = "UTC") {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function todayInZone(timeZone = "UTC", now = new Date()) {
  return toDateKey(now, timeZone);
}

export function monthKeyFromDate(date: Date, timeZone = "UTC") {
  return toDateKey(date, timeZone).slice(0, 7);
}

export function parseMonthKey(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return { year, monthIndex: monthNumber - 1 };
}

export function addMonths(month: string, delta: number) {
  const { year, monthIndex } = parseMonthKey(month);
  const date = new Date(Date.UTC(year, monthIndex + delta, 1));
  return monthKeyFromDate(date, "UTC");
}

export function monthLabel(month: string) {
  const { year, monthIndex } = parseMonthKey(month);
  return `${MONTHS[monthIndex]} ${year}`;
}

/** A stable, Monday-first six-week grid for a month. */
export function buildMonthGrid(month: string): CalendarDay[] {
  const { year, monthIndex } = parseMonthKey(month);
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(year, monthIndex, 1 - offset));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return {
      dateKey: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
        date.getUTCDate(),
      )}`,
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === monthIndex,
    };
  });
}

/** Pick the month that makes the calendar most useful on first load. */
export function initialCalendarMonth(eventDates: string[], today: string) {
  const currentMonth = today.slice(0, 7);
  if (eventDates.some((date) => date.startsWith(currentMonth))) {
    return currentMonth;
  }

  const upcoming = eventDates.filter((date) => date >= today).sort();
  if (upcoming[0]) {
    return upcoming[0].slice(0, 7);
  }

  const latest = [...eventDates].sort().at(-1);
  return latest ? latest.slice(0, 7) : currentMonth;
}

/** The calendar day an event belongs to, in the viewer's zone. */
export function eventDateKey(
  event: Pick<CalendarEventSummary, "start" | "allDay">,
  timeZone = "UTC",
) {
  if (event.allDay) {
    return event.start.slice(0, 10);
  }

  return toDateKey(new Date(event.start), timeZone);
}

export function formatDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.weekday} ${values.day} ${values.month}`;
}

export function formatEventDate(
  event: Pick<CalendarEventSummary, "start" | "allDay">,
  timeZone = "UTC",
) {
  return formatDateKey(eventDateKey(event, timeZone));
}

function timeFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export function zoneAbbreviation(start: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(start));

  return (
    parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone
  );
}

/** Just the clock time, used inside tight month-grid cells. */
export function formatEventClock(
  event: Pick<CalendarEventSummary, "start" | "allDay">,
  timeZone = "UTC",
) {
  if (event.allDay) {
    return "All day";
  }

  return timeFormatter(timeZone).format(new Date(event.start));
}

export function formatEventTime(event: EventBoundary, timeZone = "UTC") {
  if (event.allDay) {
    return "All day";
  }

  const start = new Date(event.start);
  const formatter = timeFormatter(timeZone);
  const startText = formatter.format(start);
  const abbreviation = zoneAbbreviation(event.start, timeZone);

  if (!event.end) {
    return `${startText} ${abbreviation}`;
  }

  const end = new Date(event.end);
  const endText = formatter.format(end);
  const crossesDay = toDateKey(start, timeZone) !== toDateKey(end, timeZone);

  return `${startText} – ${endText}${crossesDay ? " (next day)" : ""} ${abbreviation}`;
}

/** Events bucketed by the local date on which they begin. */
export function groupEventsByDate(
  events: CalendarEventSummary[],
  timeZone = "UTC",
) {
  return events.reduce<Record<string, CalendarEventSummary[]>>(
    (groups, event) => {
      const dateKey = eventDateKey(event, timeZone);
      (groups[dateKey] ??= []).push(event);
      return groups;
    },
    {},
  );
}

export function eventsInMonth(
  events: CalendarEventSummary[],
  month: string,
  timeZone = "UTC",
) {
  return events.filter((event) =>
    eventDateKey(event, timeZone).startsWith(month),
  );
}

/** Browser-only helper. Call it from an effect, never during SSR. */
export function getVisitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
