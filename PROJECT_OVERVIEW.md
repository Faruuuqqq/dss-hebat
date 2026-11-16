# SiPrioCCTV Jatinangor — Dokumentasi Teknis & Gambaran Proyek

Dokumen ini menjelaskan secara menyeluruh tentang **latar belakang masalah, formulasi matematis model keputusan, arsitektur teknis perangkat lunak, serta artefak aplikasi** yang dibangun dalam proyek Sistem Pendukung Keputusan (*Decision Support System* / DSS) Prioritisasi Penempatan Kamera CCTV di Kawasan Permukiman Mahasiswa Jatinangor.

---

## 1. Latar Belakang & Domain Masalah

### 1.1 Konteks Wilayah & Urgensi
Kecamatan Jatinangor, Kabupaten Sumedang, merupakan kawasan pendidikan tinggi yang dihuni oleh puluhan ribu mahasiswa dari berbagai perguruan tinggi besar (Universitas Padjadjaran, ITB Kampus Jatinangor, IPDN, dan Ikopin University). Tingginya aktivitas akademik dan mobilitas mahasiswa hingga larut malam menciptakan dinamika permukiman yang padat dengan ratusan gang indekos (*student living quarters*).

Namun, kawasan ini menghadapi sejumlah tantangan keselamatan publik (*smart living & urban safety*):
- **Tindak kriminalitas jalanan dan pencurian:** Terjadinya kasus pencurian kendaraan bermotor (curanmor), pembegalan, dan pelecehan di gang-gang permukiman mahasiswa yang minim pengawasan visual.
- **Infrastruktur penerangan jalan (PJU) yang tidak merata:** Banyak percabangan gang memiliki intensitas cahaya sangat rendah saat malam hari, meningkatkan kerentanan kejahatan.
- **Keterbatasan anggaran pemerintah & desa:** Anggaran pengadaan, pemasangan, dan pemeliharaan perangkat CCTV berbasis APBD atau dana desa sangat terbatas sehingga tidak memungkinkan pemasangan kamera di seluruh titik secara serentak.

### 1.2 Masalah Keputusan
Penempatan CCTV selama ini kerap dilakukan secara ad-hoc, berdasarkan intuisi, atau semata-mata desakan politis tanpa dasar analitis kuantitatif yang transparan. Diperlukan sebuah **Decision Support System (DSS)** berbasis multikriteria yang mampu:
1. Menilai tingkat urgensi segmen jalan/gang berdasarkan bukti empiris risiko kriminalitas dan eksposur lingkungan.
2. Memisahkan antara **urgensi kebutuhan pengawasan** dengan **kelayakan teknis infrastruktur (tiang/listrik/jaringan)** serta **kendala anggaran (RAB)**.
3. Mengalokasikan rekomendasi pemasangan ke dalam **fase anggaran bertahap** (multi-year phased deployment) yang realistis.

---

## 2. Formulasi Matematis Model Keputusan

Sistem mengintegrasikan dua metode *Multi-Criteria Decision Making* (MCDM), yaitu **Analytical Hierarchy Process (AHP)** untuk penentuan bobot kepentingan kriteria dan **Technique for Order of Preference by Similarity to Ideal Solution (TOPSIS)** untuk perankingan alternatif, diikuti oleh algoritma alokasi anggaran bertahap dan uji sensitivitas *one-at-a-time* (OAT).

```
   ┌────────────────────────────────────────────────────────┐
   │                  AHP (Weighting)                       │
   │  Matriks Perbandingan Berpasangan C1–C8                │
   │  Uji Konsistensi (λmax, CI, CR < 0.10)                 │
   │  Vektor Bobot Kriteria (w1, w2, ..., w8)               │
   └──────────────────────────┬─────────────────────────────┘
                              │ Bobot (w)
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │                  TOPSIS (Ranking)                      │
   │  Matriks Keputusan C1–C8 (X)                           │
   │  Normalisasi Vektor Euclidean (r_ij)                   │
   │  Matriks Terbobot (v_ij = w_j * r_ij)                  │
   │  Solusi Ideal Positif (A+) & Negatif (A-)              │
   │  Jarak Euclidean (D+ & D-)                             │
   │  Koefisien Kedekatan Relatif (CC_i)                    │
   └──────────────────────────┬─────────────────────────────┘
                              │ Peringkat Urgensi (CC)
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │             Alokasi Anggaran Bertahap                  │
   │  Filter Kelayakan Teknis (C9 >= 3)                     │
   │  Greedy Phased Allocation berdasarkan CC               │
   │  Kendala Plafon Biaya per Fase                         │
   └──────────────────────────┬─────────────────────────────┘
                              │
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │          Uji Sensitivitas One-at-a-Time (OAT)          │
   │  Variasi Bobot ±20% per Kriteria Urgensi               │
   │  Renormalisasi Proporsional                            │
   │  Analisis Pembalikan Peringkat (Rank Reversal)         │
   └────────────────────────────────────────────────────────┘
```

