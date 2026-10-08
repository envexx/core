import { ArrowUpRight, Search, Workflow, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AboutSection() {
  const { lang } = useI18n();
  const steps = [
    { icon: Search, title: lang === "id" ? "Pahami bisnis Anda" : "Understand your business", description: lang === "id" ? "Kita petakan proses, hambatan, dan peluang. Tentukan tujuan yang jelas sebelum membangun." : "We map your processes, bottlenecks, and opportunities. Define clear goals before building." },
    { icon: Workflow, title: lang === "id" ? "Rancang & bangun" : "Design & build", description: lang === "id" ? "Kami membangun agent dan alur automasi, menghubungkannya ke tools Anda, lalu menguji bersama tim." : "We build agents and automations, connect them to your tools, and test together with your team." },
    { icon: Rocket, title: lang === "id" ? "Luncurkan & optimalkan" : "Launch & improve", description: lang === "id" ? "Mulai gunakan dalam pekerjaan nyata. Pantau hasil, beri feedback, dan terus tingkatkan alurnya." : "Put it to work. Monitor outcomes, share feedback, and keep improving the workflow." },
  ];
  return <section id="about" className="agency-container agency-section process-section">
    <div className="process-intro"><div><span className="section-kicker">FROM IDEA TO IMPACT</span><h2>{lang === "id" ? <>Teknologi baru.<br />Proses yang sederhana.</> : <>New technology.<br />A simple process.</>}</h2></div><div><p>{lang === "id" ? "CORE Solution Digital adalah partner Anda dalam membangun AI agent dan AI automation. Berbasis di Batam, kami membantu bisnis mengubah pekerjaan berulang menjadi sistem yang lebih cerdas." : "CORE Solution Digital is your partner in AI agents and AI automation. Based in Batam, we help businesses turn repetitive work into smarter systems."}</p><a className="text-link" href="#contact">{lang === "id" ? "Mulai percakapan" : "Start a conversation"}<ArrowUpRight size={16} /></a></div></div>
    <div className="process-grid">{steps.map((step, index) => <article key={index}><div className="process-step-top"><span>0{index + 1}</span><step.icon size={23} /></div><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
  </section>;
}
