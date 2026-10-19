import {
  findArticle,
  listAllArticles,
  parseLang,
  type Lang,
} from "./content";
import { authenticate } from "./auth";
import {
  deleteDynamicArticle,
  getDynamicArticle,
  putDynamicArticle,
} from "./storage";
import {
  isValidSlug,
  validateArticlePayload,
  validateImageUpload,
} from "./validation";
import { jsonResponse, preflightResponse, textResponse } from "./http";
import { resolveSeo, type SeoConfig } from "./seo";
import { buildRobots, buildSitemap } from "./sitemap";
import { absolute, normalizePath } from "./url";

function siteUrlFrom(env: Env, requestUrl: URL): string {
  return (env.SITE_URL || requestUrl.origin).replace(/\/+$/, "");
}

function seoConfigFor(env: Env, requestUrl: URL): SeoConfig {
  const siteUrl = siteUrlFrom(env, requestUrl);
  return {
    siteUrl,
    siteName: env.SITE_NAME || "CORE Solution Digital",
    locale: env.SITE_LOCALE || "id_ID",
    ogImage: env.OG_IMAGE_PATH ? absolute(siteUrl, env.OG_IMAGE_PATH) : undefined,
    siteLastModified: env.SITE_LAST_MODIFIED,
  };
}

function withUrl<T extends { path: string }>(siteUrl: string, item: T): T & { url: string } {
  return { ...item, url: absolute(siteUrl, item.path) };
}

function slugFrom(pathname: string, prefix: string): string {
  return decodeURIComponent(pathname.slice(prefix.length)).replace(/\/+$/, "");
}

function notFound(
  message: string,
  request: Request,
  env: Env,
  siteUrl: string,
  extra?: Record<string, unknown>,
): Response {
  return jsonResponse(
    { error: "not_found", message, ...(extra ?? {}) },
    404,
    request,
    env,
    siteUrl,
  );
}

function unauthorized(
  reason: string,
  request: Request,
  env: Env,
  siteUrl: string,
): Response {
  return jsonResponse(
    { error: "unauthorized", message: reason },
    401,
    request,
    env,
    siteUrl,
    { "WWW-Authenticate": 'Bearer realm="CORE Solution Digital Blog API"' },
  );
}

function badRequest(
  message: string,
  request: Request,
  env: Env,
  siteUrl: string,
  errors?: string[],
): Response {
  return jsonResponse(
    { error: "bad_request", message, ...(errors ? { errors } : {}) },
    400,
    request,
    env,
    siteUrl,
  );
}

function buildAssetUrl(key: string, env: Env, siteUrl: string): string {
  if (env.R2_PUBLIC_URL && env.R2_PUBLIC_URL.trim().length > 0) {
    const base = env.R2_PUBLIC_URL.replace(/\/+$/, "");
    return `${base}/${key}`;
  }
  return `${siteUrl}/uploads/${key}`;
}

export function isAllowedUploadKey(key: string): boolean {
  if (!key || typeof key !== "string") return false;
  return key.startsWith("images/");
}

