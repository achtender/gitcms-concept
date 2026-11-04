import path from "node:path";

import { loadCollection, loadEntry } from "@repo/content";
import type { z } from "zod";

import {
  eventDateKey,
  resolveAllDayDate,
  resolveEventInstant,
  todayInZone,
} from "./calendar";
import {
  authorFrontmatter,
  calendarFrontmatter,
  handbookFrontmatter,
  journalFrontmatter,
  pageFrontmatter,
} from "./schemas";

type CalendarData = z.infer<typeof calendarFrontmatter>;

function normalizeCalendarData(data: CalendarData): CalendarData {
  return {
    ...data,
    start: data.allDay
      ? resolveAllDayDate(data.start, data.timeZone)
      : resolveEventInstant(data.start, data.timeZone),
    end: data.end
      ? data.allDay
        ? resolveAllDayDate(data.end, data.timeZone)
        : resolveEventInstant(data.end, data.timeZone)
      : undefined,
  };
}

const contentRoot = path.join(process.cwd(), "content");

export function getJournalEntries() {
  return loadCollection({
    directory: path.join(contentRoot, "journal"),
    schema: journalFrontmatter,
  })
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export function getJournalEntry(slug: string) {
  const entry = loadEntry({
    directory: path.join(contentRoot, "journal"),
    slug,
    schema: journalFrontmatter,
  });
  return entry && !entry.data.draft ? entry : null;
}

export function getCalendarEvents() {
  return loadCollection({
    directory: path.join(contentRoot, "calendar"),
    schema: calendarFrontmatter,
  })
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({
      ...entry,
      data: normalizeCalendarData(entry.data),
    }))
    .sort(
      (a, b) =>
        Date.parse(a.data.start) - Date.parse(b.data.start) ||
        a.data.title.localeCompare(b.data.title),
    );
}

export function getCalendarEvent(slug: string) {
  const entry = loadEntry({
    directory: path.join(contentRoot, "calendar"),
    slug,
    schema: calendarFrontmatter,
  });
  return entry && !entry.data.draft
    ? { ...entry, data: normalizeCalendarData(entry.data) }
    : null;
}

/** Events on or after today, in calendar order. Used by the homepage. */
export function getUpcomingCalendarEvents(from = new Date()) {
  const today = todayInZone("UTC", from);
  return getCalendarEvents().filter(
    (entry) => eventDateKey(entry.data, "UTC") >= today,
  );
}

export function getAuthors() {
  return loadCollection({
    directory: path.join(contentRoot, "authors"),
    schema: authorFrontmatter,
  }).sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export function getAuthor(slug: string) {
  return loadEntry({
    directory: path.join(contentRoot, "authors"),
    slug,
    schema: authorFrontmatter,
  });
}

export function getHandbookEntries() {
  return loadCollection({
    directory: path.join(contentRoot, "handbook"),
    schema: handbookFrontmatter,
  }).sort(
    (a, b) =>
      a.data.section.localeCompare(b.data.section) || a.data.order - b.data.order,
  );
}

export function getHandbookEntry(slug: string) {
  return loadEntry({
    directory: path.join(contentRoot, "handbook"),
    slug,
    schema: handbookFrontmatter,
  });
}

export function getPages() {
  return loadCollection({
    directory: path.join(contentRoot, "pages"),
    schema: pageFrontmatter,
  });
}

export function getPage(slug: string) {
  return loadEntry({
    directory: path.join(contentRoot, "pages"),
    slug,
    schema: pageFrontmatter,
  });
}

export type JournalEntry = ReturnType<typeof getJournalEntries>[number];
export type CalendarEntry = ReturnType<typeof getCalendarEvents>[number];
export type AuthorEntry = ReturnType<typeof getAuthors>[number];
export type HandbookEntry = ReturnType<typeof getHandbookEntries>[number];
export type PageEntry = ReturnType<typeof getPages>[number];
