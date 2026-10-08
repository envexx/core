import { getArticle, listArticles, parseLang, type Lang } from "./content";
import { jsonResponse, preflightResponse, textResponse } from "./http";
import { resolveSeo, type SeoConfig } from "./seo";
import { buildRobots, buildSitemap } from "./sitemap";
import { absolute, normalizePath } from "./url";

function siteUrlFrom(env: Env, requestUrl: URL): string {
  // No hardcoded domain: fall back to the request origin for local/dev use.
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

function seoResponse(
  target: string,
  lang: Lang,
  request: Request,
  env: Env,
  siteUrl: string,
): Response {
  const config = seoConfigFor(env, new URL(request.url));
  const seo = resolveSeo(target, lang, config);
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

    if (request.method !== "GET" && request.method !== "HEAD") {
      return jsonResponse(
        { error: "method_not_allowed", message: "Only GET, HEAD, and OPTIONS are supported." },
        405,
        request,
        env,
        siteUrl,
        { Allow: "GET, HEAD, OPTIONS" },
      );
    }

    const lang = parseLang(url.searchParams.get("lang"));

    if (pathname === "/api/health") {
      return jsonResponse({ status: "ok", service: "blog-api", lang }, 200, request, env, siteUrl);
    }

    if (pathname === "/api/blog") {
      const items = listArticles(lang).map((item) => withUrl(siteUrl, item));
      return jsonResponse({ count: items.length, lang, items }, 200, request, env, siteUrl, {
        "Cache-Control": "public, max-age=300",
      });
    }

    if (pathname.startsWith("/api/blog/")) {
      const slug = slugFrom(pathname, "/api/blog/");
      const article = getArticle(slug, lang);
      if (!article) {
        return notFound(`Article "${slug}" was not found.`, request, env, siteUrl, { slug, lang });
      }
      return jsonResponse(withUrl(siteUrl, article), 200, request, env, siteUrl, {
        "Cache-Control": "public, max-age=300",
      });
    }

    if (pathname === "/api/seo") {
      const slug = url.searchParams.get("slug");
      const target = url.searchParams.get("path") ?? (slug ? `/blog/${slug}` : null);
      if (!target) {
        return jsonResponse(
          { error: "bad_request", message: "Provide ?path=/... or ?slug=..." },
          400,
          request,
          env,
          siteUrl,
        );
      }
      return seoResponse(target, lang, request, env, siteUrl);
    }

    if (pathname.startsWith("/api/seo/")) {
      const slug = slugFrom(pathname, "/api/seo/");
      return seoResponse(`/blog/${slug}`, lang, request, env, siteUrl);
    }

    if (pathname === "/sitemap.xml") {
      return textResponse(
        buildSitemap(seoConfigFor(env, url)),
        200,
        "application/xml; charset=utf-8",
        request,
        env,
        siteUrl,
        { "Cache-Control": "public, max-age=3600" },
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
