import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "id" | "en";

const translations = {
  nav: {
    home: { id: "Beranda", en: "Home" },
    services: { id: "Layanan", en: "Services" },
    products: { id: "Produk", en: "Products" },
    portfolio: { id: "Portfolio", en: "Portfolio" },
    about: { id: "Tentang", en: "About" },
    contact: { id: "Kontak", en: "Contact" },
    cta: { id: "Konsultasi Gratis", en: "Free Consultation" },
  },
  hero: {
    badge: { id: "Solusi Digital untuk Korporasi & Pendidikan", en: "Digital Solutions for Corporates & Education" },
    title1: { id: "Transformasi Digital", en: "Digital Transformation" },
    title2: { id: "Eksekusi Cepat", en: "Fast Execution" },
    subtitle: {
      id: "CORE Solution Digital adalah partner transformasi digital untuk korporasi dan institusi pendidikan. Custom development berkualitas tinggi dengan harga kompetitif, plus produk SaaS siap pakai untuk sekolah modern Indonesia.",
      en: "CORE Solution Digital is your digital transformation partner for corporates and educational institutions. High-quality custom development at competitive prices, plus ready-to-use SaaS products for modern Indonesian schools.",
    },
    ctaPrimary: { id: "Konsultasi Gratis", en: "Free Consultation" },
    ctaSecondary: { id: "Lihat Demo Produk", en: "View Product Demo" },
    stat1: { id: "Proyek Sukses", en: "Successful Projects" },
    stat2: { id: "Industri Dilayani", en: "Industries Served" },
    stat3: { id: "User Simultan", en: "Concurrent Users" },
    stat4: { id: "Efisiensi Admin", en: "Admin Efficiency" },
  },
  services: {
    label: { id: "Layanan Kami", en: "Our Services" },
    title1: { id: "Custom Development", en: "Custom Development" },
    title2: { id: "Sesuai Kebutuhan Anda", en: "Tailored to Your Needs" },
    subtitle: {
      id: "Pengembangan solusi digital yang disesuaikan 100% dengan business process Anda. Delivery cepat tanpa kompromi kualitas, dengan harga kompetitif mulai dari Rp 20 juta.",
      en: "Digital solutions 100% tailored to your business process. Fast delivery without compromising quality, with competitive pricing starting from IDR 20 million.",
    },
    web: { id: "Aplikasi web custom untuk berbagai industri dengan teknologi modern dan performa optimal.", en: "Custom web applications for various industries with modern technology and optimal performance." },
    mobile: { id: "Aplikasi mobile native Android yang responsif dan user-friendly.", en: "Responsive and user-friendly native Android mobile applications." },
    enterprise: { id: "Sistem terintegrasi untuk kebutuhan korporasi dengan arsitektur yang scalable.", en: "Integrated systems for corporate needs with scalable architecture." },
    consultation: { id: "Konsultasi transformasi digital dari perencanaan hingga implementasi.", en: "Digital transformation consultation from planning to implementation." },
    pricingTitle: { id: "Range Project: Rp 20 - 50 Juta", en: "Project Range: IDR 20 - 50 Million" },
    pricingDesc: { id: "Tergantung kompleksitas. Timeline 2-6 bulan. Konsultasi awal gratis.", en: "Depends on complexity. Timeline 2-6 months. Free initial consultation." },
    pricingCta: { id: "Minta Penawaran", en: "Request Quote" },
  },
  products: {
    label: { id: "Showcase Proyek", en: "Project Showcase" },
    title1: { id: "Lihat Langsung", en: "See Our" },
    title2: { id: "Produk Kami", en: "Products Live" },
    subtitle: {
      id: "Preview langsung produk-produk yang telah kami kembangkan. Dari platform pendidikan hingga solusi bisnis.",
      en: "Live preview of products we've built. From education platforms to business solutions.",
    },
    loadPreview: { id: "Muat Preview", en: "Load Preview" },
    clickToLoad: { id: "Klik untuk memuat preview", en: "Click to load preview" },
    scheduleDemo: { id: "Jadwalkan Demo", en: "Schedule Demo" },
    visit: { id: "Kunjungi", en: "Visit" },
    previewNote: { id: "Preview mungkin memerlukan waktu untuk dimuat. Beberapa fitur mungkin terbatas dalam mode preview.", en: "Preview may take time to load. Some features may be limited in preview mode." },
    kehadiran: {
      tagline: { id: "Smart Attendance System", en: "Smart Attendance System" },
      description: {
        id: "Platform absensi digital untuk sekolah dan institusi pendidikan. Efisiensi pengelolaan data kehadiran dengan transparansi real-time ke orang tua.",
        en: "Digital attendance platform for schools and educational institutions. Efficient attendance data management with real-time transparency to parents.",
      },
      f1: { id: "Scan QR Code untuk absensi cepat dan akurat", en: "QR Code scanning for fast and accurate attendance" },
      f2: { id: "Notifikasi real-time ke orang tua/wali", en: "Real-time notifications to parents/guardians" },
      f3: { id: "Dashboard laporan harian, bulanan, dan tahunan", en: "Daily, monthly, and yearly report dashboard" },
      f4: { id: "Cloud-based, akses dari mana saja", en: "Cloud-based, access from anywhere" },
    },
    nilai: {
      tagline: { id: "Online Examination Platform", en: "Online Examination Platform" },
      description: {
        id: "Platform ujian online untuk institusi pendidikan dengan kapasitas 400-500 peserta simultan. Auto-grading dan anti-cheat system terintegrasi.",
        en: "Online examination platform for educational institutions with 400-500 simultaneous participant capacity. Integrated auto-grading and anti-cheat system.",
      },
      f1: { id: "Multiple question types dengan auto-grading", en: "Multiple question types with auto-grading" },
      f2: { id: "Anti-cheat system untuk integritas ujian", en: "Anti-cheat system for exam integrity" },
      f3: { id: "Kapasitas 400-500 peserta simultan", en: "400-500 simultaneous participant capacity" },
      f4: { id: "Bank soal terintegrasi & laporan komprehensif", en: "Integrated question bank & comprehensive reports" },
    },
    zbk: {
      tagline: { id: "Car Rental & Transport Service", en: "Car Rental & Transport Service" },
      description: {
        id: "Platform penyewaan kendaraan dan layanan transportasi profesional. Booking online, manajemen armada, dan tracking real-time.",
        en: "Professional vehicle rental and transport service platform. Online booking, fleet management, and real-time tracking.",
      },
      f1: { id: "Booking kendaraan online yang mudah dan cepat", en: "Easy and fast online vehicle booking" },
      f2: { id: "Manajemen armada kendaraan terintegrasi", en: "Integrated vehicle fleet management" },
      f3: { id: "Layanan transportasi profesional dan terpercaya", en: "Professional and reliable transport services" },
      f4: { id: "Responsive design untuk semua perangkat", en: "Responsive design for all devices" },
    },
    shoppys: {
      tagline: { id: "AI-Powered Crypto Marketplace", en: "AI-Powered Crypto Marketplace" },
      description: {
        id: "Marketplace berbasis AI untuk produk crypto dengan conversational product discovery dan checkout yang seamless.",
        en: "AI-powered marketplace for crypto products with conversational product discovery and seamless checkout.",
      },
      f1: { id: "AI-assisted product discovery", en: "AI-assisted product discovery" },
      f2: { id: "Conversational shopping experience", en: "Conversational shopping experience" },
      f3: { id: "Integrasi pembayaran crypto", en: "Crypto payment integration" },
      f4: { id: "Dashboard analytics real-time", en: "Real-time analytics dashboard" },
    },
    stacks: {
      tagline: { id: "AI Web Platform", en: "AI Web Platform" },
      description: {
        id: "Platform web AI canggih untuk analisis dan automasi. Memanfaatkan teknologi AI terkini untuk solusi bisnis yang cerdas.",
        en: "Advanced AI web platform for analysis and automation. Leveraging cutting-edge AI technology for intelligent business solutions.",
      },
      f1: { id: "AI-powered analysis dan insights", en: "AI-powered analysis and insights" },
      f2: { id: "Automasi workflow yang cerdas", en: "Intelligent workflow automation" },
      f3: { id: "Dashboard interaktif dan intuitif", en: "Interactive and intuitive dashboard" },
      f4: { id: "Integrasi API yang fleksibel", en: "Flexible API integration" },
    },
    pricing: { id: "Rp 70.000/siswa/tahun", en: "IDR 70,000/student/year" },
    setup: { id: "Setup Fee: Rp 5.000.000 (sekali bayar)", en: "Setup Fee: IDR 5,000,000 (one-time)" },
    maintenance: { id: "Maintenance: Rp 2.000.000/tahun", en: "Maintenance: IDR 2,000,000/year" },
  },
  portfolio: {
    label: { id: "Portfolio", en: "Portfolio" },
    title1: { id: "Proyek yang Telah", en: "Projects We've" },
    title2: { id: "Kami Kerjakan", en: "Delivered" },
    subtitle: {
      id: "8+ proyek sukses dari berbagai industri. Setiap proyek dirancang untuk memberikan dampak nyata bagi bisnis klien.",
      en: "8+ successful projects across multiple industries. Each project designed to deliver real business impact.",
    },
    viewProject: { id: "Lihat Proyek", en: "View Project" },
    comingSoon: { id: "Preview Segera Hadir", en: "Preview Coming Soon" },
    caseStudyTitle: { id: "Dampak Nyata untuk Klien", en: "Real Impact for Clients" },
    challenge: { id: "Tantangan", en: "Challenge" },
    solution: { id: "Solusi", en: "Solution" },
  },
  about: {
    label: { id: "Tentang Kami", en: "About Us" },
    title1: { id: "Mengapa Memilih", en: "Why Choose" },
    subtitle: {
      id: "CORE Solution Digital memberdayakan institusi pendidikan dan korporasi dengan solusi digital yang efisien, terjangkau, dan mudah digunakan. Dengan tim expert yang berpengalaman menangani 8+ proyek dari berbagai industri, kami siap menjadi partner digital Anda.",
      en: "CORE Solution Digital empowers educational institutions and corporates with efficient, affordable, and easy-to-use digital solutions. With an expert team experienced in handling 8+ projects across industries, we're ready to be your digital partner.",
    },
    vision: { id: "Visi", en: "Vision" },
    visionDesc: { id: "Menjadi platform SaaS pilihan utama untuk sekolah di Indonesia", en: "Become the leading SaaS platform for schools in Indonesia" },
    mission: { id: "Misi", en: "Mission" },
    missionDesc: { id: "Solusi digital efisien, terjangkau, dan mudah digunakan", en: "Efficient, affordable, and easy-to-use digital solutions" },
    usp1: { id: "Harga Kompetitif", en: "Competitive Pricing" },
    usp1Desc: { id: "Solusi berkualitas enterprise dengan pricing yang lebih terjangkau. Overhead kecil, value maksimal.", en: "Enterprise-quality solutions at more affordable pricing. Low overhead, maximum value." },
    usp2: { id: "Kustomisasi Tinggi", en: "High Customization" },
    usp2Desc: { id: "Setiap solusi disesuaikan 100% dengan kebutuhan unik bisnis Anda. Tidak ada one-size-fits-all.", en: "Every solution is 100% tailored to your unique business needs. No one-size-fits-all." },
    usp3: { id: "Delivery Cepat", en: "Fast Delivery" },
    usp3Desc: { id: "Tim lean dan gesit dengan proses efisien. Dari ide ke implementasi dalam hitungan minggu.", en: "Lean and agile team with efficient processes. From idea to implementation in weeks." },
    usp4: { id: "Full-Stack Expertise", en: "Full-Stack Expertise" },
    usp4Desc: { id: "Menguasai Next.js, React, Node.js, Android, dan PostgreSQL untuk solusi end-to-end.", en: "Mastering Next.js, React, Node.js, Android, and PostgreSQL for end-to-end solutions." },
    usp5: { id: "Dual Business Model", en: "Dual Business Model" },
    usp5Desc: { id: "Fleksibilitas memilih antara custom development atau produk SaaS siap pakai.", en: "Flexibility to choose between custom development or ready-to-use SaaS products." },
    usp6: { id: "Support Responsif", en: "Responsive Support" },
    usp6Desc: { id: "Komunikasi langsung dengan developer. Bahasa Indonesia, timezone yang sama, respons cepat.", en: "Direct communication with developers. Indonesian language, same timezone, fast response." },
    team: { id: "Tim", en: "Team" },
    teamDesc: { id: "Full-stack Developer & Project Manager. Lean, agile, dan direct communication tanpa birokrasi.", en: "Full-stack Developer & Project Manager. Lean, agile, and direct communication without bureaucracy." },
    vsSoftwareHouse: { id: "vs Software House", en: "vs Software House" },
    vsSHTitle: { id: "Lebih Terjangkau & Cepat", en: "More Affordable & Faster" },
    vsSHDesc: { id: "Harga kompetitif tanpa overhead besar. Komunikasi langsung dengan developer. Keputusan cepat tanpa birokrasi.", en: "Competitive pricing without large overhead. Direct communication with developers. Fast decisions without bureaucracy." },
    vsFreelancer: { id: "vs Freelancer", en: "vs Freelancer" },
    vsFLTitle: { id: "Lebih Reliable & Terstruktur", en: "More Reliable & Structured" },
    vsFLDesc: { id: "Established company dengan track record. Project management terstruktur. Long-term support & maintenance.", en: "Established company with track record. Structured project management. Long-term support & maintenance." },
  },
  contact: {
    label: { id: "Kontak", en: "Contact" },
    title1: { id: "Mulai Proyek Digital", en: "Start Your Digital Project" },
    title2: { id: "Anda Sekarang", en: "Today" },
    subtitle: {
      id: "Konsultasi gratis untuk mendiskusikan kebutuhan digital Anda. Kami siap membantu dari perencanaan hingga implementasi.",
      en: "Free consultation to discuss your digital needs. We're ready to help from planning to implementation.",
    },
    formTitle: { id: "Kirim Pesan", en: "Send Message" },
    formDesc: { id: "Ceritakan kebutuhan proyek Anda dan kami akan merespons dengan rekomendasi awal.", en: "Tell us about your project needs and we'll respond with initial recommendations." },
    name: { id: "Nama Lengkap", en: "Full Name" },
    namePlaceholder: { id: "Nama Anda", en: "Your Name" },
    email: { id: "Email", en: "Email" },
    emailPlaceholder: { id: "email@perusahaan.com", en: "email@company.com" },
    message: { id: "Detail Proyek", en: "Project Details" },
    messagePlaceholder: { id: "Ceritakan tentang proyek Anda: tujuan bisnis, scope, timeline yang diharapkan...", en: "Tell us about your project: business goals, scope, expected timeline..." },
    submit: { id: "Kirim Pesan", en: "Send Message" },
    sending: { id: "Mengirim...", en: "Sending..." },
    successTitle: { id: "Pesan Terkirim", en: "Message Sent" },
    successDesc: { id: "Terima kasih! Kami akan segera merespons pesan Anda.", en: "Thank you! We'll respond to your message shortly." },
    errorTitle: { id: "Terjadi Kesalahan", en: "Something Went Wrong" },
    errorDesc: { id: "Silakan coba lagi atau hubungi kami via WhatsApp.", en: "Please try again or contact us via WhatsApp." },
    location: { id: "Lokasi", en: "Location" },
    quickTitle: { id: "Butuh Respons Cepat?", en: "Need a Quick Response?" },
    quickDesc: { id: "Hubungi kami langsung via WhatsApp untuk konsultasi dan jadwalkan presentasi demo produk.", en: "Contact us directly via WhatsApp for consultation and schedule a product demo presentation." },
    whatsapp: { id: "Chat via WhatsApp", en: "Chat via WhatsApp" },
  },
  footer: {
    company: { id: "Perusahaan", en: "Company" },
    services: { id: "Layanan", en: "Services" },
    productsLabel: { id: "Produk", en: "Products" },
    description: {
      id: "Solusi digital untuk efisiensi korporasi & pendidikan. Berbasis di Batam, melayani klien di seluruh Indonesia.",
      en: "Digital solutions for corporate & education efficiency. Based in Batam, serving clients across Indonesia.",
    },
    webDev: { id: "Web Development", en: "Web Development" },
    mobileDev: { id: "Mobile Development", en: "Mobile Development" },
    enterpriseSol: { id: "Enterprise Solutions", en: "Enterprise Solutions" },
    digitalConsult: { id: "Konsultasi Digital", en: "Digital Consulting" },
  },
} as const;

type TranslationKey = typeof translations;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKey;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("core-lang") as Language) || "id";
    }
    return "id";
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("core-lang", newLang);
    document.documentElement.lang = newLang;
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
