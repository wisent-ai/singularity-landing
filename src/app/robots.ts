import type { MetadataRoute } from "next";

import site from "@/content/site.json";
import type { SiteContent } from "@/content/types";

const content = site as SiteContent;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: content.domain + "/sitemap.xml",
  };
}
