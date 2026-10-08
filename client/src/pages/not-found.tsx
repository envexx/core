import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ContentLayout from "@/components/ContentLayout";

export default function NotFound() {
  const { lang } = useI18n();
  const title = lang === "id" ? "Halaman tidak ditemukan" : "Page not found";
  return <ContentLayout title={title} description={title} path={window.location.pathname}><section className="agency-container page-intro missing-page"><span className="section-kicker">404 / PAGE NOT FOUND</span><h1>{title}.</h1><p>{lang === "id" ? "Tautan ini mungkin sudah berubah. Jelajahi layanan dan artikel kami, atau kembali ke beranda." : "This link may have changed. Explore our services and articles, or return home."}</p><div><a className="lime-button" href="/">{lang === "id" ? "Kembali ke beranda" : "Return home"}<ArrowUpRight size={16} /></a><a className="text-link" href="/services">{lang === "id" ? "Lihat layanan" : "View services"}<ArrowUpRight size={16} /></a><a className="text-link" href="/blog">Blog<ArrowUpRight size={16} /></a></div></section></ContentLayout>;
}
