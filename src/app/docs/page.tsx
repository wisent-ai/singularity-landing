import type { Metadata } from "next";
import Link from "next/link";
import { docPages } from "@/lib/docs";

export const metadata: Metadata = { title: "Documentation", description: "Singularity runtime, being, finance, skills, operations, and benchmark documentation." };
export default function DocsPage() {
  return <div className="docs-index"><p className="eyebrow">Singularity documentation</p><h1>Operate a persistent digital being.</h1><p>Start with the runtime model, then follow the contracts for identity, mind, finance, skills, child beings, operations, and qualification.</p><div className="docs-grid">{docPages.map((page) => <Link key={page.slug} href={`/docs/${page.slug}`}><small>{page.section}</small><h2>{page.title}</h2><p>{page.summary}</p></Link>)}</div></div>;
}
