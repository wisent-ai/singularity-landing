import type { MetadataRoute } from "next";
import site from "@/content/site.json";
import { docPages } from "@/lib/docs";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.domain, changeFrequency: "weekly", priority: 1 },
    { url: `${site.domain}/docs`, changeFrequency: "weekly", priority: 0.9 },
    ...docPages.map((page) => ({ url: `${site.domain}/docs/${page.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
