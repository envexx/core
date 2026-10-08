import { useState, type KeyboardEvent } from "react";
import { MessageSquare, Search, Send, Users, ClipboardCheck, CalendarCheck, FileText, ScanLine, ShieldCheck, Workflow } from "lucide-react";
import RoutingWorkflow from "./RoutingWorkflow";
import { useI18n } from "@/lib/i18n";

type Copy = { id: string; en: string };
const copy = (id: string, en: string): Copy => ({ id, en });
const flows = [
  {
    id: "support", label: copy("Layanan pelanggan", "Customer support"),
    example: copy("Pelanggan bertanya lewat WhatsApp atau email.", "A customer asks a question on WhatsApp or email."),
    steps: [
      { icon: MessageSquare, title: copy("Pesan diterima", "Receive the message"), description: copy("Pertanyaan dari pelanggan masuk ke satu tempat.", "Customer questions arrive in one place.") },
      { icon: Search, title: copy("Cari jawaban yang tepat", "Find the right answer"), description: copy("AI membaca pertanyaan dan mencari informasi dari panduan bisnis Anda.", "AI reads the question and checks your business guidelines.") },
      { icon: Send, title: copy("Jawab atau teruskan", "Reply or hand over"), description: copy("Pertanyaan rutin dijawab. Masalah khusus diteruskan ke tim Anda.", "Routine questions get a reply. Special cases go to your team.") },
    ],
    results: [copy("Pelanggan mendapat jawaban sesuai panduan.", "Customers get an answer based on your guidelines."), copy("Tim menerima kasus penting beserta riwayatnya.", "Your team receives important cases with their history.")],
  },
  {
    id: "sales", label: copy("Sales & calon pelanggan", "Sales & leads"),
    example: copy("Calon pelanggan mengisi formulir di website Anda.", "A potential customer fills out your website form."),
    steps: [
      { icon: Users, title: copy("Kontak baru masuk", "A new contact arrives"), description: copy("Nama, perusahaan, dan kebutuhan calon pelanggan dicatat.", "Their name, company, and needs are captured.") },
      { icon: ClipboardCheck, title: copy("Tentukan prioritas", "Set the priority"), description: copy("AI menilai kebutuhan dan kesiapan mereka berdasarkan kriteria Anda.", "AI checks their needs and readiness against your criteria.") },
      { icon: CalendarCheck, title: copy("Siapkan tindak lanjut", "Arrange the next step"), description: copy("Yang siap dihubungi masuk daftar sales. Yang belum siap menerima informasi relevan.", "Ready prospects go to sales. Others receive useful information.") },
    ],
    results: [copy("Kontak tersimpan dan tugas follow-up dibuat untuk sales.", "Contacts are saved and follow-up tasks created for sales."), copy("Calon pelanggan tahap awal tetap mendapat informasi.", "Early-stage prospects stay informed.")],
  },
  {
    id: "operations", label: copy("Operasional", "Operations"),
    example: copy("Invoice dari pemasok masuk melalui email atau folder.", "A supplier invoice arrives by email or in a folder."),
    steps: [
      { icon: FileText, title: copy("Invoice diterima", "Receive the invoice"), description: copy("Dokumen dikumpulkan dari email atau folder kerja.", "Documents are collected from email or work folders.") },
      { icon: ScanLine, title: copy("Baca & periksa data", "Read and check the data"), description: copy("AI membaca isi invoice, lalu sistem mencocokkannya dengan pesanan pembelian.", "AI reads the invoice, then the system checks it against the purchase order.") },
      { icon: ShieldCheck, title: copy("Minta persetujuan tim", "Request team approval"), description: copy("Data yang sesuai disiapkan untuk persetujuan. Selisih ditandai untuk diperiksa.", "Matching data is prepared for approval. Differences are flagged for review.") },
    ],
    results: [copy("Draft invoice siap diperiksa, tanpa input ulang satu per satu.", "An invoice draft is ready for review, without manual re-entry."), copy("Tim finance tetap menyetujui sebelum diproses lebih lanjut.", "Finance approves before anything moves forward.")],
  },
];

export default function AutomationShowcase() {
  const { lang } = useI18n();
  const [selected, setSelected] = useState(0);
  const flow = flows[selected];
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % flows.length : event.key === "ArrowLeft" ? (index + flows.length - 1) % flows.length : event.key === "Home" ? 0 : event.key === "End" ? flows.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); setSelected(next); document.getElementById(`tab-${flows[next].id}`)?.focus();
  }
  return <section id="solutions" className="agency-container showcase-section">
    <div className="automation-showcase simple-automation-showcase">
      <div className="showcase-heading"><span className="section-kicker"><Workflow size={14} />AUTOMATION, IN ACTION</span><h2>{lang === "id" ? "Begini pekerjaan jadi lebih ringan." : "Here’s how work gets easier."}</h2><p>{lang === "id" ? "AI memahami informasi. Automasi menjalankan langkah berikutnya. Tim Anda tetap memegang kendali." : "AI understands the information. Automation handles the next steps. Your team stays in control."}</p></div>
      <div className="scenario-tabs" role="tablist" aria-label={lang === "id" ? "Contoh alur bisnis" : "Business workflow examples"}>{flows.map((item, index) => <button key={item.id} id={`tab-${item.id}`} role="tab" tabIndex={selected === index ? 0 : -1} aria-selected={selected === index} aria-controls="automation-panel" onClick={() => setSelected(index)} onKeyDown={event => navigateTabs(event, index)} className={selected === index ? "selected" : ""}>{item.label[lang]}</button>)}</div>
      <div className="simple-flow-panel" id="automation-panel" role="tabpanel" aria-labelledby={`tab-${flow.id}`}>
        <p className="simple-flow-example"><span>{lang === "id" ? "CONTOH" : "EXAMPLE"}</span>{flow.example[lang]}</p>
        <RoutingWorkflow key={`${flow.id}-${lang}`} steps={flow.steps.map(step => ({ icon: step.icon, title: step.title[lang], description: step.description[lang] }))} results={flow.results.map(result => result[lang])} resultLabel={lang === "id" ? "HASILNYA" : "THE RESULT"} />
      </div>
      <p className="simple-flow-caption">{lang === "id" ? "Contoh alur. Kami menyesuaikan setiap langkah dengan proses dan aplikasi bisnis Anda." : "Example workflows. We tailor each step to your business processes and apps."}</p>
    </div>
    <div className="integration-strip"><span>{lang === "id" ? "Model AI, aplikasi, dan sistem bisnis — saling terhubung" : "AI models, apps, and business systems — connected"}</span><div>{[
      { name: "OpenAI", file: "openai-display.svg", url: "https://openai.com/", className: "logo-openai" },
      { name: "Anthropic", file: "anthropic.svg", url: "https://www.anthropic.com/", className: "logo-anthropic" },
      { name: "n8n", file: "n8n.svg", url: "https://n8n.io/", className: "logo-n8n" },
      { name: "Make", file: "make-icon.svg", url: "https://www.make.com/", className: "logo-make" },
      { name: "WhatsApp", file: "whatsapp-wordmark.svg", url: "https://www.whatsapp.com/", className: "logo-whatsapp" },
      { name: "Google Workspace", file: "google-workspace.svg", url: "https://workspace.google.com/", className: "logo-google" },
    ].map(brand => <a key={brand.name} href={brand.url} target="_blank" rel="noopener noreferrer" className={brand.className} aria-label={brand.name}><img src={`/logos/${brand.file}`} alt={brand.name} loading="lazy" />{brand.name === "Make" && <span>Make</span>}</a>)}</div></div>
  </section>;
}