### 2.1 Taksonomi Kriteria Keputusan
Kriteria dibagi secara tegas menjadi dua domain:
1. **Kriteria Urgensi (C1–C8):** Seluruhnya berorientasi *benefit* (semakin tinggi nilainya, semakin mendesak untuk diawasi CCTV). Kriteria inilah yang dibobotkan dengan AHP dan dievaluasi dengan TOPSIS:
   - **$C_1$ Riwayat Kerawanan (Crime History):** Frekuensi insiden kriminalitas dalam 1–2 tahun terakhir.
   - **$C_2$ Mobilitas Malam (Night Mobility):** Estimasi volume pejalan kaki/kendaraan mahasiswa pukul 20.00–04.00.
   - **$C_3$ Defisiensi PJU (Streetlight Deficiency):** Jarak rata-rata antar-lampu jalan atau tingkat kegelapan segmen.
   - **$C_4$ Efisiensi Cakupan (Coverage Efficiency):** Rasio panjang gang terhadap potensi sudut pandang kamera (m/unit).
   - **$C_5$ Kepadatan Indekos (Dorm Density):** Jumlah kamar/penghuni indekos di sepanjang segmen.
   - **$C_6$ Derajat Simpul (Junction Degree):** Jumlah percabangan/akses jalan keluar-masuk gang (*escape route*).
   - **$C_7$ Gap CCTV Eksisting (CCTV Gap):** Jarak ke kamera CCTV aktif terdekat (semakin jauh, semakin butuh).
   - **$C_8$ Titik Rentan Khusus / POI Rentan (Vulnerable POI):** Keberadaan ATM, minimarket 24 jam, lahan kosong gelap, atau semak rimbun.
2. **Kriteria Kendala & Kelayakan (Bukan TOPSIS):**
   - **$C_9$ Kelayakan Teknis (Technical Feasibility):** Kesiapan tiang fisik, ketersediaan daya listrik PLN, dan jangkauan sinyal internet/fiber optik (skala Likert 1–5).
   - **RAB / Estimasi Biaya:** Biaya pengadaan perangkat, tiang pendukung, instalasi, dan penarikan kabel/jaringan per titik (dalam Rupiah).

---

### 2.2 Pembobotan Kriteria dengan AHP

Matriks perbandingan berpasangan $A = [a_{jk}]_{n \times n}$ disusun berdasarkan skala preferensi Saaty (1–9).

1. **Normalisasi Kolom & Vektor Eigen (Bobot Kriteria):**
   $$w_j = \frac{1}{n} \sum_{k=1}^n \frac{a_{jk}}{\sum_{i=1}^n a_{ik}}$$

2. **Nilai Eigen Maksimum ($\lambda_{\max}$):**
   $$\lambda_{\max} = \frac{1}{n} \sum_{j=1}^n \frac{(A \cdot w)_j}{w_j}$$

3. **Indeks Konsistensi ($CI$) dan Rasio Konsistensi ($CR$):**
   $$CI = \frac{\lambda_{\max} - n}{n - 1}, \quad CR = \frac{CI}{RI_n}$$
   Di mana $RI_8 = 1{,}41$ (untuk matriks $8 \times 8$) dan $RI_3 = 0{,}58$ (untuk hierarki klaster $3 \times 3$). Nilai bobot dinyatakan **konsisten dan sah** apabila $CR < 0{,}10$.

