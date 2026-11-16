# Software Requirements Specification (SRS)
## Aplikasi DSS Prioritisasi Penempatan CCTV Jatinangor

**Versi dokumen:** 1.0

**Status:** dokumentasi aplikasi prototipe offline

**Sumber kebenaran model dan angka:** [`dss_revisi_markdown/dss_revisi.md`](../dss_revisi_markdown/dss_revisi.md)

**Implementasi yang dispesifikasikan:**
1. Prototipe offline mandiri: [`05-aplikasi/index.html`](../05-aplikasi/index.html)
2. Aplikasi modern Next.js 16 + Three.js + Supabase: [`07-webapp/`](../07-webapp/)

> Dokumen ini mendeskripsikan perilaku aplikasi yang sudah diimplementasikan. Apabila ada perbedaan penafsiran, model, angka, atau alur dengan dokumen lain, `dss_revisi_markdown/dss_revisi.md` diprioritaskan.

## 1. Tujuan dan ruang lingkup

Aplikasi adalah *Decision Support System* (DSS) berbasis web statis untuk membantu pemangku kepentingan menyusun prioritas kandidat segmen gang bagi penempatan CCTV di permukiman mahasiswa Jatinangor. Aplikasi menerapkan AHP untuk pembobotan kriteria urgensi dan TOPSIS untuk perankingan, lalu mengalokasikan alternatif layak ke fase anggaran.

Ruang lingkup prototipe mencakup:

- masukan matriks keputusan, nilai kelayakan teknis, estimasi biaya, dan matriks AHP;
- perhitungan AHP, TOPSIS, alokasi fase anggaran, dan sensitivitas bobot;
- visualisasi hasil berupa KPI, tabel, peta skematik SVG, dan ekspor CSV;
- pemilihan dataset resmi lima segmen atau skenario perluasan simulasi.

Aplikasi tidak merupakan sistem operasional pengawasan CCTV, tidak merekam video, tidak menentukan lokasi GPS final, tidak mengadakan perangkat, dan tidak menggantikan survei lapangan atau keputusan institusi.

## 2. Pemangku kepentingan dan aktor

| Aktor | Kepentingan dan interaksi |
|---|---|
| Operator DSS | Membuka aplikasi, memilih dataset, mengubah nilai masukan, membaca hasil, mereset data, dan mengekspor hasil CSV. |
| Pemerintah daerah | Menjadi kelompok pemangku kepentingan konseptual pemberi preferensi AHP serta pengguna keluaran prioritas dan fase anggaran. |
| Pengelola kampus | Menjadi kelompok pemangku kepentingan konseptual pemberi preferensi AHP dan pengguna keluaran untuk koordinasi keselamatan kawasan. |
| Komunitas warga/RT-RW/pengelola indekos | Menjadi kelompok pemangku kepentingan konseptual pemberi preferensi AHP dan sumber validasi kondisi lokal. |
| Peneliti/pengembang | Memelihara data, algoritma, dokumentasi, dan pengujian paritas aplikasi. |

Aplikasi saat ini tidak mempunyai autentikasi, otorisasi per peran, basis data, atau layanan jaringan. Karena itu, istilah aktor menjelaskan penggunaan dan konteks keputusan, bukan hak akses perangkat lunak.

## 3. Dasar model keputusan

### 3.1 Alternatif dan dataset

- **Dataset `resmi`** memuat lima alternatif segmen A1–A5 dan menjadi hasil utama aplikasi karena sesuai model ilustratif dalam naskah kanonik.
- **Dataset `perluasan`** memuat 12 segmen tingkat desa hanya untuk demonstrasi skalabilitas. Dataset ini wajib ditampilkan dan diperlakukan sebagai **[SIMULASI]**, bukan hasil utama atau data lapangan.
- Model konseptual dan uji numerik naskah kanonik belum merupakan validasi empiris lapangan.

### 3.2 Pemisahan C1–C8 dari C9 dan RAB

