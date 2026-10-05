# DSS Jatinangor — CCTV Prioritization (Smart Living & Safety)

Scoping review PRISMA-ScR + model konseptual AHP-TOPSIS. **Mulai dari `CONTEXT.md`** (full context: keputusan, angka, status). Alur baca: brief → protokol → data → sintesis → paper.

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
03-sintesis\tahap-3-model.md             # model A1-A5 + C1-C9 + AHP-TOPSIS
03-sintesis\tahap-3-model.tex            # versi LaTeX (sama isi)
04-paper\draft-paper.md               # DRAF paper (bukan final, masih ada [TIM]/[FULLTEXT-VERIFY])
04-paper\draft-paper.tex              # naskah LaTeX IEEEtran conference (Gambar 1 = PNG; lint lolos, belum dicompile)
04-paper\prisma-diagram.svg           # diagram PRISMA alur resmi 582→12
04-paper\prisma-diagram.png           # render 2x SVG (eksklusi tema 109), dipakai di .tex
99-arsip\                             # JANGAN dikutip di paper
```

## 99-arsip — jangan dipakai di paper
- `JANGAN-DIPAKAI-promptclaude-smart-environment-lama.txt` — domain salah (Smart Environment), kita Smart Living & Safety.
- `JANGAN-DIPAKAI-prisma-salah-1719-deep-learning.png` — angka/query salah (1719, deep learning/sampah), yang benar `04-paper\prisma-diagram.svg`.
- `ref-tim-lain-paper.pdf` + `ref-tim-lain-extract.txt` — paper tim lain, hanya bahan belajar struktur. Jangan tiru kalimat (risiko tabrakan).

## Status / blokir
1. [SELESAI] Angka PRISMA diseragamkan ke alur resmi: 582 screened → 166 (lebih tua dari 2021) → 416 sought → 2 non-Inggris + 233 non-Artikel + 60 tak terakses → 121 assessed → 109 dieksklusi tema → 12 included. Berlaku untuk `draft-paper.md` + `prisma-diagram.svg`. `screening-log-140.csv` dan `scopus-export-140.csv` = catatan kerja subset, jangan dikutip sebagai alur.
2. `draft-paper.md`: sisa `[TIM]` (tanggal pencarian, fakta tim) dan `[FULLTEXT-VERIFY]` (cek CR 0,046 dari [8] + detail kolom Fokus saat PDF ada).
3. [SELESAI] `prisma-diagram.svg` + `.png`: angka 582; eksklusi tema dikoreksi 118→109 (PNG dirender ulang). Tanggal masih `[ISI TANGGAL]` (isi bersamaan dengan [TIM]).
4. [SELESAI] `eligibility-12.csv`: `Keputusan_Fulltext` terisi 12/12 "Disertakan"; kolom `Fokus_Verifikasi_Fulltext` menunggu PDF.
5. PDF 12 paper inti belum ada (usulkan taruh di `02-data\pdf\`) → verifikasi Fokus tertunda.
6. `draft-paper.tex` belum dicompile (mesin ini tanpa pdflatex) → unggah ke Overleaf, compile 2×, cek 6–8 halaman + hapus komentar merah template.
