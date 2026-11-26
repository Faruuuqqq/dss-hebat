# PROGRESS.md — Log Progres Proyek DSS Jatinangor

**Fungsi:** catatan progres kronologis pekerjaan. **Selalu diperbarui setiap sesi kerja.**
Entri **terbaru di paling atas**. Setiap entri wajib memuat: tanggal · apa yang dikerjakan · keputusan · file · verifikasi · open items.

> Konvensi: setelah menyelesaikan pekerjaan apa pun, tambahkan entri baru di bawah judul "Log" dengan tanggal hari itu. Jangan hapus entri lama (append-only). Rujuk file dengan path relatif ke root repo.

---

## Status ringkas (per 20 Nov 2026)

| Area | Status |
|---|---|
| **Sumber kebenaran** | `dss_revisi_markdown/dss_revisi.md` (AHP datar 8×8; PRISMA 582→416→121→12) |
| Proposal SCR (UTS) `dss_revisi.md` | SELESAI, sudah dikumpulkan ke dosen |
| Aplikasi DSS Offline (`05-aplikasi/`) | SELESAI (web app 1 file, offline; fokus edit diperbaiki; ambang C9 operasional; biaya > plafon tidak dialokasikan) |
| Aplikasi Modern (`07-webapp/`) | SELESAI — Next.js 16 + Leaflet GIS (OSM) + Three.js + Supabase; 5 layar terintegrasi; 2 preset dataset; Tri-View map (GIS OSM + 3D Kolom + 2D Skematik) dengan koordinat dunia nyata Jatinangor; 0 pelanggaran a11y |
| Test suite | SELESAI — 75 parity check, Chromium UI check (5 layar), ekspor CSV terverifikasi, a11y WCAG 2.1 AA |
| Paper hasil IEEE | SELESAI (.md + .tex), diselaraskan ke `dss_revisi` (BPS >98.000; 24 ref); tercompile **5 halaman** tanpa error (Tectonic) |
| Data lapangan & spasial | RIIL level desa + koordinat lokasi jalan/gang nyata Jatinangor via OpenStreetMap Nominatim (jarak geodesik selaras $C_7$); nilai matriks per-gang = hybrid (estimasi) |
| Commit git | branch `main`; siap di-commit berurutan |

**Blokir aktif:** data per-gang belum dari observasi lapangan.
**Open items (opsional):** deploy `07-webapp/` ke Vercel + Supabase bila akun/kredensial cloud disiapkan pengguna, push `main`.

---

## Log

### 2026-11-26 · Sesi 37 — Perbaiki GIS, fase anggaran, dan impor kriteria

**Konteks** — Pengguna meminta perbaikan tiga temuan pada webapp tayang. Mount checkout asal baca-saja, sehingga perubahan dibuat di salinan Git yang dapat ditulis.

**Keputusan** — Muat stylesheet Leaflet dari layout Next.js. Gunakan satu ringkasan untuk menampilkan seluruh hasil fase dan alasan pengecualian di Dashboard serta Hasil. Atur plafon di dekat ringkasan dan hitung ulang saat input berubah. Simpan perubahan kriteria sebagai skenario browser. Validasi CSV dan tampilkan pratinjau sebelum menerapkan nilai ke ID segmen yang sudah ada.

**File** — Layout dan tiga halaman di `07-webapp/app/`, komponen ringkasan dan impor, parser CSV, store skenario, uji browser, README webapp, dan perbaikan kutip pada dua label sumber di CSV acuan.

**Verifikasi** — Empat uji regresi mereproduksi masalah pada versi tayang sebelum perbaikan, lalu lulus pada build produksi lokal. `npm run verify`, `test:ui`, `test:scenario`, `test:bugs`, `test:export`, `test:a11y`, dan `node 05-aplikasi/test-algoritma.mjs` lulus. CSV acuan terbaca sebagai lima baris oleh parser impor. Nilai numerik kanonik tetap sesuai uji paritas.

**Open items** — Verifikasi commit yang dideploy pada domain Vercel dan sinkronkan checkout asal saat mount bisa ditulis.

---

### 2026-11-25 · Sesi 36 — Tinjau webapp yang tayang

**Konteks** — Meninjau lima layar SiPrioCCTV di `https://siprio-cctv.vercel.app/` untuk menyusun prioritas perbaikan.

**Keputusan** — Prioritaskan peta GIS, konsistensi ringkasan alokasi, dan kejelasan penyimpanan. Setelah itu, rapikan hierarki dashboard ponsel, keterbacaan tabel, penanda preset, dan status bukti data.

**File** — `PROGRESS.md`.

**Verifikasi** — Tinjauan Chromium pada 1440, 768, dan 390 px. Pada situs tayang, tile OSM termuat tetapi tile dan marker berposisi `static`, sehingga peta terlihat terpotong. Plafon Rp8 juta menghasilkan lima fase di tabel dan hanya tiga di ringkasan. `Impor CSV` membuka dialog teks tanpa pemilih berkas, dan perubahan nilai dalam preset kembali ke nilai awal setelah muat ulang meski UI menampilkan pesan tersimpan. Di ponsel, tabel Hasil perlu digeser untuk membaca fase dan biaya.

**Open items** — Rekomendasi disampaikan untuk diprioritaskan sebelum implementasi.

---

### 2026-11-25 · Sesi 35 — Orientasi repositori SiPrioCCTV

**Konteks** — Membaca naskah UTS, paper hasil, dokumentasi data, dan struktur kedua aplikasi untuk memahami status proyek saat ini.

**Keputusan** — Gunakan `dss_revisi_markdown/dss_revisi.md` sebagai acuan model dan hasil numerik. Paper hasil membahas aplikasi luring. Webapp memakai preset `ilustratif` secara bawaan dan menyediakan `naskah_uts` untuk mereproduksi hasil paper. Di webapp, C9 di bawah ambang menunda alokasi ke Fase 2+ pada `ilustratif` dan mengecualikan segmen dari alokasi pada `naskah_uts`.

**File** — `PROGRESS.md`.

**Verifikasi** — `node 05-aplikasi/test-algoritma.mjs` dan `npm run verify` di `07-webapp/` lulus. `pdfinfo` menunjukkan PDF paper hasil 6 halaman dan PDF paper proposal 8 halaman. `main` cocok dengan referensi lokal `origin/main` saat diperiksa. Store webapp membaca preset dari JSON lokal dan menyimpan skenario di `localStorage`.

**Open items** — Validasi data per segmen melalui survei lapangan. Tabel status lama dan beberapa dokumen masih menyebut peta 3D atau PDF hasil 5 halaman. Integrasi Supabase ke alur webapp dan deploy Vercel tetap opsional.

---

### 2026-11-24 · Sesi 34 — P1–P7: status bukti kamera + Skenario Saya (tambah titik)

**Konteks:** pengguna meminta rencana peningkatan peta & penambahan titik, lalu "lanjutkan"; rencana P1–P7 (Sesi 33) dieksekusi.

**Keputusan:**
1. **P1 — status bukti kamera:** `cctv-eksisting.sim.json` memisahkan `keberadaan`, `koordinat_status`, `operasional`, `sumber_url`, dan `tanggal_sumber`. EX-02 tidak lagi diklaim "Aktif" (simulasi, tidak terverifikasi). Popup peta dan generator data ikut diselaraskan; legenda menyatakan radius 75 m ilustratif dan C7 adalah input dataset.
2. **P2 — klaim dilunakkan:** pernyataan ATCS di paper `.md`/`.tex`, `08-docs/data-dan-sumber.md`, dan `AGENTS.md` diubah menjadi "daftar lokasi publik yang diperiksa tidak memuat titik Jatinangor" (bukan bukti ketiadaan layanan).
3. **P3–P6 — Skenario Saya:** salinan preset disimpan di `localStorage` (versi skema 1). Pengguna dapat menambah segmen lewat form manual atau klik peta (pin draf), menghapus segmen, serta mengekspor/mengimpor skenario JSON. Validasi menolak draf tidak lengkap sehingga nilai kosong tidak menjadi nol di mesin. Preset acuan tidak pernah dimutasi; saat skenario aktif, pemilih preset diganti status skenario agar pekerjaan tidak hilang diam-diam.
4. **P7 — verifikasi:** suite baru `scenario-check` dan `test:scenario`; dokumen README/AGENTS/tasks diperbarui.

**File:** `07-webapp/lib/{scenario.ts, store.tsx}`, `07-webapp/components/{SegmentForm.tsx, Sidebar.tsx}`, `07-webapp/components/map/PriorityMapGIS.tsx`, `07-webapp/app/{page.tsx, kriteria/page.tsx}`, `07-webapp/data/cctv-eksisting.sim.json`, `07-webapp/scripts/{generate-data.py, scenario-check.mts, ui-scenario.mjs}`, `07-webapp/package.json`, `07-webapp/README.md`, `AGENTS.md`, `tasks/{plan.md, todo.md}`, `PROGRESS.md`.

**Verifikasi:** `npm run verify` LULUS (lint + scenario-check 15 cek + parity 75 cek + build); `test:scenario` LULUS (tambah manual & klik peta, reload persistensi, ekspor/impor, hapus, kembali ke preset, 0 error konsol); `test:ui`, `test:bugs`, `test:export`, `test:a11y` LULUS. Angka kanonik tidak berubah (ilustratif A3 0,7674; naskah_uts A3 0,6445).

**Open items:** push branch `main`; validasi lapangan; opsional Supabase untuk skenario lintas perangkat.

---

### 2026-11-23 · Sesi 33 — Rencana peta berbukti dan tambah titik skenario

**Konteks:** pengguna meminta rencana peningkatan ketepatan peta dan penambahan titik langsung melalui UI, serta penilaian realistis tanpa survei lapangan.

**Keputusan:** rencana P1–P7 ditambahkan sebagai kelanjutan roadmap di `tasks/plan.md` dan `tasks/todo.md`; checklist lama dipertahankan. MVP memakai skenario lokal salinan preset, draf titik lengkap sebelum perhitungan, persistensi dan backup JSON. Supabase lintas pengguna menjadi tahap berikutnya. Catatan bukti dikoreksi pada rencana: kedekatan ke jalan/node desa tidak membuktikan akurasi lokasi, berita keberadaan kamera tidak memverifikasi koordinatnya, dan daftar ATCS yang tidak mencantumkan Jatinangor tidak membuktikan ketiadaan layanan. Buffer tetap ilustratif; C7 baseline tidak otomatis dihitung dari marker.

**File:** `tasks/plan.md`, `tasks/todo.md`, `PROGRESS.md`.

**Verifikasi:** membaca store, repository Supabase, engine, metadata kamera dan implementasi GIS. Store belum memakai `fetchDataset` atau persistensi; engine memberi nilai bawaan pada data kosong. Semua tugas baru memiliki acceptance criteria, dependensi, sasaran file, dan langkah verifikasi. Tidak ada implementasi aplikasi pada sesi perencanaan ini.

**Open items:** tinjau rencana; implementasikan P1–P7 setelah persetujuan. Koreksi klaim berlebihan pada metadata/paper saat P1–P2, lalu tambah skenario tanpa mengganti fixture kanonik.

---

### 2026-11-23 · Sesi 32 — Hapus Tampilan 3D Three.js (Fokus Peta GIS)

**Konteks:** Pengguna menilai peta dasar nyata (GIS/OSM) lebih informatif dibanding kolom 3D Three.js, dan meminta tampilan 3D dihapus.

**Keputusan:**
1. Tampilan **3D Three.js dihapus**; pembungkus `PriorityMap3D.tsx` diganti `PriorityMapPanel.tsx` yang hanya menyediakan **GIS (Leaflet/OSM)** dan **2D Skematik (SVG)**.
2. Fungsi `projectLatLngTo3D` di `lib/map-projection.ts` dihapus (tidak terpakai lagi).
3. Dependensi `three` & `@types/three` dilepas dari `package.json` (8 paket npm dihapus).
4. `AGENTS.md` §4 & §6 diselaraskan: peta = GIS Leaflet/OSM + alternatif 2D SVG.

**File:** `07-webapp/components/map/{PriorityMapPanel.tsx (baru), PriorityMap3D.tsx (dihapus)}`, `07-webapp/app/page.tsx`, `07-webapp/lib/map-projection.ts`, `07-webapp/package.json`, `07-webapp/package-lock.json`, `AGENTS.md`, `PROGRESS.md`.

**Verifikasi:** `npm run verify` LULUS (lint + parity 75/75 + build); `test:ui`, `test:a11y`, `test:bugs`, `test:export` LULUS; grep memastikan tak ada sisa `three`/`PriorityMap3D`.

