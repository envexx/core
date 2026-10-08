import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BrandMark } from "@/components/ui/brand-mark";

export default function Footer() {
  const { lang } = useI18n();
  return <footer className="agency-footer agency-container">
    <div className="footer-top"><a href="/" className="brand"><BrandMark /><span>core<span className="brand-dot">.</span><small>solution digital</small></span></a><p>AI systems. Connected operations.<br />{lang === "id" ? "Lebih banyak ruang untuk bertumbuh." : "More room to grow."}</p><a href="mailto:coresolution3@gmail.com">coresolution3@gmail.com<ArrowUpRight size={15} /></a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} PT CORE SOLUTION DIGITAL</span><div><a href="/services">{lang === "id" ? "Layanan" : "Services"}</a><a href="/blog">Blog</a><a href="/#about">{lang === "id" ? "Cara kerja" : "Our process"}</a><span>Batam, Indonesia ↗</span></div></div>
  </footer>;
}
