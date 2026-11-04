export function SkipLink({ href = "#main", label = "Skip to content" }) {
  return (
    <a
      href={href}
      className="sr-only rounded-md border border-border-strong bg-overlay px-3 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
    >
      {label}
    </a>
  );
}
