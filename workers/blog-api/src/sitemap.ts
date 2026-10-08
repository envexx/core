import { categories, listArticles, listServices } from "./content";
import { absolute } from "./url";
import type { SeoConfig } from "./seo";

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
};

export function buildSitemapEntries(config: SeoConfig): SitemapEntry[] {
  const fallbackLastmod = config.siteLastModified;
  const page = (
    path: string,
    changefreq: string,
    priority: string,
    lastmod = fallbackLastmod,
  ): SitemapEntry => ({ path, changefreq, priority, ...(lastmod ? { lastmod } : {}) });

  return [
    page("/", "weekly", "1.0"),
    page("/services", "monthly", "0.9"),
    page("/blog", "weekly", "0.9"),
    ...categories.map((category) =>
      page(`/blog/kategori/${category.slug}`, "weekly", "0.6"),
    ),
    ...listServices("id").map((service) => page(service.path, "monthly", "0.8")),
    ...listArticles("id").map((article) =>
      page(article.path, "monthly", "0.8", article.date ?? fallbackLastmod),
    ),
  ];
}

export function buildSitemap(config: SeoConfig): string {
  const urls = buildSitemapEntries(config)
    .map((entry) => {
      const lines = [`    <loc>${escapeXml(absolute(config.siteUrl, entry.path))}</loc>`];
      if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      lines.push(`    <priority>${entry.priority}</priority>`);
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function buildRobots(config: SeoConfig): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${absolute(config.siteUrl, "/sitemap.xml")}`,
    "",
  ].join("\n");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
