// R2 dynamic article storage adapter.
//
// Key layout in R2:
//   articles/<slug>.json  -> Serialized dynamic article payload
//   articles/index.json   -> Compact summary index of all dynamic articles
//
// Dynamic articles augment hardcoded static articles seamlessly.

import type { LocalCopy } from "../../../client/src/lib/service-content";

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
const INDEX_KEY = "articles/index.json";

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
  } catch (err) {
    console.error(`Failed to parse dynamic article "${slug}":`, err);
    return null;
  }
}

async function rebuildIndex(bucket: R2Bucket): Promise<DynamicArticle[]> {
  const articles: DynamicArticle[] = [];
  let cursor: string | undefined = undefined;

  do {
    const listed: R2Objects = await bucket.list({
      prefix: R2_PREFIX,
      cursor,
    });

    for (const obj of listed.objects) {
      if (obj.key === INDEX_KEY || !obj.key.endsWith(".json")) continue;
      const item = await bucket.get(obj.key);
      if (!item) continue;
      try {
        const raw = await item.text();
        articles.push(JSON.parse(raw) as DynamicArticle);
      } catch (err) {
        console.error(`Failed to parse article object "${obj.key}":`, err);
      }
    }

    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  await writeIndex(bucket, articles);
  return articles;
}

async function writeIndex(bucket: R2Bucket, articles: DynamicArticle[]): Promise<void> {
  await bucket.put(INDEX_KEY, JSON.stringify(articles), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  });
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

  // Update index
  const current = await listDynamicArticles(bucket);
  const filtered = current.filter((a) => a.slug !== article.slug);
  filtered.push(article);
  await writeIndex(bucket, filtered);
}

export async function deleteDynamicArticle(
  bucket: R2Bucket,
  slug: string,
): Promise<boolean> {
  const key = articleKey(slug);
  const exists = await bucket.head(key);
  if (!exists) return false;
  await bucket.delete(key);

  // Update index
  const current = await listDynamicArticles(bucket);
  const filtered = current.filter((a) => a.slug !== slug);
  await writeIndex(bucket, filtered);

  return true;
}

export async function listDynamicArticles(
  bucket: R2Bucket | undefined,
): Promise<DynamicArticle[]> {
  if (!bucket) return [];

  const indexObj = await bucket.get(INDEX_KEY);
  if (indexObj) {
    try {
      const raw = await indexObj.text();
      return JSON.parse(raw) as DynamicArticle[];
    } catch (err) {
      console.error("Index file corrupt, rebuilding from bucket:", err);
    }
  }

  return await rebuildIndex(bucket);
}
