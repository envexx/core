import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: t.nav.home[lang], id: "hero" },
    { label: t.nav.services[lang], id: "services" },
    { label: t.nav.products[lang], id: "products" },
    { label: t.nav.portfolio[lang], id: "portfolio" },
    { label: t.nav.about[lang], id: "about" },
    { label: t.nav.contact[lang], id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-nav shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight">
              <span className="gradient-text-gold">CORE</span>
              <span className="text-foreground/50 font-normal text-xs ml-1.5 hidden sm:inline tracking-wider uppercase">Solution Digital</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-2 text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
              >
                {link.label}
              </button>
            ))}

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="ml-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all flex items-center gap-1.5 uppercase tracking-wider"
              title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "id" ? "EN" : "ID"}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-1 p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Button
              size="sm"
              onClick={() => scrollToSection("contact")}
              className="ml-3 text-xs font-semibold"
            >
              {t.nav.cta[lang]}
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="p-2 rounded-lg text-foreground/50 hover:text-foreground transition-all text-[11px] font-bold uppercase"
            >
              {lang === "id" ? "EN" : "ID"}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-foreground/50 hover:text-foreground transition-all"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-nav border-t border-foreground/5 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left px-3 py-2.5 text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="pt-2">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="w-full text-xs font-semibold"
                >
                  {t.nav.cta[lang]}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