**Open items:** push branch `main`; validasi lapangan.

---

### 2026-11-23 · Sesi 31 — Rapikan Repo: Pulihkan NumberCell, Perbaiki Uji, Perkuat Paper & Instrumen Survei

**Konteks:** Lanjutan verifikasi data CCTV (Sesi 30). Pengguna meminta repo dirapikan: putuskan A5, sinkronkan dokumen stale, perbaiki test stale, perkuat paper, dan siapkan instrumen survei.

**Keputusan:**
1. **Pulihkan `NumberCell` (input angka aman).** Komponen ada tetapi **tidak dipakai** lagi; `/kriteria` memakai `<input type="number">` mentah sehingga koma salah ("6,5"→65), nilai tidak dijepit (C9 bisa 9), kosong→0, dan teks tidak valid→0 (kehilangan nilai). `NumberCell` kini dipakai di `/kriteria` (C1–C9 + biaya) dengan tambahan prop `id` agar tetap terhubung ke `<label htmlFor>`. Kontrak (draft string, koma→titik, jepit saat blur, kosong→nilai sah) kembali aktif.
2. **Perbaiki `test:bugs` & `test:export`** agar sesuai UI Next.js sekarang: pilih alternatif lewat baris tabel, target `aria-label` benar; AHP kini **slider** (bukan input angka); ekspor CSV kini **12 kolom** bernama `Hasil_DSS_CCTV_Jatinangor_<preset>.csv` (dulu 17 kolom `dss-cctv-resmi.csv`). Kedua suite LULUS.
3. **Perkuat paper hasil** (`06-paper-hasil/`): paragraf inventaris CCTV riil (ETLE 2025; 64 kamera ATCS tak menjangkau Jatinangor; CCTV APBD 2026) + **3 referensi baru** ([25]–[27]) + keterbatasan kelima (koordinat = aproksimasi OSM). `.md`↔`.tex` sinkron; **tercompile 6 halaman**, 0 overfull, 0 undefined.
4. **Instrumen survei lapangan** (`08-docs/instrumen-survei-lapangan.md`): template GPS, counting malam (C2), skor PJU (C3), POI (C8), RAB/C9, kuesioner AHP — siap pakai saat validasi lapangan (**belum dijalankan**).
5. **Sinkronkan `AGENTS.md`** §4 (status per 23 Nov), §8 (perintah uji), §9 (open items); catatan A5 di `08-docs/data-dan-sumber.md`.

**File:** `07-webapp/components/NumberCell.tsx`, `07-webapp/app/kriteria/page.tsx`, `07-webapp/scripts/{ui-bugs,ui-export}.mjs`, `06-paper-hasil/draft-paper-hasil.{md,tex,pdf,log}`, `08-docs/{instrumen-survei-lapangan.md,data-dan-sumber.md}`, `AGENTS.md`, `PROGRESS.md`.

**Verifikasi:** `npm run lint` bersih; `npm run parity` 75/75 PASS; `npm run build` sukses; `test:bugs`, `test:export`, `test:ui`, `test:a11y` semua LULUS; `build-papers.sh` 6 + 8 halaman tanpa error.

**Open items:** commit & (opsional) push; validasi lapangan memakai instrumen survei.

---

### 2026-11-20 · Sesi 30 — Data CCTV Riil Jatinangor, Verifikasi Koordinat OSM & Layer Referensi Peta

**Konteks:** Pengguna meminta data CCTV riil Jatinangor untuk memperkaya peta & aplikasi, sekaligus verifikasi koordinat titik A1–A5 terhadap peta nyata.

**Keputusan:**
1. **Inventaris CCTV riil (riset kanal resmi + media):** ETLE statis (Polres+Pemda, terpasang Nov 2025, Jl. Raya Jatinangor depan bank dekat Unpad) = satu-satunya kamera lalu lintas riil terdokumentasi; CCTV Desa Hegarmanah (Jl. Cigede, pantau sampah liar) dan CCTV APBD Pemda 2026 juga riil tetapi tanpa lokasi presisi; kampus Unpad 420 unit (internal). **Koreksi: 64 kamera ATCS Dishub semuanya di Sumedang Kota — tidak ada di Jatinangor.**
2. **Koreksi label kamera eksisting:** `CCTV-EX-02` tidak lagi disebut "ATCS" (kini "CCTV komersial Simpang Sayang"); `CCTV-EX-01` dilabeli eksplisit sebagai ETLE riil. Ditambah field `kepastian` (riil/simulasi) dan `sumber`.
3. **Perbaikan koordinat segmen** (verifikasi OpenStreetMap): A1 → simpang Jl. Sayang `-6.9335, 107.7733`; A5 → Desa Cileles `-6.9118, 107.7774`. A2/A3/A4 tidak berubah (A3 terverifikasi tepat di Jl. Hegarmanah, Δ 6 m).
4. **Batas peta (`MAP_BOUNDS`) diperluas** ke utara (`maxLat -6.9185 → -6.9080`) agar A5 tetap di dalam kanvas GIS/SVG/3D.
5. **Titik referensi riil** `referensi.riil.json` (Kampus Unpad, Gerbang ITB, Gerbang IPDN, Halte Metro Jabar Trans Unpad, Simpang Sayang) ditampilkan sebagai layer konteks di peta GIS.

**Catatan penting:** nilai **C7 tetap** (tidak diturunkan dari koordinat), sehingga angka kanonik & paritas **tidak berubah**. Koordinat berfungsi sebagai visualisasi; paper tetap mendeskripsikan peta sebagai skematik.

**File:** `07-webapp/data/{ilustratif,naskah-uts,cctv-eksisting.sim,jalan.sim,referensi.riil}.json`, `07-webapp/scripts/{generate-data,import-xlsx}.py`, `07-webapp/supabase/seed.sql`, `07-webapp/lib/map-projection.ts`, `07-webapp/components/map/PriorityMapGIS.tsx`, `08-docs/data-dan-sumber.md`, `PROGRESS.md`.

**Verifikasi:** `npm run lint` bersih; `npm run parity` 75/75 PASS (angka kanonik utuh); `npm run build` sukses.

**Open items:** validasi GPS lapangan A1–A5; kepastian lokasi `CCTV-EX-02`; sinkronkan `AGENTS.md` §4 (tabel status masih 14 Nov).

---

### 2026-11-20 · Sesi 29 — Integrasi Peta GIS Interaktif (Leaflet + OpenStreetMap) & Tri-View Switcher

**Konteks:** Menjawab kebutuhan pengguna untuk menambahkan visualisasi peta geografis riil Jatinangor yang bebas ketergantungan API key/billing Google Maps, sekaligus tetap mempertahankan visualisasi 3D Three.js dan 2D skematik SVG.

**Keputusan:**
1. **Vanilla Leaflet Imperatif (`PriorityMapGIS.tsx`) + `next/dynamic` (`ssr: false`):** Menghindari konflik *peer dependency* `react-leaflet` pada React 19 serta menjamin siklus hidup (`map.remove()`) bebas *memory leak* dengan pemisahan 4 `useEffect` (inisialisasi peta, pergantian basemap, render ulang layer vektor/marker, dan sinkronisasi kamera `panTo` saat `selectedAltId` berubah).
2. **Basemap OpenStreetMap Resmi + Mode Minimalis DSS & Fallback Offline:** Menyediakan 3 pilihan peta dasar: `OSM Minimalis (DSS)` (tile resmi `tile.openstreetmap.org` dengan filter monokrom CSS agar warna prioritas kontras dan 100% bebas watermark API key), `OSM Warna`, serta `Grid Lokal` (*inline SVG Data URI* yang juga menjadi `errorTileUrl` saat luring).
3. **4-Layer GIS Cartography & Penyelarasan Koordinat Dunia Nyata (OpenStreetMap Nominatim):**
   - Mencocokkan seluruh koordinat segmen kandidat (`A1` Gang Kos Sayang `-6.9359, 107.7735`; `A2` Ruas Jalan Cikeruh/Ciseke `-6.9340, 107.7768`; `A3` Persimpangan Jl. Hegarmanah `-6.9336, 107.7783`; `A4` Gang Cipacing/Jl. GKPN `-6.9428, 107.7622`; `A5` Ruas Jalan Cileles `-6.9212, 107.7786`), titik kamera eksisting (`CCTV-EX-01` ETLE Jl. Raya Bandung–Sumedang depan Unpad `-6.9327, 107.7779` & `CCTV-EX-02` ATCS Simpang Sayang/Jatos `-6.9335, 107.7728`), serta geometri koridor jalan (`jalan.sim.json`) ke lokasi geografis nyata di OpenStreetMap.
   - Jarak geodesik nyata (*Haversine*) antar titik terverifikasi selaras dengan nilai $C_7$ di dataset (`A3` ke `CCTV-EX-01` $\approx 109{,}4\text{ m}$ vs $C_7=110\text{ m}$; `A2` ke `CCTV-EX-01` $\approx 188{,}8\text{ m}$ vs $C_7=190\text{ m}$; `A1` ke `CCTV-EX-02` $\approx 277{,}8\text{ m}$ vs $C_7=280\text{ m}$).
   - Menampilkan lingkaran *coverage buffer* 75 m untuk titik kandidat A1–A5, lingkaran referensi 100 m putus-putus untuk CCTV eksisting, tombol cepat `Fokus Kampus` & `Koridor Penuh`, serta *custom SVG `L.divIcon`* berperingkat (`#1`–`#5`) dengan *popup* analitik TOPSIS/C9/C7/RAB/Fase.
4. **Tri-View Switcher (`PriorityMap3D.tsx`):** Menyediakan pemilih mode tampilan `GIS (OSM)` (default), `3D Kolom` (Three.js), dan `2D Skematik` (SVG), dengan kepatuhan penuh terhadap WCAG 2.1 AA (`keyboard: false` & pembersihan `tabindex` container/marker untuk menghindari `nested-interactive`).

**File:** `07-webapp/package.json`, `07-webapp/package-lock.json`, `07-webapp/app/globals.css`, `07-webapp/components/map/PriorityMapGIS.tsx`, `07-webapp/components/map/PriorityMap3D.tsx`, `07-webapp/lib/map-projection.ts`, `07-webapp/data/ilustratif.json`, `07-webapp/data/naskah-uts.json`, `07-webapp/data/cctv-eksisting.sim.json`, `07-webapp/data/jalan.sim.json`, `07-webapp/scripts/generate-data.py`, `07-webapp/scripts/import-xlsx.py`, `07-webapp/supabase/seed.sql`, `PROGRESS.md`.

**Verifikasi:**
- `cd 07-webapp && npm run verify`: `eslint` 0 error/warning, `parity.mts` 75/75 PASS, `next build` sukses.
- `npm run test:ui`: seluruh 5 layar LULUS di Chromium tanpa error konsol/jaringan; tangkapan layar terverifikasi menampilkan peta riil Jatinangor (Jl. Raya Jatinangor, Sayang, Cikeruh, Gang Ciseke, ITB/IPDN/Ikopin).
- `npm run test:a11y`: `axe-core` WCAG 2.1 A/AA mencatat **0 pelanggaran** pada desktop (1440px) dan mobile (390px).

**Open items:** opsional selaraskan preset default `07-webapp` ke `naskah_uts` jika diinginkan sebelum presentasi akhir, deploy Vercel + Supabase.

---

### 2026-11-17 · Sesi 28 — Mockup Figma Diselaraskan ke Paper (preset naskah_uts)

**Konteks:** Mockup Figma Sesi 26 memakai nama segmen dan angka karangan yang tidak cocok dengan paper.

**Keputusan:** Acuan tunggal = paper dan preset `naskah_uts` (AHP datar 8x8). Nama segmen A1-A5, Tabel III (matriks), IV (AHP 8x8), VI (D+/D-/CC), VII (fase; Fase 2 Rp 13,0 Jt), VIII (sensitivitas; reversal hanya A4/A2) dipakai di kelima frame. Layar 3 dibangun ulang dari hierarki 3 klaster menjadi matriks 8x8. Badge "100% Data Riil" diganti "Data hybrid".

**File:** file Figma `KAYBMTvny7wen9CZtxOJFO` (frame 3:3, 8:2, 9:2, 10:2, 11:2, banner 11:164); `PROGRESS.md`.

**Verifikasi:** audit teks seluruh halaman (tanpa string lama, emoji, atau desimal bertitik) dan screenshot kelima frame.

