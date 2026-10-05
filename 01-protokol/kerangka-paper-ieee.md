# Kerangka Paper IEEE (draf per seksi, 6-8 halaman, 2 kolom)

## Judul

Decision Support Systems for Urban Surveillance and Public Safety Facility Placement:
A Scoping Review and Conceptual Framework for CCTV Prioritization in Jatinangor Student Settlements

## Abstrak (draf, 150-250 kata — finalkan setelah sintesis)

Latar: permukiman mahasiswa Jatinangor padat, gang sempit, PJU terbatas, mobilitas malam tinggi, CCTV sporadis dan terkendala anggaran. Tujuan: memetakan literatur DSS surveillance & public safety facility placement dan merancang model konseptual prioritisasi CCTV. Metode: scoping review PRISMA-ScR di Scopus (query TITLE-ABS-KEY 3 blok, 2021-2026, article, Inggris; 582 screened → 416 sought → 121 assessed → 12 included). Hasil: [pola arsitektur dominan + metode dominan + kriteria]. Kontribusi: model konseptual segmen gang + 9 kriteria C1-C9 + AHP-TOPSIS + peta prioritas untuk Jatinangor.

## I. Pendahuluan

Paragraf 1: Jatinangor (12 desa, kawasan pendidikan UNPAD dkk; isu macet, sampah-banjir Cikeruh, kriminalitas kos). Paragraf 2: urgensi DSS/MCDM (budget constraint → butuh prioritisasi terukur). Paragraf 3: batasan studi + RQ1/RQ2/RQ3 (versi formal yang disetujui). Paragraf 4: **3 kontribusi bullet, masing-masing eksplisit terikat satu RQ** (kontribusi-1 → RQ1 pola arsitektur transferable; kontribusi-2 → RQ2 taksonomi kriteria; kontribusi-3 → RQ3 model segmen gang + AHP-TOPSIS).

## II. Metodologi Reviu (SCR Protocol)

Search string (kotak query), kriteria inklusi/eksklusi (tabel 6 baris v2: Article only, 2021-2026, Inggris+OA, MCDM eksplisit, konteks transferable), diagram PRISMA (`prisma-diagram.svg`, angka final setelah full-text + tanggal pencarian).

**Pertahankan (keunggulan kita atas paper tim lain — jangan diringkas):** angka per tahap resmi tim (582 screened → 166 lebih tua dari 2021 → 416 sought → 2 non-Ingris + 233 non-Artikel + 60 tak terakses → 121 assessed → 109 dieksklusi tema → 12 included), alasan eksklusi per kategori, tanggal pencarian, dan kolom "Relevansi Jatinangor" di charting. Paper tim lain tipis di bagian ini.

## III. Hasil dan Pembahasan (Sintesis RQ1/RQ2)

