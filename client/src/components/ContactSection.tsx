import { useState } from "react";
import { Mail, MapPin, Phone, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";
import { useI18n } from "@/lib/i18n";
import { FadeIn, GlowOrb } from "@/components/ui/magic-effects";

export default function ContactSection() {
  const { lang, t } = useI18n();
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
        title: t.contact.successTitle[lang],
        description: t.contact.successDesc[lang],
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast({
        title: t.contact.errorTitle[lang],
        description: t.contact.errorDesc[lang],
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
      value: "coresolution3@gmail.com",
      link: "mailto:coresolution3@gmail.com",
    },
    {
      icon: Phone,
      label: "WhatsApp",
      value: "+62 822-9219-5682",
      link: "https://wa.me/6282292195682",
    },
    {
      icon: MapPin,
      label: t.contact.location[lang],
      value: "Batam, Indonesia",
      link: null,
    },
  ];

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      <GlowOrb className="bottom-0 right-[-50px] sm:right-[-100px]" color="gold" size={250} blur={100} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="space-y-16">
          {/* Header */}
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <p className="text-xs font-medium tracking-widest uppercase text-glow-gold">{t.contact.label[lang]}</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
                {t.contact.title1[lang]}{" "}
                <span className="gradient-text-gold">{t.contact.title2[lang]}</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.contact.subtitle[lang]}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3 p-6 md:p-8 rounded-2xl glass-card space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-xl">
                  {t.contact.formTitle[lang]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.contact.formDesc[lang]}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-foreground/70">
                      {t.contact.name[lang]}
                    </label>
                    <Input
                      id="name"
                      placeholder={t.contact.namePlaceholder[lang]}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="glass-input text-sm"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-foreground/70">
                      {t.contact.email[lang]}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.contact.emailPlaceholder[lang]}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="glass-input text-sm"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-foreground/70">
                    {t.contact.message[lang]}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t.contact.messagePlaceholder[lang]}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="glass-input min-h-28 text-sm"
                    required
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full glow-cyan-hover transition-all duration-300"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? (
                    t.contact.sending[lang]
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      {t.contact.submit[lang]}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl glass-card hover:border-foreground/10 transition-all duration-300"
                  data-testid={`contact-info-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-glow-gold/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 text-glow-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{info.label}</p>
                      {info.link ? (
                        <a
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:text-glow-gold transition-colors break-all"
                          data-testid={`link-${info.label.toLowerCase()}`}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <div className="p-5 rounded-xl glass-card space-y-4" style={{ borderColor: "hsl(var(--glow-gold) / 0.15)" }}>
                <p className="font-display font-semibold text-base">{t.contact.quickTitle[lang]}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.contact.quickDesc[lang]}
                </p>
                <Button
                  variant="outline"
                  className="w-full glass-card glow-border-gold text-sm"
                  onClick={() => window.open("https://wa.me/6282292195682?text=Halo CORE, saya tertarik untuk konsultasi mengenai solusi digital.", "_blank")}
                  data-testid="button-whatsapp"
                >
                  <Phone className="mr-2 w-4 h-4" />
                  {t.contact.whatsapp[lang]}
                  <ArrowRight className="ml-auto w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
