import type { ReactNode } from "react";

import { cn } from "../lib/cn";

const variants = {
  default: "border-border bg-surface-100 text-muted-foreground",
  primary: "border-primary/30 bg-primary/10 text-primary",
  solid: "border-transparent bg-primary text-primary-foreground",
  outline: "border-border-strong bg-transparent text-foreground",
} as const;

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
