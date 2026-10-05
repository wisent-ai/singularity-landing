import type { MetadataRoute } from "next";
import site from "@/content/site.json";
import { docPages } from "@/lib/docs";
// URLs only: priority and changefreq are optional in the sitemaps.org protocol,
// Google ignores both, and nobody stated values for them.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.domain },
    { url: `${site.domain}/docs` },
    ...docPages.map((page) => ({ url: `${site.domain}/docs/${page.slug}` })),
  ];
}
