// Build-time prerender: renders each route to static HTML so crawlers and social
// previews see real content instead of an empty <div id="root">.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { Router } from "wouter";
import App from "../client/src/App";
import { articles, blogCategories } from "../client/src/lib/blog-content";
import { services } from "../client/src/lib/service-content";

const SITE = "https://www.coresolution.digital";
const BLOG_API = "https://coresolution.digital/api/blog?lang=id";
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
  imageUrl?: string;
  imageAlt?: string;
};

// Articles published through the blog API live in R2, not in the bundle. Without
// this fetch every new slug falls back to index.html and inherits the homepage
// canonical. A failed fetch only costs those newest articles, so it warns.
async function apiRoutes(): Promise<Meta[]> {
  try {
    const res = await fetch(BLOG_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { items?: ApiArticle[] };
    return (data.items ?? []).map((article) => ({
      path: article.path ?? `/blog/${article.slug}`,
      title: `${article.title} | CORE Solution Digital`,
      description: clip(article.excerpt),
      type: "article",
      article: { date: article.date },
      image: article.imageUrl,
      imageAlt: article.imageAlt,
    }));
  } catch (error) {
    console.warn(`prerender: blog API unreachable, writing bundled routes only (${error})`);
    return [];
  }
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
const bundled = new Set(routes.map((route) => route.path));
routes.push(...(await apiRoutes()).filter((route) => !bundled.has(route.path)));

for (const meta of routes) {
  stub.location.pathname = meta.path;
  const url = meta.path === "/" ? SITE : `${SITE}${meta.path}`;
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
  html = html.replace("</head>", `${extra.join("\n    ")}\n  </head>`);

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
    <lastmod>${r.article?.date ?? new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${r.path === "/" ? "weekly" : "monthly"}</changefreq>
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
