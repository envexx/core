import { Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Generate initials from author name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-glow-cyan blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-glow-gold blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Apa Kata <span className="gradient-text-gold">Klien</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Kepercayaan dan kepuasan klien adalah prioritas utama kami.
              Berikut testimoni dari mereka yang telah bekerja sama dengan ENVEXX.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="glass-card p-8 rounded-2xl space-y-6 animate-pulse"
                >
                  <div className="w-12 h-12 bg-muted/50 rounded-lg" />
                  <div className="space-y-3">
                    <div className="h-4 bg-muted/50 rounded" />
                    <div className="h-4 bg-muted/50 rounded w-5/6" />
                    <div className="h-4 bg-muted/50 rounded w-4/6" />
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="w-12 h-12 bg-muted/50 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted/50 rounded w-1/3" />
                      <div className="h-3 bg-muted/50 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testimonials Grid */}
          {!isLoading && testimonials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="glass-card p-8 rounded-2xl space-y-6 hover:scale-105 transition-all duration-300 glow-border-cyan"
                  data-testid={`testimonial-${testimonial.id}`}
                >
                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-glow-cyan/20 to-glow-gold/20 flex items-center justify-center">
                    <Quote className="w-6 h-6 text-glow-cyan" />
                  </div>

                  {/* Quote Text */}
                  <blockquote className="text-base md:text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-glass-border/20">
                    <Avatar className="w-12 h-12 glass-card">
                      <AvatarFallback className="font-display font-semibold bg-gradient-to-br from-glow-cyan/20 to-glow-gold/20">
                        {getInitials(testimonial.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-display font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.position} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && testimonials.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Belum ada testimoni yang ditampilkan.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
