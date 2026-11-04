import Link from "next/link";
import type { ReactNode } from "react";

import type { NavColumn } from "../types";
import { Container } from "./container";

export function SiteFooter({
  siteName,
  tagline,
  columns = [],
  note,
  meta,
}: {
  siteName: string;
  tagline?: string;
  columns?: NavColumn[];
  note?: string;
  meta?: ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-surface-75">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-[11px] font-semibold text-primary-foreground">
                {siteName.charAt(0)}
              </span>
              <span className="text-sm font-medium tracking-tight">{siteName}</span>
            </Link>
            {tagline ? (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {tagline}
              </p>
            ) : null}
            {note ? <p className="mt-4 max-w-sm text-xs text-foreground-lighter">{note}</p> : null}
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="heading-meta text-foreground-lighter">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.href}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-6 text-xs text-foreground-lighter sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}. Built with Next.js and GitCMS.
          </p>
          {meta}
        </div>
      </Container>
    </footer>
  );
}
