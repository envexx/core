import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { articles } from "@/lib/blog-content";
import SystemIllustration from "./SystemIllustration";
import { CutoutCard, CutoutCardMedia, CutoutCardOverlay, CutoutCardInsetLabel, CutoutCorner, CutoutCardPin, CutoutCardContent, CutoutCardFooter, CutoutCardAction, cutoutCardSurfaceClassName, useCutoutContentStaggerVariants } from "./ui/cutout-card";

export function articleCategory(category: string, lang: string) { return category === "Case Studies" ? lang === "id" ? "Studi kasus" : "Case studies" : category; }
export default function ArticleTile({ article }: { article: typeof articles[number] }) {
  const { lang } = useI18n();
  const stagger = useCutoutContentStaggerVariants();
  const reducedMotion = useReducedMotion();
  const study = article.category === "Case Studies";
  return <CutoutCard className={`${cutoutCardSurfaceClassName} core-cutout-card`}>
    <a href={`/blog/${article.slug}`} className="cutout-article-link" aria-label={article.title[lang]}>
      <CutoutCardMedia className="core-cutout-media bg-muted">
        <div className="cutout-media-heading" aria-hidden="true">CORE / FIELD NOTES</div>
        <SystemIllustration compact variant={article.category === "AI Systems" ? "gateway" : "workloads"} />
        <CutoutCardOverlay />
        <CutoutCardInsetLabel className="bg-card bottom-0 left-0 rounded-tr-[20px] px-5 py-3"><span className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">{articleCategory(article.category, lang)}</span><CutoutCorner className="text-card absolute -right-[31px] -bottom-px rotate-90" /><CutoutCorner className="text-card absolute -top-[31px] -left-px rotate-90" /></CutoutCardInsetLabel>
        <CutoutCardPin className="bg-primary text-primary-foreground top-0 right-0 rounded-bl-[16px] px-4 py-2 text-[10px] font-medium">{study ? lang === "id" ? "Ilustrasi alur" : "Workflow study" : lang === "id" ? "Panduan" : "Guide"}<CutoutCorner className="text-primary absolute top-0 -left-[23px] -rotate-90" size={24} /><CutoutCorner className="text-primary absolute right-0 -bottom-[23px] -rotate-90" size={24} /></CutoutCardPin>
        <CutoutCardAction revealOnHover={false} className="right-4 bottom-4"><motion.span className="cutout-arrow bg-primary text-primary-foreground" whileHover={reducedMotion ? undefined : { rotate: 8, scale: 1.04 }} aria-hidden="true"><ArrowUpRight size={18} /></motion.span></CutoutCardAction>
      </CutoutCardMedia>
      <CutoutCardContent className="core-cutout-content"><motion.div initial={reducedMotion ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger.container} className="cutout-content-stack"><motion.h2 variants={stagger.item} className="text-card-foreground">{article.title[lang]}</motion.h2><motion.p variants={stagger.item} className="text-muted-foreground">{article.excerpt[lang]}</motion.p><motion.div variants={stagger.item} className="cutout-footer-wrapper"><CutoutCardFooter className="border-border border-t pt-4"><span className="text-card-foreground text-[11px] font-medium">{lang === "id" ? "Baca selengkapnya" : "Read more"}</span><span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]"><Clock size={11} />{article.readTime} {lang === "id" ? "menit" : "min"}</span></CutoutCardFooter></motion.div></motion.div></CutoutCardContent>
    </a>
  </CutoutCard>;
}
