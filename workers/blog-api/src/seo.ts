import {
  categoryLabel,
  categories,
  getArticle,
  getService,
  type ArticleDetail,
  type Lang,
} from "./content";
import { absolute, normalizePath } from "./url";

export type JsonLd = Record<string, unknown>;

export type SeoConfig = {
  siteUrl: string;
  siteName: string;
  locale: string;
  ogImage?: string;
  siteLastModified?: string;
};

type Crumb = { name: string; path: string };

export type PageDescriptor = {
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  /** When true, `title` is used verbatim instead of "`title` — `siteName`". */
  fullTitle?: boolean;
  article?: ArticleDetail;
  breadcrumbs: Crumb[];
};

export type SeoResult = {
  path: string;
  url: string;
  canonical: string;
  title: string;
  description: string;
  lang: Lang;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "website" | "article";
    siteName: string;
    locale: string;
    image?: string;
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    image?: string;
  };
  jsonLd: {
    Article?: JsonLd;
    WebPage?: JsonLd;
    BreadcrumbList: JsonLd;
  };
};

const HOME_TITLE = "CORE Solution Digital — AI Agent & Automation Agency";
const HOME_DESCRIPTION =
  "CORE Solution Digital — AI Agent & AI Automation Agency. Bangun sistem AI, integrasi aplikasi, dan automasi proses bisnis untuk sales, support, dan operasional.";
const BLOG_DESCRIPTION = {
  id: "Studi alur dan panduan AI Automation. Jelajahi cara menghubungkan proses sales, dokumen, dan operasional.",
  en: "Workflow studies and AI automation guides. Explore connected sales, document, and operations processes.",
};
const SERVICES_DESCRIPTION = {
  id: "Sistem AI, automasi proses, dan integrasi yang dirancang untuk pekerjaan nyata tim Anda.",
  en: "AI systems, process automation, and integrations designed for your team's real work.",
};

const text = {
  home: { id: "Beranda", en: "Home" },
  services: { id: "Layanan", en: "Services" },
  blog: { id: "Blog", en: "Blog" },
} as const;

function label(value: { id: string; en: string }, lang: Lang): string {
  return value[lang];
}

function homeCrumb(lang: Lang): Crumb {
  return { name: label(text.home, lang), path: "/" };
}

/** Resolve a request path to a page descriptor, or null when nothing matches. */
export function resolvePage(rawPath: string, lang: Lang): PageDescriptor | null {
  const path = normalizePath(rawPath);

  if (path === "/") {
    return {
      path,
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      type: "website",
      fullTitle: true,
      breadcrumbs: [homeCrumb(lang)],
    };
  }

  if (path === "/services") {
    return {
      path,
      title: label(text.services, lang),
      description: SERVICES_DESCRIPTION[lang],
      type: "website",
      breadcrumbs: [homeCrumb(lang), { name: label(text.services, lang), path }],
    };
  }

  if (path.startsWith("/services/")) {
    const slug = decodeURIComponent(path.slice("/services/".length)).replace(/\/+$/, "");
    const service = getService(slug, lang);
    if (!service) return null;
    return {
      path: service.path,
      title: service.name,
      description: service.intro,
      type: "website",
      breadcrumbs: [
        homeCrumb(lang),
        { name: label(text.services, lang), path: "/services" },
        { name: service.name, path: service.path },
      ],
    };
  }

  if (path === "/blog") {
    return {
      path,
      title: label(text.blog, lang),
      description: BLOG_DESCRIPTION[lang],
      type: "website",
      breadcrumbs: [homeCrumb(lang), { name: label(text.blog, lang), path }],
    };
  }

  if (path.startsWith("/blog/kategori/")) {
    const slug = decodeURIComponent(path.slice("/blog/kategori/".length)).replace(/\/+$/, "");
    const category = categories.find((item) => item.slug === slug);
    if (!category) return null;
    const name = categoryLabel(category.category, lang);
    return {
      path: `/blog/kategori/${category.slug}`,
      title: name,
      description:
        lang === "id"
          ? `Artikel ${name} dari CORE Solution Digital: panduan dan studi alur AI automation.`
          : `${name} articles from CORE Solution Digital: AI automation guides and workflow studies.`,
      type: "website",
      breadcrumbs: [
        homeCrumb(lang),
        { name: label(text.blog, lang), path: "/blog" },
        { name, path: `/blog/kategori/${category.slug}` },
      ],
    };
  }

  if (path.startsWith("/blog/")) {
    const slug = decodeURIComponent(path.slice("/blog/".length)).replace(/\/+$/, "");
    const article = getArticle(slug, lang);
    if (!article) return null;
    const categoryName = categoryLabel(article.category, lang);
    return {
      path: article.path,
      title: article.title,
      description: article.excerpt,
      type: "article",
      article,
      breadcrumbs: [
        homeCrumb(lang),
        { name: label(text.blog, lang), path: "/blog" },
        { name: categoryName, path: `/blog/kategori/${article.categorySlug}` },
        { name: article.title, path: article.path },
      ],
    };
  }

  return null;
}

