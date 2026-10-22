// Build-time prerender: renders each route to static HTML so crawlers and social
// previews see real content instead of an empty <div id="root">.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { Router } from "wouter";
import App from "../client/src/App";
import { articles, blogCategories } from "../client/src/lib/blog-content";
import { buildSeed, type ApiArticleDetail, type BlogListResponse } from "../client/src/lib/blog-api";
import { services } from "../client/src/lib/service-content";

const SITE = "https://www.coresolution.digital";
const BLOG_API = "https://coresolution.digital/api/blog?lang=id";
const BLOG_ARTICLE_API = "https://coresolution.digital/api/blog";
const OUT = resolve("dist/public");
const OG_IMAGE = `${SITE}/images/core-agent-workspace.webp`;

// Components read window/localStorage during render (scroll state, active nav
// link, saved language). Give them a read-only stub for the build render; the
// browser replaces this markup on load.
const stub: any = {
  scrollY: 0,
  innerWidth: 1280,
  innerHeight: 900,
  location: { pathname: "/", href: `${SITE}/`, search: "" },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  matchMedia: () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
};
(globalThis as any).window = stub;
(globalThis as any).localStorage = stub.localStorage;

type Meta = {
  path: string;
  title: string;
  description: string;
  type?: string;
  article?: { date: string };
  image?: string;
  imageAlt?: string;
  detail?: ApiArticleDetail;
  lastmod?: string;
};

const clip = (s: string, n = 155) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const routes: Meta[] = [
  {
    path: "/",
    title: "CORE Solution Digital - AI Agent & Automation Agency",
    description:
      "AI Agent & AI Automation Agency. Bangun sistem AI, integrasi aplikasi, dan automasi proses bisnis untuk sales, support, dan operasional.",
  },
  {
    path: "/services",
    title: "Layanan AI Automation | CORE Solution Digital",
    description:
      "Empat jalur kerja: AI agent systems, workflow automation, knowledge systems, dan AI strategy. Pilih satu proses yang paling mahal bila manual.",
  },
  {
    path: "/blog",
    title: "Blog AI Automation untuk Bisnis | CORE Solution Digital",
    description:
      "Catatan teknis dan keputusan implementasi: memilih proses pertama, merancang alur invoice, dan menghubungkan lead ke CRM.",
  },
  ...services.map((s) => ({
    path: `/services/${s.slug}`,
    title: `${s.name} | CORE Solution Digital`,
    description: clip(s.intro.id),
  })),
  ...blogCategories.map((c) => ({
    path: `/blog/kategori/${c.slug}`,
    title: `Artikel ${c.category} | CORE Solution Digital`,
    description: `Kumpulan artikel ${c.category} tentang penerapan AI dan otomasi proses bisnis.`,
  })),
  ...articles.map((a) => ({
    path: `/blog/${a.slug}`,
    title: `${a.title.id} | CORE Solution Digital`,
    description: clip(a.excerpt.id),
    type: "article",
    article: { date: a.date },
  })),
];

type ApiArticle = {
  path?: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  url?: string;
  imageUrl?: string;
  imageAlt?: string;
};

