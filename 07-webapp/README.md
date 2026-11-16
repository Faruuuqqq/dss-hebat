# 07-webapp — SiPrioCCTV Jatinangor (Next.js 16 + Three.js + Supabase)

Implementasi aplikasi DSS (*Decision Support System*) prioritisasi penempatan kamera CCTV di permukiman mahasiswa Jatinangor berbasis **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Three.js + Supabase**.

Aplikasi mengimplementasikan model keputusan **AHP–TOPSIS** multi-kriteria dengan alokasi anggaran bertahap dan uji sensitivitas *one-at-a-time* (OAT), mereproduksi antarmuka mockup [`SiPrioCCTV Jatinangor.html`](../SiPrioCCTV%20Jatinangor.html) dan dataset [`Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx`](../Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx).

---

## Fitur Utama

1. **5 Layar Terintegrasi (Desain Mockup SiPrioCCTV):**
   - **Dashboard (`/`):** 4 KPI utama, visualisasi peta 3D prioritas, peringkat TOPSIS interaktif, dan kartu alokasi bertahap.
   - **Data Kriteria (`/kriteria`):** Matriks keputusan terkelompok (Risiko, Paparan, Spasial, Biaya & Kelayakan), form penyesuaian nilai alternatif, dan transparansi sumber data.
   - **Pembobotan AHP (`/ahp`):** Matriks perbandingan klaster, status konsistensi Saaty (CR, $\lambda_{\max}$, RI), kuesioner slider Saaty untuk responden pakar/stakeholder, dan kartu bobot global kriteria.
   - **Hasil & Anggaran (`/hasil`):** Tabel komprehensif TOPSIS ($D^+$, $D^-$, $CC$), alokasi bertahap dengan progress bar, pengaturan plafon dinamis & ambang C9, serta unduhan ekspor CSV.
   - **Uji Sensitivitas (`/sensitivitas`):** Simulasi OAT $\pm20\%$, visualisasi pergeseran peringkat, indikator pembalikan peringkat (*rank reversal*), dan tabel matriks 16 skenario.

2. **Dua Preset Dataset:**
   - **Preset `ilustratif` (Default):** Berbasis file Excel `Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx` dengan AHP hierarki 3 klaster $\times$ 3 kelompok stakeholder (agregat rata-rata geometrik). Bobot global: C1 31,56%, C3 19,88%, C2 16,14%, C5 10,50%, C8 6,83%, C4 6,81%, C7 5,17%, C6 3,11%; TOPSIS A3 (0,7674) > A1 (0,5650) > A4 (0,4287) > A2 (0,4128) > A5 (0,1397).
   - **Preset `naskah_uts`:** AHP datar $8 \times 8$ kanonik sesuai paper IEEE dan proposal UTS (C1 23,95%; TOPSIS A3 0,6445 > A1 0,5774 > A4 0,4995 > A2 0,4638 > A5 0,1820).

3. **Visualisasi Peta 3D (Three.js):**
   - Kanvas WebGL interaktif dengan jalan, bangunan kubus, titik CCTV eksisting, dan pilar prioritas dengan tinggi proporsional terhadap skor urgensi ($CC$).
   - Raycasting untuk hover/click segmen, kontrol rotasi orbit, serta tombol beralih ke fallback SVG 2D jika WebGL dinonaktifkan.
   - Tiga mode tampilan layer: Urgensi ($CC$), Kelayakan teknis ($C_9$), dan Coverage gap ($C_7$).

4. **Integrasi Supabase & Fallback Anggun (Graceful Local Fallback):**
   - Skema database PostgreSQL lengkap di `supabase/migrations/20261116000000_init.sql` (tabel profil, dataset, kriteria, alternatif, nilai, perbandingan AHP, dan log audit).
   - *Row Level Security* (RLS) policies untuk pemisahan hak akses publik (baca), pakar (input AHP), dan admin (tulis matriks kriteria).
   - Data awal otomatis dari `supabase/seed.sql`.
   - `lib/supabase-repository.ts` mendeteksi keberadaan variabel lingkungan; jika Supabase belum terhubung, aplikasi beralih secara transparan ke data statis lokal.

5. **Aksesibilitas & Kerapian UI:**
   - Memenuhi standar WCAG 2.1 AA (0 pelanggaran pada audit otomatis `axe-core`).
   - Kontras warna teks, label form (`htmlFor`, `aria-label`), navigasi keyboard, dan tabel responsif.

---

## Menjalankan Aplikasi

```bash
cd 07-webapp
npm install
npm run dev          # Buka http://localhost:3000
```

Kompilasi produksi:

```bash
npm run build
npm start            # Default port 3000 (atau gunakan -p 3111)
```

---

## Verifikasi & Pengujian Otomatis

