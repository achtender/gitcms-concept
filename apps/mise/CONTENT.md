# Mise editorial guide

Mise is a neighbourhood café with two rooms. This file is read by people editing the repository and is used by GitCMS as editorial guidance.

## Voice

Warm, direct, and a little dry. Write the way you would explain something across the counter: what it is, why it is there, and anything a guest needs to know.

- Keep menu descriptions to one or two sentences.
- Use sentence case for headings.
- Avoid superlatives. Say what is in it and how it is made.
- Prices are numbers, not formatted strings. The site adds the currency symbol.

## Collections

All content is MDX in `content/<collection>/`. The slug comes from the filename unless frontmatter sets `slug`.

### Menu — `content/menu`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Item name |
| `description` | string | yes | One or two sentences |
| `category` | string | yes | `Coffee`, `Pastry`, `Lunch`, … |
| `price` | number | yes | e.g. `4.5`; currency comes from site settings |
| `dietary` | string[] | no | Reuse the existing vocabulary: `Vegan`, `Vegetarian`, `Gluten-free` |
| `order` | number | no | Position inside the category |
| `featured` | boolean | no | Used by the homepage when no explicit featured list exists |
| `available` | boolean | no | `false` hides the item from the menu |

The MDX body is a longer tasting note or preparation detail. It is not currently rendered on the menu page, but it is kept for future use and for the CMS editor.

### Locations — `content/locations`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | e.g. `Mise Downtown` |
| `neighborhood` | string | yes | Short label |
| `street` | string | yes | |
| `city` | string | yes | Include region, e.g. `Portland, OR` |
| `postalCode` | string | yes | Quote it to keep leading zeros |
| `hours` | `{ days, hours }[]` | no | Display order is preserved |
| `phone` | string | no | Displayed as a `tel:` link |
| `mapsUrl` | string | no | External map link |
| `order` | number | no | Order on the locations page |
| `featured` | boolean | no | Used for the homepage address card |

The body is the short paragraph shown under the location name on the homepage. Keep the first line self-contained; that is the line the homepage uses.

### Journal — `content/journal`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | |
| `description` | string | yes | |
| `date` | date | yes | Quote it: `"2026-09-05"` |
| `author` | string | yes | Free text; Mise does not have an authors collection |
| `tags` | string[] | no | First tag is used as the badge |
| `cover` | string | no | `/images/...`; omit for generated artwork |
| `draft` | boolean | no | Drafts are filtered out of every route |
| `translationKey` | string | no | Reserved for locale pairing |

### Pages — `content/pages`

These become root-level routes such as `/about` and `/contact`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | |
| `description` | string | yes | Page header and meta description |
| `updated` | date | no | Quote it |
| `translationKey` | string | no | Reserved for locale pairing |

## Adding a menu item

1. In GitCMS, open **Menu** and create an entry. In the repository, create `content/menu/my-item.mdx`.
2. Add the frontmatter. Use a number for `price` and quote the postal code in locations.
3. Set `category` to an existing category unless you intend to add a new section to the menu page.
4. Set `order` to place it inside the category. Lower numbers come first.
5. Add a body if there is something useful to say about the item.
6. Build locally or review the draft in GitCMS.

Example:

```mdx
---
title: Brown butter cookie
description: Dark chocolate, sea salt, and a soft centre.
category: Pastry
price: 4.25
dietary:
  - Vegetarian
order: 3
available: true
---

Baked twice a day. Best within an hour of the tray coming out.
```

## Images and media

Repository media is stored under `public/`. Reference files with a root-relative path:

```yaml
cover: /images/journal/autumn-menu.jpg
```

The menu and locations pages currently use generated cover artwork, so images are optional. When you add real photography, keep it local and reasonably sized; the site does not use an external image host.

## Site data

These files are edited through **GitCMS → Settings → Site data**:

- `content/site/homepage.json` — hero, opening hours, featured menu slugs, featured journal entry, featured locations.
- `content/site/navigation.json` — primary navigation and footer columns.
- `content/site/settings.json` — site name, tagline, description, public URL, locale, email, currency, socials.

The schemas live in `apps/mise/lib/schemas.ts`. Prices are formatted with `Intl.NumberFormat` using `settings.locale` and `settings.currency`.

Examples:

- `featuredMenu: ["filter-coffee", "cardamom-bun", "miso-toast"]` shows those menu items on the homepage. If the list is empty, items with `featured: true` are used.
- `featuredJournal: ["opening-the-back-room"]` chooses the homepage journal entry.
- `locations: ["downtown", "harbour"]` chooses the homepage location cards.

## Drafts and publishing

- GitCMS uses the editorial workflow: Ideas → Draft → Review → Published.
- `draft: true` filters journal entries in the loader. Use `available: false` to hide a menu item without deleting it.
- Publishing merges a pull request. Content history is Git history.

## Localization

The site is English-only today. `translationKey` is available on journal entries and pages for pairing future translations. The currency and locale are already site settings, so a future locale does not need hard-coded formatting.

## Checks

```bash
pnpm --filter @example/mise typecheck
pnpm --filter @example/mise lint
pnpm --filter @example/mise build
```

The build validates every frontmatter file, every site-data JSON file, and every menu/location reference used by the pages.
