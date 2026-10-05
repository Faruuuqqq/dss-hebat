# DRAFT PAPER IEEE (bahan kerja, bukan naskah final)

> **Daftar tanda yang harus diisi sebelum kirim:**
> - `[TIM]` : tanggal pencarian Scopus (fakta tim).
> - `[FULLTEXT-VERIFY]` : klaim yang harus dicek ke PDF inti (folder `02-data\`, file `eligibility-12.csv`).
> - Nama segmen A1-A5 di Seksi IV adalah contoh operasional, diganti nama lapangan final.
> - Angka PRISMA final (dari catatan tim, sudah balance): 582 disaring → 166 lebih tua dari 2021 → 416 diminta → 2 non-Ingris + 233 non-Artikel + 60 tak dapat diakses → 121 dinilai → 109 dieksklusi tema → **12 disertakan**.

---

# Decision Support Systems for Urban Surveillance and Public Safety Facility Placement: A Scoping Review and Conceptual Framework for CCTV Prioritization in Jatinangor Student Settlements

**Ringkasan**—Permukiman mahasiswa Jatinangor diwarnai gang sempit, penerangan jalan terbatas, mobilitas malam tinggi, dan penempatan CCTV yang sporadis akibat keterbatasan anggaran, sehingga alokasi fasilitas pengawasan memerlukan prioritisasi yang terukur. Kajian ini memetakan literatur Decision Support System (DSS) untuk urban surveillance dan public safety facility placement melalui scoping review berbasis PRISMA-ScR di database Scopus (TITLE-ABS-KEY; 2021-2026, artikel, bahasa Inggris), dengan alur seleksi 582 rekaman disaring, 416 laporan diminta untuk diambil, 121 laporan dinilai pada tahap teks lengkap, dan 12 studi disertakan. Sintesis menunjukkan lima pola arsitektur DSS (GIS-MCDM, optimasi coverage, expert-driven, simulasi-DSS, dan policy-MCDA), sebaran metode MCDM dengan pola dominan AHP untuk pembobotan dan TOPSIS untuk perankingan, serta taksonomi kriteria benefit, cost, dan context-dependent. Berdasarkan sintesis tersebut, dirumuskan model konseptual DSS untuk Jatinangor berupa alternatif segmen gang (A1-A5), matriks sembilan kriteria keselamatan (C1-C9), skema pembobotan AHP tiga kelompok pemangku kepentingan, dan perankingan TOPSIS yang menghasilkan peta prioritas penempatan CCTV bertahap sesuai anggaran.

**Kata Kunci**—Decision Support System, Multi-Criteria Decision Making, Scoping Review, PRISMA-ScR, AHP, TOPSIS, CCTV placement, Smart Living and Safety, Jatinangor.

---

## I. PENDAHULUAN

Kawasan Jatinangor, Kabupaten Sumedang, merupakan kawasan pendidikan tinggi dengan konsentrasi perguruan besar dan ribuan mahasiswa yang menghuni indekos serta rumah susun di sepanjang koridor kampus. Pertumbuhan hunian padat ini tidak diimbangi kapasitas pengawasan lingkungan: gang-gang permukiman sempit, jangkauan Penerangan Jalan Umum (PJU) belum merata, dan mobilitas malam hari tinggi antara kampus, indekos, dan simpul layanan. Kondisi tersebut menempatkan isu keselamatan dan keamanan warga, khususnya mahasiswa, sebagai persoalan Smart Living and Safety yang nyata di Jatinangor.

Fasilitas pengawasan seperti CCTV hanya dapat ditambahkan secara terbatas karena terkendala anggaran, tiang, pasokan listrik, dan jaringan. Penempatan yang sporadis justru menghasilkan blind zone dan investasi yang tidak efisien. Decision Support System (DSS) berbasis Multi-Criteria Decision Making (MCDM) menawarkan jalur yang sesuai: beberapa kriteria dinilai secara simultan untuk menghasilkan skor dan perankingan alternatif, sehingga keputusan alokasi anggaran memiliki dasar yang dapat dipertanggungjawabkan. Dalam literatur, AHP lazim dipakai untuk pembobotan kriteria berbasis penilaian pakar, sedangkan TOPSIS dipakai untuk perankingan alternatif [6], dan kombinasi keduanya terbukti bekerja pada data tabular serta penilaian pakar tanpa infrastruktur sensor berbiaya tinggi [8].

Kajian ini dibatasi pada domain Smart Living and Safety di kawasan Jatinangor dengan bukti empiris yang tersedia secara lokal (data tabular, spasial statis, dan penilaian pakar), serta pada literatur scoping review terbitan 2021-2026. Melalui pemetaan literatur yang terstruktur, kajian ini dipandu oleh tiga pertanyaan penelitian:

- **RQ1 (Pemetaan Arsitektur DSS):** Bagaimana arsitektur DSS Smart Living & Safety dipetakan dari literatur (alur input data heterogen ke engine MCDM/analitik lalu output keputusan), dan pola mana yang paling transferable terhadap keterbatasan data Jatinangor?
- **RQ2 (Sebaran Metode & Taksonomi Kriteria MCDM):** Metode MCDM apa yang digunakan dalam DSS Smart Living & Safety, bagaimana skema pembobotan dan perankingannya diterapkan, serta bagaimana kriteria keputusan diklasifikasikan berdasarkan atribut benefit dan cost?
- **RQ3 (Formulasi Model Konseptual Jatinangor):** Model konseptual DSS seperti apa yang paling layak diterapkan untuk prioritisasi CCTV di permukiman mahasiswa Jatinangor, mencakup representasi segmen gang sebagai alternatif, struktur sembilan kriteria keselamatan, skema pembobotan AHP multistakeholder dan perankingan TOPSIS, serta elemen literatur apa yang sengaja tidak diadopsi beserta alasannya?

Kontribusi kajian ini terhadap jawaban ketiga RQ tersebut adalah sebagai berikut:

- **Kontribusi pertama (RQ1):** pemetaan lima pola arsitektur DSS keselamatan perkotaan beserta penanda kebutuhan datanya, sehingga teridentifikasi pola GIS-MCDM dan optimasi coverage sebagai arsitektur paling transferable untuk Jatinangor, sementara pola simulasi-DSS ditolak dengan argumen kebutuhan kalibrasi yang tidak tersedia.
- **Kontribusi kedua (RQ2):** taksonomi sebaran metode MCDM (peran pembobotan, perankingan, struktural, dan evaluasi skenario) serta klasifikasi kriteria keputusan ke dalam atribut benefit, cost, dan context-dependent sebagai dasar rumusan kriteria model Jatinangor.
- **Kontribusi ketiga (RQ3):** model konseptual prioritisasi CCTV berupa alternatif segmen gang A1-A5, matriks sembilan kriteria C1-C9 dengan sumber data dan fallback, skema AHP tiga kelompok pemangku kepentingan yang diuji konsistensinya, perankingan TOPSIS dengan analisis sensitivitas, serta catatan elemen yang ditolak dan ditunda beserta alasannya.

## II. METODOLOGI REVIU (SCR PROTOCOL)

Kajian ini menggunakan pendekatan Scoping Review dengan seleksi studi mengikuti alur Preferred Reporting Items for Systematic Reviews and Meta-Analyses Extension for Scoping Reviews (PRISMA-ScR). Protokol ditetapkan sebelum pencarian, mencakup strategi pencarian, kriteria inklusi-eksklusi, tahapan seleksi, dan ekstraksi data.

### A. Strategi Pencarian Literatur

Pencarian dilakukan pada database Scopus dengan sintaks berikut (format TITLE-ABS-KEY). Kata kunci disusun dari tiga kelompok konsep: konteks kawasan cerdas, sistem pendukung keputusan dan MCDM, serta aspek keselamatan-keamanan-pemantauan termasuk penempatan fasilitas pengawasan:

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

Protokol membatasi dokumen bertipe Article, berbahasa Inggris, terbit 2021-2026, dengan teks lengkap yang dapat diakses. Pencarian dilakukan pada **[TIM: tanggal pencarian]** dan menghasilkan **582 rekaman** (sebelum penyaringan tahun); tidak ada rekaman duplikat maupun rekaman yang dibuang oleh otomasi atau alasan lain.

### B. Kriteria Inklusi dan Eksklusi

**Tabel I. KRITERIA INKLUSI DAN EKSKLUSI STUDI**

| Kode | Kriteria Inklusi | Kriteria Eksklusi |
|---|---|---|
| I1 | Artikel ilmiah bertipe Article, terbit 2021-2026, berbahasa Inggris, dengan teks lengkap yang dapat diakses | Bukan Article, di luar rentang tahun, berbahasa non-Ingris, atau teks lengkap tidak dapat diakses |
| I2 | Membahas DSS atau kerangka pengambilan keputusan terstruktur dalam konteks urban, smart city, smart living, keselamatan, keamanan, atau pemantauan | Tidak membahas DSS atau pendekatan pengambilan keputusan terstruktur |
| I3 | Menggunakan atau membahas metode MCDM/MCDA secara eksplisit (pembobotan, perankingan, atau evaluasi multi-kriteria) | Hanya machine learning, deep learning, optimasi murni, atau analitik lain tanpa MCDM eksplisit |
| I4 | Konteks penerapan transferable ke lingkungan perkotaan/hunian (penempatan fasilitas, risiko, prioritas, alokasi sumber daya) | Konteks di luar lingkungan perkotaan atau hunian (misal jaringan non-urban, kesehatan murni, manufaktur tertutup) |
| I5 | Berupa studi primer, bukan review/scoping review/systematic review | Publikasi review (hanya dipakai sebagai penelusuran pustaka, bukan objek sintesis) |
| I6 | Teks lengkap tersedia untuk diverifikasi pada tahap full-text review | Teks lengkap tidak diperoleh atau duplikat teridentifikasi |

### C. Proses Seleksi Studi

Seleksi studi dilakukan dalam empat tahap sesuai PRISMA-ScR: (1) **identifikasi** 582 rekaman dari pencarian Scopus pada Bagian A, tanpa rekaman duplikat, tanpa eksklusi otomasi, dan tanpa pembuangan karena alasan lain; (2) **penyaringan** 582 rekaman berdasarkan tahun terbit, menghasilkan 166 rekaman dieksklusi karena terbit sebelum 2021, sehingga 416 laporan diminta untuk diambil; (3) **pengambilan dan penilaian**, dari 416 laporan tersebut 2 berbahasa non-Ingris, 233 bukan artikel ilmiah, dan 60 tidak dapat diakses teks lengkapnya, sehingga 121 laporan dinilai kelayakannya pada tahap teks lengkap; dan (4) **kelayakan**, sebanyak 109 laporan dieksklusi karena tidak sesuai tema, judul, abstrak, dan spesifikasi subjek menurut kriteria protokol, sehingga ditetapkan **12 studi disertakan** (12 laporan studi yang disertakan).

Alur seleksi ditampilkan pada Gambar 1 (`prisma-diagram.svg` buatan tim). Sebuah artikel yang substantifnya relevan namun terbit pada 2020 gugur pada tahap penyaringan tahun (bagian dari 166), yang dicatat sebagai bukti kedisiplinan protokol. Seluruh keputusan eksklusi beserta alasannya tercatat dalam log screening tim.

**[Gambar 1. Diagram alir seleksi studi berdasarkan PRISMA-ScR.]**

### D. Ekstraksi dan Analisis Literatur

Studi yang disertakan kemudian di-charting ke dalam tabel ekstraksi dengan kolom: penulis, domain permasalahan, komponen DSS, metode MCDM, kriteria utama, dan relevansi terhadap studi kasus Jatinangor. Hasil charting menjadi dasar analisis RQ1 (pemetaan arsitektur), RQ2 (sebaran metode dan taksonomi kriteria), dan penyusunan model konseptual RQ3. Sintesis dilakukan dengan pendekatan tematik, yaitu pengelompokan pola arsitektur, peran metode, dan orientasi kriteria, bukan penilaian kualitatif terhadap metode individual.

## III. HASIL DAN PEMBAHASAN

### A. Analisis RQ1: Pemetaan Kerangka dan Arsitektur DSS

**RQ1:** *Bagaimana arsitektur DSS Smart Living & Safety dipetakan dari literatur (alur input data heterogen ke engine MCDM/analitik lalu output keputusan), dan pola mana yang paling transferable terhadap keterbatasan data Jatinangor?*

**Tabel II. EKSTRAKSI LITERATUR (DATA CHARTING)**

| No. | Penulis | Domain | Komponen DSS | Metode MCDM | Kriteria Utama | Relevansi Jatinangor |
|---|---|---|---|---|---|---|
| 1 | Wang et al. [1] | Penempatan kamera jalan, Wuwei RRT | Input simpul jalan + model coverage; engine MWVC + greedy; output titik kamera dan tiang optimal | Optimasi coverage MWVC (non-MCDM) | Coverage jalan (benefit); jumlah tiang dan kamera (cost) | Jangkar argumen anggaran (tiang 62 ke 33, kamera 196 ke 98, coverage 100%); C4/C6/C7/C9 |
| 2 | Gonzalez-Villa et al. [2] | Counter-terrorism dan infrastruktur kritis (S4AllCities) | Input pergerakan pejalan/kendaraan + model ancaman; engine prediktif-probabilistik; output evakuasi dan rute intervensi | DSS simulasi terintegrasi (non-MCDM) | Probabilitas ancaman, egress time, estimasi korban | Pembanding arsitektur; pola simulasi ditolak untuk model UTS, dicatat sebagai varian ideal |
| 3 | Feizizadeh & Omarzadeh [3] | Pemetaan risiko pesepeda, Berlin | Input crowd-sensor + guna lahan; engine statistik spasial + MCDA-GIS; output peta risiko | Spatial-MCDA berbasis GIS | Volume lalu lintas, kondisi jalur, lingkungan, guna lahan, sosiodemografi | Template peta prioritas gang; C2/C5/C8 |
| 4 | Ahmed et al. [4] | Smart campus, UAE | Input survei 4 kelompok pengguna; engine AHP antar-stakeholder + utility function; output tool keputusan investasi | AHP multistakeholder + utility function | Smart security and safety, navigasi kampus, adaptive learning | Skema AHP tiga kelompok; bukti safety terpenting di kawasan pendidikan; C8/C9 |
| 5 | Choi et al. [5] | Teknologi hunian padat, Korea Selatan | Input 16 teknologi + panel 22 ahli; engine MCDM + expected utility 3 skenario; output prioritas teknologi | MCDM terintegrasi + expected utility | Importance dan utility per domain; smart safety teratas | Legitimasi fokus safety hunian padat; C5/C8 |
| 6 | Kanj et al. [6] | Rute barang berbahaya, smart city | Input data cloud + cost/duration/risk; engine Fuzzy AHP + Fuzzy TOPSIS; output rute teraman | Fuzzy AHP (bobot) + Fuzzy TOPSIS (ranking) | Cost, duration, risk | Justifikasi inti AHP-TOPSIS; C1/C9 |
| 7 | Kabashkin et al. [7] | Monitoring lalu lintas UAV, Astana | Input video 30 titik kritis; engine simulasi + kerangka MCDM; output evaluasi 6 skenario | MCDM evaluasi skenario berbasis simulasi | Flow, kecepatan, delay, kriteria skenario | Sampling titik kritis menjadi logika segmen gang; UAV diganti observasi manual; C2 |
| 8 | Baddour et al. [8] | Perencanaan diplomatic quarter | Input dataset urban publik; engine BWM + CoCoSo dengan komparasi AHP/TOPSIS/VIKOR; output ranking skenario | BWM (bobot) + CoCoSo (ranking); komparasi berangka | Security, accessibility, infrastructure, sustainability, resilience | Komparasi metode; alasan memilih AHP-TOPSIS (selisih kinerja kecil, lebih sederhana); C1/C8/C9 |
| 9 | Almassawa et al. [9] | Kebijakan smart mobility, South Tangerang | Input indikator availability/security/comfort; engine PROMETHEE; output strategi kebijakan | PROMETHEE | Availability, security, comfort | Variasi metode; konteks Indonesia; C1 |
| 10 | Shiddiqy et al. [10] | Arsitektur pertahanan IKN, Indonesia | Input dokumen kebijakan sekunder; engine SWOT + AHP; output prioritas komponen | SWOT + AHP | C4ISR, AI-surveillance, keamanan infrastruktur, kolaborasi | Bukti AHP dari data sekunder; bobot surveilans tinggi; C4/C7 |
| 11 | Zheng et al. [11] | Risiko banjir komunitas, Guangzhou | Input faktor alam-sosial + IoT + ArcGIS; engine DEMATEL-ISM + Bayesian Network; output risiko dan evaluasi intervensi | DEMATEL-ISM + Bayesian Network | Faktor alam dan sosial; kapasitas drainase | Logika intervensi terukur; toolchain Python + ArcGIS; C3/C9 |
| 12 | Yuhang et al. [12] | Penempatan sensor grid, Guangzhou | Input proximity + kepadatan penduduk (EWM); engine BCSLP + genetic algorithm; output strategi balanced | EWM (bobot objektif) + optimasi coverage | Primary coverage, backup coverage, risiko, biaya | EWM sebagai validasi silang bobot; C4/C5/C7/C9 |

Charting menunjukkan komponen DSS dapat dipetakan ke tiga lapisan umum: lapisan input (data spasial, observasi, survei pakar, data historis, citra/sensor), decision engine (MCDM, machine learning, fuzzy logic, jaringan Bayesian, simulasi, optimasi), dan decision output (peta risiko, skor, perankingan, rute, prioritas intervensi). Keberagaman domain di atas tidak diadopsi sebagai variabel fisiknya, melainkan diabstraksi menjadi pola arsitektur dan logika keputusan yang domain-agnostic.

Berdasarkan sintesis charting, arsitektur DSS pada literatur terbagi menjadi lima pola:

1. **GIS-MCDM dan evaluasi skenario spasial** [3], [7], [11]: menggabungkan lapisan spasial dengan MCDM sehingga keluaran keputusan memiliki dimensi lokasi; menjadi arsitektur utama model Jatinangor.
2. **Optimasi coverage** [1], [12]: memaksimalkan cakupan dengan jumlah perangkat terbatas, relevan untuk penempatan CCTV berbudget ketat.
3. **Expert-driven (survei + AHP)** [4], [5], [8]: mengandalkan penilaian pakar dan pemangku kepentingan, sesuai data empiris terbatas.
4. **Simulasi-DSS operasional** [2]: paling lengkap outputnya namun membutuhkan data kalibrasi berbiaya tinggi, sehingga ditolak untuk model Jatinangor.
5. **Policy-MCDA** [9], [10]: menghasilkan rekomendasi kebijakan terprioritas, dipakai untuk framing keluaran model.

**[Gambar 2. Taksonomi lima pola arsitektur DSS dan nasibnya pada model Jatinangor]**

```
Lanskap arsitektur DSS keselamatan (5 pola dari 12 studi)
|
+-- GIS-MCDM + evaluasi skenario spasial [3], [7], [11]
|      -> DIPAKAI: arsitektur utama (peta prioritas spasial)
+-- Optimasi coverage [1], [12]
|      -> DIPAKAI: logika penempatan titik berbudget ketat
+-- Expert-driven (survei + AHP) [4], [5], [8]
|      -> DIPAKAI: skema pembobotan multistakeholder
+-- Simulasi-DSS operasional [2]
|      -> DITOLAK: butuh data kalibrasi mahal
+-- Policy-MCDA [9], [10]
       -> DIPAKAI: framing rekomendasi kebijakan
```

Penting dicatat bahwa pola hybrid (kombinasi lebih dari satu engine) dominan dalam literatur. Namun, kebutuhan data antarpola berbeda jauh: pola yang bergantung pada simulasi real-time, citra berbiaya, atau machine learning membutuhkan data berdensitas tinggi, sedangkan pola GIS-MCDM, optimasi coverage, dan expert-driven dapat berjalan di atas data tabular, data spasial statis, dan penilaian pakar. Dengan kriteria transferability, tiga pola terakhir merupakan baseline yang paling realistis untuk Jatinangor, dan kesimpulan ini menjadi dasar perancangan model pada Seksi IV.

**Jawaban RQ1:** arsitektur DSS Smart Living & Safety dalam literatur terpetakan ke lima pola dengan alur umum input heterogen, decision engine, lalu output keputusan; pola yang paling transferable untuk Jatinangor adalah kombinasi GIS-MCDM, optimasi coverage, dan expert-driven karena ketiganya bekerja di atas data diskrit yang tersedia lokal. **Celah yang teridentifikasi:** hampir seluruh studi menguji arsitektur pada lingkungan berdata lengkap (sensor, citra, simulasi berkalibrasi), sedangkan penempatan fasilitas pengawasan pada hunian padat beranggaran terbatas dengan data diskrit praktis belum dirancang sebagai satu model utuh; celah inilah yang dijawab pada Seksi IV.

### B. Analisis RQ2: Sebaran Metode MCDM dan Taksonomi Kriteria

**RQ2:** *Metode MCDM apa yang digunakan dalam DSS Smart Living & Safety, bagaimana skema pembobotan dan perankingannya diterapkan, serta bagaimana kriteria keputusan diklasifikasikan berdasarkan atribut benefit dan cost?*

**Tabel III. SEBARAN DAN PERAN METODE MCDM**

| Peran dalam siklus keputusan | Metode yang ditemukan | Paper pendukung |
|---|---|---|
| Pembobotan subjektif (pakar) | AHP, Fuzzy AHP, BWM | [4], [6], [8], [10] |
| Pembobotan objektif (data) | Entropy Weight Method (EWM) | [12] |
| Perankingan alternatif | TOPSIS, Fuzzy TOPSIS, CoCoSo, PROMETHEE | [6], [8], [9] |
| Struktural/kausal | DEMATEL-ISM, Bayesian Network | [11] |
| Evaluasi skenario spasial | Kerangka MCDM multi-skenario | [7] |
| Pola pemenang (kombinasi) | AHP untuk bobot + TOPSIS untuk ranking | [6] |

Angka frekuensi dalam tabel tidak bersifat eksklusif: satu paper dapat memakai lebih dari satu metode, sehingga jumlah kemunculan tidak dijumlahkan menjadi persentase artikel. Aturan hitung pada sintesis: hanya pemakaian sebagai engine utama yang dihitung, sedangkan komparasi metode pada [8] dicatat terpisah dan bukan sebagai pemakaian. Hasilnya AHP/Fuzzy AHP dipakai primer di 3 paper [4], [6], [10], sedangkan BWM, EWM, TOPSIS/Fuzzy TOPSIS, CoCoSo, PROMETHEE, DEMATEL-ISM dengan Bayesian Network, dan MCDM multi-skenario masing-masing dipakai primer di 1 paper; tiga studi non-MCDM memakai optimasi MWVC [1], DSS simulasi terintegrasi [2], dan statistik spasial [3]. Dari 12 studi disertakan, AHP merupakan metode yang paling sering muncul secara eksplisit dan konsisten berperan sebagai weighting method, sedangkan TOPSIS dan varian fuzzy-nya berperan sebagai ranking method. Pola kombinasi AHP lalu TOPSIS pada [6] menjadi template yang paling langsung dapat diadopsi. Dua metode yang sering disebut pada rubrik kajian sejenis, yaitu SAW dan WP, tidak ditemukan secara eksplisit dalam 12 studi inti ini, sehingga tidak dijadikan dasar justifikasi model. Selain itu, komparasi berangka pada [8] menunjukkan selisih kinerja antarmetode relatif kecil ( agreement pakar 92,8% untuk BWM-CoCoSo berbanding 88,6% untuk AHP-TOPSIS, dengan selisih robustness 0,91 berbanding 0,84), sehingga kesederhanaan dan ketersediaan pakar menjadi penentu pemilihan metode, bukan perburuan skor tertinggi.

**Tabel IV. TAKSONOMI KRITERIA KEPUTUSAN**

| Kelompok | Orientasi | Contoh kriteria dari literatur |
|---|---|---|
| Benefit | Semakin tinggi semakin diprioritaskan (dalam konteks keputusan paper sumber) | Volume mobilitas dan aktivitas [3], cakupan pengawasan [1], [12], keamanan dan aksesibilitas [8], [9], kepadatan hunian [12] |
| Cost | Semakin rendah semakin dikehendaki | Jumlah perangkat dan biaya [1], risiko kecelakaan [7], biaya implementasi [8], latency dan emisi [12] |
| Context-dependent | Arah preferensi tidak eksplisit pada data charting paper sumber | Faktor yang orientasinya bergantung pada formulasi model masing-masing paper (diklasifikasikan berdasarkan tujuan keputusan, bukan nama variabel) |

Taksonomi ini penting karena benefit dan cost merupakan sifat kriteria dalam suatu model keputusan, bukan sifat absolut dari nama variabel. Klasifikasi seluruh kriteria dilakukan terhadap tujuan keputusan paper sumber; ketika arah preferensi tidak eksplisit tercatat pada charting, kriteria dipisahkan sebagai context-dependent dan tidak dipaksa masuk biner benefit/cost. Seluruh arah kriteria pada model Jatinangor dirumuskan terhadap urgensi, yaitu skor yang lebih tinggi menandakan prioritas pemasangan yang lebih besar (Seksi IV).

**Jawaban RQ2:** metode yang muncul dalam literatur terbagi atas empat peran, yaitu pembobotan subjektif (AHP, Fuzzy AHP, BWM), pembobotan objektif (EWM), perankingan (TOPSIS, CoCoSo, PROMETHEE), dan pemodelan struktural (DEMATEL-ISM, Bayesian); pola kombinasi AHP untuk bobot lalu TOPSIS untuk peringkat adalah yang paling langsung dapat diadopsi, sedangkan kriteria keputusan terpetakan ke benefit, cost, dan context-dependent. **Celah yang teridentifikasi:** (a) komparasi bobot objektif berbasis data dengan bobot subjektif berbasis pakar jarang dilakukan dalam satu studi yang sama, (b) SAW dan WP yang lazim disebut pada kajian sejenis tidak ditemukan eksplisit pada korpus ini, sehingga tidak dapat dijadikan dasar bukti, dan (c) klasifikasi benefit/cost kerap dilakukan hanya dari nama variabel tanpa memeriksa arah preferensi di dalam formulasi model. Celah tersebut dijawab pada Seksi IV lewat skema AHP yang divalidasi silang dengan EWM serta taksonomi tiga kategori yang diterapkan konsisten.

### C. Sintesis RQ1 dan RQ2

**Tabel V. SINTESIS TEMUAN LITERATUR DAN IMPLIKASI**

| Aspek | Temuan literatur | Implikasi untuk Jatinangor |
|---|---|---|
| Arsitektur | Lima pola; hybrid dominan; kebutuhan data antarpola berbeda jauh | Pakai baseline GIS-MCDM + optimasi coverage + expert-driven |
| Input | Spasial, observasi, survei pakar, data historis, sensor/citra | Cukup data diskrit lokal: survei, OSM, rekap insiden, RAB |
| Decision engine | MCDM, ML, fuzzy, simulasi, optimasi | MCDM dipilih karena transparan dan dapat diverifikasi pakar |
| Pembobotan | Banyak berbasis pakar (AHP, BWM) | AHP tiga kelompok pemangku kepentingan (AHP primer di 3 studi) |
| Perankingan | TOPSIS, CoCoSo, PROMETHEE | TOPSIS karena ringkas dan sejalan pola pemenang [6] |
| Benefit | Cakupan, aktivitas, keamanan, kepadatan | Menjadi orientasi skor C1-C9 terhadap urgensi |
| Cost | Biaya, risiko, jumlah perangkat | Diperlakukan sebagai kendala anggaran dan kriteria kelayakan |
| Context-dependent | Bergantung formulasi model | Kriteria tanpa arah eksplisit tidak dipaksa biner |
| Output | Peta risiko, skor, peringkat, prioritas | Peta prioritas segmen gang + urutan pemasangan bertahap |
| Transferability | Bergantung kebutuhan data dan kompleksitas | Kelayakan adopsi diuji pada tiga dimensi (Seksi IV-D) |

## IV. PERANCANGAN MODEL KONSEPTUAL DSS JATINANGOR (JAWABAN RQ3)

**RQ3:** *Model konseptual DSS seperti apa yang paling layak diterapkan untuk prioritisasi CCTV di permukiman mahasiswa Jatinangor, mencakup representasi segmen gang sebagai alternatif, struktur sembilan kriteria keselamatan, skema pembobotan AHP multistakeholder dan perankingan TOPSIS, serta elemen literatur apa yang sengaja tidak diadopsi beserta alasannya?*

### A. Profil Lokasi dan Perumusan Alternatif

Jatinangor dibagi menjadi beberapa desa dengan pola hunian campuran: permukiman padat berbasis indekos di sekitar gerbang kampus, koridor jalan utama yang menghubungkan simpul layanan, serta gang-gang residensial sempit dengan penerangan seadanya. Kerawanan tidak merata antarsegmen, sehingga unit keputusan yang tepat bukan desa secara keseluruhan, melainkan **segmen jalan atau gang** yang menerima satu unit CCTV.

**Tabel VI. ALTERNATIF SEGMEN (A1-A5)**

| Kode | Segmen (contoh operasional, nama final dari observasi lapangan) |
|---|---|
| A1 | Gang kos kawasan Sayang (padat, akses sempit) |
| A2 | Ruas jalan Cikeruh dekat gerbang kampus |
| A3 | Persimpangan Hegarmanah (simpul multi-cabang) |
| A4 | Gang Cipacing (minim PJU) |
| A5 | Ruas Cileles (jalur mobilitas malam) |

Aturan penentuan alternatif: 4-6 segmen; setiap alternatif mewakili satu segmen yang layak menerima tepat satu unit CCTV; nama final ditetapkan berdasarkan observasi lapangan. Alternatif segmen diadopsi dari [1] karena unit keputusannya berupa simpul atau segmen jalan dengan coverage terukur, dan dari [3] karena format peta prioritas spasialnya dapat direplikasi menjadi peta prioritas gang di Jatinangor.

### B. Matriks Kriteria C1-C9

Sembilan kriteria dirumuskan dengan satu arah tunggal: skor lebih tinggi berarti semakin prioritas (orientasi benefit terhadap urgensi).

**Tabel VII. MATRIKS KRITERIA KESELAMATAN C1-C9**

| Kode | Kriteria | Definisi operasional | Satuan | Sumber data (utama / fallback) | Rujukan |
|---|---|---|---|---|---|
| C1 | Riwayat kerawanan segmen | Kejadian kriminalitas/kecelakaan per km per tahun | kejadian/km/th | Rekap insiden / observasi + wawancara RT | [6], [8], [9], [3] |
| C2 | Volume mobilitas malam | Orang lewat pukul 18.00-24.00 | orang/jam | Counting manual / CCTV eksisting | [3], [7], [9] |
| C3 | Defisiensi penerangan | Kekurangan cahaya PJU (skor survei) | skor 1-5 | Survei malam / data dinas (fallback: observasi) | [8], [11] |
| C4 | Efisiensi coverage | Luas ter-cover per titik CCTV | m2/titik | Pemetaan + model coverage | [1], [12] |
| C5 | Kepadatan penghuni | Kamar kos per km gang | kamar/km | Pendataan kos / data desa | [12], [3], [5] |
| C6 | Derajat simpul jalan | Jumlah cabang persimpangan | cabang | OpenStreetMap + observasi | [1] |
| C7 | Coverage gap CCTV eksisting | Jarak ke CCTV terdekat | meter | Survei titik CCTV | [1], [12] |
| C8 | Kedekatan guna lahan rentan | Radius 150 m ke kos, ATM, warung 24 jam, gerbang kampus | unit | Observasi + POI | [3], [8], [4] |
| C9 | Kelayakan implementasi | Kesiapan tiang/listrik/internet dikurangi estimasi biaya | skor | Survei jaringan + RAB | [6], [1], [8] |

**Validasi rujukan kriteria:** C1 didukung [6], [8], [9]; C2 oleh [3], [7], [9]; C3 oleh [8], [11]; C4 oleh [1], [12]; C5 oleh [12], [3], [5]; C7 oleh [1], [12]; C8 oleh [3], [8], [4]; dan C9 oleh [6], [1], [8]. Delapan dari sembilan kriteria ditelusuri ke minimal dua studi. C6 (derajat simpul jalan) hanya didukung eksplisit oleh [1] yang menjadikan adjacency degree sebagai bobot vertex utama; keterbatasan satu rujukan ini dicatat apa adanya, dengan penguatan tidak langsung dari pola struktur jaringan pada [12].

**Urutan prioritas kriteria:** berdasarkan frekuensi dukungan di 12 studi, dengan seri yang diputus menurut relevansi langsung terhadap keputusan penempatan CCTV (kendala anggaran dan paparan didahulukan atas faktor pendukung), urutannya adalah C1 > C9 > C2 > C5 > C8 > C4 > C7 > C3 > C6. C1 menempati urutan pertama dengan dukungan 4 studi sebagai inti urgensi pemasangan; C9 kedua sebagai jangkar kelayakan anggaran [1]; C6 terakhir karena bersumber tunggal.

### C. Skema Pembobotan AHP dan Perankingan TOPSIS

**Pembobotan AHP multistakeholder** mengadopsi skema AHP lintas kelompok dari [4] karena studi itu membuktikan AHP dapat mempertemukan persepsi empat kelompok pengguna dalam satu bobot konsensus, dengan angka acuan konsistensi dan komparasi dari [8] dan [10] yang keduanya menunjukkan AHP berjalan valid bahkan dengan data sekunder:

1. Responden tiga kelompok: (a) pemerintah daerah (dinas terkait, kecamatan), (b) kampus dan pengelola kawasan, (c) warga (RT, pemilik kos).
2. Kuesioner pairwise comparison sembilan kriteria per kelompok dengan skala Saaty 1-9.
3. Agregasi antarkelompok menggunakan geometric mean; uji Consistency Ratio dengan ambang CR < 0,1 [FULLTEXT-VERIFY: angka acuan CR 0,046 dari [8]], dihitung lewat lamda-maks, CI = (lamda-maks - n)/(n - 1), dan CR = CI/RI dengan RI untuk n = 9 sebesar 1,45.
4. Validasi silang opsional: bobot objektif Entropy Weight Method dari data lapangan [12] sebagai pembanding terhadap bobot subjektif AHP; selisih besar memicu diskusi ulang dengan pakar, bukan penggantian otomatis.

**Perankingan TOPSIS** mengadopsi pola pemenang AHP-TOPSIS dari [6] karena kombinasi itu terbukti menyelesaikan perankingan multi-kriteria dengan kriteria ringkas tanpa infrastruktur komputasi berat:

1. Matriks keputusan A1-A5 terhadap C1-C9 dari data lapangan.
2. Normalisasi kolom matriks lalu pengalikan bobot AHP menjadi matriks terbobot.
3. Perhitungan jarak tiap alternatif ke solusi ideal positif dan negatif, lalu closeness coefficient C(i) = D-(i)/(D+(i) + D-(i)) untuk menetapkan peringkat prioritas pemasangan dari nilai terbesar.
4. Analisis sensitivitas bobot sebesar ±20% untuk menguji ketahanan peringkat, mengikuti praktik sensitivitas pada [8]; peringkat dinyatakan robust bila posisinya tidak berubah.

Justifikasi teoritis pemilihan metode: dari kandidat metode pembobotan dan perankingan yang lazim (SAW, WP, TOPSIS, AHP), kombinasi AHP-TOPSIS yang dipilih karena (a) terbukti dipakai berpasangan dalam literatur korpus ini [6], (b) AHP mengakomodasi penilaian pakar secara konsisten, sesuai ketersediaan data Jatinangor, sebagaimana dibuktikan AHP berjalan dari data sekunder pada [10], (c) TOPSIS ringkas, transparan, dan menangani kompromi benefit-cost secara langsung, sementara selisih kinerja terhadap metode lebih kompleks ternyata kecil menurut komparasi berangka [8], dan (d) SAW dan WP tidak ditemukan eksplisit pada 12 studi inti, sehingga tidak memiliki dukungan bukti dalam protokol ini.

### D. Arsitektur Konseptual dan Justifikasi Adopsi

```
INPUT LAYER (data diskrit lokal)
  C1 rekap insiden | C2 counting manual | C3 survei penerangan
  C4/C6/C7 pemetaan OSM + coverage | C5 data kos | C8 POI | C9 RAB
        |
        v
PREPROCESSING
  pembersihan data | kodifikasi segmen A1-A5 | normalisasi kriteria
        |
        v
DECISION ENGINE
  [AHP] bobot C1-C9 per kelompok -> agregasi geometric mean + CR
  [TOPSIS] matriks keputusan -> normalisasi -> closeness -> ranking
  [GIS] pemetaan segmen + gap coverage -> visualisasi peta
        |
        v
DECISION OUTPUT
  peringkat prioritas A1-A5 | peta prioritas segmen gang
  | urutan pemasangan bertahap sesuai anggaran
```

Arsitektur empat lapisan ini mengadopsi pola GIS-MCDM dari [3] dan [7] karena keduanya membuktikan keluaran keputusan spasial terbangun dari data lintas sumber, logika optimasi coverage dari [1] dan [12] karena keduanya menunjukkan cakupan penuh tercapai dengan jumlah perangkat jauh lebih sedikit, serta skema expert-driven dari [4] dan [8] karena penilaian pakar adalah sumber bobot yang paling tersedia di Jatinangor. Justifikasi adopsi dan penolakan elemen literatur dicatat eksplisit:

- **Ditolak: simulasi-DSS operasional ala [2]** karena membutuhkan data kalibrasi berbiaya tinggi dan infrastruktur yang tidak tersedia di Jatinangor.
- **Ditolak: kombinasi BWM-CoCoSo ala [8]** karena selisih kinerja terhadap AHP-TOPSIS kecil, sedangkan pakar tersedia untuk AHP dan prosesnya lebih mudah diaudit.
- **Ditunda: metrik response time dan egress ala [2]** karena datanya tidak tersedia; dicatat sebagai keterbatasan dan arah riset lanjutan.
- **Dicatat sebagai catatan disiplin protokol:** template terkait AHP-GIS-Fuzzy-TOPSIS yang relevan namun terbit 2020 gugur pada aturan tahun 2021-2026.

### E. Kelayakan Adopsi Model

Kelayakan model diuji pada tiga dimensi. **Pertama, kebutuhan data:** seluruh input berupa data diskrit non-streaming (rekap insiden, counting manual, survei, OSM, RAB) sehingga tidak bergantung pada jaringan sensor kontinu maupun langganan citra berbiaya. **Kedua, kompleksitas metode:** AHP dan TOPSIS transparan, dapat dihitung manual maupun lembar kerja, dan tidak menuntut infrastruktur komputasi berat; CR dan analisis sensitivitas menyediakan uji kualitas yang jelas. **Ketiga, keluaran:** model menghasilkan peringkat, peta prioritas, dan urutan pemasangan yang langsung dapat dipakai sebagai dasar pengalokasian anggaran bertahap. Dengan tiga dimensi tersebut, model dapat dijalankan oleh pemangku kepentingan lokal dengan data yang tersedia, dan hanya kehilangan akurasi terbaiknya ketika data lapangan belum lengkap, bukan ketika sistem gagal dioperasikan.

## V. KESIMPULAN DAN ROADMAP SOFTWARE

Kajian ini memetakan 12 studi literatur melalui protokol PRISMA-ScR dan menemukan lima pola arsitektur DSS keselamatan perkotaan, sebaran metode MCDM dengan pola dominan AHP untuk pembobotan dan TOPSIS untuk perankingan, serta taksonomi kriteria benefit, cost, dan context-dependent. Dari sintesis tersebut dirancang model konseptual DSS prioritisasi CCTV untuk Jatinangor: alternatif segmen gang A1-A5, matriks kriteria C1-C9 dengan satu arah terhadap urgensi dan urutan prioritas C1>C9>C2>C5>C8>C4>C7>C3>C6, pembobotan AHP tiga kelompok pemangku kepentingan, perankingan TOPSIS dengan analisis sensitivitas, dan arsitektur empat lapisan berbasis data diskrit.

Roadmap pengembangan menuju perangkat lunak pasca-UTS:

1. **Pengumpulan data lapangan:** observasi segmen A1-A5, counting mobilitas malam, survei penerangan, pendataan CCTV eksisting, dan RAB sebagai input matriks keputusan.
2. **Prototipe dasbor:** perhitungan AHP-TOPSIS diimplementasikan dalam skrip atau lembar kerja terhitung, disertai visualisasi peta prioritas segmen berbasis GIS ringan.
3. **Validasi pakar:** pengujian matriks pairwise comparison bersama pemangku kepentingan untuk mengkalibrasi bobot dan konsistensi.
4. **Skala lanjut (UAS):** penambahan sumber data dinamis, integrasi kanal aduan warga, dan varian pemantauan real-time yang selama ini ditunda.

Keterbatasan kajian meliputi: verifikasi teks lengkap dan penetapan jumlah studi final menunggu dokumen full-text; pencarian terbatas pada satu database (Scopus) berbahasa Inggris dan open access; rentang tahun 2021-2026; serta seluruh nilai kriteria dan bobot dalam model masih berupa skema yang menunggu data lapangan.

## DEKLARASI PENGGUNAAN GENERATIVE AI

[Diisi tim: alat yang digunakan (opencode/Gemini) dan perannya (bantuan screening awal, draf charting, draf tulisan, format); verifikasi data, keputusan seleksi, dan penyusunan final seluruhnya oleh anggota tim.]

## DAFTAR PUSTAKA

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
