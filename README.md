# GitCMS starter: three sites, one monorepo

A production-shaped example of running **multiple content sites on GitCMS** from a single Next.js monorepo. It includes three complete sites, a shared design system, shared content tooling, and generated `.gitcms` configuration.

| Site | What it is | Routes |
| --- | --- | --- |
| **Fieldnote** (`apps/fieldnote`) | An editorial journal and internal handbook | Journal, authors, changelog, handbook, CMS-managed pages |
| **Mise** (`apps/mise`) | A neighbourhood café | Menu, locations, journal, CMS-managed pages |
| **Northbridge University** (`apps/university`) | A small university example | Calendar, journal, handbook, people, changelog, CMS-managed pages |

The visual design stays deliberately close to wireframe quality. The typography, tokens, and component conventions follow the [Supabase design system](https://supabase.com/design-system), so the foundation is real even where the layouts are intentionally simple.

## Stack

- **Next.js 16** App Router, React 19
- **Tailwind CSS v4** through `@tailwindcss/postcss` (see [Tailwind and the webpack build](#tailwind-and-the-webpack-build))
- **TypeScript** in strict mode
- **npm workspaces + Turborepo**
- **next-mdx-remote**, `remark-gfm`, `rehype-slug`, `rehype-pretty-code`, Shiki
- **Zod** for frontmatter and site-data validation
- **GitCMS** for editing, media, and editorial workflow
- `next/font` with Inter and Source Code Pro (the Supabase type stack)

## Quick start

```bash
npm install
npm run dev
```

- Fieldnote: <http://localhost:3000>
- Mise: <http://localhost:3001>
- Northbridge University: <http://localhost:3002>

Useful commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Run all sites with Turborepo |
| `npm run dev:fieldnote` | Run one site |
| `npm run dev:mise` | Run the café site |
| `npm run dev:university` | Run the university site |
| `npm run build` | Production build for every site |
| `npm run build:fieldnote` | Production build for Fieldnote only |
| `npm run build:mise` | Production build for Mise only |
| `npm run build:university` | Production build for Northbridge University only |
| `npm run start:fieldnote` | Start the Fieldnote production build on port 3000 |
| `npm run start:mise` | Start the Mise production build on port 3000 |
| `npm run start:university` | Start the university production build on port 3000 |
| `npm run typecheck` | TypeScript across apps and packages |
| `npm run lint` | ESLint across all apps |
| `npm run gitcms:onboard` | Re-run the GitCMS monorepo onboarding CLI |

> The first build downloads the Inter and Source Code Pro font files through `next/font`. A network connection is required for that step.

## Repository layout

```text
.
├─ apps/
│  ├─ fieldnote/
│  │  ├─ app/                     # routes, metadata, RSS, sitemap, robots
│  │  ├─ content/
│  │  │  ├─ journal/              # MDX collection
│  │  │  ├─ authors/              # MDX collection
│  │  │  ├─ handbook/             # MDX collection
│  │  │  ├─ changelog/            # MDX collection
│  │  │  ├─ pages/                # MDX collection (root-level routes)
│  │  │  └─ site/                 # homepage.json, navigation.json, settings.json
│  │  ├─ lib/                     # Zod schemas, loaders, site-data imports
│  │  └─ CONTENT.md               # editorial guide read by GitCMS
│  ├─ mise/                       # same shape, café collections
│  └─ university/                 # journal, handbook, people, and calendar
├─ packages/
│  ├─ content/                    # generic collection loader + content utilities
│  └─ ui/                         # design tokens, typography, prose, components
├─ .gitcms/                       # generated GitCMS manifest and site configs
├─ turbo.json
├─ package-lock.json
└─ tsconfig.base.json
```

Each app is self-contained: it owns its content, schemas, routes, and site data. The packages hold only what is genuinely shared.

## Shared packages

### `@repo/content`

A small, framework-agnostic content layer:

- `loadCollection` / `loadEntry` read Markdown or MDX, parse frontmatter with `gray-matter`, and validate it with Zod.
- Invalid frontmatter fails the build with the file path and field name.
- `dateString` accepts both quoted dates and YAML `Date` objects, so editors do not have to remember quoting rules.
- `getHeadings` extracts an H2/H3 table of contents and skips fenced code blocks.
- `slugify`, `formatDate`, `readingTime`, `groupBy`, and `renderRss` are shared helpers.

The loader is intentionally generic. It knows nothing about Fieldnote, Mise, or Northbridge, which is what makes another site cheap to add.

### `@repo/ui`

The design system:

- `styles/tokens.css` — semantic CSS variables in OKLCH, light/dark values, and `@theme inline` mappings to Tailwind utilities such as `bg-surface-100` and `text-muted-foreground`.
- `styles/typography.css` — Supabase-style utilities: `display-hero`, `display-section`, `heading-title`, `heading-section`, `heading-meta`, `text-link`, and friends.
- `styles/prose.css` — MDX prose, inline-code sizing, tables, callouts, and Shiki dual-theme colours.
- `styles/components.css` — generated cover artwork and small shared treatments.
- Components — header, footer, theme toggle, entry cards, covers, avatars, badges, page headers, TOC, callouts, empty states.
- `@repo/ui/markdown` — the server-side MDX renderer with GFM, heading IDs, and syntax highlighting.

The theme follows Supabase's layering: components reference **semantic roles**, and each site changes a small number of raw values. Fieldnote uses the default green hue. Mise sets `--primary-hue: 35` in [`apps/mise/app/globals.css`](apps/mise/app/globals.css), and Northbridge sets `--primary-hue: 255` in [`apps/university/app/globals.css`](apps/university/app/globals.css). Every surface, border, and accent shifts with the hue.

Theme switching is handled by a tiny inline script before paint, then by `ThemeToggle`. There is no theme library.

## Content model

Content is plain Markdown/MDX in Git. Frontmatter is the schema, and Zod is the enforcement layer.

### Fieldnote

| Collection | Path | Notable fields |
| --- | --- | --- |
| `journal` | `content/journal` | `title`, `description`, `date`, `author`, `category`, `tags`, `cover`, `featured`, `draft` |
| `authors` | `content/authors` | `name`, `role`, `bio`, `avatar`, `links` |
| `handbook` | `content/handbook` | `title`, `description`, `section`, `order`, `updated` |
| `changelog` | `content/changelog` | `title`, `date`, `version`, `summary` |
| `pages` | `content/pages` | `title`, `description`, `updated` |

### Mise

| Collection | Path | Notable fields |
| --- | --- | --- |
| `menu` | `content/menu` | `title`, `description`, `category`, `price`, `dietary`, `order`, `featured`, `available` |
| `locations` | `content/locations` | `name`, `neighborhood`, `street`, `city`, `postalCode`, `hours`, `phone`, `mapsUrl` |
| `journal` | `content/journal` | `title`, `description`, `date`, `author`, `tags`, `cover`, `draft` |
| `pages` | `content/pages` | `title`, `description`, `updated` |

### Northbridge University

| Collection | Path | Notable fields |
| --- | --- | --- |
| `calendar` | `content/calendar` | `title`, `description`, `date`, `startTime`, `endTime`, `location`, `category`, `audience`, `registrationUrl`, `featured`, `draft` |
| `journal` | `content/journal` | `title`, `description`, `date`, `author`, `category`, `tags`, `cover`, `featured`, `draft` |
| `authors` | `content/authors` | `name`, `role`, `bio`, `avatar`, `links` |
| `handbook` | `content/handbook` | `title`, `description`, `section`, `order`, `updated` |
| `changelog` | `content/changelog` | `title`, `date`, `version`, `summary`, `draft` |
| `pages` | `content/pages` | `title`, `description`, `updated` |

The university calendar is the important addition. Each event is an MDX entry with structured date, time, location, category, and audience fields. The same collection powers the homepage preview, the month grid at `/calendar`, and the event detail pages at `/calendar/[slug]`.

### Site data

Each site has three JSON files under `content/site/`:

- `homepage.json` — hero copy, calls to action, featured entry slugs, and site-specific extras (hours, locations).
- `navigation.json` — primary navigation and footer columns.
- `settings.json` — site name, tagline, description, public URL, locale, email, socials, currency (Mise).

They are imported and validated in each app's `lib/site.ts`. A malformed file fails the build immediately.

Slugs come from the filename unless frontmatter supplies `slug`. Draft entries are filtered in the loader, not hidden with CSS.

## GitCMS setup

The repository already contains generated `.gitcms` configuration:

```text
.gitcms/
├─ sites.jsonc
├─ README.md
└─ sites/
   ├─ fieldnote/config.jsonc
   ├─ mise/config.jsonc
   └─ university/config.jsonc
```

It was generated with:

```bash
npm run gitcms:onboard
# equivalent to:
# create-gitcms --mode monorepo \
#   --site-root apps/fieldnote \
#   --site-root apps/mise \
#   --site-root apps/university \
#   --website-url apps/fieldnote=https://fieldnote.8ndr.de \
#   --website-url apps/mise=https://mise.8ndr.de \
#   --website-url apps/university=https://university.spill-the.ink
```

> **Do not hand-edit `.gitcms`.** GitCMS manages those files through its Settings UI. If you need to regenerate inference from content, re-run the onboarding CLI with `--force` and then review the result in GitCMS Settings.

### Connect the repo

1. Push the repository to GitHub.
2. Open [gitcms.dev](https://gitcms.dev) and connect the repository.
3. GitCMS reads `.gitcms/sites.jsonc` and offers **Fieldnote**, **Mise**, and **Northbridge University** as separate sites.
4. Open each site's **Settings**.

### Review the generated settings

`create-gitcms` infers collection shapes from a sample of each collection. Confirm or correct these in **Settings → Collections**:

- **Website URL** — replace the placeholder with the real domain.
- **Sitemap URL** — point it at `https://your-domain/sitemap.xml`. The CLI cannot discover it while the example domain is unreachable.
- **Framework** — `nextjs`; **Frontmatter format** — `yaml`; **Media root** — `public`.
- **Publishing mode** — `editorial_workflow` (review before publish).

Because inference samples content, some optional fields are not in the generated schema. Add them in Settings where you want editors to control them:

- Journal: `cover` (media), `coverAlt` (text), `draft` (boolean, default `false`), `translationKey` (text).
- Calendar: `startTime` and `endTime` (text, 24-hour), `audience` (text), `registrationUrl` (URL), `featured` and `draft` (boolean).
- Menu: `available` (boolean, default `true`); expand the `dietary` options beyond the sampled value.
- Tags and dietary fields: replace the inferred option list with your real vocabulary.
- Changelog: the generated schema may include a `description` field that the code does not use. Remove it in Settings if you prefer a tighter editor.

### Add site data

Site data is not inferred by the CLI. In each site's **Settings → Site data**, add three entries:

| Name | File | Fields |
| --- | --- | --- |
| `homepage` | `content/site/homepage.json` | hero, featured slugs, panel/hours/locations |
| `navigation` | `content/site/navigation.json` | primary links, footer columns |
| `settings` | `content/site/settings.json` | name, tagline, description, URL, locale, socials, currency |

Match the field names to the Zod schemas in each app's `lib/schemas.ts`. Once added, the homepage hero, navigation, footer, and metadata become editable without touching code.

### Config versions

`create-gitcms@0.2.4` writes config version **1.2**, with collections inline in `config.jsonc`. GitCMS may offer to upgrade the site to the newer **1.4** layout, which splits collections and site data into separate files under `.gitcms/sites/<site>/`. Accept that upgrade in the UI; no content files change.

The docs mention `npx create-gitcms check` for validating a split config. That command is not present in `create-gitcms@0.2.4`. Until the CLI ships it, the reliable validation is `npm run build`: every collection and site-data file is parsed and schema-checked during the build.

### Editorial workflow

With `editorial_workflow` enabled, editors work on a content board (Ideas → Draft → Review → Published). Publishing merges a pull request into the default branch. The repository remains the source of truth, and content history is Git history.

Each site has a `CONTENT.md` that GitCMS shows as editorial guidance. See [`apps/fieldnote/CONTENT.md`](apps/fieldnote/CONTENT.md), [`apps/mise/CONTENT.md`](apps/mise/CONTENT.md), and [`apps/university/CONTENT.md`](apps/university/CONTENT.md).

## Adding another site

The monorepo is designed for this:

1. Copy an existing app, for example `apps/mise` → `apps/roastery`.
2. Change the package name (`@example/roastery`), dev/start ports, metadata, and copy in `content/`.
3. Add or remove collections in `lib/schemas.ts` and `lib/content.ts`.
4. Add the app's three `content/site/*.json` files.
5. Adjust `--primary-hue` in `app/globals.css` if the new site needs its own accent.
6. Re-run onboarding with all site roots:
   ```bash
   npx create-gitcms --mode monorepo \
     --site-root apps/fieldnote \
     --site-root apps/mise \
     --site-root apps/university \
     --site-root apps/roastery \
     --website-url apps/fieldnote=https://fieldnote.8ndr.de \
     --website-url apps/mise=https://mise.8ndr.de \
     --website-url apps/university=https://university.spill-the.ink \
     --website-url apps/roastery=https://roastery.example.com \
     --yes --force
   ```
7. Review the regenerated configuration in GitCMS Settings, then add the site data entries.

No new package is needed unless the site has content behaviour the generic loader cannot express. Prefer extending `@repo/content` over forking it.

## Internationalization

The examples are English-only, but the structure leaves room for locales:

- Journal and page frontmatter already accept an optional `translationKey` for pairing translations.
- `loadCollection` accepts a directory, so a future locale layer can resolve `content/<locale>/<collection>` without changing its API.
- Site data is validated per app, so locale-specific settings or navigation can be loaded alongside the default.
- Routes are currently unprefixed, which matches GitCMS's "default locale has no path prefix" option.

A typical next step would be:

1. Enable **Locales** and **Default locale** in GitCMS Settings.
2. Add `app/[locale]/...` routes and a locale-aware content resolver.
3. Add a `locale` field to frontmatter (or derive it from the directory).
4. Use `translationKey` to build the language switcher.

Avoid putting locale strings directly in components; keep copy in site data or content.

## What each site demonstrates

**Fieldnote**

- Collection index and detail routes generated with `generateStaticParams`
- Author collection joined to journal entries by slug
- Handbook grouped and ordered by frontmatter
- TOC generated from the same heading slugs used by the renderer
- Changelog rendered from MDX in a single timeline
- CMS-managed static pages at `/[slug]`
- RSS, sitemap, robots, and a custom 404
- Site data for homepage, navigation, and settings

**Mise**

- A menu collection with numeric prices, dietary tags, availability, and ordering
- Locations collection with structured addresses and opening hours
- A second content site sharing the same components and build pipeline
- Per-site theming via `--primary-hue: 35`
- Generated cover artwork when no image is supplied

**Northbridge University**

- A GitCMS-managed `calendar` collection with structured dates, times, locations, categories, and audiences
- A client-side month grid with previous/next navigation and an agenda for the selected month
- Event detail routes at `/calendar/[slug]`, plus upcoming events on the homepage and in the sitemap
- A university content model reusing the journal, handbook, people, changelog, and page collections from Fieldnote
- Per-site theming via `--primary-hue: 255`

All three sites use the same theme script, typography scale, prose styles, and MDX pipeline.

## Deployment

The three apps deploy as separate **Node.js (SSR)** sites from the same repository and branch. Each build compiles one app and leaves Next's standalone server in `.next/standalone`, which the host starts on the port from `PORT`.

### Host settings

These values match Hostinger's **Next.js** preset. Any Node.js host that can install an npm workspace and start the standalone server works the same way.

| Setting | Fieldnote | Mise | Northbridge University |
| --- | --- | --- | --- |
| Application type | Next.js | Next.js | Next.js |
| Root directory | `apps/fieldnote` | `apps/mise` | `apps/university` |
| Package manager | npm | npm | npm |
| Build command | `npm run build` | `npm run build` | `npm run build` |
| Output directory | `.next` | `.next` | `.next` |
| Start command | automatic, `node .next/standalone/server.js` | same | same |
| Node.js | 22 or newer | 22 or newer | 22 or newer |
| Database | none | none | none |

Hostinger builds Next.js apps in standalone mode and starts the bundled server itself, so `next.config.mjs` leaves `output` unset: a local `next build` stays a normal build, while the host's build produces `.next/standalone`.

Set the following in each site's **Environment** editor:

```text
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

The standalone server reads `PORT` and falls back to `3000`, which is also the port in each app's `start` script, so the two stay aligned. Next.js sets `NODE_ENV=production` for the build and for the server.

Install once at the repository root, then build the app for that site:

```bash
npm install --no-audit --no-fund
npm run build --workspace=@example/university
```

The repository is an npm workspace, so one install at the root installs the dependencies for all apps and links `@repo/ui` and `@repo/content` locally. `--no-audit --no-fund` only trims install output, and only the configured app is compiled. On hosts that provide their own npm binary (xCloud uses `$XCLOUD_NPM`), use that binary instead of `npm`.

If `NODE_ENV=production` also applies during the build, add `--include=dev` to the install command so Next.js, Tailwind, and TypeScript are installed.

Do not keep a `pnpm-lock.yaml` in the repository. Hosts detect the package manager from the lockfile, and a pnpm lockfile makes them run `pnpm` on a server that only ships npm.

### Standalone output

Each `next.config.mjs` points `outputFileTracingRoot` at the repository root. Without it, the standalone output only contains files inside the app directory, and hoisted workspace dependencies such as `react` and `react-dom` are left out, so the production server fails with `Cannot find module 'react'`. With the shared tracing root, those dependencies are copied to `.next/standalone/node_modules`.

A monorepo tracing root nests the generated server under `.next/standalone/apps/<app>/`, but Hostinger and other standalone Next.js runners expect `server.js`, `.next/static`, and `public` directly inside `.next/standalone`. Each app's build script therefore runs `scripts/prepare-standalone.mjs` afterwards, which flattens the nested app into `.next/standalone` and copies `.next/static` and `public` next to the server. The script is a no-op when no standalone output exists, so a plain local `next build` is unaffected.

### Tailwind and the webpack build

All three apps build with `next build --webpack`, and Tailwind is wired up through PostCSS rather than the Turbopack loader. Each app has a `postcss.config.mjs` that registers `@tailwindcss/postcss`, and `devDependencies` list `@tailwindcss/postcss` instead of `@tailwindcss/turbopack`.

The webpack build is required on Hostinger because the build image ships a glibc older than `GLIBC_2.29`, so Next's native SWC binary cannot load. `@next/swc-wasm-nodejs` provides the WebAssembly fallback, and only the webpack builder can use it. All three apps use the same command so a host requirement cannot silently apply to only one site.

`turbopack.rules` in `next.config.mjs` is ignored by a webpack build. Wiring Tailwind through it emits CSS that still contains the raw `@theme`, `@source`, and `@tailwind utilities` at-rules; browsers ignore those, so `--font-sans` stays undefined and the page renders un-styled even though every asset returns 200. PostCSS runs under both `next dev` (Turbopack) and `next build --webpack`, so one configuration covers development and production.

When you touch the build setup, check the emitted CSS for a `.flex` utility and the absence of `@theme` before deploying.

The production domains are already set in the content:

- `apps/fieldnote/content/site/settings.json` → `https://fieldnote.8ndr.de`
- `apps/mise/content/site/settings.json` → `https://mise.8ndr.de`
- `apps/university/content/site/settings.json` → `https://university.spill-the.ink`
- `.gitcms/sites.jsonc` → managed through GitCMS Settings, not by hand

Enable push to deploy so a commit published through GitCMS rebuilds the site. The pages are statically generated at build time, so content changes need a new deployment rather than a running CMS process.

## Notes and limitations

- Example URLs, email addresses, phone numbers, and social links are placeholders.
- Cover images are generated with CSS; no external image host is required. Add real images to `public/` and set `cover: /images/...` when you have them.
- The `.gitcms` config is intentionally generated rather than tuned by hand. Treat the Settings UI as the source of truth for collection fields.
- The university calendar is static at build time. Events and month navigation are generated from the `calendar` collection, so a published event appears after the next deployment.
- The repository uses GitCMS config version 1.4. `create-gitcms@0.2.4` still generates 1.2, so accept the 1.4 upgrade in GitCMS when prompted.
- The design token layer is adapted from Supabase's Apache-2.0-licensed design system. See the comments in `packages/ui/src/styles/`.
