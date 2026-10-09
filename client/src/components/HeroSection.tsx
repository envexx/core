import { ArrowUpRight, Bot, Workflow, MessageSquare, Database, Sparkles } from "lucide-react";
import { useRef } from "react";
import HeroEnergy from "./HeroEnergy";
import { useHeroMagnet } from "@/hooks/use-hero-magnet";
import { useHeroEntrance } from "@/hooks/use-hero-entrance";
import { useI18n } from "@/lib/i18n";
import { AgencyAction } from "@/components/ui/agency-action";
import { BrandMark } from "@/components/ui/brand-mark";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export default function HeroSection() {
  const { lang } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  useHeroMagnet(heroRef);
  useHeroEntrance(heroRef, lang);
  const headline = lang === "id" ? "Kerja lebih cerdas.\nTumbuh bersama AI." : "Work smarter.\nGrow with AI.";

  return <section ref={heroRef} id="hero" className="agency-hero">
    <div className="hero-grid-layer"><InteractiveGridPattern width={24} height={24} interactive={false} /></div>
    <div className="hero-halo" aria-hidden="true" />
    <HeroEnergy heroRef={heroRef} />
    <div className="hero-orbits" aria-hidden="true">
      <span className="orbit-icon orbit-one"><Workflow size={19} /></span>
      <span className="orbit-icon orbit-two"><MessageSquare size={18} /></span>
      <span className="orbit-icon orbit-three"><Database size={17} /></span>
      <span className="orbit-icon orbit-four"><Bot size={20} /></span>
      <span className="orbit-icon orbit-five"><Sparkles size={17} /></span>
    </div>
    <div className="hero-content agency-container">
      <div className="hero-symbol-anchor"><div className="hero-symbol"><BrandMark /></div></div>
      <p className="hero-eyebrow"><span />AI AGENT & AUTOMATION AGENCY</p>
      <h1 aria-label={headline} key={lang}><span aria-hidden="true">{headline.split(/(\s+)/).map((word, index) => /\s/.test(word) ? word.includes("\n") ? <br key={index} /> : word : <span key={index} className="hero-heading-word">{word}</span>)}</span></h1>
      <p className="hero-description">{lang === "id" ? "Kami membangun sistem AI yang menghubungkan data, mengambil keputusan, dan menjalankan proses bisnis. Dari sales hingga operasional, buat pekerjaan bergerak otomatis." : "We build AI systems that connect data, make decisions, and run business processes. From sales to operations, put work in motion automatically."}</p>
      <AgencyAction className="hero-cta" href="#contact">{lang === "id" ? "Bangun solusi AI Anda" : "Build your AI solution"}<ArrowUpRight size={17} /></AgencyAction>
      <a className="hero-secondary" href="#solutions">{lang === "id" ? "Jelajahi cara kerjanya" : "Explore how it works"}<span>↓</span></a>
    </div>
    <div className="hero-bottom-fade" aria-hidden="true" />
  </section>;
}

