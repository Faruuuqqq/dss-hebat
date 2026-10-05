# Tahap 2: Data Charting & MCDM Synthesis
## Proyek: DSS Prioritisasi CCTV Permukiman Mahasiswa Jatinangor (Smart Living & Safety)

*Sumber: 12 paper inti tahap eligibility (full-text). File pendamping: `tabel-paper-final.csv` (judul/abstrak/DOI/metode), `eligibility-12.csv` (lembar kerja full-text).*

---

## Bagian A: Charting Detail 12 Paper

### Paper 1 — Wang et al. (2025), Applied Sciences
**Judul:** Monitoring Layout and Optimisation Method Based on Minimum Weighted Vertices of Roads
**Main problem:** Penyebaran kamera pengawas boros (terlalu banyak tiang dan kamera) sementara cakupan jalan belum tentu penuh; konflik antara budget dan coverage.
**Tujuan:** Mengusulkan model coverage kamera berbasis vertex jalan dan metode deployment MWVC agar cakupan jalan penuh dengan biaya minimum.
**Data (input):** Simpul/vertex jaringan jalan; derajat ketetanggaan tiap simpul (adjacency degree); model coverage kamera.
**Karakteristik metode:** Minimum Weighted Vertex Cover (MWVC) + greedy algorithm; bobot vertex diturunkan dari derajat simpul sehingga persimpangan penting diprioritaskan.
**Output & manfaat:** Jumlah tiang 62 menjadi 33 (minus 46,8%), kamera 196 menjadi 98 (minus 50%), coverage jalan tetap 100% pada studi kota Wuwei. Simulasi 10.000 run: minus 15 titik dibanding MVC (reduksi relatif 2%). Bukti kuantitatif bahwa sedikit titik dengan penempatan tepat mengalahkan banyak titik sporadis.
**Benefit/Cost:** Benefit: coverage jalan. Cost: jumlah tiang dan kamera.
**Relevansi Jatinangor:** JANGKAR UTAMA. Alternatif level segmen jalan; C4 (efisiensi coverage); C6 (derajat simpul); C7 (blind-zone); C9 (efisiensi tiang). Argumen budget constraint.

### Paper 2 — Gonzalez-Villa et al. (2024), Multimedia Tools and Applications (S4AllCities)
**Judul:** Decision-support system for safety and security assessment and management in smart cities
**Main problem:** Ancaman terorisme di keramaian dan infrastruktur kritis; operator keamanan butuh dukungan keputusan real-time pada fase pencegahan maupun intervensi.
**Tujuan:** Membangun DSS terintegrasi untuk asesmen dan manajemen safety-security smart city pada fase pencegahan dan intervensi, terintegrasi dengan legacy system dan teruji via pilot operasional.
**Data (input):** Pergerakan pejalan kaki dan kendaraan; model ancaman (probabilitas IED, kebakaran, penembakan); status jaringan lalu lintas normal vs anomali.
**Karakteristik metode:** DSS terintegrasi (non-MCDM): model prediktif progresi serangan + model probabilistik asesmen ancaman; diuji melalui pilot operasional di kota nyata; terintegrasi dengan legacy system.
**Output & manfaat:** Strategi evakuasi optimal; estimasi egress time; profil pergerakan pejalan; probabilitas ancaman; rute intervensi optimal. Arsitektur DSS safety paling lengkap (pencegahan + intervensi). Teruji via pilot operasional di kota nyata; metrik kuantitatif efektivitas [FULLTEXT-VERIFY].
**Benefit/Cost:** Benefit: kesiapan dan kapabilitas evakuasi. Context-dependent: probabilitas ancaman (arah tergantung formulasi model).
**Relevansi Jatinangor:** PEMBANDING ARSITEKTUR (RQ1). Pola simulasi-DSS sengaja TIDAK diadopsi untuk Jatinangor karena membutuhkan data kalibrasi yang mahal dan tidak tersedia. Elemen response time/egress dicatat sebagai keterbatasan data dan riset lanjutan.

