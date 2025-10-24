import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

const fallbackProjects: Project[] = [
  {
    id: "fallback-klinik-yamet",
    title: "Klinik Yamet Digital Care",
    description:
      "Integrated clinic platform supporting appointments, electronic medical records, and responsive teleconsultations.",
    image: "/klinik yamet.png",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    category: "Healthcare Platform",
    url: "https://yametbatamtiban.id/",
  },
  {
    id: "fallback-shoppys",
    title: "ShoppyS AI Marketplace",
    description:
      "AI-assisted commerce destination delivering conversational product discovery and frictionless checkout.",
    image: "/shoppys.png",
    technologies: ["Next.js", "Node.js", "Stripe", "Redis"],
    category: "E-Commerce",
    url: "https://shoppy-s-ai-apc2.vercel.app/",
  },
  {
    id: "fallback-stellar",
    title: "Stellar Horizon Event Hub",
    description:
      "Immersive event microsite featuring animated storytelling, live scheduling, and sponsor showcases.",
    image: "/stellar.png",
    technologies: ["Next.js", "Framer Motion", "Supabase", "Tailwind CSS"],
    category: "Event Website",
    url: "https://stellar-horizon-batam-landing.vercel.app/",
  },
  {
    id: "fallback-concierge",
    title: "CORE Client Concierge",
    description:
      "Client services portal offering project health dashboards, roadmap planning, and integrated support chat.",
    image: "/app.png",
    technologies: ["Next.js", "GraphQL", "Apollo", "Tailwind CSS"],
    category: "Client Services",
    url: null,
  },
];

const dedupeProjects = (items: Project[]) => {
  const seen = new Set<string>();
  return items.filter((project) => {
    const key = project.title.trim().toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export default function PortfolioSection() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  const displayProjects = dedupeProjects(
    projects.length ? projects : fallbackProjects
  );

  return (
    <section id="portfolio" className="relative py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Featured <span className="gradient-text-gold">Portfolio</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              A curated showcase of digital products engineered to accelerate client growth through
              intentional design, resilient architecture, and purposeful user experiences.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-muted/50" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-muted/50 rounded w-3/4" />
                    <div className="h-4 bg-muted/50 rounded w-1/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/50 rounded" />
                      <div className="h-4 bg-muted/50 rounded w-5/6" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted/50 rounded w-16" />
                      <div className="h-6 bg-muted/50 rounded w-20" />
                      <div className="h-6 bg-muted/50 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && displayProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project) => (
                <div
                  key={project.id}
                  className="group glass-card rounded-2xl overflow-hidden hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                  data-testid={`project-${project.id}`}
                >
                  {/* Project Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                  </div>

                  {/* Project Info */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {project.category}
                      </Badge>
                      <h3 className="font-display font-semibold text-xl group-hover:gradient-text-cyan transition-all">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs glass-card"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    {/* Project Link */}
                    <div>
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-glow-cyan hover:text-glow-gold transition-colors"
                          data-testid={`link-project-${project.id}`}
                        >
                          Visit Project
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs uppercase tracking-wide text-muted-foreground/80">
                          Preview Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Our portfolio is being updated. New case studies will be published shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
