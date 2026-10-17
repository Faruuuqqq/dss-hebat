# CHECKLIST REVISI PAPER DSS JATINANGOR (5 ANGGOTA TIM)

Dokumen ini memetakan seluruh butir perbaikan naskah berdasarkan hasil telaah kritis reviewer, dikelompokkan dalam 4 Fase kerja, dilengkapi PIC (A1–A5), dependensi, prioritas, dan kriteria selesai (*Definition of Done*).

---

## 1. Matriks Penugasan Tim (RACI Ringkas)

| Anggota | Peran Utama | Fokus Revisi Kunci |
|---|---|---|
| **A1** | Koordinator & PRISMA Keeper | Rekonsiliasi alur PRISMA-ScR (582→416→121→12), justifikasi Scopus/screening Gen-AI, sinkronisasi abstrak |
| **A2** | Analis Spasial & Jaringan | Matriks Studi × Kriteria (C4, C6, C7), rekonsiliasi rujukan Wang [1] & Yuhang [12], diagram arsitektur |
| **A3** | Analis Kawasan & Kriminologi | Landasan teori kriminologi (CPTED, Routine Activity), data lokal (kepadatan 3.740 jiwa/km², lebar gang, kosan), justifikasi A1–A5 |
| **A4** | Analis Metode MCDM | Perumusan AHP-TOPSIS terpisah (Urgensi C1–C8 vs Kelayakan/Biaya C9), pilot dummy, CR, sensitivitas, hierarki AHP |
| **A5** | Analis Kebijakan & Trade-off | Aturan fase anggaran (knapsack/tier), justifikasi adopsi/tolak metode, penyesuaian nada klaim (*tone down*), pembersihan istilah internal |

---

## 2. Tabel Rinci Rencana Kerja (Checklist)

