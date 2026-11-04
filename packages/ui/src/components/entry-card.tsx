import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Badge } from "./badge";
import { Cover } from "./cover";

export function EntryCard({
  href,
  title,
  description,
  meta,
  badge,
  image,
  seed,
  cover = true,
  className,
}: {
  href: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  badge?: string;
  image?: string;
  seed?: string;
  cover?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg border border-border bg-surface-75 transition-colors hover:border-border-strong",
        className,
      )}
    >
      <Link
        href={href}
        className="flex h-full flex-col rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {cover ? (
          <Cover
            title={title}
            seed={seed ?? href}
            image={image}
            className="rounded-none border-0 border-b border-border"
          />
        ) : null}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            {badge ? <Badge variant="primary">{badge}</Badge> : null}
            {meta ? (
              <span className="text-xs text-foreground-lighter">{meta}</span>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-medium tracking-tight text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
            Read
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
