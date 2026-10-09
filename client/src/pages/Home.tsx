import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AutomationShowcase from "@/components/AutomationShowcase";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BlogPreview from "@/components/BlogPreview";
import { useRef } from "react";
import { usePageReveals } from "@/hooks/use-page-reveals";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  usePageReveals(mainRef);
  return (
    <div className="agency-site min-h-screen bg-background">
      <Navbar />
      <main ref={mainRef}>
        <HeroSection />
        <AutomationShowcase />
        <ServicesSection />
        <AboutSection />
        <BlogPreview />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
