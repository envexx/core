import { TextAnimate } from "@/components/ui/text-animate";
import { ArrowUpRight, Bot, Workflow, MessageSquare, Database, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useRef, type PointerEvent } from "react";
import HeroEnergy from "./HeroEnergy";
import { useI18n } from "@/lib/i18n";
import { AgencyAction } from "@/components/ui/agency-action";
import { BrandMark } from "@/components/ui/brand-mark";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export default function HeroSection() {
  const { lang } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 70, damping: 25 });
  const y = useSpring(pointerY, { stiffness: 70, damping: 25 });
  const gridX = useTransform(x, value => value * -0.2);
  const gridY = useTransform(y, value => value * -0.2);

  function moveBackground(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.3);
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.3);
  }

  return <section ref={heroRef} id="hero" className="agency-hero" onPointerMove={moveBackground} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
    <motion.div className="hero-grid-layer" style={{ x: gridX, y: gridY }}><InteractiveGridPattern /></motion.div>
    <motion.div className="hero-halo" style={{ x, y }} aria-hidden="true" />
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
      <h1><TextAnimate text={lang === "id" ? "Kerja lebih cerdas.\nTumbuh bersama AI." : "Work smarter.\nGrow with AI."} /></h1>
      <p className="hero-description">{lang === "id" ? "Kami membangun sistem AI yang menghubungkan data, mengambil keputusan, dan menjalankan proses bisnis. Dari sales hingga operasional, buat pekerjaan bergerak otomatis." : "We build AI systems that connect data, make decisions, and run business processes. From sales to operations, put work in motion automatically."}</p>
      <AgencyAction className="hero-cta" href="#contact">{lang === "id" ? "Bangun solusi AI Anda" : "Build your AI solution"}<ArrowUpRight size={17} /></AgencyAction>
      <a className="hero-secondary" href="#solutions">{lang === "id" ? "Jelajahi cara kerjanya" : "Explore how it works"}<span>↓</span></a>
    </div>
    <div className="hero-bottom-fade" aria-hidden="true" />
  </section>;
}

