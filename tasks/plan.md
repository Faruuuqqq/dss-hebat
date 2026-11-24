# Roadmap Implementasi Aplikasi DSS CCTV Jatinangor

> **Rencana lanjutan 23 Nov 2026:** lihat [Peta berbukti dan Skenario Saya](#rencana-lanjutan-peta-berbukti-dan-skenario-saya). Bagian roadmap awal di bawah dipertahankan sebagai riwayat; status GIS, Three.js, dan Supabase di sana bukan status implementasi terkini. Checklist lama tidak ditutup otomatis.

## Tujuan

Menerjemahkan paper dan model DSS yang sudah selesai menjadi website yang dapat dijalankan, hasilnya dapat ditelusuri ke model kanonik, dan batasan data ditampilkan dengan jujur. Ini adalah roadmap beserta status aktual—bukan rencana untuk mengulang pekerjaan yang sudah selesai.

**Sumber kebenaran model dan angka:** [`dss_revisi_markdown/dss_revisi.md`](../dss_revisi_markdown/dss_revisi.md). Jika ada perbedaan, naskah itu yang diikuti.

## Keputusan implementasi

- **MVP berfokus pada website yang berjalan.** Backend, login, dan penyimpanan perubahan pengguna tidak menjadi syarat agar fungsi DSS utama dapat dipakai.
- **Aplikasi saat ini:** `07-webapp/` memakai Next.js 16, TypeScript, dan Tailwind CSS 4; aplikasi berjalan di sisi klien dan dapat dibangun sebagai situs statis. `05-aplikasi/index.html` tetap tersedia sebagai versi offline satu berkas.
- **Mesin keputusan:** AHP datar 8×8 untuk bobot C1–C8, TOPSIS untuk peringkat, lalu C9 dan biaya menjadi kendala kelayakan/alokasi. Ambang operasional C9 ≥ 3 harus tetap diberi konteks sebagai keputusan implementasi, bukan angka eksplisit dari paper.
- **Data aplikasi (keputusan terbaru):** gunakan data dummy/ilustratif saja; tidak mensyaratkan survei lapangan atau kuesioner. Dataset dan seluruh keluarannya harus berlabel `[SIMULASI]`. Pertahankan angka ilustratif kanonik sebagai baseline uji paritas, bukan sebagai bukti lapangan. Artefak aplikasi saat ini masih mendeskripsikan dataset `resmi` sebagai hybrid, sehingga label dan dokumentasinya perlu diselaraskan sebelum menyerahkan versi final.
- **UI inti:** edit input, lihat bobot/peringkat/alokasi, peta skematik, analisis sensitivitas, reset, dan ekspor CSV. Peta bukan koordinat GPS final.
- **Visualisasi 3D:** Next.js dapat memakai Three.js dalam komponen client-side. Namun Three.js bukan kebutuhan fungsi DSS; gunakan hanya jika ada tujuan 3D yang jelas. Tanpa koordinat/geometri nyata, visual 3D hanya ilustratif dan harus dilabeli simulasi; pertahankan UI 2D yang ringan sebagai jalur utama.
- **Supabase ditunda.** Integrasikan hanya jika persistensi data atau kolaborasi menjadi kebutuhan nyata; aplikasi inti tidak boleh bergantung padanya untuk dapat dibuka.

## Hubungan dengan roadmap di paper

Roadmap paper memuat empat langkah. Status implementasinya saat ini:

1. **Kumpulkan data empiris lapangan — tidak menjadi syarat tugas aplikasi.** Atas keputusan pengguna, demonstrasi software memakai data dummy; tidak mengklaim validasi lapangan.
2. **Bangun prototipe dashboard spasial — prototipe selesai.** Dashboard web sudah berjalan, tetapi visual saat ini adalah peta SVG skematik, bukan Web GIS atau peta koordinat GPS.
3. **Kalibrasi bobot melalui pemangku kepentingan — tidak menjadi syarat tugas aplikasi.** Gunakan matriks ilustratif yang konsisten dengan baseline paper dan beri label simulasi; jangan mengklaim hasil kuesioner.
4. **Pengembangan lanjutan — di luar MVP.** Kanal laporan warga, pembaruan data berkala, evaluasi dampak, dan visual 3D hanya dipertimbangkan bila ada kebutuhan dan data pendukung.

## Roadmap dan status

### Fase 1 — Turunkan kebutuhan dari paper dan model — SELESAI

**Hasil:** ruang lingkup dan batasan aplikasi tertulis di [`08-docs/srs.md`](../08-docs/srs.md); keterlacakan kebutuhan tersedia di [`08-docs/traceability.md`](../08-docs/traceability.md).

**Kriteria penerimaan:**
- [x] Kebutuhan dan angka merujuk `dss_revisi.md`.
- [x] Ruang lingkup membedakan DSS prioritisasi dari sistem operasional pengawasan CCTV.
- [x] Data simulasi, estimasi, dan keterbatasan survei dinyatakan.

### Fase 2 — Siapkan data dummy dan mesin keputusan — MESIN SELESAI, PENYELARASAN DATA MENUNGGU

**Hasil:** mesin AHP–TOPSIS sudah data-driven dan mereproduksi baseline ilustratif. Kebijakan terbaru adalah menggunakan data dummy sepenuhnya; penyelarasan label dan dokumentasi dataset pada aplikasi masih perlu dilakukan.

**Kriteria penerimaan:**
- [x] AHP, TOPSIS, sensitivitas, dan alokasi anggaran mengikuti model kanonik.
- [x] C9/RAB tidak dimasukkan sebagai kriteria TOPSIS; C9 ≥ 3 diperlakukan sebagai ambang operasional.
- [ ] Seluruh data demo aplikasi diberi label `[SIMULASI]`/dummy dan tidak disebut data lapangan atau hybrid.
- [ ] Baseline numerik ilustratif paper tetap lulus uji paritas setelah penyelarasan data/label.

### Fase 3 — Bangun versi website yang bisa dijalankan — SELESAI

**Hasil:** versi offline satu berkas di `05-aplikasi/` dan versi Next.js di `07-webapp/`.

**Kriteria penerimaan:**
- [x] Versi offline dapat dibuka langsung dari `05-aplikasi/index.html`.
- [x] Website Next.js dapat dijalankan lokal dengan `npm run dev` dan dibangun dengan `npm run build`.
- [x] Mesin AHP–TOPSIS terpisah dari tampilan dan data aplikasi.

### Fase 4 — Bangun UI dan interaksi pengguna — SELESAI

**Hasil:** dashboard interaktif dengan input yang aman saat diedit, hasil perhitungan, tabel, peta SVG skematik, dan ekspor CSV. Ini adalah prototipe dashboard spasial, bukan Web GIS operasional.

**Kriteria penerimaan:**
- [x] Input dapat diubah tanpa kehilangan fokus; hasil menghitung ulang.
- [x] Pengguna dapat membaca peringkat, kelayakan C9, fase anggaran, dan sensitivitas.
- [x] Tersedia reset, ekspor CSV, serta UI yang diperiksa untuk aksesibilitas.

### Fase 5 — Verifikasi website dan hasil model — BASELINE LULUS, ULANGI SETELAH PENYELARASAN DATA

**Verifikasi yang tercatat:** `npm run verify` (lint, paritas, build), serta uji peramban untuk input, UI, ekspor, dan aksesibilitas tercatat lulus di `PROGRESS.md` Sesi 17. Setelah label/dataset diselaraskan ke kebijakan full dummy, jalankan ulang pemeriksaan yang relevan. Perintah verifikasi tercantum di [`07-webapp/README.md`](../07-webapp/README.md).

**Kriteria penerimaan:**
- [x] Build berhasil dan angka kanonik sesuai paper.
- [x] Alur UI utama, input angka, ekspor, dan aksesibilitas diuji.
- [x] Smoke test website dilakukan di browser lokal.

### Fase 6 — Publikasikan website — BELUM DIKERJAKAN / OPSIONAL

Website sudah dapat dijalankan dan dibangun, tetapi **belum ada bukti deployment publik ke Vercel**. Kerjakan fase ini hanya jika dosen/pengguna memerlukan URL yang dapat diakses dari internet.

**Kriteria penerimaan:**
- [ ] Build produksi berhasil dari konfigurasi deployment.
- [ ] URL publik tersedia dan halaman utama serta alur dashboard berhasil diuji setelah deployment.
- [ ] Tidak ada secret atau kredensial yang dimasukkan ke repository.

**Verifikasi:** jalankan build sesuai `07-webapp/README.md`, deploy ke Vercel, lalu lakukan smoke test pada URL publik.

### Fase 7 — Deployment dan fitur tambahan — OPSIONAL

Data lapangan dan kuesioner tidak menjadi prasyarat penilaian aplikasi. Deployment publik, Supabase, Web GIS, atau visual 3D hanya ditambahkan jika memang diminta. Sebelum Supabase, tetapkan kebutuhan penyimpanan, pengguna, dan hak akses.

**Kriteria penerimaan jika tahap ini disetujui:**
- [ ] Kebutuhan tambahan (URL publik, persistensi, atau visual 3D) disetujui secara spesifik.
- [ ] Jika memilih visual 3D, visual memberi informasi yang tidak tersedia di 2D, berlabel simulasi, dan memiliki fallback yang tetap dapat dipakai tanpa WebGL.
- [ ] Jika memilih Supabase, skema dan aturan keamanan ditetapkan sebelum UI membaca/menulis data.
- [ ] Paritas model kanonik tetap lulus setelah perubahan.

**Dependensi:** keputusan pengguna/dosen; kredensial deployment hanya jika website dipublikasikan.

## Definisi selesai untuk target utama

Target utama—**website DSS berjalan dan mengimplementasikan model paper**—tercapai ketika `07-webapp/` berhasil di-build, bisa dibuka di browser, alur dashboard inti berfungsi, dan uji paritas serta UI lulus. Target ini **tidak mensyaratkan** Supabase atau deployment publik. Status yang terdokumentasi saat ini memenuhi target tersebut; deployment publik dan penyimpanan permanen masih opsional.

## Risiko dan batasan

| Risiko/batasan | Dampak | Penanganan |
|---|---|---|
| Data dummy dapat disalahartikan sebagai kondisi nyata | Hasil dapat disalahartikan sebagai rekomendasi lapangan final | Beri label `[SIMULASI]` pada dataset dan keluaran; jangan menyatakan validasi lapangan/kuesioner. |
| C9 ≥ 3 adalah keputusan implementasi | Ambang bisa tidak cocok dengan kebijakan baru | Dokumentasikan dan tinjau ulang jika data atau aturan institusi berubah. |
| Belum ada backend/persistensi | Perubahan pengguna hilang setelah halaman ditutup | Terima sebagai batas MVP; tambah penyimpanan hanya bila ada kebutuhan. |
| Belum ada deployment publik | Website belum dapat diakses melalui URL publik | Deploy ke Vercel jika akses publik diminta. |

## Daftar tugas lanjutan

Checklist pekerjaan tersisa, dependensi, dan kriteria lulus ada di [`tasks/todo.md`](todo.md).

---

## Rencana lanjutan: peta berbukti dan Skenario Saya

**Tanggal:** 23 Nov 2026; diimplementasikan 24 Nov 2026. **Status:** selesai & diuji (lihat PROGRESS Sesi 34).

### Tujuan dan hasil akhir

Pengguna dapat membuat salinan skenario dari preset, memilih lokasi lewat klik peta atau koordinat manual, mengisi data segmen, menyimpan, lalu melihat peringkat dan fase anggaran diperbarui. Skenario tetap tersedia setelah refresh dan dapat dicadangkan sebagai JSON. Pengguna tidak perlu survei lapangan untuk menjalankan simulasi; aplikasi tidak mengklaim hasil simulasi sebagai rekomendasi pemasangan tervalidasi.

### Dasar pemeriksaan kode

- `07-webapp/lib/store.tsx`: alternatif masih berasal dari impor JSON tetap; state yang dapat diedit hanya nilai, penilaian AHP, dan pengaturan. Tidak ada operasi tambah alternatif atau persistensi.
- `07-webapp/lib/supabase-repository.ts`: tersedia `fetchDataset`, tetapi pencarian pemanggil tidak menemukan integrasi di store; tidak ada jalur tulis skenario pengguna.
- `07-webapp/lib/engine/index.ts:87–93`: mesin membangun matriks dari seluruh alternatif, tetapi nilai hilang menjadi 0, C9 menjadi 3, dan biaya menjadi 0. Form wajib memvalidasi kelengkapan sebelum memanggil mesin.
- `07-webapp/components/map/PriorityMapGIS.tsx`: memakai tile OSM, overlay `jalan.sim.json`, radius tetap 75/100 m, batas pandang tetap, dan popup HTML berbasis interpolasi string.
- `07-webapp/data/cctv-eksisting.sim.json`: status keberadaan kamera, operasi, dan ketepatan koordinat belum dipisahkan; kamera simulasi juga masih berstatus `Aktif`.

### Koreksi dasar bukti lokasi

1. Basemap OSM merepresentasikan geografi nyata, tetapi bukan jaminan semua nama jalan, batas desa, atau objeknya tepat dan terkini. Polyline `jalan.sim.json` adalah overlay simulasi, bukan geometri resmi hasil ekstraksi jalan.
2. Jarak A3 sekitar 6 m dari hasil geocoding jalan bukan ukuran galat lokasi kandidat, bukti simpang lima, atau bukti lokasi kamera. Jarak titik ke node nama desa juga tidak membuktikan titik berada di desa tersebut. Angka perbandingan sebelumnya tidak boleh dipakai sebagai akurasi GPS.
3. Bukti berita tentang keberadaan ETLE tidak membuktikan koordinat marker EX-01 atau status operasional terkini. EX-02 tetap simulasi. Pisahkan `bukti keberadaan`, `status koordinat`, dan `status operasional beserta tanggalnya`.
4. Tidak tercantumnya Jatinangor pada daftar ATCS yang diperiksa bukan bukti tidak ada layanan ATCS di Jatinangor. Klaim kategoris sebelumnya di dokumen/paper perlu dilunakkan menjadi hasil penelusuran terbatas yang bersumber.
5. Lingkaran 75/100 m adalah buffer ilustratif, bukan cakupan efektif kamera: arah, lensa, penghalang, dan penerangan belum dimodelkan.
6. C7 preset tetap estimasi input, bukan jarak terhitung dari dua marker simulasi. Kamera kampus, kamera lalu lintas, dan kamera permukiman tidak otomatis setara untuk pengawasan gang.

### Keputusan rancangan

- **Preset acuan dilindungi.** `ilustratif` dan `naskah_uts` menjadi template. Penambahan/penghapusan titik disimpan di salinan `Skenario Saya`, bukan ditulis ke JSON fixture kanonik. Simpan asal preset dan kebijakan C9 secara eksplisit; jangan menggantungkan kebijakan skenario pada nama ID baru.
- **MVP satu skenario lokal.** Gunakan penyimpanan browser untuk data kecil ini, dengan versi format, validasi saat dibaca, pesan kegagalan simpan, dan cadangan JSON. Jangan menimpa data tersimpan dengan state awal saat hydration. Penghapusan data browser dapat menghilangkan skenario; ekspor menjadi jalan pemulihan.
- **Jenis marker berbeda.** Penambahan utama adalah kandidat segmen (ikut TOPSIS). CCTV eksisting dan landmark adalah konteks, tidak otomatis ikut perankingan. Nama, ID stabil, koordinat, sumber, tanggal, dan status bukti dicatat; jangan gunakan peringkat sebagai ID.
- **Alur draf.** Klik peta hanya membuat pin sementara. Alternatif masuk engine setelah C1–C8, C9, dan RAB lengkap serta sah. Batal tidak mengubah hasil; nilai yang belum diketahui tidak diam-diam dianggap nol. Nilai simulasi boleh diisi manual dan diberi label.
- **Validasi input.** Nama tidak kosong, ID unik, angka finite, latitude/longitude WGS84 valid, C9 dalam 1–5, biaya tidak negatif; skala/satuan kriteria mengikuti model. Peringatan di luar area studi hanya saran selama batas administratif tervalidasi belum tersedia. Teks pengguna dalam popup ditampilkan sebagai teks/DOM aman, bukan HTML mentah.
- **Dampak model dijelaskan.** Tambahan alternatif dapat mengubah normalisasi, solusi ideal, skor dan peringkat TOPSIS seluruh titik. Bobot AHP tidak otomatis berubah jika kriteria/penilaian tetap. Perubahan ini normal pada skenario; bukan alasan mengganti angka harapan uji paritas preset.
- **Peta mengikuti data.** Fitur “lihat semua titik” menghitung bounds dari skenario, tidak memaksa fit ulang setiap edit nilai. SVG 2D juga harus menampung titik baru; gunakan bounds konsisten atau pernyataan keterbatasan yang jelas.
- **Supabase tahap berikutnya.** Sinkronisasi antarperangkat memerlukan integrasi store, transaksi alternatif+nilai, Auth dan RLS kepemilikan. Tombol peran Admin/Pakar sekarang bukan autentikasi. MVP lokal tidak memerlukan backend baru.

### Urutan implementasi

| ID | Hasil yang dapat dipakai | Dependensi |
|---|---|---|
| P1 | Status sumber dan ketidakpastian kamera diperbaiki pada data/popup | — |
| P2 | Paper dan dokumen menyatakan batas bukti secara konsisten | P1 |
| P3 | Skenario lokal bisa dibuat dari preset, disimpan, dan dipulihkan | — |
| P4 | Tambah kandidat melalui form koordinat manual dan hitung ulang | P3 |
| P5 | Klik peta/geser pin draf mengisi form yang sama; semua titik terlihat | P1, P4 |
| P6 | Edit/hapus kandidat skenario dan cadangkan/pulihkan JSON | P3, P5 |
| P7 | Verifikasi alur lengkap dan panduan penggunaan | P2, P6 |

Kriteria penerimaan, file sasaran dan verifikasi per tugas: [`todo.md`](todo.md#rencana-lanjutan-peta-dan-skenario-p1p7).

### Prioritas lanjutan setelah MVP

1. Filter kandidat/kamera/landmark dan pencarian nama titik untuk mengurangi kepadatan peta.
2. Perbandingan baseline–skenario (skor, peringkat, biaya fase) agar dampak A6 mudah dijelaskan saat presentasi.
3. Impor CSV/GeoJSON setelah format JSON stabil; GeoJSON memakai urutan `[longitude, latitude]`, sedangkan Leaflet menerima `[latitude, longitude]`.
4. Supabase untuk kolaborasi jika penyimpanan lintas perangkat diperlukan.
5. C7 berbasis GIS hanya setelah inventaris kamera, koordinat, status operasional, dan definisi jaraknya layak dipakai. Tampilkan metrik turunan terpisah sebelum menjadikannya input model.

### Risiko dan batas realistis

| Risiko | Penanganan |
|---|---|
| Peta terlihat nyata sehingga nilai simulasi dianggap hasil lapangan | Status terpisah untuk koordinat, bukti kamera, dan input kriteria; semua ekspor membawa konteks skenario |
| Titik dipindah ke pusat desa namun disebut lokasi gang tertentu | Catat sebagai penanda area representatif sampai ada bukti segmen; jangan menjanjikan presisi atau mencocokkan koordinat demi C7 |
| Nilai kosong masuk mesin sebagai nol dan menghasilkan skor menyesatkan | Draf belum lengkap tidak masuk `solveDataset`; validasi juga pada impor/restore |
| Reload, perpindahan preset, atau storage gagal menghilangkan pekerjaan | Skenario disimpan terpisah, loading tervalidasi, gagal simpan terlihat, tersedia backup |
| Penambahan titik mengubah ranking lama | Beri konteks skenario; uji angka baseline memakai fixture asli |
| Google Maps disalahartikan sebagai sumber yang sudah diverifikasi | Tautan “buka koordinat” hanya bantuan pembandingan; bukan bukti validasi atau geocoding otomatis |

**Definisi selesai MVP:** tambah A6 dari peta → isi data dan sumber → simpan → titik, tabel, ranking, sensitivitas, anggaran, dan ekspor konsisten → refresh tetap tersimpan → hapus/reset skenario tidak merusak preset → semua pemeriksaan relevan lulus.

**Realistis tanpa survei:** ya, sebagai DSS simulasi berbasis sumber sekunder dengan pemetaan representatif. Klaim akurasi pemasangan kamera, cakupan efektif, keamanan lokasi, dan hasil empiris memerlukan bukti tambahan. Tidak ditetapkan tanggal penyelesaian sebelum scope dan pilihan penyimpanan disetujui.
