// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";

// shared/portfolio-data.ts
var portfolioSeed = [
  {
    title: "Klinik Yamet Digital Care",
    description: "Integrated clinic platform supporting appointments, electronic medical records, and responsive teleconsultations.",
    image: "/klinik yamet.png",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    category: "Healthcare Platform",
    url: "https://yametbatamtiban.id/"
  },
  {
    title: "ShoppyS AI Marketplace",
    description: "AI-assisted commerce destination delivering conversational product discovery and frictionless checkout.",
    image: "/shoppys.png",
    technologies: ["Next.js", "Node.js", "Stripe", "Redis"],
    category: "E-Commerce",
    url: "https://shoppy-s-ai-apc2.vercel.app/"
  },
  {
    title: "Stellar Horizon Event Hub",
    description: "Immersive event microsite featuring animated storytelling, live scheduling, and sponsor showcases.",
    image: "/stellar.png",
    technologies: ["Next.js", "Framer Motion", "Supabase", "Tailwind CSS"],
    category: "Event Website",
    url: "https://stellar-horizon-batam-landing.vercel.app/"
  },
  {
    title: "Yamet Children Mobile App",
    description: "Android companion app empowering parents to track progress, receive updates, and collaborate with educators.",
    image: "/app.png",
    technologies: ["React Native", "Expo", "Firebase", "TypeScript"],
    category: "Mobile Application",
    url: null
  }
];

// server/storage.ts
var MemStorage = class {
  projects;
  testimonials;
  contactSubmissions;
  constructor() {
    this.projects = /* @__PURE__ */ new Map();
    this.testimonials = /* @__PURE__ */ new Map();
    this.contactSubmissions = /* @__PURE__ */ new Map();
    this.seedData();
  }
  seedData() {
    const projectsData = portfolioSeed;
    projectsData.forEach((project) => {
      const id = randomUUID();
      this.projects.set(id, { ...project, id, url: project.url ?? null });
    });
    const testimonialsData = [
      {
        quote: "ENVEXX mengubah visi kami menjadi aplikasi yang luar biasa. Kualitas kode dan desain yang mereka berikan benar-benar premium dan profesional.",
        author: "Sarah Johnson",
        position: "CEO",
        company: "TechStart Indonesia"
      },
      {
        quote: "Tim yang sangat responsif dan detail-oriented. Mereka memahami kebutuhan bisnis kami dan memberikan solusi yang melebihi ekspektasi.",
        author: "Michael Chen",
        position: "CTO",
        company: "Digital Ventures"
      },
      {
        quote: "Pengalaman kerja sama yang luar biasa! ENVEXX tidak hanya membangun aplikasi, tapi juga memberikan konsultasi strategis yang sangat valuable.",
        author: "Rina Wijaya",
        position: "Product Manager",
        company: "Innovation Labs"
      },
      {
        quote: "Kualitas hasil kerja yang exceptional. Setiap detail diperhatikan dengan sempurna, dari UI/UX hingga performa aplikasi yang sangat optimal.",
        author: "David Anderson",
        position: "Founder",
        company: "StartupHub Asia"
      }
    ];
    testimonialsData.forEach((testimonial) => {
      const id = randomUUID();
      this.testimonials.set(id, { ...testimonial, id });
    });
  }
  // Projects
  async getAllProjects() {
    return Array.from(this.projects.values());
  }
  async getProject(id) {
    return this.projects.get(id);
  }
  async createProject(insertProject) {
    const id = randomUUID();
    const project = { ...insertProject, id, url: insertProject.url ?? null };
    this.projects.set(id, project);
    return project;
  }
  // Testimonials
  async getAllTestimonials() {
    return Array.from(this.testimonials.values());
  }
  async getTestimonial(id) {
    return this.testimonials.get(id);
  }
  async createTestimonial(insertTestimonial) {
    const id = randomUUID();
    const testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  // Contact Submissions
  async getAllContactSubmissions() {
    return Array.from(this.contactSubmissions.values());
  }
  async createContactSubmission(insertContact) {
    const id = randomUUID();
    const contact = { ...insertContact, id };
    this.contactSubmissions.set(id, contact);
    return contact;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull(),
  category: text("category").notNull(),
  url: text("url")
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true
});
var testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull()
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true
});
var contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull()
});
var insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true
}).extend({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter")
});

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getAllProjects();
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });
  app2.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials2 = await storage.getAllTestimonials();
      res.json(testimonials2);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });
  app2.get("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonial = await storage.getTestimonial(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      res.status(500).json({ error: "Failed to fetch testimonial" });
    }
  });
  app2.post("/api/testimonials", async (req, res) => {
    try {
      const data = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(data);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating testimonial:", error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const contact = await storage.createContactSubmission(data);
      console.log("New contact submission received:");
      console.log(`Name: ${contact.name}`);
      console.log(`Email: ${contact.email}`);
      console.log(`Message: ${contact.message}`);
      res.status(201).json({
        success: true,
        message: "Pesan berhasil dikirim! Kami akan segera menghubungi Anda.",
        id: contact.id
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          success: false,
          error: error.errors[0].message
        });
      }
      console.error("Error creating contact submission:", error);
      res.status(500).json({
        success: false,
        error: "Terjadi kesalahan. Silakan coba lagi."
      });
    }
  });
  app2.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  const listenOptions = {
    port,
    host: "0.0.0.0"
  };
  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }
  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();