// R2.5: a defective payload must stop the build instead of shipping a page that
// inherits the homepage title, a wrong canonical, or a broken preview image.
function assertArticle(item: ApiArticle, path: string): void {
  const fail = (what: string): never => {
    throw new Error(`prerender guard: blog API article "${item.slug ?? path}" has no ${what}`);
  };
  if (!item.slug?.trim()) fail("slug");
  if (!item.title?.trim()) fail("title");
  if (!item.date?.trim()) fail("date");
  if (item.path && item.path !== `/blog/${item.slug}`) {
    throw new Error(
      `prerender guard: blog API article "${item.slug}" points to "${item.path}", canonical must be "/blog/${item.slug}"`,
    );
  }
  if (item.url) {
    let canonicalPath = "";
    try {
      canonicalPath = new URL(item.url).pathname;
    } catch {
      canonicalPath = "";
    }
    if (canonicalPath !== `/blog/${item.slug}`) {
      throw new Error(`prerender guard: blog API article "${item.slug}" has canonical "${item.url}"`);
    }
  }
  if (item.imageUrl && !/^https:\/\/[^\s"]+$/.test(item.imageUrl)) {
    throw new Error(`prerender guard: blog API article "${item.slug}" has an invalid og:image "${item.imageUrl}"`);
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

// Articles published through the blog API live in R2, not in the bundle. Without
// this fetch every new slug falls back to index.html and inherits the homepage
// canonical. A failed list fetch only costs those newest articles, so it warns.
// BLOG_API_FIXTURE lets the guard be exercised without a live API.
async function apiContent(): Promise<{ list: BlogListResponse | null; details: Map<string, ApiArticleDetail> }> {
  let list: BlogListResponse;
  try {
    const fixture = process.env.BLOG_API_FIXTURE;
    list = fixture
      ? (JSON.parse(readFileSync(fixture, "utf8")) as BlogListResponse)
      : await fetchJson<BlogListResponse>(BLOG_API);
  } catch (error) {
    console.warn(`prerender: blog API unreachable, writing bundled routes only (${error})`);
    return { list: null, details: new Map() };
  }

  const items = list.items ?? [];
  for (const item of items) assertArticle(item, item.path ?? `/blog/${item.slug}`);

  // A body that cannot be read would leave the loading spinner in the HTML,
  // which is the exact defect this step exists to remove.
  const details = new Map<string, ApiArticleDetail>();
  const bodies = await Promise.allSettled(
    items.map((item) => fetchJson<ApiArticleDetail>(`${BLOG_ARTICLE_API}/${encodeURIComponent(item.slug)}?lang=id`)),
  );
  const failed: string[] = [];
  bodies.forEach((result, index) => {
    const path = items[index].path ?? `/blog/${items[index].slug}`;
    if (result.status === "fulfilled") details.set(path, result.value);
    else failed.push(`${path} (${result.reason})`);
  });
  if (failed.length) {
    throw new Error(`prerender guard: article body unavailable, refusing to prerender a spinner: ${failed.join(", ")}`);
  }

  const missingImage = items.filter((item) => !item.imageUrl).map((item) => item.slug);
  if (missingImage.length) {
    console.warn(`prerender: ${missingImage.length} article(s) use the site default og:image: ${missingImage.join(", ")}`);
  }
  return { list, details };
}

const template = readFileSync(resolve(OUT, "index.html"), "utf8")
  // Re-running the script must not stack tags on top of the previous run's output.
  .replace(/^.*(property="og:url"|property="og:image"|name="twitter:image"|property="article:published_time").*\n/gm, "")
  .replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"BlogPosting"[\s\S]*?<\/script>\n?/g, "");

// Pages are lazily imported, so renderToString would only emit the Suspense
// fallback. onAllReady waits for every lazy chunk before the markup is piped.
function render(path: string): Promise<string> {
  return new Promise((done, fail) => {
    let out = "";
    const sink = new Writable({
      write(chunk, _enc, next) {
        out += chunk.toString();
        next();
      },
    });
    const { pipe } = renderToPipeableStream(
      <Router ssrPath={path}>
        <App />
      </Router>,
      {
        onAllReady() {
          pipe(sink);
          sink.on("finish", () => done(out));
        },
        onError: fail,
      },
    );
  });
}

async function main() {
const api = await apiContent();

// Attach the API payload (body + real lastmod) to the bundled article routes
// too: the API is the source of truth for those slugs, so the static HTML and
// the client must start from the same content.
if (api.list) {
  for (const item of api.list.items ?? []) {
    const path = item.path ?? `/blog/${item.slug}`;
    const existing = routes.find((route) => route.path === path);
    if (existing) {
      existing.detail = api.details.get(path);
      existing.lastmod = (item.updatedAt ?? item.date).slice(0, 10);
      existing.image = item.imageUrl ?? existing.image;
      existing.imageAlt = item.imageAlt ?? existing.imageAlt;
    } else {
      routes.push({
        path,
        title: `${item.title} | CORE Solution Digital`,
        description: clip(item.excerpt),
        type: "article",
        article: { date: item.date },
        image: item.imageUrl,
        imageAlt: item.imageAlt,
        detail: api.details.get(path),
        lastmod: (item.updatedAt ?? item.date).slice(0, 10),
      });
    }
  }
}

for (const meta of routes) {
  stub.location.pathname = meta.path;
  const url = meta.path === "/" ? SITE : `${SITE}${meta.path}`;
  // The page is rendered from the same payload the browser reads back below, so
  // hydration replaces identical markup instead of flashing a spinner.
  buildSeed.list = meta.path === "/blog" || meta.path.startsWith("/blog/kategori/") ? api.list ?? undefined : undefined;
  buildSeed.article = meta.detail;
  const body = await render(meta.path);

  let html = template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(meta.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${esc(meta.description)}" />`,
    )
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${esc(meta.title)}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${esc(meta.description)}" />`,
    )
    .replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${meta.type ?? "website"}" />`)
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    )
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const image = meta.image ?? OG_IMAGE;
  const imageAlt = meta.imageAlt ?? "CORE Solution Digital - AI agent dan otomasi proses bisnis";
  const extra = [
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    // Only the bundled default has known 1200x630 dimensions.
    ...(image === OG_IMAGE
      ? [
          `<meta property="og:image:type" content="image/webp" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
        ]
      : []),
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  if (meta.article) extra.push(`<meta property="article:published_time" content="${meta.article.date}" />`);
  if (meta.type === "article") {
    extra.push(
      `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: meta.title.replace(" | CORE Solution Digital", ""),
        description: meta.description,
        datePublished: meta.article?.date,
        url,
        image: `${image}`,
        author: { "@type": "Organization", name: "CORE Solution Digital", url: SITE },
        publisher: { "@type": "Organization", name: "CORE Solution Digital", url: SITE },
      })}</script>`,
    );
  }
  const seed = JSON.stringify(
    Object.fromEntries(
      Object.entries({ list: buildSeed.list, article: buildSeed.article }).filter(([, value]) => value),
    ),
  ).replace(/</g, "\\u003c");
  html = html.replace(
    "</head>",
    `${extra.join("\n    ")}\n    ${seed === "{}" ? "" : `<script type="application/json" id="blog-seed">${seed}</script>`}\n  </head>`,
  );

  const file = meta.path === "/" ? resolve(OUT, "index.html") : resolve(OUT, meta.path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${r.path === "/" ? SITE : SITE + r.path}</loc>
${r.lastmod ? `    <lastmod>${r.lastmod}</lastmod>\n` : ""}    <changefreq>${r.path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${r.path === "/" ? "1.0" : r.path.split("/").length > 2 ? "0.7" : "0.8"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(resolve(OUT, "sitemap.xml"), sitemap);

console.log(`prerender: ${routes.length} routes written to ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
