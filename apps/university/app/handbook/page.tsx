import type { Metadata } from "next";
import Link from "next/link";

import { groupBy } from "@repo/content";
import { Container, PageHeader } from "@repo/ui";

import { getHandbookEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Student handbook",
  description:
    "How Northbridge works: academic expectations, student support, and the practical details students ask about most.",
};

export default function HandbookPage() {
  const entries = getHandbookEntries();
  const sections = groupBy(entries, (entry) => entry.data.section);

  return (
    <>
      <PageHeader
        eyebrow="Student handbook"
        title="How the university works"
        description="The practical counterpart to the journal: expectations, support, and repeatable processes, written down so they can be reviewed and improved."
        meta={<span>{entries.length} chapters</span>}
      />

      <Container size="narrow">
        <div className="space-y-12 py-12">
          {Object.entries(sections).map(([section, sectionEntries]) => (
            <section key={section}>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <h2 className="heading-section">{section}</h2>
                <span className="font-mono text-xs text-foreground-lighter">
                  {String(sectionEntries.length).padStart(2, "0")}
                </span>
              </div>
              <ol className="divide-y divide-border">
                {sectionEntries.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/handbook/${entry.slug}`}
                      className="group grid gap-2 py-5 sm:grid-cols-[2.5rem_1fr_auto] sm:items-baseline"
                    >
                      <span className="font-mono text-xs text-foreground-lighter">
                        {String(entry.data.order).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                          {entry.data.title}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {entry.data.description}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden text-sm text-foreground-lighter sm:block"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
