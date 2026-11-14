# DATA & SUMBER — Jatinangor (untuk Aplikasi DSS & Paper Hasil)

**Status:** inventaris sumber sekunder publik. Belum ada observasi lapangan tim.
**Diperbarui:** 14 Nov 2026.
**Sumber kebenaran model & angka final:** `dss_revisi_markdown/dss_revisi.md`.

**Kesimpulan utama (TL;DR):**
- **Data CCTV riil ADA — tetapi di level kabupaten (ATCS Dishub) dan kampus (Unpad), bukan di level permukiman per-desa/gang.**
- Untuk CCTV **permukiman Jatinangor per-segmen (A1–A5)**: tidak tersedia publik → **diisi data dummy/simulasi** (dilabeli jelas).

---

## 1. Metode pencarian

Pencarian web (Google/websearch) dengan kata kunci berbahasa Indonesia & Inggris, antara lain:
`CCTV Jatinangor`, `CCTV Sumedang Dishub jumlah titik`, `ATCS Sumedang kamera`, `open data Sumedang CCTV`,
`pengadaan CCTV dana desa Sumedang`, `ETLE Jatinangor`, `CCTV Unpad Jatinangor`, `smart pole Sumedang CCTV`,
`robots/skripsi penempatan CCTV Jatinangor`.
Sumber yang diperiksa: portal resmi Pemkab Sumedang, BPS, E-Office Desa, jurnal ilmiah (Garuda/Unpad/Unsap),
serta media lokal.

---

## 2. Data RIIL — Demografi

Dua sumber resmi dipakai dan keduanya dicatat:

- **BPS Kabupaten Sumedang, *Kecamatan Jatinangor Dalam Angka 2024***: penduduk **lebih dari 98.000 jiwa** pada 12 desa, luas 26,20 km², kepadatan rata-rata **>3.740 jiwa/km²** (kantong permukiman mahasiswa hingga >9.300 jiwa/km²). Ini angka yang dipakai di `dss_revisi.md` dan paper hasil.
- **E-Office Desa Pemkab Sumedang (Dashboard Desa Cantik / SAKIP Desa)**: **91.469 jiwa** pada 12 desa. Selisih dengan BPS berasal dari perbedaan tahun/definisi pencatatan. Angka ini dipakai sebagai pembanding dan untuk rincian per desa.

Sumber E-Office: <https://e-officedesa.sumedangkab.go.id/dashboard_simpatik/kecamatan/37>

Rincian per desa di bawah berasal dari E-Office (total 91.469).

| Desa | Penduduk | Relevansi segmen |
|---|---:|---|
| Cipacing | 15.096 | A4 (Gang Cipacing) |
| Hegarmanah | 9.712 | A3 (Persimpangan Hegarmanah) |
| Sayang | 8.474 | A1 (Gang Kos Sayang) |
| Cisempur | 8.227 | — |
| Cikeruh | 7.848 | A2 (Ruas Cikeruh) |
| Cintamulya | 6.557 | — |
| Mekargalih | 6.378 | — |
| Cileles | 6.331 | A5 (Ruas Cileles) |
| Jatiroke | 6.314 | — |
| Cibeusi | 5.819 | — |
| Cilayung | 5.494 | — |
| Jatimukti | 5.219 | — |

Profil Desa Hegarmanah (data 2014): luas 331 Ha; perumahan 200,40 Ha (60,54%); 3 dusun / 14 RW / 52 RT;
kepadatan tertulis 1.500 jiwa/km². <http://hegarmanah-jatinangor.blogspot.com/p/profil-desa.html>

> Catatan: angka "Keluarga 377.951" & "Rumah Tidak Layak 95.300" di halaman E-Office tidak masuk akal (lebih besar dari penduduk) → glitch, jangan dikutip.

---

## 3. Data RIIL — Kriminalitas (level kecamatan)

| Periode | Nilai | Sumber |
|---|---|---|
| Jatinangor 2022 | 11 kejahatan | Kapolres Sumedang, Kabar Sumedang (31 Des 2023) |
| Jatinangor 2023 | **155 kejahatan** | idem |
| Sumedang 2023 (total) | 955 kasus | Harapan Rakyat (31 Des 2024) |
| Sumedang 2024 (total) | 436 kasus (turun) | idem |
| Polres Sumedang 2022 | 847 kejahatan, rate 70/100k, clearance 49% | BPS Jawa Barat |

Jatinangor termasuk **3 wilayah prioritas penekanan kejahatan** Sumedang (bersama Cimanggung & Sumedang Utara).
Insiden relevan: tindak kejahatan di **gang sempit Desa Hegarmanah** (Polres Sumedang).

- <https://kabarsumedang.pikiran-rakyat.com/kabar-sumedang/pr-3247536881/tiga-wilayah-di-sumedang-dengan-tingkat-kejahatan-tinggi>
- <https://www.harapanrakyat.com/2024/12/polres-sumedang-klaim-angka-kriminalitas-tahun-2024-turun-signifikan/>

