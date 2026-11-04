import type { Metadata } from "next";

import { groupBy } from "@repo/content";
import { Badge, Container, PageHeader } from "@repo/ui";

import { getMenuItems } from "@/lib/content";
import { formatPrice, homepage, settings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Coffee, pastry, and a short lunch menu at Mise. The menu changes with the market and the season.",
};

export default function MenuPage() {
  const items = getMenuItems();
  const categories = groupBy(items, (item) => item.data.category);

  return (
    <>
      <PageHeader
        eyebrow="Menu"
        title="Coffee, pastry, lunch"
        description="A short menu, changed when the market changes. Everything is made in the Downtown kitchen."
        meta={
          <>
            <span>{items.length} items</span>
            <span aria-hidden="true">·</span>
            <span>
              {settings.currency} · prices include tax
            </span>
          </>
        }
      />

      <Container size="narrow">
        <div className="space-y-12 py-12">
          {Object.entries(categories).map(([category, categoryItems]) => (
            <section key={category}>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <h2 className="heading-section">{category}</h2>
                <span className="font-mono text-xs text-foreground-lighter">
                  {String(categoryItems.length).padStart(2, "0")}
                </span>
              </div>

              <ul className="divide-y divide-border">
                {categoryItems.map((item) => (
                  <li key={item.slug} className="py-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-sm font-medium">{item.data.title}</h3>
                      <span
                        aria-hidden="true"
                        className="hidden flex-1 border-b border-dotted border-border sm:block"
                      />
                      <span className="font-mono text-xs text-foreground">
                        {formatPrice(item.data.price)}
                      </span>
                    </div>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {item.data.description}
                    </p>
                    {item.data.dietary.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.data.dietary.map((diet) => (
                          <Badge key={diet}>{diet}</Badge>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="mb-12 rounded-lg border border-border bg-surface-75 p-5">
          <p className="heading-meta text-foreground-lighter">A note on the menu</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {homepage.hero.description}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Allergies? Tell us at the counter. The kitchen is small and shares equipment,
            so we cannot guarantee an allergen-free environment.
          </p>
        </aside>
      </Container>
    </>
  );
}