#### Dua Preset AHP pada Aplikasi:
- **Preset `ilustratif` (Default dari Excel):** Menggunakan struktur hierarki 3 klaster (Risiko $51{,}45\%$, Paparan $33{,}46\%$, Spasial $15{,}09\%$) hasil agregasi rata-rata geometrik 3 kelompok stakeholder (Pemerintah, Kampus, Warga). Menghasilkan bobot global:
  $$C_1: 31{,}56\%, \quad C_3: 19{,}88\%, \quad C_2: 16{,}14\%, \quad C_5: 10{,}50\%, \quad C_8: 6{,}83\%, \quad C_4: 6{,}81\%, \quad C_7: 5{,}17\%, \quad C_6: 3{,}11\%$$
- **Preset `naskah_uts` (Kanonik Paper UTS):** Menggunakan matriks datar $8 \times 8$ kanonik ($CR = 0{,}0104; \lambda_{\max} = 8{,}1031$):
  $$C_1: 23{,}95\%, \quad C_2 = C_3: 14{,}29\%, \quad C_5 = C_8: 12{,}45\%, \quad C_7: 9{,}74\%, \quad C_4: 7{,}70\%, \quad C_6: 5{,}15\%$$

---

### 2.3 Perankingan Alternatif dengan TOPSIS

Diberikan matriks keputusan alternatif $X = [x_{ij}]_{m \times n}$ (dengan $m$ alternatif dan $n=8$ kriteria urgensi):

1. **Normalisasi Vektor Euclidean:**
   $$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}$$

2. **Matriks Keputusan Terbobot:**
   $$v_{ij} = w_j \cdot r_{ij}$$

3. **Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$):**
   Karena seluruh $C_1$–$C_8$ merupakan kriteria *benefit*:
   $$A^+ = \{v_1^+, v_2^+, \dots, v_n^+\} = \{\max_i v_{ij} \mid j = 1, \dots, n\}$$
   $$A^- = \{v_1^-, v_2^-, \dots, v_n^-\} = \{\min_i v_{ij} \mid j = 1, \dots, n\}$$

4. **Jarak Euclidean ke Solusi Ideal:**
   $$D_i^+ = \sqrt{\sum_{j=1}^n (v_{ij} - v_j^+)^2}, \quad D_i^- = \sqrt{\sum_{j=1}^n (v_{ij} - v_j^-)^2}$$

5. **Koefisien Kedekatan Relatif (*Closeness Coefficient* / $CC$):**
   $$CC_i = \frac{D_i^-}{D_i^+ + D_i^-}, \quad 0 \le CC_i \le 1$$
   Semakin mendekati 1 nilai $CC_i$, semakin tinggi urgensi segmen tersebut.
   - Hasil pada preset `ilustratif`: **$A_3$ ($0{,}7674$) > $A_1$ ($0{,}5650$) > $A_4$ ($0{,}4287$) > $A_2$ ($0{,}4128$) > $A_5$ ($0{,}1397$)**.
   - Hasil pada preset `naskah_uts`: **$A_3$ ($0{,}6445$) > $A_1$ ($0{,}5774$) > $A_4$ ($0{,}4995$) > $A_2$ ($0{,}4638$) > $A_5$ ($0{,}1820$)**.

---

### 2.4 Alokasi Anggaran Bertahap & Kebijakan Kelayakan $C_9$

Setelah urutan prioritas $CC$ diperoleh:
1. **Ambang Kelayakan Operasional $C_9$:**
   Segmen dengan nilai kelayakan infrastruktur $C_9 < 3$ (misalnya tiang listrik belum tersedia atau tidak ada jaringan kabel/sinyal) tidak boleh dialokasikan pada **Fase 1 (Segera)**, melainkan dialihkan ke Fase 2 atau Fase 3 setelah instansi terkait melakukan survei tiang dan penarikan jaringan terlebih dahulu.
2. **Batasan Plafon Biaya per Fase:**
   Sistem mengalokasikan alternatif secara *greedy* terurut $CC$ ke dalam wadah fase anggaran tahunan (default plafon Rp15.000.000 per fase). Jika penambahan alternatif $A_i$ menyebabkan subtotal biaya fase melebihi plafon, alternatif tersebut dialokasikan ke fase berikutnya. Jika biaya satu titik melebihi plafon keseluruhan, sistem menandainya sebagai tidak teralokasi (*unallocated*).
   - Hasil Alokasi Resmi:
     - **Fase 1 (Segera):** $\{A_3, A_1\}$ — Total Rp14.000.000
     - **Fase 2:** $\{A_4, A_2\}$ — Total Rp12.500.000
     - **Fase 3:** $\{A_5\}$ — Total Rp5.500.000

