# Tahap 3: Conceptual Modeling — Rumusan Model Konseptual DSS CCTV Jatinangor
## Status: DRAF perumusan (diisi nilai lapangan oleh tim; merujuk sintesis Tahap 2 v2, protokol 2021-2026)

---

## 1. Alternatif (level segmen gang, mengikuti #39 dan #31)

| Kode | Segmen (contoh operasional, verifikasi lapangan oleh tim) | Jangkar wilayah | Ciri segmen | Dasar pemilihan |
|---|---|---|---|---|
| A1 | Gang kos kawasan Sayang | Desa Sayang | Padat, akses sempit | Analog hunian padat #126; logika coverage titik #39 |
| A2 | Ruas jalan Cikeruh dekat gerbang kampus | Desa Cikeruh | Koridor utama kampus-kos | Volume mobilitas #31; sampling titik kritis #46 |
| A3 | Persimpangan Hegarmanah | Desa Hegarmanah | Simpul multi-cabang | Derajat adjacency #39; peta risiko spasial #31 |
| A4 | Gang Cipacing | Desa Cipacing | Minim PJU | Infrastruktur/penerangan #83; intervensi terukur #11 |
| A5 | Ruas Cileles | Desa Cileles | Jalur mobilitas malam | Flow/delay #46; guna lahan sekitar kampus #31 |

Aturan: 4-6 alternatif; tiap alternatif satu segmen jalan/gang yang dapat dipasangi 1 unit CCTV; nama di atas contoh operasional, nama final dari observasi lapangan.

## 2. Matriks kriteria C1-C9 (arah: skor tinggi = makin prioritas)

