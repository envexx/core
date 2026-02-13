import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { GridPattern, GlowOrb, FadeIn, FloatingParticles, AnimatedCounter, Marquee } from "@/components/ui/magic-effects";

export default function HeroSection() {
  const { lang, t } = useI18n();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { value: 8, suffix: "+", label: t.hero.stat1[lang] },
    { value: 4, suffix: "+", label: t.hero.stat2[lang] },
    { value: 500, suffix: "+", label: t.hero.stat3[lang] },
    { value: 70, suffix: "%", label: t.hero.stat4[lang] },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      <GridPattern />
      <GlowOrb className="top-[-200px] left-1/2 -translate-x-1/2" color="gold" size={800} blur={150} />
      <GlowOrb className="bottom-[-100px] left-[-100px]" color="cyan" size={400} blur={120} />
      <FloatingParticles count={15} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-20 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-[11px] font-medium tracking-widest uppercase text-foreground/60">
              <div className="w-1.5 h-1.5 rounded-full bg-glow-gold animate-pulse" />
              {t.hero.badge[lang]}
            </div>
          </FadeIn>

          {/* Main Heading */}
          <FadeIn delay={0.2}>
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-[5rem] tracking-tight leading-[1.05]">
              {t.hero.title1[lang]}
              <br />
              <span className="gradient-text-gold">{t.hero.title2[lang]}</span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.35}>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
              {t.hero.subtitle[lang]}
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="group px-8 py-6 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                {t.hero.ctaPrimary[lang]}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("products")}
                className="px-8 py-6 text-sm font-semibold glass-card hover:scale-[1.02] transition-all duration-300"
              >
                <Play className="mr-2 w-4 h-4" />
                {t.hero.ctaSecondary[lang]}
              </Button>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.65}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-16 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card p-4 rounded-2xl space-y-1 hover:scale-[1.03] transition-transform duration-300"
                >
                  <div className="font-display font-bold text-2xl md:text-3xl gradient-text-gold">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Tech Marquee */}
          <FadeIn delay={0.8}>
            <div className="pt-8">
              <Marquee speed={30} className="opacity-40">
                {["Next.js", "React", "Node.js", "PostgreSQL", "Android", "TypeScript", "Tailwind CSS", "Prisma"].map((tech) => (
                  <span key={tech} className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-glow-gold" />
                    {tech}
                  </span>
                ))}
              </Marquee>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