**Tindak lanjut (sesi sama):** tabel sensitivitas Layar 5 diganti 16 skenario penuh + baseline (nilai CC Tabel VIII; 2 reversal terhitung otomatis); label buatan ("Kritis", "Menengah", "Lanjutan", "Segera", "Akhir") diganti "Fase 1/2/3" dan "Peringkat n". Frame 11:2 diperpanjang menjadi tinggi 1160.

**Tambahan:** `08-docs/skrip-presentasi.md` (skrip presentasi berbasis lima layar Figma).

**Open items:** website `07-webapp/` masih default `ilustratif` (angka berbeda dari paper); ganti default ke `naskah_uts`, perbarui `AGENTS.md` §2.1, ambil ulang screenshot `08-docs/mockup/`.

---

### 2026-11-17 · Sesi 27 — Bahan Presentasi: Penjelasan Halaman/Paper dan Justifikasi Data

**Konteks:** Pengguna akan mempresentasikan progres (fokus mockup) ke dosen; butuh penjelasan fungsi halaman, isi paper, dan justifikasi data dummy vs riil.

**Keputusan:** Dua dokumen baru di `08-docs/`, semua angka dirujuk dari `data-dan-sumber.md`, `draft-paper-hasil.md`, dan `alternatif-kriteria.csv` (tanpa angka baru).

**File:** `08-docs/penjelasan-halaman-dan-paper.md`, `08-docs/justifikasi-data.md`, `PROGRESS.md`.

**Verifikasi:** angka dicocokkan manual dengan sumber di atas.

**Open items:** label segmen dan angka pada mockup Figma (Sesi 26) memakai nama ilustratif (mis. Ciseke Besar, Koridor Kulon) yang tidak sama dengan A1-A5 di paper (Gang Kos Sayang, Ruas Jalan Cikeruh, Persimpangan Hegarmanah, Gang Cipacing, Ruas Jalan Cileles); perlu diselaraskan sebelum presentasi.

---

### 2026-11-16 · Sesi 26 — Desain Mockup 5 Layar Native Figma SiPrioCCTV

**Konteks:** Merespons instruksi pengguna untuk mendesain mockup lengkap 5 layar aplikasi SiPrioCCTV Jatinangor langsung di file Figma pengguna (`https://www.figma.com/design/KAYBMTvny7wen9CZtxOJFO/Untitled?node-id=3-3&t=nXJVs1dXcvDSw3oS-4`) via Figma MCP plugin API.

**Keputusan:**
1. **Desain Native Figma (Bukan Screenshot Flat):**
   - Menggunakan Figma Plugin API (`use_figma`) dengan teks asli yang dapat diedit (*editable text*), frame bertata letak rapi, serta token palet warna kanonik (`#0B3B38` Dark Teal, `#0E6B66` Brand Teal, `#F4F6F5` Background, `#0F172A` Text, dan kode warna status ranking).
2. **5 Layar Lengkap yang Dibangun (1440 × 1080 px):**
   - **Layar 1 (Node `3:3`): 01 · Dashboard Utama** — 4 KPI metrics, visualisasi peta skematik koridor jalan Jatinangor dengan pin CCTV berkode warna, bar peringkat TOPSIS, dan 3 kartu alokasi fase anggaran.
   - **Layar 2 (Node `8:2`): 02 · Data Kriteria** — Tabel matriks keputusan 5 segmen $\times$ 8 kriteria + C9, badge status kelayakan, formulir edit aman `NumberCell`, dan transparansi sumber data lapangan.
   - **Layar 3 (Node `9:2`): 03 · Pembobotan AHP** — Metrik konsistensi Saaty ($\lambda_{\max} = 3.0183$, $CI = 0.0091$, $CR = 0.0158 < 0.10$ Valid), matriks perbandingan berpasangan klaster $3 \times 3$, kuesioner slider interaktif skala Saaty 1–9, kartu bobot global 8 kriteria, dan komparasi model hierarki vs 8×8 datar.
   - **Layar 4 (Node `10:2`): 04 · Hasil TOPSIS & Anggaran** — Tabel komprehensif TOPSIS ($D^+$, $D^-$, $CC$, peringkat 1–5), rincian alokasi bertahap multi-fase plafon Rp 15 Jt, dan panel pengaturan plafon dinamis serta filter kelayakan C9.
   - **Layar 5 (Node `11:2`): 05 · Uji Sensitivitas** — Chip pemilihan kriteria, tombol variasi bobot ($-20\%$, $0\%$, $+20\%$), visualisasi pergeseran peringkat (*rank shift indicator*) dengan peringatan pembalikan peringkat (*rank reversal* pada C1 $-20\%$), serta tabel stabilitas 16 skenario OAT (ketahanan 87.5%).
   - **Banner Proyek (Node `11:164`):** Header ringkasan proyek di atas seluruh frame artboard.
3. **Verifikasi Visual:** Mengambil tangkapan layar via `get_screenshot` dan menginspeksi seluruh 5 frame, memperbaiki penempatan teks rata-rata dan spasi badge.

**File & URL:**
- Figma File: `https://www.figma.com/design/KAYBMTvny7wen9CZtxOJFO/Untitled?node-id=0-1`
- `08-docs/mockup/README.md`
- `PROGRESS.md`

**Verifikasi:**
- `use_figma` eksekusi 100% sukses tanpa error plugin.
- Seluruh 5 artboard terverifikasi visual melalui `get_screenshot` dan curl PNG.

---

### 2026-11-16 · Sesi 25 — Peningkatan Responsivitas Penuh (Mobile Drawer + Layout Adaptif 5 Layar)

**Konteks:** Menjawab permintaan pengguna untuk membuat antarmuka aplikasi modern SiPrioCCTV (`07-webapp/`) sepenuhnya responsif di semua ukuran layar (ponsel, tablet, dan desktop), menggantikan layout flex baris kaku sebelumnya.

**Keputusan:**
1. **Navigasi Responsif & Mobile Drawer (`Sidebar.tsx` & `layout.tsx`):**
   - Di perangkat desktop (`lg:flex`): Sidebar permanen di sebelah kiri (`w-64`).
   - Di perangkat mobile (`< lg`): Menambahkan bilah navigasi atas (*top navigation bar*) dengan tombol hamburger (☰/✕), judul halaman aktif, serta *slide-out drawer overlay* dengan latar belakang gelap (*backdrop blur*) yang otomatis tertutup saat tautan ditekan.
   - Mengubah layout `<main>` menjadi adaptif `p-4 sm:p-6 lg:p-8 xl:p-10` sehingga ruang layar ponsel tidak terbuang.
2. **Responsivitas 5 Layar & Komponen:**
   - Header halaman diubah menjadi `flex-col sm:flex-row` agar tombol aksi tidak terpotong.
   - Seluruh tabel matriks keputusan, AHP, TOPSIS, dan sensitivitas diberi batas `min-w` dengan `overflow-x-auto` yang halus pada sentuhan (*touch scroll*).
   - Kanvas 3D Three.js (`PriorityMap3D.tsx`) dibuat adaptif dengan ketinggian responsif (`h-[280px] sm:h-[340px] md:h-[380px]`) dan tooltip melayang yang tidak keluar dari batas viewport ponsel.
   - Form kriteria dan alokasi anggaran beralih dari grid kaku ke `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`.
3. **Pengambilan Ulang Mockup:** Seluruh 6 tangkapan layar di `08-docs/mockup/` direkam ulang dengan tata letak responsif terbaru.

**File:**
- `07-webapp/components/Sidebar.tsx`
- `07-webapp/app/layout.tsx`
- `07-webapp/app/page.tsx`
- `07-webapp/app/kriteria/page.tsx`
- `07-webapp/app/ahp/page.tsx`
- `07-webapp/app/hasil/page.tsx`
- `07-webapp/app/sensitivitas/page.tsx`
- `07-webapp/components/map/PriorityMap3D.tsx`
- `07-webapp/components/map/MapModeToggle.tsx`
- `08-docs/mockup/` (seluruh 6 mockup PNG)
- `PROGRESS.md`

**Verifikasi:**
- `npm --prefix 07-webapp run verify` (ESLint + Paritas 75 check + Build Next.js): **LULUS (0 error)**.
- `node 07-webapp/scripts/ui-a11y.mjs`: **LULUS (0 pelanggaran serius/kritis pada desktop 1440px dan mobile 390px)**.
- `node 07-webapp/scripts/ui-check.mjs`: **LULUS (5 layar verified di Chromium)**.

### 2026-11-16 · Sesi 24 — Pembaruan Tangkapan Layar Mockup 5 Layar Aplikasi Modern (08-docs/mockup/)

**Konteks:** Memperbarui seluruh tangkapan layar mockup pada `08-docs/mockup/` yang sebelumnya masih menggunakan tampilan prototipe lama `05-aplikasi/index.html` (14 Nov), agar menampilkan antarmuka visual aplikasi modern `07-webapp/` (Next.js 16 + Three.js).

**Keputusan:**
1. **Otomatisasi Screenshot (`capture-mockups.mjs`):** Membangun skrip Node.js berbasis `playwright-core` untuk menangkap screenshot retina (deviceScaleFactor: 2) dari aplikasi Next.js produksi.
2. **Pemutakhiran Aset PNG:** Memperbarui `mockup-desktop.png` (Dashboard Desktop dengan kanvas 3D Three.js) dan `mockup-mobile.png` (Dashboard Mobile responsif).
3. **Penambahan Screenshot 4 Layar Baru:** Menangkap `mockup-kriteria.png` (Data Kriteria), `mockup-ahp.png` (Pembobotan AHP & slider kuesioner), `mockup-hasil.png` (Hasil TOPSIS & Alokasi Anggaran), dan `mockup-sensitivitas.png` (Uji Sensitivitas OAT +-20%).
4. **Pembaruan `08-docs/mockup/README.md`:** Mendokumentasikan tabel indeks 6 screenshot resolusi tinggi dan perintah reproduksi otomatis.

**File:**
- `07-webapp/scripts/capture-mockups.mjs`
- `08-docs/mockup/mockup-desktop.png`
- `08-docs/mockup/mockup-mobile.png`
- `08-docs/mockup/mockup-kriteria.png`
- `08-docs/mockup/mockup-ahp.png`
- `08-docs/mockup/mockup-hasil.png`
- `08-docs/mockup/mockup-sensitivitas.png`
- `08-docs/mockup/README.md`
- `PROGRESS.md`

**Verifikasi:**
- Seluruh 6 berkas PNG berhasil dihasilkan dengan ukuran wajar (114 KB – 441 KB) dan kualitas visual tajam.
- Push commit ke `origin/main` berhasil.

### 2026-11-16 · Sesi 23 — Penyelarasan Menyeluruh Dokumentasi Rekayasa Perangkat Lunak (08-docs/)

**Konteks:** Menyelaraskan seluruh dokumen Rekayasa Perangkat Lunak pada `08-docs/` dan membuat dokumen ringkasan teknis proyek `PROJECT_OVERVIEW.md` agar mencerminkan kondisi terkini aplikasi modern `07-webapp/` (Next.js 16 + Three.js + Supabase).

**Keputusan:**
1. **Pembuatan `PROJECT_OVERVIEW.md`:** Menyusun dokumen komprehensif latar belakang masalah permukiman mahasiswa Jatinangor, perumusan matematis lengkap (AHP hierarki vs datar, 8 kriteria benefit TOPSIS, C9 operasional, alokasi bertahap, dan uji sensitivitas OAT +-20%), arsitektur 4 lapis, serta panduan deployment ke Vercel.
2. **Pembaruan Diagram UML (`08-docs/uml.md`):** Mengganti diagram lama dengan pemodelan Mermaid modern: Use Case multi-peran (Admin vs Pakar), Arsitektur 4 Lapis, Activity alur keputusan bertahap, dan Sequence evaluasi real-time saat state berubah.
3. **Penyelarasan Indeks & Mockup (`08-docs/README.md` & `mockup/README.md`):** Memutakhirkan indeks artefak dokumentasi SE, prinsip model keputusan, tata letak 5 layar aplikasi, serta perintah reproduksi screenshot headless Chromium.
4. **Inventarisasi Data Digital (`08-docs/data-dan-sumber.md`):** Mendokumentasikan keterkaitan berkas `Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx`, `ilustratif.json`, `naskah-uts.json`, dan simulasi spasial terhadap preset aplikasi.

**File:**
- `PROJECT_OVERVIEW.md`
- `08-docs/uml.md`
- `08-docs/README.md`
- `08-docs/data-dan-sumber.md`
- `08-docs/mockup/README.md`
- `PROGRESS.md`

