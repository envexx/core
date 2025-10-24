# ENVEXX Portfolio Website

## Overview
ENVEXX adalah website portofolio premium untuk brand full stack development dengan desain Web3-inspired yang clean, elegan, dan mewah. Website ini menggunakan color palette netral (hitam, putih, gold) dengan aksen electric blue/cyan untuk menciptakan kesan profesional, modern, dan futuristik.

## Current State
**Status**: Frontend complete, backend in progress
**Last Updated**: January 2025

## Recent Changes
- **January 2025**: 
  - Implemented complete Web3-inspired design system with glassmorphism, glowing effects, and premium aesthetics
  - Created all frontend components: Navbar, Hero, About, Portfolio, Testimonials, Contact, Footer
  - Generated high-quality project images for portfolio showcase
  - Setup color scheme: black/white base with gold (#D4AF37) and cyan (#00D9FF) accents
  - Configured typography: Outfit for headings, Inter for body text, Space Grotesk for tech elements

## Project Architecture

### Technology Stack
**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS with custom Web3 utilities
- Wouter (routing)
- TanStack Query (data fetching)
- Framer Motion concepts (animations)
- Shadcn UI components
- Lucide React (icons)

**Backend:**
- Express.js
- Node.js
- In-memory storage (MemStorage)
- TypeScript

### Design System
**Color Palette:**
- Primary: Black (#0A0A0A in light, #FAFAFA in dark)
- Accent Gold: #D4AF37 (warm, luxurious)
- Accent Cyan: #00D9FF (electric, futuristic)
- Glass effects with backdrop blur
- Gradient overlays for depth

**Typography:**
- Display/Headings: Outfit (600-800 weight)
- Body: Inter (400-600 weight)
- Tech elements: Space Grotesk

**Key Design Features:**
- Glassmorphism cards with backdrop blur
- Glowing button effects on hover
- Gradient text for premium headings
- Floating animations for testimonials
- Smooth scroll behavior
- Fully responsive (mobile-first)

### File Structure
```
client/
  src/
    components/
      Navbar.tsx - Fixed glassmorphism navbar with smooth scroll
      HeroSection.tsx - Full-screen hero with CTA buttons
      AboutSection.tsx - Vision, mission, skills grid
      PortfolioSection.tsx - Project showcase with hover effects
      TestimonialsSection.tsx - Client testimonials with floating cards
      ContactSection.tsx - Contact form with glass inputs
      Footer.tsx - Premium footer with social links
    pages/
      Home.tsx - Main landing page
    index.css - Web3 custom utilities (glass, glows, gradients)
  index.html - SEO optimized with meta tags

shared/
  schema.ts - Data models (projects, testimonials, contact)

server/
  routes.ts - API endpoints
  storage.ts - In-memory storage interface

attached_assets/
  generated_images/ - Portfolio project mockups and hero background
```

## Features

### Completed
1. ✅ Hero section with logo, tagline, and glowing CTA buttons
2. ✅ About section with vision/mission and skills grid (6 skills)
3. ✅ Portfolio showcase with 6 projects (E-commerce, Analytics, Social, Banking, Real Estate, Fitness)
4. ✅ Testimonials section with 4 client quotes
5. ✅ Contact form with glass effects and WhatsApp integration
6. ✅ Fully responsive navigation with mobile menu
7. ✅ Web3 glassmorphism design throughout
8. ✅ Glowing button effects (cyan and gold variants)
9. ✅ Gradient text for headings
10. ✅ Floating animations
11. ✅ SEO meta tags
12. ✅ Premium footer with social links

### In Progress
- Backend API implementation
- Contact form submission handling
- Data fetching for portfolio and testimonials

### Planned
- Email notification system
- Analytics integration
- Performance optimization
- Additional micro-interactions

## Data Models

### Project
```typescript
{
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
}
```

### Testimonial
```typescript
{
  id: string
  quote: string
  author: string
  company: string
  position: string
}
```

### Contact Submission
```typescript
{
  id: string
  name: string
  email: string
  message: string
}
```

## Design Guidelines
Refer to `design_guidelines.md` for comprehensive design system documentation including:
- Component usage patterns
- Web3 aesthetic principles
- Glassmorphism implementation
- Glow effects and animations
- Typography hierarchy
- Responsive behavior
- Color theory and contrast

## Development Workflow
1. Start application: `npm run dev`
2. Frontend runs on: http://localhost:5000
3. Backend API prefix: `/api`

## User Preferences
- Language: Indonesian (Bahasa Indonesia)
- Design aesthetic: Web3-inspired, premium, minimalist
- Color scheme: Black/White with Gold and Cyan accents
- Typography: Modern, clean, readable
- Animations: Subtle, smooth, professional

## Notes
- All images generated via AI for portfolio projects
- Glassmorphism requires backdrop-filter support (modern browsers)
- Smooth scroll behavior enabled globally
- Mobile-first responsive design approach
- Focus on visual excellence and premium feel