---

### 2.5 Uji Sensitivitas One-at-a-Time (OAT) $\pm 20\%$

Untuk menguji kekokohan (*robustness*) model terhadap subjektivitas pembobotan, dilakukan simulasi perubahan bobot satu kriteria sebesar $\Delta = \pm 20\%$ secara bergantian (total $8 \times 2 = 16$ skenario).
Bobot baru kriteria target $k$ adalah $w_k' = w_k \cdot (1 + \Delta)$. Sisa bobot kriteria lainnya direnormalisasi secara proporsional:
$$w_j' = w_j \cdot \frac{1 - w_k'}{1 - w_k}, \quad \forall j \neq k$$
Hasil TOPSIS dihitung ulang untuk setiap skenario. Temuan stabilitas membuktikan bahwa **$A_3$ dan $A_1$ selalu menempati peringkat 2 teratas di seluruh 16 skenario**, membuktikan bahwa rekomendasi model sangat stabil terhadap fluktuasi preferensi pemangku kepentingan.

---

## 3. Arsitektur Teknis Perangkat Lunak

Aplikasi modern dibangun di direktori `07-webapp/` menggunakan prinsip *clean architecture* berlapis:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LAPIS 1: PRESENTASI (UI SHELL)                       │
│  Next.js 16 (App Router) + React 19 + Tailwind CSS 4                   │
│  5 Layar: / (Dashboard), /kriteria, /ahp, /hasil, /sensitivitas        │
│  Komponen Aman: NumberCell.tsx (Anti-blur bug), Sidebar, Badges        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│              LAPIS 2: VISUALISASI SPASIAL INTERAKTIF                   │
│  Three.js WebGL (PriorityMap3D.tsx): Pilar tinggi ∝ CC, Raycasting     │
│  Fallback Ringan (PriorityMap2D.tsx): SVG Render tanpa WebGL           │
│  Lapisan Layer: Urgensi (CC), Kesiapan (C9), Gap CCTV (C7)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                 LAPIS 3: DOMAIN LOGIC (MODULAR ENGINE)                 │
│  TypeScript Murni (lib/engine/): types, ahp, topsis, alloc, sens       │
│  Mandiri & Bebas Dependensi Eksternal (Zero external math library)     │
│  Format Angka Deterministik (bebas isu hydration SSR vs Client)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│               LAPIS 4: PENYIMPANAN DATA & REPOSITORY                   │
│  Supabase PostgreSQL (Tables: criteria, alternatives, ahp, audit_log)  │
│  Row Level Security (RLS) & Trigger Otomatis Audit Log                 │
│  Graceful Local Fallback: otomatis baca JSON statis bila tanpa DB      │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Detail Komponen Teknis
1. **Next.js 16 App Router & React 19:**
   Menyediakan routing deklaratif, prerender statis untuk performa loading maksimal, dan arsitektur komponen modern.
2. **NumberCell Component (Anti-Blur Bug):**
   Input angka HTML standar pada React sering mengalami kerusakan pengetikan jika state numerik langsung di-bind (`Number("")` menjadi `0`, sehingga mengetik `7.5` berubah menjadi `75`). Komponen `NumberCell.tsx` menggunakan *draft string state*, menerima tanda koma maupun titik, dan menjepit rentang (*clamp*) hanya saat `onBlur`.
3. **Three.js WebGL 3D Pillar Map:**
   Visualisasi spasial 3 dimensi dengan kanvas WebGL. Pilar jalan memiliki ketinggian proporsional terhadap skor $CC$ TOPSIS, kubus hitam menunjukkan titik CCTV eksisting, dan jaring jalan skematik digambar secara presisi. Dilengkapi deteksi kursor raycasting untuk menampilkan tooltip interaktif dan tombol rotasi orbit. Jika WebGL tidak didukung peramban, tombol fallback SVG 2D siap digunakan.
4. **Supabase Layer dengan Graceful Local Fallback:**
   Modul `lib/supabase-repository.ts` mendeteksi ketersediaan `NEXT_PUBLIC_SUPABASE_URL`. Jika pengguna belum menghubungkan database, aplikasi **tidak crash**, melainkan secara elegan mengambil data dari file statis `data/ilustratif.json` dan `data/naskah-uts.json`.

