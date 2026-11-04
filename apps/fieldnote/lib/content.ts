import path from "node:path";

import { loadCollection, loadEntry } from "@repo/content";

import {
  authorFrontmatter,
  changelogFrontmatter,
  handbookFrontmatter,
  journalFrontmatter,
  pageFrontmatter,
} from "./schemas";

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

export function getChangelogEntries() {
  return loadCollection({
    directory: path.join(contentRoot, "changelog"),
    schema: changelogFrontmatter,
  })
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
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
export type AuthorEntry = ReturnType<typeof getAuthors>[number];
export type HandbookEntry = ReturnType<typeof getHandbookEntries>[number];
export type PageEntry = ReturnType<typeof getPages>[number];
