import { Github, Instagram } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { FadeIn } from "@/components/ui/magic-effects";

export default function Footer() {
  const { lang, t } = useI18n();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: t.nav.home[lang], href: "#hero" },
    { label: t.nav.services[lang], href: "#services" },
    { label: t.nav.products[lang], href: "#products" },
    { label: t.nav.portfolio[lang], href: "#portfolio" },
    { label: t.nav.about[lang], href: "#about" },
    { label: t.nav.contact[lang], href: "#contact" },
  ];

  const serviceLinks = [
    { label: t.footer.webDev[lang], href: "#services" },
    { label: t.footer.mobileDev[lang], href: "#services" },
    { label: t.footer.enterpriseSol[lang], href: "#services" },
    { label: t.footer.digitalConsult[lang], href: "#contact" },
  ];

  const productLinks = [
    { label: "kehadiran.online", href: "https://kehadiran.online" },
    { label: "nilai.online", href: "https://www.nilai.online" },
    { label: "ZBK Transport", href: "https://www.zbktransportservices.com" },
    { label: "ShoppyS AI", href: "https://shoppy-s-ai-apc2.vercel.app" },
    { label: "Stacks AI Web", href: "https://stacks-ai-web.vercel.app" },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/envexx", label: "GitHub" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative border-t border-foreground/5">
      <FadeIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand Section */}
            <div className="sm:col-span-2 md:col-span-1 space-y-4">
              <h3 className="font-display font-bold text-base sm:text-lg">
                <span className="gradient-text-gold">PT CORE SOLUTION DIGITAL</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                {t.footer.description[lang]}
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg border border-foreground/5 bg-foreground/[0.02] flex items-center justify-center hover:bg-foreground/[0.06] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-widest text-foreground/50">
                {t.footer.company[lang]}
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-widest text-foreground/50">
                {t.footer.services[lang]}
              </h4>
              <ul className="space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-widest text-foreground/50">
                {t.footer.productsLabel[lang]}
              </h4>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 border-t border-foreground/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground/50">
              <p>&copy; {currentYear} PT CORE SOLUTION DIGITAL. All rights reserved.</p>
              <p>Batam, Indonesia</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
}
