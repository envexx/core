import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AutomationShowcase from "@/components/AutomationShowcase";
import Footer from "@/components/Footer";
import { lazy, Suspense, useRef } from "react";
import { usePageReveals } from "@/hooks/use-page-reveals";

// Below-the-fold sections load as separate chunks; the hero stays in the entry.
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  usePageReveals(mainRef);
  return (
    <div className="agency-site min-h-screen bg-background">
      <Navbar />
      <main ref={mainRef}>
        <HeroSection />
        <AutomationShowcase />
        <Suspense fallback={null}>
          <ServicesSection />
          <AboutSection />
          <BlogPreview />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
