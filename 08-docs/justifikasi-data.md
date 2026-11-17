# Justifikasi Data Dummy dan Data Riil

Dokumen ini menjelaskan jujur: data apa yang kami pakai, dari mana asalnya, apakah sudah dicari data riil lebih dulu, dan apa yang belum ada. Rincian sumber lengkap ada di [`data-dan-sumber.md`](data-dan-sumber.md); dokumen ini ringkasan justifikasi untuk presentasi.

**Jawaban singkat:** ya, data riil dicari lebih dulu. Data riil **ada pada level kecamatan, desa, dan kampus**, tetapi **tidak ada pada level gang/segmen permukiman**, yang justru merupakan unit keputusan kami. Maka nilai per-segmen diisi **estimasi terkalibrasi** dan diberi label.

---

## 1. Urutan kerja yang kami lakukan

1. **Mencari data riil** (web, bahasa Indonesia dan Inggris) dengan kata kunci antara lain: `CCTV Jatinangor`, `CCTV Sumedang Dishub jumlah titik`, `ATCS Sumedang kamera`, `open data Sumedang CCTV`, `pengadaan CCTV dana desa Sumedang`, `ETLE Jatinangor`, `CCTV Unpad Jatinangor`.
2. **Memeriksa sumber resmi:** portal Pemkab Sumedang, BPS, E-Office Desa, portal open data (data.go.id, Galura Jabar), LPSE Sumedang, Dishub, Polres, jurnal ilmiah, media lokal.
3. **Mencatat temuan** per level (kecamatan, desa, segmen) dan menandai mana yang riil.
4. **Mengisi celah** (per-segmen) dengan estimasi yang dikalibrasi ke angka riil level desa, lalu melabelinya `[SIMULASI]` atau "estimasi terdokumentasi".

## 2. Apa yang riil (dengan sumber)

| Data | Nilai | Sumber |
|---|---|---|
| Penduduk Kec. Jatinangor | lebih dari 98.000 jiwa, 12 desa, 26,20 km² | BPS Kab. Sumedang, *Kecamatan Jatinangor Dalam Angka 2024* |
| Penduduk per desa | total 91.469 jiwa (Cipacing 15.096; Hegarmanah 9.712; Sayang 8.474; Cikeruh 7.848; Cileles 6.331, dst.) | E-Office Desa Pemkab Sumedang |
| Kejahatan Jatinangor | 11 (2022) lalu 155 (2023); termasuk 3 wilayah prioritas Sumedang | Kapolres Sumedang via Kabar Sumedang, 31 Des 2023 |
| Kejahatan Kab. Sumedang | 955 (2023), 436 (2024) | Harapan Rakyat, 31 Des 2024 |
| Kamar kos Desa Hegarmanah | 4.250 unit | Profil Desa Hegarmanah (data 2014) |
| Defisiensi PJU | Jl. Narongtong–Cileles minim PJU; dipasang 5 unit di Blok Legok Artaen | KAPOL.ID, 12 Apr 2021 |
| CCTV di level kampus/koridor | titik ETLE depan Unpad | temuan di `data-dan-sumber.md` §6 |

Selisih BPS (>98.000) dan E-Office (91.469) berasal dari perbedaan tahun/definisi pencatatan; keduanya dicatat, BPS dipakai di naskah, E-Office untuk rincian per desa. Angka "Keluarga 377.951" di E-Office tidak masuk akal dan **sengaja tidak dikutip**.

## 3. Apa yang tidak ditemukan (gap)

- Jumlah dan lokasi CCTV resmi **per desa/gang** di permukiman mahasiswa Jatinangor: tidak ada di open data, LPSE, Dishub, maupun Polres. Yang beredar hanya proposal/jasa pemasangan dan CCTV internal kampus.
- Data insiden **per gang** (hanya tersedia agregat kecamatan).
- Hasil counting mobilitas malam, skor PJU per segmen, jumlah POI rentan per segmen, dan RAB per lokasi.

Karena unit keputusan kami adalah **segmen gang**, gap ini yang membuat sebagian data harus diestimasi.

## 4. Apa yang dummy/estimasi dan cara menetapkannya

Matriks keputusan (`05-aplikasi/data/alternatif-kriteria.csv`, Tabel III paper):

