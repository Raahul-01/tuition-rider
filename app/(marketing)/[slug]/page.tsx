import { notFound } from "next/navigation";
import { allPages } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";

import "@/styles/mdx.css";

import { Metadata } from "next";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPageFromParams(params: PageProps['params']) {
  const slug = params?.slug;
  const page = allPages.find((page) => page._raw.flattenedPath === slug);

  if (!page) {
    null;
  }

  return page;
}

export async function generateStaticParams(): Promise<PageProps['params'][]> {
  return allPages.map((page) => ({
    slug: page._raw.flattenedPath,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const page = allPages.find((page) => page.slugAsParams === params.slug);
  if (!page) {
    return;
  }

  const { title, description } = page;

  return constructMetadata({
    title: `${title} – tuition_rider_website`,
    description: description,
  });
}

export default async function Page({ params }: PageProps) {
  const page = await getPageFromParams(params);

  if (!page) {
    notFound();
  }

  const images = await Promise.all(
    page.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    })),
  );

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{page.title}</h1>
        {page.description && (
          <p className="text-xl text-muted-foreground">
            {page.description}
          </p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx code={page.body.code} />
    </article>
  );
}