---

## 4. Data RIIL — Hunian / Kos

| Item | Nilai | Sumber |
|---|---|---|
| Kamar sewa (kos) Desa Hegarmanah | **4.250 unit** | Profil Desa Hegarmanah (2014) |
| Kontrakan rumah Hegarmanah | 310 unit | idem |
| Asrama / Wisma Hegarmanah | 8 / 4 unit | idem |
| Listing kos sekitar Unpad (platform) | ~1.031 kos | Mamikos (listing, bukan sensus) |

---

## 5. Data RIIL — Penerangan Jalan (PJU)

- Jalan **Narongtong–Cileles** (Kec. Jatinangor) minim PJU → disebut rawan kejahatan; direalisasi **5 unit PJU** di Blok Legok Artaen (+5 unit di Desa Cilayung). KAPOL.ID, 12 Apr 2021.
- Opini "Minimnya Penerangan di Jatinangor dan Dampaknya terhadap Masyarakat" (SumedangTandang, 18 Apr 2023): begal, kecelakaan, jarak pandang terbatas.
- Kanal pengaduan resmi: aplikasi **SIPPUJAAN** (Dishub Kab. Sumedang).
- Penataan Jatinangor: penambahan PJU (Humas Sumedang).

---

## 6. Data RIIL — CCTV (temuan kunci!)

**Ada data CCTV riil, tetapi hanya di level kabupaten & kampus — bukan permukiman per-desa/gang.**

| Item | Nilai | Jenis | Sumber |
|---|---|---|---|
| CCTV ATCS Dishub Kab. Sumedang | **64 kamera: 23 PTZ + 41 Fix** | lalu lintas (ATCS) | Sulastri dkk. 2024, JRPA Unsap |
| CCTV lalu lintas (platform resmi) | **43 CCTV** streaming | lalu lintas | lebaran.sumedangkab.go.id/cctv |
| ATCS di kawasan perkotaan | 15 titik (tahun berjalan) | lalu lintas | Bupati Sumedang (Dony A. Munir) |
| **Kamera ETLE di depan Unpad Jatinangor** | 1 titik | tilang elektronik | Polres Sumedang (posisi dinilai kurang strategis: pelanggar melipir ke pangkalan DAMRI) |
| **Smart Pole Sumedang** (pertama di Indonesia) | CCTV + drone patroli → Command Center + 112 | keamanan kota | Pemkab Sumedang / Humas |
| **CCTV kampus Unpad Jatinangor** | **420 unit** | keamanan kampus | Medium "420 CCTV, Masih Kurang!"; cctv.unpad.net |
| Gerbang otomatis AI Unpad | 2025 | keamanan kampus | unpad.ac.id |
| Pemasangan CCTV Jatinangor | jadi perhatian Pemda, terhubung "ACTS" Pemda | kebijakan | sumedangkab.go.id "Kawasan Jatinangor Terus Ditata" |

**Yang TIDAK ada (gap):** jumlah & lokasi CCTV **resmi per desa/gang di permukiman mahasiswa Jatinangor**.
Tidak ditemukan di portal open data (data.go.id / Galura Jabar), LPSE Sumedang, Dishub, maupun Polres.
Yang beredar hanya proposal/jasa pemasangan dan CCTV kampus (internal).

---

## 7. Data DUMMY — CCTV permukiman per segmen (SIMULASI)

Karena data per-gang tidak ada, sel CCTV permukiman diisi **data simulasi** untuk model. Angka di bawah
**bukan data lapangan** dan harus digantikan hasil survei. Titik ETLE depan Unpad (nyata) dicatat sebagai
referensi keberadaan CCTV di koridor utama.

| id | Segmen | Desa | Titik CCTV eksisting `[SIMULASI]` | Jenis | Tahun `[SIM]` | Status |
|---|---|---|---:|---|---|---|
| S1 | A1 Gang Kos Sayang | Sayang | 0 | — | — | tidak ada kamera di dalam gang |
| S2 | A2 Ruas Jalan Cikeruh | Cikeruh | 2 | bullet (swasta/RT) | 2022 | menutupi koridor, bukan gang |
| S3 | A3 Persimpangan Hegarmanah | Hegarmanah | 1 (+1 ETLE nyata di koridor Unpad) | PTZ / ETLE | 2023 | simpul jalan utama |
| S4 | A4 Gang Cipacing | Cipacing | 0 | — | — | blind spot |
| S5 | A5 Ruas Jalan Cileles | Cileles | 1 | bullet | 2021 | parsial (pasca-pasang PJU) |

> Kolom `[SIMULASI]` wajib ditandai di paper sebagai data buatan. Dataset ini dapat
> diperluas ke **12 desa** — dan **sudah diimplementasikan** di aplikasi sebagai skenario
> terpisah (pemilih *Dataset* → "12 Desa (Simulasi)"), tanpa mengubah hasil resmi 5 segmen.

