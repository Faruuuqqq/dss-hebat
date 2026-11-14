# 07-webapp — DSS CCTV Jatinangor (Next.js)

Migrasi aplikasi satu-berkas (`05-aplikasi/index.html`) ke **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**.

Aplikasi tetap **100% sisi klien**: tidak ada backend, tidak ada basis data, tidak ada panggilan jaringan saat runtime. Halaman di-*prerender* statis.

## Menjalankan

```bash
cd 07-webapp
npm install
npm run dev          # http://localhost:3000
```

Produksi:

```bash
npm run build
npm start            # default http://localhost:3000
```

## Verifikasi

```bash
npm run parity       # 40+ pemeriksaan angka kanonik terhadap lib/engine.ts
node scripts/ui-check.mjs   # uji interaksi di peramban (butuh server berjalan)
```

`scripts/ui-check.mjs` memakai `playwright-core` dengan Chromium yang sudah ada di mesin
(tidak mengunduh peramban baru). Jalankan server lebih dulu, lalu misalnya:

```bash
BASE_URL=http://127.0.0.1:3111 node scripts/ui-check.mjs
```

## Struktur

```
app/
  layout.tsx        # metadata + pembungkus
  page.tsx          # dashboard interaktif (client component)
  globals.css       # token warna/tipe, gaya sel matriks, fokus
  icon.svg          # favicon
lib/
  engine.ts         # MESIN AHP-TOPSIS (mandiri, data-driven, tanpa impor internal)
  format.ts         # format angka Indonesia + ekspor CSV
scripts/
  parity.mts        # paritas angka kanonik (dijalankan via type-stripping Node)
  ui-check.mjs      # uji interaksi peramban
```

`lib/engine.ts` sengaja dibuat **mandiri tanpa impor internal** supaya dapat dijalankan
langsung oleh Next.js maupun oleh `node scripts/parity.mts` tanpa langkah build.

## Paritas dengan model kanonik

Sumber kebenaran: `dss_revisi_markdown/dss_revisi.md`. Angka yang dijaga `npm run parity`:

| Besaran | Nilai |
|---|---|
| λmax / CI / CR | 8,1031 / 0,0147 / 0,0104 |
| Bobot C1 | 23,95% |
| Bobot C2 = C3 | 14,29% |
| Bobot C5 = C8 | 12,45% |
| Bobot C7 / C4 / C6 | 9,74% / 7,70% / 5,15% |
| CC A3 / A1 / A4 / A2 / A5 | 0,6445 / 0,5774 / 0,4995 / 0,4638 / 0,1820 |
| Fase anggaran | [1, 2, 1, 2, 3] |
| Sensitivitas ±20% | 16 skenario, 2 pembalikan (C1 −20%, C2 +20%) |

### Catatan penting tentang `A0`

Matriks AHP memakai `0,33` sebagai pendekatan desimal `1/3`, sehingga pasangan
`0,33 × 3 = 0,99` dan matriks **tidak** resiprokal sempurna. Ini dipertahankan dengan sengaja:
nilai `0,33` itulah yang mereproduksi λmax 8,1031 dan CR 0,0104. Bila diubah menjadi `1/3`
tepat, λmax bergeser ke 8,1067 dan paritas dengan naskah kanonik hilang.

## Perlakuan C9 dan RAB

- C1–C8 adalah kriteria urgensi yang masuk TOPSIS.
- C9 dan RAB adalah **kendala alokasi**, bukan kriteria perankingan.
- Ambang `C9 ≥ 3` adalah **kebijakan implementasi terdokumentasi**, bukan angka yang
  dinyatakan eksplisit dalam `dss_revisi.md`.
- Alternatif dengan biaya satu titik melebihi plafon tidak dialokasikan, sehingga subtotal
  fase tidak pernah melampaui plafon.

## Status data

Dataset `resmi` (5 segmen) adalah keluaran utama dan bersifat **hybrid**: kalibrasi dari
sumber sekunder level desa/kecamatan, sedangkan sel per-segmen merupakan estimasi
terdokumentasi. Dataset `perluasan` (12 desa) adalah **[SIMULASI]** untuk demonstrasi
skalabilitas dan tidak boleh dijadikan hasil utama.

## Belum dikerjakan

- Deploy ke Vercel dan integrasi Supabase (tahap 2 pada rencana teknologi).
- `npm run lint` belum dikonfigurasi (Next 16 memakai ESLint datar; belum ada `eslint.config`).
