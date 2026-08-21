import type { MetadataRoute } from "next";

import site from "@/content/site.json";
import type { SiteContent } from "@/content/types";

const content = site as SiteContent;

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: content.domain, changeFrequency: "weekly", priority: 1 }];
}
