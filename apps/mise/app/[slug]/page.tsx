import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { formatDate } from "@repo/content";
import { Container, Mdx, PageHeader } from "@repo/ui";

import { getPage, getPages } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <article>
      <PageHeader
        title={page.data.title}
        description={page.data.description}
        meta={
          page.data.updated ? (
            <span>Updated {formatDate(page.data.updated)}</span>
          ) : undefined
        }
      />
      <Container size="narrow">
        <div className="py-12">
          <Mdx source={page.body} />
        </div>
      </Container>
    </article>
  );
}
