# DSS Jatinangor — CCTV Prioritization (Smart Living & Safety)

> **Sumber kebenaran tunggal:** `dss_revisi_markdown/dss_revisi.md` (model AHP datar 8×8, PRISMA 582→416→121→12).
> Semua luaran hidup (`05-aplikasi/`, `06-paper-hasil/`, `08-docs/`) wajib konsisten dengan naskah itu.
> Status terkini: `AGENTS.md` + `PROGRESS.md`. `CONTEXT.md` bersifat historis (s.d. 5 Okt 2026).

Scoping review PRISMA-ScR + model konseptual AHP-TOPSIS. **Mulai dari `AGENTS.md`** (panduan agen + status) dan `PROGRESS.md` (log terbaru). Alur baca: brief → protokol → data → sintesis → paper → aplikasi.

```
00-brief\tugas.txt                  # brief UTS (sumber requirements)
01-protokol\kerangka-paper-ieee.md    # kerangka paper per seksi
01-protokol\panduan-baca-anggota.md   # prompt Gemini + pembagian 12 paper
02-data\scopus-export-140.csv         # export kerja subset 140 (BUKAN alur resmi)
02-data\screening-log-140.csv         # log screening subset kerja (BUKAN alur resmi)
02-data\eligibility-12.csv            # lembar kerja full-text (Keputusan sudah diisi 12/12 Disertakan)
02-data\tabel-paper-final.csv        # metadata 12 paper inti
02-data\data-charting-12.csv          # charting ringkas 12 paper
03-sintesis\tahap-2-charting-sintesis.md  # charting detail + sintesis RQ1/RQ2
03-sintesis\tahap-2-charting-sintesis.tex # versi LaTeX (sama isi)
03-sintesis\tahap-3-model.md             # model konsep awal (n=9, 3 segmen; historis)
03-sintesis\tahap-3-model.tex            # versi LaTeX (historis)
04-paper\draft-paper.md               # paper fase proposal (diselaraskan ke AHP 8×8, PRISMA 416)
04-paper\draft-paper.tex              # naskah LaTeX IEEEtran conference (diselaraskan AHP 8×8)
04-paper\prisma-diagram.svg           # diagram PRISMA versi historis (401/181); jangan dipakai
04-paper\prisma-diagram.png           # render historis; gambar kanonik ada di dss_revisi_markdown/assets
04-paper\diagram\taksonomi-5-pola.mmd  # sumber Mermaid Gambar 2 (historis)
04-paper\diagram\arsitektur-4-lapis.mmd # sumber Mermaid Gambar 3 (historis)
05-aplikasi\index.html                # aplikasi DSS 1 file, offline (AHP-TOPSIS + C9 + sensitivitas)
05-aplikasi\test-algoritma.mjs        # uji engine aktual + paritas CSV
06-paper-hasil\draft-paper-hasil.md/.tex # paper hasil implementasi (IEEE)
08-docs\data-dan-sumber.md            # data riil + dummy CCTV + sumber
AGENTS.md  PROGRESS.md                # panduan agen + log progres
99-arsip\                             # JANGAN dikutip di paper
```

## Progres & luaran terbaru (lihat `PROGRESS.md`)
- `PROGRESS.md` — **log progres kronologis; selalu diperbarui tiap sesi kerja**.
- `dss_revisi_markdown\dss_revisi.md` — **SUMBER KEBENARAN TUNGGAL**; naskah final yang sudah dikumpulkan ke dosen (AHP datar 8×8, PRISMA 582→416→121→12).
- `05-aplikasi\` — aplikasi web DSS (1 file, offline): AHP-TOPSIS + filter C9 + alokasi anggaran + sensitivitas. Buka `index.html`. Uji: `node 05-aplikasi/test-algoritma.mjs`.
- `06-paper-hasil\` — paper hasil implementasi (format IEEE): `.md` + `.tex` (belum dicompile) + gambar.
- `08-docs\` — data & sumber (BPS + E-Office), mockup/SE menyusul.

## 99-arsip — jangan dipakai di paper
- `JANGAN-DIPAKAI-promptclaude-smart-environment-lama.txt` — domain salah (Smart Environment), kita Smart Living & Safety.
- `JANGAN-DIPAKAI-prisma-salah-1719-deep-learning.png` — angka/query salah (1719, deep learning/sampah), yang benar `dss_revisi_markdown\assets\gambar_1_prisma.png`.
- `ref-tim-lain-paper.pdf` + `ref-tim-lain-extract.txt` — paper tim lain, hanya bahan belajar struktur. Jangan tiru kalimat (risiko tabrakan).

## Status / blokir
1. [SELESAI] Angka PRISMA diseragamkan ke alur resmi: 582 screened → 166 (lebih tua dari 2021) → 416 sought → 2 non-Inggris + 233 non-Artikel + 60 tak terakses → 121 assessed → 109 dieksklusi tema → 12 included. Berlaku untuk `draft-paper.md`/`.tex`, `dss_revisi.md`, dan `06-paper-hasil`. `prisma-diagram.svg`/`.png` di `04-paper` masih render historis (401/181); gambar kanonik ada di `dss_revisi_markdown/assets/gambar_1_prisma.png`. `screening-log-140.csv` dan `scopus-export-140.csv` = catatan kerja subset, jangan dikutip sebagai alur.
2. `04-paper\draft-paper.md` + `.tex`: sudah diselaraskan ke model kanonik (AHP 8×8, PRISMA 416, CC A3 0,6445, sensitivitas 2/16).
3. [SELESAI] `prisma-diagram.svg` + `.png` di `04-paper`: dipertahankan sebagai artefak historis (401/181); jangan dipakai untuk luaran final.
4. [SELESAI] `eligibility-12.csv`: `Keputusan_Fulltext` terisi 12/12 "Disertakan"; kolom `Fokus_Verifikasi_Fulltext` menunggu PDF.
5. PDF 12 paper inti belum ada (usulkan taruh di `02-data\pdf\`) → verifikasi Fokus tertunda.
6. `draft-paper.tex` belum dicompile (mesin ini tanpa pdflatex) → unggah ke Overleaf, compile 2×, cek 6–8 halaman + hapus komentar merah template.
