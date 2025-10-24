import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/20 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-glow-gold/30 blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
      </div>

      {/* Geometric Accents with subtle rotation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/30 rotate-45 animate-spin" style={{ animationDuration: "20s" }} />
        <div className="absolute bottom-32 right-20 w-24 h-24 border border-glow-gold/30 rotate-12 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-white/20 -rotate-45 animate-spin" style={{ animationDuration: "25s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 text-glow-gold" />
            <span>Integrated Technology Solutions</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight">
            Premium Digital Experiences
            <br />
            Engineered for <span className="gradient-text-gold">Business Growth</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            CORE delivers end-to-end partnerships spanning product strategy, interface design,
            full-stack development, and cloud-scale deployment. Every engagement is crafted to
            elevate your brand presence while driving measurable business outcomes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("portfolio")}
              className="group px-8 py-6 text-base glow-cyan-hover transition-all duration-300 hover:scale-105"
              data-testid="button-hero-portfolio"
            >
              View Portfolio
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="px-8 py-6 text-base glass-card glow-border-gold hover:scale-105 transition-all duration-300"
              data-testid="button-hero-contact"
            >
              Schedule a Consultation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto">
            {[
              { value: "20+", label: "Project Launches" },
              { value: "98%", label: "Partner Satisfaction Rate" },
              { value: "3+", label: "Years of Collective Expertise" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl space-y-2 hover:scale-105 transition-transform"
                data-testid={`stat-${index}`}
              >
                <div className="font-display font-bold text-3xl md:text-4xl gradient-text-cyan">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
