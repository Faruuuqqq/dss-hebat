# Dokumentasi Rekayasa Perangkat Lunak (SE) — SiPrioCCTV Jatinangor

Folder ini memuat paket dokumentasi Rekayasa Perangkat Lunak (*Software Engineering*) lengkap untuk sistem pendukung keputusan **SiPrioCCTV Jatinangor**.

Dokumentasi ini mencakup dua implementasi:
1. **Aplikasi Modern (`07-webapp/`):** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Three.js + Supabase dengan 5 layar terintegrasi, 2 preset dataset, visualisasi peta 3D pilar WebGL, dan repositori database PostgreSQL/RLS.
2. **Prototipe Mandiri (`05-aplikasi/index.html`):** Berkas HTML statis offline mandiri (single-file offline prototype).

Untuk gambaran teknis dan model konseptual mendalam, lihat [`../PROJECT_OVERVIEW.md`](../PROJECT_OVERVIEW.md). Rujukan kebenaran naskah UTS dan alur scoping review PRISMA-ScR adalah [`../dss_revisi_markdown/dss_revisi.md`](../dss_revisi_markdown/dss_revisi.md).

---

## Indeks Artefak Dokumentasi

| Artefak | Deskripsi & Isi | Status |
|---|---|---|
| [`../PROJECT_OVERVIEW.md`](../PROJECT_OVERVIEW.md) | Penjelasan komprehensif latar belakang masalah, perumusan matematis AHP–TOPSIS, arsitektur teknis 4 lapis, gambaran 5 layar, dan panduan deployment. | **Selesai (Paling Update)** |
| [`srs.md`](srs.md) | *Software Requirements Specification* (SRS): tujuan, aktor (Admin & Pakar), 17 kebutuhan fungsional (FR-01 s.d. FR-17), 10 nonfungsional (NFR-01 s.d. NFR-10), batasan model, dan 9 kriteria penerimaan (AC). | **Selesai (Update)** |
| [`penjelasan-halaman-dan-paper.md`](penjelasan-halaman-dan-paper.md) | Bahan presentasi: alur perhitungan, fungsi 5 halaman, isi paper, skrip status progres, antisipasi pertanyaan dosen. | **Baru** |
| [`justifikasi-data.md`](justifikasi-data.md) | Justifikasi data: apa yang riil, apa yang dummy/estimasi, sumber, gap, dan rencana validasi lapangan. | **Baru** |
| [`skrip-presentasi.md`](skrip-presentasi.md) | Skrip presentasi ±10 menit: alur lima layar, kalimat yang diucapkan, transisi, penutup kejujuran data, dan antisipasi pertanyaan. | **Baru** |
| [`traceability.md`](traceability.md) | Matriks keterlacakan kebutuhan (*traceability matrix*) dari FR/NFR ke implementasi kode aktual dan verifikasi otomatis (`parity.mts`, `ui-check.mjs`, `ui-export.mjs`, `ui-a11y.mjs`, `test-algoritma.mjs`). | **Selesai (Update)** |
| [`uml.md`](uml.md) | Diagram UML lengkap: Use Case multi-role (Admin vs Pakar), Diagram Arsitektur 4 Lapis, Activity Diagram AHP–TOPSIS bertahap, dan Sequence Diagram evaluasi real-time. | **Selesai (Update)** |
| [`data-dan-sumber.md`](data-dan-sumber.md) | Inventaris sumber data demografi BPS & E-Office Sumedang, data riil kriminalitas, serta dokumentasi dataset hybrid dan simulasi spasial. | **Selesai (Update)** |
| [`mockup/README.md`](mockup/README.md) | Dokumentasi wireframe dan tangkapan layar 5 layar aplikasi desktop (1440px) dan mobile (390px/430px) beserta instruksi reproduksi headless Chromium. | **Selesai (Update)** |

---

## Prinsip & Ketetapan Model Keputusan

1. **Pemisahan Kriteria Urgensi vs Kendala:**
   - **$C_1$–$C_8$** adalah kriteria urgensi berorientasi *benefit* yang dievaluasi melalui pembobotan AHP dan perankingan TOPSIS.
   - **$C_9$ (Kelayakan Teknis)** dan **RAB (Estimasi Biaya)** diperlakukan sebagai kendala operasional dan anggaran saat alokasi bertahap, bukan kriteria perankingan TOPSIS.
2. **Dua Preset Dataset:**
   - **Preset `ilustratif` (Default Aplikasi):** Berbasis file Excel `Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx` dengan AHP hierarki 3 klaster $\times$ 3 kelompok stakeholder (agregat rata-rata geometrik). TOPSIS: $A_3$ ($0{,}7674$) > $A_1$ ($0{,}5650$) > $A_4$ ($0{,}4287$) > $A_2$ ($0{,}4128$) > $A_5$ ($0{,}1397$).
   - **Preset `naskah_uts`:** AHP datar $8 \times 8$ kanonik untuk paritas dengan paper hasil dan naskah proposal UTS ($C_1$ $23{,}95\%$, $A_3$ $0{,}6445$).
3. **Kebijakan Kelayakan Operasional $C_9$:**
   - Alternatif dengan skor $C_9 < 3$ tidak boleh dialokasikan pada Fase 1 (Segera), namun ditunda ke fase berikutnya (Fase 2+) dengan catatan peringatan kesiapan tiang dan jaringan listrik.
4. **Transparansi Data:**
   - Seluruh data per segmen yang belum divalidasi oleh observasi lapangan langsung diberi label transparan **[SIMULASI]** / *estimasi terdokumentasi*.

---

## Perintah Verifikasi & Validasi Otomatis

Untuk memastikan integritas algoritma dan antarmuka, jalankan suite pengujian berikut:

```bash
# 1. Verifikasi Aplikasi Modern Next.js (Linting + Paritas 75 check + Build Statis)
cd 07-webapp
npm run verify

# 2. Pengujian E2E Peramban Chromium (jalankan `npm start -p 3111` terlebih dahulu)
npm run test:ui       # Verifikasi interaksi 5 layar
npm run test:export   # Verifikasi unduhan nyata berkas CSV
npm run test:bugs     # Verifikasi proteksi input angka NumberCell
npm run test:a11y     # Audit aksesibilitas axe-core WCAG 2.1 AA (0 pelanggaran)

# 3. Verifikasi Prototipe Mandiri (Offline)
cd ..
node 05-aplikasi/test-algoritma.mjs
```
