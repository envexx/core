import { DollarSign, Settings, Zap, Layers, Target, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { FadeIn, StaggerContainer, StaggerItem, SpotlightCard, GlowOrb } from "@/components/ui/magic-effects";

export default function AboutSection() {
  const { lang, t } = useI18n();

  const usps = [
    { icon: DollarSign, title: t.about.usp1[lang], description: t.about.usp1Desc[lang] },
    { icon: Settings, title: t.about.usp2[lang], description: t.about.usp2Desc[lang] },
    { icon: Zap, title: t.about.usp3[lang], description: t.about.usp3Desc[lang] },
    { icon: Layers, title: t.about.usp4[lang], description: t.about.usp4Desc[lang] },
    { icon: Target, title: t.about.usp5[lang], description: t.about.usp5Desc[lang] },
    { icon: Users, title: t.about.usp6[lang], description: t.about.usp6Desc[lang] },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <GlowOrb className="top-0 left-[-200px]" color="cyan" size={400} blur={140} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-20">
          {/* Header + Mission */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <FadeIn>
              <div className="space-y-4">
                <p className="text-xs font-medium tracking-widest uppercase text-glow-gold">{t.about.label[lang]}</p>
                <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
                  {t.about.title1[lang]}{" "}
                  <span className="gradient-text-gold">CORE?</span>
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.about.subtitle[lang]}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl glass-card">
                    <p className="font-display font-bold text-base">{t.about.vision[lang]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.about.visionDesc[lang]}</p>
                  </div>
                  <div className="p-4 rounded-xl glass-card">
                    <p className="font-display font-bold text-base">{t.about.mission[lang]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.about.missionDesc[lang]}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* USP Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.08}>
            {usps.map((usp, index) => (
              <StaggerItem key={index}>
                <SpotlightCard className="h-full p-6 rounded-2xl glass-card hover:border-foreground/10 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-glow-gold/10 flex items-center justify-center mb-4">
                    <usp.icon className="w-5 h-5 text-glow-gold" />
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2">{usp.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{usp.description}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Team & Competitive Advantage */}
          <FadeIn>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 md:p-8 rounded-2xl glass-card space-y-4" style={{ borderColor: "hsl(var(--glow-gold) / 0.15)" }}>
                <p className="text-xs font-medium tracking-widest uppercase text-glow-gold">{t.about.team[lang]}</p>
                <p className="font-display font-bold text-2xl">2 Core Members</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.about.teamDesc[lang]}</p>
              </div>
              <SpotlightCard className="p-6 md:p-8 rounded-2xl glass-card space-y-4">
                <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">{t.about.vsSoftwareHouse[lang]}</p>
                <p className="font-display font-semibold text-lg">{t.about.vsSHTitle[lang]}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.about.vsSHDesc[lang]}</p>
              </SpotlightCard>
              <SpotlightCard className="p-6 md:p-8 rounded-2xl glass-card space-y-4">
                <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">{t.about.vsFreelancer[lang]}</p>
                <p className="font-display font-semibold text-lg">{t.about.vsFLTitle[lang]}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.about.vsFLDesc[lang]}</p>
              </SpotlightCard>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
