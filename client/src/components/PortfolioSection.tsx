import { ExternalLink, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared/schema";
import { portfolioSeed } from "@shared/portfolio-data";
import { useI18n } from "@/lib/i18n";
import { FadeIn, StaggerContainer, StaggerItem, SpotlightCard } from "@/components/ui/magic-effects";

const projects: Project[] = portfolioSeed.map((project, index) => ({
  ...project,
  id: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${index}`,
  url: project.url ?? null,
}));

const caseStudiesData = {
  id: [
    { industry: "Pendidikan", challenge: "Pengelolaan data siswa & administrasi manual yang memakan waktu", solution: "Custom web application dengan dashboard terintegrasi", result: "Efisiensi administrasi 60%, akses data real-time" },
    { industry: "Healthcare", challenge: "Antrian pasien panjang, rekam medis terpisah-pisah", solution: "Platform manajemen terpadu dengan appointment system", result: "Pengurangan waktu tunggu, digitalisasi rekam medis" },
    { industry: "E-Commerce", challenge: "Interface kompleks, user engagement rendah", solution: "User-friendly dashboard dengan AI-assisted discovery", result: "User engagement meningkat, transaksi lebih smooth" },
  ],
  en: [
    { industry: "Education", challenge: "Manual student data management consuming excessive time", solution: "Custom web application with integrated dashboard", result: "60% admin efficiency, real-time data access" },
    { industry: "Healthcare", challenge: "Long patient queues, fragmented medical records", solution: "Unified management platform with appointment system", result: "Reduced wait times, digitized medical records" },
    { industry: "E-Commerce", challenge: "Complex interface, low user engagement", solution: "User-friendly dashboard with AI-assisted discovery", result: "Increased user engagement, smoother transactions" },
  ],
};

export default function PortfolioSection() {
  const { lang, t } = useI18n();
  const displayProjects = projects;
  const caseStudies = caseStudiesData[lang];

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <FadeIn>
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-medium tracking-widest uppercase text-glow-gold">{t.portfolio.label[lang]}</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
                {t.portfolio.title1[lang]}{" "}
                <span className="gradient-text-gold">{t.portfolio.title2[lang]}</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.portfolio.subtitle[lang]}</p>
            </div>
          </FadeIn>

          {/* Projects Grid */}
          {displayProjects.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
              {displayProjects.map((project) => (
                <StaggerItem key={project.id}>
                  <SpotlightCard
                    className="group rounded-2xl overflow-hidden glass-card hover:border-foreground/10 transition-all duration-300"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>

                    {/* Project Info */}
                    <div className="p-5 space-y-3">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-[10px] font-medium">
                          {project.category}
                        </Badge>
                        <h3 className="font-display font-semibold text-lg">{project.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full border border-foreground/5 bg-foreground/[0.03] text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project Link */}
                      <div className="pt-1">
                        {project.url ? (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-glow-gold hover:underline transition-colors">
                            {t.portfolio.viewProject[lang]}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">{t.portfolio.comingSoon[lang]}</span>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Case Studies */}
          <FadeIn>
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-xl md:text-2xl">{t.portfolio.caseStudyTitle[lang]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {caseStudies.map((study, index) => (
                  <SpotlightCard key={index} className="p-5 rounded-2xl glass-card space-y-3">
                    <Badge variant="secondary" className="text-[10px]">{study.industry}</Badge>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="text-foreground/70 font-medium">{t.portfolio.challenge[lang]}:</span> {study.challenge}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-foreground/70 font-medium">{t.portfolio.solution[lang]}:</span> {study.solution}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <TrendingUp className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">{study.result}</p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