- Tiap subsection **dibuka dengan penulisan ulang RQ-nya secara verbatim** (blok kutip), baru jawaban.
- III-A RQ1: tabel charting ringkas (domain, komponen DSS, metode, kriteria utama, **relevansi Jatinangor**) + gambar taksonomi 5 pola (GIS-MCDM: #31/#11/#46; optimasi coverage: #39/#56; expert-driven: #37/#126/#83; simulasi-DSS: #45; policy-MCDA: #96/#74) + sketsa alur kotak per pola (Input → Engine → Output, gaya figure sederhana) + 1 paragraf jawaban.
- III-B RQ2: tabel frekuensi metode (AHP, TOPSIS, PROMETHEE, VIKOR, BWM, DEMATEL, COPRAS, EWM; peran bobot vs ranking; pemenang AHP+TOPSIS dari #14) **+ kalimat caveat: satu paper bisa memakai >1 metode sehingga frekuensi tidak dijumlahkan jadi persentase** + tabel taksonomi kriteria **benefit / cost / context-dependent** (kategori ketiga hanya untuk kriteria di charting yang arah preferensinya tidak eksplisit; jangan dipaksa biner) + 1 paragraf jawaban.
- III-C Sintesis akhir: **tabel "Temuan Literatur | Implikasi untuk Jatinangor"** (mencakup arsitektur, input, engine, bobot, ranking, output, transferability) — menggantikan paragraf panjang; ringkas dan hemat halaman.

## IV. Model Konseptual DSS Jatinangor (RQ3)

- Dibuka dengan RQ3 verbatim.
- IV-A Alternatif A1-A5 (segmen gang; nama final dari lapangan) + matriks C1-C9 (definisi, satuan, arah, sumber data + fallback).
- IV-B Skema AHP 3 stakeholder + CR + validasi EWM opsional; langkah TOPSIS + sensitivitas +-20%; **figure alur Pipeline AHP → TOPSIS → Ranking** (satu diagram, menggantikan banyak gambar kecil).
- IV-C Diagram arsitektur 4 lapis input-engine-output + justifikasi adopsi/penolakan (#45 roadmap UAS; BWM-CoCoSo ditolak; #121 catatan disiplin tahun).
- IV-D Kelayakan adopsi: evaluasi 3 dimensi — **kebutuhan data (rendah, non-streaming), kompleksitas metode (terukur, transparan), keluaran (langsung actionable: peta prioritas + urutan pemasangan sesuai budget)**. Sadur ide, tulis ulang dengan kosakata CCTV/prioritisasi kita.

## V. Kesimpulan dan Roadmap Software

Ringkasan pemetaan + model; roadmap pasca-UTS (pengumpulan data lapangan C1-C9, prototipe GIS-AHP-TOPSIS, pilot 1-2 gang, varian ideal real-time ala #45); keterbatasan (response time ditunda; 2021-2026; satu database).

## Deklarasi Gen-AI

[Wajib — paper tim lain tidak punya ini. Tulis alat yang dipakai + perannya: screening awal, draf charting, draf tulisan; verifikasi dan keputusan final oleh tim.]

## Aturan anti-tabrakan dengan `referenesi-dss-paper.pdf` (tim lain)

Topik, kampus, jumlah paper (12), dan alur PRISMA mereka mirip; 2 paper juga sama (S4AllCities, UAV Astana). Jaga perbedaan:

- **Angle:** kita = prioritisasi **penempatan CCTV** (segmen gang, anggaran alat); mereka = mitigasi kriminalitas via rute patroli + PJU. Jangan pakai frasa "patroli preventif", "rute patroli", "PJU sebagai kriteria" sebagai fokus.
- **Kriteria:** kita C1-C9 (semua benefit thd urgensi); mereka C1-C4/B1-B2. Struktur penomoran beda — jangan ikut pola C-cost/B-benefit.
- **Metode:** kita AHP+TOPSIS dengan sebaran PROMETHEE/BWM/DEMATEL/EWM; mereka pakai SAW & fuzzy MCDM — **jangan kutip SAW** (tidak ada di korpus kita).
- **Kosakata & struktur kalimat:** tulis draft dari `tahap-3-model.md` + `data-charting-12.csv` kita, jangan dari `_refpdf_text.txt`. File itu hanya bahan belajar struktur.
- Boleh tabrak judul/angka RQ, tapi kalimat RQ kita sudah final dan berbeda (RQ3 soal segmen gang + 9 kriteria + multistakeholder).

## Daftar Periksa Sebelum Kirim

1. Angka PRISMA + tanggal pencarian lengkap; `eligibility-12.csv` semua terisi (setelah 12 PDF masuk).
2. Tiap subsection RQ dibuka dengan RQ verbatim; 3 kontribusi di Pendahuluan terikat RQ.
3. Kalimat caveat frekuensi metode ada; taksonomi punya kategori context-dependent hanya jika perlu.
4. Tabel sintesis "Temuan | Implikasi" ada; figure cukup 3 (PRISMA, 5-pola/alur, pipeline AHP-TOPSIS).
5. Deklarasi Gen-AI terisi; tidak ada kalimat identik dengan `_refpdf_text.txt`.
6. Lint/format IEEE: 2 kolom, 6-8 halaman, 10-15 referensi (kita 12).

## Daftar Pustaka (format IEEE — 12 inti)

[1] L. Wang, Y. Zhang, T. Feng, and X. Qi, "Monitoring layout and optimisation method based on minimum weighted vertices of roads," *Applied Sciences*, vol. 15, no. 21, 2025, doi: 10.3390/app152111622.
[2] J. González-Villa *et al.*, "Decision-support system for safety and security assessment and management in smart cities," *Multimedia Tools and Applications*, vol. 83, no. 22, pp. 61971-61994, 2024, doi: 10.1007/s11042-023-16020-6.
[3] B. Feizizadeh and D. Omarzadeh, "A GIS based spatiotemporal modelling approach for cycling risk mapping using crowd-sourced sensor data," *Annals of GIS*, vol. 31, no. 2, pp. 333-351, 2025, doi: 10.1080/19475683.2025.2453550.
[4] V. Ahmed *et al.*, "A multi-attribute utility decision support tool for a smart campus—UAE as a case study," *Frontiers in Built Environment*, vol. 8, 2022, doi: 10.3389/fbuil.2022.1044646.
[5] J. Choi, J. Ok, and I. Yu, "Smart city technologies for apartment complexes in South Korea: expert prioritization and expected utility evaluation," *J. Asian Architecture and Building Engineering*, 2025, doi: 10.1080/13467581.2025.2605740.
[6] H. Kanj *et al.*, "Dynamic decision making process for dangerous good transportation using a combination of TOPSIS and AHP methods with fuzzy sets," *IEEE Access*, vol. 12, pp. 40450-40479, 2024, doi: 10.1109/ACCESS.2024.3372852.
[7] I. Kabashkin *et al.*, "Synchronized multi-point UAV-based traffic monitoring for urban infrastructure decision support," *Drones*, vol. 9, no. 5, 2025, doi: 10.3390/drones9050370.
[8] O. Baddour, A. Bhogayata, and T. Vora, "Intelligent decision support for diplomatic quarter planning through multi-criteria analysis and urban intelligence," *J. Intelligent Decision Making and Information Science*, vol. 3, no. 3S, pp. 1612-1629, 2026, doi: 10.59543/jidmis.v3.958.
[9] S. F. Almassawa *et al.*, "Policy on the implementation of smart mobility in South Tangerang City, Indonesia based on public transportation using the PROMETHEE method," *Planning Malaysia*, vol. 22, no. 5, pp. 293-306, 2024, doi: 10.21837/pm.v22i34.1590.
[10] M. A. A. Shiddiqy *et al.*, "An integrated smart defense architecture for the Nusantara capital city of Indonesia," *Int. J. Safety and Security Engineering*, vol. 15, no. 12, pp. 2561-2572, 2025, doi: 10.18280/ijsse.151213.
[11] X. Zheng, K. Wang, and M. Liu, "A Bayesian Network and DEMATEL-ISM approach for smart community flood risk assessment: a case study of Tangxia, China," *J. Cases on Information Technology*, vol. 27, no. 1, 2025, doi: 10.4018/JCIT.386165.
[12] E. Yuhang *et al.*, "Sensor placement optimization for power grid condition monitoring based on a backup coverage model: a case study of Guangzhou," *Applied Sciences*, vol. 15, no. 23, 2025, doi: 10.3390/app152312570.