---

## 8. Pemetaan ke kriteria C1–C9 & status data

| Kode | Kriteria | Status data | Sumber |
|---|---|---|---|
| C1 | Riwayat kerawanan | **RIIL** (level kecamatan) | §3 |
| C2 | Mobilitas malam | Estimasi (paper V/C PDF terkunci) | JITEKS/MITEKS 2026 |
| C3 | Defisiensi PJU | **RIIL** kualitatif (Cileles terburuk) | §5 |
| C4 | Efisiensi coverage | Estimasi | — |
| C5 | Kepadatan kos | **RIIL** sebagian (Hegarmanah 4.250) | §4 |
| C6 | Derajat simpul | Estimasi | — |
| C7 | Gap CCTV eksisting | **RIIL sebagian** (ETLE Unpad) + **SIMULASI** per gang | §6, §7 |
| C8 | POI rentan | Estimasi | — |
| C9 | Kelayakan tiang/listrik | Estimasi | — |
| — | Biaya RAB/titik | Estimasi (pasar Rp1,3–8 jt) | vendor |

**Realisasi:** 1 kriteria penuh riil (C1), 2 riil sebagian (C3, C5), 1 riil+simulasi (C7), sisanya estimasi.

**Catatan implementasi C9:** `dss_revisi.md` menetapkan C9 dan RAB sebagai kendala kelayakan serta anggaran, dengan C9 berskala 1–5. Aplikasi memakai C9 ≥ 3 sebagai ambang kelayakan **operasional** pada tahap alokasi, bukan sebagai aturan numerik yang dikutip verbatim dari naskah kanonik. Nilai C9 per segmen tetap berstatus estimasi sampai survei kesiapan tiang, listrik, dan jaringan dilakukan.

---

## 9. Gap & rencana validasi lapangan

- **CCTV permukiman per-gang** → belum ada; perlu survei GPS titik kamera eksisting.
- **C2 mobilitas malam** → perlu counting pejalan/kendaraan malam.
- **C3 defisiensi PJU** → perlu skoring per segmen.
- **C8 POI rentan** → perlu pemetaan radius 150 m.
- **RAB** → perlu penawaran/estimasi tiang & kabel per lokasi.
- Sumber potensial berikutnya: **(a)** Polres Sumedang (data ETLE & titik kamera), **(b)** Dishub Sumedang (peta ATCS),
  **(c)** Pemerintah Desa (proposal CCTV & RAB), **(d)** dokumen "Pemeriksaan dan Penambahan CCTV Jatinangor" (perlu ditelusuri).

---

## 10. Daftar sumber (URL)

1. E-Office Desa Sumedang (demografi): https://e-officedesa.sumedangkab.go.id/dashboard_simpatik/kecamatan/37
2. Profil Desa Hegarmanah: http://hegarmanah-jatinangor.blogspot.com/p/profil-desa.html
3. Kabar Sumedang (kriminalitas Jatinangor): https://kabarsumedang.pikiran-rakyat.com/kabar-sumedang/pr-3247536881
4. Harapan Rakyat (kriminalitas Sumedang 2024): https://www.harapanrakyat.com/2024/12/polres-sumedang-klaim-angka-kriminalitas-tahun-2024-turun-signifikan/
5. BPS Jawa Barat (kriminalitas per Polres): https://jabar.bps.go.id
6. KAPOL.ID (PJU Cileles): https://kapol.id/jalan-narongtong-cileles-minim-pju-herman-habibullah-usulan-didengar-pemda-dipasang-10-titik/
7. SumedangTandang (minim penerangan): https://sumedangtandang.com/warta/minimnya-penerangan-di-jatinangor-dan-dampaknya-terhadap-masyarakat
8. **Sulastri, L. dkk. (2024).** "Evaluasi Program Area Traffic Control System dalam Menurunkan Pelanggaran Lalu Lintas di Kabupaten Sumedang." *JRPA* 9(1). https://garuda.kemdiktisaintek.go.id/documents/detail/5553041
9. Sumedang Lebaran Realtime (CCTV lalu lintas): https://lebaran.sumedangkab.go.id/cctv
10. Pemkab Sumedang (ATCS / tata Jatinangor): https://sumedangkab.go.id
11. Polres Sumedang (ETLE depan Unpad): Instagram @polres.sumedang / rilis
12. Humas Sumedang (Smart Pole & drone): https://www.facebook.com/humassumedang1
13. Medium (CCTV Unpad 420): https://medium.com/@januarymalinda/420-cctv-masih-kurang-2fd9fef7ab34
14. CCTV Unpad (platform): https://cctv.unpad.net
15. Unpad (gerbang AI 2025): https://www.unpad.ac.id