| Kelompok | Peran dalam sistem | Perlakuan aplikasi |
|---|---|---|
| C1 Riwayat Kerawanan, C2 Mobilitas Malam, C3 Defisiensi PJU, C4 Efisiensi Coverage, C5 Kepadatan Kos, C6 Derajat Simpul, C7 Gap CCTV Eksisting, C8 POI Rentan | Kriteria urgensi, seluruhnya berorientasi *benefit* terhadap urgensi. Nilai lebih tinggi berarti kebutuhan pengawasan lebih mendesak. | Menjadi delapan kolom matriks keputusan TOPSIS dan delapan kriteria matriks AHP. |
| C9 Kesiapan tiang, listrik, dan jaringan | Kelayakan teknis berskala 1–5. | Bukan kriteria TOPSIS dan bukan bagian matriks AHP 8×8. C9 dipakai bersama biaya saat alokasi fase. |
| Estimasi biaya/RAB per titik | Kendala finansial. | Tidak ikut TOPSIS. Total biaya anggota satu fase tidak boleh melampaui plafon tahunan aplikasi. |

`dss_revisi.md` menyatakan C9 dan RAB sebagai kendala kelayakan dan anggaran, serta C9 berskala 1–5, tetapi **tidak menetapkan ambang numerik C9**. Implementasi menggunakan **C9 ≥ 3 sebagai ambang kelayakan operasional** pada tahap alokasi. Ini adalah kebijakan implementasi terdokumentasi, bukan aturan numerik yang dikutip verbatim dari naskah kanonik.

### 3.3 Status data

Aplikasi memakai data **hybrid**. Data sekunder riil level desa/kecamatan digunakan sebagai kalibrasi, sedangkan nilai per segmen/gang yang belum tersedia dari observasi lapangan adalah estimasi terdokumentasi atau **[SIMULASI]**. Secara khusus, nilai C9 dan estimasi RAB per titik belum tervalidasi survei kesiapan tiang, listrik, jaringan, dan biaya lokasi. Rincian status serta sumber data tersedia pada [`08-docs/data-dan-sumber.md`](data-dan-sumber.md).

## 4. Kebutuhan fungsional