### Paper 3 — Feizizadeh & Omarzadeh (2025), Annals of GIS
**Judul:** A GIS based spatiotemporal modelling approach for cycling risk mapping using crowd-sourced sensor data
**Main problem:** Risiko dan ketidaknyamanan pesepeda tidak terpetakan sehingga intervensi keselamatan tidak tepat sasaran.
**Tujuan:** Mengestimasi risiko dan ketidaknyamanan pesepeda Berlin dari crowd-sensor dan memetakannya melalui analisis multi-kriteria berbasis GIS.
**Data (input):** Crowd-sensor (kecepatan, getaran sepeda, jarak ke objek); volume lalu lintas; guna lahan; karakteristik sosiodemografi; kondisi jalur (Berlin, dataset OpenSenseMap).
**Karakteristik metode:** Statistik spasial + analisis multi-kriteria berbasis GIS; estimasi volume dan diskontinuitas rute secara spatiotemporal.
**Output & manfaat:** Peta risiko pesepeda; korelasi signifikan antara volume-ketidaknyamanan dengan guna lahan komersial/residensial serta kawasan sekolah dan universitas. Area pusat Berlin tertinggi pada volume dan discomfort (koefisien korelasi [FULLTEXT-VERIFY]).
**Benefit/Cost:** Benefit: volume dan risiko terpetakan (terhadap urgensi).
**Relevansi Jatinangor:** Pola GIS-multikriteria untuk RQ1/RQ3. C2 (volume mobilitas); C5 (sosiodemografi); C8 (guna lahan kos dan kampus). Template metodologis peta prioritas gang.

### Paper 4 — Ahmed et al. (2022), Frontiers in Built Environment
**Judul:** A multi-attribute utility decision support tool for a smart campus (UAE as a case study)
**Main problem:** Transformasi smart campus mengabaikan persepsi pengguna; keputusan investasi teknologi butuh dasar yang objektif dan disepakati stakeholder.
**Tujuan:** Mengklasifikasikan kriteria smart campus terpenting berbasis persepsi empat kelompok stakeholder dan membangun decision support tool investasi.
**Data (input):** Survei mahasiswa, dosen, staf administrasi, dan personel IT; daftar kriteria dari literatur smart campus.
**Karakteristik metode:** AHP antar kelompok stakeholder + model utility function menjadi decision support tool investasi.
**Output & manfaat:** Konsensus lintas kelompok: smart security and safety, navigasi kampus, dan adaptive learning adalah kriteria terpenting; dihasilkan tool keputusan investasi optimum.
**Benefit/Cost:** Benefit: smart security and safety, navigasi kampus, adaptive learning (konsensus lintas kelompok).
**Relevansi Jatinangor:** Skema pembobotan AHP tiga pihak atau lebih untuk RQ3. Konteks kampus mendekati Jatinangor. C8/C9. Bukti bahwa safety dipersepsikan terpenting oleh penghuni kawasan pendidikan.

### Paper 5 — Choi et al. (2025), Journal of Asian Architecture and Building Engineering
**Judul:** Smart city technologies for apartment complexes in South Korea
**Main problem:** Teknologi smart city apa yang harus diprioritaskan untuk hunian vertikal padat (60% populasi Korea tinggal di apartemen).
**Tujuan:** Memprioritaskan 16 teknologi dan mengevaluasi expected utility-nya pada tiga skenario (peningkatan nilai aset, hunian high-tech, kepuasan residensial).
**Data (input):** 16 teknologi pada 4 domain (mobilitas, environment, safety, welfare); penilaian panel 22 ahli akademisi dan industri.
**Karakteristik metode:** MCDM terintegrasi + evaluasi expected utility pada tiga skenario (peningkatan nilai aset, hunian high-tech, kepuasan residensial).
**Output & manfaat:** Domain smart safety dan smart environment terpenting untuk deployment teknologi residensial; panduan bagi perencana dan penyedia layanan. Bobot dan skor PRI per teknologi [FULLTEXT-VERIFY].
**Benefit/Cost:** Benefit: importance dan expected utility (nilai aset, high-tech, kepuasan).
**Relevansi Jatinangor:** Justifikasi fokus safety untuk hunian kos-kosan padat. C5/C8. Logika multi-skenario diadaptasi (skenario anggaran vs kepuasan warga).

