// Content adapter.
//
// Single source of truth: the frontend content modules. We import them directly
// at build time (wrangler/esbuild bundles them) instead of duplicating text here.
// If these imports ever stop being bundleable, run a build step that copies the
// two files into this folder and point the imports at the copies.
import {
  articles as sourceArticles,
  pillarSlug,
  blogCategories,
} from "../../../client/src/lib/blog-content";
import {
  services as sourceServices,
  type LocalCopy,
} from "../../../client/src/lib/service-content";

export type Lang = "id" | "en";
export const LANGS: readonly Lang[] = ["id", "en"] as const;
export const DEFAULT_LANG: Lang = "id";

export function parseLang(value: string | null | undefined): Lang {
  return value === "en" ? "en" : DEFAULT_LANG;
}

function pick(value: LocalCopy, lang: Lang): string {
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

function categorySlug(category: string): string {
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

function toSummary(article: (typeof sourceArticles)[number], lang: Lang): ArticleSummary {
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
  };
}

export function listArticles(lang: Lang = DEFAULT_LANG): ArticleSummary[] {
  return sourceArticles.map((article) => toSummary(article, lang));
}

export function getArticle(slug: string, lang: Lang = DEFAULT_LANG): ArticleDetail | null {
  const article = sourceArticles.find((item) => item.slug === slug);
  if (!article) return null;

  const related = sourceServices.find((item) => item.slug === article.service) ?? null;
  const takeaway = pick(article.takeaway, lang);

  return {
    ...toSummary(article, lang),
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
    diagram: article.diagram,
    availableLangs: LANGS,
  };
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
