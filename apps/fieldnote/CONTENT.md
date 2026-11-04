# Fieldnote editorial guide

Fieldnote is a working journal and an internal handbook. This file is read by people editing the repository and is used by GitCMS as editorial guidance.

## Voice

Write for a reader who is interested but not yet convinced. Prefer plain language, specific claims, and a visible structure. The full house style lives in the handbook at `/handbook/writing-style`.

- One idea per sentence.
- Sentence case for headings.
- A callout is a warning or a rule of thumb, not emphasis.
- Make the ending useful: a link, a checklist, or a small next step.

## Collections

All content is MDX in `content/<collection>/`. The slug comes from the filename unless frontmatter sets `slug`.

### Journal — `content/journal`

Long-form essays. The index and detail pages are built from this collection.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Sentence case |
| `description` | string | yes | Works as a standalone summary |
| `date` | date | yes | Quote it: `"2026-09-18"` |
| `author` | string | yes | Slug from `content/authors`, e.g. `mara-voss` |
| `category` | string | no | Defaults to `Notes` |
| `tags` | string[] | no | Reuse existing tags where possible |
| `cover` | string | no | `/images/...`; omit to use generated artwork |
| `coverAlt` | string | no | Required in practice when `cover` is set |
| `featured` | boolean | no | Used by the homepage when no explicit featured list exists |
| `draft` | boolean | no | Drafts are filtered out of every route |
| `translationKey` | string | no | Reserved for locale pairing |

### Authors — `content/authors`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | Display name |
| `role` | string | yes | Short role, e.g. `Editor` |
| `bio` | string | yes | One or two sentences |
| `avatar` | string | no | `/images/...` |
| `links` | `{ label, href }[]` | no | External links or `mailto:` |

The author body is currently unused; keep it short or leave it empty.

### Handbook — `content/handbook`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | |
| `description` | string | yes | Shown in the index |
| `section` | string | no | Defaults to `General`; groups the index |
| `order` | number | no | Position within the section |
| `updated` | date | no | Quote it |

Use at least two `##` headings in long chapters. They feed the table of contents.

### Changelog — `content/changelog`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | |
| `date` | date | yes | Quote it |
| `version` | string | yes | e.g. `0.4.0` |
| `summary` | string | yes | One-sentence release summary |
| `draft` | boolean | no | |

Changelog entries render on one timeline. Use bold labels (`**Added**`) rather than headings so anchor IDs do not repeat across releases.

### Pages — `content/pages`

These become root-level routes such as `/about` and `/contact`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | |
| `description` | string | yes | Page header and meta description |
| `updated` | date | no | Quote it |
| `translationKey` | string | no | Reserved for locale pairing |

## Adding a journal entry

1. In GitCMS, open the **Journal** collection and create an entry. In the repository, create `content/journal/my-entry.mdx`.
2. Fill in the frontmatter. Quote dates and any value containing a colon followed by a space.
3. Write the body in MDX. Use `##` and `###` for sections that should appear in the table of contents.
4. Add a cover image only if it helps. Omit `cover` to use the generated artwork.
5. Run `npm run build --workspace=@example/fieldnote` locally, or open a draft in GitCMS.
6. Move the entry through review and publish it.

Example:

```mdx
---
title: A note on editing
description: "One sentence about the reader and the point."
date: "2026-10-02"
author: mara-voss
category: Practice
tags:
  - editing
---

Opening paragraph.

## First section

Body text.
```

## Images and media

Repository media is stored under `public/`. Reference uploaded files with a root-relative path:

```yaml
cover: /images/journal/a-note-on-editing.jpg
coverAlt: A desk with a notebook and a cup of coffee
```

If `cover` is empty, the site draws a deterministic cover from the entry title and slug. Images are rendered with `next/image`; alt text matters.

## Site data

These files are edited through **GitCMS → Settings → Site data**:

- `content/site/homepage.json` — hero, actions, featured entry slugs, "Currently" panel.
- `content/site/navigation.json` — primary navigation and footer columns.
- `content/site/settings.json` — site name, tagline, description, public URL, locale, email, socials.

The schemas live in `apps/fieldnote/lib/schemas.ts`. Keep field names in sync when adding a field in Settings.

## Drafts and publishing

- GitCMS uses the editorial workflow: Ideas → Draft → Review → Published.
- `draft: true` is a second safety net for content merged directly into the repository. Drafts are removed in the loader, not hidden with CSS.
- Publishing merges a pull request. Content history is Git history.

## Localization

The site is English-only today. `translationKey` is available on journal entries and pages for pairing future translations. Do not add a locale prefix to internal links yet.

## Checks

```bash
npm run typecheck --workspace=@example/fieldnote
npm run lint --workspace=@example/fieldnote
npm run build --workspace=@example/fieldnote
```

The build validates every frontmatter file, every site-data JSON file, and every internal collection reference used by the pages.