/** Build complete SEO metadata for a path, or null when the path is unknown. */
export function resolveSeo(rawPath: string, lang: Lang, config: SeoConfig): SeoResult | null {
  const descriptor = resolvePage(rawPath, lang);
  return descriptor ? buildSeo(descriptor, lang, config) : null;
}

export function buildSeo(descriptor: PageDescriptor, lang: Lang, config: SeoConfig): SeoResult {
  const canonical = absolute(config.siteUrl, descriptor.path);
  const title = descriptor.fullTitle
    ? descriptor.title
    : `${descriptor.title} — ${config.siteName}`;
  const locale = lang === "en" ? "en_US" : config.locale;
  const image = config.ogImage;

  const openGraph: SeoResult["openGraph"] = {
    title,
    description: descriptor.description,
    url: canonical,
    type: descriptor.type,
    siteName: config.siteName,
    locale,
    ...(image ? { image } : {}),
  };

  const twitter: SeoResult["twitter"] = {
    card: "summary_large_image",
    title,
    description: descriptor.description,
    ...(image ? { image } : {}),
  };

  const jsonLd: SeoResult["jsonLd"] = {
    BreadcrumbList: buildBreadcrumbList(descriptor.breadcrumbs, config),
  };

  if (descriptor.article) {
    jsonLd.Article = buildArticleLd(descriptor.article, descriptor, lang, config);
  } else {
    jsonLd.WebPage = buildWebPageLd(descriptor, title, lang, config);
  }

  return {
    path: descriptor.path,
    url: canonical,
    canonical,
    title,
    description: descriptor.description,
    lang,
    openGraph,
    twitter,
    jsonLd,
  };
}

function buildBreadcrumbList(items: Crumb[], config: SeoConfig): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(config.siteUrl, item.path),
    })),
  };
}

function buildArticleLd(
  article: ArticleDetail,
  descriptor: PageDescriptor,
  lang: Lang,
  config: SeoConfig,
): JsonLd {
  const canonical = absolute(config.siteUrl, descriptor.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    inLanguage: lang,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    articleSection: article.category,
    ...(article.date ? { datePublished: article.date, dateModified: article.date } : {}),
    author: { "@type": "Organization", name: config.siteName, url: config.siteUrl },
    publisher: {
      "@type": "Organization",
      name: config.siteName,
      url: config.siteUrl,
      ...(config.ogImage
        ? { logo: { "@type": "ImageObject", url: config.ogImage } }
        : {}),
    },
    ...(config.ogImage ? { image: [config.ogImage] } : {}),
    isPartOf: {
      "@type": "Blog",
      name: `${config.siteName} Blog`,
      url: absolute(config.siteUrl, "/blog"),
    },
  };
}

function buildWebPageLd(
  descriptor: PageDescriptor,
  title: string,
  lang: Lang,
  config: SeoConfig,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: descriptor.description,
    inLanguage: lang,
    url: absolute(config.siteUrl, descriptor.path),
    isPartOf: { "@type": "WebSite", name: config.siteName, url: config.siteUrl },
  };
}
