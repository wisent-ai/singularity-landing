import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocArticle from "@/components/DocArticle";
import { docPages, getDocPage } from "@/lib/docs";

type Props = { params: Promise<{ slug: string[] }> };
export function generateStaticParams() { return docPages.map((page) => ({ slug: page.slug.split("/") })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = getDocPage((await params).slug.join("/")); return page ? { title: page.title, description: page.summary } : {}; }
export default async function DocPage({ params }: Props) {
  const page = getDocPage((await params).slug.join("/"));
  if (!page) notFound();
  return <div><p className="eyebrow">{page.section}</p><p className="docs-summary">{page.summary}</p><p className="docs-source">Migrated from {page.sourcePath}</p><DocArticle source={page.source} /></div>;
}