### Paper 6 — Kanj et al. (2024), IEEE Access
**Judul:** Dynamic Decision Making Process for Dangerous Good Transportation Using a Combination of TOPSIS and AHP Methods with Fuzzy Sets
**Main problem:** Risiko pengangkutan barang berbahaya di smart city; rute harus meminimalkan potensi kejadian berbahaya.
**Tujuan:** Menentukan rute barang berbahaya teraman melalui kombinasi Fuzzy AHP-TOPSIS pada lingkungan statis vs dinamis.
**Data (input):** Data real-time cloud; tiga kriteria: cost, duration, risk.
**Karakteristik metode:** Fuzzy AHP untuk pembobotan + Fuzzy TOPSIS untuk perankingan rute; diuji pada lingkungan statis vs dinamis (keputusan dapat berubah mengikuti nilai kriteria).
**Output & manfaat:** Risiko turun dan safety meningkat; template hybrid bobot-ranking dengan kriteria tiga serangkai yang ringkas. Besaran penurunan risiko [FULLTEXT-VERIFY].
**Benefit/Cost:** Cost: cost, duration. Benefit terhadap urgensi: risk.
**Relevansi Jatinangor:** JUSTIFIKASI INTI AHP-TOPSIS (RQ3). C1 (risk); C9 (cost). Mewakili pola dominan RQ2 (AHP untuk bobot, TOPSIS untuk ranking).

### Paper 7 — Kabashkin et al. (2025), Drones
**Judul:** Synchronized Multi-Point UAV-Based Traffic Monitoring for Urban Infrastructure Decision Support
**Main problem:** Monitoring lalu lintas kota terfragmentasi (titik observasi terpisah dan tidak sinkron) sehingga keputusan infrastruktur tidak berbasis gambaran jaringan; dibutuhkan evaluasi skenario intervensi yang objektif.
**Tujuan:** Melakukan monitoring sinkron multi-titik via armada UAV dan mengevaluasi 6 skenario infrastruktur melalui kerangka MCDM.
**Data (input):** Video real-time armada UAV terkoordinasi di 30 titik observasi kritis pada jam sibuk (distrik GreenLine, Astana); parameter flow, kecepatan, dan delay.
**Karakteristik metode:** Pengumpulan aerial sinkron multi-titik + kalibrasi model simulasi lalu lintas + evaluasi 6 skenario infrastruktur dengan kerangka MCDM.
**Output & manfaat:** Skenario intervensi terefektif teridentifikasi (nama skenario [FULLTEXT-VERIFY]); pendekatan replicable yang menghubungkan sensing sinkron dengan evaluasi berbasis simulasi.
**Benefit/Cost:** Context-dependent: flow, kecepatan, delay (arah tergantung skenario evaluasi).
**Relevansi Jatinangor:** Penutup lubang spasial pasca #121 gugur aturan tahun (evaluasi skenario spasial multi-kriteria). C2 (flow/delay). Logika 30 titik kritis diterjemahkan menjadi sampling segmen gang Jatinangor. Adaptasi: armada UAV tidak tersedia, diganti observasi manual dan CCTV eksisting.

### Paper 8 — Baddour et al. (2026), Journal of Intelligent Decision Making and Information Science
**Judul:** Intelligent Decision Support for Diplomatic Quarter Planning Through Multi-Criteria Analysis and Urban Intelligence
**Main problem:** Perencanaan diplomatic quarter multi-faktor (security, aksesibilitas, infrastruktur, resilience, sustainability) yang kompleks dan subjektif.
**Tujuan:** Membangun framework BWM-CoCoSo dengan komparasi langsung terhadap AHP, TOPSIS, dan VIKOR untuk perencanaan diplomatic quarter berbasis bukti.
**Data (input):** Dataset urban dan gedung yang tersedia publik; kriteria arsitektural, lingkungan, dan urban.
**Karakteristik metode:** BWM untuk bobot + CoCoSo untuk ranking, dikomparasi langsung dengan AHP, TOPSIS, VIKOR; agreement pakar 92,8% vs 88,6%; robustness 0,91 vs 0,84; stabil pada sensitivitas +-20%.
**Output & manfaat:** Bukti komparatif kinerja metode berangka; framework yang skalabel dan objektif.
**Benefit/Cost:** Benefit: security, accessibility, infrastructure, sustainability, resilience.
**Relevansi Jatinangor:** Komparasi metode untuk RQ2. Kriteria security/accessibility/infrastructure menjadi C1/C8/C9. Alasan memilih AHP-TOPSIS: selisih kinerja kecil tetapi jauh lebih sederhana dengan pakar yang tersedia di Jatinangor.

