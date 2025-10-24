import {
  type Project,
  type InsertProject,
  type Testimonial,
  type InsertTestimonial,
  type ContactSubmission,
  type InsertContact,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { portfolioSeed } from "../shared/portfolio-data";

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
    const projectsData: InsertProject[] = portfolioSeed;

    projectsData.forEach((project) => {
      const id = randomUUID();
      this.projects.set(id, { ...project, id, url: project.url ?? null });
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
    const project: Project = { ...insertProject, id, url: insertProject.url ?? null };
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
