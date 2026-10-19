// Validation utilities for blog write operations.
//
// Rules:
// - Slug: lowercase kebab-case alphanumeric [a-z0-9]+(-[a-z0-9]+)*, no path traversal (.., /, \)
// - Category: must be one of ALLOWED_CATEGORIES ("AI Systems" | "Automation" | "Case Studies")
// - Date: ISO 8601 YYYY-MM-DD (exact calendar date, leap-year aware)
// - Title, Excerpt, Takeaway: LocalCopy with non-empty "id" and "en"
// - Sections: array of 1+ sections, each with valid heading and 1+ paragraphs
// - Image upload: max 5 MB, whitelist MIME image/jpeg, image/png, image/webp
// - Sources: optional array of <= 10 items, each with non-empty title, http/https url, optional publisher, optional ISO YYYY-MM-DD date

import {
  ALLOWED_CATEGORIES,
  type ArticleSource,
  type BlogCategory,
  type DynamicArticle,
} from "./storage";
import type { LocalCopy } from "../../../client/src/lib/service-content";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== "string") return false;
  if (slug.length < 3 || slug.length > 120) return false;
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function isValidIsoDate(date: string): boolean {
  if (!date || typeof date !== "string") return false;
  const match = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(date);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Calendar validation: UTC avoids timezone roll-over
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
}

export function isValidHttpUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== "string") return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function isLocalCopy(val: unknown): val is LocalCopy {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return isNonEmptyString(obj.id) && isNonEmptyString(obj.en);
}

