import { dateString } from "@repo/content";
import { z } from "zod";

export const actionSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("secondary"),
});

export const menuFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().nonnegative(),
  dietary: z.array(z.string()).default([]),
  order: z.number().default(0),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
});

export const journalFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  date: dateString,
  author: z.string(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  /** Reserved for future locale-paired entries. */
  translationKey: z.string().optional(),
});

export const locationFrontmatter = z.object({
  name: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
  hours: z.array(z.object({ days: z.string(), hours: z.string() })).default([]),
  phone: z.string().optional(),
  mapsUrl: z.string().optional(),
  order: z.number().default(0),
  featured: z.boolean().default(false),
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
  hours: z.array(z.object({ days: z.string(), hours: z.string() })).default([]),
  featuredMenu: z.array(z.string()).default([]),
  featuredJournal: z.array(z.string()).default([]),
  locations: z.array(z.string()).default([]),
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
  currency: z.string().default("USD"),
  socials: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
});
