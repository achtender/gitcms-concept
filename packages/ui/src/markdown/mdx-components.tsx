import Link from "next/link";
import type { ComponentPropsWithoutRef, ComponentType } from "react";

import { Callout } from "../components/callout";

export type MarkdownComponents = Record<string, ComponentType<any>>;

function Anchor({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  const isExternal = /^(https?:)?\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

function Image({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) {
  return <img alt={alt} loading="lazy" {...props} />;
}

/**
 * Defaults available to every MDX file. Site-specific components can be passed
 * to <Mdx components={...} /> and are merged on top of these.
 */
export const mdxComponents: MarkdownComponents = {
  a: Anchor,
  img: Image,
  Callout,
};
