import { dateString } from "@repo/content";
import { z } from "zod";

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

export const changelogFrontmatter = z.object({
  title: z.string(),
  date: dateString,
  version: z.string(),
  summary: z.string(),
  draft: z.boolean().default(false),
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
