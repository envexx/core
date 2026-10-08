type Copy = { id: string; en: string };
export type FlowNode = { id: string; label: string; provider: string; operation: string; input: string; output: string; description: Copy; x: number; y: number; kind: "event" | "ai" | "data" | "decision" | "action" | "review" };
export type FlowEdge = { from: string; to: string; label?: string };
export type FlowExample = { label: Copy; path: string[]; input: Record<string, unknown>; output: Record<string, unknown>; outcome: Copy };
type Scenario = { id: string; label: string; description: Copy; nodes: FlowNode[]; edges: FlowEdge[]; examples: FlowExample[] };
const node = (id: string, label: string, provider: string, operation: string, input: string, output: string, x: number, y: number, kind: FlowNode["kind"], idCopy: string, enCopy: string): FlowNode => ({ id, label, provider, operation, input, output, x, y, kind, description: { id: idCopy, en: enCopy } });

export const scenarios: Scenario[] = [
  {
    id: "support", label: "Customer support",
    description: { id: "Identifikasi masalah, cari konteks, lalu selesaikan tiket atau eskalasi ke tim yang tepat.", en: "Identify the issue, retrieve context, then resolve the ticket or escalate to the right team." },
    nodes: [
      node("inbox", "Incoming ticket", "WhatsApp / Email", "ticket.receive", "customer_message", "ticket", 20, 24, "event", "Pesan dari berbagai kanal masuk ke satu antrean tiket.", "Messages from multiple channels enter one ticket queue."),
      node("context", "Retrieve context", "Knowledge + CRM", "context.retrieve", "ticket", "policy + history", 210, 24, "data", "Ambil SOP dan riwayat pelanggan sebelum menentukan penanganan.", "Retrieve policies and customer history before choosing a resolution."),
      node("triage", "Triage & route", "AI + routing rules", "ticket.classify", "ticket + context", "intent + confidence", 400, 24, "decision", "Klasifikasi intent dan urgensi. Confidence rendah atau kasus sensitif masuk ke tim manusia.", "Classify intent and urgency. Low confidence or sensitive cases go to a human team."),
      node("resolve", "Resolve ticket", "Helpdesk + Reply", "ticket.resolve", "approved_answer", "resolved_ticket", 590, 24, "action", "Jawaban berbasis SOP disiapkan dan status tiket diperbarui.", "Prepare a policy-backed reply and update the ticket status."),
      node("handoff", "Escalate to team", "Support queue", "ticket.escalate", "urgent_ticket", "assigned_ticket", 400, 220, "review", "Buat tugas untuk tim support beserta ringkasan dan riwayat masalah.", "Assign a support task with an issue summary and customer history."),
      node("notify", "Notify owner", "Internal notification", "team.notify", "assigned_ticket", "owner_notified", 590, 220, "action", "Beritahu penanggung jawab agar kasus ditindaklanjuti.", "Notify the assigned owner to follow up on the issue."),
    ],
    edges: [{ from: "inbox", to: "context" }, { from: "context", to: "triage" }, { from: "triage", to: "resolve", label: "Routine" }, { from: "triage", to: "handoff", label: "Escalate" }, { from: "handoff", to: "notify" }],
    examples: [
      { label: { id: "Pertanyaan rutin", en: "Routine question" }, path: ["inbox", "context", "triage", "resolve"], input: { channel: "whatsapp", ticket: "SUP-1042", message: "How can I book a consultation?" }, output: { ticket: "SUP-1042", intent: "booking", confidence: 0.96, status: "resolved", actions: ["prepare_policy_reply", "update_helpdesk"] }, outcome: { id: "Jawaban sesuai SOP disiapkan dan tiket ditandai selesai.", en: "A policy-backed reply is prepared and the ticket is marked resolved." } },
      { label: { id: "Kasus perlu eskalasi", en: "Needs escalation" }, path: ["inbox", "context", "triage", "handoff", "notify"], input: { channel: "email", ticket: "SUP-1043", message: "My payment was charged twice. Please investigate." }, output: { ticket: "SUP-1043", intent: "billing_dispute", priority: "high", status: "assigned", owner: "billing_team", actions: ["create_escalation_task", "notify_owner"] }, outcome: { id: "Kasus pembayaran dialihkan ke tim billing dengan konteks lengkap.", en: "The billing issue is assigned to the billing team with full context." } },
    ],
  },
  {
    id: "sales", label: "Sales & leads",
    description: { id: "Perkaya data lead, nilai kecocokannya, dan jalankan jalur sales atau nurture yang sesuai.", en: "Enrich lead data, evaluate fit, and run the appropriate sales or nurture sequence." },
    nodes: [
      node("capture", "Capture lead", "Website form", "lead.capture", "form_submission", "lead_record", 20, 122, "event", "Terima lead baru dan normalisasi informasi dari formulir.", "Receive a new lead and normalize form data."),
      node("enrich", "Enrich profile", "Company + CRM", "lead.enrich", "lead_record", "company_profile", 210, 122, "data", "Lengkapi profil perusahaan dan periksa duplikasi di CRM.", "Enrich the company profile and check CRM duplicates."),
      node("score", "Score & qualify", "AI + fit criteria", "lead.score", "profile + criteria", "score + segment", 400, 122, "decision", "Nilai kebutuhan, kesiapan, dan kecocokan berdasarkan kriteria bisnis.", "Evaluate needs, readiness, and fit against business criteria."),
      node("crm", "Create deal", "CRM pipeline", "deal.upsert", "qualified_lead", "deal + owner", 590, 24, "action", "Buat peluang sales dan tetapkan pemilik deal.", "Create a sales opportunity and assign the deal owner."),
      node("followup", "Schedule follow-up", "Calendar + Email", "followup.schedule", "deal + owner", "followup_task", 780, 24, "action", "Siapkan tindak lanjut personal dan tugas untuk tim sales.", "Prepare personalized follow-up and a sales task."),
      node("nurture", "Enroll in nurture", "Email sequence", "nurture.enroll", "early_stage_lead", "nurture_sequence", 590, 220, "action", "Lead yang belum siap masuk rangkaian edukasi sesuai kebutuhannya.", "Enroll early-stage leads in a relevant educational sequence."),
    ],
    edges: [{ from: "capture", to: "enrich" }, { from: "enrich", to: "score" }, { from: "score", to: "crm", label: "Qualified" }, { from: "crm", to: "followup" }, { from: "score", to: "nurture", label: "Early stage" }],
    examples: [
      { label: { id: "Lead prioritas", en: "Qualified lead" }, path: ["capture", "enrich", "score", "crm", "followup"], input: { company: "Example Logistics", employees: 80, need: "Automate order processing", timeline: "this_month" }, output: { fit_score: 89, segment: "qualified", pipeline: "discovery", assigned_to: "sales_team", actions: ["create_crm_deal", "prepare_followup", "schedule_sales_task"] }, outcome: { id: "Deal dibuat di CRM, pemilik ditetapkan, dan follow-up dijadwalkan.", en: "A CRM deal is created, an owner assigned, and follow-up scheduled." } },
      { label: { id: "Lead tahap awal", en: "Early-stage lead" }, path: ["capture", "enrich", "score", "nurture"], input: { company: "Example Studio", employees: 5, need: "Explore AI opportunities", timeline: "researching" }, output: { fit_score: 42, segment: "early_stage", sequence: "automation_intro", actions: ["enroll_education_sequence"], sales_deal_created: false }, outcome: { id: "Lead masuk nurture yang relevan tanpa membuat deal sales prematur.", en: "The lead enters a relevant nurture sequence without a premature sales deal." } },
    ],
  },
  {
    id: "operations", label: "Operations",
    description: { id: "Ekstrak invoice, cocokkan dengan purchase order, lalu minta persetujuan atau tangani selisih.", en: "Extract invoice data, match the purchase order, then request approval or handle discrepancies." },
    nodes: [
      node("upload", "Receive invoice", "Drive / Email", "invoice.receive", "pdf_attachment", "document", 20, 24, "event", "Dokumen invoice masuk dari folder atau email operasional.", "Receive an invoice from an operations folder or email."),
      node("extract", "Extract fields", "AI document parser", "document.extract", "document", "invoice_fields", 210, 24, "ai", "Ekstrak vendor, nomor invoice, baris item, dan nilai total menjadi data terstruktur.", "Extract vendor, invoice number, line items, and totals into structured data."),
      node("match", "Match purchase order", "ERP + validation", "invoice.match", "fields + purchase_order", "validation_result", 400, 24, "decision", "Cek duplikasi dan cocokkan nilai invoice dengan PO di ERP.", "Check duplicates and match invoice amounts against the ERP purchase order."),
      node("approve", "Request approval", "Finance reviewer", "approval.request", "matched_invoice", "approval_request", 590, 24, "review", "Invoice yang cocok masuk antrean persetujuan finance. Pembayaran tetap menunggu persetujuan.", "Matched invoices enter finance approval. Payment remains pending approval."),
      node("queue", "Stage ERP record", "ERP draft", "record.stage", "approval_request", "pending_approval_record", 590, 220, "data", "Simpan draft dan jejak audit; posting final dilakukan setelah disetujui.", "Stage a draft and audit trail; final posting happens after approval."),
      node("exception", "Flag discrepancy", "Exception queue", "exception.create", "mismatched_invoice", "review_task", 400, 220, "review", "Selisih jumlah ditahan dan dibuatkan tugas pemeriksaan manual.", "Hold discrepancies and create a manual review task."),
      node("alert", "Notify finance", "Finance notification", "finance.notify", "review_task", "finance_notified", 210, 220, "action", "Tim finance menerima rincian selisih beserta referensi dokumen.", "Finance receives discrepancy details and document references."),
    ],
    edges: [{ from: "upload", to: "extract" }, { from: "extract", to: "match" }, { from: "match", to: "approve", label: "Matched" }, { from: "approve", to: "queue", label: "Pending approval" }, { from: "match", to: "exception", label: "Mismatch" }, { from: "exception", to: "alert" }],
    examples: [
      { label: { id: "Invoice sesuai PO", en: "Matched invoice" }, path: ["upload", "extract", "match", "approve", "queue"], input: { file: "invoice-1042.pdf", vendor: "Example Supplier", total: 4500000, purchase_order: "PO-2048", po_total: 4500000 }, output: { invoice: "INV-1042", po_match: true, status: "pending_finance_approval", erp_record: "draft", payment_executed: false, actions: ["create_approval_request", "stage_erp_record"] }, outcome: { id: "Invoice tervalidasi disimpan sebagai draft ERP dan menunggu persetujuan finance.", en: "The validated invoice is staged in the ERP and awaits finance approval." } },
      { label: { id: "Invoice berselisih", en: "Amount mismatch" }, path: ["upload", "extract", "match", "exception", "alert"], input: { file: "invoice-1043.pdf", vendor: "Example Supplier", total: 5200000, purchase_order: "PO-2048", po_total: 4500000 }, output: { invoice: "INV-1043", po_match: false, difference: 700000, status: "on_hold", owner: "finance_team", payment_executed: false, actions: ["create_exception_task", "notify_finance"] }, outcome: { id: "Selisih Rp700.000 ditandai. Invoice ditahan untuk pemeriksaan finance.", en: "A Rp700,000 discrepancy is flagged. The invoice is held for finance review." } },
    ],
  },
];
