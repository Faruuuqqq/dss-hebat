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
npm run verify       # lint + parity + build dalam satu perintah
npm run lint         # ESLint 9 (flat config)
npm run parity       # 50+ pemeriksaan: angka kanonik, format, parser input

# uji peramban (server harus berjalan lebih dulu)
npm start &
npm run test:bugs    # 16 pemeriksaan perilaku input angka
npm run test:ui      # 18 pemeriksaan interaksi dashboard
npm run test:export  # 22 pemeriksaan ekspor CSV (isi berkas, kedua dataset)
npm run test:a11y    # audit axe-core (WCAG 2.1 A/AA) di 2 lebar dan 4 keadaan
```

Skrip peramban memakai `playwright-core` dengan Chromium yang sudah ada di mesin
(tidak mengunduh peramban baru). Untuk menunjuk server atau peramban lain:

```bash
BASE_URL=http://127.0.0.1:3111 CHROME=/path/ke/chrome npm run test:ui
```

## Struktur

```
app/
  layout.tsx        # metadata + pembungkus
  page.tsx          # dashboard interaktif (client component)
  globals.css       # token warna/tipe, gaya sel matriks, fokus
  icon.svg          # favicon
components/
  NumberCell.tsx    # sel angka aman (draft string, koma, jepit saat blur)
lib/
  engine.ts         # MESIN AHP-TOPSIS (mandiri, data-driven, tanpa impor internal)
  format.ts         # format deterministik + parser input + ekspor CSV
scripts/
  parity.mts        # paritas angka kanonik + format + parser
  ui-check.mjs      # uji interaksi peramban
  ui-bugs.mjs       # uji regresi perilaku input angka
  ui-export.mjs     # uji ekspor CSV (unduhan nyata + isi berkas)
  ui-a11y.mjs       # audit aksesibilitas axe-core
```

`lib/engine.ts` sengaja dibuat **mandiri tanpa impor internal** supaya dapat dijalankan
langsung oleh Next.js maupun oleh `node scripts/parity.mts` tanpa langkah build.

## Perilaku input angka

Seluruh sel angka memakai `components/NumberCell.tsx`. Alasannya: input yang dikendalikan
langsung oleh state numerik (`value={n} onChange={e => setN(Number(e.target.value))}`)
merusak pengetikan. Saat sel dikosongkan, `Number("")` bernilai `0`, React mengisi ulang `"0"`,
lalu karakter berikutnya menempel sehingga `"7.5"` menjadi `"75"` dan `"1250"` menjadi `"01250"`.

| Perilaku | Jaminan |
|---|---|
| Mengetik desimal | Teks dipertahankan selama fokus (`7.5` tetap `7.5`) |
| Pemisah desimal | Titik maupun koma diterima (`6,5` → `6.5`) |
| Nilai di luar rentang | Dijepit saat blur (C9 → 1..5, biaya ≥ 0, AHP → 1/9..9) |
| Sel dikosongkan | Kembali ke nilai sah sebelumnya, bukan `0` |
| Teks tidak valid | Ditolak, nilai sah sebelumnya dipertahankan |
| Format angka | `lib/format.ts` tidak memakai `toLocaleString`, jadi keluaran identik di server dan klien (bebas risiko hydration) |

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
- Data masih statis di `lib/engine.ts`; belum ada pemuatan dari basis data.
