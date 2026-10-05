# Tahap 3: Conceptual Modeling — Rumusan Model Konseptual DSS CCTV Jatinangor
## Status: DRAF perumusan (diisi nilai lapangan oleh tim; merujuk sintesis Tahap 2 v2, protokol 2021-2026)

---

## 1. Alternatif (level segmen gang, mengikuti #39 dan #31)

| Kode | Segmen (contoh operasional, verifikasi lapangan oleh tim) |
|---|---|
| A1 | Gang kos kawasan Sayang (padat, akses sempit) |
| A2 | Ruas jalan Cikeruh dekat gerbang kampus |
| A3 | Persimpangan Hegarmanah (simpul multi-cabang) |
| A4 | Gang Cipacing (minim PJU) |
| A5 | Ruas Cileles (jalur mobilitas malam) |

Aturan: 4-6 alternatif; tiap alternatif satu segmen jalan/gang yang dapat dipasangi 1 unit CCTV; nama final dari observasi lapangan.

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

## 3. Skema pembobotan AHP multistakeholder (mengikuti #37, acuan #83 dan #74)

1. Responden 3 kelompok: (a) pemerintah/Dinas (Dishub, Satpol PP), (b) kampus/pengelola kawasan, (c) warga (RT, pemilik kos).
2. Kuesioner pairwise comparison 9 kriteria per kelompok (skala Saaty 1-9).
3. Agregasi geometric mean antar kelompok; uji Consistency Ratio (CR < 0,1; acuan #83: CR 0,046).
4. Validasi silang opsional: Entropy Weight Method dari data lapangan (mengikuti #56) sebagai pembanding bobot objektif.

## 4. Perankingan TOPSIS (mengikuti pola pemenang #14)

1. Matriks keputusan A1-A5 x C1-C9 dari data lapangan.
2. Normalisasi + pembobotan AHP.
3. Jarak ke solusi ideal positif/negatif; closeness coefficient; ranking prioritas pemasangan.
4. Analisis sensitivitas +-20% pada bobot (mengikuti #83) untuk uji robustness ranking.

## 5. Arsitektur konseptual (pola GIS-MCDM, merujuk #31, #11, #46)

```
INPUT (C1-C9: laporan warga, counting, survei PJU/kos/CCTV, OSM, RAB)
  -> ENGINE: [GIS (pemetaan segmen + gap)] + [AHP (bobot)] + [TOPSIS (ranking)]
  -> OUTPUT: ranking prioritas A1-A5 + peta prioritas gang + rekomendasi alokasi bertahap sesuai budget
```

## 6. Yang ditolak dan ditunda (argumen tercatat)

- Ditolak: simulasi operasional ala #45 (butuh kalibrasi mahal); BWM-CoCoSo ala #83 (selisih kinerja kecil, pakar tak tersedia).
- Ditunda: response time/egress ala #45 (data tak tersedia) menjadi keterbatasan + riset lanjutan.
- Dicatat: template AHP+GIS+Fuzzy TOPSIS #121 relevan namun gugur aturan tahun 2021-2026 (bukti disiplin protokol).

## 7. Pemetaan ke paper IEEE

- Seksi IV-A: alternatif + matriks C1-C9 (tabel Seksi 2).
- Seksi IV-B: skema AHP + TOPSIS (Seksi 3-4).
- Seksi IV-C: diagram arsitektur (Seksi 5) + justifikasi adopsi/penolakan (Seksi 6, merujuk B.1-B.4 Tahap 2).
