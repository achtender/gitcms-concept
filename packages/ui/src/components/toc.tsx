import { cn } from "../lib/cn";

export type TocHeading = {
  depth: number;
  text: string;
  id: string;
};

export function Toc({
  headings,
  label = "On this page",
  className,
}: {
  headings: TocHeading[];
  label?: string;
  className?: string;
}) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label} className={cn("text-sm", className)}>
      <p className="heading-meta text-foreground-lighter">{label}</p>
      <ul className="mt-3 space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "toc-link",
                heading.depth === 3 ? "pl-6 text-xs" : "text-sm",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
