import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowLeft, Search, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { articles, pillarSlug, blogCategories } from "@/lib/blog-content";
import {
  blogSeed,
  fetchBlogList,
  fetchBlogArticle,
  formatArticleDate,
  normalizeStaticSummary,
  normalizeApiSummary,
  normalizeStaticDetail,
  normalizeApiDetail,
  sortArticles,
  type ArticleView,
} from "@/lib/blog-api";
import ContentLayout, { Breadcrumbs, ProjectCTA } from "@/components/ContentLayout";
import ArticleTile, { articleCategory as categoryLabel } from "@/components/ArticleTile";
import { TextAnimate } from "@/components/ui/text-animate";
import NotFound from "./not-found";

export default function Blog({ categorySlug }: { categorySlug?: string }) {
  const { lang } = useI18n();
  const [category, setCategory] = useState<string>(
    blogCategories.find((item) => item.slug === categorySlug)?.category ?? "all",
  );
  const [query, setQuery] = useState("");
  const [articleList, setArticleList] = useState<ArticleView[]>(() => {
    const seed = blogSeed().list;
    return sortArticles(
      seed && seed.lang === lang && seed.items?.length
        ? seed.items.map(normalizeApiSummary)
        : articles.map((item) => normalizeStaticSummary(item, lang)),
    );
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchBlogList(lang, controller.signal)
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const apiViews = data.items.map(normalizeApiSummary);
          setArticleList(sortArticles(apiViews));
        } else {
          setArticleList(
            sortArticles(articles.map((item) => normalizeStaticSummary(item, lang))),
          );
        }
      })
      .catch(() => {
        setArticleList(
          sortArticles(articles.map((item) => normalizeStaticSummary(item, lang))),
        );
      });

    return () => {
      controller.abort();
    };
  }, [lang]);

  const filtered = articleList.filter(
    (article) =>
      (category === "all" || article.category === category) &&
      `${article.title} ${article.excerpt} ${article.category}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );

  const selectedCategory = blogCategories.find((item) => item.slug === categorySlug);
  const intro =
    lang === "id"
      ? "Studi alur dan panduan AI Automation. Jelajahi cara menghubungkan proses sales, dokumen, dan operasional."
      : "Workflow studies and AI automation guides. Explore connected sales, document, and operations processes.";

  return (
    <ContentLayout
      title={selectedCategory ? categoryLabel(selectedCategory.category, lang) : "Blog"}
      description={intro}
      path={selectedCategory ? `/blog/kategori/${selectedCategory.slug}` : "/blog"}
    >
      <section className="agency-container page-intro blog-intro">
        <Breadcrumbs
          items={
            selectedCategory
              ? [
                  { label: "Blog", href: "/blog" },
                  { label: categoryLabel(selectedCategory.category, lang) },
                ]
              : [{ label: "Blog" }]
          }
        />
        <span className="section-kicker">CORE / FIELD NOTES</span>
        <h1>
          <TextAnimate
            text={
              selectedCategory
                ? categoryLabel(selectedCategory.category, lang)
                : lang === "id"
                ? "Ide yang berguna.\nUntuk pekerjaan nyata."
                : "Useful ideas.\nFor real work."
            }
          />
        </h1>
        <p>{intro}</p>
      </section>

      <section className="agency-container blog-hub">
        <a className="blog-pillar-link" href={`/blog/${pillarSlug}`}>
          <span className="section-kicker">
            {lang === "id" ? "MULAI DARI PANDUAN UTAMA" : "START WITH THE COMPLETE GUIDE"}
          </span>
          <h2>
            {lang === "id"
              ? "Panduan AI Automation untuk bisnis"
              : "AI automation for business"}
          </h2>
          <p>
            {lang === "id"
              ? "Pilih proses pertama, pahami peran AI, dan jelajahi contoh automasi sales serta invoice."
              : "Choose your first process, understand AI, and explore sales and invoice automation."}
          </p>
          <span className="text-link">
            {lang === "id" ? "Baca panduannya" : "Read the guide"}
            <ArrowUpRight size={16} />
          </span>
        </a>
        <nav
          className="blog-topic-links"
          aria-label={lang === "id" ? "Jelajahi kategori" : "Browse categories"}
        >
          {blogCategories.map((item) => (
            <a
              key={item.slug}
              href={`/blog/kategori/${item.slug}`}
              aria-current={categorySlug === item.slug ? "page" : undefined}
            >
              {categoryLabel(item.category, lang)}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </nav>
      </section>

      <section
        className="agency-container blog-list-section"
        aria-label={lang === "id" ? "Artikel blog" : "Blog articles"}
      >
        <div className="blog-controls">
          <div
            className="blog-categories"
            role="group"
            aria-label={lang === "id" ? "Kategori artikel" : "Article categories"}
          >
            {["all", "AI Systems", "Automation", "Case Studies"].map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item === "all"
                  ? lang === "id"
                    ? "Semua"
                    : "All"
                  : categoryLabel(item, lang)}
              </button>
            ))}
          </div>
          <label className="blog-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={lang === "id" ? "Cari artikel…" : "Search articles…"}
              aria-label={lang === "id" ? "Cari artikel" : "Search articles"}
            />
          </label>
        </div>
        <p className="article-count" role="status">
          {filtered.length} {lang === "id" ? "artikel" : "articles"}
        </p>
        {filtered.length ? (
          <div className="article-grid">
            {filtered.map((article) => (
              <ArticleTile key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <Search size={25} />
            <h2>{lang === "id" ? "Artikel belum ditemukan." : "No articles found."}</h2>
            <p>
              {lang === "id"
                ? "Coba kata kunci lain atau tampilkan semua kategori."
                : "Try another search or view all categories."}
            </p>
            <button
              className="lime-button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              {lang === "id" ? "Tampilkan semua artikel" : "View all articles"}
            </button>
          </div>
        )}
      </section>
      <ProjectCTA />
    </ContentLayout>
  );
}

export function BlogArticle({ slug }: { slug: string }) {
  const { lang } = useI18n();
  const staticMatch = articles.find((item) => item.slug === slug);
  const seedArticle = blogSeed().article;
  const seeded =
    seedArticle && seedArticle.slug === slug && seedArticle.lang === lang
      ? normalizeApiDetail(seedArticle)
      : null;
  const [article, setArticle] = useState<ArticleView | null>(() =>
    seeded ?? (staticMatch ? normalizeStaticDetail(staticMatch, lang) : null),
  );
  const [loading, setLoading] = useState<boolean>(!seeded && !staticMatch);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fallbackToStatic = () => {
      const fallback = articles.find((item) => item.slug === slug);
      if (fallback) {
        setArticle(normalizeStaticDetail(fallback, lang));
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    if (staticMatch) {
      setArticle(normalizeStaticDetail(staticMatch, lang));
    } else if (!article || article.slug !== slug) {
      setLoading(true);
    }

    fetchBlogArticle(slug, lang, controller.signal)
      .then((detail) => {
        if (!active) return;
        if (detail && detail.slug) {
          setArticle(normalizeApiDetail(detail));
          setNotFound(false);
          setLoading(false);
        } else {
          fallbackToStatic();
        }
      })
      .catch(() => {
        if (!active) return;
        fallbackToStatic();
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [slug, lang]);

  if (loading) {
    return (
      <ContentLayout
        title="Loading…"
        description=""
        path={`/blog/${slug}`}
      >
        <div
          className="agency-container page-intro article-intro py-20 text-center"
          role="status"
          aria-label="Loading article"
        >
          <span className="inline-block size-6 rounded-full border-2 border-border border-t-primary motion-safe:animate-spin" />
        </div>
      </ContentLayout>
    );
  }

  if (notFound || !article) {
    return <NotFound />;
  }

  const categoryItem = blogCategories.find((item) => item.category === article.category);
  const categoryPath = categoryItem
    ? `/blog/kategori/${categoryItem.slug}`
    : "/blog";

  const related = articles
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => normalizeStaticSummary(item, lang));

  const hasSources = Array.isArray(article.sources) && article.sources.length > 0;

  return (
    <ContentLayout
      title={article.title}
      description={article.excerpt}
      path={`/blog/${slug}`}
    >
      <article>
        <header className="agency-container page-intro article-intro">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              {
                label: categoryLabel(article.category, lang),
                href: categoryPath,
              },
              { label: article.title },
            ]}
          />
          <div className="article-meta">
            <span>{categoryLabel(article.category, lang)}</span>
            {article.date && <span>{formatArticleDate(article.date, lang)}</span>}
            <span>
              <Clock size={13} />
              {article.readTime} {lang === "id" ? "menit baca" : "min read"}
            </span>
            <span>CORE Editorial</span>
          </div>
          <h1>
            <TextAnimate text={article.title} />
          </h1>
          <p>{article.excerpt}</p>
          {article.category === "Case Studies" && (
            <span className="case-study-note">
              {lang === "id"
                ? "Studi alur ilustratif · Bukan laporan hasil proyek klien"
                : "Illustrative workflow study · Not a client project report"}
            </span>
          )}
        </header>

        {article.imageUrl && (
          <div className="agency-container article-hero">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              loading="eager"
              decoding="async"
              className="article-hero-image"
            />
          </div>
        )}

        <div className="agency-container article-layout">
          <div className="article-prose">
            {article.diagram && article.diagram.length > 0 && (
              <div
                className="article-flow"
                aria-label={lang === "id" ? "Gambaran alur" : "Flow overview"}
              >
                {article.diagram.map((step, index) => (
                  <span key={`${step}-${index}`}>
                    <small>0{index + 1}</small>
                    {step}
                  </span>
                ))}
              </div>
            )}

            {article.sections &&
              article.sections.map((section, index) => (
                <section
                  id={section.id || `section-${index + 1}`}
                  key={section.id || `section-${index + 1}`}
                >
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={`p-${pIndex}`}>{paragraph}</p>
                  ))}
                  {section.points && section.points.length > 0 && (
                    <ul>
                      {section.points.map((point, ptIndex) => (
                        <li key={`pt-${ptIndex}`}>{point}</li>
                      ))}
                    </ul>
                  )}
                  {section.links && section.links.length > 0 && (
                    <p className="article-context-links">
                      {section.links.map((link) => (
                        <a
                          href={link.path || `/blog/${link.slug}`}
                          key={link.slug}
                        >
                          {link.label}
                          <ArrowUpRight size={14} />
                        </a>
                      ))}
                    </p>
                  )}
                </section>
              ))}

            {article.takeaway && (
              <div className="article-takeaway">
                <span className="section-kicker">
                  {lang === "id" ? "CATATAN UNTUK TIM ANDA" : "A NOTE FOR YOUR TEAM"}
                </span>
                <p>{article.takeaway}</p>
              </div>
            )}

            {hasSources && (
              <section
                className="article-sources"
                aria-label={lang === "id" ? "Sumber rujukan" : "Sources"}
              >
                <span className="section-kicker">
                  {lang === "id" ? "SUMBER RUJUKAN" : "SOURCES"}
                </span>
                <ul className="article-sources-list">
                  {article.sources!.map((source, sIdx) => (
                    <li key={`${source.url}-${sIdx}`}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-source-link"
                      >
                        {source.title}
                        <ArrowUpRight size={14} />
                      </a>
                      {(source.publisher || source.date) && (
                        <span className="article-source-meta">
                          {source.publisher && <span>{source.publisher}</span>}
                          {source.publisher && source.date && <span>·</span>}
                          {source.date && <span>{source.date}</span>}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {article.service && (
              <a
                href={article.service.path || `/services/${article.service.slug}`}
                className="article-service-link article-inline-service"
              >
                {lang === "id"
                  ? "Butuh bantuan implementasi? Jelajahi "
                  : "Need help implementing this? Explore "}
                {article.service.name}
                <ArrowUpRight size={16} />
              </a>
            )}

            <a href="/blog" className="text-link">
              <ArrowLeft size={16} />
              {lang === "id" ? "Kembali ke semua artikel" : "Back to all articles"}
            </a>
          </div>
        </div>
      </article>

      <section className="agency-container detail-section">
        <span className="section-kicker">KEEP EXPLORING</span>
        <h2>{lang === "id" ? "Bacaan berikutnya." : "Read next."}</h2>
        <div className="article-grid related-articles">
          {related.map((item) => (
            <ArticleTile key={item.slug} article={item} />
          ))}
        </div>
      </section>
      <ProjectCTA />
    </ContentLayout>
  );
}

export function BlogCategory({ slug }: { slug: string }) {
  if (!blogCategories.some((item) => item.slug === slug)) return <NotFound />;
  return <Blog key={slug} categorySlug={slug} />;
}