Aplikasi dilengkapi suite pengujian otomatis berlapis:

```bash
npm run verify       # Menjalankan: lint + parity + build produksi

npm run lint         # ESLint 9 (Next.js TypeScript config)
npm run parity       # 75 pemeriksaan paritas numerik (AHP, TOPSIS, Alokasi, Sensitivitas)

# Uji peramban (jalankan `npm start -p 3111` lebih dulu):
npm run test:ui      # Uji interaksi di 5 layar peramban Chromium
npm run test:bugs    # 16 pemeriksaan keandalan input angka NumberCell
npm run test:export  # Pengujian unduhan nyata berkas CSV dan validasi isinya
npm run test:a11y    # Audit aksesibilitas axe-core pada 5 layar (0 pelanggaran)
```

---

## Konfigurasi Lingkungan (Deployment)

### Vercel
Aplikasi siap dideploy ke Vercel dengan konfigurasi `07-webapp/vercel.json`. Bila dideploy dari subdirektori repo monorepo, tetapkan *Root Directory* pada Vercel ke `07-webapp`.

### Supabase
Salin berkas `.env.example` ke `.env.local` dan isi URL serta kunci API proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
Jalankan migrasi dan seeding database:
```bash
supabase db push
# atau jalankan skrip supabase/migrations/20261116000000_init.sql dan supabase/seed.sql via SQL Editor di Supabase Dashboard
```

---

## Struktur Berkas

```
07-webapp/
├── app/
│   ├── layout.tsx             # Root layout, metadata, dan Sidebar navigation
│   ├── page.tsx               # Layar 1: Dashboard interaktif
│   ├── kriteria/page.tsx      # Layar 2: Data Kriteria Segmen & edit form
│   ├── ahp/page.tsx           # Layar 3: Pembobotan AHP & slider kuesioner Saaty
│   ├── hasil/page.tsx         # Layar 4: Hasil TOPSIS, alokasi bertahap & CSV export
│   ├── sensitivitas/page.tsx  # Layar 5: Uji sensitivitas OAT ±20%
│   ├── globals.css            # Token desain, warna Saaty, dan styling
│   └── icon.svg               # Favicon
├── components/
│   ├── Sidebar.tsx            # Navigasi utama, pemilih dataset & toggle peran
│   ├── NumberCell.tsx         # Sel input angka terlindungi (anti-blur bug)
│   └── map/
│       ├── PriorityMap3D.tsx  # Komponen visualisasi 3D Three.js
│       ├── PriorityMap2D.tsx  # Fallback visualisasi 2D berbasis SVG
│       └── MapModeToggle.tsx  # Pengalih mode layer (Urgensi/Kelayakan/Gap)
├── lib/
│   ├── engine/                # Mesin komputasi AHP-TOPSIS modular (TypeScript murni)
│   │   ├── types.ts           # Definisi tipe kriteria, alternatif, dan hasil
│   │   ├── ahp.ts             # Solver AHP nilai eigen & konsistensi Saaty
│   │   ├── topsis.ts          # Normalisasi Euclidean, jarak ideal & kedekatan CC
│   │   ├── allocation.ts      # Logika alokasi fase anggaran & filter C9
│   │   ├── sensitivity.ts     # Analisis sensitivitas one-at-a-time (OAT)
│   │   └── index.ts           # Evaluator orkestrasi
│   ├── store.tsx              # React Context penyimpan state global aplikasi
│   ├── format.ts              # Utilitas format angka deterministik & CSV
│   ├── supabase.ts            # Klien Supabase
│   └── supabase-repository.ts # Repository layer dengan graceful local fallback
├── data/
│   ├── ilustratif.json        # Data hasil ekstraksi xlsx (default)
│   ├── naskah-uts.json        # Data naskah UTS kanonik (flat 8x8)
│   ├── cctv-eksisting.sim.json# Data titik CCTV eksisting [SIMULASI]
│   └── jalan.sim.json         # Data garis jalan skematik [SIMULASI]
├── supabase/
│   ├── migrations/            # SQL migration skema tabel, RLS, audit log
│   └── seed.sql               # Data benih awal PostgreSQL
├── scripts/
│   ├── import-xlsx.py         # Skrip ekstraktor XML dari file .xlsx ke JSON
│   ├── generate-data.py       # Pembangkit dataset kanonik & spasial skematik
│   ├── parity.mts             # 75 pengujian paritas numerik
│   ├── ui-check.mjs           # E2E test 5 layar via Chromium
│   ├── ui-bugs.mjs            # Regresi input angka
│   ├── ui-export.mjs          # Verifikasi unduhan CSV
│   └── ui-a11y.mjs            # Audit aksesibilitas WCAG 2.1 AA
└── vercel.json                # Konfigurasi deployment Vercel
```
