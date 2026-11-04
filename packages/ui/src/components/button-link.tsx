import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "border border-border-strong bg-surface-75 text-foreground hover:bg-surface-200",
  ghost: "text-foreground hover:bg-surface-100",
} as const;

const sizes = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-9 gap-2 px-4 text-sm",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  external?: boolean;
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    variants[variant],
    sizes[size],
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
