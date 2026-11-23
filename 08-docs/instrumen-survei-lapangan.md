# Instrumen Survei Lapangan — SiPrioCCTV Jatinangor

**Status:** instrumen siap-pakai (template). **Belum dijalankan** — validasi lapangan menunggu pelaksanaan survei.
**Fungsi:** mengganti sel dataset **hybrid/estimasi** (`08-docs/data-dan-sumber.md` §10) dengan nilai **empiris** untuk A1–A5, sekaligus mengunci koordinat GPS tiap titik.
**Sumber kebenaran model:** `dss_revisi_markdown/dss_revisi.md`.

> Cara pakai: cetak/digitalkan tabel di bawah. Satu tim (2–3 orang) per segmen. Setelah terisi, ganti nilai pada `07-webapp/data/ilustratif.json` & `naskah-uts.json`, lalu jalankan `npm run parity`.

---

## 1. Log titik GPS (koordinat final)

Ambil 3–5 titik di sepanjang segmen, catat titik wakil (titik CCTV diusulkan). WGS84 desimal 6 angka.

| ID | Nama segmen | Lat | Lng | Akurasi (m) | Tanggal/jam | Foto | Petugas |
|---|---|---|---:|---:|---|---|---|
| A1 | Gang Kos Sayang | | | | | | |
| A2 | Ruas Jalan Cikeruh | | | | | | |
| A3 | Persimpangan Hegarmanah | | | | | | |
| A4 | Gang Cipacing | | | | | | |
| A5 | Ruas Jalan Cileles | | | | | | |
| EX-01 | ETLE (Jl. Raya Jatinangor) | | | | | | |
| EX-02 | Kamera eksisting lain (bila ada) | | | | | | |

Alat: aplikasi peta ponsel (akurasi ≤ 5 m), foto tiang/lokasi, catat patokan (nama warung/POI).

---

## 2. Counting mobilitas malam → **C2** (orang/jam)

Wajib segmen yang sama, satu malam **18.00–24.00**, per jam. Pisahkan pejalan kaki & kendaraan.

| Jam | Pejalan (orang) | Motor | Mobil | Total |
|---|---:|---:|---:|---:|
| 18.00–19.00 | | | | |
| 19.00–20.00 | | | | |
| 20.00–21.00 | | | | |
| 21.00–22.00 | | | | |
| 22.00–23.00 | | | | |
| 23.00–24.00 | | | | |
| **Rata-rata/jam (→ C2)** | | | | |

Ulangi ≥ 2 malam (hari kerja + akhir pekan), ambil rata-rata.

---

## 3. Skor defisiensi penerangan → **C3** (1–5)

| Skor | Kriteria visual | Rerata jarak tiang (m) | Lux malam (opsional) |
|---|---|---|---|
| 1 | Terang merata, PJU padat | < 20 | > 10 |
| 2 | Terang sebagian | 20–40 | 5–10 |
| 3 | Redup, ada bayangan | 40–70 | 2–5 |
| 4 | Gelap, satu-dua titik | 70–120 | < 2 |
| 5 | Hampir tanpa PJU | > 120 | ~0 |

| ID | Skor C3 | Jumlah tiang | Lampu hidup | Catatan |
|---|---:|---:|---:|---|
| A1 | | | | |
| A2 | | | | |
| A3 | | | | |
| A4 | | | | |
| A5 | | | | |

---

## 4. POI rentan radius 150 m → **C8** (unit)

Hitung dalam radius 150 m dari titik usulan: warung/makan 24 jam, ATM, minimarket, halte, laundry, bengkel, apotek.

| ID | Warung 24j | ATM | Minimarket | Halte | Lain | **Total (→ C8)** |
|---|---:|---:|---:|---:|---:|---:|
| A1 | | | | | | |
| A2 | | | | | | |
| A3 | | | | | | |
| A4 | | | | | | |
| A5 | | | | | | |

---

## 5. Kelayakan teknis & biaya → **C9** + **RAB**

| ID | Tiang tersedia? | Listrik terdekat (m) | Jaringan/kabel | **Skor C9 (1–5)** | RAB tiang+kabel+kamera (Rp) | Vendor/sumber harga |
|---|---|---|---|---|---:|---|
| A1 | | | | | | |
| A2 | | | | | | |
| A3 | | | | | | |
| A4 | | | | | | |
| A5 | | | | | | |

Ambang operasional Fase 1: **C9 ≥ 3** (lihat `AGENTS.md` §2.1).

---

## 6. Kuesioner AHP (3 kelompok pemangku kepentingan)

Responden: (a) Pemda (Kecamatan/Satpol PP/Dishub), (b) pengelola kampus, (c) warga/RT/paguyuban kos. Minimal 1 responden per kelompok.

**Skala Saaty:** 1 = sama penting … 9 = mutlak lebih penting (berlawanan = 1/n).

**Opsi A — matriks datar 8×8 (kanonik, 28 perbandingan):** isi matriks C1–C8 (lihat `dss_revisi.md` §III-C). Rawan lelah → wajib uji konsistensi CR < 0,10.

**Opsi B — hierarki 3 kluster (10 perbandingan, sesuai preset `ilustratif`):**
- Kluster: Risiko (C1, C3), Paparan Aktivitas (C2, C5, C8), Karakteristik Spasial (C4, C6, C7).
- 3 perbandingan antar-kluster + 7 dalam-kluster.
- Agregasi antar-kelompok: rata-rata geometrik.

| Perbandingan | Nilai (1–9 atau 1/n) |
|---|---:|
| Risiko vs Paparan | |
| Risiko vs Spasial | |
| Paparan vs Spasial | |
| C1 vs C3 | |
| C2 vs C5 | |
| C2 vs C8 | |
| C5 vs C8 | |
| C4 vs C6 | |
| C4 vs C7 | |
| C6 vs C7 | |

Isi satu lembar per responden; uji CR tiap lembar sebelum agregasi.

---

## 7. Setelah terisi

1. Ganti nilai `values.*.kriteria.C1..C8`, `c9`, `biaya_rp` di `07-webapp/data/ilustratif.json` & `naskah-uts.json`; ganti `lat/lng` dari §1.
2. Jalankan `cd 07-webapp && npm run parity` — pastikan paritas kanonik tetap lulus (angka UTS lama sebagai pembanding), dan `npm run verify`.
3. Catat sumber & tanggal tiap sel (jejak audit), lalu perbarui `08-docs/data-dan-sumber.md` §10.

> Catatan kejujuran: selama survei belum dijalankan, seluruh nilai per-segmen tetap **estimasi terdokumentasi** dan wajib diberi label `[SIMULASI]` di aplikasi maupun paper.
