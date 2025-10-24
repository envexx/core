import { 
  type Project, 
  type InsertProject,
  type Testimonial,
  type InsertTestimonial,
  type ContactSubmission,
  type InsertContact
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Contact Submissions
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private testimonials: Map<string, Testimonial>;
  private contactSubmissions: Map<string, ContactSubmission>;

  constructor() {
    this.projects = new Map();
    this.testimonials = new Map();
    this.contactSubmissions = new Map();
    
    // Seed initial data
    this.seedData();
  }

  private seedData() {
    // Seed Projects
    const projectsData: InsertProject[] = [
      {
        title: "E-Commerce Platform Premium",
        description: "Platform e-commerce modern dengan fitur lengkap, payment gateway terintegrasi, dan admin dashboard yang powerful.",
        image: "/assets/generated_images/E-commerce_project_mockup_9e5f7f0f.png",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        category: "Web Application",
      },
      {
        title: "Analytics Dashboard Pro",
        description: "Dashboard analytics real-time dengan visualisasi data yang stunning dan insights mendalam untuk business intelligence.",
        image: "/assets/generated_images/Analytics_dashboard_project_3f5cd206.png",
        technologies: ["Next.js", "TypeScript", "D3.js", "Redis"],
        category: "Data Visualization",
      },
      {
        title: "Social Media Platform",
        description: "Platform social media dengan real-time messaging, content sharing, dan engagement features yang interaktif.",
        image: "/assets/generated_images/Social_platform_project_c866b343.png",
        technologies: ["React", "Express", "WebSocket", "MongoDB"],
        category: "Social Platform",
      },
      {
        title: "Mobile Banking App",
        description: "Aplikasi mobile banking yang secure dengan fitur transfer, payment, investment tracking, dan financial planning.",
        image: "/assets/generated_images/Banking_app_project_1d00ab75.png",
        technologies: ["React Native", "Node.js", "PostgreSQL", "JWT"],
        category: "Fintech",
      },
      {
        title: "Real Estate Marketplace",
        description: "Marketplace properti premium dengan virtual tour, advanced search filters, dan sistem booking yang seamless.",
        image: "/assets/generated_images/Real_estate_platform_project_4f61eba2.png",
        technologies: ["Vue.js", "Laravel", "MySQL", "Google Maps API"],
        category: "Marketplace",
      },
      {
        title: "Fitness & Wellness App",
        description: "Aplikasi fitness tracking dengan workout plans, nutrition guides, progress monitoring, dan community features.",
        image: "/assets/generated_images/Fitness_app_project_85b545c7.png",
        technologies: ["React", "Express", "MongoDB", "Chart.js"],
        category: "Health & Fitness",
      },
    ];

    projectsData.forEach((project) => {
      const id = randomUUID();
      this.projects.set(id, { ...project, id });
    });

    // Seed Testimonials
    const testimonialsData: InsertTestimonial[] = [
      {
        quote: "ENVEXX mengubah visi kami menjadi aplikasi yang luar biasa. Kualitas kode dan desain yang mereka berikan benar-benar premium dan profesional.",
        author: "Sarah Johnson",
        position: "CEO",
        company: "TechStart Indonesia",
      },
      {
        quote: "Tim yang sangat responsif dan detail-oriented. Mereka memahami kebutuhan bisnis kami dan memberikan solusi yang melebihi ekspektasi.",
        author: "Michael Chen",
        position: "CTO",
        company: "Digital Ventures",
      },
      {
        quote: "Pengalaman kerja sama yang luar biasa! ENVEXX tidak hanya membangun aplikasi, tapi juga memberikan konsultasi strategis yang sangat valuable.",
        author: "Rina Wijaya",
        position: "Product Manager",
        company: "Innovation Labs",
      },
      {
        quote: "Kualitas hasil kerja yang exceptional. Setiap detail diperhatikan dengan sempurna, dari UI/UX hingga performa aplikasi yang sangat optimal.",
        author: "David Anderson",
        position: "Founder",
        company: "StartupHub Asia",
      },
    ];

    testimonialsData.forEach((testimonial) => {
      const id = randomUUID();
      this.testimonials.set(id, { ...testimonial, id });
    });
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Contact Submissions
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const id = randomUUID();
    const contact: ContactSubmission = { ...insertContact, id };
    this.contactSubmissions.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
