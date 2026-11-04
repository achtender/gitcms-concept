import path from "node:path";

import { loadCollection, loadEntry } from "@repo/content";

import {
  journalFrontmatter,
  locationFrontmatter,
  menuFrontmatter,
  pageFrontmatter,
} from "./schemas";

const contentRoot = path.join(process.cwd(), "content");

export function getMenuItems() {
  return loadCollection({
    directory: path.join(contentRoot, "menu"),
    schema: menuFrontmatter,
  })
    .filter((entry) => entry.data.available)
    .sort(
      (a, b) =>
        a.data.category.localeCompare(b.data.category) ||
        a.data.order - b.data.order,
    );
}

export function getMenuCategories() {
  const items = getMenuItems();
  const categories: string[] = [];

  for (const item of items) {
    if (!categories.includes(item.data.category)) {
      categories.push(item.data.category);
    }
  }

  return categories;
}

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

export function getLocations() {
  return loadCollection({
    directory: path.join(contentRoot, "locations"),
    schema: locationFrontmatter,
  }).sort((a, b) => a.data.order - b.data.order);
}

export function getLocation(slug: string) {
  return loadEntry({
    directory: path.join(contentRoot, "locations"),
    slug,
    schema: locationFrontmatter,
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

export type MenuItem = ReturnType<typeof getMenuItems>[number];
export type JournalEntry = ReturnType<typeof getJournalEntries>[number];
export type LocationEntry = ReturnType<typeof getLocations>[number];
export type PageEntry = ReturnType<typeof getPages>[number];
