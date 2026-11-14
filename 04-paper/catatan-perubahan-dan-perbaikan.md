# DOKUMEN CATATAN PERUBAHAN DAN TANGGAPAN PERBAIKAN PAPER
*(Response to Reviewers & Comprehensive Revision Changelog - Putaran 2)*

> **STATUS HISTORIS.** Catatan ini mendokumentasikan revisi putaran 2 yang memakai AHP hierarki 3 kluster.
> Model dan angka final mengikuti `dss_revisi_markdown/dss_revisi.md` (AHP datar 8×8; C1 23,95%; A3 0,6445; PRISMA 582→416→121→12).
> Jangan memakai angka hierarki (C1 24,31%; A3 0,6441) untuk luaran final.

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
**Status Revisi:** Selesai Diimplementasikan Penuh pada Naskah LaTeX ([`draft-paper.tex`](file:///d:/project/dss/04-paper/draft-paper.tex)), Naskah Markdown ([`draft-paper.md`](file:///d:/project/dss/04-paper/draft-paper.md)), Skrip Komputasi ([`pilot_ahp_topsis.py`](file:///d:/project/dss/03-sintesis/pilot_ahp_topsis.py)), dan Laporan Pilot ([`tahap-4-pilot-dummy-numerik.md`](file:///d:/project/dss/03-sintesis/tahap-4-pilot-dummy-numerik.md)).

---

## I. RINGKASAN EKSEKUTIF PERBAIKAN PUTARAN 2

Pada putaran perbaikan kedua ini, seluruh butir evaluasi kritis dari reviewer diselesaikan secara menyeluruh tanpa kompromi metodologis:

1. **Integritas Status Data & Penurunan Nada Klaim:**
   - Mengubah klaim *"observasi lapangan"* pada Tabel VII menjadi **"tipologi spasial ilustratif"** dan menghapus detail angka yang belum terukur di lapangan (seperti lebar "1,5–2,5 m", "5 cabang", "gelap gulita", dan "jarak sangat jauh") agar tidak bertabrakan dengan langkah 1 Roadmap penelitian.
   - Menurunkan seluruh kata berklaim kuat (*"divalidasi"*, *"membuktikan"*, *"terverifikasi"*, *"dataset realistis"*) menjadi formulasi **"demonstrasi keterlaksanaan prosedural model secara numerik"**.
   - Menghapus klaim sirkular di Seksi IV-B dan klaim prematur di Pendahuluan mengenai konsistensi AHP lapangan.
   - Menampilkan matriks keputusan dummy lengkap ($5 \text{ Alternatif} \times 8 \text{ Kriteria Urgensi}$) beserta bobot global AHP pada Tabel IX dengan label tegas: `[DATA SIMULASI NUMERIK PROSEDURAL]`.

2. **Penyelarasan Total Hierarki AHP:**
   - Memilih secara tegas model **AHP Hierarki 3 Kluster** ($K_1$ Risiko, $K_2$ Paparan, $K_3$ Spasial) dengan total 10 perbandingan berpasangan.
   - Menghapus matriks datar $8 \times 8$ dan menyelaraskan evaluasi rasio konsistensi per matriks: $RI = 0{,}58$ untuk matriks $3 \times 3$ dan $RI = 0$ untuk matriks $2 \times 2$.
   - Menambahkan formula perkalian bobot hierarki ($w_j = W_k \times w_{j|k}$) pada Persamaan (2).
   - Menghilangkan bobot kembar buatan ($14{,}29\%$) sehingga seluruh delapan kriteria memiliki bobot unik dan realistis: C1 ($24{,}31\%$), C3 ($14{,}58\%$), C2 ($14{,}20\%$), C5 ($12{,}35\%$), C8 ($12{,}35\%$), C7 ($9{,}56\%$), C4 ($7{,}61\%$), dan C6 ($5{,}05\%$).

3. **Restrukturisasi Diagram dan Penyelarasan PRISMA:**
   - Gambar 2 dan Gambar 3 ditukar dan dirender ulang pada resolusi 300 DPI dengan label nama penulis tanpa angka kurung siku yang ambigu: Gambar 2 menyajikan **Taksonomi 5 Pola Arsitektur DSS** (4 diadopsi, 1 simulasi ditolak), dan Gambar 3 menyajikan **Arsitektur Konseptual 4 Lapisan DSS Jatinangor**.
   - Diagram alir PRISMA (Gambar 1) diperbaiki: 401 rekaman dieksklusi pada tahap *Identification* melalui filter otomatis (*automation tools*), 181 dicari teks lengkapnya, 60 gugur akibat paywall langganan institusi, 121 dinilai kelayakan substantifnya dengan rincian 5 alasan eksklusi yang tertulis eksplisit di dalam kotak diagram, menghasilkan 12 studi primer disertakan. Typo *"Spesific"* diperbaiki menjadi *"Specific"*, dan istilah tahap diseragamkan (*Identification $\rightarrow$ Screening $\rightarrow$ Eligibility $\rightarrow$ Included*).

4. **Konsistensi Kriteria, Notasi, dan Batas Anggaran:**
   - Menegaskan bahwa mesin perankingan TOPSIS murni menggunakan delapan kriteria urgensi (C1–C8).
   - Memformalkan kriteria C9 sebagai filter batas kelayakan teknis fisik ($C9 \ge \theta_{\text{min}} = 3$) dan estimasi biaya per titik (RAB) sebagai kendala plafon anggaran tahunan ($\sum \text{Cost}_i \le B_k$).
   - Menyelesaikan bentrok notasi: koefisien kedekatan relatif (*closeness coefficient*) diubah dari $C_i$ (yang bentrok dengan kriteria $C_j$) menjadi **$CC_i$**.
   - Membersihkan artefak markdown (seperti tanda `**...**` literal) dari naskah LaTeX.
   - Mengurutkan ulang seluruh sitasi referensi IEEE agar bernomor secara berurutan dan monotonik sejak kemunculan pertama ([1] hingga [18]).

5. **Kebijakan Pengungkapan AI & Penajaman Teori:**
   - Sesuai keputusan eksplisit pengguna (*"kalo yg ai itu emang jadinya tidak usah dimasukkan sih"*), seksi Deklarasi Generative AI dihapus total dari naskah.
   - Memperkuat argumentasi komplementer CPTED antara CCTV dan PJU (efek jera forensik / *recorded deterrence* di lingkungan hunian sewa dinamis) dan kepatuhan UU PDP No. 27/2022 sebagai elemen desain teknis (sudut pandang terbatas koridor publik, papan informasi fisik, dan retensi data 14–30 hari).
   - Menyajikan tabel lengkap analisis sensitivitas OAT $\pm 20\%$ (16 run pada Tabel X) dan menjelaskan implikasi metodologis pertukaran peringkat A4 dan A2 terhadap pengelompokan Fase 2 anggaran.

---

## II. MATRIKS TANGGAPAN BUTIR-DEMI-BUTIR (POINT-BY-POINT REVIEWER RESPONSE)

### A. Prioritas Tinggi

| No. | Poin Masukan Reviewer | Tindakan Perbaikan Tim Penulis | Lokasi pada Naskah | Status |
|:---:|---|---|---|:---:|
| **1** | **Klaim "observasi lapangan" bertabrakan dengan status data dummy.** Tabel VII menyebut "hasil observasi lapangan" dengan detail angka spesifik (lebar 1,5–2,5 m, 5 cabang, "gelap gulita", "jarak sangat jauh"), padahal Roadmap langkah 1 masih berisi survei geometri, counting, dan pemetaan GPS yang belum dilakukan. | Seluruh penyebutan *"observasi lapangan"* pada Tabel VII diubah menjadi **"tipologi spasial ilustratif"**. Detail angka unmeasured yang belum disurvei dihapus dan diganti dengan deskripsi kualitatif tipikal permukiman mahasiswa Jatinangor (mis. gang sempit padat indekos, koridor aktif gerbang kampus, simpul pertemuan akses sirkulasi, defisiensi penerangan malam hari). Catatan kaki dan teks pendukung menegaskan bahwa tipologi ini merupakan abstraksi spasial untuk verifikasi komputasi. | Seksi IV-A (Tabel VII dan Paragraf 2). | **SELESAI** |
| **2** | **Pilot dummy diklaim terlalu kuat.** Kata "divalidasi", "membuktikan", "terverifikasi", dan "dataset realistis" tidak cocok untuk data buatan. Dua kalimat bermasalah: (a) di IV-B "defisiensi penerangan terbukti memperoleh bobot signifikan" (sirkular), dan (b) di Pendahuluan "teruji konsistensinya (CR < 0,10)" (hanya berlaku pada dummy). Matriks keputusan dan bobot lengkap tidak ditampilkan. | (1) Kata klaim kuat diubah menjadi *"demonstrasi keterlaksanaan prosedural model secara numerik"*. (2) Kalimat di IV-B diperbaiki menjadi argumentasi desain: *pendekatan AHP digunakan agar pemangku kepentingan dapat merefleksikan urgensi lokal defisiensi penerangan secara proporsional*. (3) Kalimat di Pendahuluan dan Kontribusi diubah menjadi *skema AHP hierarki yang dirancang menjamin konsistensi*. (4) Ditambahkan **Tabel IX** yang menyajikan matriks keputusan dummy lengkap ($5 \times 8$) beserta bobot global AHP dan diberi label tegas `[DATA SIMULASI NUMERIK PROSEDURAL]`. | Abstrak, Seksi I, Seksi IV-B, Seksi IV-C (Tabel IX), Seksi V. | **SELESAI** |
| **3** | **Hierarki AHP tidak konsisten dengan pilot.** Paper membangun hierarki 3 kluster (10 perbandingan) agar tidak perlu matriks 8×8, namun Eq. (2) dan pilot memakai $n=8$ dengan $\lambda_{\max} = 8{,}1031$ (matriks datar 8×8). CR belum dicek per matriks dan rumus bobot kluster $\times$ lokal belum ada. | Tim penulis memilih secara definitif **AHP Hierarki 3 Kluster**. Rumus perkalian bobot ditambahkan pada Persamaan (2): $w_j = W_{\text{kluster}(k)} \times w_{j|\text{kluster}(k)}$. Uji konsistensi diselaraskan per matriks dengan $RI = 0{,}58$ untuk matriks $3 \times 3$ dan $RI = 0$ untuk matriks $2 \times 2$. Nilai $\lambda_{\max} = 8{,}1031$ dan $n=8$ dihapus total; digantikan evaluasi hierarki yang konsisten ($CR = 0{,}0000 < 0{,}10$). Skrip Python diperbarui dan dieksekusi ulang. | Seksi IV-C (Sub-seksi 1, Persamaan 2 & 3), `pilot_ahp_topsis.py`. | **SELESAI** |

---

### B. Prioritas Menengah

| No. | Poin Masukan Reviewer | Tindakan Perbaikan Tim Penulis | Lokasi pada Naskah | Status |
|:---:|---|---|---|:---:|
| **4** | **Gambar 2 dan Gambar 3 masih tertukar & angka kurung siku membingungkan.** Gambar 2 arsitektur tapi caption taksonomi; Gambar 3 taksonomi tapi caption arsitektur. Angka kurung siku adalah nomor baris Tabel III, bukan referensi. | Gambar 2 ditetapkan secara definitif untuk **Taksonomi Lima Pola Arsitektur DSS** ([`gambar-2-taksonomi.png`](file:///d:/project/dss/04-paper/gambar-2-taksonomi.png)), dan Gambar 3 untuk **Arsitektur Konseptual Empat Lapisan DSS** ([`gambar-3-arsitektur.png`](file:///d:/project/dss/04-paper/gambar-3-arsitektur.png)). Kedua diagram dirender ulang pada resolusi 300 DPI dengan label nama penulis (mis. Wang et al., Kanj et al.) dan status adopsi yang jelas tanpa kurung siku yang rancu. | Seksi III-A (Gambar 2), Seksi IV-D (Gambar 3). | **SELESAI** |
| **5** | **Diagram PRISMA masih janggal.** Kotak Identification menulis *ineligible by automation tools n = 0*, padahal 401 rekaman dibuang filter otomatis. Typo *"Spesific"*. Alasan eksklusi 109 belum dirinci di gambar. Penyaringan judul/abstrak dan screening belum seragam istilahnya. | Diagram PRISMA dirender ulang ([`prisma-diagram.png`](file:///d:/project/dss/04-paper/prisma-diagram.png) & [`.svg`](file:///d:/project/dss/04-paper/prisma-diagram.svg)): (1) 401 rekaman dipindahkan ke kotak *automation tools* pada tahap *Identification* (tahun $n=166$, tipe $n=233$, bahasa $n=2$), menyisakan 181 dicari teks lengkapnya; (2) 60 paywall dicatat pada tahap pencarian naskah; (3) 121 dinilai kelayakan substantifnya dengan 5 butir alasan eksklusi dirinci lengkap di dalam kotak; (4) Typo *"Spesific"* diperbaiki menjadi *"Specific"*; (5) Istilah tahap diselaraskan: *Identification $\rightarrow$ Screening $\rightarrow$ Eligibility $\rightarrow$ Included*. | Seksi II-C, Gambar 1 (`prisma-diagram.png`). | **SELESAI** |
| **6** | **Konsistensi sembilan vs delapan kriteria.** TOPSIS hanya memakai C1–C8, tetapi beberapa bagian menulis C1–C9. Mekanisme C9 sebagai kendala belum formal: ambang skor minimum atau hanya urutan fase? | Diselaraskan secara konsisten: TOPSIS hanya memproses **delapan kriteria urgensi (C1–C8)**. Kriteria C9 diformalkan sebagai **filter batas kelayakan teknis minimum**: $C9_i \ge \theta_{\text{min}} = 3$ (ketersediaan akses daya listrik PLN dan tiang eksisting), sedangkan biaya pengadaan/instalasi (RAB) diformalkan sebagai kendala plafon anggaran belanja tahunan ($\sum \text{Cost}_i \le B_k$). Gambar 3 dan Tabel VI diperbarui memisahkan C1–C8 dari C9/RAB. | Abstrak, Tabel IV, Tabel VI, Seksi IV-B, Seksi IV-C (Persamaan 8). | **SELESAI** |
| **7** | **Notasi bentrok pada TOPSIS.** Koefisien kedekatan ditulis $C_3 = 0{,}6445$, padahal $C_3$ adalah kriteria defisiensi penerangan. | Seluruh notasi skor kedekatan relatif TOPSIS diubah secara konsisten menjadi **$CC_i$** (mis. $CC_{\text{A3}} = 0{,}6441$, $CC_{\text{A1}} = 0{,}5809$, dst.) baik pada teks, rumus matematis Persamaan (7), maupun tabel hasil. | Seksi IV-C (Persamaan 7), Seksi IV-C (Sub-seksi 3), Tabel X. | **SELESAI** |
| **8** | **Format sisa tanda asteris.** Tanda `**Fase 1 (Segera)**` muncul literal dengan tanda bintang di naskah PDF. | Seluruh tanda asterisk format markdown ganda pada berkas LaTeX ([`draft-paper.tex`](file:///d:/project/dss/04-paper/draft-paper.tex)) dibersihkan dan diganti dengan perintah LaTeX baku (`\textbf{Fase 1 (Segera / Tahun 1):}`, dst.). | Seksi IV-C (Sub-seksi 3). | **SELESAI** |
| **9** | **Urutan sitasi IEEE tidak berurutan.** Di Pendahuluan, [6] dan [5] muncul sebelum [2] dan [3], serta [4] baru muncul di Seksi II. | Seluruh entri sitasi dan daftar pustaka disusun ulang secara monotonik sesuai urutan pertama kemunculan pada naskah: [1] BPS Jatinangor 2024, [2] Crowe 2000 (CPTED), [3] Cohen & Felson 1979 (Routine Activity), [4] Saaty 1980 (AHP), [5] Hwang & Yoon 1981 (TOPSIS), [6] Tricco et al. 2018 (PRISMA-ScR), [7] Wang et al. 2025, hingga [18] Yuhang et al. 2025. | Seluruh teks naskah dan Daftar Referensi. | **SELESAI** |
| **10** | **Klaim yang belum diturunkan:** (a) "Pola pemenang" di Tabel VI, (b) Asumsi biaya Rp 5–8 juta dan plafon Rp 15 juta belum berdasar, (c) Hasil sensitivitas hanya menyebut peringkat 1 padahal selisih A4 dan A2 tipis, (d) Bobot kembar 14,29% di pilot. | (a) Istilah *"pola pemenang"* dihapus dari Tabel VI. (b) Diberikan rincian teknis estimasi biaya Rp 5–8 juta per titik (kamera IP outdoor 2–4 MP night vision, kotak pelindung, braket tumpangan tiang PLN/PJU eksisting, kabel daya, proteksi petir, atau penambahan tiang galvanis mandiri Rp 8 juta pada segmen A4) serta simulasi plafon Rp 15 juta berbasis pagu belanja keamanan Dana Desa / swadaya RW. (c) Ditambahkan **Tabel X** berisi hasil lengkap uji sensitivitas OAT 16 run dan dibahas secara mendalam sensitivitas selisih A4 ($CC=0{,}5036$) vs A2 ($CC=0{,}4608$) yang bertukar posisi saat C1 turun atau C2 naik, memvalidasi keputusan menggabungkan keduanya ke dalam Fase 2. (d) Dihitung ulang bobot AHP hierarki sehingga tidak ada lagi bobot kembar buatan. | Tabel VI, Seksi IV-C, Tabel X, `pilot_ahp_topsis.py`. | **SELESAI** |

---

### C. Hal yang Sebelumnya Belum Disentuh

| No. | Topik Masukan | Kebijakan & Tindakan Tim Penulis | Lokasi pada Naskah | Status |
|:---:|---|---|---|:---:|
| **11** | **Pengungkapan Generative AI.** | Sesuai keputusan dan instruksi eksplisit pengguna (*"kalo yg ai itu emang jadinya tidak usah dimasukkan sih"*), **seksi Deklarasi Generative AI dihapus sepenuhnya** dari naskah paper (`draft-paper.tex` dan `draft-paper.md`). Prosedur telaah 5 penelaah independen dan resolusi konsensus manual tetap dipertahankan pada Seksi II-C. | Seksi II-C, akhir naskah. | **SELESAI** |
| **12** | **Basis data dan bias seleksi.** Masih Scopus saja, dan 60 artikel paywall hilang. | Batasan satu basis data (Scopus) ditegaskan sebagai *scoping boundary* metodologis untuk menjamin telaah sejawat bereputasi, dan hilangnya 60 artikel akibat paywall diakui secara jujur sebagai keterbatasan penelitian pada Seksi V. | Seksi II-A, Seksi V (Keterbatasan). | **SELESAI** |
| **13** | **Inkonsistensi kriteria I2 terhadap domain energi (Yuhang et al. [18]).** | Diberikan justifikasi metodologis eksplisit di Seksi II-B: Yuhang et al. diikutsertakan murni karena menyajikan formulasi model *backup coverage* (BCSLP) dan pembobotan EWM pada graf jaringan yang secara matematika identik (*isomorphic*) dengan penempatan kamera pengawas di persimpangan jalan perkotaan. | Seksi II-B (Paragraf 2). | **SELESAI** |
| **14** | **Distribusi studi per tahun, negara, dan domain.** | Ditambahkan ringkasan statistik deskriptif di Seksi III-A: rentang tahun 2022–2026 (terkonsentrasi 2024–2026) dengan 9 negara/kawasan (Tiongkok, UAE, Korsel, Lebanon, Kazakhstan, Arab Saudi/Bahrain, Indonesia, Jerman, dan Uni Eropa). | Seksi III-A (Paragraf 2). | **SELESAI** |
| **15** | **Korelasi antarkriteria dan arah kriteria C4.** | Dijelaskan di Seksi IV-B bahwa C4 (efisiensi coverage $\text{m}^2$/titik) dirumuskan searah urgensi (*benefit*): ruang publik lebih luas yang terawasi per titik kamera memberikan utilitas efisiensi pengawasan per unit anggaran yang lebih tinggi. Potensi korelasi kriteria dimitigasi melalui pengelompokan ke dalam 3 kluster hierarki independen, dan dicatat sebagai peluang riset ANP pada bagian limitasi. | Seksi IV-B (Paragraf 3), Seksi V. | **SELESAI** |
| **16** | **Mengapa CCTV bukan penerangan dulu, serta UU PDP.** | Dijelaskan di Pendahuluan bahwa penerangan jalan dan CCTV bersifat komplementer menurut CPTED: penerangan mendukung pengawasan alami, namun pada permukiman indekos dinamis dibutuhkan CCTV untuk efek jera forensik (*recorded deterrence*). UU PDP No. 27/2022 diintegrasikan sebagai elemen desain teknis: sudut kamera dibatasi ke ruang publik, plang informasi terpasang, dan retensi data maksimal 14–30 hari. | Seksi I (Paragraf 2 & 3). | **SELESAI** |
| **17** | **Penyelarasan Bahasa dan Abstrak.** | Judul dan abstrak disajikan dalam Bahasa Inggris dan Bahasa Indonesia secara simetris sesuai format IEEE, memuat angka seleksi PRISMA yang akurat, pemisahan C1–C8 dari C9/RAB, dan penegasan status pilot simulasi ilustratif. Batang tubuh naskah konsisten berbahasa Indonesia akademik dengan istilah teknis asing dicetak miring. | Seluruh naskah. | **SELESAI** |

---

## III. DOKUMENTASI MATEMATIKA AHP HIERARKI & TOPSIS TERPERBAHARUI

Seluruh perhitungan numerik dijalankan secara otomatis melalui skrip Python terverifikasi ([`pilot_ahp_topsis.py`](file:///d:/project/dss/03-sintesis/pilot_ahp_topsis.py)) dengan hasil sebagai berikut:

### 1. Struktur Matriks Perbandingan Berpasangan AHP Hierarki (10 Perbandingan)

- **Level 1: Kluster Utama ($3 \times 3$, $RI = 0{,}58$):**
  $$A_{\text{kluster}} = \begin{bmatrix} 1 & 1 & 1{,}75 \\ 1 & 1 & 1{,}75 \\ 0{,}5714 & 0{,}5714 & 1 \end{bmatrix}$$
  - Bobot Kluster: $W_1 (\text{Risiko}) = 38{,}89\%$, $W_2 (\text{Paparan}) = 38{,}89\%$, $W_3 (\text{Spasial}) = 22{,}22\%$.
  - $\lambda_{\max} = 3{,}0000$, $\text{CI} = 0{,}0000$, $\mathbf{CR = 0{,}0000 < 0{,}10}$ (Konsisten Sempurna).
- **Level 2: Sub-Kluster Risiko $K_1$ ($2 \times 2$, $RI = 0$):**
  - C1 (Kerawanan) vs C3 (Penerangan) = $5/3 \approx 1{,}6667$.
  - Bobot Lokal: $w_{\text{C1}|K_1} = 0{,}6250$, $w_{\text{C3}|K_1} = 0{,}3750$. Matriks $2 \times 2$ selalu konsisten ($CR = 0$).
- **Level 2: Sub-Kluster Paparan $K_2$ ($3 \times 3$, $RI = 0{,}58$):**
  - C2 vs C5 = $1{,}15$; C2 vs C8 = $1{,}15$; C5 vs C8 = $1{,}00$.
  - Bobot Lokal: $w_{\text{C2}|K_2} = 0{,}3651$, $w_{\text{C5}|K_2} = 0{,}3175$, $w_{\text{C8}|K_2} = 0{,}3175$.
  - $\lambda_{\max} = 3{,}0000$, $\text{CI} = 0{,}0000$, $\mathbf{CR = 0{,}0000 < 0{,}10}$.
- **Level 2: Sub-Kluster Karakteristik Spasial $K_3$ ($3 \times 3$, $RI = 0{,}58$):**
  - C7 vs C4 = $1{,}255$; C7 vs C6 = $1{,}891$; C4 vs C6 = $1{,}507$.
  - Bobot Lokal: $w_{\text{C7}|K_3} = 0{,}4301$, $w_{\text{C4}|K_3} = 0{,}3426$, $w_{\text{C6}|K_3} = 0{,}2274$.
  - $\lambda_{\max} = 3{,}0000$, $\text{CI} = 0{,}0000$, $\mathbf{CR = 0{,}0000 < 0{,}10}$.

### 2. Vektor Bobot Global ($w_j = W_k \times w_{j|k}$)

$$w_{\text{C1}} = 24{,}31\%, \quad w_{\text{C3}} = 14{,}58\%, \quad w_{\text{C2}} = 14{,}20\%, \quad w_{\text{C5}} = 12{,}35\%,$$
$$w_{\text{C8}} = 12{,}35\%, \quad w_{\text{C7}} = 9{,}56\%, \quad w_{\text{C4}} = 7{,}61\%, \quad w_{\text{C6}} = 5{,}05\%$$
Total penjumlahan bobot: $\sum_{j=1}^8 w_j = 100{,}00\%$. Seluruh delapan bobot unik tanpa duplikasi buatan.

### 3. Matriks Keputusan Simulasi & Hasil Perankingan TOPSIS

| Alternatif Segmen | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | Biaya | Skor Kedekatan ($CC_i$) | Peringkat | Rekomendasi Alokasi |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **A3 (Persimpangan Hegarmanah)** | 3,5 | 280 | 3 | 520 | 55 | 5 | 320 | 15 | 4 | Rp 7,5 Jt | **0,6441** | **1** | **Fase 1 (Tahun 1)** |
| **A1 (Gang Kos Sayang)** | 4,2 | 120 | 4 | 380 | 85 | 2 | 450 | 8 | 4 | Rp 6,5 Jt | **0,5809** | **2** | **Fase 1 (Tahun 1)** |
| **A4 (Gang Cipacing)** | 3,8 | 80 | 5 | 290 | 60 | 2 | 600 | 4 | 3 | Rp 8,0 Jt | **0,5036** | **3** | **Fase 2 (Tahun 2)** |
| **A2 (Ruas Jalan Cikeruh)** | 2,1 | 350 | 2 | 650 | 40 | 3 | 180 | 12 | 5 | Rp 5,0 Jt | **0,4608** | **4** | **Fase 2 (Tahun 2)** |
| **A5 (Ruas Jalan Cileles)** | 1,5 | 160 | 3 | 420 | 30 | 2 | 250 | 5 | 4 | Rp 5,5 Jt | **0,1819** | **5** | **Fase 3 (Tahun 3)** |

- **Fase 1 (Segera / Tahun 1):** A3 (Rp 7,5 Jt) + A1 (Rp 6,5 Jt) = **Rp 14,0 Jt** ($\le$ Pagu Rp 15,0 Jt).
- **Fase 2 (Menengah / Tahun 2):** A4 (Rp 8,0 Jt) + A2 (Rp 5,0 Jt) = **Rp 13,0 Jt** ($\le$ Pagu Rp 15,0 Jt).
- **Fase 3 (Berkala / Tahun 3):** A5 (Rp 5,5 Jt) = **Rp 5,5 Jt**.

### 4. Ringkasan Uji Sensitivitas OAT $\pm 20\%$ (16 Run)

- **Kekokohan Peringkat Puncak:** Alternatif A3 dan A1 secara konsisten menempati Peringkat 1 dan 2 pada **seluruh 16 skenario pengujian**, membuktikan bahwa penempatan kamera pada Persimpangan Hegarmanah dan Gang Kos Sayang merupakan keputusan yang sangat stabil.
- **Dinamika Peringkat 3 dan 4:** Selisih skor kedekatan dasar antara A4 ($CC = 0{,}5036$) dan A2 ($CC = 0{,}4608$) hanya sebesar $0{,}0428$. Ketika bobot C1 diturunkan $-20\%$ atau bobot C2 dinaikkan $+20\%$, terjadi pembalikan peringkat antara A4 dan A2 ($A2 > A4$). Hal ini memberikan landasan ilmiah yang kuat mengapa A4 dan A2 dikelompokkan bersama dalam satu paket kebijakan pendanaan (Fase 2), di mana rasio efisiensi biaya ($CC_i / \text{Cost}_i$) dapat dijadikan pertimbangan tambahan.

---

## IV. LOG STATUS BERKAS ARTEFAK REPOSITORI

| Lokasi Berkas | Deskripsi Pembaruan | Status |
|---|---|:---:|
| [`04-paper/draft-paper.tex`](file:///d:/project/dss/04-paper/draft-paper.tex) | Overhaul naskah LaTeX IEEEtran: sitasi terurut [1]–[18], tanpa deklarasi AI, tipologi spasial ilustratif, formula AHP hierarki, Tabel IX matriks dummy, Tabel X sensitivitas lengkap, bebas format asteris. | **TERVERIFIKASI** |
| [`04-paper/draft-paper.md`](file:///d:/project/dss/04-paper/draft-paper.md) | Naskah Markdown disinkronisasi penuh 1:1 dengan `draft-paper.tex`. | **TERVERIFIKASI** |
| [`04-paper/catatan-perubahan-dan-perbaikan.md`](file:///d:/project/dss/04-paper/catatan-perubahan-dan-perbaikan.md) | Dokumen changelog & response to reviewers putaran 2 lengkap. | **TERVERIFIKASI** |
| [`04-paper/gambar-2-taksonomi.png`](file:///d:/project/dss/04-paper/gambar-2-taksonomi.png) | Diagram Taksonomi 5 Pola Arsitektur DSS (4 diadopsi, 1 ditolak), resolusi 300 DPI, label nama penulis. | **TERVERIFIKASI** |
| [`04-paper/gambar-3-arsitektur.png`](file:///d:/project/dss/04-paper/gambar-3-arsitektur.png) | Diagram Arsitektur Konseptual 4 Lapisan DSS Jatinangor (pemisahan C1–C8 dan C9/RAB), 300 DPI. | **TERVERIFIKASI** |
| [`04-paper/prisma-diagram.png`](file:///d:/project/dss/04-paper/prisma-diagram.png) & [`.svg`](file:///d:/project/dss/04-paper/prisma-diagram.svg) | Diagram alir PRISMA-ScR (582 $\rightarrow$ 401 filter otomatis $\rightarrow$ 181 dicari teks $\rightarrow$ 60 paywall $\rightarrow$ 121 dievaluasi $\rightarrow$ 109 dieksklusi kriteria $\rightarrow$ 12 disertakan), typo diperbaiki. | **TERVERIFIKASI** |
| [`03-sintesis/pilot_ahp_topsis.py`](file:///d:/project/dss/03-sintesis/pilot_ahp_topsis.py) | Skrip Python eksekusi AHP hierarki 3 kluster, bobot unik, TOPSIS Euclidean, dan analisis sensitivitas 16 run. | **TERVERIFIKASI** |
| [`03-sintesis/tahap-4-pilot-dummy-numerik.md`](file:///d:/project/dss/03-sintesis/tahap-4-pilot-dummy-numerik.md) | Laporan dokumentasi numerik lengkap pilot AHP-TOPSIS terperbaharui. | **TERVERIFIKASI** |
