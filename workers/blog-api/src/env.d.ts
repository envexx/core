// Ambient Worker bindings. All optional so local dev works without every var set.
interface Env {
  /** Canonical site origin, e.g. https://coresolution.digital (no trailing slash). */
  SITE_URL?: string;
  /** Human-readable site name used in titles/JSON-LD. */
  SITE_NAME?: string;
  /** OpenGraph locale, e.g. id_ID. */
  SITE_LOCALE?: string;
  /** Fallback lastmod date (YYYY-MM-DD) for pages without their own date. */
  SITE_LAST_MODIFIED?: string;
  /** Comma-separated browser origins allowed by CORS (no wildcards). */
  CORS_ORIGINS?: string;
  /** Path to the social preview image, relative to SITE_URL. */
  OG_IMAGE_PATH?: string;
  /** Secret bearer token for write operations (POST, PUT, DELETE, upload). */
  BLOG_API_TOKEN?: string;
  /** Optional public base URL for R2 objects. Defaults to `${SITE_URL}/uploads`. */
  R2_PUBLIC_URL?: string;
  /** R2 bucket binding for blog images and JSON metadata storage. */
  BLOG_BUCKET?: R2Bucket;
}
