# Aplikasi DSS — Prioritisasi Penempatan CCTV Jatinangor

Aplikasi web satu file yang mengimplementasikan model konseptual DSS dari proposal UTS:
pembobotan **AHP** multistakeholder + perankingan **TOPSIS** untuk memprioritaskan penempatan CCTV
di permukiman mahasiswa Jatinangor, dilengkapi alokasi anggaran bertahap dan analisis sensitivitas.

## Cara pakai
Buka `index.html` langsung di browser (klik dua kali). Tanpa server, tanpa instalasi, tanpa internet.

Fitur:
- **Matriks keputusan** C1–C8 (urgensi) + C9 (kelayakan) + biaya per titik — semua sel dapat diedit.
- **Matriks AHP 8×8** konsensus — segitiga atas dapat diedit, segitiga bawah otomatis resiprokal.
- Perhitungan **bobot global**, **λmax**, **CI**, **CR** (badge konsisten bila CR < 0,10).
- **Perankingan TOPSIS** (D⁺, D⁻, CC&#x1D62;) + bar visual.
- **Alokasi fase anggaran** otomatis di bawah plafon Rp 15 Jt/tahun. Alternatif dengan biaya satu titik di atas plafon ditandai tidak dialokasikan, sehingga subtotal fase tidak dapat melampaui plafon.
- **Peta prioritas skematik** (SVG): 5 segmen digambar relatif terhadap koridor jalan; warna & ukuran ∝ CC&#x1D62;, label = peringkat + fase.
- **Data-driven**: pemilih dataset **"5 Segmen (Resmi)"** dan **"12 Desa (Simulasi)"** — jumlah segmen dimuat dari data, bukan hardcode.
- **Filter kelayakan C9**: ambang operasional C9 ≥ 3 dipakai saat alokasi fase. Alternatif dengan C9 < 3 ditandai tidak layak dan tidak dialokasikan (kendala teknis, bukan kriteria TOPSIS). Ambang ini adalah kebijakan implementasi terdokumentasi, karena `dss_revisi.md` menetapkan C9 sebagai kendala tetapi tidak menyebut angka ambangnya.
- **Analisis sensitivitas ±20%** (16 run OAT) + penanda pembalikan peringkat.
- **Ekspor hasil** ke CSV.
- **Edit tanpa kehilangan fokus**: tabel input tidak dirender ulang saat mengetik; hanya tabel hasil yang diperbarui.

## Struktur
```
05-aplikasi/
  index.html                     # aplikasi (satu file, offline)
  test-algoritma.mjs             # verifikasi: mengekstrak & menjalankan engine dari index.html + cek paritas CSV
  test-ui.sh                     # smoke test Chromium: fokus input + filter C9
  data/
    alternatif-kriteria.csv      # matriks 5 alternatif × (C1-C8, C9, biaya) + label sumber
    bobot-ahp.csv                # matriks perbandingan berpasangan AHP
  data-lapangan-riil.md          # inventaris data sekunder riil + sumber + gap
```

## Verifikasi
```
node 05-aplikasi/test-algoritma.mjs
```
Test **mengekstrak blok `<script>` dari `index.html`** dan menjalankannya di Node `vm` dengan DOM stub,
sehingga yang diuji adalah kode aplikasi yang sebenarnya, bukan salinan. Test memastikan bobot AHP, CR,
peringkat TOPSIS, alokasi fase, filter C9, jumlah rank reversal, jumlah segmen dataset perluasan, serta
paritas data inline dengan `data/alternatif-kriteria.csv` dan `data/bobot-ahp.csv`.
Angka acuan: CR 0,0104; A3=0,6445 > A1=0,5774 > A4=0,4995 > A2=0,4638 > A5=0,1820.

Smoke test UI opsional (butuh Chromium/Chrome):
```
bash 05-aplikasi/test-ui.sh
```
Test ini memastikan fokus input tidak hilang saat mengetik dan filter C9 < 3 terlihat di KPI,
tabel TOPSIS, tabel fase, dan peta.

## Catatan data
Mode **hybrid**: angka riil level desa/kecamatan (populasi, kriminalitas, kos Hegarmanah, bukti PJU)
dipakai sebagai kalibrasi; sel per-gang merupakan estimasi terdokumentasi. Belum divalidasi survei lapangan.
Sumber kebenaran model dan angka: `dss_revisi_markdown/dss_revisi.md` (AHP datar 8×8, PRISMA 582→416→121→12).
