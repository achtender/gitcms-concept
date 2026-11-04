# Northbridge University editorial guide

Northbridge is a small university example site in a three-site monorepo. This file is read by people editing the repository and is used by GitCMS as editorial guidance.

## Voice

Write for a reader who is interested but not yet part of the university. Prefer plain language, specific claims, and a visible structure.

- One idea per sentence.
- Sentence case for headings.
- Say who an event is for. "Open to the public" is useful; "all welcome" is not.
- A callout is a warning or a rule of thumb, not emphasis.
- Make the ending useful: a link, a checklist, or a small next step.

## Collections

All content is MDX in `content/<collection>/`. The slug comes from the filename unless frontmatter sets `slug`.

### Calendar — `content/calendar`

Events are structured entries first. The detail page renders the body, but the month grid and homepage preview rely only on the frontmatter.

Times are stored as an absolute instant. Editors enter the time in their own timezone; the site converts it to each visitor's local timezone when the calendar renders. `region` is an audience filter, not a timezone: EU and NA events can each span several zones.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Short, specific event name |
| `description` | string | yes | One sentence shown in the agenda |
| `start` | ISO date-time | yes | Include an offset, e.g. `"2026-11-12T18:30:00+01:00"`. All-day events use a date only, e.g. `"2026-12-15"`. |
| `end` | ISO date-time | no | Same format as `start` |
| `allDay` | boolean | no | Defaults to `false`; set `true` for a date-only event |
| `region` | `EU` or `NA` | yes | Audience filter, not a timezone |
| `timeZone` | IANA name | no | Fallback for a CMS that saves wall-clock times without an offset. With an offset in `start`/`end`, omit it. |
| `location` | string | yes | Room, building, or `Online` |
| `category` | string | no | Defaults to `Event`; reuse existing categories where possible |
| `audience` | string | no | Who the event is for, e.g. `Students` |
| `registrationUrl` | string | no | Absolute URL; adds a Register button |
| `featured` | boolean | no | Used on the homepage and in the calendar agenda |
| `draft` | boolean | no | Drafts are filtered out of every route |

The month grid shows up to three events per day and adds a count for the rest. The agenda below the grid lists every event in the selected month. Visitors can filter the calendar by `EU` or `NA`; the grid and agenda then switch to the visitor's detected timezone.

### Journal — `content/journal`

Stories about teaching, research, campus life, and the work of running the university.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Sentence case |
| `description` | string | yes | Works as a standalone summary |
| `date` | date | yes | Quote it: `"2026-10-28"` |
| `author` | string | yes | Slug from `content/authors`, e.g. `elena-marsh` |
| `category` | string | no | Defaults to `Notes` |
| `tags` | string[] | no | Reuse existing tags where possible |
| `cover` | string | no | `/images/...`; omit to use generated artwork |
| `coverAlt` | string | no | Required in practice when `cover` is set |
| `featured` | boolean | no | Used by the homepage when no explicit featured list exists |
| `draft` | boolean | no | Drafts are filtered out of every route |
| `translationKey` | string | no | Reserved for locale pairing |

### People — `content/authors`

Despite the collection name, these are the people profiles linked from journal bylines.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | Display name |
| `role` | string | yes | Short role, e.g. `Professor of Urban Studies` |
| `bio` | string | yes | One or two sentences |
| `avatar` | string | no | `/images/...` |
| `links` | `{ label, href }[]` | no | External links or `mailto:` |

The body is currently unused; keep it short or leave it empty.

### Student handbook — `content/handbook`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | |
| `description` | string | yes | Shown in the index |
| `section` | string | no | Defaults to `General`; groups the index |
| `order` | number | no | Position within the section |
| `updated` | date | no | Quote it |

Use at least two `##` headings in long chapters. They feed the table of contents.

### Pages — `content/pages`

These become root-level routes such as `/about` and `/admissions`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | |
| `description` | string | yes | Page header and meta description |
| `updated` | date | no | Quote it |
| `translationKey` | string | no | Reserved for locale pairing |

## Adding a calendar event

1. In GitCMS, open **Calendar** and create an entry. In the repository, create `content/calendar/my-event.mdx`.
2. Set `start` in your own local time. The GitCMS date field shows your browser's timezone, so enter the time you would put on an invitation; do not convert it. The saved value includes an offset, e.g. `2026-11-12T18:30:00+01:00`.
3. Set `end` when the event has a finishing time.
4. Set `allDay` to `true` for a date-only event, and give `start` a plain date such as `2026-12-15`.
5. Choose `region` (`EU` or `NA`). This is an audience filter, not a timezone: pick the audience the event is for, even if it happens in another zone.
6. Set `location` and `audience` so a reader knows where to go and whether the event is for them.
7. Set `category` to an existing category unless you intend to add a new one.
8. Add a body for the detail page. Use `##` headings for sections.
9. Build locally or review the draft in GitCMS.

Visitors see every time converted to their own detected timezone, so do not write "18:30 CET" into the body. Say `18:30` and let the calendar label the zone.

Example:

```mdx
---
title: Ordinary cities: a public lecture
description: How the most interesting urban design often happens in places nobody planned to visit.
start: "2026-11-12T18:30:00+01:00"
end: "2026-11-12T20:00:00+01:00"
allDay: false
region: EU
location: Great Hall
category: Lecture
audience: Open to the public
featured: true
---

Opening paragraph.

## About the lecture

Body text.
```

If a CMS save drops the offset and leaves a wall-clock time such as `2026-11-12T18:30:00`, add `timeZone: Europe/Berlin` so the site can resolve the instant. An offset in `start` and `end` is preferred and makes `timeZone` unnecessary.

## Adding a journal story

1. In GitCMS, open **Journal** and create an entry. In the repository, create `content/journal/my-story.mdx`.
2. Fill in the frontmatter. Quote dates and any value containing a colon followed by a space.
3. Set `author` to a slug from `content/authors`.
4. Write the body in MDX. Use `##` and `###` for sections that should appear in the table of contents.
5. Add a cover image only if it helps. Omit `cover` to use the generated artwork.
6. Run `npm run build --workspace=@example/university` locally, or open a draft in GitCMS.

## Images and media

Repository media is stored under `public/`. Reference uploaded files with a root-relative path:

```yaml
cover: /images/journal/a-note-on-editing.jpg
coverAlt: A desk with a notebook and a cup of coffee
```

If `cover` is empty, the site draws a deterministic cover from the entry title and slug. Images are rendered with `next/image`; alt text matters.

## Site data

These files are edited through **GitCMS → Settings → Site data**:

- `content/site/homepage.json` — hero, actions, featured story slugs, "This month" panel.
- `content/site/navigation.json` — primary navigation and footer columns.
- `content/site/settings.json` — site name, tagline, description, public URL, locale, email, socials.

The schemas live in `apps/university/lib/schemas.ts`. Keep field names in sync when adding a field in Settings.

## Drafts and publishing

- GitCMS uses the editorial workflow: Ideas → Draft → Review → Published.
- `draft: true` is a second safety net for content merged directly into the repository. Drafts are removed in the loader, not hidden with CSS.
- Publishing merges a pull request. Content history is Git history.

## Localization

The site is English-only today. `translationKey` is available on journal entries and pages for pairing future translations. Do not add a locale prefix to internal links yet.

## Checks

```bash
npm run typecheck --workspace=@example/university
npm run lint --workspace=@example/university
npm run build --workspace=@example/university
```

The build validates every frontmatter file, every site-data JSON file, and every internal collection reference used by the pages.
