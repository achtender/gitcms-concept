"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../lib/cn";
import type { NavItem } from "../types";
import { ButtonLink } from "./button-link";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  siteName,
  homeHref = "/",
  navigation,
  action,
}: {
  siteName: string;
  homeHref?: string;
  navigation: NavItem[];
  action?: { label: string; href: string };
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link
            href={homeHref}
            className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-[11px] font-semibold text-primary-foreground">
              {siteName.charAt(0)}
            </span>
            <span className="text-sm font-medium tracking-tight">{siteName}</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-surface-100 text-foreground"
                    : "text-muted-foreground hover:bg-surface-75 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {action ? (
              <ButtonLink href={action.href} size="sm" className="hidden sm:inline-flex">
                {action.label}
              </ButtonLink>
            ) : null}
            <ThemeToggle />
          </div>
        </div>

        <nav
          aria-label="Primary mobile"
          className="-mx-1 flex items-center gap-1 overflow-x-auto pb-2 md:hidden"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                isActive(pathname, item.href)
                  ? "bg-surface-100 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