**Verifikasi:**
- Seluruh diagram Mermaid di `08-docs/uml.md` valid secara sintaksis dan sesuai standar penamaan.
- `npm --prefix 07-webapp run verify` dan `node 05-aplikasi/test-algoritma.mjs` tetap 100% PASS.
- Push commit ke `origin/main` berhasil.

**Open items:**
- Uji coba live deployment di Vercel oleh pengguna.

### 2026-11-16 · Sesi 22 — Implementasi penuh SiPrioCCTV (Next.js 16 + Three.js + Supabase)

**Konteks:** Menuntaskan implementasi seluruh rencana `implementation_plan.md` yang telah disetujui pengguna untuk membangun aplikasi modern SiPrioCCTV Jatinangor dengan Next.js 16, Three.js, dan Supabase.

**Keputusan:**
1. **Dua Preset Dataset:** Menyediakan Preset `ilustratif` (default aplikasi dari `Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx` dengan AHP hierarki 3 klaster × 3 kelompok stakeholder agregat rata-rata geometrik) dan Preset `naskah_uts` (AHP datar 8×8 kanonik untuk keselarasan dengan paper hasil).
2. **5 Layar Terintegrasi:** Membangun Dashboard (`/`), Data Kriteria (`/kriteria`), Pembobotan AHP (`/ahp`), Hasil & Anggaran (`/hasil`), serta Uji Sensitivitas (`/sensitivitas`) sesuai tata letak mockup `SiPrioCCTV Jatinangor.html`.
3. **Peta 3D Three.js:** Visualisasi kanvas WebGL interaktif dengan pilar ketinggian proporsional terhadap skor urgensi ($CC$), raycasting hover/klik, rotasi orbit, serta tombol fallback SVG 2D bila WebGL tidak aktif.
4. **Repositori Supabase:** Skema migrasi SQL (`20261116000000_init.sql`), data benih (`seed.sql`), kebijakan RLS, trigger audit log, dan repository TypeScript dengan mekanisme *graceful local fallback* ke data JSON statis.
5. **Kekebalan Input & Aksesibilitas:** Komponen sel angka aman (`NumberCell.tsx`), penyesuaian kontras rasio WCAG, serta pelabelan form (`htmlFor`, `aria-label`) menghasilkan **0 pelanggaran** pada audit otomatis `axe-core`.

**File:**
- `07-webapp/app/` (`page.tsx`, `kriteria/page.tsx`, `ahp/page.tsx`, `hasil/page.tsx`, `sensitivitas/page.tsx`, `layout.tsx`, `globals.css`)
- `07-webapp/components/` (`Sidebar.tsx`, `NumberCell.tsx`, `map/PriorityMap3D.tsx`, `map/PriorityMap2D.tsx`, `map/MapModeToggle.tsx`)
- `07-webapp/lib/` (`engine/`, `store.tsx`, `format.ts`, `supabase.ts`, `supabase-repository.ts`, `map-projection.ts`)
- `07-webapp/supabase/` (`migrations/20261116000000_init.sql`, `seed.sql`)
- `07-webapp/scripts/` (`import-xlsx.py`, `generate-data.py`, `parity.mts`, `ui-check.mjs`, `ui-bugs.mjs`, `ui-export.mjs`, `ui-a11y.mjs`)
- `07-webapp/` (`vercel.json`, `.env.example`, `README.md`)
- `08-docs/` (`srs.md`, `traceability.md`)
- `AGENTS.md`

**Verifikasi:**
- `npm --prefix 07-webapp run verify` (ESLint + Paritas 75 check + Next.js build): **PASS (0 error)**.
- `node 07-webapp/scripts/ui-check.mjs`: **PASS (5 layar verified di Chromium)**.
- `node 07-webapp/scripts/ui-export.mjs`: **PASS (unduhan nyata CSV tervalidasi)**.
- `node 07-webapp/scripts/ui-a11y.mjs`: **PASS (0 pelanggaran serius/kritis WCAG 2.1 AA)**.
- `node 05-aplikasi/test-algoritma.mjs`: **PASS (paritas prototipe offline tetap terjaga 100%)**.

**Open items:**
- Deploy ke Vercel dan penyambungan database Supabase aktif (bila pengguna ingin mengaktifkan instance cloud).
- Observasi lapangan aktual untuk kalibrasi koordinat GPS dan biaya riil per titik.

### 2026-11-16 · Sesi 21 — Rencana implementasi SiPrioCCTV (Next.js + Three.js + Supabase)

**Konteks:** pengguna memilih Next.js + Three.js, deploy Vercel + Supabase, UI mengikuti `SiPrioCCTV Jatinangor.html` (mockup 5 layar) dan data dari `Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx`.

**Keputusan:** belum ada perubahan kode; rencana detail disusun dan menunggu 5 keputusan pengguna (penanganan beda angka, aturan C9, peran Three.js, lingkup Supabase, lokasi build).

**Temuan:** engine xlsx (AHP hierarki 3 klaster × 3 kelompok, rata-rata geometrik) dihitung ulang dan cocok persis (C1 31,56 %; A3 0,7674; 14/16 urutan tetap), tetapi **berbeda** dari invarian `AGENTS.md` §5 (datar 8×8; A3 0,6445). Aturan C9 di mockup (C9 < 3 hanya tidak masuk Fase 1) berbeda dari implementasi lama (dikeluarkan). `AGENTS.md` §6 masih melarang Three.js.

**File:** `PROGRESS.md` (rencana ada di artefak percakapan).

**Verifikasi:** hitung ulang Python dari sheet `nilai_kriteria` + `ahp_pairwise` = sheet `hasil_ahp`/`hasil_topsis`; screenshot 5 layar mockup via Chromium.

**Open items:** jawaban 5 keputusan; lalu F0 (perbarui `AGENTS.md`) dan seterusnya.

### 2026-11-16 · Sesi 20 — Tetapkan data dummy dan opsi visualisasi

**Konteks:** pengguna memutuskan aplikasi memakai data dummy sepenuhnya karena data lapangan/kuesioner tidak tersedia, dan menanyakan kemungkinan Next.js + Three.js.

**Keputusan:** roadmap menyatakan data aplikasi `[SIMULASI]`, tanpa survei atau kuesioner sebagai prasyarat; baseline ilustratif paper dipertahankan untuk paritas, bukan diklaim sebagai bukti lapangan. Three.js kompatibel dengan Next.js tetapi opsional; peta 2D tetap jalur utama tanpa kebutuhan 3D yang jelas.

**File:** `tasks/plan.md`, `tasks/todo.md`, `PROGRESS.md`.

**Verifikasi:** keputusan dicocokkan dengan roadmap di `dss_revisi_markdown/dss_revisi.md` dan status implementasi; belum mengubah kode aplikasi atau mengulang tes.

**Open items:** selaraskan label dataset/keluaran aplikasi ke full dummy; putuskan apakah ada kebutuhan nyata untuk visual 3D.

### 2026-11-16 · Sesi 19 — Dokumentasikan roadmap implementasi aplikasi

**Konteks:** pengguna menjelaskan tugas lanjutan dari paper/model DSS: implementasi software dengan prioritas utama website berjalan, termasuk roadmap pembentukan aplikasi dan UI.

**Keputusan:** catat roadmap dengan membedakan fase yang sudah selesai dari deployment publik, persistensi Supabase, dan validasi lapangan yang masih opsional/bergantung kebutuhan. Tegaskan website dapat berjalan lokal/build, tetapi belum dideploy publik.

**File:** `tasks/plan.md`, `tasks/todo.md`, `08-docs/README.md`, `PROGRESS.md`.

**Verifikasi:** roadmap naskah kanonik (data empiris, dashboard spasial, kalibrasi bobot, pengembangan lanjutan) dicocokkan dengan SRS, README webapp, traceability, dan bukti uji pada log Sesi 17. Tautan lokal dan `git diff --check` lulus; build tidak dijalankan karena sesi ini hanya menulis dokumentasi.

**Open items:** deploy publik (jika diperlukan), keputusan kebutuhan Supabase, validasi data lapangan, dan kalibrasi bobot empiris.

### 2026-11-16 · Sesi 18 — Sinkronkan blok "Status ringkas"

**Konteks:** blok "Status ringkas" (baris 10–23) masih menyatakan paper hasil "belum dicompile" dan git "BELUM di-commit", padahal dua klaim itu sudah kedaluwarsa.

**Keputusan:** samakan klaim status dengan `AGENTS.md` §4 dan bukti di repo — paper hasil tercompile 5 halaman (Tectonic); git ter-commit. Baris "Blokir aktif" dipecah: blokir nyata = data per-gang; sisanya dipindah ke open items (opsional).

**File:** `PROGRESS.md` (blok status, baris 18–23).

**Verifikasi:** `git rev-list --count HEAD` = 50 commit; `git status --short` bersih; tidak ada nomor baru yang ditulis yang belum diperiksa (jumlah commit sengaja tidak dicantumkan agar tidak cepat basi).

**Open items:** `AGENTS.md` §4 masih menulis "16 commit s.d. sesi 15" (jumlah sebenarnya 50) — perlu ditinjau.

### 2026-11-14 · Sesi 17 — Bukti integrasi dari clone bersih

**Konteks:** verifikasi sebelumnya dilakukan di direktori kerja yang sudah berisi `node_modules` dan `.next`, sehingga belum membuktikan bahwa **repo yang di-commit** benar-benar berjalan. Diuji ulang dengan `git clone` ke direktori kosong.

**Isi clone (hanya berkas ter-track):** 92 berkas; **tanpa** `node_modules`, `.next`, `.shots`, `*.xdv`, maupun `*.log`; `99-arsip/` juga tidak ikut (ter-ignore). Jadi tidak ada artefak build yang bocor ke repo.

**Hasil di dalam clone (bukan di direktori kerja):**

| Langkah | Hasil |
|---|---|
| `bash build-papers.sh` | OK — 5 halaman & 8 halaman, 0 overfull hbox, 0 undefined |
| `node 05-aplikasi/test-algoritma.mjs` | SEMUA LULUS |
| `bash 05-aplikasi/test-ui.sh` | SEMUA LULUS |
| `npm ci` (dari `package-lock.json`) | berhasil |
| `npm run verify` (lint + parity + build) | LULUS, build 45 s |
| `parity.mts` | **71 PASS, 0 FAIL** |
| `ui-bugs.mjs` | **18 PASS, 0 FAIL** |
| `ui-check.mjs` | **23 PASS, 0 FAIL** |
| `ui-export.mjs` | **22 PASS, 0 FAIL** |
| `ui-a11y.mjs` | **0 pelanggaran** (serius/kritis maupun ringan) |

**Bukti perbaikan `.shots` bukan asumsi:** pada clone, `.shots/` **tidak ada**, lalu `ui-check.mjs` membuatnya sendiri dan menulis `ui-check.png` (130 KB). Sebelum perbaikan, langkah ini akan gagal.

**Bukti build deterministik lintas mesin:** PDF hasil build di dalam clone **byte-identik** dengan PDF di repo utama (`0f2a81b2…` untuk 04-paper, `5152a487…` untuk 06-paper-hasil). Jadi `SOURCE_DATE_EPOCH` benar-benar membuat hasil dapat direproduksi, bukan hanya stabil di satu direktori.

**Catatan:** `npm ci` memblokir postinstall `@tailwindcss/oxide` (kebijakan `allowScripts`), tetapi build tetap sukses karena paket binary per platform (`@tailwindcss/oxide-linux-x64-gnu`) sudah tersedia. Ini terverifikasi, bukan diasumsikan.

**Pembersihan:** server clone dihentikan, port 3311 dipastikan bebas, clone sementara dihapus. Repo utama tetap bersih (`git status` kosong).

### 2026-11-14 · Sesi 16 — Verifikasi paralel multi-agen + konvensi commit one-liner

**Konteks:** pengguna meminta commit penting dengan pesan conventional one-liner secara berurutan, memakai multi-agen.

**Keputusan:** commit tidak diparalelkan karena satu repo hanya punya satu index (`index.lock` akan bentrok); paralelisasi dipakai untuk **verifikasi** yang memang independen. Dua agen dijalankan serentak tanpa menyentuh git dan tanpa mengubah berkas sumber.

**Hasil agen `verify-webapp`** (dari keadaan tanpa `.next`, port 3311):
- `npm run verify`: eslint bersih, parity **71/71 PASS**, `next build` sukses (4 rute statis, TypeScript OK).
- Suite peramban: `parity` 71/71 · `ui-bugs` **18/18** · `ui-check` **23/23** · `ui-export` **22/22** · `ui-a11y` **0 pelanggaran** (4 keadaan). Semua exit 0.
- Server dimatikan lewat PID tersimpan; port 3311 dipastikan bebas.

