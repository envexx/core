import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MessageSquare, MapPin, Loader2, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { AgencyAction } from "@/components/ui/agency-action";
import type { InsertContact } from "@shared/schema";

export default function ContactSection() {
  const { lang } = useI18n();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [feedback, setFeedback] = useState("");
  const mutation = useMutation({
    mutationFn: (data: InsertContact) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      const message = lang === "id" ? "Terima kasih! Pesan Anda sudah diterima. Tim kami akan segera menghubungi Anda." : "Thank you! Your message has been received. Our team will get in touch.";
      setFeedback(message);
      toast({ title: lang === "id" ? "Pesan terkirim" : "Message sent", description: message });
      setForm({ name: "", email: "", message: "" });
    },
    onError: () => {
      const message = lang === "id" ? "Pesan belum terkirim. Coba lagi atau hubungi kami melalui WhatsApp." : "Your message wasn't sent. Try again or reach us on WhatsApp.";
      setFeedback(message);
      toast({ title: lang === "id" ? "Gagal mengirim" : "Unable to send", description: message, variant: "destructive" });
    },
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    mutation.mutate(form);
  }
  return <section id="contact" className="agency-container contact-section">
    <div className="contact-panel">
      <div className="contact-copy"><span className="section-kicker"><span className="status-dot" />LET'S BUILD SOMETHING SMART</span><h2>{lang === "id" ? <>Apa yang bisa<br />kita otomatisasi?</> : <>What can we<br />automate for you?</>}</h2><p>{lang === "id" ? "Ceritakan tantangan bisnis Anda. Kita temukan cara agar AI bisa membantu tim bekerja lebih baik." : "Tell us about your business challenges. Let's find how AI can help your team work better."}</p><a className="contact-whatsapp" href="https://wa.me/6282292195682" target="_blank" rel="noopener noreferrer"><MessageSquare size={17} />{lang === "id" ? "Ngobrol lewat WhatsApp" : "Chat on WhatsApp"}<ArrowUpRight size={16} /></a><div className="contact-details"><a href="mailto:coresolution3@gmail.com"><Mail size={14} />coresolution3@gmail.com</a><span><MapPin size={14} />Batam, Indonesia</span></div></div>
      <form className="contact-form" onSubmit={submit}>
        <div className="contact-form-row"><div><label htmlFor="name">{lang === "id" ? "Nama Anda" : "Your name"}</label><input id="name" name="name" autoComplete="name" placeholder={lang === "id" ? "Nama lengkap" : "Full name"} required minLength={2} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} data-testid="input-name" /></div><div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} data-testid="input-email" /></div></div>
        <div><label htmlFor="message">{lang === "id" ? "Apa yang ingin Anda bangun?" : "What would you like to build?"}</label><textarea id="message" name="message" rows={5} placeholder={lang === "id" ? "Contoh: AI agent untuk customer support, automasi follow-up leads, atau proses internal tim…" : "E.g. an AI agent for customer support, lead follow-up automation, or internal team workflows…"} required minLength={10} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} data-testid="input-message" /></div>
        <AgencyAction type="submit" isLoading={mutation.isPending} loadingText={lang === "id" ? "Mengirim…" : "Sending…"} data-testid="button-submit-contact">{lang === "id" ? "Mari diskusikan" : "Let's discuss"}</AgencyAction>
        <p className="form-note"><Check size={12} />{lang === "id" ? "Mulai dengan konsultasi. Tanpa komitmen." : "Start with a conversation. No commitment."}</p>
        <p className={`form-feedback ${mutation.isError ? "feedback-error" : ""}`} role="status">{feedback}</p>
      </form>
    </div>
  </section>;
}