| Kode | Kriteria | Definisi operasional | Satuan | Arah | Sumber data Jatinangor (utama / fallback) | Rujukan literatur |
|---|---|---|---|---|---|---|
| C1 | Riwayat kerawanan segmen | Kejadian kriminalitas/kecelakaan per km per tahun | kejadian/km/thn | Benefit | Polsek atau laporan warga / observasi + wawancara RT | #83, #14, #96, #31 |
| C2 | Volume mobilitas malam | Orang lewat pukul 18.00-24.00 | orang/jam | Benefit | Counting manual / CCTV eksisting (#46: sampling titik kritis) | #31, #46, #96 |
| C3 | Defisiensi penerangan | Tingkat kekurangan cahaya PJU (skor 1-5 survei) | skor 1-5 | Benefit | Survei malam / data Dishub (fallback: observasi) | #83, #11 |
| C4 | Efisiensi coverage | Estimasi luas ter-cover per titik CCTV | m2/titik | Benefit | Pemetaan + uji coverage model #39 | #39, #56 |
| C5 | Kepadatan penghuni | Kamar kos per km gang | kamar/km | Benefit | Pendataan kos / BPS desa | #56, #31, #126 |
| C6 | Derajat simpul jalan | Jumlah cabang persimpangan | cabang | Benefit | OpenStreetMap + observasi (mengikuti #39) | #39 |
| C7 | Coverage gap CCTV eksisting | Jarak ke CCTV terdekat | meter | Benefit | Survei titik CCTV eksisting | #39, #56 |
| C8 | Kedekatan guna lahan rentan | Kos + ATM + warung 24 jam + gerbang kampus radius 150 m | unit | Benefit | Observasi + POI (mengikuti logika #31, #83) | #31, #83, #37 |
| C9 | Kelayakan implementasi | Kesiapan tiang/listrik/internet dikurangi estimasi biaya (skor) | skor | Benefit | Survei PLN/jaringan + RAB (mengikuti #14 cost, #39 efisiensi) | #14, #39, #83 |

### 2a. Frekuensi dukungan kriteria (disalin dari sintesis Tahap 2, Bagian B.3)

| Kriteria | Muncul di paper | Frekuensi |
|---|---|---|
| C1 Riwayat kerawanan | #83, #14, #96, #31 | 4 paper |
| C2 Volume mobilitas malam | #31, #46, #96 | 3 paper |
| C5 Kepadatan penghuni | #56, #31, #126 | 3 paper |
| C8 Kedekatan guna lahan rentan | #31, #83, #37 | 3 paper |
| C9 Kelayakan implementasi | #14, #39, #83 | 3 paper |
| C3 Defisiensi penerangan | #83, #11 | 2 paper |
| C4 Efisiensi coverage | #39, #56 | 2 paper |
| C7 Coverage gap CCTV eksisting | #39, #56 | 2 paper |
| C6 Derajat simpul jalan | #39 | 1 paper (sumber tunggal, dicatat apa adanya) |

### 2b. Urutan prioritas kriteria dan dasar penempatan

Urutan ditentukan berdasarkan frekuensi kemunculan di 12 paper acuan; kriteria yang muncul di lebih banyak paper ditempatkan lebih tinggi. Ketika frekuensi sama, seri diputus berdasarkan relevansi langsung terhadap keputusan penempatan CCTV (kendala anggaran dan paparan didahulukan atas faktor pendukung).

| Urutan | Kriteria | Dasar penempatan |
|---|---|---|
| 1 | C1 Riwayat kerawanan | Frekuensi tertinggi (4 paper); inti urgensi pemasangan di seluruh literatur safety |
| 2 | C9 Kelayakan implementasi | Jangkar budget constraint #39 (tiang 62 ke 33); tanpa kelayakan, prioritas tak dapat dieksekusi |
| 3 | C2 Volume mobilitas malam | Paparan utama segmen (volume #31, flow #46); menentukan siapa yang dilindungi |
| 4 | C5 Kepadatan penghuni | Populasi terpapar per segmen; legitimasi hunian padat #126 |
| 5 | C8 Kedekatan guna lahan rentan | Kedekatan target kriminalitas (kos, ATM, warung 24 jam); logika guna lahan #31 |
| 6 | C4 Efisiensi coverage | Luas lindung per unit alat; efisiensi #39 dan trade-off coverage #56 |
| 7 | C7 Coverage gap CCTV eksisting | Menghindari duplikasi; blind-zone #39 dan backup coverage #56 |
| 8 | C3 Defisiensi penerangan | Faktor pendukung; CCTV tetap butuh cahaya minimum (#83, #11) |
| 9 | C6 Derajat simpul jalan | Bersumber tunggal #39; tetap dipakai sebagai ciri persimpangan, dicatat apa adanya |

## 3. Skema pembobotan AHP multistakeholder (mengikuti #37, acuan #83 dan #74)

### 3.1 Langkah perhitungan (per kelompok responden)

1. Responden tiga kelompok: (a) pemerintah/Dinas (Dishub, Satpol PP), (b) kampus/pengelola kawasan, (c) warga (RT, pemilik kos).
2. Kuesioner pairwise comparison 9 kriteria per kelompok dengan skala Saaty 1-9 (1 = sama penting, 9 = mutlak lebih penting; nilai kebalikan untuk arah sebaliknya).
3. Bentuk matriks perbandingan A (n x n, n = 9), normalisasi per kolom, lalu vektor prioritas w = rata-rata baris matriks ternormalisasi.
4. Uji konsistensi: hitung vektor terbobot Aw, lalu lamda-maks = rata-rata (Aw)i / wi; CI = (lamda-maks - n) / (n - 1); CR = CI / RI dengan RI untuk n = 9 sebesar 1,45. Syarat CR < 0,1 (acuan #83: CR 0,046).
5. Agregasi antar kelompok menggunakan geometric mean per sel matriks, lalu ulangi langkah 3-4 pada matriks agregat.
6. Validasi silang opsional: bobot objektif Entropy Weight Method dari data lapangan (mengikuti #56) sebagai pembanding terhadap bobot subjektif AHP; selisih besar memicu diskusi ulang dengan pakar, bukan penggantian otomatis.

### 3.2 Contoh hitung ILUSTRASI (bukan data lapangan)

Tiga kriteria (C1, C2, C9) dengan penilaian ilustrasi: C1 vs C2 = 3; C1 vs C9 = 2; C9 vs C2 = 2.

Matriks A:

|  | C1 | C2 | C9 |
|---|---|---|---|
| C1 | 1 | 3 | 2 |
| C2 | 1/3 | 1 | 1/2 |
| C9 | 1/2 | 2 | 1 |

Jumlah kolom: C1 = 1,833; C2 = 6; C9 = 3,5. Normalisasi lalu rata-rata baris menghasilkan bobot w = (0,539; 0,164; 0,297); jumlah = 1,000.

Uji konsistensi: Aw = (1,625; 0,492; 0,894); (Aw)i / wi = (3,015; 3,004; 3,009); lamda-maks = 3,009; CI = (3,009 - 3) / 2 = 0,0046; RI (n = 3) = 0,58; CR = 0,0046 / 0,58 = 0,008 < 0,1 sehingga konsisten.

Contoh ini hanya menunjukkan cara hitung; matriks 9 x 9 sesungguhnya diisi dari kuesioner lapangan oleh tim.

## 4. Perankingan TOPSIS (mengikuti pola pemenang #14)

### 4.1 Langkah perhitungan

1. Matriks keputusan X (A1-A5 terhadap C1-C9) dari data lapangan; seluruh kriteria berarah benefit terhadap urgensi.
2. Normalisasi: r(ij) = x(ij) / akar(jumlah(x(ij)^2 per kolom)).
3. Matriks terbobot: v(ij) = w(j) x r(ij) dengan w dari AHP.
4. Solusi ideal positif A+ (maksimum per kolom) dan negatif A- (minimum per kolom).
5. Jarak tiap alternatif ke A+ (D+) dan ke A- (D-), lalu closeness C(i) = D-(i) / (D+(i) + D-(i)); peringkat dari C terbesar.
6. Analisis sensitivitas: ubah tiap bobot +-20% satu per satu (mengikuti #83), hitung ulang ranking; peringkat dinyatakan robust bila tidak berubah posisi.

### 4.2 Contoh hitung ILUSTRASI (data dummy, bukan data lapangan)

Tiga segmen (S1, S2, S3) dinilai 1-5 pada C1, C2, C9 dengan bobot ilustrasi w = (0,539; 0,164; 0,297) dari Seksi 3.2. Matriks dummy X: S1 = (4, 3, 5); S2 = (2, 4, 3); S3 = (5, 2, 4).

Normalisasi: penyebut kolom = (6,708; 5,385; 7,071). Matriks terbobot V: S1 = (0,321; 0,091; 0,210); S2 = (0,161; 0,122; 0,126); S3 = (0,402; 0,061; 0,168).

A+ = (0,402; 0,122; 0,210); A- = (0,161; 0,061; 0,126). Jarak: D+ = (0,086; 0,255; 0,074); D- = (0,184; 0,061; 0,245). Closeness: S1 = 0,682; S2 = 0,192; S3 = 0,768. Ranking: S3 > S1 > S2 (S3 unggul pada C1 dan C9 yang berbobot besar; S2 terendah meski C2-nya tertinggi, menunjukkan kompromi antar kriteria bekerja).

## 5. Arsitektur konseptual (pola GIS-MCDM, merujuk #31, #11, #46)

```
INPUT (C1-C9: laporan warga, counting, survei PJU/kos/CCTV, OSM, RAB)
  -> ENGINE: [GIS (pemetaan segmen + gap)] + [AHP (bobot)] + [TOPSIS (ranking)]
  -> OUTPUT: ranking prioritas A1-A5 + peta prioritas gang + rekomendasi alokasi bertahap sesuai budget
```

| Lapisan | Fungsi | Masukan | Keluaran | Rujukan |
|---|---|---|---|---|
| Input | Kumpulkan data diskrit per segmen | Rekap insiden, counting, survei, OSM, RAB | Dataset mentah C1-C9 | #31, #46 |
| Preprocessing | Bersihkan dan kodifikasi | Dataset mentah | Matriks A1-A5 x C1-C9 | #31 |
| Decision Engine | Bobot + ranking + peta | Matriks + penilaian pakar | Bobot, ranking, peta prioritas | #37, #14, #31 |
| Output | Rekomendasi alokasi | Ranking + peta + budget | Urutan pemasangan bertahap | #96, #74 |

## 6. Yang ditolak dan ditunda (argumen tercatat)

- Ditolak: simulasi operasional ala #45 (butuh kalibrasi mahal); BWM-CoCoSo ala #83 (selisih kinerja kecil, pakar tak tersedia).
- Ditunda: response time/egress ala #45 (data tak tersedia) menjadi keterbatasan + riset lanjutan.
- Dicatat: template AHP+GIS+Fuzzy TOPSIS #121 relevan namun gugur aturan tahun 2021-2026 (bukti disiplin protokol).

## 7. Justifikasi pemilihan metode

### Justifikasi AHP (pembobotan)

AHP dipilih karena:

1. Kesesuaian jenis data: AHP bekerja dengan penilaian pakar, sesuai kondisi Jatinangor yang kaya pengetahuan lokal (aparat, pengelola kampus, warga) tetapi minim data sensor. Paper #37 membuktikan AHP berjalan lintas kelompok stakeholder; #74 membuktikan AHP berjalan dari data sekunder/dokumen.
2. Dukungan literatur: AHP dipakai primer di 3 dari 12 paper (#37, #14, #74) dan menjadi pembobotan tersering di korpus.
3. Transparan dan teraudit: matriks pairwise, vektor bobot, dan CR terdokumentasi sehingga tiap angka dapat ditelusuri dan diuji ulang.
4. Tidak memerlukan infrastruktur mahal: kuesioner dan lembar kerja cukup, berbeda dengan simulasi #45 yang butuh kalibrasi.

### Justifikasi TOPSIS (perankingan)

TOPSIS dipilih karena:

1. Kesesuaian jenis data: TOPSIS bekerja dengan data objektif terukur hasil observasi segmen (counting, survei, pemetaan), tanpa memerlukan penilaian pakar tambahan setelah bobot ditetapkan.
2. Dukungan literatur: pola AHP (bobot) + TOPSIS (ranking) terbukti pada #14; komparasi #83 menempatkan AHP-TOPSIS dekat dengan metode kompleks (agreement 88,6% vs 92,8%).
3. Konsep intuitif: alternatif terbaik adalah yang terdekat dengan ideal positif dan terjauh dari ideal negatif, sehingga mudah dijelaskan ke pemangku kepentingan non-teknis.
4. Menangani kompromi benefit secara langsung: closeness coefficient menggabungkan seluruh kriteria dalam satu skor peringkat, cocok untuk alokasi bertahap sesuai anggaran.

## 8. Pemetaan ke paper IEEE

- Seksi IV-A: alternatif (Seksi 1) + matriks C1-C9 + frekuensi dan urutan prioritas (Seksi 2, 2a, 2b).
- Seksi IV-B: skema AHP + TOPSIS + contoh hitung (Seksi 3-4) + justifikasi metode (Seksi 7).
- Seksi IV-C: diagram arsitektur + tabel lapisan (Seksi 5) + justifikasi adopsi/penolakan (Seksi 6, merujuk B.1-B.4 Tahap 2).