### Paper 9 — Almassawa et al. (2024), Planning Malaysia
**Judul:** Policy on the implementation of smart mobility in South Tangerang City, Indonesia based on public transportation using the PROMETHEE method
**Main problem:** Kesiapan implementasi smart mobility di South Tangerang yang urbanisasinya cepat.
**Tujuan:** Menilai kesiapan smart mobility berbasis transportasi publik di South Tangerang dan menyusun model strategi kebijakan perencanaannya.
**Data (input):** Indikator availability, security, comfort transportasi publik; analisis multivariat + MCDA.
**Karakteristik metode:** PROMETHEE untuk model strategi kebijakan.
**Output & manfaat:** Ditemukan belum siap; rekomendasi security, reorganisasi rute, informasi real-time. Relevan untuk negara berkembang. Skor indikator kesiapan [FULLTEXT-VERIFY].
**Benefit/Cost:** Benefit: availability, security, comfort (sebagai kesiapan).
**Relevansi Jatinangor:** Variasi metode RQ2 (PROMETHEE). Indikator security menjadi C1. Salah satu dari dua konteks Indonesia.

### Paper 10 — Shiddiqy et al. (2025), Int. Journal of Safety and Security Engineering
**Judul:** An Integrated Smart Defense Architecture for the Nusantara Capital City of Indonesia
**Main problem:** Arsitektur pertahanan IKN yang multidimensi (teknologi, ketahanan nasional, keamanan publik).
**Tujuan:** Merancang arsitektur smart defense IKN melalui SWOT dan prioritisasi AHP berbasis dokumen sekunder.
**Data (input):** Dokumen kebijakan pertahanan, dokumen perencanaan strategis, kasus ibu kota dunia (data sekunder).
**Karakteristik metode:** SWOT untuk identifikasi faktor, dilanjutkan AHP untuk prioritisasi.
**Output & manfaat:** C4ISR 46,6%; AI-surveillance 27,7%; keamanan infrastruktur digital 16,1%. Bobot surveillance kuantitatif dari AHP.
**Benefit/Cost:** Benefit: C4ISR, AI-surveillance, keamanan infrastruktur digital, kolaborasi (bobot prioritas).
**Relevansi Jatinangor:** Legitimasi bobot tinggi untuk surveillance (C4/C7). Bukti AHP dapat berjalan dari data sekunder/dokumen, cocok untuk keterbatasan data Jatinangor. Konteks Indonesia kedua.

### Paper 11 — Zheng et al. (2025), Journal of Cases on Information Technology
**Judul:** A Bayesian Network and DEMATEL-ISM Approach for Smart Community Flood Risk Assessment (Tangxia, China)
**Main problem:** Waterlogging komunitas padat akibat iklim dan urbanisasi; tata drainase perlu optimasi.
**Tujuan:** Membangun model kopling DEMATEL-ISM dan Bayesian Network untuk asesmen risiko waterlogging dan evaluasi renovasi drainase (studi Tangxia, Guangzhou).
**Data (input):** Faktor alam + sosial; data sosioekonomi; IoT; ArcGIS (komunitas Tangxia, Guangzhou).
**Karakteristik metode:** DEMATEL-ISM untuk struktur hierarki faktor + Bayesian Network untuk inferensi probabilistik dinamis; analisis sensitivitas intervensi.
**Output & manfaat:** Upgrade kapasitas drainase 500 m3/hr menurunkan probabilitas risiko 33,8%. Model analysis-design-transformation untuk kawasan padat.
**Benefit/Cost:** Context-dependent: faktor alam dan sosial (arah beda per faktor); kapasitas drainase sebagai benefit intervensi.
**Relevansi Jatinangor:** Variasi metode struktural RQ2. Logika intervensi terukur menjadi C3 (PJU) dan C9. Toolchain Python + ArcGIS untuk RQ3.

### Paper 12 — Yuhang et al. (2025), Applied Sciences
**Judul:** Sensor Placement Optimization for Power Grid Condition Monitoring Based on a Backup Coverage Model (Guangzhou)
**Main problem:** Trade-off penempatan sensor: coverage vs redundansi vs biaya monitoring grid kota.
**Tujuan:** Mengoptimasi penempatan sensor grid kota via EWM dan model Backup Coverage Sensor Location Problem (BCSLP) untuk trade-off coverage vs resilience vs biaya.
**Data (input):** Proximity infrastruktur + kepadatan penduduk; pembobotan Entropy Weight Method.
**Karakteristik metode:** EWM untuk bobot objektif + model Backup Coverage Sensor Location Problem (BCSLP) + Genetic Algorithm; strategi balanced resilience-biased terbukti optimal.
**Output & manfaat:** Strategi ekstrem (breadth-only atau resilience-only) suboptimal; framework risk-informed yang skalabel. Strategi balanced resilience-biased terbukti optimal (angka trade-off [FULLTEXT-VERIFY]).
**Benefit/Cost:** Benefit: primary/backup coverage, resilience. Cost: risiko, biaya.
**Relevansi Jatinangor:** C4/C7/C9 + C5 (density). EWM sebagai opsi validasi silang bobot objektif terhadap AHP subjektif di RQ3.

