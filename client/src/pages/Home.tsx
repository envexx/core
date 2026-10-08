import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AutomationShowcase from "@/components/AutomationShowcase";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BlogPreview from "@/components/BlogPreview";

export default function Home() {
  return (
    <div className="agency-site min-h-screen bg-background">
      <Navbar />
      <main>
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
