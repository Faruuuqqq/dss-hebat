# AGENTS.md — Panduan Agen (baca ini dulu)

Dokumen ini adalah **titik masuk untuk agen/mesin yang bekerja di repo ini**.
Ia memuat konteks, aturan kerja, invarian yang tidak boleh dilanggar, dan status terkini.
**Log kronologis lengkap ada di [`PROGRESS.md`](PROGRESS.md)** — selalu diperbarui tiap sesi.

---

## 1. Apa ini

Repo ini **bukan codebase perangkat lunak biasa**, melainkan repo proyek akademik UTS mata kuliah
*Decision Support System* (kelompok 5 mahasiswa, Unpad). Isi intinya:

- **Proposal SCR** (scoping review PRISMA-ScR) → naskah final yang sudah dikumpulkan: `dss_revisi_markdown/dss_revisi.md`.
- **Tugas lanjutan**: bangun **aplikasi** dari model proposal + tulis **paper hasil** (format IEEE) + **paket dokumentasi SE**.
- Domain: prioritisasi penempatan **CCTV** di permukiman mahasiswa **Jatinangor** (Smart Living & Safety).
- Metode: **AHP** (pembobotan) + **TOPSIS** (perankingan) + alokasi anggaran bertahap.

## 2. Urutan membaca

1. `AGENTS.md` (file ini)
2. `PROGRESS.md` — log & status terbaru
3. `08-docs/data-dan-sumber.md` — data riil + dummy + sumber
4. `05-aplikasi/README.md` — cara pakai aplikasi
5. `06-paper-hasil/draft-paper-hasil.md` — paper hasil (implementasi)
6. `CONTEXT.md` — konteks fase proposal (status s.d. 5 Okt 2026; **bukan** status terkini)

## 2.1 Sumber kebenaran tunggal (per 14 Nov 2026)

- `dss_revisi_markdown/dss_revisi.md` adalah **satu-satunya sumber kebenaran** untuk model, angka, dan alur PRISMA.
- Semua luaran hidup (`05-aplikasi/`, `06-paper-hasil/`, `08-docs/`) wajib konsisten dengan naskah itu.
- **Kontradiksi internal yang sudah diputuskan:** narasi metodologi `dss_revisi.md` menyebut AHP hierarki 3 kluster (10 perbandingan), tetapi hasil numeriknya (λmax 8,1031; n=8; RI=1,41; bobot C1 23,95%) hanya dapat dihasilkan matriks **datar 8×8**. Model numerik kanonik = **datar 8×8** (terverifikasi: model hierarki pilot menghasilkan C1 24,31% dan A3 0,6441, sedangkan datar 8×8 menghasilkan C1 23,95%, A3 0,6445, λmax 8,1031, CI 0,0147, CR 0,0104, persis `dss_revisi`). Angka hierarki (C1 24,31%; A3 0,6441; PRISMA 401/181) adalah artefak historis dan **tidak dipakai** di luaran hidup.
- **Operasionalisasi C9:** teks rinci `dss_revisi.md` menetapkan C1–C8 sebagai urgensi TOPSIS, sedangkan C9 dan RAB menjadi kendala fase. Tabel VII menegaskan C9 sebagai kelayakan teknis berskala 1–5, tetapi tidak menetapkan ambang numerik. Gambar 3 memakai label generik “AHP: bobot C1–C9”, sehingga tidak mengalahkan teks rinci maupun hasil 8×8 yang terkunci. Implementasi memakai C9 ≥ 3 sebagai **ambang kelayakan operasional** saat alokasi fase, bukan kutipan aturan numerik verbatim dari `dss_revisi.md`.
- Artefak historis wajib diberi banner status: `03-sintesis/pilot_ahp_topsis.py`, `03-sintesis/tahap-4-pilot-dummy-numerik.md`, `04-paper/catatan-perubahan-dan-perbaikan.md`, `04-paper/diagram/`.

## 3. Aturan kerja (wajib)

- **Bahasa:** Indonesia untuk narasi/dokumen; istilah teknis boleh Inggris (italic di LaTeX).
- **Update `PROGRESS.md` setiap sesi.** Entri baru di **paling atas**, format
  `### YYYY-MM-DD · Sesi N — <ringkas>` dengan: konteks · keputusan · file · verifikasi · open items. Append-only (jangan hapus entri lama).
