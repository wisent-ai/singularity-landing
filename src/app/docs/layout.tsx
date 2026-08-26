import Link from "next/link";
import { docPages } from "@/lib/docs";

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sections = Array.from(new Set(docPages.map((page) => page.section)));
  return <div className="docs-shell"><aside><Link href="/docs" className="docs-brand">Singularity / Docs</Link>{sections.map((section) => <nav key={section} aria-label={section}><strong>{section}</strong>{docPages.filter((page) => page.section === section).map((page) => <Link key={page.slug} href={`/docs/${page.slug}`}>{page.title}</Link>)}</nav>)}</aside><main>{children}</main></div>;
}
