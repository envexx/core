import { TextAnimate } from "@/components/ui/text-animate";
import { ArrowUpRight, Workflow, Bot, BookOpen, ScanLine, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { services } from "@/lib/service-content";
import ContentLayout, { Breadcrumbs, ProjectCTA } from "@/components/ContentLayout";
import { HaloCard } from "@/components/ui/halo-card";
import { AgencyAction } from "@/components/ui/agency-action";
import SystemIllustration from "@/components/SystemIllustration";
import NotFound from "./not-found";
const icons: Record<string, typeof Bot> = { "ai-agent-systems": Bot, "workflow-automation": Workflow, "knowledge-systems": BookOpen, "ai-strategy": ScanLine };
const directoryServices = [services[1], services[0], services[2], services[3]];

export default function Services() {
  const { lang } = useI18n();
  const intro = lang === "id" ? "Sistem AI, automasi proses, dan integrasi yang dirancang untuk pekerjaan nyata tim Anda." : "AI systems, process automation, and integrations designed for your team's real work.";
  return <ContentLayout title={lang === "id" ? "Layanan" : "Services"} description={intro} path="/services">
    <section className="agency-container page-intro"><Breadcrumbs items={[{ label: lang === "id" ? "Layanan" : "Services" }]} /><span className="section-kicker">OUR SERVICES</span><h1><TextAnimate text={lang === "id" ? "Dari proses manual.\nKe sistem yang terhubung." : "From manual processes.\nTo connected systems."} /></h1><p>{intro}</p></section>
    <section className="agency-container service-directory" aria-label={lang === "id" ? "Daftar layanan" : "Service directory"}>{directoryServices.map(service => { const Icon = icons[service.slug]; return <HaloCard key={service.slug} padding="none" translucent={false} className="cult-directory-card" aria-label={service.name}><a href={`/services/${service.slug}`} className="directory-card"><div className="directory-top"><span className="service-icon"><Icon size={23} /></span><span>{service.number} / SERVICE</span></div><h2>{service.name}</h2><p>{service.intro[lang]}</p><SystemIllustration compact variant={service.slug === "knowledge-systems" || service.slug === "ai-strategy" ? "gateway" : "workloads"} /><div className="directory-tags">{service.outcomes.map(item => <span key={item.en}>{item[lang]}</span>)}</div><span className="directory-link">{lang === "id" ? "Jelajahi layanan" : "Explore service"}<ArrowUpRight size={18} /></span></a></HaloCard>; })}</section>
    <section className="agency-container service-principles"><span className="section-kicker">HOW WE WORK</span><h2>{lang === "id" ? "Tujuan jelas. Implementasi terarah." : "Clear goals. Focused implementation."}</h2><div>{[lang === "id" ? "Mulai dari masalah dan proses bisnis" : "Start with the business problem and process", lang === "id" ? "Hubungkan tools dan data yang dibutuhkan" : "Connect the required tools and data", lang === "id" ? "Uji, tinjau, lalu luncurkan bersama tim" : "Test, review, and launch with your team"].map((text, index) => <p key={text}><span>0{index + 1}</span>{text}</p>)}</div><a href="/blog" className="text-link service-detail-link">{lang === "id" ? "Lihat studi alur automasi" : "Explore automation workflow studies"}<ArrowUpRight size={17} /></a></section>
    <ProjectCTA />
  </ContentLayout>;
}

export function ServiceDetail({ slug }: { slug: string }) {
  const { lang } = useI18n();
  const service = services.find(item => item.slug === slug);
  if (!service) return <NotFound />;
  return <ContentLayout title={service.name} description={service.intro[lang]} path={`/services/${service.slug}`}>
    <section className="agency-container page-intro service-detail-intro"><Breadcrumbs items={[{ label: lang === "id" ? "Layanan" : "Services", href: "/services" }, { label: service.name }]} /><div className="service-detail-hero"><div><span className="section-kicker">{service.number} / {service.name.toUpperCase()}</span><h1><TextAnimate text={service.title[lang]} /></h1><p>{service.intro[lang]}</p><AgencyAction href="/#contact">{lang === "id" ? "Diskusikan layanan ini" : "Discuss this service"}<ArrowUpRight size={16} /></AgencyAction></div><div className="service-blueprint"><div><Workflow size={17} /><span>SYSTEM BLUEPRINT</span><span>CONCEPT</span></div><SystemIllustration variant={slug === "knowledge-systems" || slug === "ai-strategy" ? "gateway" : "workloads"} compact /><ol>{service.steps.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong>{index === 3 && <Check size={16} />}</li>)}</ol><code>{service.tag}</code></div></div></section>
    <section className="agency-container detail-section"><span className="section-kicker">WHAT WE DELIVER</span><h2>{lang === "id" ? "Dari rancangan hingga siap digunakan." : "From design to ready for work."}</h2><div className="deliverable-grid">{service.deliverables.map((item, index) => <article key={item.title.en}><span>0{index + 1}</span><h3>{item.title[lang]}</h3><p>{item.text[lang]}</p></article>)}</div></section>
    <section className="agency-container detail-section use-case-section"><div><span className="section-kicker">PRACTICAL APPLICATIONS</span><h2>{lang === "id" ? "Contoh penggunaan." : "Example applications."}</h2><p>{lang === "id" ? "Rancangan akhir mengikuti data, aplikasi, dan kebijakan bisnis Anda." : "The final design follows your data, applications, and business policies."}</p></div><ul>{service.cases.map(item => <li key={item.en}><Check size={17} />{item[lang]}</li>)}</ul></section>
    <section className="agency-container detail-section service-faq"><div><span className="section-kicker">COMMON QUESTIONS</span><h2>{lang === "id" ? "Sebelum kita mulai." : "Before we begin."}</h2></div><div>{service.faqs.map(item => <details key={item.q.en}><summary>{item.q[lang]}<span>+</span></summary><p>{item.a[lang]}</p></details>)}</div></section>
    <section className="agency-container detail-section related-services"><span className="section-kicker">CONNECTED CAPABILITIES</span><h2>{lang === "id" ? "Layanan yang melengkapi." : "Complementary services."}</h2><div>{services.filter(item => item.slug !== slug).map(item => <a href={`/services/${item.slug}`} key={item.slug}><span>{item.name}</span><ArrowUpRight size={18} /></a>)}</div></section><ProjectCTA />
  </ContentLayout>;
}



