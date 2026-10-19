# CORE Solution Digital — Blog & SEO API (Cloudflare Worker)

Backend mandiri di **Cloudflare Workers** yang mengekspos REST API blog + SEO untuk
[situs CORE Solution Digital](https://www.coresolution.digital). Konten menggabungkan
artikel statis bawaan (`client/src/lib/blog-content.ts`) dan artikel dinamis + gambar
yang disimpan di **Cloudflare R2**.

## Ringkasan Endpoint

| Method | Path | Auth | Deskripsi |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Publik | Status service, ketersediaan binding R2 & auth |
| `GET` | `/api/blog` | Publik | Daftar artikel gabungan (statis + dinamis R2) — `?lang=id\|en` |
| `GET` | `/api/blog/:slug` | Publik | Detail artikel lengkap (statis/dinamis) |
| `POST` | `/api/blog` | **Bearer** | Buat artikel dinamis baru (JSON) |
| `PUT` | `/api/blog/:slug` | **Bearer** | Perbarui artikel dinamis (JSON) |
| `DELETE` | `/api/blog/:slug` | **Bearer** | Hapus artikel dinamis dari R2 |
| `POST` | `/api/blog/:slug/image` | **Bearer** | Upload gambar artikel (maks 5MB, binary/multipart) |
| `POST` | `/api/uploads` | **Bearer** | Upload aset umum ke R2 |
| `GET` | `/uploads/:key` | Publik | Sajikan file/gambar dari R2 (jika tanpa custom domain) |
| `GET` | `/api/seo/:slug` | Publik | Metadata SEO untuk artikel |
| `GET` | `/api/seo?path=/...` | Publik | Metadata SEO halaman (termasuk artikel dinamis) |
| `GET` | `/sitemap.xml` | Publik | Sitemap dinamis (termasuk artikel dinamis) |
| `GET` | `/robots.txt` | Publik | robots.txt SEO-friendly |

---

## Arsitektur Penyimpanan: Cloudflare R2

Penyimpanan metadata artikel dinamis menggunakan **R2 JSON** (`articles/<slug>.json`) dan folder aset `images/<slug>/...` pada satu bucket R2 yang sama (`BLOG_BUCKET`).

**Alasan pemilihan R2 dibanding KV / D1:**
1. **Paling hemat resource & tanpa konfigurasi ganda**: Kebutuhan upload file gambar mewajibkan keberadaan bucket R2. Memanfaatkan R2 untuk menyimpan metadata JSON artikel berarti hanya memerlukan 1 resource Cloudflare tanpa perlu membuat database D1 atau namespace KV tambahan.
2. **Tidak ada batas ukuran 25MB database atau batas per-key KV 25MB**: R2 mendukung objek hingga 5 GB (gambar blog 5 MB dan JSON dokumen panjang tersimpan aman).
3. **Biaya & kuota gratis Cloudflare R2**: 10 GB penyimpanan gratis per bulan, 10 juta permintaan baca Class B gratis, dan 1 juta Class A per bulan tanpa biaya egress bandwidth.
4. **Statis lama tetap utuh**: Artikel hardcoded lama di `blog-content.ts` tetap menjadi baseline andal tanpa dependensi storage, sedangkan artikel R2 otomatis ditimpa/ditambahkan di atasnya.

---

## Setup Cloudflare R2 & Secrets

### 1. Buat Bucket R2 di Cloudflare
Jalankan melalui terminal wrangler atau dashboard Cloudflare:

```bash
npx wrangler r2 bucket create core-solution-blog
```

### 2. Atur Secret `BLOG_API_TOKEN`
Worker membutuhkan token otentikasi Bearer untuk semua operasi tulis. Simpan rahasia di Cloudflare:

```bash
npx wrangler secret put BLOG_API_TOKEN
# Masukkan string acak yang kuat (mis. openssl rand -hex 24)
```

### 3. (Opsional) Public Domain R2
Secara default, gambar dapat diakses langsung melalui endpoint Worker `/uploads/:key`.
Bila bucket R2 dihubungkan ke custom domain (mis. `assets.coresolution.digital`), atur variabel `R2_PUBLIC_URL` di `wrangler.toml` atau via environment:

```toml
[vars]
R2_PUBLIC_URL = "https://assets.coresolution.digital"
```

---

## Otentikasi

Semua request `POST`, `PUT`, dan `DELETE` wajib menyertakan header:
```http
Authorization: Bearer <BLOG_API_TOKEN>
```
Bila token tidak ada atau tidak cocok, API mengembalikan:
```json
{
  "error": "unauthorized",
  "message": "Invalid API token"
}
```

---

## Contoh Pemanggilan API (cURL)

### 1. Upload Gambar Artikel
Maksimal **5 MB**. MIME type yang diizinkan: `image/jpeg`, `image/png`, `image/webp`.

Menggunakan multipart/form-data:
```bash
curl -X POST "https://coresolution.digital/api/blog/implementasi-ai-crm/image" \
  -H "Authorization: Bearer <BLOG_API_TOKEN>" \
  -F "file=@/path/to/diagram.webp;type=image/webp"
```

Atau direct raw binary:
```bash
curl -X POST "https://coresolution.digital/api/blog/implementasi-ai-crm/image" \
  -H "Authorization: Bearer <BLOG_API_TOKEN>" \
  -H "Content-Type: image/png" \
  --data-binary "@/path/to/screenshot.png"
```

Respons (`201 Created`):
```json
{
  "status": "success",
  "key": "images/implementasi-ai-crm/1729350000000-a1b2c3.png",
  "url": "https://coresolution.digital/uploads/images/implementasi-ai-crm/1729350000000-a1b2c3.png",
  "contentType": "image/png",
  "bytes": 245890
}
```

---

### 2. Membuat Artikel Baru (`POST /api/blog`)
Semua teks bilingual `{ "id": "...", "en": "..." }`.

```bash
curl -X POST "https://coresolution.digital/api/blog" \
  -H "Authorization: Bearer <BLOG_API_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "integrasi-ai-customer-service",
    "category": "AI Systems",
    "readTime": 5,
    "date": "2026-10-20",
    "title": {
      "id": "Panduan Integrasi AI untuk Customer Support Modern",
      "en": "Guide to AI Integration for Modern Customer Support"
    },
    "excerpt": {
      "id": "Menghubungkan tiket pelanggan dengan agent AI tanpa kehilangan kendali tim.",
      "en": "Connecting customer tickets with AI agents without losing team control."
    },
    "service": "ai-agent-systems",
    "diagram": ["Webhook Tiket", "Analisis Konteks", "Rekomendasi Draft"],
    "imageUrl": "https://coresolution.digital/uploads/images/integrasi-ai-customer-service/hero.webp",
    "imageAlt": {
      "id": "Diagram alur integrasi AI customer service",
      "en": "Flow diagram of AI customer service integration"
    },
    "sections": [
      {
        "heading": {
          "id": "Mulai dari Masalah Validasi",
          "en": "Start with Validation Problems"
        },
        "paragraphs": [
          {
            "id": "Banyak tim kewalahan menyortir tiket dasar yang repetitif.",
            "en": "Many teams are overwhelmed sorting repetitive baseline tickets."
          }
        ],
        "points": [
          {
            "id": "Definisikan eskalasi manusia.",
            "en": "Define human escalation."
          }
        ]
      }
    ],
    "takeaway": {
      "id": "Gunakan AI untuk memproses konteks, biarkan tim menyetujui respons bernilai tinggi.",
      "en": "Use AI to process context, let humans approve high-stakes responses."
    }
  }'
```

---

### 3. Memperbarui Artikel (`PUT /api/blog/:slug`)
```bash
curl -X PUT "https://coresolution.digital/api/blog/integrasi-ai-customer-service" \
  -H "Authorization: Bearer <BLOG_API_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "integrasi-ai-customer-service",
    "category": "AI Systems",
    "readTime": 6,
    "date": "2026-10-20",
    "title": {
      "id": "Panduan Integrasi AI untuk Customer Support Modern (Revisi)",
      "en": "Guide to AI Integration for Modern Customer Support (Updated)"
    },
    "excerpt": {
      "id": "Menghubungkan tiket pelanggan dengan agent AI tanpa kehilangan kendali tim.",
      "en": "Connecting customer tickets with AI agents without losing team control."
    },
    "service": "ai-agent-systems",
    "diagram": ["Webhook Tiket", "Analisis Konteks", "Rekomendasi Draft"],
    "sections": [
      {
        "heading": { "id": "Langkah Awal", "en": "First Steps" },
        "paragraphs": [
          { "id": "Uji pada jalur tiket prioritas rendah terlebih dahulu.", "en": "Test on low-priority tickets first." }
        ]
      }
    ],
    "takeaway": {
      "id": "Mulai kecil dan ukur akurasi.",
      "en": "Start small and evaluate accuracy."
    }
  }'
```

---

### 4. Menghapus Artikel Dinamis (`DELETE /api/blog/:slug`)
```bash
curl -X DELETE "https://coresolution.digital/api/blog/integrasi-ai-customer-service" \
  -H "Authorization: Bearer <BLOG_API_TOKEN>"
```

---

## Menjalankan & Menguji Lokal

1. Salin `.dev.vars.example` menjadi `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
2. Pastikan `BLOG_API_TOKEN` terisi di `.dev.vars`.
3. Jalankan typecheck & dev server:
   ```bash
   npm run typecheck
   npm run dev
   ```
   Wrangler akan otomatis menjalankan emulasi R2 lokal.
