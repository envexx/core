import type { Language } from "./i18n";
import { articles } from "./blog-content";
import { services } from "./service-content";

export interface ApiArticleSummary {
  slug: string;
  path: string;
  title: string;
  category: "AI Systems" | "Automation" | "Case Studies" | string;
  categorySlug?: string;
  excerpt: string;
  readTime: number;
  date: string;
  updatedAt?: string;
  lang: Language;
  url?: string;
  imageUrl?: string;
  imageAlt?: string;
  isDynamic?: boolean;
}

export interface ApiArticleSection {
  id?: string;
  heading: string;
  paragraphs: string[];
  points?: string[];
  links?: { slug: string; label: string; path?: string }[];
}

export interface ApiArticleService {
  slug: string;
  name: string;
  path?: string;
}

export interface ApiArticleDetail extends ApiArticleSummary {
  sections: ApiArticleSection[];
  takeaway?: string;
  takeaways?: string[];
  relatedServices?: string[];
  service?: ApiArticleService | string;
  diagram?: string[];
}

export interface BlogListResponse {
  count: number;
  lang: Language;
  items: ApiArticleSummary[];
}

export interface ArticleView {
  slug: string;
  title: string;
  excerpt: string;
  category: "AI Systems" | "Automation" | "Case Studies" | string;
  readTime: number;
  date?: string;
  imageUrl?: string;
  imageAlt?: string;
  diagram?: string[];
  sections?: ApiArticleSection[];
  takeaway?: string;
  service?: ApiArticleService;
}

const DEFAULT_API_BASE = "https://coresolution.digital/api";
const REQUEST_TIMEOUT_MS = 6000;

export function getBlogApiBase(): string {
  const envBase = (import.meta as unknown as { env?: { VITE_BLOG_API_BASE?: string } })
    .env?.VITE_BLOG_API_BASE;
  const base = (envBase || DEFAULT_API_BASE).trim();
  return base.replace(/\/+$/, "");
}

async function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const forwardAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timer);
      controller.abort();
    } else {
      signal.addEventListener("abort", forwardAbort, { once: true });
    }
  }

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res;
  } finally {
    clearTimeout(timer);
    if (signal) {
      signal.removeEventListener("abort", forwardAbort);
    }
  }
}

export async function fetchBlogList(
  lang: Language,
  signal?: AbortSignal,
): Promise<BlogListResponse> {
  const base = getBlogApiBase();
  const url = `${base}/blog?lang=${encodeURIComponent(lang)}`;
  const res = await fetchWithTimeout(url, signal);
  return (await res.json()) as BlogListResponse;
}

export async function fetchBlogArticle(
  slug: string,
  lang: Language,
  signal?: AbortSignal,
): Promise<ApiArticleDetail> {
  const base = getBlogApiBase();
  const url = `${base}/blog/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`;
  const res = await fetchWithTimeout(url, signal);
  return (await res.json()) as ApiArticleDetail;
}

export function normalizeStaticSummary(
  item: (typeof articles)[number],
  lang: Language,
): ArticleView {
  return {
    slug: item.slug,
    title: item.title[lang] || item.title.id,
    excerpt: item.excerpt[lang] || item.excerpt.id,
    category: item.category,
    readTime: item.readTime,
    date: item.date,
  };
}

export function normalizeApiSummary(item: ApiArticleSummary): ArticleView {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    readTime: item.readTime,
    date: item.date,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
  };
}

function resolveService(serviceRef?: ApiArticleService | string): ApiArticleService | undefined {
  if (!serviceRef) return undefined;
  if (typeof serviceRef === "object" && serviceRef.name && serviceRef.slug) {
    return {
      slug: serviceRef.slug,
      name: serviceRef.name,
      path: serviceRef.path || `/services/${serviceRef.slug}`,
    };
  }
  if (typeof serviceRef === "string") {
    const match = services.find((s) => s.slug === serviceRef);
    if (match) {
      return {
        slug: match.slug,
        name: match.name,
        path: `/services/${match.slug}`,
      };
    }
    return {
      slug: serviceRef,
      name: serviceRef,
      path: `/services/${serviceRef}`,
    };
  }
  return undefined;
}

export function normalizeStaticDetail(
  item: (typeof articles)[number],
  lang: Language,
): ArticleView {
  return {
    slug: item.slug,
    title: item.title[lang] || item.title.id,
    excerpt: item.excerpt[lang] || item.excerpt.id,
    category: item.category,
    readTime: item.readTime,
    date: item.date,
    diagram: item.diagram,
    sections: item.sections.map((section, index) => ({
      id: `section-${index + 1}`,
      heading: section.heading[lang] || section.heading.id,
      paragraphs: section.paragraphs.map((p) => p[lang] || p.id),
      points: section.points?.map((pt) => pt[lang] || pt.id),
      links: section.links?.map((l) => ({
        slug: l.slug,
        label: l.label[lang] || l.label.id,
        path: `/blog/${l.slug}`,
      })),
    })),
    takeaway: item.takeaway[lang] || item.takeaway.id,
    service: resolveService(item.service),
  };
}

export function normalizeApiDetail(item: ApiArticleDetail): ArticleView {
  const takeaway =
    item.takeaway ||
    (Array.isArray(item.takeaways) && item.takeaways.length > 0
      ? item.takeaways.join("\n\n")
      : undefined);

  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    readTime: item.readTime,
    date: item.date,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    diagram: item.diagram,
    sections: (item.sections || []).map((sec, idx) => ({
      id: sec.id || `section-${idx + 1}`,
      heading: sec.heading,
      paragraphs: Array.isArray(sec.paragraphs) ? sec.paragraphs : [],
      points: sec.points,
      links: sec.links,
    })),
    takeaway,
    service: resolveService(item.service),
  };
}

export function sortArticles(list: ArticleView[]): ArticleView[] {
  return [...list].sort((a, b) => {
    const isCaseA = a.category === "Case Studies" ? 1 : 0;
    const isCaseB = b.category === "Case Studies" ? 1 : 0;
    if (isCaseA !== isCaseB) return isCaseB - isCaseA;
    const dateA = a.date || "";
    const dateB = b.date || "";
    return dateB.localeCompare(dateA);
  });
}
