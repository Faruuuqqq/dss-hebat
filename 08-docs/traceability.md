# Matriks Traceability
## Aplikasi DSS Prioritisasi Penempatan CCTV Jatinangor

**Dokumen kebutuhan:** [`08-docs/srs.md`](srs.md)

**Sumber kebenaran model dan angka:** [`dss_revisi_markdown/dss_revisi.md`](../dss_revisi_markdown/dss_revisi.md)

**Implementasi utama:** [`05-aplikasi/index.html`](../05-aplikasi/index.html)

**Uji algoritma aktual:** [`05-aplikasi/test-algoritma.mjs`](../05-aplikasi/test-algoritma.mjs)

## 1. Aturan pembacaan matriks

- **Implementasi** menunjuk konstanta, fungsi, renderer, atau *event handler* yang benar-benar ada di aplikasi.
- **Verifikasi otomatis** menunjuk pemeriksaan eksplisit dalam `test-algoritma.mjs`. Skrip ini mengekstrak satu blok `<script>` dari `index.html` dan mengeksekusinya dengan Node `vm`, sehingga algoritma yang diperiksa merupakan kode aplikasi aktual.
- **Verifikasi UI** menunjuk `05-aplikasi/test-ui.sh` bila perilaku visual/interaksi memerlukan peramban. Status lulus terakhirnya dicatat pada `PROGRESS.md` Sesi 8.
- **Inspeksi manual** berarti kebutuhan belum tercakup test otomatis yang dirujuk dan harus diperiksa melalui aplikasi di peramban.
- C1–C8 adalah masukan urgensi TOPSIS dan matriks AHP 8×8. C9 serta RAB/biaya adalah kendala alokasi. C9 ≥ 3 dicatat di bawah sebagai ambang **operasional implementasi**, bukan angka eksplisit dari `dss_revisi.md`.

## 2. Keterlacakan kebutuhan fungsional

