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
const OUT = resolve("dist/public");
const OG_IMAGE = `${SITE}/images/core-agent-workspace.png`;

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

type Meta = { path: string; title: string; description: string; type?: string; article?: { date: string } };

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

  const extra = [
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1536" />`,
    `<meta property="og:image:height" content="1024" />`,
    `<meta property="og:image:alt" content="CORE Solution Digital - AI agent dan otomasi proses bisnis" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
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
        image: OG_IMAGE,
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
