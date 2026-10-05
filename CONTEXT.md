# FULL CONTEXT — Semua Pekerjaan Proyek UTS DSS Jatinangor

Satu file ini berisi seluruh konteks proyek: keputusan, angka, hasil kerja, dan sisa pekerjaan. Baca file ini dulu sebelum melanjutkan kerja (untuk manusia baru maupun agent baru). File terakhir diperbarui: 5 Okt 2026.

---

## 1. Proyek & Target

- **Mata kuliah:** Decision Support System — UTS, kelompok 5 mahasiswa, dikumpulkan Pertemuan 8 (3 minggu).
- **Luaran:** Paper ilmiah Scoping Review (PRISMA-ScR), format IEEE 2-kolom, **6–8 halaman, 10–15 referensi**, wajib ada **deklarasi penggunaan Gen-AI**.
- **Domain yang dipilih:** DSS Smart Living & Safety — **prioritisasi penempatan CCTV di permukiman mahasiswa Jatinangor** (bukan smart environment / mobilitas / health).
- **Rubrik bobot:** Protokol SCR 25% | Sintesis RQ1+RQ2 25% | Model konseptual RQ3 35% | Format & kualitas akademis 15%.
- **Tim & pembagian tugas baca 12 paper:**

| Anggota | Peran | Paper |
|---|---|---|
| A1 | Koordinator, PRISMA keeper | #39, #45 |
| A2 | Analis spasial/coverage | #31, #46, #11 |
| A3 | Analis hunian/kawasan | #37, #126 |
| A4 | Analis metode MCDM | #14, #83 |
| A5 | Analis konteks Indonesia + tradeoff | #96, #74, #56 |

---

## 2. Protokol SCR (sudah DIKUNCI)

- **Database:** Scopus saja. **Tahun:** 2021–2026 (2021 inklusif). **Jenis:** Article. **Bahasa:** Inggris. **Teks lengkap** harus dapat diakses.
- **Search string resmi** (format TITLE-ABS-KEY, 3 blok konsep: kawasan cerdas × DSS/MCDM × safety/CCTV/placement) — teks lengkap ada di `04-paper\draft-paper.md` Seksi II-A.

```
TITLE-ABS-KEY (
  ( "smart city" OR "smart cities" OR "smart living" OR "urban intelligence"
    OR "smart environment*" OR "safe city" OR "smart campus" )
  AND ( "decision support system*" OR "decision support"
    OR "decision-making support" OR "decision support tool*"
    OR "decision support framework*" OR "decision support model*"
    OR DSS OR MCDM OR "multi-criteria decision*" )
  AND ( safet* OR secur* OR surveillanc* OR crime* OR "public safety"
    OR "safety management" OR "risk assessment" OR CCTV
    OR "closed-circuit television" OR "surveillance camera*"
    OR "camera placement" OR "sensor placement" OR "facility location"
    OR "site selection" OR "street lighting" OR monitor* )
)
```

- **Alur PRISMA resmi (angka final, sudah balance, DIPAKAI DI PAPER):**

| Tahap | Angka |
|---|---|
| Records identified (dup 0, otomasi 0, lain 0) | **582** |
| Records screened | 582 |
| Excluded: terbit sebelum 2021 | 166 |
| Reports sought for retrieval | 416 |
| Excluded saat retrieval: non-Inggris 2, non-Artikel 233, tak terakses 60 | 295 |
| Reports assessed (full-text) | 121 |
| Excluded: tema/judul/abstrak/spesifikasi subjek | **109** |
| **Studies included** | **12** |

- Cek balance: 582−166=416; 416−2−233−60=121; 121−109=12.
- **Keputusan terkait angka:** (a) alur 582 dipilih menggantikan alur lama 140→119→18 (pertanyaan ke user, 5 Okt); (b) eksklusi tema **109**, bukan 118, karena 121−118=3≠12 (koreksi user); (c) `screening-log-140.csv` dan `scopus-export-140.csv` = catatan kerja subset, **jangan pernah dikutip sebagai alur**; (d) tanggal pencarian masih placeholder `[TIM]` / `[ISI TANGGAL]` — fakta yang hanya tim punya.

---

## 3. Korpus: 12 Paper Inti (+ cadangan & yang gugur)

