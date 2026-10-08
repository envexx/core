import { ArrowUpRight, Bot, Workflow, BookOpen, ScanLine, MessageSquare, Check, Mail, Database, FileText, ShieldCheck } from "lucide-react";
import RoutingWorkflow from "@/components/RoutingWorkflow";
import { useI18n } from "@/lib/i18n";

export default function ServicesSection() {
  const { lang } = useI18n();
  return <section id="services" className="agency-container agency-section">
    <div className="section-heading"><span className="section-kicker">BUILT FOR YOUR BUSINESS</span><h2>{lang === "id" ? <>Lebih sedikit rutinitas.<br />Lebih banyak kemungkinan.</> : <>Less busywork.<br />More possibilities.</>}</h2><p>{lang === "id" ? "Solusi AI yang praktis, terhubung dengan tools Anda, dan dirancang untuk cara tim Anda bekerja." : "Practical AI solutions, connected to your tools and designed for the way your team works."}</p></div>
    <div className="services-bento">
      <article className="service-card service-agent">
        <div className="service-copy"><span className="service-icon"><Bot size={23} /></span><span className="card-number">01 / AI AGENT SYSTEMS</span><h3>{lang === "id" ? "Pahami konteks. Jalankan pekerjaan." : "Understand context. Execute work."}</h3><p>{lang === "id" ? "Agent yang membaca dokumen, menganalisis data, dan menggunakan tools untuk menyelesaikan proses lintas aplikasi. Lengkap dengan aturan, izin, dan titik persetujuan tim." : "Agents that read documents, analyze data, and use tools to complete processes across applications. With business rules, permissions, and team approval checkpoints."}</p><a href="/services/ai-agent-systems" className="text-link">{lang === "id" ? "Jelajahi AI Agent Systems" : "Explore AI Agent Systems"}<ArrowUpRight size={16} /></a></div>
        <div className="agent-capabilities">
          <div className="capabilities-header"><span><Workflow size={14} />Agent execution layer</span><span>EXAMPLE</span></div>
          <div><FileText size={17} /><span><strong>{lang === "id" ? "Baca & strukturkan data" : "Read & structure data"}</strong><small>Documents → Structured records</small></span><Check size={13} /></div>
          <div><Database size={17} /><span><strong>{lang === "id" ? "Gunakan tools bisnis" : "Use business tools"}</strong><small>CRM · ERP · APIs · Database</small></span><Check size={13} /></div>
          <div><ShieldCheck size={17} /><span><strong>{lang === "id" ? "Eksekusi dengan kontrol" : "Execute with control"}</strong><small>Rules · Permissions · Approvals</small></span><Check size={13} /></div>
        </div>
        <details className="agent-interface-example"><summary>{lang === "id" ? "Lihat contoh antarmuka koordinasi tim" : "View a team coordination interface example"}</summary><figure className="agent-illustration">
          <img src="/images/core-agent-workspace.png" width={1536} height={1024} loading="lazy" alt={lang === "id" ? "Ilustrasi workspace CORE AI assistant: percakapan, ringkasan leads, dan proses review tim." : "CORE AI assistant workspace illustration with a conversation, lead summary, and human review."} />
          <figcaption>{lang === "id" ? "Salah satu antarmuka sistem agent: review hasil dan koordinasi tim." : "One interface for an agent system: reviewing results and coordinating the team."}</figcaption>
        </figure></details>
      </article>
      <article className="service-card service-automation">
        <span className="service-icon"><Workflow size={23} /></span><span className="card-number">02 / WORKFLOW AUTOMATION</span><h3>{lang === "id" ? "Dari satu event. Ke proses lengkap." : "From one event. To a complete process."}</h3><p>{lang === "id" ? "Orkestrasi CRM, email, database, dan ERP dalam satu alur. Validasi data, jalankan percabangan, dan pantau setiap eksekusi—dari lead baru hingga pemrosesan invoice." : "Orchestrate CRM, email, databases, and ERP in one workflow. Validate data, run branches, and monitor every execution—from new leads to invoice processing."}</p>
        <RoutingWorkflow compact key={lang} steps={[
          { icon: FileText, title: lang === "id" ? "Data masuk" : "Data arrives", description: lang === "id" ? "Dari formulir, email, atau dokumen." : "From forms, email, or documents." },
          { icon: ShieldCheck, title: lang === "id" ? "AI memeriksa" : "AI checks", description: lang === "id" ? "Informasi dibaca dan divalidasi." : "Information is read and validated." },
          { icon: Workflow, title: lang === "id" ? "Proses berjalan" : "Work moves", description: lang === "id" ? "Aplikasi menjalankan langkah berikutnya." : "Apps handle the next steps." },
        ]} resultLabel={lang === "id" ? "HASILNYA" : "THE RESULT"} results={[lang === "id" ? "Data tersimpan, tugas dibuat, dan tim menerima pembaruan. Langkah penting tetap menunggu persetujuan." : "Data is saved, tasks are created, and your team gets updates. Important steps still require approval."]} />
        <a href="/services/workflow-automation" className="text-link service-detail-link">{lang === "id" ? "Jelajahi AI Automation" : "Explore AI Automation"}<ArrowUpRight size={16} /></a>
      </article>
      <article className="service-card service-small"><span className="service-icon"><BookOpen size={23} /></span><span className="card-number">03 / KNOWLEDGE SYSTEMS</span><h3>{lang === "id" ? "Data Anda. Jawaban yang relevan." : "Your data. Relevant answers."}</h3><p>{lang === "id" ? "Ubah dokumen, SOP, dan informasi internal menjadi knowledge base yang dapat dicari dan digunakan AI agent Anda." : "Turn documents, SOPs, and internal information into a searchable knowledge base for your AI agents."}</p><div className="knowledge-tags"><span>Documents</span><span>Knowledge base</span><span>AI search</span></div><a href="/services/knowledge-systems" className="text-link service-detail-link">{lang === "id" ? "Jelajahi Knowledge Systems" : "Explore Knowledge Systems"}<ArrowUpRight size={16} /></a></article>
      <article className="service-card service-small"><span className="service-icon"><ScanLine size={23} /></span><span className="card-number">04 / AI STRATEGY</span><h3>{lang === "id" ? "Mulai dari peluang yang tepat." : "Start with the right opportunity."}</h3><p>{lang === "id" ? "Temukan proses yang layak diotomasi. Kami bantu audit alur kerja, memilih use case, dan menyusun roadmap implementasi AI." : "Find the processes worth automating. We audit workflows, prioritize use cases, and create an AI implementation roadmap."}</p><a href="/services/ai-strategy" className="text-link">{lang === "id" ? "Jelajahi AI Strategy" : "Explore AI Strategy"}<ArrowUpRight size={16} /></a></article>
    </div>
  </section>;
}