**Hasil agen `verify-papers`**:
- `build-papers.sh`: 06-paper-hasil **5 halaman**, 04-paper **8 halaman**, **0 overfull hbox**, **0 referensi/sitasi undefined**. Hanya peringatan tipografi kosmetik (underfull box, inputenc utf8).
- `test-algoritma.mjs`: **48 PASS, 0 FAIL**, termasuk paritas λmax/CI/CR, bobot, CC, fase, C9, biaya > plafon, 16 run sensitivitas, dan paritas Tabel VIII & X.
- Pencarian angka historis (`0,6441`, `24,31`, `PRISMA 401`, `hierarki 3 kluster`, `418`, `415`) di seluruh luaran hidup: **0 hit**. Satu-satunya `401` adalah DOI `10.4018/JCIT.386165`.
- Tidak ada artefak build ter-track. **Determinisme PDF terbukti**: dua rebuild menghasilkan sha256 identik.

**Temuan yang ditindaklanjuti:**
- `git status` setelah build ulang worker **bersih**, artinya build deterministik mereproduksi PDF ter-track byte-identik.
- `07-webapp/scripts/ui-check.mjs` menulis screenshot ke `.shots/` tanpa membuat direktorinya. Sebelumnya lolos hanya karena folder itu kebetulan ada; setelah pembersihan repo, skrip akan gagal di clone baru. Diperbaiki dengan `fs.mkdirSync(".shots", { recursive: true })` dan diverifikasi pada keadaan tanpa `.shots`.

**Perubahan:**
- `07-webapp/scripts/ui-check.mjs`: buat folder `.shots` sebelum screenshot.
- `AGENTS.md` §3: konvensi commit menjadi **one-liner** `type(scope): ringkas` dan dinyatakan bahwa commit harus berurutan, bukan paralel.

**Verifikasi:** kedua agen melaporkan exit 0 tanpa kegagalan; `git status` bersih; 2 commit baru dibuat berurutan dengan pesan one-liner.

**Open items:**
- [ ] (Opsional) Push `main` ke `origin` (22+ commit lokal, belum di-push).
- [ ] (Opsional) Deploy Vercel + Supabase (butuh kredensial pengguna).

### 2026-11-14 · Sesi 15 — Merapikan repo untuk GitHub

**Konteks:** pengguna meminta folder repo dirapikan agar tampil bersih di GitHub.

**Temuan audit:**
- 93 berkas ter-track, **tidak ada artefak build** yang ikut ter-commit (bersih).
- `README.md` usang: memakai garis miring terbalik Windows (`00-brief\tugas.txt`) sehingga tidak terbaca sebagai pohon direktori di GitHub, dan masih menyatakan "belum dicompile" serta "mesin ini tanpa pdflatex" — keduanya sudah tidak benar.
- Dua gambar di `04-paper/` **tidak dirujuk siapa pun**: `gambar-taksonomi.png` dan `gambar-arsitektur.png` (versi lama sebelum gambar kanonik).
- Folder disk penuh artefak: `07-webapp/.next` (73 MB), `.shots` (1,4 MB), `__pycache__`, `.playwright-mcp`, dan `.xdv`/`.log` LaTeX.

**Perubahan:**
- `README.md` ditulis ulang: ringkasan proyek, tabel angka kanonik, struktur direktori bergaris miring depan, cara menjalankan, perintah verifikasi, dan tabel status. Semua tautan lokal diverifikasi ada.
- `.gitattributes` (baru): normalisasi EOL, penanda binari, dan `linguist-documentation` supaya statistik bahasa repo tidak menyesatkan.
- `.gitignore` diperluas: artefak LaTeX lain (`*.bbl`, `*.bcf`, `*.run.xml`), Node/Next (`node_modules/`, `.next/`, `.shots/`), berkas OS/editor, dan `.env`.
- `git rm` dua gambar mati.
- Hapus artefak disk yang dapat dibuat ulang (bukan data pengguna). Berkas pribadi `My FromFile Playlist Missing.csv` dan arsip `99-arsip/` **tidak disentuh**.

**Verifikasi:**
- Renormalisasi EOL menyentuh 6 berkas data (`*.csv`, `*.txt`, `*.svg`). Isi dipastikan **identik** setelah CR dihapus, jadi hanya akhir baris yang berubah.
- `bash build-papers.sh` → kedua paper tetap tercompile (5 dan 8 halaman, 0 overfull hbox).
- `node 05-aplikasi/test-algoritma.mjs` → semua lulus, termasuk paritas CSV yang baru dinormalisasi.
- `npm run build` di `07-webapp` dari keadaan tanpa `.next` → sukses (51 s), rute tetap statis.
- `git status` bersih; ukuran folder turun dari 547 MB menjadi 474 MB (456 MB di antaranya `node_modules`, yang tidak di-commit).

**Catatan jujur:** satu perintah pembersihan awal tidak berjalan karena `pkill -f 'next start'` mencocokkan baris perintahnya sendiri dan mematikan shell-nya; perintah diulang tanpa `pkill` dan berhasil.

**Open items:**
- [ ] (Opsional) `npm install` ulang bila `node_modules` ingin dihapus untuk menghemat ruang.
- [ ] (Opsional) Deploy Vercel + Supabase (butuh kredensial pengguna).
- [ ] (Opsional) Push branch `main` ke `origin`.

### 2026-11-14 · Sesi 14 — Audit aksesibilitas webapp (axe-core)

**Konteks:** aksesibilitas belum pernah diaudit pada `07-webapp/`. Audit dijalankan otomatis dengan axe-core pada WCAG 2.1 A/AA.

**Pelanggaran yang ditemukan dan diperbaiki:**
1. **serious — `scrollable-region-focusable`** (muncul di 390 px). Pembungkus tabel memakai `overflow-x-auto` tetapi tidak dapat dijangkau papan ketik, sehingga pengguna keyboard di layar sempit tidak bisa menggeser tabel sama sekali. Diperbaiki dengan `tabIndex={0}`, `role="region"`, dan nama aksesibel per panel.
2. **minor — `empty-table-header`**. Sel header pertama matriks AHP kosong. Diberi label "Kriteria".

**Perubahan:**
- `app/page.tsx`: panel `scroll` kini focusable dan bernama; header matriks AHP diberi teks.
- `scripts/ui-a11y.mjs` (baru): audit axe-core pada 4 keadaan (data resmi desktop, data resmi ponsel, kondisi tanpa alternatif layak, dataset simulasi); keluar dengan kode 1 bila ada pelanggaran serious/critical.
- `scripts/ui-check.mjs`: 4 pemeriksaan baru membuktikan 7 region bergulir focusable, bernama, dan dapat menerima fokus.
- `package.json` (`test:a11y`), `README.md`.

**Verifikasi:**
- `test:a11y` → **0 pelanggaran** di seluruh keadaan (sebelumnya 1 serious + 4 minor).
- `test:ui` → 22/22 LULUS. `test:bugs` → 18/18. `test:export` → 22/22. `parity` → 50+.
- `npm run verify` (lint + parity + build) → LULUS.

**Open items:**
- [ ] (Opsional) Deploy Vercel + Supabase (butuh kredensial pengguna).
- [ ] (Opsional) Muat data dari basis data, bukan statis di `lib/engine.ts`.

### 2026-11-14 · Sesi 13 — Hardening lanjutan webapp (empty state, peta, ekspor CSV)

**Konteks:** setelah sesi 12, dilakukan audit untuk mencari celah yang belum tertangani pada `07-webapp/`. Audit menemukan dua bug nyata dan satu fitur yang belum pernah diuji.

**Bug yang diperbaiki (dibuktikan RED sebelum GREEN):**
1. **Tabel alokasi fase tanpa empty state.** Bila semua alternatif tidak layak atau biayanya melebihi plafon, tabel hanya menampilkan header tanpa baris sehingga tampak rusak. Sekarang muncul pesan penjelas disertai rincian pengecualian. Tes B11 dibuktikan **GAGAL** lebih dulu.
2. **Label kode 3 karakter meluap keluar titik peta.** Kode D10/D11/D12 memakai ukuran font yang sama dengan A1–A5 sehingga tidak terbaca. Ukuran font kini dibatasi agar muat di dalam lingkaran. Diverifikasi lewat render ulang peta 12 node.

**Fitur yang akhirnya tercakup tes:**
- **Ekspor CSV** sebelumnya tidak pernah diverifikasi otomatis. `scripts/ui-export.mjs` menekan tombol unduh di peramban sungguhan, menyimpan berkasnya, lalu memeriksa nama berkas, header 17 kolom, CC kanonik (A3 0,644530; A5 0,182026), kedua dataset (5 dan 12 baris), serta ekspor yang mengikuti hasil edit C9. Hasilnya **ekspor sudah benar** (22/22 LULUS) dan kini terlindungi regresi.

**Perubahan:**
- `app/page.tsx`: empty state tabel fase, batas ukuran font label peta, `allocatedPhaseCount`.
- `lib/engine.ts`: buang ekspor `DATASET_KEYS` yang tidak terpakai.
- `scripts/ui-bugs.mjs`: tambah tes B11/B12 (empty state).
- `scripts/ui-export.mjs` (baru), `package.json` (`test:export`), `README.md`.

**Verifikasi:**
- `ui-bugs` → 18/18 LULUS. `ui-check` → 18/18 LULUS tanpa error konsol. `ui-export` → 22/22 LULUS. `parity` → 50+ LULUS.
- `npm run verify` (lint + parity + build) → LULUS.
- Pemeriksaan visual: peta 12 node (D10–D12 terbaca), empty state alokasi, tampilan 1440 px.

**Open items:**
- [ ] (Opsional) Deploy Vercel + Supabase.
- [ ] (Opsional) Muat data dari basis data, bukan statis di `lib/engine.ts`.
- [ ] (Opsional) Audit aksesibilitas otomatis (axe) — belum ada.

### 2026-11-14 · Sesi 12 — Perbaikan bug webapp Next.js

**Konteks:** fokus dipertajam ke `07-webapp/` saja, dengan prioritas memperbaiki bug pada website.

**Bug yang ditemukan dan diperbaiki (dibuktikan RED sebelum GREEN):**
1. **Input angka merusak pengetikan.** Sel dikendalikan langsung oleh state numerik, sehingga `Number("")` menjadi `0` saat sel dikosongkan; React mengisi ulang `"0"` dan karakter berikutnya menempel. Hasil: `"7.5"` → `"75"`, `"1250"` → `"01250"`, AHP `"2.5"` → `"0.0525"`. Diperbaiki lewat `components/NumberCell.tsx` (draft string selama fokus, commit numerik live, jepit dan format saat blur).
2. **Nilai di luar rentang diterima apa adanya.** C9 bisa bernilai 9 padahal skala 1–5, biaya bisa negatif, AHP tanpa batas atas. Sekarang dijepit: C9 1..5, biaya ≥ 0, AHP 1/9..9 (skala Saaty).
3. **Format angka tidak deterministik.** `toLocaleString("id-ID")` bergantung data ICU runtime; server dan klien bisa berbeda dan memicu hydration mismatch. Diganti formatter manual (titik ribuan, koma desimal).
4. **Script `lint` rusak.** `next lint` sudah dihapus di Next 16 sehingga gagal dengan "Invalid project directory". Diganti `eslint .` + `eslint.config.mjs` (flat config `eslint-config-next`).
5. **Kunci dataset tanpa guard.** Nilai `<select>` bertipe string bebas; kunci tak dikenal membuat `DATASETS[k]` undefined dan aplikasi melempar error. Ditambahkan `getDataset()`.
6. Import mati (`allocPhases`, `feasibleFlags`, `topsis`) dibuang; `type: module` menghilangkan peringatan `MODULE_TYPELESS_PACKAGE_JSON`.

**Perubahan:**
- `07-webapp/components/NumberCell.tsx` (baru), `eslint.config.mjs` (baru), `scripts/ui-bugs.mjs` (baru).
- `app/page.tsx`, `lib/engine.ts`, `lib/format.ts`, `scripts/parity.mts`, `package.json`, `README.md`.
- Skrip baru: `test:bugs`, `test:ui`, `verify` (lint + parity + build).

