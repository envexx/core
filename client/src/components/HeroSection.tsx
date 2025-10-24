import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@assets/generated_images/Futuristic_tech_hero_background_bdc2f9fa.png";

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Futuristic tech background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Geometric Accents */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 border border-glow-cyan/20 rotate-45" />
        <div className="absolute bottom-32 right-20 w-24 h-24 border border-glow-gold/20 rotate-12" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-glow-blue/20 -rotate-45" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 text-glow-gold" />
            <span>Premium Full Stack Development</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight">
            Transformasi Visi Digital
            <br />
            Menjadi <span className="gradient-text-gold">Kenyataan</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Spesialis dalam frontend, backend, UI/UX design, dan deployment.
            Menciptakan aplikasi modern yang elegan, profesional, dan berkelas dunia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("portfolio")}
              className="group px-8 py-6 text-base glow-cyan-hover transition-all duration-300 hover:scale-105"
              data-testid="button-hero-portfolio"
            >
              Lihat Portfolio
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="px-8 py-6 text-base glass-card glow-border-gold hover:scale-105 transition-all duration-300"
              data-testid="button-hero-contact"
            >
              Hubungi Kami
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
            {[
              { value: "50+", label: "Proyek Selesai" },
              { value: "100%", label: "Kepuasan Klien" },
              { value: "5+", label: "Tahun Pengalaman" },
              { value: "24/7", label: "Support" },
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
