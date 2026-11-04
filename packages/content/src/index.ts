import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { z, type ZodType } from "zod";

/**
 * YAML parsers turn unquoted ISO dates into Date objects. CMS authors should
 * not have to remember quoting rules, so accept both shapes and normalize to a
 * date-only string.
 */
export const dateString = z.preprocess((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}, z.string());

export type ContentEntry<T> = {
  /** Public identifier used in URLs. Comes from frontmatter `slug`, else the filename. */
  slug: string;
  /** Validated frontmatter. */
  data: T;
  /** Markdown/MDX body without frontmatter. */
  body: string;
  filePath: string;
};

export type Heading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export type LoadCollectionOptions<S extends ZodType> = {
  directory: string;
  schema: S;
  extension?: ".md" | ".mdx";
};

/**
 * Read every Markdown/MDX file in a collection directory and validate its
 * frontmatter. Invalid content fails the build with the file and field name,
 * which is exactly what a CMS-backed site should do.
 */
export function loadCollection<S extends ZodType>({
  directory,
  schema,
  extension = ".mdx",
}: LoadCollectionOptions<S>): ContentEntry<z.infer<S>>[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(extension) && !file.startsWith("."))
    .map((file) => parseFile(path.join(directory, file), schema))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Read a single entry by slug. Returns null when the file does not exist so
 * routes can call notFound().
 */
export function loadEntry<S extends ZodType>({
  directory,
  slug,
  schema,
  extension = ".mdx",
}: LoadCollectionOptions<S> & { slug: string }): ContentEntry<z.infer<S>> | null {
  const root = path.resolve(directory);
  const filePath = path.resolve(root, `${slug}${extension}`);

  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
    return null;
  }

  return parseFile(filePath, schema);
}

/**
 * Read and validate a JSON site-data file (homepage.json, navigation.json,
 * settings.json). These are edited through GitCMS Settings but live in the
 * repository, so they get the same build-time validation as content.
 */
export function loadJsonFile<S extends ZodType>(filePath: string, schema: S): z.infer<S> {
  const raw = fs.readFileSync(filePath, "utf8");
  const result = schema.safeParse(JSON.parse(raw));

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid site data in ${filePath}:\n${details}`);
  }

  return result.data;
}

function parseFile<S extends ZodType>(filePath: string, schema: S): ContentEntry<z.infer<S>> {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const result = schema.safeParse(parsed.data);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${filePath}:\n${details}`);
  }

  const explicitSlug = (result.data as { slug?: unknown }).slug;
  const fileSlug = path.basename(filePath).replace(/\.(md|mdx)$/, "");
  const slug =
    typeof explicitSlug === "string" && explicitSlug.trim()
      ? explicitSlug.trim().replace(/^\/+|\/+$/g, "")
      : fileSlug;

  return {
    slug,
    data: result.data,
    body: parsed.content.trim(),
    filePath,
  };
}

/**
 * Extract a table of contents from the Markdown body. Fenced code blocks are
 * skipped so examples containing `##` do not become headings.
 */
export function getHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let fence: string | null = null;

  for (const line of body.split(/\r?\n/)) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) {
        fence = marker;
      } else if (fence === marker) {
        fence = null;
      }
      continue;
    }

    if (fence !== null) {
      continue;
    }

    const headingMatch = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!headingMatch) {
      continue;
    }

    const text = stripInlineMarkdown(headingMatch[2]);
    headings.push({
      depth: headingMatch[1].length as 2 | 3,
      text,
      id: slugger.slug(text),
    });
  }

  return headings;
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

/** Stable, readable slug from arbitrary text. */
export function slugify(value: string): string {
  return new GithubSlugger().slug(value);
}

/** Format a frontmatter date without timezone drift for date-only strings. */
export function formatDate(value: string, locale = "en"): string {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00Z`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Rough reading time, good enough for editorial metadata. */
export function readingTime(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export type FeedItem = {
  title: string;
  link: string;
  description?: string;
  date?: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rssDate(value?: string): string {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

/** Minimal RSS 2.0 document, shared by both example sites. */
export function renderRss({
  title,
  description,
  siteUrl,
  items,
  language = "en",
}: {
  title: string;
  description: string;
  siteUrl: string;
  items: FeedItem[];
  language?: string;
}): string {
  const base = siteUrl.replace(/\/$/, "");
  const entries = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link.startsWith("http") ? item.link : `${base}${item.link}`)}</link>
      <guid isPermaLink="true">${escapeXml(item.link.startsWith("http") ? item.link : `${base}${item.link}`)}</guid>${
        item.description
          ? `\n      <description>${escapeXml(item.description)}</description>`
          : ""
      }${
        item.date
          ? `\n      <pubDate>${rssDate(item.date)}</pubDate>`
          : ""
      }
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(language)}</language>
    <atom:link href="${escapeXml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>
`;
}

export function groupBy<T, K extends string>(
  items: T[],
  getKey: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (groups, item) => {
      const key = getKey(item);
      (groups[key] ??= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}