---

## Bagian B: Sintesis Gabungan (bukan satu paper)

### B.1 Taksonomi arsitektur DSS (jawaban RQ1)

Matriks komponen per paper (abstraksi domain-agnostic: yang dipakai untuk model Jatinangor adalah pola alurnya, bukan variabel fisiknya):

| Paper | Input | Engine | Output |
|---|---|---|---|
| #39 Wang | Simpul jalan + derajat adjacency + model coverage | MWVC + greedy | Titik kamera/tiang optimal, coverage 100% |
| #45 S4AllCities | Pergerakan pejalan/kendaraan + model ancaman | Prediktif + probabilistik (simulasi) | Evakuasi, egress time, rute intervensi |
| #31 Feizizadeh | Crowd-sensor + volume + guna lahan + sosiodemografi | Statistik spasial + MCDA-GIS | Peta risiko spasial |
| #37 Ahmed | Survei 4 kelompok + kriteria literatur | AHP antar-stakeholder + utility | Tool keputusan investasi |
| #126 Choi | 16 teknologi + panel 22 ahli | MCDM + expected utility 3 skenario | Prioritas teknologi/domain |
| #14 Kanj | Data cloud + cost/duration/risk | Fuzzy AHP + Fuzzy TOPSIS | Rute teraman (statis vs dinamis) |
| #46 Kabashkin | Video UAV 30 titik + flow/speed/delay | Simulasi + kerangka MCDM | Evaluasi 6 skenario |
| #83 Baddour | Dataset urban publik | BWM + CoCoSo (komparasi AHP/TOPSIS/VIKOR) | Ranking skenario |
| #96 Almassawa | Indikator availability/security/comfort | PROMETHEE | Strategi kebijakan |
| #74 Shiddiqy | Dokumen kebijakan sekunder | SWOT + AHP | Prioritas komponen berbobot |
| #11 Zheng | Faktor alam-sosial + IoT + ArcGIS | DEMATEL-ISM + Bayesian Network | Risiko + evaluasi intervensi |
| #56 Yuhang | Proximity + kepadatan (EWM) | BCSLP + Genetic Algorithm | Strategi coverage balanced |

| Pola | Paper pendukung | Nasib di model Jatinangor |
|---|---|---|
| GIS-MCDM dan evaluasi skenario spasial | #31, #11, #46 | DIPAKAI sebagai arsitektur utama (menggantikan template #121 yang gugur aturan tahun) |
| Optimasi coverage | #39, #56 | DIPAKAI untuk logika penempatan titik |
| Expert-driven (survei + AHP) | #37, #126, #83 | DIPAKAI untuk skema pembobotan |
| Simulasi-DSS operasional | #45 | DITOLAK (butuh data kalibrasi mahal) |
| Policy-MCDA | #96, #74 | DIPAKAI untuk framing rekomendasi kebijakan |

### B.2 Sebaran metode MCDM (jawaban RQ2)

