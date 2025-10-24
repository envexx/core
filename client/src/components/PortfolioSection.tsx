import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function PortfolioSection() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <section id="portfolio" className="relative py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Portfolio <span className="gradient-text-gold">Terbaik</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Koleksi proyek-proyek yang telah kami kerjakan dengan standar
              kualitas premium dan teknologi terkini.
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
          {!isLoading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
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
                    
                    {/* View Project Button - appears on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="glass-card px-6 py-3 rounded-lg font-medium flex items-center gap-2 glow-cyan-hover"
                        data-testid={`button-view-${project.id}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Lihat Detail
                      </button>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Belum ada proyek yang ditampilkan.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
