import { ArrowUpRight } from "lucide-react";
import ArticleTile from "./ArticleTile";
import { TextAnimate } from "./ui/text-animate";
import { articles } from "@/lib/blog-content";
import { useI18n } from "@/lib/i18n";

export default function BlogPreview() {
  const { lang } = useI18n();
  return <section className="agency-container agency-section home-blog-preview"><div className="home-blog-heading"><div><span className="section-kicker">AUTOMATION / WORKFLOW STUDIES</span><h2><TextAnimate text={lang === "id" ? "Lihat prosesnya. Pahami kemungkinannya." : "See the process. Explore the possibilities."} /></h2></div><a className="text-link" href="/blog">{lang === "id" ? "Jelajahi blog" : "Explore the blog"}<ArrowUpRight size={17} /></a></div><div className="home-study-grid">{articles.filter(article => article.category === "Case Studies").map(article => <ArticleTile article={article} key={article.slug} />)}</div></section>;
}
