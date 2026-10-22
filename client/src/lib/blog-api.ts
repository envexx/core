import type { Language } from "./i18n";
import { articles } from "./blog-content";
import { services } from "./service-content";

export interface ApiArticleSource {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
}

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
  sources?: ApiArticleSource[];
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
  sources?: ApiArticleSource[];
}

const DEFAULT_API_BASE = "https://coresolution.digital/api";
const REQUEST_TIMEOUT_MS = 6000;

// The build prerenders from the API and embeds that payload in the page. Reading
// it back makes the first client render identical to the static markup, so the
// article never drops back to a spinner while the fetch is in flight.
export type BlogSeed = { list?: BlogListResponse; article?: ApiArticleDetail };
export const buildSeed: BlogSeed = {};

export function blogSeed(): BlogSeed {
  if (typeof document === "undefined") return buildSeed;
  const element = document.getElementById("blog-seed");
  if (!element?.textContent) return {};
  try {
    return JSON.parse(element.textContent) as BlogSeed;
  } catch {
    return {};
  }
}

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

  const sources =
    Array.isArray(item.sources) && item.sources.length > 0
      ? item.sources
          .filter((s) => s && typeof s.title === "string" && typeof s.url === "string")
          .map((s) => ({
            title: s.title,
            url: s.url,
            ...(s.publisher ? { publisher: s.publisher } : {}),
            ...(s.date ? { date: s.date } : {}),
          }))
      : undefined;

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
    ...(sources && sources.length > 0 ? { sources } : {}),
  };
}

// Dates must be part of the static HTML on both the index and the article page.
export function formatArticleDate(date: string | undefined, lang: Language): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
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
