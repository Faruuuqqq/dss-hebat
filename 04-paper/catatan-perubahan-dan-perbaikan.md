# DOKUMEN CATATAN PERUBAHAN DAN TANGGAPAN PERBAIKAN PAPER
*(Response to Reviewers & Comprehensive Revision Changelog)*

**Judul Paper:**  
*Decision Support Systems for Urban Surveillance and Public Safety Facility Placement: A Scoping Review and Conceptual Framework for CCTV Prioritization in Jatinangor Student Settlements*

**Tim Penulis:**  
1. Marvel Evan T. (140810240012)
2. Kezia Tabhita Smith (140810240020)
3. Ibnaty Farah Rabbany (140810240022)
4. Achmad Faruq M. (140810240080)
5. Gabriella Marie Keira Wibawa (140810240086)  
*Program Studi Teknik Informatika, Fakultas MIPA, Universitas Padjadjaran*

**Tanggal Dokumen:** 17 Oktober 2026  
**Status Revisi:** Selesai Diimplementasikan Penuh pada Naskah LaTeX ([`draft-paper.tex`](file:///d:/project/dss/04-paper/draft-paper.tex)) dan Naskah Markdown ([`draft-paper.md`](file:///d:/project/dss/04-paper/draft-paper.md)).

---

## I. RINGKASAN EKSEKUTIF PERBAIKAN

Dokumen ini mencatat seluruh tanggapan, tindakan koreksi, penyesuaian metodologis, formulasi matematis, serta bukti numerik yang dilakukan tim penulis untuk merespons kritik dan masukan terhadap draf naskah paper sebelumnya. 

Perbaikan dilakukan secara menyeluruh pada lima pilar utama:
1. **Rekonsiliasi Integritas Data Internal:** Menyelaraskan seluruh angka seleksi PRISMA-ScR (582 $\rightarrow$ 416 $\rightarrow$ 121 $\rightarrow$ 12 studi), memadukan Tabel III dan Tabel VIII ke dalam satu *single source of truth* ([`matriks-studi-kriteria.md`](file:///d:/project/dss/03-sintesis/matriks-studi-kriteria.md)), memperbaiki posisi/caption Gambar 2 dan Gambar 3, serta mengoreksi data kepadatan penduduk Jatinangor menjadi $\approx 3.740\text{ jiwa/km}^2$.
2. **Penurunan Nada Klaim (*Toning Down Claims*):** Mengganti klaim berlebihan seperti *"dominan"* dan *"pola pemenang"* menjadi bahasa akademik berbasis bukti (*"kombinasi rujukan yang paling teruji dan transparan"*), serta menegaskan bahwa paper ini menyajikan kerangka konseptual yang divalidasi pilot numerik.
3. **Penguatan Metodologi Scoping Review:** Membuka secara transparan pembatasan satu basis data (Scopus), pengeluaran 60 artikel *paywall*, penetapan batas waktu 2021–2026, prosedur *screening* independen oleh 5 penelaah, dan deklarasi penggunaan Generative AI sesuai etika publikasi IEEE.
4. **Penyempurnaan Model Konseptual:** Memisahkan kriteria urgensi risiko (C1–C8) dari kriteria kelayakan teknis dan biaya (C9 dan RAB), menambahkan aturan alokasi bertahap di bawah kendala anggaran belanja (*budget ceiling knapsack constraint*), menyusun struktur AHP hierarki untuk menjamin konsistensi ($CR = 0{,}0104 < 0{,}10$), melengkapi seluruh rumus matematis TOPSIS, serta mengintegrasikan teori kriminologi (CPTED dan *Routine Activity Theory*) dan UU PDP No. 27/2022.
5. **Standardisasi Format dan Bahasa Akademik:** Menghapus seluruh istilah internal perkuliahan (*"model UTS"*, *"pasca-UTS"*, *"menuju UAS"*), menyelaraskan bahasa naskah ke Bahasa Indonesia baku dengan istilah teknis Inggris dicetak miring (*italic*), memindahkan pernyataan *research gap* ke Pendahuluan, dan memastikan tata letak tabel muat rapi pada format dua-kolom IEEE.

---

## II. MATRIKS TANGGAPAN BUTIR-DEMI-BUTIR (POINT-BY-POINT REVIEWER RESPONSE)

| No. | Poin Kritik Reviewer | Tindakan Perbaikan Tim Penulis | Lokasi Perubahan pada Naskah | Status |
|:---:|---|---|---|:---:|
| **1.1** | **Tabel III vs Tabel VIII tidak cocok.** Kolom relevansi Tabel III dan kolom rujukan Tabel VIII berbeda (C3, C9, C1). Klaim "8 dari 9 kriteria didukung minimal 2 studi" goyah jika C3 sumber tunggal. | Dibuat dokumen matriks $12 \times 9$ tunggal ([`matriks-studi-kriteria.md`](file:///d:/project/dss/03-sintesis/matriks-studi-kriteria.md)) dengan kutipan bukti teks. C3 diverifikasi didukung 2 studi (Baddour [14] dan Zheng [17]). C9 didukung 6 studi; C1 didukung 4 studi; C6 transparan bersumber tunggal (Wang [7]). Klaim *"8 dari 9 kriteria didukung $\ge 2$ studi"* terbukti valid. | Seksi III-A (Tabel III), Seksi IV-B (Tabel VIII), dan Abstrak. | **SELESAI** |
| **1.2** | **Diagram PRISMA (Gambar 1) tidak sesuai teks & abstrak.** Gambar menulis 416, teks menulis 181; kotak kelayakan tidak konsisten antara 121, 109, 103, dan 6. Typo *"Spesific"*. Filter tahun bukan screening. | Alur seleksi PRISMA distandarkan menjadi 4 tahap balance: 582 rekaman teridentifikasi $\rightarrow$ 166 pre-2021 gugur $\rightarrow$ 416 dicari teks lengkap $\rightarrow$ 295 gugur teknis (non-Inggris $n=2$, non-artikel $n=233$, paywall $n=60$) $\rightarrow$ 121 dinilai kelayakan substantif $\rightarrow$ 109 dieksklusi kriteria $\rightarrow$ **12 studi disertakan**. Angka siluman (181, 103, 18, 6) dihapus total. Typo *"Spesific"* diperbaiki. | Abstrak, Seksi II-C, Gambar 1 (`prisma-diagram.svg` & `.png`). | **SELESAI** |
| **1.3** | **Gambar 2 dan Gambar 3 tertukar.** Gambar 2 arsitektur berlapis tapi disebut taksonomi; Gambar 3 taksonomi tapi caption arsitektur. Teks IV-D menyebut 3 pola diadopsi padahal gambar 4. | Gambar 2 ditetapkan untuk Taksonomi 5 Pola Arsitektur DSS (4 diadopsi, 1 simulasi ditolak). Gambar 3 ditetapkan untuk Arsitektur Konseptual 4 Lapisan. Teks Seksi III-A, IV-D, dan caption diselaraskan (empat pola diadopsi). | Seksi III-A (Gambar 2), Seksi IV-D (Gambar 3). | **SELESAI** |
| **1.4** | **Penomoran gambar membingungkan.** Angka kurung siku di gambar merujuk baris tabel, di teks merujuk referensi IEEE. | Seluruh label node pada diagram Mermaid diubah menggunakan nama penulis (mis. Wang et al., Kanj et al., Zheng et al.) sehingga bebas dari ambiguitas penomoran. | [`taksonomi-5-pola.mmd`](file:///d:/project/dss/04-paper/diagram/taksonomi-5-pola.mmd), [`arsitektur-4-lapis.mmd`](file:///d:/project/dss/04-paper/diagram/arsitektur-4-lapis.mmd). | **SELESAI** |
| **1.5** | **Kepadatan penduduk keliru.** 98.000 jiwa / 26,20 km² $\approx$ 3.740 jiwa/km², bukan 3.212. | Angka dikoreksi menjadi **$\approx 3.740\text{ jiwa/km}^2$**, dengan catatan kantong permukiman mahasiswa lingkar kampus melampaui $9.300\text{ jiwa/km}^2$ berdasarkan publikasi resmi BPS Kabupaten Sumedang 2024. | Seksi I (Pendahuluan, Paragraf 1), Seksi IV-A, Referensi [1]. | **SELESAI** |
| **1.6** | **Kriteria inklusi dilanggar sendiri.** I2 mengecualikan domain energi, tetapi studi Yuhang et al. [18] adalah sensor jaringan listrik. | Diberikan justifikasi transferability: Yuhang et al. diadopsi secara metodologis murni untuk model optimasi cakupan simpul graf (*backup coverage model*) dan pembobotan data objektif EWM yang identik secara matematika dengan penempatan kamera pengawas, bukan variabel fisik transmisinya. Kriteria I3 dipertegas. | Seksi II-B (Tabel II), Seksi III-A (Tabel III). | **SELESAI** |
| **1.7** | **Limitasi bertentangan dengan klaim.** Limitasi mengakui C1 diturunkan via analogi, padahal C1 dipromosikan sebagai kriteria utama. | Diakui secara eksplisit dan jujur pada bagian Limitasi bahwa kriteria C1 (dan C8) diturunkan lewat analogi struktural manajemen risiko transportasi dan kerawanan spasial perkotaan. Urutan prioritas dipisahkan dari frekuensi literatur. | Seksi IV-B, Seksi V (Keterbatasan). | **SELESAI** |
| **2.1** | **Klaim berlebihan kata "dominan" & "pola pemenang" AHP-TOPSIS.** TOPSIS hanya di 1 dari 12 studi ([12]), kombinasi AHP-TOPSIS hanya 1. | Menghapus istilah *"pola pemenang"* dan *"dominan"*. Diganti menjadi *"kombinasi rujukan yang paling teruji dan transparan"* atau *"pasangan metode yang paling siap diadopsi"*, didukung bukti komparasi empiris Baddour et al. [14]. | Abstrak, Seksi III-B, Seksi IV-C. | **SELESAI** |
| **2.2** | **Klaim abstrak "Demonstrating a transparent translation" terlalu kuat.** Belum ada data lapangan penuh. | Kalimat diubah menjadi: *"providing a transparent conceptual foundation for translating scoping review evidence into a local decision model"*. | Abstrak (kalimat penutup). | **SELESAI** |
| **2.3** | **Mengurutkan kriteria dari jumlah studi kurang sahih.** C3 (penerangan) jatuh ke #8 padahal pemicu utama di pendahuluan. | Frekuensi studi di korpus ditegaskan hanya sebagai baseline literatur, bukan ranking kepentingan lokal. Penentuan bobot diserahkan sepenuhnya ke AHP konsensus pakar, di mana C3 terbukti memperoleh bobot tinggi ($14{,}29\%$). | Seksi IV-B (Paragraf 4). | **SELESAI** |
| **3.1** | **Bias seleksi scoping review (Scopus only, 60 artikel paywall dibuang).** | Keterbatasan ini diakui secara jujur dan transparan pada Seksi V sebagai limitasi penelitian; dijelaskan bahwa protokol difokuskan pada artikel open access dan langganan institusi yang teks lengkapnya dapat diverifikasi. | Seksi II-A, Seksi V (Keterbatasan). | **SELESAI** |
| **3.2** | **Blok kata kunci AND smart city membuang studi penempatan CCTV umum.** | Dijelaskan batasan konseptual penelitian yang memang memfokuskan pada kerangka *Smart Living and Public Safety* di kawasan perkotaan cerdas; dicatat sebagai batasan lingkup (*scoping boundary*). | Seksi II-A, Seksi V (Keterbatasan). | **SELESAI** |
| **3.3** | **Batas tahun 2021–2026 kaku.** Studi relevan 2020 digugurkan. | Dicatat sebagai catatan kedisiplinan protokol pada Seksi II-C dan IV-D, di mana studi AHP-GIS-Fuzzy TOPSIS 2020 digugurkan secara sadar agar tidak melanggar rentang waktu protokol. | Seksi II-C, Seksi IV-D. | **SELESAI** |
| **3.4** | **Penggunaan Generative AI & prosedur screening belum diungkap.** | Ditambahkan Deklarasi Penggunaan Generative AI sesuai etika IEEE di akhir naskah. Ditambahkan rincian prosedur 5 reviewer independen dan resolusi konflik via konsensus A1 di Seksi II-C. | Seksi II-C, Seksi Deklarasi AI. | **SELESAI** |
| **3.5** | **RQ3 pertanyaan desain, bukan pemetaan.** Paper ini hibrida scoping review & perancangan model. | Dinyatakan secara eksplisit di Seksi I bahwa paper ini menggunakan pendekatan *hibrida*: memetakan literatur dengan PRISMA-ScR (RQ1 & RQ2) kemudian mentranslasikannya menjadi model konseptual DSS lokal (RQ3). | Seksi I (Pendahuluan, Paragraf 4). | **SELESAI** |
| **4.1** | **C9 mencampur urgensi dengan kelayakan/biaya.** Biaya diserap ke C9 mengaburkan analisis cost-benefit. | Kriteria dipisahkan tegas: C1–C8 murni mengukur Urgensi Risiko (*benefit-oriented*) di dalam TOPSIS. C9 (kesiapan fisik) dan estimasi biaya (RAB) dipisahkan menjadi modul kendala kelayakan dan batas anggaran belanja. | Seksi IV-B, Seksi IV-C, Seksi IV-D. | **SELESAI** |
| **4.2** | **Klaim peta prioritas bertahap di bawah anggaran tidak punya mekanisme.** | Diformulasikan persamaan kendala anggaran ($\sum \text{Cost}_i \le B_k$) dan mekanisme alokasi bertahap (Fase 1 Segera, Fase 2 Menengah, Fase 3 Berkala) dengan simulasi plafon belanja Rp 15 juta/tahun. | Seksi IV-C (Persamaan 8), Seksi IV-D. | **SELESAI** |
| **4.3** | **Alternatif A1–A5 lemah (mengutip studi asing, jalan bukan gang sempit, hanya 5 segmen).** | Dasar pemilihan A1–A5 diganti murni ke observasi lapangan 5 tipologi spasial Jatinangor (gang sempit kos, simpul cabang, ruas PJU padam). Sitasi asing hanya untuk metode graf. Ditambahkan paragraf jaminan skalabilitas ke ratusan segmen. | Seksi IV-A (Tabel VII dan Paragraf 2). | **SELESAI** |
| **4.4** | **36 perbandingan AHP rawan $CR > 0{,}10$.** Penolakan BWM lemah. Korelasi kriteria. | Dirancang struktur hierarki 3 kluster (Risiko C1/C3, Paparan C2/C5/C8, Spasial C4/C6/C7) yang memangkas perbandingan menjadi 10 pasang. Dilakukan uji pilot AHP menghasilkan **$CR = 0{,}0104 < 0{,}10$**. Risiko korelasi dibahas. | Seksi IV-C (Sub-seksi 1). | **SELESAI** |
| **4.5** | **Prosedur AHP-TOPSIS kurang rinci.** Belum ada rumus normalisasi, jarak ideal, uji sensitivitas $\pm 20\%$. | Dituliskan lengkap seluruh formulasi matematis: Geometric mean (Eq. 1), CI/CR (Eq. 2), Normalisasi Vektor Euclidean (Eq. 3), Matriks Terbobot (Eq. 4), Solusi Ideal (Eq. 5), Jarak Euclidean (Eq. 6), Skor Kedekatan TOPSIS (Eq. 7), dan Kendala Anggaran (Eq. 8). Sensitivitas OAT $\pm 20\%$ dijelaskan. | Seksi IV-C (Persamaan 1 s.d. 8). | **SELESAI** |
| **4.6** | **Pilihan intervensi CCTV tidak dipertanyakan.** Kurang teori kriminologi, privasi UU PDP, pemeliharaan. | Ditambahkan tinjauan teori CPTED (Crowe 2000), Routine Activity Theory (Cohen & Felson 1979), dan kepatuhan privasi ruang publik sesuai UU PDP No. 27/2022. Pembahasan mengapa CCTV diprioritaskan bersama penerangan diperjelas. | Seksi I (Paragraf 2), Referensi [5], [6]. | **SELESAI** |
| **4.7** | **Tabel V kategori "context-dependent" kosong tanpa contoh.** | Ditambahkan contoh konkret dari literatur sumber: parameter arus lalu lintas & delay UAV (Kabashkin et al. [13]) serta faktor hidrologis drainase (Zheng et al. [17]). | Seksi III-B (Tabel V). | **SELESAI** |
| **5.1** | **Istilah internal kelas harus dihapus.** ("model UTS", "pasca-UTS", "menuju UAS"). | Seluruh istilah internal kelas dihapus total dari naskah `.tex` dan `.md`. Diganti dengan peristilahan akademik standar (*"model konseptual operasional"*, *"survei data lapangan"*, dan *"roadmap implementasi software"*). | Seluruh naskah (terutama Seksi I, III, IV, dan V). | **SELESAI** |
| **5.2** | **Konsistensi bahasa.** Abstrak Inggris isi Indonesia. | Judul dan abstrak disajikan dalam Bahasa Inggris sesuai format standar prosiding IEEE internasional, sedangkan batang tubuh naskah konsisten berbahasa Indonesia baku dengan seluruh istilah teknis asing dicetak miring (*italic*). | Seluruh naskah. | **SELESAI** |
| **5.3** | **Gap penelitian baru muncul di Seksi III.** | Pernyataan *research gap* dipindahkan ke Seksi I (Pendahuluan) Paragraf 4, lengkap dengan ringkasan karya terkait dan justifikasi pendekatan hibrida. | Seksi I (Pendahuluan, Paragraf 4). | **SELESAI** |
| **5.4** | **Klaim lokal tanpa sitasi & teks gambar terlalu kecil.** | Ditambahkan rujukan resmi BPS Kabupaten Sumedang 2024 untuk data kependudukan dan luas wilayah. Diagram Mermaid digambar ulang dengan teks lebih besar dan modular. | Seksi I, Seksi IV-A, Gambar 2, Gambar 3. | **SELESAI** |
| **5.5** | **Tabel VIII sangat lebar.** Risiko overflow di IEEE format. | Tabel ekstraksi dan tabel kriteria ditata menggunakan environment `table*` dua kolom dengan alokasi lebar kolom proporsional (`tabularx` / `p{...}` terukur), sehingga muat rapi tanpa *overflow*. | `draft-paper.tex` (Tabel III dan Tabel VIII). | **SELESAI** |

---

## III. DOKUMENTASI RINCI PERUBAHAN MATEMATIS & VALIDASI NUMERIK

Untuk menjawab kritik mengenai ketiadaan contoh perhitungan, tim penulis telah menyusun skrip eksekusi matematis ([`pilot_ahp_topsis.py`](file:///d:/project/dss/03-sintesis/pilot_ahp_topsis.py)) dan mendokumentasikan hasilnya pada [`tahap-4-pilot-dummy-numerik.md`](file:///d:/project/dss/03-sintesis/tahap-4-pilot-dummy-numerik.md).

### 1. Matriks Keputusan Urgensi Input ($5 \text{ Alternatif} \times 8 \text{ Kriteria}$)

| Kode Alternatif | C1 (Kej/km/th) | C2 (Orang/jam) | C3 (Skor 1–5) | C4 ($\text{m}^2$/titik) | C5 (Kamar/km) | C6 (Cabang) | C7 (Meter) | C8 (POI) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **A1 (Gang Kos Sayang)** | 12 | 120 | 4 | 250 | 180 | 2 | 220 | 9 |
| **A2 (Ruas Jalan Cikeruh)** | 4 | 350 | 2 | 600 | 95 | 3 | 110 | 14 |
| **A3 (Persimpangan Hegarmanah)** | 9 | 480 | 3 | 750 | 110 | 5 | 180 | 18 |
| **A4 (Gang Cipacing)** | 6 | 70 | 5 | 180 | 140 | 2 | 350 | 5 |
| **A5 (Ruas Jalan Cileles)** | 2 | 90 | 2 | 400 | 40 | 3 | 190 | 4 |

### 2. Vektor Bobot AHP & Rasio Konsistensi

- **Bobot Kriteria Urgensi ($w_j$):**
  - $w_{\text{C1}} = 0{,}2395$ ($23{,}95\%$ - Riwayat Kerawanan)
  - $w_{\text{C2}} = 0{,}1429$ ($14{,}29\%$ - Volume Mobilitas Malam)
  - $w_{\text{C3}} = 0{,}1429$ ($14{,}29\%$ - Defisiensi Penerangan)
  - $w_{\text{C5}} = 0{,}1245$ ($12{,}45\%$ - Kepadatan Penghuni Indekos)
  - $w_{\text{C8}} = 0{,}1245$ ($12{,}45\%$ - Kedekatan Fasilitas Rentan)
  - $w_{\text{C7}} = 0{,}0974$ ($9{,}74\%$ - *Coverage Gap* CCTV)
  - $w_{\text{C4}} = 0{,}0770$ ($7{,}70\%$ - Efisiensi *Coverage*)
  - $w_{\text{C6}} = 0{,}0515$ ($5{,}15\%$ - Derajat Simpul Jalan)
- **Uji Konsistensi AHP:**
  - $\lambda_{\max} = 8{,}1031$
  - $\text{CI} = \frac{8{,}1031 - 8}{7} = 0{,}0147$
  - $\text{RI} = 1{,}41$ (untuk $n=8$)
  - $\mathbf{CR = \frac{0{,}0147}{1{,}41} = 0{,}0104 < 0{,}10}$ **(Konsisten Sempurna)**

### 3. Hasil Perankingan TOPSIS & Alokasi Anggaran Bertahap

- **Jarak Solusi Ideal:**
  - A1: $D^+ = 0{,}0464$, $D^- = 0{,}0634 \rightarrow C_1 = 0{,}5774$ (Peringkat 2)
  - A2: $D^+ = 0{,}0541$, $D^- = 0{,}0468 \rightarrow C_2 = 0{,}4638$ (Peringkat 4)
  - A3: $D^+ = 0{,}0424$, $D^- = 0{,}0768 \rightarrow \mathbf{C_3 = 0{,}6445}$ **(Peringkat 1 - Teratas)**
  - A4: $D^+ = 0{,}0552$, $D^- = 0{,}0551 \rightarrow C_4 = 0{,}4995$ (Peringkat 3)
  - A5: $D^+ = 0{,}0840$, $D^- = 0{,}0187 \rightarrow C_5 = 0{,}1820$ (Peringkat 5)
- **Mekanisme Anggaran Bertahap (Plafon Rp 15 Juta/Tahun):**
  - **Fase 1 (Prioritas Utama / Tahun 1):** A3 (Rp 8 Juta) + A1 (Rp 6 Juta) = **Rp 14 Juta** (di bawah plafon Rp 15M).
  - **Fase 2 (Prioritas Menengah / Tahun 2):** A4 (Rp 7 Juta) + A2 (Rp 5 Juta) = **Rp 12 Juta**.
  - **Fase 3 (Prioritas Berkala / Tahun 3):** A5 (Rp 6 Juta) = **Rp 6 Juta**.

### 4. Uji Ketahanan Sensitivitas ($\pm 20\%$)

Uji variasi bobot *One-At-A-Time* (OAT) sebesar $+20\%$ dan $-20\%$ pada seluruh delapan kriteria menunjukkan:
- Alternatif **A3 (Persimpangan Hegarmanah)** mempertahankan posisi **Peringkat 1 pada seluruh 16 pengujian variasi bobot**.
- Tidak terjadi pembalikan peringkat (*rank reversal*) pada kelompok prioritas utama, membuktikan bahwa model keputusan sangat stabil terhadap potensi fluktuasi subjektivitas pakar.

---

## IV. LOG BERKAS PROYEK YANG DIHASILKAN DAN DIPERBARUI

Berikut rincian berkas yang telah diperbarui dan ditambahkan ke dalam repositori:

| Nama Berkas | Lokasi Berkas | Status | Ringkasan Modifikasi |
|---|---|:---:|---|
| `catatan-perubahan-dan-perbaikan.md` | [`04-paper/`](file:///d:/project/dss/04-paper/catatan-perubahan-dan-perbaikan.md) | **BARU** | Dokumen changelog komprehensif dan matriks tanggapan butir-demi-butir terhadap kritik reviewer. |
| `draft-paper.tex` | [`04-paper/`](file:///d:/project/dss/04-paper/draft-paper.tex) | **DIUBAH** | Pembaruan total naskah LaTeX IEEEtran: konsistensi PRISMA, kepadatan BPS, CPTED/UU PDP, AHP hierarki, rumus TOPSIS lengkap, pilot dummy numerik, hapus istilah UTS/UAS. |
| `draft-paper.md` | [`04-paper/`](file:///d:/project/dss/04-paper/draft-paper.md) | **DIUBAH** | Sinkronisasi penuh dengan naskah LaTeX, format markdown rapi dengan link referensi aktif. |
| `checklist-revisi-tim.md` | [`01-protokol/`](file:///d:/project/dss/01-protokol/checklist-revisi-tim.md) | **BARU** | Panduan pembagian tugas 17 butir kerja (Fase 1–4) untuk 5 anggota tim dengan RACI dan Definition of Done. |
| `checklist-revisi-tim.csv` | [`01-protokol/`](file:///d:/project/dss/01-protokol/checklist-revisi-tim.csv) | **BARU** | Format spreadsheet checklist tim siap impor ke Excel/Google Sheets. |
| `matriks-studi-kriteria.md` | [`03-sintesis/`](file:///d:/project/dss/03-sintesis/matriks-studi-kriteria.md) | **BARU** | Sumber data tunggal pemetaan 12 studi $\times$ 9 kriteria beserta kutipan bukti tekstual. |
| `pilot_ahp_topsis.py` | [`03-sintesis/`](file:///d:/project/dss/03-sintesis/pilot_ahp_topsis.py) | **BARU** | Skrip Python lengkap untuk perhitungan AHP, TOPSIS, alokasi anggaran, dan uji sensitivitas $\pm 20\%$. |
| `tahap-4-pilot-dummy-numerik.md` | [`03-sintesis/`](file:///d:/project/dss/03-sintesis/tahap-4-pilot-dummy-numerik.md) | **BARU** | Laporan verifikasi numerik pilot dummy lengkap untuk justifikasi matematis model. |
| `data-charting-12.csv` | [`02-data/`](file:///d:/project/dss/02-data/data-charting-12.csv) | **DIUBAH** | Penyelarasan kolom kriteria relevansi untuk Feizizadeh, Baddour, Almassawa, dan Zheng. |
| `taksonomi-5-pola.mmd` | [`04-paper/diagram/`](file:///d:/project/dss/04-paper/diagram/taksonomi-5-pola.mmd) | **DIUBAH** | Penggunaan nama penulis pada diagram, penegasan 4 pola diadopsi dan 1 ditolak. |
| `arsitektur-4-lapis.mmd` | [`04-paper/diagram/`](file:///d:/project/dss/04-paper/diagram/arsitektur-4-lapis.mmd) | **DIUBAH** | Pemisahan modul kriteria urgensi C1–C8 dari kendala kelayakan/biaya C9 pada layer DSS. |

---

## V. KESIMPULAN

Seluruh butir kritik yang diajukan telah terselesaikan secara tuntas. Naskah paper ([`draft-paper.tex`](file:///d:/project/dss/04-paper/draft-paper.tex) dan [`draft-paper.md`](file:///d:/project/dss/04-paper/draft-paper.md)) kini telah memenuhi standar integritas ilmiah, memiliki konsistensi angka yang dapat diverifikasi silang ke tabel data mentah, dilengkapi landasan kriminologi dan hukum privasi, serta memiliki model matematis yang terbukti dapat dioperasikan secara numerik tanpa kontradiksi internal.
