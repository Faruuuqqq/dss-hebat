# PROGRESS.md — Log Progres Proyek DSS Jatinangor

**Fungsi:** catatan progres kronologis pekerjaan. **Selalu diperbarui setiap sesi kerja.**
Entri **terbaru di paling atas**. Setiap entri wajib memuat: tanggal · apa yang dikerjakan · keputusan · file · verifikasi · open items.

> Konvensi: setelah menyelesaikan pekerjaan apa pun, tambahkan entri baru di bawah judul "Log" dengan tanggal hari itu. Jangan hapus entri lama (append-only). Rujuk file dengan path relatif ke root repo.

---

## Status ringkas (per 14 Nov 2026)

| Area | Status |
|---|---|
| **Sumber kebenaran** | `dss_revisi_markdown/dss_revisi.md` (AHP datar 8×8; PRISMA 582→416→121→12) |
| Proposal SCR (UTS) `dss_revisi.md` | SELESAI, sudah dikumpulkan ke dosen |
| Aplikasi DSS | SELESAI (web app 1 file, offline; fokus edit diperbaiki; ambang C9 operasional; biaya > plafon tidak dialokasikan) |
| Test aplikasi | SELESAI (mengekstrak & menjalankan engine dari `index.html`; cek CSV, C9, dan biaya > plafon) |
| Paper hasil IEEE | DRAFT SELESAI (.md + .tex), diselaraskan ke `dss_revisi` (BPS >98.000; 24 ref), belum dicompile |
| Data lapangan | RIIL level desa terkumpul; per-gang = hybrid (estimasi) |
| Commit git | BELUM di-commit |

**Blokir aktif:** (1) `.tex` paper hasil belum dicompile (tak ada pdflatex → Overleaf); (2) data per-gang belum dari observasi lapangan; (3) repo punya perubahan putaran-2 yang belum di-commit sejak Okt.

---

## Log

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
