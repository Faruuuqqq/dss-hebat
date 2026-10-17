# MATRIKS PEMETAAN STUDI × KRITERIA (SINGLE SOURCE OF TRUTH)

Dokumen ini menjadi **rujukan tunggal mutlak** (*single source of truth*) yang menyelaraskan seluruh tabel di naskah (*Tabel III Ekstraksi Data Charting* dan *Tabel VIII Matriks Kriteria C1–C9*) beserta file CSV terkait (`data-charting-12.csv`).

---

## 1. Matriks Sebaran 12 Studi Primer × Kriteria Keselamatan (C1–C9)

| No | Studi (IEEE Ref) | C1 (Kerawanan) | C2 (Mobilitas) | C3 (Penerangan) | C4 (Coverage) | C5 (Kepadatan) | C6 (Simpul) | C7 (Gap CCTV) | C8 (POI Rentan) | C9 (Kelayakan/Biaya) | Ringkasan Bukti & Alasan Pemetaan |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **1** | Wang et al. 2025 \cite{wang2025} | - | - | - | ✓ | - | ✓ | ✓ | - | ✓ | Optimasi penempatan kamera pengawas berbasis graf jalan: cakupan jalan penuh (**C4**), bobot persimpangan/derajat simpul (**C6**), pengisian blind spot / gap kamera (**C7**), reduksi jumlah tiang dan biaya alat (**C9**). |
| **2** | González-Villa et al. 2024 \cite{gonzalez2024} | - | - | - | - | - | - | - | - | - | DSS simulasi ancaman terorisme & evakuasi perkotaan (S4AllCities). Tidak menyumbang kriteria langsung; dijadikan pembanding pola arsitektur simulasi yang ditolak karena butuh kalibrasi mahal. |
| **3** | Feizizadeh & Omarzadeh 2025 \cite{feizizadeh2025} | ✓ | ✓ | - | - | ✓ | - | - | ✓ | - | Pemetaan risiko spasial-temporal pesepeda di Berlin: riwayat kerawanan rute (**C1**), volume lalu lintas pejalan & pesepeda (**C2**), faktor sosiodemografi hunian (**C5**), korelasi guna lahan sekolah/universitas/komersial (**C8**). |
| **4** | Ahmed et al. 2022 \cite{ahmed2022} | - | - | - | - | - | - | - | ✓ | ✓ | Pembobotan AHP multistakeholder di kawasan pendidikan tinggi: konsensus keamanan kampus & fasilitas penunjang (**C8**), evaluasi kelayakan investasi transformasi kampus (**C9**). |
| **5** | Choi et al. 2025 \cite{choi2025} | - | - | - | - | ✓ | - | - | ✓ | - | MCDM prioritas teknologi smart safety pada kawasan hunian padat bertingkat (apartemen) Korea Selatan: analog kepadatan hunian indekos (**C5**), fasilitas penunjang perumahan (**C8**). |
| **6** | Kanj et al. 2024 \cite{kanj2024} | ✓ | - | - | - | - | - | - | - | ✓ | Penentuan rute transportasi berisiko smart city via Fuzzy AHP & Fuzzy TOPSIS: faktor risiko bahaya insiden (**C1**), faktor biaya perjalanan & operasional (**C9**). Template rujukan utama AHP-TOPSIS. |
| **7** | Kabashkin et al. 2025 \cite{kabashkin2025} | - | ✓ | - | - | - | - | - | - | - | Sensing multi-titik UAV di 30 titik kritis perkotaan Astana: pemantauan sinkron volume mobilitas, kepadatan arus (*flow*), dan tundaan pada jam-jam sibuk (**C2**). |
| **8** | Baddour et al. 2026 \cite{baddour2026} | ✓ | - | ✓ | - | - | - | - | ✓ | ✓ | Perencanaan kawasan perkotaan diplomatik: kriteria keamanan (*security*) (**C1**), infrastruktur fisik termasuk sub-faktor penerangan jalan/lighting (**C3**), fasilitas publik & aksesibilitas (**C8**), biaya implementasi infrastruktur (**C9**). |
| **9** | Almassawa et al. 2024 \cite{almassawa2024} | ✓ | ✓ | - | - | - | - | - | - | - | Kebijakan transportasi & keselamatan smart mobility di Tangerang Selatan: persepsi rasa aman publik (**C1**), volume pergerakan pengguna mobilitas malam (**C2**). Konteks negara berkembang. |
| **10** | Shiddiqy et al. 2025 \cite{shiddiqy2025} | - | - | - | ✓ | - | - | ✓ | - | - | Arsitektur pertahanan cerdas IKN Nusantara via SWOT-AHP: prioritas tinggi pada kapabilitas surveilans C4ISR (**C4**), penutupan celah pengawasan / gap perimeter keamanan (**C7**). |
| **11** | Zheng et al. 2025 \cite{zheng2025} | - | - | ✓ | - | - | - | - | - | ✓ | Pemodelan risiko komunitas padat Tangxia via DEMATEL-ISM & Bayesian Network: defisiensi infrastruktur fisik lingkungan / penerangan jalan (**C3**), kelayakan renovasi fisik terukur (**C9**). |
| **12** | Yuhang et al. 2025 \cite{yuhang2025} | - | - | - | ✓ | ✓ | - | ✓ | - | ✓ | Optimasi sebaran sensor pada infrastruktur perkotaan Guangzhou (BCSLP + EWM): jangkauan sensor primer (**C4**), bobot objektif kepadatan penduduk (**C5**), redundansi/penutupan celah sensor (**C7**), kendala biaya sensor (**C9**). |
| **Total** | **12 Studi** | **4** | **3** | **2** | **3** | **3** | **1** | **3** | **4** | **6** | *Delapan dari sembilan kriteria didukung $\ge 2$ studi; hanya C6 bersumber tunggal.* |

