export type LocalCopy = { id: string; en: string };
export const copy = (id: string, en: string): LocalCopy => ({ id, en });
export const services = [
  {
    slug: "ai-agent-systems", name: "AI Agent Systems", number: "01", tag: "CONTEXT → REASON → EXECUTE",
    title: copy("Sistem AI yang memahami konteks dan menjalankan pekerjaan.", "AI systems that understand context and execute work."),
    intro: copy("Hubungkan kemampuan AI dengan data dan tools bisnis Anda. Bangun agent yang dapat membaca informasi, merencanakan langkah, dan menjalankan tugas dengan kontrol yang jelas.", "Connect AI capabilities to your business data and tools. Build agents that can interpret information, plan steps, and execute tasks with clear controls."),
    outcomes: [copy("Proses lintas aplikasi", "Work across applications"), copy("Keputusan berbasis konteks", "Context-aware decisions"), copy("Kontrol dan jejak eksekusi", "Controls and execution traces")],
    steps: ["Business context", "Agent reasoning", "Tool execution", "Review & audit"],
    deliverables: [
      { title: copy("Arsitektur agent", "Agent architecture"), text: copy("Definisi tugas, sumber konteks, tools, serta batas kewenangan agent untuk use case yang disepakati.", "Task definitions, context sources, tools, and permission boundaries for the agreed use case.") },
      { title: copy("Integrasi tools", "Tool integrations"), text: copy("Koneksi ke aplikasi dan API yang diperlukan, dengan validasi input serta penanganan kegagalan.", "Connections to required applications and APIs, with input validation and failure handling.") },
      { title: copy("Evaluasi dan monitoring", "Evaluation and monitoring"), text: copy("Skenario pengujian, log eksekusi, dan titik review untuk memeriksa kualitas hasil sebelum peluncuran.", "Test scenarios, execution logs, and review checkpoints to assess output quality before launch.") },
    ],
    cases: [copy("Riset dan kualifikasi lead dengan konteks CRM", "Lead research and qualification using CRM context"), copy("Pemrosesan dokumen menjadi data terstruktur", "Document processing into structured records"), copy("Koordinasi pekerjaan operasional lintas tools", "Operational task coordination across tools")],
    faqs: [
      { q: copy("Apakah agent harus memiliki antarmuka chat?", "Does an agent need a chat interface?"), a: copy("Tidak. Agent dapat berjalan dari event, jadwal, atau tugas di aplikasi. Antarmuka chat hanya salah satu pilihan untuk berinteraksi atau meninjau hasil.", "No. An agent can run from an event, a schedule, or an application task. Chat is one option for interacting with it or reviewing results.") },
      { q: copy("Bagaimana kontrol terhadap tindakan agent?", "How are agent actions controlled?"), a: copy("Kita menentukan tools yang boleh digunakan, data yang boleh diakses, dan tindakan yang memerlukan persetujuan manusia sejak tahap desain.", "We define allowed tools, accessible data, and actions requiring human approval during design.") },
    ],
  },
  {
    slug: "workflow-automation", name: "Workflow Automation", number: "02", tag: "EVENT → VALIDATE → ROUTE → SYNC",
    title: copy("Hubungkan aplikasi. Buat proses bisnis bergerak otomatis.", "Connect applications. Put business processes in motion."),
    intro: copy("Ubah pekerjaan manual menjadi alur yang terhubung. Dari event pertama hingga pembaruan sistem, setiap langkah memiliki aturan, penanganan error, dan pemilik yang jelas.", "Turn manual work into connected workflows. From the first event to a system update, each step has clear rules, error handling, and ownership."),
    outcomes: [copy("Alur yang konsisten", "Consistent workflows"), copy("Data yang terhubung", "Connected data"), copy("Penanganan exception", "Exception handling")],
    steps: ["Event trigger", "Validate & route", "Approval checkpoint", "Sync business apps"],
    deliverables: [
      { title: copy("Pemetaan proses", "Process mapping"), text: copy("Peta trigger, langkah kerja, percabangan, data, dan penanggung jawab sebelum alur dibangun.", "A map of triggers, steps, branches, data, and owners before implementation.") },
      { title: copy("Workflow dan integrasi", "Workflows and integrations"), text: copy("Alur di n8n, Make, atau implementasi khusus sesuai kebutuhan aplikasi dan kompleksitas proses.", "Workflows in n8n, Make, or a custom implementation suited to your applications and process complexity.") },
      { title: copy("Runbook operasional", "Operations runbook"), text: copy("Panduan monitoring, retry, serta penanganan exception agar tim memahami cara menjalankan dan merawat sistem.", "Monitoring, retry, and exception-handling guidance so your team can operate and maintain the system.") },
    ],
    cases: [copy("Lead formulir → CRM → tugas follow-up", "Form lead → CRM → follow-up task"), copy("Invoice → validasi PO → antrean approval", "Invoice → PO validation → approval queue"), copy("Order masuk → sinkronisasi data → notifikasi tim", "New order → data sync → team notification")],
    faqs: [
      { q: copy("Apakah semua langkah perlu menggunakan AI?", "Does every step need AI?"), a: copy("Tidak. Aturan deterministik cocok untuk validasi dan routing yang jelas. AI ditambahkan pada langkah yang perlu memahami dokumen, teks, atau konteks yang bervariasi.", "No. Deterministic rules suit clear validation and routing. AI is added where a step needs to interpret variable documents, text, or context.") },
      { q: copy("Apakah tools yang sudah digunakan bisa dihubungkan?", "Can we connect our existing tools?"), a: copy("Kita memeriksa API, akses, format data, dan batas integrasi terlebih dahulu. Pilihan koneksi serta cakupan implementasi ditetapkan setelah pemeriksaan tersebut.", "We first review APIs, access, data formats, and integration limits. Connection options and implementation scope are agreed after that review.") },
    ],
  },
  {
    slug: "knowledge-systems", name: "Knowledge Systems", number: "03", tag: "DOCUMENTS → INDEX → RETRIEVE → CONTEXT",
    title: copy("Pengetahuan bisnis yang siap digunakan sistem AI.", "Business knowledge your AI systems can use."),
    intro: copy("Satukan dokumen, SOP, dan informasi internal menjadi sumber konteks yang terstruktur. Sistem dapat mengambil informasi yang relevan dengan tetap memperhatikan akses dan asal sumber.", "Bring documents, SOPs, and internal information into a structured context source. Systems can retrieve relevant information while respecting access and source attribution."),
    outcomes: [copy("Sumber yang terorganisasi", "Organized sources"), copy("Konteks yang relevan", "Relevant context"), copy("Akses sesuai peran", "Role-based access")],
    steps: ["Collect sources", "Clean & index", "Retrieve context", "Source references"],
    deliverables: [
      { title: copy("Audit sumber informasi", "Information source audit"), text: copy("Inventaris dokumen, format, pemilik, kebaruan informasi, serta aturan akses yang perlu diperhatikan.", "An inventory of documents, formats, owners, freshness, and access requirements.") },
      { title: copy("Pipeline pengetahuan", "Knowledge pipeline"), text: copy("Pemrosesan dokumen, indexing, dan mekanisme pembaruan untuk sumber yang disepakati.", "Document processing, indexing, and update mechanisms for agreed sources.") },
      { title: copy("Retrieval dan evaluasi", "Retrieval and evaluation"), text: copy("Pencarian konteks, referensi sumber, dan pengujian dengan pertanyaan atau tugas yang relevan bagi tim.", "Context retrieval, source references, and evaluation using questions or tasks relevant to your team.") },
    ],
    cases: [copy("SOP sebagai konteks untuk agent operasional", "SOP context for operational agents"), copy("Pencarian kebijakan dan dokumen internal", "Internal policy and document search"), copy("Katalog produk untuk proses sales dan support", "Product catalog context for sales and support")],
    faqs: [
      { q: copy("Bagaimana jika dokumen berubah?", "What happens when documents change?"), a: copy("Mekanisme pembaruan ditentukan berdasarkan sumber: sinkronisasi terjadwal, event perubahan, atau upload terkontrol. Pemilik konten tetap perlu menjaga kualitas informasi.", "Updates can use scheduled sync, change events, or controlled uploads depending on the source. Content owners still need to maintain information quality.") },
      { q: copy("Apakah semua dokumen dapat diakses semua pengguna?", "Can every user access every document?"), a: copy("Tidak harus. Kita merancang aturan akses sesuai peran dan sensitivitas sumber, lalu menguji retrieval dengan izin tersebut.", "Not necessarily. We design access rules around roles and source sensitivity, then test retrieval against those permissions.") },
    ],
  },
  {
    slug: "ai-strategy", name: "AI Strategy & Consulting", number: "04", tag: "DISCOVER → PRIORITIZE → PILOT → ROADMAP",
    title: copy("Mulai dengan proses yang layak diperbaiki.", "Start with a process worth improving."),
    intro: copy("Tentukan peluang AI dan automasi berdasarkan pekerjaan nyata tim. Kita menilai kesiapan data, batas integrasi, dan manfaat yang ingin dicapai sebelum memilih teknologi.", "Identify AI and automation opportunities from your team's actual work. Assess data readiness, integration constraints, and intended benefits before selecting technology."),
    outcomes: [copy("Prioritas yang jelas", "Clear priorities"), copy("Cakupan pilot", "Defined pilot scope"), copy("Roadmap implementasi", "Implementation roadmap")],
    steps: ["Process discovery", "Opportunity review", "Pilot design", "Implementation plan"],
    deliverables: [
      { title: copy("Discovery dan audit", "Discovery and audit"), text: copy("Diskusi dengan pemilik proses untuk memahami pekerjaan, hambatan, serta kondisi data dan sistem saat ini.", "Sessions with process owners to understand work, bottlenecks, and current data and systems.") },
      { title: copy("Prioritas use case", "Use-case prioritization"), text: copy("Penilaian kandidat berdasarkan dampak, kelayakan, kebutuhan review, dan usaha implementasi.", "Assess candidate use cases by impact, feasibility, review needs, and implementation effort.") },
      { title: copy("Rencana pilot dan roadmap", "Pilot plan and roadmap"), text: copy("Cakupan tahap awal, indikator keberhasilan, dependensi, serta rencana pengembangan setelah evaluasi pilot.", "Initial scope, success measures, dependencies, and a development plan following pilot evaluation.") },
    ],
    cases: [copy("Memilih proses pertama untuk automasi", "Choosing the first process to automate"), copy("Memetakan kesiapan data dan aplikasi", "Assessing data and application readiness"), copy("Menyusun tahap implementasi lintas tim", "Planning implementation across teams")],
    faqs: [
      { q: copy("Apakah perlu sudah memiliki ide solusi?", "Do we need a solution idea already?"), a: copy("Tidak. Mulai dari proses yang sering memakan waktu, banyak perpindahan data, atau sulit dipantau. Discovery membantu memperjelas masalah dan cakupan solusi.", "No. Start with work that takes time, involves repeated data transfers, or is difficult to monitor. Discovery helps clarify the problem and scope.") },
      { q: copy("Apa yang menentukan keberhasilan pilot?", "What defines a successful pilot?"), a: copy("Indikator disepakati sebelum implementasi, misalnya waktu proses, kualitas data, atau jumlah exception. Hasil pilot dibandingkan dengan kondisi awal sebelum diperluas.", "Measures are agreed before implementation, such as processing time, data quality, or exception volume. Pilot outcomes are compared with the baseline before expansion.") },
    ],
  },
];