Frekuensi pemakaian primer (aturan hitung: metode yang dipakai sebagai engine utama paper; komparator pada #83 dicatat terpisah, bukan sebagai pemakai):

| Metode | Dipakai primer di | Frekuensi |
|---|---|---|
| AHP / Fuzzy AHP (pembobotan) | #37, #14, #74 | 3 paper |
| BWM (pembobotan) | #83 | 1 paper |
| Entropy Weight Method (pembobotan objektif) | #56 | 1 paper |
| TOPSIS / Fuzzy TOPSIS (perankingan) | #14 | 1 paper |
| CoCoSo (perankingan) | #83 | 1 paper |
| PROMETHEE (perankingan) | #96 | 1 paper |
| DEMATEL-ISM + Bayesian Network (struktural) | #11 | 1 paper |
| MCDM multi-skenario (evaluasi spasial) | #46 | 1 paper |
| MCDM + expected utility (multi-skenario) | #126 | 1 paper |
| Non-MCDM: MWVC+greedy (optimasi) | #39 | 1 paper |
| Non-MCDM: DSS simulasi terintegrasi | #45 | 1 paper |
| Non-MCDM: statistik spasial + MCDA-GIS | #31 | 1 paper |

Catatan komparasi (bukan pemakaian primer): #83 membandingkan BWM-CoCoSo vs AHP-TOPSIS vs VIKOR (agreement pakar 92,8% vs 88,6%; robustness 0,91 vs 0,84; CR 0,046 vs 0,071). SAW dan WP tidak ditemukan eksplisit pada 12 studi inti.

| Peran | Metode dominan | Paper |
|---|---|---|
| Pembobotan subjektif | AHP, BWM | #14, #37, #83, #74 |
| Pembobotan objektif | Entropy (EWM) | #56 |
| Perankingan | TOPSIS/Fuzzy TOPSIS, CoCoSo, PROMETHEE | #14, #83, #96 |
| Struktural/kausal | DEMATEL-ISM, Bayesian | #11 |
| Evaluasi skenario spasial | MCDM multi-skenario | #46 |
| Pola pemenang | AHP (bobot) + TOPSIS (ranking) | #14 |

### B.3 Taksonomi kriteria benefit/cost (jawaban RQ2, bahan RQ3)

Frekuensi dukungan tiap kriteria model terhadap korpus (arah dirumuskan terhadap urgensi: skor tinggi = makin prioritas):

| Kriteria | Muncul di paper | Frekuensi | Arah (thd urgensi) |
|---|---|---|---|
| C1 Riwayat kerawanan | #83, #14, #96, #31 | 4 paper | Benefit |
| C2 Volume mobilitas malam | #31, #46, #96 | 3 paper | Benefit |
| C5 Kepadatan penghuni | #56, #31, #126 | 3 paper | Benefit |
| C8 Kedekatan guna lahan rentan | #31, #83, #37 | 3 paper | Benefit |
| C9 Kelayakan implementasi | #14, #39, #83 | 3 paper | Benefit |
| C3 Defisiensi penerangan | #83, #11 | 2 paper | Benefit |
| C4 Efisiensi coverage | #39, #56 | 2 paper | Benefit |
| C7 Coverage gap CCTV eksisting | #39, #56 | 2 paper | Benefit |
| C6 Derajat simpul jalan | #39 | 1 paper (sumber tunggal, dicatat apa adanya) | Benefit |

Semua arah dirumuskan terhadap urgensi (skor tinggi = makin prioritas): kriminalitas dan risiko (#83, #14, #96); mobilitas dan volume (#31, #96); infrastruktur dan penerangan (#83, #11); coverage dan gap (#39, #56); kepadatan hunian (#56, #31, #126); guna lahan dan proximity (#31, #83, #37); biaya dan kesiapan (#14, #39, #83).

### B.3b Pemetaan kriteria cost literatur ke model Jatinangor

Benefit dan cost adalah sifat kriteria dalam suatu formulasi keputusan, bukan sifat absolut nama variabel. Kriteria berarah cost di paper sumber tidak diadopsi mentah-mentah, melainkan diperlakukan sebagai berikut:

| Kriteria cost di literatur | Paper | Perlakuan di model Jatinangor |
|---|---|---|
| Jumlah tiang dan kamera | #39 | Diserap ke C9 (kelayakan) + kendala anggaran bertahap |
| Biaya implementasi | #83 | Diserap ke C9 (komponen biaya dalam skor kelayakan) |
| Latency dan emisi | #56 | Kendala operasional, bukan kriteria (ditunda, data tak tersedia) |
| Risiko kecelakaan | #46 | Dibalik menjadi urgensi C1 (risiko tinggi = makin prioritas) |
| Duration (waktu tempuh) | #14 | Bukan kriteria CCTV; aspek paparan diwakili C2 |
| Cost (transportasi) | #14 | Diserap ke C9 |

Aturan kejujuran klasifikasi: jika arah preferensi sebuah kriteria di paper sumber tidak eksplisit, catat sebagai *context-dependent* di charting — jangan dipaksa masuk benefit/cost hanya dari nama variabel.

### B.4 Penurunan model Jatinangor (jawaban RQ3)

Alternatif = segmen gang (dari #39 dan #31). Delapan dari sembilan kriteria C1-C9 ditelusur ke minimal dua paper pada tabel B.3; hanya C6 (derajat simpul jalan) yang bersumber tunggal pada #39 dan dicatat apa adanya. Pembobotan AHP multistakeholder (pemerintah, kampus, warga) mengikuti #37 dengan angka acuan #83 dan #74. Perankingan TOPSIS mengikuti pola pemenang B.2. Elemen yang ditolak: simulasi operasional ala #45 dan BWM-CoCoSo ala #83 (argumen tercatat di charting). Elemen ditunda: response time ala #45 (data tidak tersedia; menjadi keterbatasan dan riset lanjutan).