| Kebutuhan | Dasar/aturan model | Implementasi aktual | Verifikasi | Status cakupan |
|---|---|---|---|---|
| FR-01 Dataset resmi | Lima alternatif A1–A5 merupakan model ilustratif kanonik. | `DATASETS.resmi`; `loadDataset`; inisialisasi `loadDataset('resmi')`; `renderResults`. | `test-algoritma.mjs`: AHP/TOPSIS kanonik serta data CSV. | Otomatis sebagian, inspeksi UI untuk dataset awal. |
| FR-02 Dataset perluasan [SIMULASI] | Perluasan bukan hasil utama dan harus dilabeli simulasi. | `DATASETS.perluasan` dengan `label` dan `note`; pemilih `sel-dataset`; `loadDataset`. | `test-algoritma.mjs`: `DATASETS.perluasan.alts.length` harus 12. | Otomatis untuk jumlah, inspeksi UI untuk label. |
| FR-03 Edit matriks keputusan tanpa kehilangan fokus | C1–C8 urgensi, C9/biaya kendala. | `renderX`; *listener* `document.addEventListener('input', ...)`; `renderResults` tanpa memanggil `renderX`. | `test-ui.sh`: fokus input, perubahan KPI, serta perilaku filter C9. | Otomatis UI. |
| FR-04 Edit AHP dan resiprokal | AHP memakai delapan kriteria urgensi. | `renderAHP`; *listener* input `data-a`; `A[j][i] = 1/v`. | `test-algoritma.mjs`: AHP dari skrip aktual dan paritas `bobot-ahp.csv`. | Otomatis untuk hasil/paritas, inspeksi UI untuk kontrol edit. |
| FR-05 Bobot, λmax, CI, CR | n = 8, RI = 1,41, konsisten bila CR < 0,10. | `ahp`; `RI`; `renderResults`; `renderWeights`. | `test-algoritma.mjs`: λmax, CI, CR, dan delapan bobot resmi. | Otomatis. |
| FR-06 TOPSIS hanya C1–C8 | Semua C1–C8 berorientasi *benefit* terhadap urgensi. C9/RAB dipisah. | `topsis(X, w)` dengan matriks `X` delapan kolom; `CRITERIA` berisi C1–C8; `renderTopsis`. | `test-algoritma.mjs`: CC A1–A5 resmi dan urutan implisit nilai CC. | Otomatis untuk hasil. |
| FR-07 Filter kelayakan C9 | C9 kendala kelayakan, bukan TOPSIS. Ambang C9 ≥ 3 operasional. | `C9_MIN = 3`; `feasibleFlags`; `allocPhases`; `renderTopsis`; `renderMap`; `renderPhases`. | `test-algoritma.mjs`: C9 A1 diubah menjadi 1, A1 tidak layak dan fase `null`; `test-ui.sh`: KPI, tabel, fase, badge, peta. | Otomatis. |
| FR-08 Alokasi fase anggaran | Alokasi fase memakai CC, C9, biaya, dan plafon. Biaya satu titik yang lebih besar dari plafon tidak dapat dialokasikan. | `BUDGET`; `allocPhases`; `renderTopsis`; `renderMap`; `renderPhases`. | `test-algoritma.mjs`: fase resmi, fase setelah C9 difilter, dan A5 tidak dialokasikan saat biaya dibuat Rp15,1 Jt. `test-ui.sh`: tabel fase dan peta menampilkan status biaya di atas plafon. | Otomatis. |
| FR-09 Peta skematik SVG | Keluaran konseptual berupa peta prioritas, bukan koordinat GPS final. | `renderMap`; `autoPos`; SVG dengan `aria-label`; legenda posisi relatif. | `test-ui.sh`: peta dan penanda C9 diperiksa. | Otomatis UI. |
| FR-10 Sensitivitas ±20% OAT | Variasi +20% dan −20% tiap C1–C8 dengan renormalisasi proporsional. | `sensitivity`; `renderSens`. | `test-algoritma.mjs`: 16 run dan jumlah skenario dengan *rank reversal*; paritas tabel sensitivitas dua paper terhadap output engine. | Otomatis. |
| FR-11 Reset | Fungsi antarmuka prototipe. | *Handler* `btn-reset`: `loadDataset(activeKey); A=deepCopy(A0); render();`. | Inspeksi manual di peramban. | Manual. |
| FR-12 Ekspor CSV | Fungsi antarmuka prototipe untuk keluaran hasil. | *Handler* `btn-export`; `dl`; CSV berisi peringkat, CC, biaya, fase, kelayakan, C9, dan bobot. | Inspeksi manual terhadap unduhan CSV. | Manual. |

## 3. Keterlacakan kebutuhan nonfungsional

| Kebutuhan | Implementasi atau bukti | Verifikasi | Status cakupan |
|---|---|---|---|
| NFR-01 Offline tanpa server | Satu berkas `05-aplikasi/index.html`; tidak ada panggilan API atau dependensi eksternal pada implementasi. | Inspeksi struktur file dan pembukaan lokal di peramban. | Manual. |
| NFR-02 Data-driven dan deterministik | `DATASETS`, `loadDataset`, fungsi murni `ahp`, `topsis`, `allocPhases`, dan `sensitivity`. | `test-algoritma.mjs` menjalankan perhitungan aktual dan memeriksa dataset 12 segmen. | Otomatis sebagian. |
| NFR-03 Keterlacakan uji ke kode aktual | `test-algoritma.mjs` membaca `index.html`, mengharuskan tepat satu blok skrip, lalu mengekspos API internal lewat Node `vm`. | Pemeriksaan awal skrip test sendiri dan seluruh `PASS` saat dijalankan. | Otomatis. |
| NFR-04 Bahasa Indonesia | Judul, petunjuk, tabel, legenda, dan tombol dalam `index.html`; SRS ini berbahasa Indonesia. | Inspeksi manual antarmuka. | Manual. |
| NFR-05 Transparansi data hybrid/simulasi | Header, footer, `DATASETS.perluasan.note`, dan dokumentasi sumber data. | Inspeksi aplikasi serta `08-docs/data-dan-sumber.md`. | Manual. |
| NFR-06 SVG ringan | `renderMap` membangun elemen SVG langsung tanpa pustaka visualisasi. | Inspeksi implementasi dan tampilan peta. | Manual. |
| NFR-07 Pembatas numerik antarmuka | `renderX` memberi `min` C9 1 dan `max` 5, biaya `min=0`; `renderAHP` memberi `min=0.05`; *handler* AHP mempertahankan minimum 0,05. | Inspeksi elemen input dan perilaku edit. | Manual. |
| NFR-08 Auditabilitas keluaran | `renderResults` menampilkan parameter AHP; `renderTopsis` menampilkan D⁺, D⁻, CC; `renderPhases` menampilkan biaya/subtotal; `renderSens` menampilkan hasil skenario. | `test-algoritma.mjs` memeriksa angka inti. | Otomatis sebagian, inspeksi UI. |

