import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocArticle from "@/components/DocArticle";
import { cliCommandPages } from "@/lib/cli-docs";
import { docPages, getDocPage } from "@/lib/docs";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return docPages.map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const page = getDocPage(slug);
  return page
    ? {
        title: page.title,
        description: page.summary,
        alternates: { canonical: `/docs/${slug}` },
        openGraph: { url: `/docs/${slug}` },
      }
    : {};
}

export default async function DocPage({ params }: Props) {
  const page = getDocPage((await params).slug.join("/"));
  if (!page) notFound();
  return (
    <div>
      <p className="eyebrow">{page.section}</p>
      <p className="docs-summary">{page.summary}</p>
      {page.sourcePath ? <p className="docs-source">Migrated from {page.sourcePath}</p> : null}
      {page.slug === "cli" ? (
        <section aria-labelledby="cli-command-tree">
          <h2 id="cli-command-tree">Command tree</h2>
          <div className="docs-grid">
            {cliCommandPages.map((command) => (
              <Link key={command.slug} href={`/docs/${command.slug}`}>
                <small>Command</small>
                <h3>{command.title}</h3>
                <p>{command.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <DocArticle source={page.source} />
    </div>
  );
}
