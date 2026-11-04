import type { Metadata } from "next";

import { ButtonLink, Container, Cover, PageHeader } from "@repo/ui";

import { getLocations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Locations",
  description: "The two Mise rooms: Downtown and Harbour. Addresses, opening hours, and contact details.",
};

export default function LocationsPage() {
  const locations = getLocations();

  return (
    <>
      <PageHeader
        eyebrow="Locations"
        title="Two rooms, one kitchen"
        description="Both rooms serve the same coffee and pastry. Only Downtown serves lunch and has the back room."
        meta={<span>{locations.length} locations</span>}
      />

      <Container>
        <div className="grid gap-6 py-12 lg:grid-cols-2">
          {locations.map((location) => (
            <article
              key={location.slug}
              id={location.slug}
              className="scroll-mt-24 rounded-lg border border-border bg-surface-75 p-6"
            >
              <Cover
                title={location.data.name}
                seed={location.slug}
                ratio="wide"
                className="mb-5"
              />
              <p className="heading-meta text-foreground-lighter">
                {location.data.neighborhood}
              </p>
              <h2 className="mt-2 text-xl font-medium tracking-tight">
                {location.data.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {location.body.split("\n")[0]}
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="heading-meta text-foreground-lighter">Address</p>
                  <address className="mt-2 not-italic text-sm leading-relaxed text-muted-foreground">
                    <span className="block">{location.data.street}</span>
                    <span className="block">
                      {location.data.city} {location.data.postalCode}
                    </span>
                  </address>
                  {location.data.phone ? (
                    <a
                      href={`tel:${location.data.phone.replace(/\s/g, "")}`}
                      className="text-link mt-3 inline-flex text-sm"
                    >
                      {location.data.phone}
                    </a>
                  ) : null}
                </div>

                <div>
                  <p className="heading-meta text-foreground-lighter">Hours</p>
                  <dl className="mt-2 space-y-1.5">
                    {location.data.hours.map((row) => (
                      <div
                        key={row.days}
                        className="flex justify-between gap-4 text-sm"
                      >
                        <dt className="text-muted-foreground">{row.days}</dt>
                        <dd className="font-mono text-xs text-foreground">
                          {row.hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {location.data.mapsUrl ? (
                <ButtonLink
                  href={location.data.mapsUrl}
                  variant="secondary"
                  size="sm"
                  external
                  className="mt-6"
                >
                  Open in maps
                </ButtonLink>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
