import type { ReactNode } from "react";

import { cn } from "../lib/cn";

const variants = {
  note: "border-border-strong bg-surface-75",
  tip: "border-primary/40 bg-primary/5",
  warning: "border-warning/50 bg-warning/10",
  destructive: "border-destructive/40 bg-destructive/5",
} as const;

const labels = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  destructive: "Important",
} as const;

export function Callout({
  children,
  title,
  variant = "note",
  className,
}: {
  children: ReactNode;
  title?: string;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "my-6 rounded-md border border-l-2 p-4 text-sm leading-relaxed text-muted-foreground",
        variants[variant],
        className,
      )}
    >
      <p className="heading-meta text-foreground">{title ?? labels[variant]}</p>
      <div className="mt-2 space-y-2 [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </aside>
  );
}