async function seoResponse(
  target: string,
  lang: Lang,
  request: Request,
  env: Env,
  siteUrl: string,
): Promise<Response> {
  const config = seoConfigFor(env, new URL(request.url));
  const seo = await resolveSeo(target, lang, config, env.BLOG_BUCKET);
  if (!seo) {
    return notFound(`No SEO entry for path "${normalizePath(target)}".`, request, env, siteUrl, {
      path: normalizePath(target),
    });
  }
  return jsonResponse(seo, 200, request, env, siteUrl, { "Cache-Control": "public, max-age=300" });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);
    const siteUrl = siteUrlFrom(env, url);

    if (request.method === "OPTIONS") {
      return preflightResponse(request, env, siteUrl);
    }

    // -------------------------------------------------------------------------
    // Public uploads route: only images/ allowed, reject articles/... or other keys
    // -------------------------------------------------------------------------
    if (request.method === "GET" && pathname.startsWith("/uploads/")) {
      const key = pathname.slice("/uploads/".length);
      if (!isAllowedUploadKey(key)) {
        return notFound(`Asset '${key}' not found`, request, env, siteUrl);
      }
      if (!env.BLOG_BUCKET) {
        return notFound("R2 bucket is not configured", request, env, siteUrl);
      }
      const object = await env.BLOG_BUCKET.get(key);
      if (!object) {
        return notFound(`Asset '${key}' not found`, request, env, siteUrl);
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(object.body, { headers });
    }

    // -------------------------------------------------------------------------
    // WRITE OPERATIONS (require Bearer Token authentication)
    // -------------------------------------------------------------------------
    const isWriteMethod = ["POST", "PUT", "DELETE"].includes(request.method);
    if (isWriteMethod) {
      const auth = authenticate(request, env);
      if (!auth.authenticated) {
        return unauthorized(auth.reason, request, env, siteUrl);
      }
      if (!env.BLOG_BUCKET) {
        return jsonResponse(
          {
            error: "service_unavailable",
            message: "R2 bucket (BLOG_BUCKET) is not bound to this Worker",
          },
          503,
          request,
          env,
          siteUrl,
        );
      }

      // 1. Upload blog image: POST /api/blog/:slug/image
      const isSlugImageUpload =
        request.method === "POST" &&
        pathname.startsWith("/api/blog/") &&
        pathname.endsWith("/image");

      if (isSlugImageUpload) {
        const rawSlug = pathname.slice("/api/blog/".length, -"/image".length).replace(/\/+$/, "");
        if (!isValidSlug(rawSlug)) {
          return badRequest(`Invalid slug '${rawSlug}' in upload URL`, request, env, siteUrl);
        }

        const contentType = request.headers.get("content-type") || "";

        let fileBuffer: ArrayBuffer;
        let mimeType: string = contentType.split(";")[0].trim().toLowerCase();
        let originalFileName: string | undefined;

        // Support multipart/form-data OR direct binary body
        if (contentType.includes("multipart/form-data")) {
          try {
            const formData = await request.formData();
            const file = formData.get("file") || formData.get("image");
            if (!file || !(file instanceof File)) {
              return badRequest("Missing 'file' or 'image' field in form-data", request, env, siteUrl);
            }
            fileBuffer = await file.arrayBuffer();
            mimeType = file.type || mimeType;
            originalFileName = file.name;
          } catch (err: any) {
            return badRequest(`Failed to parse multipart body: ${err.message}`, request, env, siteUrl);
          }
        } else {
          // Raw binary body
          fileBuffer = await request.arrayBuffer();
        }

        const validation = validateImageUpload(fileBuffer.byteLength, mimeType);
        if (!validation.valid) {
          return badRequest(validation.error, request, env, siteUrl);
        }

        // Determine extension
        const extMap: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        };
        const ext = extMap[mimeType] || "bin";
        const timestamp = Date.now();
        const randomHex = Math.random().toString(16).substring(2, 8);
        const objectKey = `images/${rawSlug}/${timestamp}-${randomHex}.${ext}`;

        await env.BLOG_BUCKET.put(objectKey, fileBuffer, {
          httpMetadata: { contentType: mimeType },
          customMetadata: {
            slug: rawSlug,
            uploadedAt: new Date().toISOString(),
            ...(originalFileName ? { originalFileName } : {}),
          },
        });

        const publicUrl = buildAssetUrl(objectKey, env, siteUrl);
        return jsonResponse(
          {
            status: "success",
            key: objectKey,
            url: publicUrl,
            contentType: mimeType,
            bytes: fileBuffer.byteLength,
          },
          201,
          request,
          env,
          siteUrl,
        );
      }

      // 2. Create article: POST /api/blog
      if (request.method === "POST" && pathname === "/api/blog") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return badRequest("Invalid JSON in request body", request, env, siteUrl);
        }

        const validated = validateArticlePayload(body);
        if (!validated.success) {
          return badRequest("Validation failed", request, env, siteUrl, validated.errors);
        }

        const article = validated.data;

        // Check if slug already exists in R2
        const existing = await getDynamicArticle(env.BLOG_BUCKET, article.slug);
        if (existing) {
          return jsonResponse(
            {
              error: "conflict",
              message: `Article with slug '${article.slug}' already exists. Use PUT /api/blog/${article.slug} to update.`,
            },
            409,
            request,
            env,
            siteUrl,
          );
        }

        article.createdAt = new Date().toISOString();
        article.updatedAt = article.createdAt;
        await putDynamicArticle(env.BLOG_BUCKET, article);

        return jsonResponse(
          {
            status: "created",
            article: withUrl(siteUrl, {
              ...article,
              path: `/blog/${article.slug}`,
            }),
          },
          201,
          request,
          env,
          siteUrl,
        );
      }

      // 3. Update article: PUT /api/blog/:slug
      if (request.method === "PUT" && pathname.startsWith("/api/blog/")) {
        const slug = slugFrom(pathname, "/api/blog/");
        if (!isValidSlug(slug)) {
          return badRequest(`Invalid slug '${slug}' in path`, request, env, siteUrl);
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return badRequest("Invalid JSON in request body", request, env, siteUrl);
        }

        const validated = validateArticlePayload(body, slug);
        if (!validated.success) {
          return badRequest("Validation failed", request, env, siteUrl, validated.errors);
        }

        const existing = await getDynamicArticle(env.BLOG_BUCKET, slug);
        const article = validated.data;
        article.createdAt = existing?.createdAt || new Date().toISOString();
        article.updatedAt = new Date().toISOString();

        await putDynamicArticle(env.BLOG_BUCKET, article);

        return jsonResponse(
          {
            status: "updated",
            article: withUrl(siteUrl, {
              ...article,
              path: `/blog/${article.slug}`,
            }),
          },
          200,
          request,
          env,
          siteUrl,
        );
      }

      // 4. Delete article: DELETE /api/blog/:slug
      if (request.method === "DELETE" && pathname.startsWith("/api/blog/")) {
        const slug = slugFrom(pathname, "/api/blog/");
        if (!isValidSlug(slug)) {
          return badRequest(`Invalid slug '${slug}' in path`, request, env, siteUrl);
        }

        const deleted = await deleteDynamicArticle(env.BLOG_BUCKET, slug);
        if (!deleted) {
          return notFound(`Dynamic article '${slug}' not found in R2`, request, env, siteUrl);
        }

        return jsonResponse(
          { status: "deleted", slug, message: `Article '${slug}' deleted from storage` },
          200,
          request,
          env,
          siteUrl,
        );
      }

      return notFound(`No write route matches "${pathname}".`, request, env, siteUrl);
    }

    // -------------------------------------------------------------------------
    // READ OPERATIONS (GET, HEAD)
    // -------------------------------------------------------------------------
    if (request.method !== "GET" && request.method !== "HEAD") {
      return jsonResponse(
        {
          error: "method_not_allowed",
          message: "Only GET, HEAD, POST, PUT, DELETE, and OPTIONS are supported.",
        },
        405,
        request,
        env,
        siteUrl,
        { Allow: "GET, HEAD, POST, PUT, DELETE, OPTIONS" },
      );
    }

    const lang = parseLang(url.searchParams.get("lang"));

    if (pathname === "/api/health") {
      return jsonResponse(
        {
          status: "ok",
          service: "blog-api",
          lang,
          r2Connected: Boolean(env.BLOG_BUCKET),
          writeAuthEnabled: Boolean(env.BLOG_API_TOKEN),
        },
        200,
        request,
        env,
        siteUrl,
      );
    }

    if (pathname === "/api/blog") {
      const items = await listAllArticles(env.BLOG_BUCKET, lang);
      const withAbsoluteUrls = items.map((item) => withUrl(siteUrl, item));
      return jsonResponse(
        { count: withAbsoluteUrls.length, lang, items: withAbsoluteUrls },
        200,
        request,
        env,
        siteUrl,
        {
          "Cache-Control": "public, max-age=60",
        },
      );
    }

    if (pathname.startsWith("/api/blog/")) {
      const slug = slugFrom(pathname, "/api/blog/");
      const article = await findArticle(env.BLOG_BUCKET, slug, lang);
      if (!article) {
        return notFound(`Article "${slug}" was not found.`, request, env, siteUrl, { slug, lang });
      }
      return jsonResponse(withUrl(siteUrl, article), 200, request, env, siteUrl, {
        "Cache-Control": "public, max-age=60",
      });
    }

    if (pathname === "/api/seo") {
      const slug = url.searchParams.get("slug");
      const target = url.searchParams.get("path") ?? (slug ? `/blog/${slug}` : null);
      if (!target) {
        return badRequest("Provide ?path=/... or ?slug=...", request, env, siteUrl);
      }
      return await seoResponse(target, lang, request, env, siteUrl);
    }

    if (pathname.startsWith("/api/seo/")) {
      const slug = slugFrom(pathname, "/api/seo/");
      return await seoResponse(`/blog/${slug}`, lang, request, env, siteUrl);
    }

    if (pathname === "/sitemap.xml") {
      const xml = await buildSitemap(seoConfigFor(env, url), env.BLOG_BUCKET);
      return textResponse(
        xml,
        200,
        "application/xml; charset=utf-8",
        request,
        env,
        siteUrl,
        { "Cache-Control": "public, max-age=900" },
      );
    }

    if (pathname === "/robots.txt") {
      return textResponse(
        buildRobots(seoConfigFor(env, url)),
        200,
        "text/plain; charset=utf-8",
        request,
        env,
        siteUrl,
        { "Cache-Control": "public, max-age=3600" },
      );
    }

    return notFound(`No route matches "${pathname}".`, request, env, siteUrl, { path: pathname });
  },
};
