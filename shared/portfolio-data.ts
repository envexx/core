import type { InsertProject } from "@shared/schema";

export const portfolioSeed: InsertProject[] = [
  {
    title: "Klinik Yamet Digital Care",
    description:
      "Integrated clinic platform supporting appointments, electronic medical records, and responsive teleconsultations.",
    image: "/klinik yamet.png",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    category: "Healthcare Platform",
    url: "https://yametbatamtiban.id/",
  },
  {
    title: "ZBK Transport Services",
    description:
      "Professional car rental and transport service platform with online booking, fleet management, and responsive design.",
    image: "/zbk.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    category: "Car Rental",
    url: "https://www.zbktransportservices.com/",
  },
  {
    title: "ShoppyS AI Crypto",
    description:
      "AI-powered crypto marketplace delivering conversational product discovery and frictionless checkout experience.",
    image: "/shoppys.png",
    technologies: ["Next.js", "Node.js", "AI/ML", "Crypto"],
    category: "AI Crypto",
    url: "https://shoppy-s-ai-apc2.vercel.app/",
  },
  {
    title: "Stacks AI Web",
    description:
      "Advanced AI web platform for intelligent analysis, workflow automation, and data-driven business insights.",
    image: "/stacks.png",
    technologies: ["Next.js", "AI/ML", "TypeScript", "Tailwind CSS"],
    category: "AI Platform",
    url: "https://stacks-ai-web.vercel.app/",
  },
  {
    title: "Stellar Horizon Event Hub",
    description:
      "Immersive event microsite featuring animated storytelling, live scheduling, and sponsor showcases.",
    image: "/stellar.png",
    technologies: ["Next.js", "Framer Motion", "Supabase", "Tailwind CSS"],
    category: "Event Website",
    url: "https://stellar-horizon-batam-landing.vercel.app/",
  },
  {
    title: "Yamet Children Mobile App",
    description:
      "Android companion app empowering parents to track progress, receive updates, and collaborate with educators.",
    image: "/app.png",
    technologies: ["React Native", "Expo", "Firebase", "TypeScript"],
    category: "Mobile Application",
    url: null,
  },
];
