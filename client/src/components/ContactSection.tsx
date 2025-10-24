import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih! Kami akan segera menghubungi Anda.",
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Terjadi Kesalahan",
        description: "Mohon coba lagi atau hubungi kami melalui WhatsApp.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@envexx.com",
      link: "mailto:hello@envexx.com",
    },
    {
      icon: Phone,
      label: "WhatsApp",
      value: "+62 812-3456-7890",
      link: "https://wa.me/6281234567890",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Jakarta, Indonesia",
      link: null,
    },
  ];

  return (
    <section id="contact" className="relative py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Mari <span className="gradient-text-gold">Berkolaborasi</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Punya ide proyek? Mari diskusikan bagaimana kami dapat membantu
              mewujudkan visi digital Anda.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-8">
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-2xl">
                  Kirim Pesan
                </h3>
                <p className="text-muted-foreground">
                  Isi form di bawah dan kami akan segera menghubungi Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium"
                  >
                    Nama Lengkap
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="glass-input transition-all duration-300"
                    required
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="glass-input transition-all duration-300"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium"
                  >
                    Pesan
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Ceritakan tentang proyek Anda..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="glass-input min-h-32 transition-all duration-300"
                    required
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full glow-cyan-hover transition-all duration-300"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Kirim Pesan
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 rounded-xl space-y-3 hover:scale-105 transition-all duration-300"
                    data-testid={`contact-info-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-glow-cyan/20 to-glow-gold/20 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-glow-cyan" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-muted-foreground mb-1">
                          {info.label}
                        </div>
                        {info.link ? (
                          <a
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:gradient-text-cyan transition-all break-all"
                            data-testid={`link-${info.label.toLowerCase()}`}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="font-medium">{info.value}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact */}
              <div className="glass-card p-8 rounded-2xl space-y-6 glow-border-gold">
                <h4 className="font-display font-semibold text-xl">
                  Butuh Respons Cepat?
                </h4>
                <p className="text-muted-foreground">
                  Hubungi kami langsung via WhatsApp untuk konsultasi gratis
                  dan respons dalam hitungan menit.
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full glass-card glow-border-gold hover:scale-105 transition-all"
                  onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                  data-testid="button-whatsapp"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Chat WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
