import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BrandMark } from "@/components/ui/brand-mark";
import { AgencyAction } from "@/components/ui/agency-action";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 48);
  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);
  const { lang, setLang } = useI18n();
  const links = [
    { id: "services", href: "/services", label: lang === "id" ? "Layanan" : "Services" },
    { id: "solutions", href: "/#solutions", label: lang === "id" ? "Solusi" : "Solutions" },
    { id: "blog", href: "/blog", label: "Blog" },
  ];
  return (
    <div className="header-shell"><header className={`agency-header ${scrolled ? "header-floating" : ""}`}>
      <nav className="agency-container nav-inner" aria-label={lang === "id" ? "Navigasi utama" : "Main navigation"}>
        <a className="brand" href="/" aria-label="CORE Solution Digital — beranda">
          <BrandMark /><span>core<span className="brand-dot">.</span><small>solution digital</small></span>
        </a>
        <div className="desktop-nav">
          {links.map(link => <a href={link.href} key={link.id} aria-current={window.location.pathname === link.href || window.location.pathname.startsWith(`${link.href}/`) ? "page" : undefined}>{link.label}</a>)}
          <a href="/#contact">{lang === "id" ? "Kontak" : "Contact"}</a>
        </div>
        <div className="nav-actions">
          <button className="language-button" onClick={() => setLang(lang === "id" ? "en" : "id")} aria-label={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}>{lang === "id" ? "EN" : "ID"}</button>
          <AgencyAction className="nav-halo-cta" href="/#contact">{lang === "id" ? "Mari ngobrol" : "Let's talk"}<ArrowUpRight size={15} /></AgencyAction>
          <button className="mobile-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </nav>
      {open && <div className="mobile-nav" id="mobile-navigation">
        {[...links, { id: "contact", href: "/#contact", label: lang === "id" ? "Kontak" : "Contact" }].map(link => <a key={link.id} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={16} /></a>)}
      </div>}
    </header></div>
  );
}