- **Setiap klaim numerik harus bisa ditelusuri** ke sumber (file data / PDF / URL). Kalau tidak ada sumbernya, jangan ditulis.
- **Jaga `draft-paper-hasil.md` ↔ `.tex` tetap sinkron.** Setelah edit `.tex`, cek braces/environment seimbang.
- **Data yang belum dari lapangan wajib dilabeli** `[SIMULASI]` / "estimasi terdokumentasi".
- Konvensi commit (bila diminta commit): `feat|fix|docs|data|refactor(<scope>): <ringkas>`.

## 4. Status terkini (per 14 Nov 2026)

| Area | Status |
|---|---|
| **Sumber kebenaran** | `dss_revisi_markdown/dss_revisi.md` (lihat §2.1) |
| Proposal SCR (`dss_revisi_markdown/dss_revisi.md`) | SELESAI, sudah dinilai/dikumpulkan |
| Aplikasi web (`05-aplikasi/`) | SELESAI — 1 file HTML offline, engine data-driven, fokus edit diperbaiki, filter C9 aktif, **biaya satu titik > plafon tidak dialokasikan** |
| Test aplikasi (`05-aplikasi/test-algoritma.mjs`) | SELESAI — mengekstrak & menjalankan engine dari `index.html`, cek paritas CSV, C9, dan biaya > plafon |
| Paper hasil (`06-paper-hasil/`) | SELESAI — diselaraskan ke `dss_revisi`, **tercompile 5 halaman** tanpa error (Tectonic) |
| Paper fase proposal (`04-paper/`) | SELESAI — diselaraskan ke AHP 8×8/PRISMA 416, **tercompile 8 halaman**; diagram arsitektur kini TikZ kanonik |
| Data & sumber (`08-docs/data-dan-sumber.md`) | SELESAI — BPS + E-Office dicatat, data riil + dummy CCTV + sumber |
| Dokumentasi SE (`08-docs/`) | SELESAI — SRS (FR/NFR/acceptance), traceability, UML Mermaid, mockup desktop/mobile aktual |
| Migrasi Next.js (`07-webapp/`) | SELESAI — Next.js 16 + TS + Tailwind 4; bug input angka, format, dan `lint` diperbaiki; 3 suite uji LULUS |
| Git | ter-commit (12 commit s.d. sesi 12); branch `main`; belum di-push |

## 5. Invarian (JANGAN dilanggar tanpa alasan kuat)

- **Hasil resmi = dataset `resmi` (5 segmen).** Angka terkunci:
  - CR = **0,0104** (< 0,10); λmax = 8,1031; CI = 0,0147.
  - Bobot: C1 **23,95%**; C2 = C3 **14,29%**; C5 = C8 12,45%; C7 9,74%; C4 7,70%; C6 5,15%.
  - TOPSIS: A3 **0,6445** > A1 **0,5774** > A4 **0,4995** > A2 **0,4638** > A5 **0,1820**.
  - Fase anggaran (plafon Rp 15 Jt): Fase 1 {A3, A1} = 14,0; Fase 2 {A4, A2} = 13,0; Fase 3 {A5}.
  - Sensitivitas ±20%: rank reversal **2/16** (C1 −20%, C2 +20%); A3 & A1 stabil.
- Dataset **`perluasan` (12 desa)** adalah **simulasi untuk demo skalabilitas** — jangan jadikan hasil utama.
- **`99-arsip/` JANGAN dikutip** di paper (domain/angka salah).
- `05-aplikasi/data-lapangan-riil.md` = catatan awal; versi kanonik = `08-docs/data-dan-sumber.md`.
- Kalau mengubah dataset/angka, **jalankan `node 05-aplikasi/test-algoritma.mjs`** — harus tetap lulus untuk dataset resmi.

## 6. Keputusan teknologi yang sudah dikunci (untuk tugas aplikasi)

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**, deploy **Vercel**.
- **Supabase** (Postgres) menyusul (tahap 2); mulai dengan data statis.
- **Mockup**: wireframe dibuat dari kode → ekspor PNG (sudah ada di `08-docs/mockup/`).
- Mesin AHP–TOPSIS harus dipisah dari data (**data-driven**), diuji paritas dengan angka invarian di atas.
- Visualisasi pakai **SVG tanpa dependensi berat** (bukan Three.js).
- **Gambar arsitektur**: satu sumber TikZ `assets/diagram/arsitektur-4-lapis-kanonik.tex`, dimuat vektor oleh kedua paper. PNG (jika perlu) dibangun via `assets/diagram/build-arsitektur-png.sh`. Jangan pakai PNG lama.