**Verifikasi:**
- `scripts/ui-bugs.mjs` → **16/16 LULUS**. Dijalankan lebih dulu pada implementasi lama dan **9 pemeriksaan GAGAL** dengan pola `"07.5"`, `"01250"`, `"0.0525"` — bukti akar masalahnya benar.
- `scripts/parity.mts` → **50+ pemeriksaan LULUS**: angka kanonik, 11 pemeriksaan format deterministik, 12 pemeriksaan parser (`7.5`, `6,5`, `7.`, `1e5` ditolak, dll.).
- `scripts/ui-check.mjs` → **18/18 LULUS** tanpa error konsol.
- `npm run verify` (lint + parity + build) → LULUS; `/` dan `/icon.svg` tetap statis (prerender).
- Tanpa overflow horizontal pada 390/768/1440 px; screenshot 1440 px diperiksa: kolom C9 terisi (4,5,4,3,4), AHP 8×8 konsisten, angka kanonik utuh.

**Open items:**
- [ ] (Opsional) Deploy Vercel + Supabase.
- [ ] (Opsional) Muat data dari basis data, bukan statis di `lib/engine.ts`.

### 2026-11-14 · Sesi 11 — Migrasi Next.js: paritas angka dan uji interaksi

**Konteks:** fase 6 rencana (migrasi `07-webapp/` ke Next.js + TypeScript + Tailwind) dieksekusi dan diverifikasi, bukan hanya dievaluasi.

**Keputusan:**
- Stack: **Next.js 16.4.6 (App Router) + React 19 + TypeScript 5.9 + Tailwind 4**, semua versi dikunci di `package.json`.
- `lib/engine.ts` dibuat **mandiri tanpa impor internal**, sehingga Next.js dan `node scripts/parity.mts` memakai kode yang sama persis tanpa langkah build perantara.
- Aplikasi tetap 100% sisi klien; halaman di-prerender statis. Tidak ada backend maupun panggilan jaringan.
- `A0` **tidak** diubah menjadi `1/3` tepat: `0,33` adalah nilai yang mereproduksi λmax 8,1031. Memakai `1/3` menggeser λmax ke 8,1067 dan memutus paritas.

**Bug nyata yang ditemukan dan diperbaiki selama verifikasi:**
1. `</td>` salah tempat di tabel AHP → build gagal; diperbaiki menjadi `</Td>`.
2. `.cell { width:100% }` di dalam sel tabel auto-layout membuat kolom **C9 kolaps** sehingga nilainya tidak terlihat. Diperbaiki dengan `min-width: 58px`. Karena Turbopack memakai cache CSS, perbaikan baru berlaku setelah `rm -rf .next`.
3. **Overflow horizontal pada 390 px**: anak grid default `min-width:auto` sehingga tabel lebar mendorong panel melebihi viewport. Diperbaiki dengan `min-w-0` pada section/panel/grid. Diverifikasi tidak overflow pada 390/768/1440 px.
4. `/favicon.ico` 404 memunculkan error konsol; ditambahkan `app/icon.svg`.
5. Glyph `D⁺`/`D⁻` tidak tersedia di font; diganti markup `<sup>`.

**Perubahan:**
- `07-webapp/`: `app/{layout,page,globals.css,icon.svg}`, `lib/{engine,format}`, `scripts/{parity.mts,ui-check.mjs}`, konfigurasi Next/Tailwind/TS, `README.md`, `.gitignore`.
- `AGENTS.md`: status migrasi, peta file, perintah verifikasi, open items.

**Verifikasi:**
- `npm run build` → sukses; rute `/` dan `/icon.svg` **statis (prerender)**, tanpa error TypeScript.
- `node scripts/parity.mts` → **SEMUA LULUS**. Termasuk λmax 8,1031; CI 0,0147; CR 0,0104; delapan bobot; CC A3 0,6445 > A1 0,5774 > A4 0,4995 > A2 0,4638 > A5 0,1820; fase [1,2,1,2,3]; subtotal 14,0/13,0/5,5; C9=1 → A1 `null`; biaya 15,1 → A5 `null`; sensitivitas 16 run dengan 2 pembalikan (C1 −20%, C2 +20%); A3 & A1 selalu dua teratas.
- `node scripts/ui-check.mjs` terhadap server produksi → **18/18 LULUS, tanpa error konsol**: KPI 0,0104 & 5/5 & A3; edit C9→1 menurunkan KPI ke 4/5 dan menandai A1 tidak dialokasikan; biaya 15,1 memunculkan "Biaya > plafon"; fokus input bertahan saat mengetik; reset memulihkan 4 dan 5.5; dataset simulasi 12 alternatif dengan label SIMULASI.
- Screenshot produksi 1440 px dan 390 px diperiksa secara visual; angka kanonik terbaca di layar.

**Open items:**
- [ ] (Opsional) Deploy Vercel + Supabase.
- [ ] (Opsional) Konfigurasi ESLint (`npm run lint` belum aktif).
- [ ] (Opsional) Perluas pembahasan paper hasil bila venue menuntut 6–8 halaman.
- [ ] (Opsional) Validasi lapangan C1–C9, RAB, GPS CCTV, dan *counting* malam.

### 2026-11-14 · Sesi 10 — Compile nyata kedua paper, figur arsitektur kanonik, audit visual

**Konteks:** rencana lanjutan dieksekusi penuh: freeze baseline, finalisasi paper, review visual, acceptance test, dan persiapan commit.

**Keputusan:**
- Compile kini **benar-benar dilakukan** memakai Tectonic 0.15.0 (binary tunggal, mengunduh paket sesuai kebutuhan). Tidak perlu lagi bergantung pada Overleaf atau login cloud.
- Gambar arsitektur memakai **satu sumber TikZ** (`assets/diagram/arsitektur-4-lapis-kanonik.tex`) dan dimuat sebagai vektor `\input` oleh kedua paper. PNG hanya menjadi turunan opsional.
- Ambang C9 tetap dinyatakan sebagai kebijakan implementasi, tetapi kalimat yang menyebut nama file internal (`dss_revisi.md`) diganti frasa akademik "model konseptual".

**Temuan penting (tidak terlihat oleh pemeriksaan statis sebelumnya):**
1. `06-paper-hasil/draft-paper-hasil.tex` **gagal compile**: memakai kolom `P{...}` pada 4 tabel tanpa memuat `array` dan tanpa `\newcolumntype{P}`. Diperbaiki dengan menambahkan keduanya.
2. Kedua paper memuat **PNG arsitektur usang** (identik byte, 3870×1830) yang masih berlabel "Struktur hierarki 3 kluster (10 pasang)". Ini bertentangan dengan Tabel IV dan narasi 8×8 di paper yang sama. Diganti figur TikZ berisi "8×8 (28 perbandingan unik)".
3. `06-paper-hasil/img/aplikasi-screenshot.png` **usang**: hanya 4 KPI dan legenda lama. Diregenerasi dari UI terbaru (5 KPI termasuk "Layak 5/5", legenda ambang operasional).
4. `04-paper/diagram/README.md` sebelumnya menyatakan PNG lama sebagai "luaran final" — menyesatkan. Ditulis ulang.

**Perubahan:**
- `assets/diagram/arsitektur-4-lapis-kanonik.tex` (baru), `assets/diagram/build-arsitektur-png.sh` (baru).
- `build-papers.sh` (baru): compile kedua paper dengan `SOURCE_DATE_EPOCH` agar PDF **deterministik** (dua run bit-identik, `git status` tetap bersih setelah rebuild).
- `06-paper-hasil/draft-paper-hasil.tex`: `array` + `\newcolumntype{P}`, `tikz`, `\cost`, figur jadi `figure*` vektor, kalimat C9 diperbaiki.
- `04-paper/draft-paper.tex`: figur arsitektur memakai `\input` sumber TikZ.
- `06-paper-hasil/draft-paper-hasil.md` dan `04-paper/gambar-3-arsitektur.png`, `06-paper-hasil/img/*.png`: disinkronkan.
- `04-paper/diagram/README.md`, `AGENTS.md`, `.gitignore` (`*.xdv`).

**Verifikasi:**
- `tectonic -X compile` 06-paper-hasil → **exit 0, 5 halaman, 0 overfull hbox**, tanpa ref/sitasi undefined.
- `tectonic -X compile` 04-paper → **exit 0, 8 halaman, 0 overfull hbox**, tanpa ref/sitasi undefined.
- `bash build-papers.sh` dijalankan dua kali → hash PDF **identik** (deterministik).
- Keterisian halaman: 06 → p1–p4 91,9%, p5 85,6% (sebelumnya p5 hanya ~40%). 04 → semua ≥83%.
- Review visual seluruh halaman via render 130–200 dpi: tabel, persamaan, dua kolom, dan ketiga gambar tampil benar; angka kanonik terbaca (CR 0,0104; C1 23,95%; A3 0,6445).
- `bash assets/diagram/build-arsitektur-png.sh` → PNG 2788×1283 @400 dpi untuk kedua paper; skrip terbukti reproducible.
- `rg 'hierarki 3 kluster|10 pasang|0,6441|24,31'` pada paper dan aplikasi → **BERSIH**.
- `node 05-aplikasi/test-algoritma.mjs` dan `bash 05-aplikasi/test-ui.sh` → semua PASS.

**Catatan jujur:** paper hasil 5 halaman (target internal 6–8). Halaman terakhir kini 86% terisi, jadi tidak ada pemborosan ruang; menambah 1–2 halaman berarti menambah pembahasan substantif, bukan memperbaiki format.

**Open items:**
- [ ] Migrasi Next.js (`07-webapp/`).
- [ ] (Opsional) Perluas pembahasan paper hasil bila venue menuntut 6–8 halaman.
- [ ] (Opsional) Validasi lapangan C1–C9, RAB, GPS CCTV, dan *counting* malam.

### 2026-11-14 · Sesi 9 — Paket dokumentasi SE dan pengamanan plafon alokasi

**Konteks:** setelah penyelarasan `dss_revisi.md`, pekerjaan dilanjutkan ke artefak dokumentasi SE dan audit perilaku alokasi saat pengguna mengubah biaya.

**Keputusan:** SRS, traceability, UML, dan mockup dibuat dari implementasi aktual dengan `dss_revisi.md` tetap sebagai sumber tunggal model/angka. Audit menemukan bahwa biaya satu titik yang melebihi plafon dapat ditempatkan sendiri pada fase baru. Perilaku ini bertentangan dengan batas plafon, sehingga alternatif tersebut sekarang tidak dialokasikan, diberi penanda pada TOPSIS, peta, dan tabel fase. Perbaikan tidak mengubah hasil resmi karena seluruh biaya resmi berada di bawah Rp 15 juta.

**Perubahan:**
- `08-docs/README.md`, `srs.md`, `traceability.md`, `uml.md`: indeks dokumentasi, FR/NFR, acceptance criteria, keterlacakan ke kode/test aktual, serta diagram use case/activity/sequence Mermaid.
- `08-docs/mockup/`: screenshot desktop 1440×2200 dan mobile 430×1600 yang diekspor dari aplikasi aktual, disertai README reproduksi dan batas penggunaan data hybrid.
- `05-aplikasi/index.html`: `allocPhases` mengecualikan biaya per titik > plafon; renderer TOPSIS, peta, dan fase menampilkan status tersebut.
- `05-aplikasi/test-algoritma.mjs` dan `test-ui.sh`: regresi otomatis untuk biaya Rp 15,1 juta, termasuk penanda tabel fase/peta.
- `05-aplikasi/README.md`: mendokumentasikan aturan biaya di atas plafon.

**Verifikasi:**
- Siklus TDD: test biaya > plafon ditambahkan terlebih dahulu dan gagal pada implementasi lama (A5 tetap Fase 3), lalu lulus setelah perbaikan.
- `node 05-aplikasi/test-algoritma.mjs` → semua PASS, termasuk angka resmi, C9, biaya > plafon, CSV, sensitivitas, dan dataset perluasan.
- `bash 05-aplikasi/test-ui.sh` → semua PASS, termasuk fokus edit, C9, serta status biaya > plafon pada fase dan peta.
- Tautan lokal di lima dokumen SE tervalidasi; `uml.md` berisi tepat tiga blok Mermaid. Parser Mermaid lokal tidak tersedia, sehingga validasi render penuh belum dilakukan.
- Mockup terverifikasi sebagai PNG desktop/mobile; `dss_revisi.md` tetap tidak diubah (mtime 2026-11-12 01:03:38 +0700).

**Open items:**
- [ ] Compile `04-paper/draft-paper.tex` dan `06-paper-hasil/draft-paper-hasil.tex` di Overleaf.
- [ ] Migrasi Next.js (`07-webapp/`).
- [ ] Commit semua pekerjaan.
- [ ] (Opsional) Validasi lapangan C1–C9, RAB, GPS CCTV, dan *counting* malam.

