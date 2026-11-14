# DSS Jatinangor — Prioritisasi Penempatan CCTV

Sistem pendukung keputusan (DSS) untuk memprioritaskan penempatan CCTV di permukiman mahasiswa
**Jatinangor**, Kabupaten Sumedang. Model memakai **AHP** untuk pembobotan kriteria dan **TOPSIS**
untuk perankingan alternatif, dilengkapi alokasi anggaran bertahap serta analisis sensitivitas.

Proyek ini adalah tugas akademik mata kuliah *Decision Support System* (kelompok 5, Universitas
Padjadjaran) yang mencakup tiga hal: *scoping review* PRISMA-ScR, model konseptual, dan implementasi
perangkat lunak beserta pengujian numeriknya.

## Sumber kebenaran tunggal

[`dss_revisi_markdown/dss_revisi.md`](dss_revisi_markdown/dss_revisi.md) adalah **satu-satunya
sumber kebenaran** untuk model, angka, dan alur PRISMA. Seluruh luaran lain wajib konsisten
dengannya. Angka terkunci:

| Besaran | Nilai |
|---|---|
| Konsistensi AHP | λmax = 8,1031 · CI = 0,0147 · **CR = 0,0104** (< 0,10) |
| Bobot kriteria | C1 23,95% · C2 = C3 14,29% · C5 = C8 12,45% · C7 9,74% · C4 7,70% · C6 5,15% |
| Peringkat TOPSIS | A3 0,6445 > A1 0,5774 > A4 0,4995 > A2 0,4638 > A5 0,1820 |
| Fase anggaran (plafon Rp 15 Jt) | Fase 1 {A3, A1} = 14,0 · Fase 2 {A4, A2} = 13,0 · Fase 3 {A5} |
| Sensitivitas ±20% | 16 skenario, 2 pembalikan peringkat (C1 −20%, C2 +20%) |
| PRISMA-ScR | 582 → 416 → 121 → 12 |

Catatan model: **C1–C8** adalah kriteria urgensi yang diproses TOPSIS, sedangkan **C9 dan RAB**
adalah kendala alokasi. Ambang `C9 ≥ 3` merupakan kebijakan implementasi terdokumentasi, bukan
angka yang dinyatakan eksplisit dalam naskah kanonik.

## Struktur repositori

```
00-brief/            brief tugas
01-protokol/         protokol scoping review + kerangka paper
02-data/             data screening, eligibility, dan charting 12 studi
03-sintesis/         sintesis RQ1/RQ2 + pilot numerik AHP-TOPSIS (sebagian historis)
04-paper/            paper fase proposal (md + tex + gambar, tercompile 8 halaman)
05-aplikasi/         aplikasi DSS satu berkas, offline (index.html) + uji
06-paper-hasil/      paper hasil implementasi (md + tex + pdf, tercompile 5 halaman)
07-webapp/           aplikasi Next.js 16 + TypeScript + Tailwind 4
08-docs/             dokumentasi rekayasa perangkat lunak (SRS, traceability, UML, mockup)
assets/diagram/      sumber TikZ kanonik gambar arsitektur + pembangun PNG
dss_revisi_markdown/ naskah final — SUMBER KEBENARAN TUNGGAL
99-arsip/            arsip; tidak di-commit, jangan dikutip di paper
AGENTS.md            panduan agen/mesin + status terkini
PROGRESS.md          log progres kronologis
CONTEXT.md           konteks fase proposal (historis, s.d. 5 Okt 2026)
build-papers.sh      compile kedua paper secara deterministik
```

## Menjalankan aplikasi

**Aplikasi satu berkas** (tanpa server, tanpa instalasi):

```bash
open 05-aplikasi/index.html      # atau klik dua kali di berkas manager
```

**Aplikasi Next.js** (butuh Node 20+):

```bash
cd 07-webapp
npm install
npm run dev                      # http://localhost:3000
```

## Verifikasi

```bash
# model & aplikasi satu berkas
node 05-aplikasi/test-algoritma.mjs     # paritas angka kanonik dari index.html
bash 05-aplikasi/test-ui.sh             # smoke test UI (butuh Chromium)

# paper (butuh Tectonic: https://tectonic-typesetting.github.io)
TECTONIC=/path/ke/tectonic bash build-papers.sh

# gambar arsitektur (butuh Tectonic + Python/pymupdf)
bash assets/diagram/build-arsitektur-png.sh

# webapp
cd 07-webapp
npm run verify              # lint + parity + build
npm start &                 # lalu, di terminal lain:
npm run test:ui             # 22 cek interaksi
npm run test:bugs           # 18 cek perilaku input angka
npm run test:export         # 22 cek ekspor CSV
npm run test:a11y           # audit axe-core (WCAG 2.1 A/AA)
```

## Status

| Area | Status |
|---|---|
| Naskah proposal (SCR) | selesai, sudah dinilai |
| Paper fase proposal (`04-paper/`) | tercompile 8 halaman |
| Paper hasil (`06-paper-hasil/`) | tercompile 5 halaman |
| Aplikasi satu berkas (`05-aplikasi/`) | selesai, 1 berkas offline |
| Aplikasi Next.js (`07-webapp/`) | selesai; uji paritas, interaksi, ekspor, a11y lulus |
| Dokumentasi SE (`08-docs/`) | selesai (SRS, traceability, UML, mockup) |
| Data lapangan | riil tingkat desa; per-segmen masih *hybrid*/estimasi |

## Catatan data

Dataset `resmi` (5 segmen) adalah keluaran utama. Data per segmen bersifat **hybrid**: kalibrasi
dari sumber sekunder level desa/kecamatan, sedangkan sel per-segmen merupakan estimasi
terdokumentasi — belum merupakan validasi lapangan. Dataset `perluasan` (12 desa) adalah
**simulasi** untuk demonstrasi skalabilitas dan tidak boleh dijadikan hasil utama.

## Lisensi & atribusi

Proyek akademik; data sekunder bersumber dari BPS Kabupaten Sumedang, publikasi kecamatan, dan
sumber publik lain yang dicatat pada [`08-docs/data-dan-sumber.md`](08-docs/data-dan-sumber.md).
