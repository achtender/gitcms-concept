import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Container } from "./container";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-border bg-surface-75", className)}>
      <Container>
        <div className="py-12 sm:py-16">
          {eyebrow ? (
            <p className="heading-meta text-foreground-lighter">{eyebrow}</p>
          ) : null}
          <h1 className="display-section mt-3">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          {meta ? (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {meta}
            </div>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
