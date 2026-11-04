import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentType } from "react";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { cn } from "../lib/cn";
import { mdxComponents, type MarkdownComponents } from "./mdx-components";

export type MdxProps = {
  source: string;
  /** Extra components merged over the defaults (for example a site Callout). */
  components?: MarkdownComponents;
  className?: string;
};

/**
 * Server-side MDX renderer. Heading IDs come from rehype-slug, which uses the
 * same GitHub-style slugger as getHeadings() in @repo/content, so the table of
 * contents links line up with the rendered document.
 */
export async function Mdx({ source, components, className }: MdxProps) {
  return (
    <div className={cn("prose", className)}>
      <MDXRemote
        source={source}
        components={{ ...mdxComponents, ...components }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: {
                    light: "github-light",
                    dark: "github-dark",
                  },
                  keepBackground: false,
                  bypassInlineCode: true,
                  defaultLang: "txt",
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}

/** Convenience type for site-level component maps. */
export type MdxComponentMap = Record<string, ComponentType<any>>;