### 2026-11-14 · Sesi 8 — Validasi figur kanonik dan operasionalisasi C9

**Konteks:** validasi lanjutan atas tafsir `dss_revisi.md`, khususnya peran C9 dan perbedaan antara teks rinci, Tabel VII, serta Gambar 3.

**Keputusan:** teks rinci Seksi IV-B diprioritaskan atas label diagram yang bersifat generik: C1–C8 tetap menjadi matriks urgensi TOPSIS dan C9/RAB menjadi kendala alokasi. Pemeriksaan `assets/tabel_6_7.png` menegaskan C9 sebagai kelayakan teknis berskala 1–5, tetapi tidak menetapkan ambang angka. Karena itu, C9 ≥ 3 dipertahankan sebagai **ambang kelayakan operasional** untuk implementasi, bukan dinyatakan sebagai aturan numerik verbatim dari `dss_revisi.md`. Label “AHP: bobot C1–C9” pada `assets/gambar_3_model.png` dicatat sebagai abstraksi diagram yang tidak dapat menggantikan teks rinci maupun hasil AHP 8×8 terkunci.

**Perubahan:**
- `AGENTS.md`: menambahkan keputusan rekonsiliasi C9, bukti Tabel VII/Gambar 3, dan batas klaim ambang C9.
- `05-aplikasi/index.html` dan `05-aplikasi/README.md`: semua label filter diperjelas menjadi “ambang operasional”.
- `06-paper-hasil/draft-paper-hasil.md/.tex` dan `04-paper/draft-paper.md/.tex`: menjelaskan C9 ≥ 3 sebagai kebijakan implementasi terdokumentasi, bukan angka eksplisit naskah kanonik; label tabel C9 pada versi Markdown paper hasil juga disamakan menjadi “filter operasional”.

**Verifikasi:**
- Inspeksi figur kanonik: Tabel VII menyatakan C1–C8 berorientasi *benefit* terhadap urgensi dan C9 atribut kelayakan teknis skala 1–5; Gambar 3 tidak menyebut hierarki atau matriks 8×8 dan hanya memakai label AHP C1–C9 yang generik.
- `node 05-aplikasi/test-algoritma.mjs` → semua PASS, termasuk paritas angka resmi, filter C9, CSV, dan tabel sensitivitas dua paper.
- `bash 05-aplikasi/test-ui.sh` → semua PASS, termasuk fokus edit, perubahan KPI 5/5→4/5 saat C9=1, pengecualian fase, badge, dan peta.
- Struktur LaTeX setelah perubahan diperiksa kembali (braces seimbang); kompilasi nyata tetap belum tersedia di mesin ini.

**Open items:**
- [ ] Compile `04-paper/draft-paper.tex` dan `06-paper-hasil/draft-paper-hasil.tex` di Overleaf.
- [ ] Mockup aplikasi + dokumentasi SE (SRS, use case, UML).
- [ ] Migrasi Next.js (`07-webapp/`).
- [ ] Commit semua pekerjaan.

### 2026-11-14 · Sesi 7 — Selaraskan semua luaran ke `dss_revisi.md` (single source of truth)

**Konteks:** user menetapkan `dss_revisi_markdown/dss_revisi.md` sebagai satu-satunya sumber kebenaran; artefak lain mengikuti best practice.

**Keputusan:**
- Model numerik kanonik = **AHP datar 8×8**, bukan hierarki 3 kluster. Hanya matriks 8×8 yang mereproduksi λmax 8,1031; n=8; RI=1,41; C1 23,95%; CC A3 0,6445. Narasi hierarki di `dss_revisi.md` adalah kontradiksi internal; angka hierarki (C1 24,31%; A3 0,6441; PRISMA 401/181) ditandai historis.
- PRISMA kanonik = 582 → 166 (pre-2021) → 416 → 295 (2 non-Inggris, 233 non-artikel, 60 tak terakses) → 121 → 109 → 12.
- Populasi: BPS 2024 >98.000 jiwa (utama, sesuai `dss_revisi`); E-Office 91.469 (pembanding).
- Sensitivitas: A3/A1 stabil; rank reversal A4/A2 **2/16** (C1 −20%, C2 +20%).

**Perubahan:**
- `05-aplikasi/index.html`: fokus input tidak hilang (render hasil saja), filter C9 < 3 (tidak dialokasikan), KPI layak, badge/legenda/peta/CSV.
- `05-aplikasi/test-algoritma.mjs`: mengekstrak `<script>` dari `index.html` dan menjalankannya di Node `vm`; cek paritas CSV; uji filter C9; cek paritas Tabel VIII paper ↔ engine.
- `05-aplikasi/test-ui.sh`: smoke test Chromium untuk fokus input + filter C9.
- `05-aplikasi/README.md`: dokumentasi perilaku baru.
- `06-paper-hasil/*.md/.tex`: BPS >98.000 + E-Office 91.469; klaim verifikasi diperbarui; 24 referensi disamakan urutannya dengan md; tambah bps/tricco/harapanrakyat.
- `08-docs/data-dan-sumber.md`: BPS + E-Office; catatan sumber kebenaran.
- `AGENTS.md`: §2.1 sumber kebenaran tunggal; status & perintah verifikasi.
- `README.md`, `CONTEXT.md`: penunjuk status/sumber kebenaran.
- `04-paper/draft-paper.tex`: AHP 8×8, sensitivitas 2/16, path gambar diperbaiki (PRISMA kanonik).
- `04-paper/draft-paper.md`: diselaraskan penuh ke model kanonik (AHP 8×8, PRISMA 416, CC 0,6445, sensitivitas 2/16); gambar PRISMA menunjuk aset kanonik.
- `04-paper/catatan-perubahan-dan-perbaikan.md`, `03-sintesis/pilot_ahp_topsis.py`, `03-sintesis/tahap-3-model.md/.tex`, `03-sintesis/tahap-4-pilot-dummy-numerik.md`, `04-paper/diagram/README.md`: banner status historis.

**Verifikasi:**
- `node 05-aplikasi/test-algoritma.mjs` → semua PASS (engine aktual + paritas CSV + paritas Tabel VIII 06 + Tabel X 04).
- `bash 05-aplikasi/test-ui.sh` → semua PASS (fokus bertahan, C9 filter terlihat).
- Chromium headless: fokus bertahan (`activeAfter=INPUT`), KPI 5/5 → 4/5 saat C9 A1=1, fase mengecualikan A1; render awal CR 0,0104 & prioritas A3.
- `04-paper/draft-paper.tex`: 18 cite/18 bib, braces 775/775, 36/36 environment; `06-paper-hasil/draft-paper-hasil.tex`: 24/24, braces 440/440, 30/30.
- `python3 -m py_compile 03-sintesis/pilot_ahp_topsis.py 04-paper/diagram/generate_drawio.py` OK.
- Static compile-readiness `04-paper/draft-paper.tex` + `06-paper-hasil/draft-paper-hasil.tex`: tidak ada environment mismatch, semua `\ref` punya `\label`, gambar ada, sitasi lengkap. Compile nyata belum bisa: tidak ada engine LaTeX di mesin ini dan compile remote Jcode butuh login.
- Validasi tafsir kanonik: (a) model hierarki pilot → C1 24,31%, A3 0,6441; model datar 8×8 → C1 23,95%, A3 0,6445, λmax 8,1031, CI 0,0147, CR 0,0104 (persis `dss_revisi`) → 8×8 adalah satu-satunya model yang mereproduksi angka kanonik; (b) ambang C9 ≥ 3 konsisten di pilot, tahap-4, 04 md, 06 md, dan app, meski `dss_revisi` hanya menyebut "kendala kelayakan"; (c) rank reversal per skenario: 2/16 (C1 −20%, C2 +20%), hanya A4↔A2, 0 skenario membalik A3/A1; (d) `dss_revisi.md` mtime 2026-11-12 01:03, tidak diubah.

**Open items:**
- [ ] Compile `04-paper/draft-paper.tex` dan `06-paper-hasil/draft-paper-hasil.tex` di Overleaf.
- [ ] Mockup aplikasi + dokumentasi SE (SRS, use case, UML).
- [ ] Migrasi Next.js (`07-webapp/`).
- [ ] Commit semua pekerjaan.

### 2026-11-14 · Sesi 6 — Audit/pelajari codebase (tanpa ubah kode)

**Konteks:** user minta "pelajari code base ini". Pembacaan menyeluruh + verifikasi runtime (Node & Chromium headless).

**Temuan utama:**
- Arsitektur: app 1 file `05-aplikasi/index.html` (AHP, TOPSIS, alokasi fase, sensitivitas, peta SVG), test mirror `test-algoritma.mjs`, paper `06-paper-hasil`, data kanonik `08-docs`.
- **Dua generasi model beredar:** (a) **final/terkunci** = AHP datar 8×8 (`dss_revisi.md`, app, `06-paper-hasil`, `04-paper/*.tex`) → CR 0,0104; A3 0,6445; (b) **hierarki 3 kluster** (`03-sintesis/pilot_ahp_topsis.py`, `04-paper/draft-paper.md`) → C1 24,31%; A3 0,6441. Jangan campur angka keduanya.
- `04-paper/draft-paper.md` vs `.tex` tidak sinkron: PRISMA 401/181 vs 416; AHP hierarki vs datar; CC 0,6441 vs 0,6445. `.tex` juga campur: Seksi III masih menjelaskan hierarki 10 perbandingan, tetapi hasil numerik memakai 8×8.
- **Bug UX (terverifikasi headless Chromium):** setiap event `input` memicu `render()` yang menimpa `innerHTML` tabel; `document.activeElement` menjadi BODY. Mengetik nilai multi-digit di sel matriks praktis tidak bisa (fokus hilang tiap karakter).
- **C9 tidak difilter:** UI (ambang ≥ 3) dan paper menyebut C9 sebagai filter, tetapi kode hanya menyimpan/menampilkan/mengekspor C9. Semua C9 ≥ 3 sehingga angka tidak berubah, tetapi perilaku terdokumentasi belum diimplementasikan.
- `test-algoritma.mjs` adalah *mirror* logika, bukan mengeksekusi `index.html`; CSV `05-aplikasi/data/*.csv` juga tidak dibaca app (data diduplikasi inline). Risiko drift.
- File nyasar `My FromFile Playlist Missing.csv` (playlist pribadi) di root repo.

**Verifikasi:** `node 05-aplikasi/test-algoritma.mjs` semua PASS; 16 baris Tabel VIII paper = output kode (toleransi 5e-4); `.tex` braces 428/428, `\begin`/`\end` 30/30, 3 gambar; render awal Chromium: CR 0,0104, prioritas A3, 5 node peta.

**File diubah:** `PROGRESS.md` (entri ini) — tidak ada perubahan kode.

**Open items:**
- [ ] Perbaiki fokus input (render parsial atau restore fokus).
- [ ] Implementasikan filter C9 atau koreksi klaim UI/paper.
- [ ] Satukan sumber data (CSV/JS) atau buat test yang mengeksekusi script `index.html`.
- [ ] Selaraskan `04-paper` md/tex (atau tandai superseded).
- [ ] Hapus/ignore file playlist nyasar; commit pekerjaan yang tertunda.

### 2026-11-14 · Sesi 5 — Buat `AGENTS.md` (panduan agen + status)

**Konteks:** user minta file "agents md" untuk melacak progres/konteks.

**Keputusan:** buat `AGENTS.md` di root sebagai **titik masuk agen** (konteks, aturan kerja, invarian angka, keputusan teknologi, peta file, perintah verifikasi, open items). Peran dibagi: `AGENTS.md` = instruksi & status ringkas; `PROGRESS.md` = log kronologis.

**File dibuat:** `AGENTS.md`.

**Isi kunci yang dikunci di sana:** angka resmi 5 segmen (CR 0,0104; A3 0,6445 dst.), `perluasan`/12 desa = simulasi, larangan kutip `99-arsip`, keputusan stack (Next.js + TS + Tailwind + Vercel + Supabase nanti; mockup via kode; SVG bukan Three.js), dan 6 open items.

**Verifikasi:** file terbaca sebagai instruksi sesi (system-reminder) — path & isi valid.

**Open items:** sama seperti Daftar di `AGENTS.md` §9 (mockup, dokumentasi SE, migrasi Next.js, compile .tex, commit).

### 2026-11-13 · Sesi 4 — Engine data-driven (jumlah segmen bukan hardcode)

