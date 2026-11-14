# DATA LAPANGAN RIIL — Jatinangor (untuk Aplikasi & Paper Hasil)

> **Versi lebih lengkap & kanonik: `08-docs/data-dan-sumber.md`** (memuat data CCTV riil + dataset dummy + daftar 15 sumber).
> **Sumber kebenaran model/angka final:** `dss_revisi_markdown/dss_revisi.md`.
> Populasi: BPS 2024 mencatat **>98.000 jiwa** (dipakai di paper); E-Office Desa mencatat **91.469 jiwa** (pembanding).
> File ini dipertahankan sebagai catatan awal.

Status: inventaris sumber sekunder publik. **Belum ada observasi lapangan tim.**
Diperbarui: 12 Nov 2026.

Tujuan: mengumpulkan data lapangan yang benar-benar ada sumbernya, untuk mengisi/mengkalibrasi
matriks keputusan AHP-TOPSIS DSS prioritisasi CCTV (alternatif A1–A5 × kriteria C1–C9).

> **Kesimpulan awal:** data publik tersedia sampai level **desa/kecamatan**. Data **per-gang/segmen**
> (yang dibutuhkan 8 kriteria) tidak tersedia publik. Jadi dataset final kemungkinan **hybrid**:
> angka riil sebagai anchor + estimasi terdokumentasi untuk sisanya.

---

## 1. Demografi & Kepadatan (RIIL)

**Sumber:** E-Office Desa Pemkab Sumedang — Dashboard Desa Cantik / SAKIP Desa, Kec. Jatinangor
<https://e-officedesa.sumedangkab.go.id/dashboard_simpatik/kecamatan/37>

Jumlah penduduk Kecamatan Jatinangor: **91.469** (12 desa). Populasi per desa:

| Desa | Penduduk | Relevansi |
|---|---:|---|
| Cipacing | 15.096 | A4 (Gang Cipacing) |
| Hegarmanah | 9.712 | A3 (Simpangan Hegarmanah) |
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

> Catatan: halaman yang sama menampilkan "Jumlah Keluarga 377.951" dan "Rumah Tidak Layak 95.300"
> yang **tidak masuk akal** (lebih besar dari penduduk) → indikasi glitch; jangan dikutip.

**Profil Desa Hegarmanah** (profil desa resmi, data 2014):
<http://hegarmanah-jatinangor.blogspot.com/p/profil-desa.html>
- Luas 331 Ha; 3 dusun, 14 RW, 52 RT; kepadatan tertulis 1.500 jiwa/km².
- Tata guna: Perumahan 200,40 Ha (60,54%), Sawah 86,82 Ha, Ladang 36,85 Ha.
- **Persewaan kamar (kos): 4.250 unit**; Kontrakan rumah: 310 unit; Asrama 8; Wisma 4.
- Pelajar/Mahasiswa: 1.856 orang; kelompok usia 19–25: 1.286 orang.
- Keamanan: Pos Kamling 16; Hansip 66 orang; Satgas Linmas 22 orang; SISKAMLING aktif.

Pembanding: Wikipedia (Hegarmanah) ≈ 8.182 jiwa; BPS "Kecamatan Jatinangor Dalam Angka 2026"
tersedia di <https://sumedangkab.bps.go.id>.

---

## 2. Kriminalitas (RIIL)

**Sumber A — Kapolres Sumedang, rilis akhir tahun** (Kabar Sumedang, 31 Des 2023):
<https://kabarsumedang.pikiran-rakyat.com/kabar-sumedang/pr-3247536881/tiga-wilayah-di-sumedang-dengan-tingkat-kejahatan-tinggi>
- **Jatinangor: 11 kejahatan (2022) → 155 kejahatan (2023)**.
- Cimanggung 19 → 61; Sumedang Utara 21 → 76.
- Jatinangor, Cimanggung, Sumedang Utara = 3 wilayah prioritas penekanan kejahatan 2024.

**Sumber B — Polres Sumedang** (Harapan Rakyat, 31 Des 2024):
<https://www.harapanrakyat.com/2024/12/polres-sumedang-klaim-angka-kriminalitas-tahun-2024-turun-signifikan/>
- Total Sumedang 2024: **436 kasus** (2023: 955). Crime Clearance 365 (2024) vs 773 (2023).
  Tingkat penyelesaian 84% (2024) vs 81% (2023).

**Sumber C — BPS Jawa Barat** (tabel kriminalitas per Polres, 2022):
<https://jabar.bps.go.id>
- Polres Sumedang 2022: 847 kejahatan; crime rate 70 per 100.000; clearance rate 49%.

