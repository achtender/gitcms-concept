import { dateString } from "@repo/content";
import { z } from "zod";

import {
  isAbsoluteDateTime,
  isDateOnly,
  isNaiveDateTime,
  isValidTimeZone,
  zonedDateTimeToUtc,
} from "./calendar";

const eventDateTime = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z
    .string()
    .refine(
      (value) =>
        isDateOnly(value) ||
        isAbsoluteDateTime(value) ||
        isNaiveDateTime(value),
      "Use an ISO date or date-time, e.g. 2026-11-07T09:30:00+01:00",
    ),
);

const ianaTimeZone = z
  .string()
  .refine(isValidTimeZone, "Use an IANA timezone, e.g. Europe/Berlin");

export const actionSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("secondary"),
});

export const journalFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  date: dateString,
  author: z.string(),
  category: z.string().default("Notes"),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  /** Reserved for future locale-paired entries. */
  translationKey: z.string().optional(),
});

export const calendarFrontmatter = z
  .object({
    title: z.string(),
    description: z.string(),
    /**
     * A single absolute instant for timed events, e.g.
     * `2026-11-07T09:30:00+01:00`, or a plain date for an all-day event.
     */
    start: eventDateTime,
    end: eventDateTime.optional(),
    allDay: z.boolean().default(false),
    /** Audience filter. This is a region, not a timezone. */
    region: z.enum(["EU", "NA"]),
    /**
     * Fallback for CMS builds that save a wall-clock time without an offset.
     * With an offset in `start`/`end`, this is not needed.
     */
    timeZone: ianaTimeZone.optional(),
    location: z.string(),
    category: z.string().default("Event"),
    audience: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.allDay) {
      return;
    }

    for (const key of ["start", "end"] as const) {
      const value = data[key];
      if (!value) {
        continue;
      }

      if (isDateOnly(value)) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message:
            "Timed events need a time, e.g. 2026-11-07T09:30:00+01:00. Set allDay for a date-only event.",
        });
      } else if (isNaiveDateTime(value) && !data.timeZone) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message:
            "This date-time has no offset. Add an offset (e.g. +01:00) or set timeZone.",
        });
      }
    }

    if (!data.start || !data.end) {
      return;
    }

    const toDate = (value: string) => {
      if (isNaiveDateTime(value)) {
        return data.timeZone
          ? zonedDateTimeToUtc(value, data.timeZone)
          : null;
      }
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const start = toDate(data.start);
    const end = toDate(data.end);
    if (start && end && end.getTime() < start.getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["end"],
        message: "end must be after start",
      });
    }
  });

export const authorFrontmatter = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  avatar: z.string().optional(),
  links: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
});

export const handbookFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  section: z.string().default("General"),
  order: z.number().default(0),
  updated: dateString.optional(),
});

export const pageFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  updated: dateString.optional(),
  translationKey: z.string().optional(),
});

export const homepageSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    actions: z.array(actionSchema).default([]),
  }),
  featured: z.array(z.string()).default([]),
  panel: z
    .object({
      label: z.string(),
      title: z.string(),
      body: z.string(),
      href: z.string(),
      linkLabel: z.string(),
    })
    .optional(),
});

export const navigationSchema = z.object({
  primary: z.array(z.object({ label: z.string(), href: z.string() })),
  footer: z
    .array(
      z.object({
        title: z.string(),
        items: z.array(z.object({ label: z.string(), href: z.string() })),
      }),
    )
    .default([]),
});

export const settingsSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  locale: z.string().default("en"),
  email: z.string().email().optional(),
  socials: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
});
