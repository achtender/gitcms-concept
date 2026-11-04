import type { ReactNode } from "react";

import { cn } from "../lib/cn";

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  size = "default",
  className,
}: {
  children: ReactNode;
  size?: keyof typeof widths;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", widths[size], className)}>
      {children}
    </div>
  );
}