| ID | Kebutuhan |
|---|---|
| FR-01 | Sistem harus menyediakan dataset `resmi` lima segmen sebagai dataset awal dan menyatakan status dataset aktif. |
| FR-02 | Sistem harus menyediakan dataset `perluasan` 12 segmen yang dilabeli **[SIMULASI]** untuk demonstrasi skalabilitas tanpa mengubah hasil dataset resmi. |
| FR-03 | Sistem harus menampilkan dan menerima perubahan nilai C1–C8, C9, dan estimasi biaya per alternatif. Perubahan masukan harus memperbarui hasil tanpa kehilangan fokus pada sel yang sedang diedit. |
| FR-04 | Sistem harus menampilkan matriks perbandingan berpasangan AHP untuk delapan kriteria C1–C8, menerima pengubahan segitiga atas, dan membentuk segitiga bawah secara resiprokal. |
| FR-05 | Sistem harus menghitung dan menampilkan bobot AHP, `λmax`, CI, dan CR. Sistem harus menandai matriks konsisten jika CR < 0,10. |
| FR-06 | Sistem harus menghitung peringkat TOPSIS dari C1–C8 dengan normalisasi Euclidean, pembobotan AHP, solusi ideal, jarak ideal, dan koefisien kedekatan (CC). Nilai C9 dan RAB tidak boleh masuk ke matriks TOPSIS. |
| FR-07 | Sistem harus menentukan kelayakan teknis menggunakan ambang operasional C9 ≥ 3. Alternatif dengan C9 < 3 harus tetap tampak pada hasil peringkat, diberi penanda tidak layak, dan tidak dialokasikan ke fase. |
| FR-08 | Sistem harus mengalokasikan alternatif layak menurut CC menurun ke fase tahunan, dengan subtotal biaya setiap fase tidak melampaui plafon anggaran aplikasi. Alternatif dengan biaya satu titik di atas plafon tidak boleh dialokasikan dan harus diberi status yang dapat diamati. |
| FR-09 | Sistem harus menampilkan peta prioritas skematik SVG. Posisi peta bersifat relatif dan bukan koordinat GPS. Penanda alternatif tidak layak harus dapat dibedakan. |
| FR-10 | Sistem harus menjalankan analisis sensitivitas bobot *one-at-a-time* sebesar +20% dan −20% pada tiap C1–C8, merenormalisasi bobot lain, serta menampilkan susunan peringkat dan penanda pembalikan peringkat. |
| FR-11 | Sistem harus menyediakan fungsi reset untuk memulihkan dataset aktif dan matriks AHP awal. |
| FR-12 | Sistem harus mengekspor hasil peringkat, kelayakan, fase, biaya, dan CC ke berkas CSV. |
| FR-13 | Sistem modern (`07-webapp/`) harus menyediakan dua preset dataset: preset `ilustratif` (default, AHP hierarki 3 klaster × 3 kelompok responden agregat rata-rata geometrik sesuai `Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx`) dan preset `naskah_uts` (AHP datar 8×8 kanonik). |
| FR-14 | Sistem modern (`07-webapp/`) harus mengorganisasi antarmuka dalam 5 layar terdedikasi sesuai mockup `SiPrioCCTV Jatinangor.html` (Dashboard, Data Kriteria, Pembobotan AHP, Hasil TOPSIS & Anggaran, dan Uji Sensitivitas). |
| FR-15 | Sistem modern (`07-webapp/`) harus menyediakan visualisasi peta spasial 3D berbasis WebGL (Three.js) dengan pilar tinggi proporsional CC dan kontrol interaktif (orbit/hover/klik), serta tombol pengalih ke fallback SVG 2D. |
| FR-16 | Sistem modern (`07-webapp/`) harus menyediakan antarmuka kuesioner slider Saaty terpandu untuk pengisian perbandingan oleh pakar/responden. |
| FR-17 | Sistem modern (`07-webapp/`) harus mendukung integrasi repositori basis data Supabase (PostgreSQL + RLS) dengan mekanisme fallback otomatis (*graceful local fallback*) ke data statis lokal jika variabel lingkungan tidak disetel. |

## 5. Kebutuhan nonfungsional

| ID | Kebutuhan |
|---|---|
| NFR-01 | Aplikasi harus dapat dibuka langsung dari `index.html` pada peramban modern tanpa server, instalasi, atau koneksi internet. |
| NFR-02 | Perhitungan harus bersifat deterministik untuk masukan yang sama dan menggunakan mesin data-driven, sehingga jumlah alternatif berasal dari dataset, bukan nilai yang di-*hardcode* dalam algoritma. |
| NFR-03 | Implementasi harus menjaga keterlacakan hasil resmi melalui pengujian yang mengekstrak skrip aktual dari `index.html`, bukan melalui salinan algoritma. |
| NFR-04 | Antarmuka harus menggunakan Bahasa Indonesia, kecuali istilah teknis yang lazim seperti AHP, TOPSIS, CSV, dan SVG. |
| NFR-05 | Aplikasi harus mengomunikasikan status simulasi/hybrid dan batasannya, agar keluaran tidak disalahartikan sebagai keputusan lapangan yang tervalidasi. |
| NFR-06 | Visualisasi peta harus ringan dan menggunakan SVG tanpa dependensi visualisasi berat pada prototipe offline, serta mendukung WebGL 3D dengan fallback 2D pada aplikasi modern. |
| NFR-07 | Masukan numerik harus memiliki pembatas antarmuka minimum yang sesuai, termasuk C9 skala 1–5, biaya tidak negatif, dan elemen AHP positif. Validitas substantif masukan tetap menjadi tanggung jawab operator. |
| NFR-08 | Aplikasi harus mendukung audit hasil melalui tampilan nilai antara TOPSIS (D⁺, D⁻, CC), parameter AHP, status kelayakan, serta subtotal fase. |
| NFR-09 | Aplikasi modern (`07-webapp/`) harus memenuhi standar aksesibilitas web WCAG 2.1 Level AA (0 pelanggaran serius/kritis pada audit `axe-core`). |
| NFR-10 | Aplikasi modern (`07-webapp/`) harus dapat dideploy sebagai aplikasi statis teroptimasi ke platform cloud modern (Vercel). |

