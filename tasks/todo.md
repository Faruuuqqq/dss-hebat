# Tugas Lanjutan DSS CCTV Jatinangor

> **Rencana terbaru untuk ditinjau:** [P1–P7](#rencana-lanjutan-peta-dan-skenario-p1p7). Checklist awal dipertahankan sebagai riwayat; opsi Three.js telah dibatalkan pengguna pada Sesi 32. Jangan mengimplementasikan opsi lama itu kembali.

Tugas berikut **bukan blocker** untuk website lokal yang sudah berjalan. Data aplikasi menggunakan dummy/ilustratif; survei lapangan dan kuesioner tidak menjadi prasyarat. Prioritaskan tugas opsional hanya jika kebutuhan pengguna/dosen mengharuskannya.

## Selaraskan aplikasi ke kebijakan full dummy

- [ ] Tandai seluruh dataset dan keluaran demo sebagai `[SIMULASI]`/dummy; hapus klaim aplikasi bahwa data demo adalah hybrid atau data lapangan tervalidasi.
- [ ] Pertahankan angka ilustratif paper sebagai baseline uji, bukan sebagai data lapangan; jelaskan batasan ini pada UI dan dokumentasi.
- [ ] Selaraskan `07-webapp/`, `05-aplikasi/`, `08-docs/data-dan-sumber.md`, SRS, dan paper hasil tanpa mengubah naskah proposal yang sudah dikumpulkan kecuali diminta.
- [ ] Jalankan seluruh uji paritas dan UI setelah perubahan; pastikan semua label simulasi terlihat.

**Kriteria selesai:** pengguna dapat mengenali bahwa semua data aplikasi adalah dummy, angka baseline paper tetap direproduksi, dan tidak ada klaim bahwa data berasal dari survei/kuesioner.
**Dependensi:** gunakan nilai ilustratif kanonik sebagai fixture; bila angka alternatif ikut diubah, hitung ulang dan sinkronkan semua luaran terkait.

## Deploy website publik (opsional)

- [ ] Pastikan kebutuhan URL publik dan akun/proyek Vercel tersedia.
- [ ] Deploy `07-webapp/` tanpa menambahkan secret ke repository.
- [ ] Verifikasi URL publik: halaman terbuka, dashboard inti berfungsi, dan tidak ada error runtime.

**Verifikasi sebelum/sesudah deploy:** `cd 07-webapp && npm run verify`, lalu smoke test browser di URL hasil deployment.
**Dependensi:** keputusan untuk mempublikasikan dan akses Vercel.

## Putuskan apakah Supabase diperlukan (opsional)

- [ ] Tentukan kebutuhan konkret: data harus persisten, dikelola banyak pengguna, atau diperbarui terpusat.
- [ ] Jika tidak ada kebutuhan tersebut, pertahankan aplikasi statis tanpa backend.
- [ ] Jika disetujui, rencanakan skema, akses, migrasi, secrets, dan pengujian sebelum implementasi.

**Kriteria selesai:** keputusan dan alasannya tercatat; jika integrasi dipilih, akses database dibatasi dan seluruh paritas model tetap lulus.
**Dependensi:** kebutuhan pengguna/dosen; Supabase bukan prasyarat deployment website statis.

## Pertimbangkan Three.js untuk visual 3D (opsional)

- [ ] Pastikan ada kebutuhan informasi 3D yang tidak bisa dijelaskan dengan dashboard dan peta SVG 2D.
- [ ] Jika dipilih, implementasikan scene Three.js dalam komponen client-side Next.js; gunakan data posisi/geometri simulasi dan tampilkan labelnya.
- [ ] Sediakan fallback 2D yang tetap menyampaikan informasi inti serta uji tampilan pada perangkat tanpa dukungan WebGL.

**Kriteria selesai:** visual 3D menambah informasi, tidak menghambat fungsi DSS, dan website tetap dapat digunakan tanpa WebGL.
**Dependensi:** keputusan bahwa visualisasi 3D memang diperlukan. Jika tidak, jangan tambahkan Three.js.

---

## Rencana lanjutan peta dan skenario P1–P7

**Status:** rencana, belum dikerjakan. Desain dan alasan keputusan ada di [`plan.md`](plan.md#rencana-lanjutan-peta-berbukti-dan-skenario-saya). Survei lapangan bukan prasyarat MVP.

### P1 — Status bukti pada peta

**Hasil:** pengguna dapat membedakan kamera terdokumentasi, posisi perkiraan, dan simulasi.
- [ ] Metadata membedakan keberadaan, ketepatan koordinat, status operasional, URL sumber, dan tanggal; EX-02 tidak mengklaim aktif nyata.
- [ ] Popup/legenda menjelaskan buffer ilustratif dan C7 input dataset; overlay jalan simulasi tidak disajikan sebagai geometri terverifikasi.
- [ ] Generator mempertahankan metadata saat dijalankan ulang.

**Verifikasi:** audit sumber tertaut; uji popup di GIS/SVG, `npm run verify` dan `npm run test:a11y` (dari `07-webapp/`, server 3111 untuk browser).
**Dependensi:** —. **Lingkup:** M.
**File sasaran:** `07-webapp/data/cctv-eksisting.sim.json`, `07-webapp/scripts/generate-data.py`, `07-webapp/components/map/PriorityMapGIS.tsx`, `07-webapp/components/map/PriorityMap2D.tsx`.

### P2 — Konsistensi bukti di paper dan dokumentasi

**Hasil:** uraian hasil riset tidak melebihi bukti yang tersedia.
- [ ] Klaim “tidak ada ATCS”, “6 m berarti presisi”, dan status koordinat diperbaiki sesuai batas penelusuran; sumber diberi URL dan tanggal.
- [ ] Paper `.md` dan `.tex` sinkron; baseline numerik tetap; naskah proposal terkumpul diperlakukan sebagai arsip acuan, bukan diam-diam ditulis ulang.
- [ ] Dokumen survei menjadikan ambang usulan sebagai rancangan yang perlu disahkan, serta tidak menginstruksikan penimpaan fixture kanonik dengan hasil baru.

**Verifikasi:** `TECTONIC=/path/tectonic bash build-papers.sh`; cek sitasi/braces/environment; `node 05-aplikasi/test-algoritma.mjs`.
**Dependensi:** P1. **Lingkup:** M.
**File sasaran:** `08-docs/data-dan-sumber.md`, `06-paper-hasil/draft-paper-hasil.md`, `06-paper-hasil/draft-paper-hasil.tex`, `08-docs/instrumen-survei-lapangan.md`, `AGENTS.md` (PDF hasil compile ikut diselaraskan).

### P3 — Salinan skenario dan penyimpanan lokal

**Hasil:** tombol buat skenario menyalin preset untuk diedit tanpa mengubah baseline.
- [ ] Skenario menyimpan alternatif, nilai, AHP, asal preset, dan kebijakan C9; perubahan tidak memutasi fixture atau hilang saat beralih preset.
- [ ] Refresh memulihkan skenario valid; JSON rusak/versi tidak didukung tidak diam-diam ditimpa state awal.
- [ ] Kegagalan storage ditampilkan sebagai belum tersimpan; reset skenario tidak menghapus preset.

**Verifikasi:** uji clone-isolation, reload, kebijakan C9 kedua asal preset, storage gagal/rusak; `npm run parity`.
**Dependensi:** —. **Lingkup:** M.
**File sasaran:** `07-webapp/lib/store.tsx`, modul baru `07-webapp/lib/scenario.ts`, `07-webapp/components/Sidebar.tsx`, skrip baru `07-webapp/scripts/scenario-check.mts`, `07-webapp/scripts/ui-scenario.mjs`.

### Checkpoint 1 — Fondasi (P1–P3)
- [ ] Status bukti terbaca, kedua preset lulus paritas, skenario lolos uji persistensi, build bersih.

### P4 — Tambah kandidat lewat form

**Hasil:** pengguna dapat menambah A6 dengan koordinat manual dan melihat hasilnya.
- [ ] Nama, ID unik, lat/lng, C1–C8, C9, biaya, serta status/sumber data divalidasi; kosong tidak menjadi nol otomatis.
- [ ] Draf/batal tidak memengaruhi skor; simpan lengkap menambah marker, baris tabel, ranking dan fase sesuai hasil engine.
- [ ] Nama pengguna ditampilkan secara aman dalam popup; konten seperti `<img onerror=...>` tidak dieksekusi.

**Verifikasi:** uji invalid/finite/range/duplikat/ID stabil; tambah alternatif keenam, cek hasil finite dan konsistensi nilai antarhalaman; `npm run verify`.
**Dependensi:** P3. **Lingkup:** M.
**File sasaran:** `07-webapp/lib/scenario.ts`, `07-webapp/lib/store.tsx`, komponen baru `07-webapp/components/SegmentForm.tsx`, `07-webapp/app/kriteria/page.tsx`, `07-webapp/components/map/PriorityMapGIS.tsx`.

### P5 — Pilih lokasi dengan klik peta

**Hasil:** tombol Tambah Titik membuka alur lokasi yang terhubung ke form P4.
- [ ] Klik peta membuat pin draf; geser pin memperbarui lat/lng; batal membersihkan pin/listener tanpa menambah alternatif.
- [ ] Form koordinat manual tetap tersedia bagi pengguna keyboard/mobile; klik marker yang ada tidak membuat kandidat baru.
- [ ] “Lihat semua” menampung seluruh skenario di GIS/SVG; zoom pengguna tidak direset setiap edit nilai; lat/lng tidak tertukar.

**Verifikasi:** alur klik–drag–batal–simpan di `ui-scenario.mjs`, titik di luar bounds lama, keyboard/mobile, `npm run test:a11y`.
**Dependensi:** P1, P4. **Lingkup:** M.
**File sasaran:** `07-webapp/components/map/PriorityMapGIS.tsx`, `07-webapp/components/SegmentForm.tsx`, `07-webapp/components/map/PriorityMap2D.tsx`, `07-webapp/lib/map-projection.ts`, `07-webapp/scripts/ui-scenario.mjs`.

### Checkpoint 2 — Alur tambah titik (P4–P5)
- [ ] A6 tersimpan dari klik peta, ikut perhitungan dan tetap ada setelah refresh; baseline kanonik lulus.

### P6 — Kelola dan cadangkan skenario

**Hasil:** pengguna dapat mengedit/menghapus kandidat dan memulihkan skenario dari berkas.
- [ ] Edit/hapus memakai ID stabil; seleksi tidak menunjuk titik terhapus; kasus skenario kosong ditangani sebelum pemanggilan engine.
- [ ] Ekspor JSON memuat data dan sumber untuk round-trip; impor divalidasi penuh sebelum mengganti state; data lama tetap ada jika impor gagal.
- [ ] Ekspor hasil CSV menggunakan ID/nama skenario yang benar; preset acuan tetap dapat dipilih kembali.

**Verifikasi:** round-trip JSON, impor rusak/ID duplikat/angka invalid, hapus titik terpilih/terakhir; `npm run test:export` dan `node scripts/scenario-check.mts`.
**Dependensi:** P3, P5. **Lingkup:** M.
**File sasaran:** `07-webapp/lib/scenario.ts`, `07-webapp/lib/store.tsx`, `07-webapp/app/kriteria/page.tsx`, `07-webapp/app/hasil/page.tsx`, `07-webapp/scripts/scenario-check.mts`.

### P7 — Verifikasi end-to-end dan panduan

**Hasil:** skenario siap didemokan tanpa mengklaim validasi lapangan.
- [ ] Uji kedua preset serta skenario tambahan: marker, tabel, sensitivitas, fase anggaran, persistensi, dan ekspor konsisten; penambahan alternatif boleh mengubah peringkat lama.
- [ ] Panduan menjelaskan sumber/status data, cara tambah titik, arti C7/buffer, dan batas penyimpanan lokal.
- [ ] Hasil pengujian dicatat sesuai output aktual; fixture baseline tidak ditulis ulang untuk meluluskan uji.

**Verifikasi:** `npm run verify`, `npm run test:bugs`, `npm run test:ui`, `npm run test:export`, `npm run test:a11y`, `node scripts/ui-scenario.mjs`; browser memakai server `npx next start -p 3111`.
**Dependensi:** P2, P6. **Lingkup:** M.
**File sasaran:** `07-webapp/scripts/ui-scenario.mjs`, `07-webapp/scripts/ui-check.mjs`, `07-webapp/README.md`, `08-docs/traceability.md`, `PROGRESS.md`.

### Checkpoint selesai
- [ ] Demonstrasi tambah A6 → simpan → hitung ulang → refresh → ekspor/impor → hapus/reset lulus.
- [ ] Semua checklist P1–P7 selesai dan hasilnya ditinjau pengguna.
