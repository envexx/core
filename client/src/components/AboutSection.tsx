import { Code2, Palette, Server, Rocket, Shield, Zap } from "lucide-react";

export default function AboutSection() {
  const skills = [
    {
      icon: Code2,
      title: "Frontend Development",
      description: "React, Vue, Next.js, TypeScript",
    },
    {
      icon: Server,
      title: "Backend Development",
      description: "Node.js, Express, PostgreSQL, APIs",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Figma, Responsive Design, Web3 Aesthetics",
    },
    {
      icon: Rocket,
      title: "Deployment & DevOps",
      description: "CI/CD, Cloud Services, Optimization",
    },
    {
      icon: Shield,
      title: "Security & Performance",
      description: "Authentication, Encryption, Speed",
    },
    {
      icon: Zap,
      title: "Modern Tech Stack",
      description: "Cutting-edge tools and frameworks",
    },
  ];

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            hsl(var(--glow-cyan)) 0px,
            transparent 1px,
            transparent 40px,
            hsl(var(--glow-cyan)) 41px
          ),
          repeating-linear-gradient(
            90deg,
            hsl(var(--glow-cyan)) 0px,
            transparent 1px,
            transparent 40px,
            hsl(var(--glow-cyan)) 41px
          )`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Tentang <span className="gradient-text-gold">ENVEXX</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Kami adalah tim full stack developer yang berdedikasi untuk menciptakan
              solusi digital premium. Dengan perpaduan keahlian teknis dan estetika modern,
              kami menghadirkan aplikasi yang tidak hanya powerful, tetapi juga indah dipandang.
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-all duration-300 glow-border-cyan">
              <h3 className="font-display font-semibold text-2xl">Visi Kami</h3>
              <p className="text-muted-foreground leading-relaxed">
                Menjadi mitra terpercaya dalam transformasi digital dengan menghadirkan
                solusi teknologi berkelas dunia yang menggabungkan inovasi, estetika,
                dan performa optimal.
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-all duration-300 glow-border-gold">
              <h3 className="font-display font-semibold text-2xl">Misi Kami</h3>
              <p className="text-muted-foreground leading-relaxed">
                Memberikan layanan full stack development dengan standar tertinggi,
                fokus pada kualitas kode, user experience yang exceptional, dan
                kepuasan klien yang maksimal.
              </p>
            </div>
          </div>

          {/* Skills Grid */}
          <div>
            <h3 className="font-display font-semibold text-3xl md:text-4xl text-center mb-12">
              Keahlian <span className="gradient-text-cyan">Kami</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-xl space-y-4 hover:scale-105 hover:-translate-y-2 transition-all duration-300 group"
                  data-testid={`skill-${index}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-glow-cyan/20 to-glow-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <skill.icon className="w-6 h-6 text-glow-cyan" />
                  </div>
                  <h4 className="font-display font-semibold text-lg">
                    {skill.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