## 7. Peta file penting

```
PROGRESS.md                  # log progres (selalu diperbarui)
AGENTS.md                    # file ini
build-papers.sh              # compile kedua paper deterministik (Tectonic + SOURCE_DATE_EPOCH)
assets/diagram/
  arsitektur-4-lapis-kanonik.tex   # SUMBER TUNGGAL gambar arsitektur (TikZ)
  build-arsitektur-png.sh          # regenerasi PNG 400 dpi dari sumber TikZ
07-webapp/                   # Next.js 16 + TS + Tailwind 4 (migrasi aplikasi)
  app/page.tsx               # dashboard interaktif (client component)
  components/NumberCell.tsx  # sel angka aman (draft string, koma, jepit saat blur)
  lib/engine.ts              # mesin AHP-TOPSIS TS (mandiri, data-driven)
  scripts/parity.mts         # paritas angka kanonik (node, tanpa build)
  scripts/ui-check.mjs       # uji interaksi Chromium (playwright-core)
  scripts/ui-bugs.mjs        # uji regresi perilaku input angka
05-aplikasi/
  index.html                 # aplikasi (1 file, offline) — DATASETS resmi & perluasan
  test-algoritma.mjs         # verifikasi: ekstrak script index.html + cek paritas CSV
  test-ui.sh                 # smoke test Chromium: fokus input + C9 + biaya > plafon
  data/                      # CSV dataset & matriks AHP
  data-lapangan-riil.md      # catatan awal data (lihat 08-docs)
06-paper-hasil/
  draft-paper-hasil.md/.tex  # paper hasil (IEEE)
  img/                       # gambar (screenshot app, arsitektur, peta)
08-docs/
  README.md                  # indeks dokumentasi SE
  data-dan-sumber.md         # data riil + dummy CCTV + sumber
  srs.md                     # FR/NFR, batasan, kriteria penerimaan
  traceability.md            # kebutuhan → implementasi → verifikasi
  uml.md                     # use case, activity, sequence (Mermaid)
  mockup/                    # screenshot aplikasi aktual desktop/mobile
dss_revisi_markdown/         # naskah final proposal — SUMBER KEBENARAN TUNGGAL
04-paper/ 03-sintesis/ ...   # artefak fase proposal (historis; lihat banner status)
99-arsip/                    # JANGAN dipakai
```

## 8. Perintah verifikasi

```bash
node 05-aplikasi/test-algoritma.mjs        # ekstrak & uji engine aktual dari index.html (harus PASS)
bash 05-aplikasi/test-ui.sh               # smoke test UI (opsional, butuh Chromium/Chrome)

# compile kedua paper (butuh Tectonic; binary tunggal, tanpa instalasi TeX penuh).
# SOURCE_DATE_EPOCH membuat PDF deterministik sehingga `git status` tetap bersih.
TECTONIC=/path/ke/tectonic bash build-papers.sh

# regenerasi gambar arsitektur (butuh Tectonic + pymupdf)
bash assets/diagram/build-arsitektur-png.sh

# webapp Next.js
cd 07-webapp && npm run verify        # lint + parity + build (harus lulus)
# uji peramban: jalankan `npm start` lalu
#   npm run test:bugs                 # perilaku input angka (16 cek)
#   npm run test:ui                   # interaksi dashboard (18 cek)
```
Aplikasi: buka `05-aplikasi/index.html` di browser (tanpa server). Screenshot headless opsional via Chromium/Playwright.

## 9. Rencana berikutnya (open items)

1. (Opsional) Deploy `07-webapp/` ke Vercel + integrasi Supabase (tahap 2 rencana teknologi).
2. (Opsional) Konfigurasi ESLint untuk `07-webapp/` (`npm run lint` belum aktif).
3. (Opsional) Perdalam data lapangan: koordinat GPS titik CCTV, counting malam, survei PJU.
4. (Opsional) Tinjau panjang paper hasil: 5 halaman padat (halaman terakhir 86% terisi). Jika venue menuntut 6–8 halaman, tambah pembahasan substantif, bukan penambahan kosmetik.
5. (Opsional) Push branch `main` ke `origin` bila diinginkan.
