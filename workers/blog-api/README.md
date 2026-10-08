# CORE Solution Digital — Blog & SEO API (Cloudflare Worker)

Backend mandiri di **Cloudflare Workers** yang mengekspos REST API blog + SEO untuk
[situs CORE Solution Digital](https://www.coresolution.digital). Konten diambil
langsung dari sumber yang sudah dipakai frontend, `client/src/lib/blog-content.ts`
(di-*derive*, bukan diduplikasi).

## Ringkasan

| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/blog` | Daftar artikel (ringkasan) — `?lang=id\|en` |
| `GET` | `/api/blog/:slug` | Detail artikel (seksi, takeaways, service terkait) |
| `GET` | `/api/seo/:slug` | Metadata SEO untuk artikel (setara `?path=/blog/:slug`) |
| `GET` | `/api/seo?path=/...` | Metadata SEO untuk halaman apa pun (artikel, blog, kategori, layanan, home) |
| `GET` | `/sitemap.xml` | Sitemap dinamis (semua artikel + halaman utama) |
| `GET` | `/robots.txt` | robots.txt SEO-friendly |

Semua endpoint menerima `?lang=id` (default) atau `?lang=en`.

## Struktur

```
workers/blog-api/
  wrangler.toml        # konfigurasi Worker + [vars] (tanpa hardcode domain/secret)
  package.json         # scripts: dev, deploy, typecheck
  tsconfig.json        # typecheck khusus Worker (lib WebWorker)
  src/
    index.ts           # router + fetch handler
    content.ts         # adapter: derive konten dari client/src/lib/blog-content.ts
    seo.ts             # generator metadata SEO + JSON-LD (Article, BreadcrumbList)
    sitemap.ts         # sitemap.xml + robots.txt
    http.ts            # CORS whitelist, header keamanan, response helper
    url.ts             # util path absolut/normalisasi
    env.d.ts           # tipe binding Env
  .dev.vars.example    # contoh override env untuk dev lokal
```

## Menjalankan lokal

```bash
cd workers/blog-api
npm install
npm run dev
```

Worker berjalan di `http://127.0.0.1:8787`. Untuk menyesuaikan `SITE_URL`/CORS saat
dev, salin `.dev.vars.example` menjadi `.dev.vars` (file ini tidak di-commit).

```bash
npm run typecheck   # tsc -p tsconfig.json --noEmit
```

## Contoh respons (curl)

### Daftar artikel

```bash
curl -s "http://127.0.0.1:8787/api/blog" | head
```

```json
{
  "count": 5,
  "lang": "id",
  "items": [
    {
      "slug": "panduan-ai-automation-untuk-bisnis",
      "path": "/blog/panduan-ai-automation-untuk-bisnis",
      "title": "Panduan AI Automation untuk bisnis: dari proses manual ke sistem terhubung",
      "category": "Automation",
      "categorySlug": "automation",
      "excerpt": "Mulai dari memilih proses, memahami peran AI, ...",
      "readTime": 6,
      "date": "2026-08-04",
      "lang": "id",
      "url": "https://coresolution.digital/blog/panduan-ai-automation-untuk-bisnis"
    }
  ]
}
```

### Detail artikel

```bash
curl -s "http://127.0.0.1:8787/api/blog/automasi-lead-ke-crm?lang=id"
curl -s "http://127.0.0.1:8787/api/blog/automasi-lead-ke-crm?lang=en"
```

Mengembalikan `sections[]`, `takeaway`/`takeaways[]`, `relatedServices[]`, `service`,
`diagram[]`, dan `url` absolut. Slug tak dikenal → `404` dengan `{ "error": "not_found" }`.

### Metadata SEO

```bash
curl -s "http://127.0.0.1:8787/api/seo/alur-invoice-dengan-approval"
curl -s "http://127.0.0.1:8787/api/seo?path=/blog"
curl -s "http://127.0.0.1:8787/api/seo?path=/services/ai-strategy&lang=en"
```

Bentuk respons:

```json
{
  "path": "/blog/alur-invoice-dengan-approval",
  "url": "https://coresolution.digital/blog/alur-invoice-dengan-approval",
  "canonical": "https://coresolution.digital/blog/alur-invoice-dengan-approval",
  "title": "Merancang alur invoice dengan validasi dan approval — CORE Solution Digital",
  "description": "Contoh rancangan proses dari dokumen masuk hingga draft ERP, ...",
  "lang": "id",
  "openGraph": { "title": "...", "description": "...", "url": "...", "type": "article", "siteName": "CORE Solution Digital", "locale": "id_ID", "image": "https://coresolution.digital/images/core-agent-workspace.png" },
  "twitter": { "card": "summary_large_image", "title": "...", "description": "...", "image": "..." },
  "jsonLd": {
    "Article": { "@context": "https://schema.org", "@type": "Article", "headline": "...", "datePublished": "2026-09-08", "...": "..." },
    "BreadcrumbList": { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": ["..."] }
  }
}
```

Halaman non-artikel memakai `jsonLd.WebPage` + `BreadcrumbList`.

### Sitemap & robots

```bash
curl -s "http://127.0.0.1:8787/sitemap.xml"
curl -s "http://127.0.0.1:8787/robots.txt"
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://coresolution.digital/blog/alur-invoice-dengan-approval</loc>
    <lastmod>2026-09-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ...
</urlset>
```

```text
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://coresolution.digital/sitemap.xml
```

### Cek CORS preflight

```bash
curl -s -i -X OPTIONS "http://127.0.0.1:8787/api/blog" \
  -H "Origin: https://www.coresolution.digital" \
  -H "Access-Control-Request-Method: GET"
# -> 204 dengan Access-Control-Allow-Origin hanya untuk origin yang di-whitelist
```

## Deploy ke Cloudflare

```bash
cd workers/blog-api
npx wrangler login          # sekali saja
npm run deploy              # wrangler deploy
```

Setiap kali `[vars]` berubah, cukup `npm run deploy` ulang. Untuk nilai rahasia
(bila ditambahkan di masa depan), gunakan `npx wrangler secret put <NAME>` — jangan
masukkan secret ke `wrangler.toml`.

## Environment / konfigurasi

| Var | Default (`wrangler.toml`) | Fungsi |
| --- | --- | --- |
| `SITE_URL` | `https://coresolution.digital` | Origin absolut untuk canonical/OG/JSON-LD/sitemap. **Harus sama dengan host kanonik situs.** Bila tidak diisi, Worker memakai origin request (dev). |
| `SITE_NAME` | `CORE Solution Digital` | Nama situs di title & JSON-LD |
| `SITE_LOCALE` | `id_ID` | `og:locale` (versi `en` otomatis `en_US`) |
| `OG_IMAGE_PATH` | `/images/core-agent-workspace.png` | Path gambar social preview relatif ke `SITE_URL` (kosongkan untuk menonaktifkan) |
| `SITE_LAST_MODIFIED` | `2026-10-09` | Fallback `lastmod` sitemap untuk halaman tanpa tanggal |
| `CORS_ORIGINS` | `https://coresolution.digital,https://www.coresolution.digital` | Whitelist origin browser (dipisah koma/space). Tanpa wildcard. |

Catatan: `frontend` saat ini memakai canonical `https://coresolution.digital` (tanpa
`www`). Pastikan `SITE_URL` mengikuti host kanonik yang benar-benar disajikan agar
tidak muncul duplikasi `www`/non-`www` di mesin pencari.

## Sumber konten (single source of truth)

`src/content.ts` mengimpor langsung:

```ts
import { articles } from "../../../client/src/lib/blog-content";
```

Wrangler/esbuild membundel file tersebut saat build, jadi tidak ada teks yang
diduplikasi. Field `date` (tanggal terbit editorial, ISO `YYYY-MM-DD`) ditambahkan
di `blog-content.ts` dan dipakai untuk `lastmod` sitemap + `datePublished` JSON-LD.

Bila impor lintas-folder ini suatu saat tidak bisa dibundel, buat langkah build yang
menyalin `blog-content.ts` + `service-content.ts` ke folder Worker dan arahkan impor
ke salinan tersebut (tetap satu sumber).

## Integrasi frontend (opsional, tidak mengubah tampilan)

Backend ini murni API; UI tidak diubah. Bila nanti ingin memakai metadata siap-pakai
untuk prerender/SSR, cukup fetch endpoint SEO lalu isi tag `<head>`:

```ts
const seo = await fetch(`${API_BASE}/api/seo?path=${encodeURIComponent(path)}`).then(r => r.json());
// seo.title, seo.description, seo.canonical, seo.openGraph, seo.twitter, seo.jsonLd
```

Untuk sitemap, arahkan `/sitemap.xml` dan `/robots.txt` situs ke Worker ini (via
Cloudflare route/redirect) agar crawler menemukan versi dinamis.
