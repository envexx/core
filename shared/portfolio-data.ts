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
    title: "ShoppyS AI Marketplace",
    description:
      "AI-assisted commerce destination delivering conversational product discovery and frictionless checkout.",
    image: "/shoppys.png",
    technologies: ["Next.js", "Node.js", "Stripe", "Redis"],
    category: "E-Commerce",
    url: "https://shoppy-s-ai-apc2.vercel.app/",
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