---

## 3. Penerangan Jalan (PJU) — RIIL (kualitatif)

- **Jalan Narongtong–Cileles (Kec. Jatinangor)** minim PJU → disebut rawan kejahatan & kecelakaan;
  usulan warga direalisasi **5 unit PJU** di Blok Legok Artaen (2021). (KAPOL.ID, 12 Apr 2021)
  <https://kapol.id/jalan-narongtong-cileles-minim-pju-herman-habibullah-usulan-didengar-pemda-dipasang-10-titik/>
  → langsung menyangkut **A5 (Cileles)**.
- Opini warga: "Minimnya Penerangan di Jatinangor dan Dampaknya terhadap Masyarakat" (SumedangTandang, 18 Apr 2023):
  dampak begal, kecelakaan, jarak pandang terbatas.
  <https://sumedangtandang.com/warta/minimnya-penerangan-di-jatinangor-dan-dampaknya-terhadap-masyarakat>
- Kanal pengaduan resmi PJU: aplikasi **SIPPUJAAN** Dishub Kab. Sumedang.
  <https://sumedangkab.go.id/berita/untuk-pengaduan-pju-laporkan-ke-aplikasi-sippujaan-1>

---

## 4. Rumah Kos (RIIL, sebagian)

- Hegarmanah: **4.250 kamar sewa** (2014, profil desa) — anchor terkuat untuk C5.
- Platform: Mamikos mencatat ≈ **1.031 kos** di sekitar Unpad Jatinangor (listing, bukan sensus).
- Pemetaan UMKM Desa Cikeruh (Unpad, MIDANG 2025) memuat unit kos-kosan (PDF tak terakses otomatis;
  perlu diunduh manual): <https://jurnal.fib.unpad.ac.id/index.php/midang/article/view/63832>

---

## 5. Lalu Lintas (RIIL, makalah ada tapi PDF terkunci)

- "Analisis Rasio Volume Kendaraan terhadap Kapasitas Ruas Jalan Tanjungsari–Jatinangor"
  (Jurnal Ilmiah Teknik Sipil, 2026) — memuat angka V/C ratio. PDF butuh login.
  <https://ojs.unigal.ac.id/index.php/jiteks/article/download/5507/3556>
- "Analisis Level of Service Jalan Jatinangor" (TA, 3 ruas: Nanggeleng-Cirahayu arteri, dll) — Scribd.
- Bappeda Jabar: usulan jalan layang di persimpangan Tanjungsari (kemacetan Jatinangor–Tanjungsari).

---

## 6. CCTV Eksisting

**Tidak ada data resmi publik** (jumlah titik per desa/gang). Yang ada hanya penyedia jasa pasang
(di luar scope) dan CCTV internal kampus Unpad. → **gap**.

---

## 7. Pemetaan ke kriteria C1–C9 & status data

| Kode | Kriteria | Data riil tersedia? | Sumber |
|---|---|:---:|---|
| C1 | Riwayat kerawanan | Sebagian (level kecamatan) | §2 |
| C2 | Mobilitas malam | Tidak (ada paper V/C, PDF terkunci) | §5 |
| C3 | Defisiensi PJU | Kualitatif (Cileles terburuk) | §3 |
| C4 | Efisiensi coverage | Tidak | — |
| C5 | Kepadatan kos | Sebagian (Hegarmanah 4.250 kamar) | §1, §4 |
| C6 | Derajat simpul | Tidak | — |
| C7 | Gap CCTV eksisting | Tidak | §6 |
| C8 | POI rentan | Tidak | — |
| C9 | Kelayakan tiang/listrik | Tidak | — |
| — | Biaya RAB/titik | Tidak (estimasi vendor Rp1,3–8 jt) | pasar |

---

## 8. Strategi dataset (usulan)

Data publik tidak cukup untuk matriks 5×8 per-segmen. Tiga opsi:

1. **Hybrid (disarankan)** — anchor riil level desa (populasi, kriminalitas, kos Hegarmanah, bukti PJU)
   dipakai sebagai dasar proporsi; sel per-gang diisi estimasi terdokumentasi + diberi label jelas
   `[ESTIMASI TERVALIDASI SEKUNDER]`.
2. **Observasi lapangan tim** — isi C1–C9 untuk A1–A5 sendiri (counting malam, survei PJU, GPS kamera).
   Paling kuat untuk dosen, tapi butuh waktu.
3. **Full dummy** — seluruh angka ilustratif seperti pilot awal; tanpa klaim data riil.

Isi dataset final ditulis di `05-aplikasi/data/` (CSV) beserta kolom sumber per sel.
