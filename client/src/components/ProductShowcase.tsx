import { useState } from "react";
import { QrCode, Bell, BarChart3, Cloud, FileCheck, Shield, Users, BookOpen, ExternalLink, ChevronDown, Car, MapPin, Bot, ShoppingCart, Cpu, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { FadeIn, SpotlightCard, GlowOrb } from "@/components/ui/magic-effects";
import { motion, AnimatePresence } from "framer-motion";

type ProductKey = "kehadiran" | "nilai" | "zbk" | "shoppys" | "stacks";

export default function ProductShowcase() {
  const { lang, t } = useI18n();
  const [activeProduct, setActiveProduct] = useState<ProductKey>("kehadiran");
  const [showIframe, setShowIframe] = useState<Record<ProductKey, boolean>>({
    kehadiran: false,
    nilai: false,
    zbk: false,
    shoppys: false,
    stacks: false,
  });

  const products: Record<ProductKey, { name: string; tagline: string; description: string; url: string; features: { icon: any; text: string }[]; showPricing?: boolean }> = {
    kehadiran: {
      name: "kehadiran.online",
      tagline: t.products.kehadiran.tagline[lang],
      description: t.products.kehadiran.description[lang],
      url: "https://kehadiran.online",
      showPricing: true,
      features: [
        { icon: QrCode, text: t.products.kehadiran.f1[lang] },
        { icon: Bell, text: t.products.kehadiran.f2[lang] },
        { icon: BarChart3, text: t.products.kehadiran.f3[lang] },
        { icon: Cloud, text: t.products.kehadiran.f4[lang] },
      ],
    },
    nilai: {
      name: "nilai.online",
      tagline: t.products.nilai.tagline[lang],
      description: t.products.nilai.description[lang],
      url: "https://www.nilai.online",
      showPricing: true,
      features: [
        { icon: FileCheck, text: t.products.nilai.f1[lang] },
        { icon: Shield, text: t.products.nilai.f2[lang] },
        { icon: Users, text: t.products.nilai.f3[lang] },
        { icon: BookOpen, text: t.products.nilai.f4[lang] },
      ],
    },
    zbk: {
      name: "ZBK Transport Services",
      tagline: t.products.zbk.tagline[lang],
      description: t.products.zbk.description[lang],
      url: "https://www.zbktransportservices.com",
      features: [
        { icon: Car, text: t.products.zbk.f1[lang] },
        { icon: MapPin, text: t.products.zbk.f2[lang] },
        { icon: Users, text: t.products.zbk.f3[lang] },
        { icon: Cloud, text: t.products.zbk.f4[lang] },
      ],
    },
    shoppys: {
      name: "ShoppyS AI",
      tagline: t.products.shoppys.tagline[lang],
      description: t.products.shoppys.description[lang],
      url: "https://shoppy-s-ai-apc2.vercel.app",
      features: [
        { icon: Bot, text: t.products.shoppys.f1[lang] },
        { icon: ShoppingCart, text: t.products.shoppys.f2[lang] },
        { icon: Shield, text: t.products.shoppys.f3[lang] },
        { icon: BarChart3, text: t.products.shoppys.f4[lang] },
      ],
    },
    stacks: {
      name: "Stacks AI Web",
      tagline: t.products.stacks.tagline[lang],
      description: t.products.stacks.description[lang],
      url: "https://stacks-ai-web.vercel.app",
      features: [
        { icon: Cpu, text: t.products.stacks.f1[lang] },
        { icon: Workflow, text: t.products.stacks.f2[lang] },
        { icon: BarChart3, text: t.products.stacks.f3[lang] },
        { icon: Cloud, text: t.products.stacks.f4[lang] },
      ],
    },
  };

  const productKeys: ProductKey[] = ["kehadiran", "nilai", "zbk", "shoppys", "stacks"];
  const current = products[activeProduct];

  return (
    <section id="products" className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      <GlowOrb className="top-1/4 right-[-200px]" color="gold" size={500} blur={150} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <p className="text-xs font-medium tracking-widest uppercase text-glow-gold">{t.products.label[lang]}</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
                {t.products.title1[lang]}{" "}
                <span className="gradient-text-gold">{t.products.title2[lang]}</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.products.subtitle[lang]}
              </p>
            </div>
          </FadeIn>

          {/* Product Tabs */}
          <FadeIn delay={0.1}>
            <div className="flex justify-center">
              <div className="flex overflow-x-auto hide-scrollbar gap-1 p-1 rounded-2xl glass-card max-w-full">
                {productKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveProduct(key)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      activeProduct === key
                        ? "bg-foreground/10 text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {products[key].name}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Product Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start"
            >
              {/* Product Info */}
              <div className="space-y-6 order-2 lg:order-1">
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl">{current.name}</h3>
                  <p className="text-sm text-glow-gold font-medium">{current.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {current.features.map((feature, index) => (
                    <SpotlightCard key={index} className="flex items-start gap-3 p-3 rounded-xl glass-card">
                      <div className="w-8 h-8 rounded-lg bg-glow-gold/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-glow-gold" />
                      </div>
                      <p className="text-sm text-foreground/80 pt-1">{feature.text}</p>
                    </SpotlightCard>
                  ))}
                </div>

                {/* Pricing - only for SaaS products */}
                {current.showPricing && (
                  <div className="p-5 rounded-xl glass-card space-y-2" style={{ borderColor: "hsl(var(--glow-gold) / 0.15)" }}>
                    <p className="font-display font-bold text-xl">{t.products.pricing[lang]}</p>
                    <p className="text-xs text-muted-foreground">{t.products.setup[lang]}</p>
                    <p className="text-xs text-muted-foreground">{t.products.maintenance[lang]}</p>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="transition-all duration-300"
                    onClick={() => window.open("https://wa.me/6282292195682?text=Halo, saya tertarik dengan " + current.name, "_blank")}
                  >
                    {t.products.scheduleDemo[lang]}
                  </Button>
                  <Button
                    variant="outline"
                    className="glass-card"
                    onClick={() => window.open(current.url, "_blank")}
                  >
                    <ExternalLink className="mr-2 w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{t.products.visit[lang]} {current.name}</span>
                  </Button>
                </div>
              </div>

              {/* Product Preview (iframe) */}
              <div className="order-1 lg:order-2 space-y-3">
                <div className="rounded-2xl glass-card overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/5">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="px-3 py-1 rounded-lg bg-foreground/5 text-[11px] text-muted-foreground truncate text-center font-mono">
                        {current.url}
                      </div>
                    </div>
                  </div>

                  {/* iframe or placeholder */}
                  {showIframe[activeProduct] ? (
                    <iframe
                      src={current.url}
                      title={`Preview ${current.name}`}
                      className="w-full h-[280px] sm:h-[400px] md:h-[500px] bg-white"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  ) : (
                    <div className="w-full h-[280px] sm:h-[400px] md:h-[500px] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-foreground/[0.02] to-transparent">
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">{t.products.clickToLoad[lang]}</p>
                        <p className="text-xs text-muted-foreground/50">{current.name}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-card"
                        onClick={() => setShowIframe(prev => ({ ...prev, [activeProduct]: true }))}
                      >
                        <ChevronDown className="mr-2 w-4 h-4" />
                        {t.products.loadPreview[lang]}
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground/40 text-center">
                  {t.products.previewNote[lang]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