## 4. Keterlacakan kriteria penerimaan

| Kriteria penerimaan | FR/NFR pendukung | Bukti implementasi | Pemeriksaan yang harus lulus |
|---|---|---|---|
| AC-01 Tampilan awal resmi | FR-01, FR-04, FR-05, FR-06 | Inisialisasi dataset resmi dan `render()`. | Buka `index.html`; cek lima alternatif dan keluaran. |
| AC-02 Angka resmi | FR-05, FR-06 | `A0`, `DATASETS.resmi`, `ahp`, `topsis`. | `node 05-aplikasi/test-algoritma.mjs`. |
| AC-03 Edit tanpa kehilangan fokus | FR-03 | *Input handler* dan `renderResults`. | `bash 05-aplikasi/test-ui.sh`. |
| AC-04 C9 kurang dari 3 tidak dialokasikan | FR-07, FR-09 | `C9_MIN`, `feasibleFlags`, renderer hasil/peta/fase. | `node 05-aplikasi/test-algoritma.mjs` dan `bash 05-aplikasi/test-ui.sh`. |
| AC-05 Fase sesuai plafon dan kelayakan | FR-08 | `allocPhases`, `renderTopsis`, `renderMap`, `renderPhases`. | `node 05-aplikasi/test-algoritma.mjs` dan `bash 05-aplikasi/test-ui.sh`. |
| AC-06 Enam belas skenario sensitivitas | FR-10 | `sensitivity`, `renderSens`. | `node 05-aplikasi/test-algoritma.mjs`. |
| AC-07 Perluasan 12 segmen simulasi | FR-02, NFR-05 | `DATASETS.perluasan`, catatan dataset aktif. | `node 05-aplikasi/test-algoritma.mjs`; inspeksi label aplikasi. |
| AC-08 Reset dan ekspor | FR-11, FR-12 | *Handler* `btn-reset`, `btn-export`, dan `dl`. | Inspeksi manual di peramban. |
| AC-09 Test algoritma lulus | NFR-03 | `05-aplikasi/test-algoritma.mjs`. | `node 05-aplikasi/test-algoritma.mjs` berakhir sukses. |

## 5. Gap verifikasi yang tersisa

1. Test algoritma sudah menguji mesin keputusan aktual, paritas CSV, filter C9, fase, dan sensitivitas, tetapi belum mengotomatisasi klik reset maupun pemeriksaan isi berkas unduhan CSV.
2. Label visual dataset simulasi, teks Bahasa Indonesia, atribut input, dan sifat offline perlu tetap diperiksa melalui inspeksi peramban saat antarmuka berubah.
3. Keabsahan empiris data per segmen, termasuk C9 dan RAB, tidak dapat dibuktikan oleh test perangkat lunak. Validasi tersebut membutuhkan survei lapangan sesuai roadmap naskah kanonik.
