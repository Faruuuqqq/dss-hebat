# Tugas Lanjutan DSS CCTV Jatinangor

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
