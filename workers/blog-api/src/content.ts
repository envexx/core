// Content adapter.
//
// Single source of truth: frontend content modules + optional R2 dynamic store.
// Dynamic articles override or append to static articles.

import {
  articles as sourceArticles,
  pillarSlug,
  blogCategories,
} from "../../../client/src/lib/blog-content";
import {
  services as sourceServices,
  type LocalCopy,
} from "../../../client/src/lib/service-content";
import {
  getDynamicArticle,
  listDynamicArticles,
  type DynamicArticle,
} from "./storage";

export type Lang = "id" | "en";
export const LANGS: readonly Lang[] = ["id", "en"] as const;
export const DEFAULT_LANG: Lang = "id";

export function parseLang(value: string | null | undefined): Lang {
  return value === "en" ? "en" : DEFAULT_LANG;
}

export function pick(value: LocalCopy, lang: Lang): string {
  return value[lang] ?? value.id;
}

export const pillar = pillarSlug;

export type Category = { slug: string; category: string };
export const categories: Category[] = blogCategories.map((item) => ({
  slug: item.slug,
  category: item.category,
}));

export function categoryLabel(category: string, lang: Lang): string {
  if (category === "Case Studies") {
    return lang === "id" ? "Studi kasus" : "Case studies";
  }
  return category;
}

export function categorySlug(category: string): string {
  const match = blogCategories.find((item) => item.category === category);
  return match ? match.slug : category.toLowerCase().replace(/\s+/g, "-");
}

export type ArticleSummary = {
  slug: string;
  path: string;
  title: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  readTime: number;
  date: string | null;
  lang: Lang;
  imageUrl?: string;
  imageAlt?: string;
  isDynamic?: boolean;
};

export type ArticleLinkRef = { slug: string; label: string; path: string };

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  points: string[];
  links: ArticleLinkRef[];
};

export type RelatedService = { slug: string; name: string; path: string };

export type ArticleDetail = ArticleSummary & {
  sections: ArticleSection[];
  takeaway: string;
  takeaways: string[];
  relatedServices: string[];
  service: RelatedService | null;
  diagram: string[];
  availableLangs: readonly Lang[];
};

export type ServiceSummary = {
  slug: string;
  name: string;
  path: string;
  title: string;
  intro: string;
  lang: Lang;
};

type GenericArticle = (typeof sourceArticles)[number] | DynamicArticle;

function toSummary(article: GenericArticle, lang: Lang, isDynamic = false): ArticleSummary {
  const hasImage = "imageUrl" in article && typeof article.imageUrl === "string";
  const hasImageAlt = "imageAlt" in article && article.imageAlt;
  return {
    slug: article.slug,
    path: `/blog/${article.slug}`,
    title: pick(article.title, lang),
    category: article.category,
    categorySlug: categorySlug(article.category),
    excerpt: pick(article.excerpt, lang),
    readTime: article.readTime,
    date: article.date ?? null,
    lang,
    ...(hasImage ? { imageUrl: (article as DynamicArticle).imageUrl } : {}),
    ...(hasImageAlt ? { imageAlt: pick((article as DynamicArticle).imageAlt!, lang) } : {}),
    ...(isDynamic ? { isDynamic: true } : {}),
  };
}

export function toDetail(article: GenericArticle, lang: Lang, isDynamic = false): ArticleDetail {
  const related = sourceServices.find((item) => item.slug === article.service) ?? null;
  const takeaway = pick(article.takeaway, lang);

  return {
    ...toSummary(article, lang, isDynamic),
    sections: article.sections.map((section, index) => ({
      id: `section-${index + 1}`,
      heading: pick(section.heading, lang),
      paragraphs: section.paragraphs.map((paragraph) => pick(paragraph, lang)),
      points: (section.points ?? []).map((point) => pick(point, lang)),
      links: (section.links ?? []).map((link) => ({
        slug: link.slug,
        label: pick(link.label, lang),
        path: `/blog/${link.slug}`,
      })),
    })),
    takeaway,
    takeaways: [takeaway],
    relatedServices: related ? [related.slug] : [],
    service: related
      ? { slug: related.slug, name: related.name, path: `/services/${related.slug}` }
      : null,
    diagram: article.diagram || [],
    availableLangs: LANGS,
  };
}

/** Synchronous fallback: only static articles */
export function listArticles(lang: Lang = DEFAULT_LANG): ArticleSummary[] {
  return sourceArticles.map((article) => toSummary(article, lang, false));
}

/** Merged list: dynamic R2 articles + static fallback, ordered by date descending */
export async function listAllArticles(
  bucket: R2Bucket | undefined,
  lang: Lang = DEFAULT_LANG,
): Promise<ArticleSummary[]> {
  const dynamic = await listDynamicArticles(bucket);
  const dynamicSlugs = new Set(dynamic.map((d) => d.slug));

  const items: ArticleSummary[] = [];

  // Add dynamic articles
  for (const d of dynamic) {
    items.push(toSummary(d, lang, true));
  }

  // Add static articles that are not overridden by dynamic
  for (const s of sourceArticles) {
    if (!dynamicSlugs.has(s.slug)) {
      items.push(toSummary(s, lang, false));
    }
  }

  // Sort by date descending
  items.sort((a, b) => {
    const da = a.date || "";
    const db = b.date || "";
    return db.localeCompare(da);
  });

  return items;
}

/** Synchronous fallback: lookup single static article */
export function getArticle(slug: string, lang: Lang = DEFAULT_LANG): ArticleDetail | null {
  const article = sourceArticles.find((item) => item.slug === slug);
  if (!article) return null;
  return toDetail(article, lang, false);
}

/** Lookup dynamic article in R2 first, fall back to static */
export async function findArticle(
  bucket: R2Bucket | undefined,
  slug: string,
  lang: Lang = DEFAULT_LANG,
): Promise<ArticleDetail | null> {
  const dyn = await getDynamicArticle(bucket, slug);
  if (dyn) {
    return toDetail(dyn, lang, true);
  }
  return getArticle(slug, lang);
}

function toServiceSummary(service: (typeof sourceServices)[number], lang: Lang): ServiceSummary {
  return {
    slug: service.slug,
    name: service.name,
    path: `/services/${service.slug}`,
    title: pick(service.title, lang),
    intro: pick(service.intro, lang),
    lang,
  };
}

export function listServices(lang: Lang = DEFAULT_LANG): ServiceSummary[] {
  return sourceServices.map((service) => toServiceSummary(service, lang));
}

export function getService(slug: string, lang: Lang = DEFAULT_LANG): ServiceSummary | null {
  const service = sourceServices.find((item) => item.slug === slug);
  return service ? toServiceSummary(service, lang) : null;
}