---

## 2. Rekonsiliasi Rujukan Studi per Kriteria

| Kode | Kriteria | Jumlah Studi | Daftar Studi Pendukung (Nomor Baris Tabel III / Ref IEEE) | Catatan Validasi |
|:---:|---|:---:|---|---|
| **C1** | Riwayat kerawanan segmen | **4** | Feizizadeh [3], Kanj [6], Baddour [8], Almassawa [9] | Selaras 100% antara Tabel III dan Tabel VIII. |
| **C2** | Volume mobilitas malam | **3** | Feizizadeh [3], Kabashkin [7], Almassawa [9] | Selaras 100% antara Tabel III dan Tabel VIII. |
| **C3** | Defisiensi penerangan | **2** | Baddour [8], Zheng [11] | Baddour memuat sub-faktor infrastruktur penerangan jalan (*lighting*); Zheng memuat defisiensi infrastruktur lingkungan. |
| **C4** | Efisiensi cakupan (*coverage*) | **3** | Wang [1], Shiddiqy [10], Yuhang [12] | Wang & Yuhang memodelkan jangkauan geometris; Shiddiqy melegitimasi bobot tinggi surveilans C4ISR. |
| **C5** | Kepadatan penghuni | **3** | Feizizadeh [3], Choi [5], Yuhang [12] | Feizizadeh memetakan densitas demografi; Choi apartemen padat; Yuhang bobot objektif kepadatan EWM. |
| **C6** | Derajat simpul jalan | **1** | Wang [1] | Bersumber tunggal dari model Minimum Weighted Vertex Cover. Dicatat secara jujur apa adanya. |
| **C7** | Gap CCTV eksisting | **3** | Wang [1], Shiddiqy [10], Yuhang [12] | Selaras dengan optimasi titik henti blind spot dan backup sensor. |
| **C8** | Kedekatan fasilitas rentan | **4** | Feizizadeh [3], Ahmed [4], Choi [5], Baddour [8] | POI pendidikan, hunian, fasilitas diplomatik/publik komersial. |
| **C9** | Kelayakan teknis & biaya | **6** | Wang [1], Ahmed [4], Kanj [6], Baddour [8], Zheng [11], Yuhang [12] | Seluruh studi yang mempertimbangkan batasan tiang/biaya/kelayakan investasi infrastruktur. |

---

## 3. Implikasi pada Teks Naskah Paper

1. **Klaim "8 dari 9 kriteria didukung minimal 2 studi":** Tetap valid dan terbukti kokoh karena C3 didukung oleh 2 studi ([8] dan [11]).
2. **Kriteria C9:** Muncul pada 6 studi di Tabel III, dan diakui secara eksplisit pada Tabel VIII sebagai kriteria kendala kelayakan/biaya.
3. **Pemisahan Urgensi vs Biaya:** C1–C8 masuk ke engine perankingan urgensi TOPSIS, sedangkan C9 dan estimasi anggaran menjadi penentu tahapan pemasangan (*phasing*).
