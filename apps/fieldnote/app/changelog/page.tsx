import type { Metadata } from "next";

import { formatDate } from "@repo/content";
import { Badge, Container, Mdx, PageHeader } from "@repo/ui";

import { getChangelogEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Changes to the Fieldnote site, the design system, and the editorial workflow.",
};

export default function ChangelogPage() {
  const entries = getChangelogEntries();

  return (
    <>
      <PageHeader
        eyebrow="Changelog"
        title="What changed"
        description="Releases of the site itself: layout, content model, design tokens, and the tools behind them."
        meta={<span>{entries.length} releases</span>}
      />

      <Container size="narrow">
        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <section key={entry.slug} className="py-10">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="solid">v{entry.data.version}</Badge>
                <time
                  dateTime={entry.data.date}
                  className="font-mono text-xs text-foreground-lighter"
                >
                  {formatDate(entry.data.date)}
                </time>
              </div>
              <h2 className="mt-3 text-xl font-medium tracking-tight">
                {entry.data.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {entry.data.summary}
              </p>
              <Mdx source={entry.body} className="mt-5" />
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