---

## 4. Antarmuka 5 Layar Aplikasi (Sesuai Mockup)

Aplikasi mengimplementasikan secara penuh 5 layar yang dispesifikasikan dalam mockup `SiPrioCCTV Jatinangor.html`:

| Layar | Rute | Fungsi Utama |
|---|---|---|
| **1. Dashboard** | `/` | Menampilkan 4 KPI utama (Jumlah segmen, Urgensi tertinggi, Konsistensi AHP, Realisasi anggaran Fase 1), Peta 3D prioritas interaktif, Bar peringkat TOPSIS, dan Kartu alokasi fase 1–3. |
| **2. Data Kriteria** | `/kriteria` | Menampilkan matriks keputusan terkelompok berdasarkan klaster (Risiko, Paparan, Spasial, Biaya & Kelayakan), formulir edit kriteria alternatif, dan transparansi sumber data. |
| **3. Pembobotan AHP** | `/ahp` | Matriks perbandingan klaster, status konsistensi Saaty (nilai $\lambda_{\max}$, $CI$, $CR$), kuesioner slider Saaty terpandu untuk pakar/responden, dan rincian bobot global kriteria. |
| **4. Hasil TOPSIS & Anggaran** | `/hasil` | Tabel komprehensif TOPSIS ($D^+$, $D^-$, $CC$), bar alokasi anggaran bertahap, formulir pengaturan plafon dinamis dan ambang $C_9$, serta tombol ekspor CSV. |
| **5. Uji Sensitivitas** | `/sensitivitas` | Simulasi *one-at-a-time* $\pm 20\%$, chip pemilihan kriteria, visualisasi pergeseran urutan peringkat, dan tabel ringkasan 16 skenario. |

---

## 5. Jaminan Kualitas, Pengujian, & Aksesibilitas

Aplikasi dilengkapi *automated quality gates* yang ketat:

1. **Paritas Numerik 100% (`npm run parity`):**
   75 pemeriksaan otomatis yang memverifikasi bahwa hasil perhitungan mesin TypeScript identik hingga 4 digit desimal dengan model naskah kanonik UTS dan dataset Excel ilustratif.
2. **Pengujian Interaksi Browser E2E (`node scripts/ui-check.mjs`):**
   Memverifikasi kelima layar aplikasi di peramban Chromium headless nyata tanpa adanya error konsol.
3. **Verifikasi Unduhan CSV Nyata (`node scripts/ui-export.mjs`):**
   Memvalidasi bahwa klik tombol ekspor benar-benar memicu download berkas CSV dengan header dan nilai baris yang valid.
4. **Audit Aksesibilitas WCAG 2.1 AA (`node scripts/ui-a11y.mjs`):**
   Audit menggunakan mesin `axe-core` pada desktop (1440px) dan mobile (390px) menghasilkan **0 pelanggaran serius atau kritis**.
5. **Paritas Prototipe Awal (`node 05-aplikasi/test-algoritma.mjs`):**
   Mesin prototipe 1-file offline pada `05-aplikasi/` tetap terjaga dan 100% lulus uji.

---

## 6. Panduan Deployment ke Vercel

Aplikasi telah siap (*production-ready*) untuk dideploy ke **Vercel**:

1. **Push ke GitHub:**
   Pastikan seluruh commit lokal telah di-push ke repositori GitHub (`git push origin main`).
2. **Import ke Vercel:**
   - Buka [vercel.com](https://vercel.com) dan buat **New Project**.
   - Import repositori `Faruuuqqq/dss-hebat`.
3. **Pengaturan Proyek (PENTING):**
   - **Root Directory:** Pilih subdirektori **`07-webapp`**.
   - **Framework Preset:** `Next.js` (otomatis terdeteksi).
   - **Build Command:** `npm run build`.
4. **Environment Variables (Opsional):**
   Jika ingin menghubungkan ke cloud Supabase, masukkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   *(Jika belum diisi, aplikasi langsung berjalan normal menggunakan fallback data lokal)*.
5. **Klik "Deploy":**
   Aplikasi akan selesai di-build dan siap diakses melalui URL Vercel publik.
