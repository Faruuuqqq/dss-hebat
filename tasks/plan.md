# Roadmap Implementasi Aplikasi DSS CCTV Jatinangor

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