**Konteks:** user menanyakan "kenapa hanya 5 segmen?". Dijawab: 5 = pilihan proposal (representatif), bukan batasan model. User minta rekomendasi → dipilih skema **"5 resmi + engine data-driven"**.

**Implementasi (`05-aplikasi/index.html`):**
- Data diubah jadi `DATASETS`: **`resmi`** (5 segmen, angka identik proposal) dan **`perluasan`** (12 desa, SIMULASI).
- Fungsi `loadDataset()` + pemilih dataset di toolbar; KPI "Alternatif Segmen" kini dinamis; tombol reset menyetel ulang dataset aktif.
- `renderMap`: tata letak otomatis untuk dataset tanpa posisi tetap; label mengecil bila segmen banyak.
- Angka resmi 5 segmen **tidak berubah** (diverifikasi: 0,6445 dst masih muncul; test lulus).

**Sinkronisasi dokumen:**
- Paper `06-paper-hasil` (.md & .tex): bagian Arsitektur Perangkat Lunak & Keterbatasan diperbarui (engine data-driven; skenario perluasan 12 segmen sebagai demo skalabilitas, hasil tetap 5 segmen).
- `05-aplikasi/README.md` & `08-docs/data-dan-sumber.md` diperbarui.

**Verifikasi:** JS OK; shim render kedua dataset tanpa error; headless Chromium default = angka lama; `node 05-aplikasi/test-algoritma.mjs` **semua PASS**.

**Open items:**
- [ ] Mockup aplikasi (wireframe → PNG).
- [ ] Commit semua.
- [ ] (Nanti) port ke Next.js: engine tetap data-driven.

### 2026-11-13 · Sesi 3 — Pencarian ulang data CCTV + dokumen data & sumber

**Konteks masuk:** User minta konfirmasi ulang "benarkah tidak ada data CCTV?"; jika tidak ada, lanjut dummy.

**Hasil pencarian ulang: TERNyata ADA data CCTV riil** (level kabupaten & kampus):
- **ATCS Dishub Kab. Sumedang: 64 kamera (23 PTZ + 41 Fix)** — Sulastri dkk. 2024, JRPA Unsap (akademik, bisa disitasi).
- Platform resmi CCTV lalu lintas Sumedang: **43 CCTV** streaming (lebaran.sumedangkab.go.id/cctv).
- ATCS dipasang di **15 titik** kawasan perkotaan (Bupati).
- **Kamera ETLE di depan Unpad Jatinangor** (Polres Sumedang) — CCTV riil spesifik Jatinangor (level koridor).
- **Smart Pole Sumedang** (pertama di Indonesia): CCTV + drone → Command Center + 112.
- **CCTV kampus Unpad Jatinangor: 420 unit** + platform cctv.unpad.net.

**Yang tetap TIDAK ada:** data CCTV **permukiman per-desa/gang** Jatinangor → pakai **dummy** untuk matriks per-segmen.

**File dibuat:** `08-docs/data-dan-sumber.md` — konsolidasi: metode pencarian · data riil (demografi, kriminalitas, kos, PJU) · **data CCTV riil** · **dataset CCTV dummy per segmen** · peta ke C1–C9 · gap · 15 sumber.

**Catatan:** `08-docs/data-dan-sumber.md` adalah versi lengkap/kanonik; `05-aplikasi/data-lapangan-riil.md` diberi pointer ke sana.

**Open items:**
- [ ] Mockup aplikasi (wireframe → PNG) — objektif user berikutnya.
- [ ] (Opsional) Perluas dataset dummy CCTV ke 12 desa.
- [ ] Commit `08-docs/`, `05-aplikasi/`, `06-paper-hasil/`, `PROGRESS.md`.

### 2026-11-12 · Sesi 2b — Data riil & visualisasi peta prioritas

**Konteks masuk:** User menanyakan (a) data riil apa saja yang sudah didapat, dan (b) apakah website bisa divisualisasikan, mis. dengan Three.js.

**Jawaban data riil** (rekap; detail di `05-aplikasi/data-lapangan-riil.md`): demografi 12 desa (total 91.469 jiwa), kriminalitas Jatinangor 11→155 (2022→2023), kos Hegarmanah 4.250 kamar, bukti PJU Cileles minim. **Yang BUKAN riil:** seluruh isi matriks per-gang A1–A5 (C1–C8), C9, dan biaya RAB (estimasi); plus tidak ada data CCTV eksisting/POI/coverage.

**Keputusan visualisasi:** Three.js dinilai kurang tepat (berat ~600KB, butuh internet/CDN, memutus sifat 1-file-offline, dan 3D tak menambah nilai keputusan). User memilih **peta skematik 2D offline (SVG)**.

**Implementasi:**
- `05-aplikasi/index.html`: tambah modul **peta prioritas skematik** (SVG) — 5 segmen sebagai titik, posisi relatif koridor jalan, warna & ukuran ∝ CCᵢ, label = peringkat + fase. Kartu baru jadi section 5 (alokasi → 6, sensitivitas → 7). Ikut memperbaiki bug yang tak sengaja (baris `let h` di `renderPhases`).
- `06-paper-hasil/img/peta-prioritas.png` (800×440) — hasil render SVG peta untuk paper.
- Paper `draft-paper-hasil.md` & `.tex`: tambah **Gambar 3** (peta), modul peta di daftar modul, dan penyesuaian kalimat "ke depan". Label subseksi md dirapikan kembali ke urutan A–G.

**Verifikasi:** JS OK; peta ter-render (5 circle, 20 label); `node 05-aplikasi/test-algoritma.mjs` **semua PASS**; `.tex` braces 427/427, environment seimbang, 3 gambar.

**Open items:**
- [ ] Commit `05-aplikasi/` + `06-paper-hasil/` + `PROGRESS.md`.
- [ ] Compile `.tex` di Overleaf; cek posisi Gambar 1–3 tidak tumpang tindih.
- [ ] Opsional: peta interaktif (Leaflet) bila koordinat GPS lapangan tersedia.

### 2026-11-12 · Sesi 2 — Tugas baru: Aplikasi DSS + Paper Hasil IEEE

**Konteks masuk:** User menyatakan `dss_revisi.md` adalah versi final yang sudah dikumpulkan ke dosen. Ada tugas baru: kembangkan **aplikasi** dari proposal tersebut, lalu tulis **paper hasil format IEEE**. Data boleh dummy bila data lapangan tak tersedia, tetapi user minta **dicari data lapangan riil dulu**.

**Keputusan (dikonfirmasi user via tanya-jawab):**
1. Bentuk: **web app 1 file** (HTML+CSS+JS, offline, tanpa instalasi).
2. Dataset: pakai **5 alternatif A1–A5** yang sudah ada.
3. Angka acuan: **ikuti `dss_revisi.md`** (matriks AHP datar 8×8, CR 0,0104, PRISMA 582→416→121→12).
4. Strategi dataset: **hybrid** — anchor riil level desa + estimasi terdokumentasi per-gang.

**Data lapangan riil yang ditemukan** (detail + URL di `05-aplikasi/data-lapangan-riil.md`):
- Populasi 12 desa, total 91.469 (E-Office Desa Sumedang, SAKIP/Desa Cantik). Cipacing 15.096; Hegarmanah 9.712; Sayang 8.474; Cikeruh 7.848; Cileles 6.331.
- Kriminalitas Jatinangor: **11 (2022) → 155 (2023)** (Kapolres Sumedang); Sumedang 955→436 (2023→2024).
- Kos: **4.250 kamar sewa** di Desa Hegarmanah (profil desa 2014).
- PJU: Jalan Narongtong–Cileles minim PJU (KAPOL.ID 2021); opini minim penerangan Jatinangor (SumedangTandang 2023).
- **Gap:** data per-gang (8 kriteria) tidak ada publik; CCTV eksisting tak ada data resmi; volume lalu lintas ada di paper tapi PDF terkunci.

**Verifikasi kunci:** matriks AHP datar 8×8 + X dari proposal **mereproduksi `dss_revisi.md` persis** — λmax 8,1031; CI 0,0147; CR 0,0104; bobot C1 23,95%, C2/C3 14,29%; CC A3 0,6445 > A1 0,5774 > A4 0,4995 > A2 0,4638 > A5 0,1820; fase {A3,A1}/{A4,A2}/{A5}.
- Sensitivitas ±20% (16 run): **2/16** rank reversal (C1 −20%, C2 +20%; tukar A2↔A4). A3 & A1 stabil di semua skenario.
  (Catatan: naskah `dss_revisi.md` mengklaim "tidak terjadi rank reversal" — itu benar hanya untuk peringkat teratas; versi aplikasi/paper ini menyatakan 2/16 secara eksplisit.)

**File dibuat:**
- `05-aplikasi/data-lapangan-riil.md` — inventaris data riil + sumber + gap.
- `05-aplikasi/data/alternatif-kriteria.csv` — matriks 5×(C1–C8, C9, biaya) + label sumber.
- `05-aplikasi/data/bobot-ahp.csv` — matriks perbandingan berpasangan AHP.
- `05-aplikasi/index.html` — aplikasi (matriks editable, AHP+CR, TOPSIS, alokasi fase, sensitivitas, ekspor CSV).
- `05-aplikasi/test-algoritma.mjs` — self-check (node) → **semua PASS**.
- `05-aplikasi/README.md` — cara pakai.
- `06-paper-hasil/draft-paper-hasil.md` dan `.tex` — paper hasil IEEE (8 tabel, 2 gambar, 21 ref).
- `06-paper-hasil/img/aplikasi-screenshot.png` (1200×980) dan `img/arsitektur.png`.

**Verifikasi aplikasi:** dijalankan headless Chromium → render tanpa error; tabel terisi; angka tampil (0,6445 dst). Diperbaiki 1 bug JS (`c is not defined` di renderTopsis) dan 1 bug logika penghitung rank reversal.

**Open items (Sesi 2):**
- [ ] Commit `05-aplikasi/` + `06-paper-hasil/` (belum masuk git).
- [ ] Compile `06-paper-hasil/draft-paper-hasil.tex` di Overleaf (2×), cek jumlah halaman.
- [ ] Ganti dataset hybrid → observasi lapangan bila memungkinkan (gang A1–A5: counting malam, survei PJU, GPS CCTV, RAB).
- [ ] Jaga `.md` ↔ `.tex` tetap sinkron saat revisi.
- [ ] Keputusan user (dulu): deklarasi Gen-AI DIHAPUS dari naskah — berlaku juga untuk paper hasil?

### 2026-11-10 · Sesi 1 — Pelajari codebase/repo DSS

**Temuan utama:**
- Repo ini **bukan codebase software**, melainkan repo proyek riset: paper *scoping review* PRISMA-ScR (UTS DSS). Isi: brief, protokol, data CSV, sintesis, naskah paper (.md/.tex). Satu script: `03-sintesis/pilot_ahp_topsis.py`.
- `CONTEXT.md` (dibuat 5 Okt) **basi** — ada putaran revisi 17 Okt yang belum tercatat.
- Working tree punya **banyak perubahan belum di-commit** (revisi putaran 2): PRISMA berubah dari 582→416→121→12 menjadi 582→401→181→121→12; AHP berubah dari matriks datar 8×8 menjadi hierarki 3 kluster (CR 0). File `.drawio` baru untracked.
- `tugas.txt` & `screening-log-140.csv` perubahan = normalisasi line-ending saja.
- Sisa placeholder `[FULLTEXT-VERIFY]` di `03-sintesis/tahap-2-*`. Deklarasi Gen-AI dihapus dari `04-paper/draft-paper.*`.
- Folder `dss_revisi_markdown/` (untracked) = konversi markdown dari PDF `dss revisi.pdf`; memakai **angka versi lama** (AHP datar 8×8, PRISMA 416) — inilah yang kemudian dikonfirmasi user sebagai naskah final yang dikumpulkan.

**Belum dikerjakan dari Sesi 1 (opsional, masih terbuka):**
- [ ] Perbarui `CONTEXT.md`/`README.md` file map untuk mencerminkan struktur terbaru.
- [ ] Putuskan status deklarasi Gen-AI.

---

## Cara update file ini
1. Tambah entri baru **di atas** entri sebelumnya (paling atas = terbaru).
2. Format judul: `### YYYY-MM-DD · Sesi N — <ringkas>`.
3. Wajib ada: konteks masuk · keputusan · file yang dibuat/diubah · verifikasi · open items (format `- [ ]`).
4. Perbarui juga tabel "Status ringkas" di atas bila ada perubahan status.