export function validateArticlePayload(
  raw: unknown,
  expectedSlug?: string,
): ValidationResult<DynamicArticle> {
  const errors: string[] = [];

  if (!raw || typeof raw !== "object") {
    return { success: false, errors: ["Request body must be a JSON object"] };
  }

  const body = raw as Record<string, unknown>;

  const slug = (body.slug || expectedSlug) as string;
  if (!isValidSlug(slug)) {
    errors.push(
      "slug must be 3-120 characters, lowercase kebab-case alphanumeric (e.g., 'alur-automasi-baru')",
    );
  }
  if (expectedSlug && slug !== expectedSlug) {
    errors.push(`slug in body ('${slug}') does not match URL slug ('${expectedSlug}')`);
  }

  if (!ALLOWED_CATEGORIES.includes(body.category as BlogCategory)) {
    errors.push(
      `category must be one of: ${ALLOWED_CATEGORIES.map((c) => `'${c}'`).join(", ")}`,
    );
  }

  if (typeof body.readTime !== "number" || body.readTime < 1 || body.readTime > 120) {
    errors.push("readTime must be a positive number of minutes (1-120)");
  }

  if (!isValidIsoDate(body.date as string)) {
    errors.push("date must be a valid ISO 8601 calendar date (YYYY-MM-DD)");
  }

  if (!isLocalCopy(body.title)) {
    errors.push("title must be an object with non-empty 'id' and 'en' strings");
  }

  if (!isLocalCopy(body.excerpt)) {
    errors.push("excerpt must be an object with non-empty 'id' and 'en' strings");
  }

  if (!isLocalCopy(body.takeaway)) {
    errors.push("takeaway must be an object with non-empty 'id' and 'en' strings");
  }

  if (!isNonEmptyString(body.service)) {
    errors.push("service must be a non-empty string identifier (e.g. 'workflow-automation')");
  }

  if (body.diagram !== undefined) {
    if (
      !Array.isArray(body.diagram) ||
      !body.diagram.every((d) => typeof d === "string" && d.trim().length > 0)
    ) {
      errors.push("diagram must be an array of non-empty strings");
    }
  }

  if (!Array.isArray(body.sections) || body.sections.length === 0) {
    errors.push("sections must be a non-empty array of section objects");
  } else {
    body.sections.forEach((s, idx) => {
      if (!s || typeof s !== "object") {
        errors.push(`sections[${idx}] must be an object`);
        return;
      }
      const sec = s as Record<string, unknown>;
      if (!isLocalCopy(sec.heading)) {
        errors.push(`sections[${idx}].heading must have 'id' and 'en' strings`);
      }
      if (
        !Array.isArray(sec.paragraphs) ||
        sec.paragraphs.length === 0 ||
        !sec.paragraphs.every(isLocalCopy)
      ) {
        errors.push(
          `sections[${idx}].paragraphs must be an array of at least one { id, en } copy`,
        );
      }
      if (sec.points !== undefined) {
        if (!Array.isArray(sec.points) || !sec.points.every(isLocalCopy)) {
          errors.push(`sections[${idx}].points must be an array of { id, en } copy`);
        }
      }
      if (sec.links !== undefined) {
        if (
          !Array.isArray(sec.links) ||
          !sec.links.every(
            (l) =>
              l &&
              typeof l === "object" &&
              typeof (l as Record<string, unknown>).slug === "string" &&
              isLocalCopy((l as Record<string, unknown>).label),
          )
        ) {
          errors.push(
            `sections[${idx}].links must be an array of { slug, label: { id, en } }`,
          );
        }
      }
    });
  }

  if (body.imageUrl !== undefined) {
    if (typeof body.imageUrl !== "string" || !body.imageUrl.startsWith("http")) {
      errors.push("imageUrl must be a valid absolute http(s) URL");
    }
  }

  if (body.imageAlt !== undefined && !isLocalCopy(body.imageAlt)) {
    errors.push("imageAlt must be an object with 'id' and 'en' strings");
  }

  let validSources: ArticleSource[] | undefined = undefined;
  if (body.sources !== undefined) {
    if (!Array.isArray(body.sources)) {
      errors.push("sources must be an array of source objects");
    } else if (body.sources.length > 10) {
      errors.push("sources cannot exceed 10 items");
    } else {
      const parsedSources: ArticleSource[] = [];
      body.sources.forEach((src, idx) => {
        if (!src || typeof src !== "object") {
          errors.push(`sources[${idx}] must be an object`);
          return;
        }
        const s = src as Record<string, unknown>;
        if (!isNonEmptyString(s.title)) {
          errors.push(`sources[${idx}].title must be a non-empty string`);
        }
        if (!isNonEmptyString(s.url) || !isValidHttpUrl(s.url)) {
          errors.push(`sources[${idx}].url must be a valid http or https URL`);
        }
        if (s.publisher !== undefined && typeof s.publisher !== "string") {
          errors.push(`sources[${idx}].publisher must be a string if provided`);
        }
        if (s.date !== undefined && !isValidIsoDate(s.date as string)) {
          errors.push(`sources[${idx}].date must be a valid ISO 8601 calendar date (YYYY-MM-DD)`);
        }

        if (isNonEmptyString(s.title) && isNonEmptyString(s.url) && isValidHttpUrl(s.url)) {
          parsedSources.push({
            title: s.title.trim(),
            url: s.url.trim(),
            ...(typeof s.publisher === "string" && s.publisher.trim().length > 0
              ? { publisher: s.publisher.trim() }
              : {}),
            ...(typeof s.date === "string" && s.date.trim().length > 0
              ? { date: s.date.trim() }
              : {}),
          });
        }
      });
      validSources = parsedSources;
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const validArticle: DynamicArticle = {
    slug,
    category: body.category as BlogCategory,
    readTime: Math.round(body.readTime as number),
    date: body.date as string,
    title: body.title as LocalCopy,
    excerpt: body.excerpt as LocalCopy,
    diagram: (body.diagram as string[]) || [],
    sections: body.sections as DynamicArticle["sections"],
    takeaway: body.takeaway as LocalCopy,
    service: (body.service as string).trim(),
    ...(body.imageUrl ? { imageUrl: (body.imageUrl as string).trim() } : {}),
    ...(body.imageAlt ? { imageAlt: body.imageAlt as LocalCopy } : {}),
    ...(validSources && validSources.length > 0 ? { sources: validSources } : {}),
  };

  return { success: true, data: validArticle };
}

export function validateImageUpload(
  fileSize: number,
  contentType: string | null,
): { valid: true } | { valid: false; error: string } {
  if (fileSize <= 0) {
    return { valid: false, error: "Image file is empty" };
  }
  if (fileSize > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size (${(fileSize / (1024 * 1024)).toFixed(2)} MB) exceeds 5 MB limit`,
    };
  }
  const cleanMime = (contentType || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(cleanMime as any)) {
    return {
      valid: false,
      error: `Invalid MIME type '${contentType}'. Allowed types: ${ALLOWED_IMAGE_MIME_TYPES.join(", ")}`,
    };
  }
  return { valid: true };
}