| ID | Fase | Butir Tugas | PIC | Dependensi | Prioritas | Status | Kriteria Selesai (*Definition of Done*) |
|---|---|---|---|---|---|---|---|
| **T1.1** | Fase 1 | **Rekonsiliasi Alur PRISMA-ScR**<br>Kunci angka: 582 disaring → 166 thn <2021 → 416 sought → 2 non-Inggris + 233 non-artikel + 60 tak terakses → 121 assessed → 109 eksklusi tema → 12 included. Hapus inkonsistensi 181/18 di teks/abstrak/caption. | A1 | - | P1 (Krusial) | Selesai | Angka di Abstrak, Seksi II-C, dan Caption Gambar 1 identik persis (582→416→121→12). |
| **T1.2** | Fase 1 | **Tabel Pemetaan Studi × Kriteria (Single Source of Truth)**<br>Bangun matriks 12 studi × C1–C9. Rekonsiliasi perbedaan Tabel III (Data Charting) vs Tabel VIII (Matriks Kriteria) untuk C1, C3, C8, C9. | A2, A4 | - | P1 (Krusial) | Selesai | Setiap tanda centang pada Tabel VIII dapat diverifikasi pada kolom Relevansi Tabel III dan file CSV charting. |
| **T1.3** | Fase 1 | **Justifikasi Protokol & Deklarasi Gen-AI**<br>Bahas bias Scopus-only & paywall 33% di limitasi; jelaskan aturan inklusi sensor utilitas (Yuhang) via analogi transferabilitas; jelaskan screening Gen-AI di Seksi II-C dan Acknowledgment. | A1 | T1.1 | P2 | Selesai | Seksi II-B & Deklarasi Gen-AI transparan dan sesuai standar etika IEEE. |
| **T2.1** | Fase 2 | **Pemisahan Urgensi (C1–C8) dari Kelayakan/Biaya (C9)**<br>C1–C8 murni mengukur urgensi risiko; C9 dan biaya investasi/operasional dipisahkan sebagai kendala anggaran/tahapan implementasi atau cost ratio. | A4 | T1.2 | P1 (Krusial) | Selesai | TOPSIS menghitung urgensi murni; C9 tidak mencampuradukkan "mendesak" dengan "mudah/murah dipasang". |
| **T2.2** | Fase 2 | **Mekanisme Alokasi Anggaran Bertahap**<br>Definisikan aturan batas anggaran (plafon belanja bertahap / simple knapsack tiering) untuk mewujudkan klaim "rencana pemasangan bertahap". | A5, A4 | T2.1 | P2 | Selesai | Seksi IV memuat aturan cut-off peringkat berdasarkan batas anggaran per fase pemasangan. |
| **T2.3** | Fase 2 | **Penyempurnaan Struktur AHP & Prosedur Grup**<br>Sajikan opsi hierarki (Risiko, Paparan, Spasial) untuk mitigasi 36 pairwise comparison; tulis rumus CI, CR, batas CR < 0,1, dan geometric mean per responden sebelum agregasi. | A4 | T2.1 | P2 | Selesai | Prosedur AHP rinci, jumlah pakar terdefinisi, mitigasi korelasi kriteria (C4/C6/C7) dibahas. |
| **T2.4** | Fase 2 | **Kelengkapan Formulasi Matematis TOPSIS**<br>Tulis rumus lengkap: normalisasi vektor, matriks terbobot, solusi ideal positif/negatif, jarak Euclidean, closeness coefficient, dan prosedur sensitivitas ±20%. | A4 | T2.1 | P2 | Selesai | Seksi IV-C memuat persamaan matematis TOPSIS lengkap, bukan hanya Eq closeness. |
| **T2.5** | Fase 2 | **Perbaikan Alternatif A1–A5 & Konteks Lokal**<br>Ganti justifikasi alternatif dari sitasi paper asing (apartemen Korea/UAV) menjadi data empiris lapangan Jatinangor; klarifikasi definisi segmen jalan vs gang sempit. | A3 | - | P3 | Selesai | Karakteristik A1–A5 merujuk pada tipologi spasial nyata Jatinangor (Sayang, Cikeruh, Hegarmanah, Cipacing, Cileles). |
| **T2.6** | Fase 2 | **Landasan Teori Kriminologi & Kebijakan**<br>Tambahkan perspektif CPTED (*Crime Prevention Through Environmental Design*), *Routine Activity Theory*, privasi (UU PDP No. 27/2022), dan komplementaritas PJU vs CCTV. | A3, A5 | - | P3 | Selesai | Terdapat 1-2 paragraf landasan kriminologi di Pendahuluan / Pembahasan. |
| **T3.1** | Fase 3 | **Penyusunan Pilot Dummy Numerik AHP-TOPSIS**<br>Buat matriks data ilustratif A1–A5 × C1–C8, hitung bobot AHP (CR < 0,1), jalankan TOPSIS hingga peringkat closeness dan uji sensitivitas ±20%. | A4 | T2.1, T2.3, T2.4 | P1 (Krusial) | Selesai | Menghasilkan tabel hasil numerik terverifikasi yang membuktikan model matematis dapat dieksekusi. |
| **T4.1** | Fase 4 | **Sinkronisasi Diagram Gambar 2 & Gambar 3**<br>Pastikan Gambar 2 = Taksonomi 5 Pola (4 diadopsi, 1 ditolak); Gambar 3 = Arsitektur 4 Lapis; seragamkan sitasi di diagram dengan nomor referensi IEEE naskah. | A2 | T1.2 | P2 | Selesai | File `.mmd` dan file `.png` sinkron dengan teks naskah dan nomor sitasi. |
| **T4.2** | Fase 4 | **Koreksi Data Demografi & Data Lokal**<br>Perbaiki angka kepadatan: 98.000 jiwa / 26,20 km² ≈ 3.740 jiwa/km² (bukan 3.212); beri sitasi valid BPS Jatinangor 2024. | A3 | - | P2 | Selesai | Angka demografi di Pendahuluan dan Seksi IV-A diverifikasi akurat. |
| **T4.3** | Fase 4 | **Penyesuaian Nada Klaim (*Tone Down*)**<br>Ubah istilah "dominan" / "pola pemenang" menjadi "pasangan metode yang paling teruji pada korpus"; ubah "demonstrating transparent translation" menjadi perumusan kerangka konseptual. | A5 | - | P2 | Selesai | Abstrak dan isi paper tidak lagi memuat klaim yang melampaui bukti korpus. |
| **T4.4** | Fase 4 | **Pembersihan Istilah Internal Kelas**<br>Hapus seluruh frasa "model UTS", "pasca-UTS", "menuju UAS" dari naskah publikasi. | A1 | - | P3 | Selesai | Naskah bersih dari terminologi akademik internal kelas. |
| **T4.5** | Fase 4 | **Penyesuaian Gap Penelitian & Struktur Pendahuluan**<br>Pindahkan pernyataan gap riset dari Seksi III ke Pendahuluan; nyatakan secara eksplisit sifat paper sebagai hibrida *scoping review* dan *conceptual design*. | A1, A5 | - | P3 | Selesai | Bagian akhir Pendahuluan memuat latar belakang, gap, dan 3 kontribusi terikat RQ secara proporsional. |
| **T4.6** | Fase 4 | **Penyelarasan Bahasa Naskah**<br>Pastikan judul, abstrak, dan seluruh batang tubuh naskah konsisten (bahasa Indonesia baku dengan istilah teknis Inggris tercetak miring). | A1 | T4.3, T4.4 | P3 | Selesai | Naskah memenuhi kaidah penulisan akademik tanpa inkonsistensi dwibahasa yang canggung. |
| **T4.7** | Fase 4 | **Audit Tata Letak Tabel & Format Kolom IEEE**<br>Pastikan Tabel III dan Tabel VIII muat rapi di format IEEE 2-kolom (menggunakan `table*` dengan lebar kolom proporsional); cek batas 6–8 halaman. | A1, A2 | All | P2 | Selesai | File `.tex` dapat dikompilasi bersih tanpa *overflow* tabel atau *broken references*. |

---

## 3. Titik Kendali (Checkpoints)

1. **Checkpoint 1 (Fase 1 Selesai):** Seluruh data alur PRISMA, matriks studi × kriteria, dan angka dasar (kepadatan) telah disepakati dan identik di semua berkas.
2. **Checkpoint 2 (Fase 2 & 3 Selesai):** Skrip perhitungan numerik AHP-TOPSIS dummy berhasil berjalan dengan $CR < 0{,}1$ dan sensitivitas stabil.
3. **Checkpoint 3 (Fase 4 Selesai):** Pembacaan silang (*blind peer-review* internal) oleh A1 dan A5 untuk memastikan tidak ada lagi inkonsistensi teks, tabel, atau nomor sitasi.
