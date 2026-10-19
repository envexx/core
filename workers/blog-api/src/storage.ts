// R2 dynamic article storage adapter.
//
// Key layout in R2:
//   articles/<slug>.json  -> Serialized dynamic article payload
//
// Dynamic articles augment hardcoded static articles seamlessly.

import type { LocalCopy } from "../../../client/src/lib/service-content";
import type { Lang } from "./content";

export const ALLOWED_CATEGORIES = ["AI Systems", "Automation", "Case Studies"] as const;
export type BlogCategory = (typeof ALLOWED_CATEGORIES)[number];

export type DynamicArticleSection = {
  heading: LocalCopy;
  paragraphs: LocalCopy[];
  points?: LocalCopy[];
  links?: { slug: string; label: LocalCopy }[];
};

export type DynamicArticle = {
  slug: string;
  category: BlogCategory;
  readTime: number;
  date: string; // ISO YYYY-MM-DD
  title: LocalCopy;
  excerpt: LocalCopy;
  diagram: string[];
  sections: DynamicArticleSection[];
  takeaway: LocalCopy;
  service: string;
  imageUrl?: string;
  imageAlt?: LocalCopy;
  createdAt?: string;
  updatedAt?: string;
};

const R2_PREFIX = "articles/";

function articleKey(slug: string): string {
  return `${R2_PREFIX}${slug}.json`;
}

export async function getDynamicArticle(
  bucket: R2Bucket | undefined,
  slug: string,
): Promise<DynamicArticle | null> {
  if (!bucket) return null;
  const object = await bucket.get(articleKey(slug));
  if (!object) return null;
  try {
    const raw = await object.text();
    return JSON.parse(raw) as DynamicArticle;
  } catch {
    return null;
  }
}

export async function putDynamicArticle(
  bucket: R2Bucket,
  article: DynamicArticle,
): Promise<void> {
  const key = articleKey(article.slug);
  await bucket.put(key, JSON.stringify(article, null, 2), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
    customMetadata: {
      slug: article.slug,
      category: article.category,
      updatedAt: article.updatedAt || new Date().toISOString(),
    },
  });
}

export async function deleteDynamicArticle(
  bucket: R2Bucket,
  slug: string,
): Promise<boolean> {
  const key = articleKey(slug);
  const exists = await bucket.head(key);
  if (!exists) return false;
  await bucket.delete(key);
  return true;
}

export async function listDynamicArticles(
  bucket: R2Bucket | undefined,
): Promise<DynamicArticle[]> {
  if (!bucket) return [];
  const listed = await bucket.list({ prefix: R2_PREFIX });
  const articles: DynamicArticle[] = [];
  for (const obj of listed.objects) {
    if (!obj.key.endsWith(".json")) continue;
    const item = await bucket.get(obj.key);
    if (!item) continue;
    try {
      const raw = await item.text();
      articles.push(JSON.parse(raw) as DynamicArticle);
    } catch {
      // Skip malformed records
    }
  }
  return articles;
}