| Alt | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | Biaya (Jt) |
|---|---|---|---|---|---|---|---|---|---|---|
| A1 Gang Kos Sayang | 4,2 | 120 | 4 | 380 | 85 | 2 | 450 | 8 | 4 | 6,5 |
| A2 Ruas Jalan Cikeruh | 2,1 | 350 | 2 | 650 | 40 | 3 | 180 | 12 | 5 | 5,0 |
| A3 Persimpangan Hegarmanah | 3,5 | 280 | 3 | 520 | 55 | 5 | 320 | 15 | 4 | 7,5 |
| A4 Gang Cipacing | 3,8 | 80 | 5 | 290 | 60 | 2 | 600 | 4 | 3 | 8,0 |
| A5 Ruas Jalan Cileles | 1,5 | 160 | 3 | 420 | 30 | 2 | 250 | 5 | 4 | 5,5 |

| Kriteria | Status | Dasar penetapan |
|---|---|---|
| C1 Riwayat kerawanan | Riil level kecamatan; nilai per-segmen estimasi | Tren 11 lalu 155 kejahatan sebagai kalibrasi tingkat kerawanan relatif |
| C2 Mobilitas malam | Estimasi | Belum ada counting; perlu survei |
| C3 Defisiensi PJU | Riil kualitatif (Cileles terburuk), skor estimasi | Laporan KAPOL.ID dan opini media |
| C4 Efisiensi coverage | Estimasi | Perlu pengukuran geometri gang |
| C5 Kepadatan kos | Riil sebagian (Hegarmanah 4.250) | Profil desa; segmen lain estimasi |
| C6 Derajat simpul | Estimasi | Perlu pemetaan jaringan jalan |
| C7 Gap CCTV eksisting | Riil sebagian (ETLE Unpad) + simulasi per gang | Titik per gang disimulasikan, lihat `data-dan-sumber.md` §7 |
| C8 POI rentan | Estimasi | Perlu pemetaan radius 150 m |
| C9 Kesiapan tiang/listrik | Estimasi | Perlu survei teknis |
| Biaya | Estimasi | Kisaran pasar Rp 1,3–8 Jt per titik (vendor) |

Ringkasnya: **1 kriteria berbasis data riil (C1, level kecamatan), 2 riil sebagian (C3, C5), 1 riil plus simulasi (C7), sisanya estimasi.**

Bobot AHP juga bukan hasil kuesioner nyata: matriks 8×8 adalah penilaian konsensus ilustratif dari naskah proposal.

## 5. Kenapa pendekatan ini dapat dipertanggungjawabkan

- Ini tugas pengembangan dan verifikasi **metode**, bukan klaim temuan empiris tentang titik terbaik di lapangan.
- Angka estimasi **dikalibrasi** ke fakta riil level desa (penduduk, kos, PJU) sehingga urutan relatifnya masuk akal, misalnya Cipacing berpenduduk terpadat dan defisiensi PJU berat.
- Semua sel non-riil **diberi label** dan keterbatasan ditulis di paper (§V.G).
- Kebenaran perhitungan dapat diaudit: aplikasi diuji terhadap angka naskah (CR 0,0104; A3 0,6445).
- Dataset `perluasan` 12 desa adalah simulasi demo skalabilitas, **bukan** hasil utama.
- Folder `99-arsip/` tidak dikutip karena domain/angkanya salah.

## 6. Rencana validasi lapangan

| Kebutuhan | Cara | Sumber potensial |
|---|---|---|
| Titik CCTV eksisting per gang | Survei GPS titik kamera | Polres Sumedang (ETLE), Dishub (ATCS), pemerintah desa |
| C2 mobilitas malam | Counting pejalan dan kendaraan malam | Observasi tim |
| C3 defisiensi PJU | Skoring per segmen | Observasi tim, aplikasi SIPPUJAAN Dishub |
| C8 POI rentan | Pemetaan radius 150 m | Observasi tim, peta |
| C9 dan RAB | Survei tiang, listrik, jaringan; penawaran vendor | Vendor, pemerintah desa |
| Bobot AHP | Kuesioner perbandingan berpasangan | Polisi, kampus, warga/pengelola kos |

## 7. Kalimat siap pakai saat presentasi

"Kami sudah mencari data riil lebih dulu. Data riil tersedia di tingkat kecamatan dan desa, misalnya kejahatan Jatinangor naik dari 11 ke 155 kasus dan 4.250 kamar kos di Hegarmanah. Namun data CCTV dan insiden per gang tidak tersedia publik, sehingga nilai per segmen kami isi dengan estimasi yang dikalibrasi ke data riil tersebut dan diberi label. Karena itu hasil saat ini adalah validasi metode, dan validasi empiris menunggu survei lapangan."
