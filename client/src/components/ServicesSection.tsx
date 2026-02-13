import { Code2, Smartphone, Building2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { FadeIn, StaggerContainer, StaggerItem, SpotlightCard } from "@/components/ui/magic-effects";

export default function ServicesSection() {
  const { lang, t } = useI18n();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    { icon: Code2, title: "Web Application Development", description: t.services.web[lang] },
    { icon: Smartphone, title: "Mobile Application Development", description: t.services.mobile[lang] },
    { icon: Building2, title: "Enterprise Solutions", description: t.services.enterprise[lang] },
    { icon: MessageSquare, title: "Consultation & Digital Strategy", description: t.services.consultation[lang] },
  ];

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <FadeIn>
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-medium tracking-widest uppercase text-glow-gold">{t.services.label[lang]}</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
                {t.services.title1[lang]}
                <br />
                <span className="text-muted-foreground">{t.services.title2[lang]}</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.services.subtitle[lang]}
              </p>
            </div>
          </FadeIn>

          {/* Services Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
            {services.map((service, index) => (
              <StaggerItem key={index}>
                <SpotlightCard className="h-full p-6 md:p-8 rounded-2xl glass-card hover:border-foreground/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-glow-gold/10 flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-5 h-5 text-glow-gold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-semibold text-base">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Pricing CTA */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 md:p-8 rounded-2xl glass-card border-glow-gold/15">
              <div className="flex-1 space-y-1">
                <p className="font-display font-semibold text-lg">{t.services.pricingTitle[lang]}</p>
                <p className="text-sm text-muted-foreground">{t.services.pricingDesc[lang]}</p>
              </div>
              <Button
                onClick={() => scrollToSection("contact")}
                className="group transition-all duration-300 flex-shrink-0"
              >
                {t.services.pricingCta[lang]}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
