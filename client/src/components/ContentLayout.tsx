import { useEffect, type ReactNode } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AgencyAction } from "@/components/ui/agency-action";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useI18n } from "@/lib/i18n";

export default function ContentLayout({ title, description, path, children }: { title: string; description: string; path: string; children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const previousTitle = document.title;
    const updates = [
      ['meta[name="description"]', "content", description],
      ['meta[property="og:title"]', "content", `${title} — CORE Solution Digital`],
      ['meta[property="og:description"]', "content", description],
      ['meta[name="twitter:title"]', "content", `${title} — CORE Solution Digital`],
      ['meta[name="twitter:description"]', "content", description],
      ['link[rel="canonical"]', "href", `https://coresolution.digital${path}`],
    ];
    const previous = updates.map(([selector, attribute, value]) => {
      const element = document.querySelector(selector);
      const old = element?.getAttribute(attribute);
      element?.setAttribute(attribute, value);
      return { element, attribute, old };
    });
    document.title = `${title} — CORE Solution Digital`;
    return () => { document.title = previousTitle; previous.forEach(({ element, attribute, old }) => { if (old !== null && old !== undefined) element?.setAttribute(attribute, old); }); };
  }, [title, description, path]);
  return <div className="agency-site content-site min-h-screen"><Navbar /><motion.main initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .45, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.main><Footer /></div>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { lang } = useI18n();
  return <nav className="page-breadcrumbs" aria-label="Breadcrumb"><a href="/">{lang === "id" ? "Beranda" : "Home"}</a>{items.map((item, index) => <span key={index}><ChevronRight size={11} />{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}

export function ProjectCTA() {
  const { lang } = useI18n();
  return <section className="agency-container page-project-cta"><div><span className="section-kicker">LET'S BUILD SOMETHING USEFUL</span><h2>{lang === "id" ? "Mulai dari proses bisnis Anda." : "Start with your business process."}</h2><p>{lang === "id" ? "Ceritakan pekerjaan yang ingin diperbaiki. Kita tentukan cakupan, integrasi, dan langkah awal yang masuk akal." : "Tell us which work you want to improve. We'll define the scope, integrations, and a practical first step."}</p></div><AgencyAction href="/#contact">{lang === "id" ? "Diskusikan kebutuhan" : "Discuss your needs"}<ArrowUpRight size={17} /></AgencyAction></section>;
}