## 6. Batasan dan asumsi

1. Model numerik kanonik aplikasi adalah AHP datar 8×8 untuk C1–C8. Ini dipakai karena mereproduksi hasil numerik kanonik, walaupun terdapat narasi struktur hierarki pada bagian lain naskah sumber.
2. Konsensus multistakeholder dalam aplikasi direpresentasikan oleh matriks AHP awal. Pengumpulan kuesioner dan agregasi preferensi aktual bukan fungsi prototipe ini.
3. C1–C8 mengukur urgensi, bukan kelayakan pemasangan. Alternatif berurgensi tinggi masih dapat tidak dialokasikan bila tidak memenuhi ambang kelayakan operasional C9.
4. C9 ≥ 3 adalah ambang implementasi, bukan angka eksplisit dari `dss_revisi.md`; ambang ini harus dikaji ulang bila data lapangan atau kebijakan institusi tersedia.
5. Alokasi fase mengurutkan CC secara menurun dan tidak mengoptimalkan kombinasi biaya secara global. Rasio CC/biaya disebut naskah kanonik sebagai instrumen pendukung untuk urgensi yang berdekatan, tetapi bukan optimasi yang diimplementasikan aplikasi.
6. Peta bersifat skematik, bukan bukti posisi geografis, cakupan kamera, atau rancangan jaringan final.
7. Prototipe tidak menyimpan perubahan pengguna setelah halaman ditutup dan tidak mendukung kerja bersamaan.
8. Implementasi harus mematuhi keputusan dan pemeriksaan privasi yang berlaku sebelum penerapan nyata. Prototipe ini tidak memproses rekaman atau data pribadi.

## 7. Kriteria penerimaan

| ID | Kriteria penerimaan yang dapat diamati |
|---|---|
| AC-01 | Saat dibuka, aplikasi menampilkan dataset `resmi`, lima alternatif, matriks C1–C8, C9, biaya, matriks AHP 8×8, dan keluaran perhitungan. |
| AC-02 | Untuk input resmi, perhitungan menghasilkan λmax 8,1031, CI 0,0147, CR 0,0104, serta urutan TOPSIS A3 > A1 > A4 > A2 > A5. |
| AC-03 | Pengguna dapat mengubah masukan C1–C8, C9, biaya, atau AHP dan hasil diperbarui tanpa elemen input aktif kehilangan fokus. |
| AC-04 | Ketika C9 alternatif dibuat kurang dari 3, alternatif itu ditandai tidak layak pada hasil dan peta, serta fase alokasinya kosong/tidak dialokasikan, tanpa menghapus nilai TOPSIS-nya. |
| AC-05 | Setiap fase hanya memuat alternatif layak dan subtotal biayanya tidak melampaui plafon aplikasi. Alternatif dengan biaya satu titik di atas plafon ditandai tidak dialokasikan. |
| AC-06 | Analisis sensitivitas memuat 16 skenario, yaitu dua variasi untuk setiap dari delapan kriteria urgensi. |
| AC-07 | Pemilihan dataset perluasan menampilkan 12 segmen dan catatan bahwa data tersebut adalah simulasi. |
| AC-08 | Tombol reset mengembalikan kondisi awal dataset aktif dan matriks AHP awal. Tombol ekspor menghasilkan CSV hasil. |
| AC-09 | `node 05-aplikasi/test-algoritma.mjs` lulus, termasuk pemeriksaan paritas angka, CSV, filter C9, fase, sensitivitas, dan dataset perluasan. |

## 8. Keterlacakan

Matriks kebutuhan-ke-implementasi-pengujian terdapat pada [`08-docs/traceability.md`](traceability.md). Matriks tersebut menjadi rujukan untuk menilai cakupan kebutuhan terhadap fungsi aktual aplikasi dan skrip pengujian.