Pemetaan **ID screening (#) ↔ nomor referensi IEEE [n]** (urut di Daftar Pustaka):

| # | [n] | Singkatan | Fokus utama |
|---|---|---|---|
| #39 | [1] | Wang 2025, Applied Sciences | MWVC + greedy, coverage kamera (jangkar budget) |
| #45 | [2] | González-Villa 2024 (S4AllCities) | DSS simulasi terintegrasi → DITOLAK utk model |
| #31 | [3] | Feizizadeh 2025, Annals of GIS | Spatial-MCDA GIS, peta risiko |
| #37 | [4] | Ahmed 2022, Frontiers | AHP multistakeholder smart campus |
| #126 | [5] | Choi 2025, JAABE | MCDM hunian padat Korea, safety teratas |
| #14 | [6] | Kanj 2024, IEEE Access | Fuzzy AHP + Fuzzy TOPSIS (pola pemenang) |
| #46 | [7] | Kabashkin 2025, Drones | UAV 30 titik + evaluasi 6 skenario (penutup lubang spasial) |
| #83 | [8] | Baddour 2026, JIDMIS | BWM+CoCoSo vs AHP/TOPSIS/VIKOR (komparasi berangka) |
| #96 | [9] | Almassawa 2024, Planning Malaysia | PROMETHEE, konteks Indonesia |
| #74 | [10] | Shiddiqy 2025, IJSSE | SWOT+AHP IKN, bobot surveillance (AHP dari data sekunder) |
| #11 | [11] | Zheng 2025, JCIT | DEMATEL-ISM + Bayesian, intervensi terukur |
| #56 | [12] | Yuhang 2025, Applied Sciences | EWM + BCSLP, coverage vs resilience |

- **6 cadangan (naik berurutan jika perlu tambahan):** #124 → #135 → #15 → #109 → #69 → #52.
- **Gugur aturan tahun (2020):** #121 (relevan, disebut di paper sebagai **bukti disiplin protokol**, tanpa sitasi) dan #44.
- Keputusan `eligibility-12.csv`: 12/12 **"Disertakan"**; kolom `Fokus_Verifikasi_Fulltext` berisi apa yang harus dicek saat PDF ada.

---

## 4. Rumusan RQ Final (sudah DISETUJUI, tanpa emdash)

- **RQ1:** Bagaimana arsitektur DSS Smart Living & Safety dipetakan dari literatur (alur input data heterogen ke engine MCDM/analitik lalu output keputusan), dan pola mana yang paling transferable terhadap keterbatasan data Jatinangor?
- **RQ2:** Metode MCDM apa yang digunakan dalam DSS Smart Living & Safety, bagaimana skema pembobotan dan perankingannya diterapkan, serta bagaimana kriteria keputusan diklasifikasikan berdasarkan atribut benefit dan cost?
- **RQ3:** Model konseptual DSS seperti apa yang paling layak diterapkan untuk prioritisasi CCTV di permukiman mahasiswa Jatinangor, mencakup representasi segmen gang sebagai alternatif, struktur sembilan kriteria keselamatan, skema pembobotan AHP multistakeholder dan perankingan TOPSIS, serta elemen literatur apa yang sengaja tidak diadopsi beserta alasannya?

**3 kontribusi (di akhir Pendahuluan, masing-masing terikat 1 RQ):** (1) pemetaan 5 pola arsitektur + penanda kebutuhan data [RQ1]; (2) taksonomi sebaran metode + klasifikasi benefit/cost/context-dependent [RQ2]; (3) model A1–A5 × C1–C9 + AHP multistakeholder + TOPSIS + catatan tolak/tunda [RQ3].

---

## 5. Hasil Sintesis & Model (isi paper)

**RQ1 — 5 pola arsitektur** (`03-sintesis\tahap-2` Bagian B.1, Gambar 2 di draft):
GIS-MCDM (#31/#11/#46) DIPAKAI | optimasi coverage (#39/#56) DIPAKAI | expert-driven (#37/#126/#83) DIPAKAI | simulasi-DSS (#45) DITOLAK | policy-MCDA (#96/#74) DIPAKAI.

**RQ2 — sebaran metode** (B.2): pembobotan subjektif AHP/Fuzzy-AHP/BWM (#4/#6/#8/#10); objektif EWM (#12); perankingan TOPSIS/CoCoSo/PROMETHEE (#6/#8/#9); struktural DEMATEL-ISM+Bayesian (#11); **pola pemenang: AHP bobot + TOPSIS ranking (#6)**. **Caveat wajib:** satu paper bisa >1 metode → frekuensi tidak dijumlahkan jadi persentase. **SAW dan WP tidak ada di korpus** — hanya disebut sekali di Seksi IV sebagai "tidak ditemukan eksplisit" (jangan klaim distribusinya).

**RQ2 — taksonomi kriteria:** benefit / cost / **context-dependent** (kategori ketiga hanya bila arah preferensi di paper sumber tidak eksplisit; jangan dipaksa biner). Semua kriteria model Jatinangor = **benefit terhadap urgensi** (skor tinggi = makin prioritas).

**RQ3 — model** (`03-sintesis\tahap-3-model.md`):
- **Alternatif A1–A5** = segmen gang (nama final dari lapangan; aturan 4–6 segmen, 1 unit CCTV per segmen).
- **9 kriteria C1–C9:** C1 riwayat kerawanan | C2 mobilitas malam | C3 defisiensi penerangan | C4 efisiensi coverage | C5 kepadatan penghuni | C6 derajat simpul | C7 gap CCTV eksisting | C8 kedekatan guna lahan rentan | C9 kelayakan implementasi. Validasi: 8 dari 9 kriteria ≥2 paper; **C6 bersumber tunggal #39** (jujur dicatat).
- **Urutan prioritas kriteria** (frekuensi + tiebreak relevansi CCTV): C1 > C9 > C2 > C5 > C8 > C4 > C7 > C3 > C6.
- **AHP:** 3 kelompok (pemerintah/kampus/warga), skala Saaty 1–9, agregasi geometric mean, CR<0,1 (angka acuan 0,046 dari [8] — masih ditandai `[FULLTEXT-VERIFY]`), validasi silang opsional EWM [12]. Rumus lengkap + contoh hitung 3-kriteria berlabel ILUSTRASI (w = 0,539/0,164/0,297; CR = 0,008) — bukan data lapangan.
- **TOPSIS:** matriks → normalisasi → bobot → jarak ideal → closeness → ranking; sensitivitas ±20% [8]. Contoh closeness dummy berlabel ILUSTRASI (S3 0,768 > S1 0,682 > S2 0,192).
- **Arsitektur 4 lapis:** Input (data diskrit) → Preprocessing (kodifikasi A1–A5) → Decision Engine (AHP+TOPSIS+GIS) → Output (peringkat + peta prioritas + urutan pemasangan bertahap).
- **Ditolak:** simulasi operasional #45 (kalibrasi mahal); BWM-CoCoSo #83 (selisih kecil, pakar tak ada). **Ditunda:** response time/egress #45. **Dicatat:** #121 gugur tahun.

---

## 6. Peta File (struktur per 5 Okt 2026)

```
README.md                        # peta cepat + status blokir
CONTEXT.md                       # FILE INI (full context)
00-brief\tugas.txt               # rubrik & ketentuan asli (SUMBER KEBENARAN requirements)
01-protokol\kerangka-paper-ieee.md   # outline paper, kontribusi, anti-tabrakan, checklist 6 poin
01-protokol\panduan-baca-anggota.md  # prompt Gemini + pembagian tugas
02-data\scopus-export-140.csv    # export kerja subset (BUKAN alur resmi)
02-data\screening-log-140.csv    # log screening subset kerja (BUKAN alur resmi)
02-data\eligibility-12.csv       # lembar kerja full-text 12 (Keputusan terisi; Fokus menunggu PDF)
02-data\tabel-paper-final.csv    # judul/abstrak/DOI/metode 12 inti
02-data\data-charting-12.csv     # charting 12 paper, 13 kolom (No, Paper, Domain, Komponen DSS, Metode, Kriteria, Relevansi Jatinangor, Arah_Kriteria, Tujuan, Masalah, Metode_Detail, Data_Detail, Hasil_Detail)
03-sintesis\tahap-2-charting-sintesis.md  # charting detail per paper + sintesis B.1–B.4
03-sintesis\tahap-2-charting-sintesis.tex # versi LaTeX, sama isi dengan .md
03-sintesis\tahap-3-model.md              # rumusan model A1–A5, C1–C9, AHP, TOPSIS, tolak/tunda
03-sintesis\tahap-3-model.tex             # versi LaTeX, sama isi dengan .md
04-paper\draft-paper.md          # DRAF LENGKAP paper (semua seksi I–V + 12 referensi IEEE)
04-paper\draft-paper.tex         # naskah LaTeX IEEEtran conference (Gambar 1 sudah pakai PNG; lint lolos, BELUM dicompile — mesin ini tak punya LaTeX)
04-paper\prisma-diagram.svg      # PRISMA alur resmi 582→12 (tanggal masih [ISI TANGGAL])
04-paper\prisma-diagram.png      # render 2x dari SVG (1342×1938, eksklusi tema sudah 109) — dipakai draft-paper.tex
99-arsip\                        # JANGAN dikutip di paper:
  JANGAN-DIPAKAI-promptclaude-smart-environment-lama.txt   # brief lama, domain salah
  JANGAN-DIPAKAI-prisma-salah-1719-deep-learning.png       # PRISMA contoh, angka salah
  ref-tim-lain-paper.pdf + ref-tim-lain-extract.txt        # paper tim lain (bahan belajar struktur)
```

---

## 7. Pelajaran dari Paper Tim Lain (bahan belajar, JANGAN ditiru kalimatnya)

File `99-arsip\ref-tim-lain-*.pdf/txt` = paper tim lain (topik mitigasi kriminalitas via patroli+PJU, Jatinangor juga, 12 paper juga). **Yang diadopsi (ide saja):** kontribusi bullet terikat RQ; RQ diulang verbatim di awal tiap subsection; caveat frekuensi metode; taksonomi benefit/cost/context-dependent + tabel terpisah; tabel sintesis "Temuan Literatur | Implikasi"; subseksi kelayakan adopsi 3 dimensi (kebutuhan data / kompleksitas / keluaran actionable); sketsa figure kotak-kotak. **Yang jangan ditiru:** metode tipis (tanpa angka tahapan), tanpa deklarasi Gen-AI, tanpa kolom relevansi studi kasus, dan jangan menyalin frasa/kalimatnya.

**Aturan anti-tabrakan (wajib):**
- Angle kita = **penempatan CCTV** (segmen gang, anggaran alat); mereka = rute patroli + PJU → jangan jadikan "patroli/PJU" fokus tulisan.
- Kriteria kita penomoran C1–C9; mereka C-cost/B-benefit → jangan ikut pola mereka.
- Metode kita AHP+TOPSIS; sebaran korpus: PROMETHEE/BWM/DEMATEL/EWM → **jangan klaim SAW/WP**.
- 2 paper kembar dgn kita ([2] S4AllCities, [7] UAV Astana) boleh ditapi dengan konteks berbeda.
- Draft selalu ditulis dari `data-charting-12.csv` + `tahap-2/3`, **bukan** dari `ref-tim-lain-extract.txt`.

---

## 8. Status & Sisa Pekerjaan

**Selesai:** protokol + angka PRISMA kunci (582→12); 12 paper inti & keputusan eligibility; charting + sintesis B.1–B.4; model A1–A5/C1–C9/AHP-TOPSIS; draft paper lengkap Seksi I–V + 12 referensi IEEE; SVG+PNG PRISMA 582 (**dikoreksi 118→109**, PNG di-render ulang 1342×1938); `draft-paper.tex` (IEEEtran conference, Gambar 1 terhubung PNG, lint lingkungan/sitasi/braces lolos); README/kerangka konsisten.

**Blokir (butuh manusia):**
1. `[TIM]` di draft + `[ISI TANGGAL]` di SVG — tanggal pencarian Scopus.
2. **12 PDF inti** → taruh di `02-data\pdf\` → agent baca, isi kolom `Fokus_Verifikasi_Fulltext` di eligibility (satu-satunya jalan menutup `[FULLTEXT-VERIFY]`, saat ini sisa 1: CR 0,046 [8]).
3. Nama final segmen A1–A5 (observasi lapangan).
4. Data lapangan C1–C9 × A1–A5 (counting, survei PJU, data kos, CCTV eksisting, RAB) untuk mengisi matriks → perhitungan AHP-TOPSIS.
5. Teks deklarasi Gen-AI (nama alat + peran + pernyataan verifikasi tim).
6. Compile & jumlah halaman: mesin ini **tidak punya pdflatex** → unggah folder `04-paper` ke Overleaf (atau LaTeX lokal), compile 2×, pastikan 6–8 halaman + Times New Roman 10pt (bawaan IEEEtran) + hapus blok komentar merah template, lalu ceklist 6 poin di `01-protokol\kerangka-paper-ieee.md`.

**Urutan lanjutan:** isi `[TIM]` → kumpulkan PDF → verifikasi Fokus → (opsional) naikkan cadangan jika perlu >12 → isi data lapangan → hitung AHP-TOPSIS → finalkan abstrak/angka → konversi IEEE → ceklist 6 poin di `01-protokol\kerangka-paper-ieee.md` → kirim.

**Konvensi kerja:** semua file teks UTF-8; bahasa paper Indonesia (istilah teknis Inggris); angka & sitasi hanya boleh berasal dari file `02-data`/`03-sintesis` — kalau tidak ada sumbernya, jangan ditulis; setiap klaim numerik di paper harus bisa ditelusuri ke charting atau PDF.
