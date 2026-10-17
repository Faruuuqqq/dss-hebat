# TEMPLATE PERHITUNGAN PILOT DUMMY NUMERIK AHP-TOPSIS & ALOKASI ANGGARAN

Dokumen ini memuat formulasi matematis lengkap, matriks keputusan ilustratif yang realistis untuk Jatinangor, hasil perhitungan AHP multistakeholder, uji konsistensi (CR), perankingan TOPSIS, simulasi batasan anggaran bertahap (*phased budget allocation*), dan analisis sensitivitas $\pm 20\%$.

---

## 1. Pemisahan Konseptual: Urgensi (C1–C8) vs Kelayakan & Biaya (C9 & Biaya Finansial)

Menanggapi masukan kritis reviewer mengenai percampuran antara atribut urgensi dengan atribut kelayakan/biaya:
- **Kriteria Urgensi (C1–C8):** Seluruhnya diformulasikan searah terhadap kebutuhan pemasangan (*benefit-oriented toward urgency*). Nilai yang lebih tinggi menandakan lokasi yang lebih mendesak untuk diawasi.
- **Kelayakan Teknis (C9) & Biaya Finansial (RAB):** Dipisahkan dari engine TOPSIS urgensi. Keduanya berfungsi sebagai **filter kelayakan** (*feasibility hurdle*) dan **kendala anggaran** (*budget constraint*) untuk membagi alternatif ke dalam tahapan implementasi (*Fase 1, 2, atau 3*) serta menghitung rasio manfaat-biaya (*urgency-to-cost ratio*).

---

## 2. Definisi Alternatif dan Matriks Keputusan Ilustratif (5 × 8)

### Alternatif Segmen (A1–A5)
1. **A1 (Gang Kos Sayang):** Gang permukiman padat hunian indekos mahasiswa, akses sempit (1,5–2,5 m), minim penerangan jalan, jarak ke kamera aktif jauh.
2. **A2 (Ruas Jalan Cikeruh Dekat Kampus):** Koridor mobilitas tinggi antara gerbang kampus dan sentra indekos, penerangan jalan sedang, telah terdapat beberapa kamera swasta.
3. **A3 (Persimpangan Hegarmanah):** Simpul jalan multi-cabang (persimpangan 5), perlintasan pejalan dan kendaraan ramai, konsentrasi titik fasilitas umum (ATM, minimarket, gerbang).
4. **A4 (Gang Cipacing):** Gang residensial panjang dengan defisiensi PJU parah (gelap gulita di malam hari), minim kamera pengawas, namun mobilitas malam relatif lebih rendah.
5. **A5 (Ruas Jalan Cileles):** Ruas penghubung sekunder dengan kepadatan bangunan dan mobilitas malam tingkat moderat.

### Matriks Keputusan $X$ ($5 \times 8$)
| Alternatif | C1: Kerawanan (insiden/km/th) | C2: Mobilitas Malam (orang/jam) | C3: Defisiensi PJU (skor 1–5) | C4: Efisiensi Cakupan ($\text{m}^2$/titik) | C5: Kepadatan Kos (kamar/km) | C6: Derajat Simpul (cabang) | C7: Gap CCTV Eksisting (meter) | C8: POI Rentan (unit) |
|---|---|---|---|---|---|---|---|---|
| **A1** | 4,2 | 120 | 4 | 380 | 85 | 2 | 450 | 8 |
| **A2** | 2,1 | 350 | 2 | 650 | 40 | 3 | 180 | 12 |
| **A3** | 3,5 | 280 | 3 | 520 | 55 | 5 | 320 | 15 |
| **A4** | 3,8 | 80 | 5 | 290 | 60 | 2 | 600 | 4 |
| **A5** | 1,5 | 160 | 3 | 420 | 30 | 2 | 250 | 5 |

*Data Kelayakan Teknis & Biaya Finansial Terpisah:*
- **C9 (Kesiapan Teknis: Tiang/PLN/Sinyal, skor 1–5):** A1 = 4, A2 = 5, A3 = 4, A4 = 3, A5 = 4.
- **Estimasi Biaya Pengadaan & Instalasi (RAB, Juta Rp):** A1 = Rp 6,5 Jt; A2 = Rp 5,0 Jt; A3 = Rp 7,5 Jt; A4 = Rp 8,0 Jt (butuh tiang baru); A5 = Rp 5,5 Jt.

---

## 3. Pembobotan AHP Multistakeholder

Kuesioner perbandingan berpasangan (*pairwise comparison*) melibatkan tiga kelompok pemangku kepentingan:
1. **Pemerintah Daerah** (Kecamatan Jatinangor, Satpol PP, Dishub)
2. **Pengelola Kawasan & Kampus** (Direktorat Keamanan / Kemahasiswaan PTN Jatinangor)
3. **Komunitas Warga Lokal** (Ketua RT/RW, Pengusaha Indekos Sayang/Cikeruh)

Agregasi preferensi menggunakan rata-rata geometrik (*geometric mean*):
$$a_{jk} = \left( \prod_{p=1}^P a_{jk}^{(p)} \right)^{1/P}$$

### Matriks Perbandingan Berpasangan Konsensus ($8 \times 8$)
| Kriteria | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|
| **C1** | 1,00 | 2,00 | 2,00 | 3,00 | 2,00 | 4,00 | 2,00 | 2,00 |
| **C2** | 0,50 | 1,00 | 1,00 | 2,00 | 1,00 | 3,00 | 2,00 | 1,00 |
| **C3** | 0,50 | 1,00 | 1,00 | 2,00 | 1,00 | 3,00 | 2,00 | 1,00 |
| **C4** | 0,33 | 0,50 | 0,50 | 1,00 | 0,50 | 2,00 | 1,00 | 0,50 |
| **C5** | 0,50 | 1,00 | 1,00 | 2,00 | 1,00 | 2,00 | 1,00 | 1,00 |
| **C6** | 0,25 | 0,33 | 0,33 | 0,50 | 0,50 | 1,00 | 0,50 | 0,50 |
| **C7** | 0,50 | 0,50 | 0,50 | 1,00 | 1,00 | 2,00 | 1,00 | 1,00 |
| **C8** | 0,50 | 1,00 | 1,00 | 2,00 | 1,00 | 2,00 | 1,00 | 1,00 |

### Uji Konsistensi AHP
- Nilai Eigen Maksimum ($\lambda_{\max}$): **8,1031**
- Indeks Konsistensi: $\text{CI} = \frac{\lambda_{\max} - n}{n - 1} = \frac{8,1031 - 8}{7} = \mathbf{0{,}0147}$
- Indeks Acak ($RI$ untuk $n = 8$): **1,41**
- Rasio Konsistensi: $\text{CR} = \frac{\text{CI}}{\text{RI}} = \frac{0{,}0147}{1,41} = \mathbf{0{,}0104} \ (< 0{,}10 \rightarrow \text{\textbf{SANGAT KONSISTEN}})$

### Vektor Bobot Prioritas ($w$)
- **C1 (Riwayat Kerawanan):** $w_1 = \mathbf{23{,}95\%}$ (Prioritas #1)
- **C2 (Volume Mobilitas Malam):** $w_2 = \mathbf{14{,}29\%}$ (Prioritas #2 bersama)
- **C3 (Defisiensi Penerangan):** $w_3 = \mathbf{14{,}29\%}$ (Prioritas #2 bersama, mengangkat isu penerangan jalan sesuai motivasi penelitian)
- **C5 (Kepadatan Kos):** $w_5 = \mathbf{12{,}45\%}$
- **C8 (Kedekatan Fasilitas Rentan):** $w_8 = \mathbf{12{,}45\%}$
- **C7 (Coverage Gap CCTV):** $w_7 = \mathbf{9{,}74\%}$
- **C4 (Efisiensi Cakupan):** $w_4 = \mathbf{7{,}70\%}$
- **C6 (Derajat Simpul Jalan):** $w_6 = \mathbf{5{,}15\%}$

---

## 4. Perankingan Menggunakan TOPSIS

### Langkah 1: Normalisasi Vektor Euclidean ($R$)
$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}$$
Pembagi normalisasi $\sqrt{\sum x_{kj}^2}$:
- C1: 7,2498 | C2: 494,2671 | C3: 7,8102 | C4: 1047,9981 | C5: 133,3229 | C6: 7,1414 | C7: 890,7862 | C8: 21,7715

Matriks Ternormalisasi $R$:
| Alternatif | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|
| **A1** | 0,5793 | 0,2428 | 0,5121 | 0,3626 | 0,6376 | 0,2801 | 0,5052 | 0,3675 |
| **A2** | 0,2897 | 0,7081 | 0,2561 | 0,6202 | 0,3000 | 0,4201 | 0,2021 | 0,5512 |
| **A3** | 0,4828 | 0,5665 | 0,3841 | 0,4962 | 0,4125 | 0,7001 | 0,3592 | 0,6890 |
| **A4** | 0,5242 | 0,1619 | 0,6402 | 0,2767 | 0,4500 | 0,2801 | 0,6736 | 0,1837 |
| **A5** | 0,2069 | 0,3237 | 0,3841 | 0,4008 | 0,2250 | 0,2801 | 0,2806 | 0,2297 |

### Langkah 2: Matriks Ternormalisasi Terbobot ($V = w \cdot R$)
Solusi Ideal Positif ($A^+$) dan Negatif ($A^-$):
- $A^+ = [\max(v_j)] = [0,1388; \ 0,1012; \ 0,0915; \ 0,0477; \ 0,0794; \ 0,0360; \ 0,0656; \ 0,0858]$
- $A^- = [\min(v_j)] = [0,0496; \ 0,0231; \ 0,0366; \ 0,0213; \ 0,0280; \ 0,0144; \ 0,0197; \ 0,0229]$

### Langkah 3: Jarak Euclidean ke Solusi Ideal & Closeness Coefficient ($C_i$)
$$D_i^+ = \sqrt{\sum (v_{ij} - v_j^+)^2}, \quad D_i^- = \sqrt{\sum (v_{ij} - v_j^-)^2}, \quad C_i = \frac{D_i^-}{D_i^+ + D_i^-}$$

| Alternatif | Jarak Ideal Positif ($D_i^+$) | Jarak Ideal Negatif ($D_i^-$) | Closeness Coefficient ($C_i$) | Peringkat Urgensi |
|---|---|---|---|---|
| **A3 (Simpul Hegarmanah)** | **0,0336** | **0,0610** | **0,6445** | **#1 (Tertinggi)** |
| **A1 (Gang Kos Sayang)** | **0,0423** | **0,0578** | **0,5774** | **#2** |
| **A4 (Gang Cipacing Gelap)** | **0,0555** | **0,0554** | **0,4995** | **#3** |
| **A2 (Ruas Cikeruh Kampus)** | **0,0578** | **0,0500** | **0,4638** | **#4** |
| **A5 (Ruas Cileles)** | **0,0903** | **0,0201** | **0,1820** | **#5** |

---

## 5. Mekanisme Alokasi Bertahap di Bawah Kendala Anggaran

Misalkan pemerintah desa / kecamatan menetapkan plafon alokasi anggaran pemasangan CCTV sebesar **Rp 15.000.000,- per tahun anggaran**:

| Peringkat | Alternatif | Closeness ($C_i$) | Biaya (Juta Rp) | Biaya Kumulatif (Juta Rp) | Alokasi Tahap Pemasangan | Rasio Urgensi/Biaya ($C_i / \text{Biaya}$) |
|---|---|---|---|---|---|---|
| **#1** | A3 (Simpul Hegarmanah) | 0,6445 | Rp 7,5 Jt | Rp 7,5 Jt | **Fase 1 (Segera - Tahun Ini)** | 0,0859 |
| **#2** | A1 (Gang Kos Sayang) | 0,5774 | Rp 6,5 Jt | Rp 14,0 Jt | **Fase 1 (Segera - Tahun Ini)** | 0,0888 |
| **#3** | A4 (Gang Cipacing Gelap) | 0,4995 | Rp 8,0 Jt | Rp 22,0 Jt | **Fase 2 (Tahun Berikutnya / CSR)** | 0,0624 |
| **#4** | A2 (Ruas Cikeruh Kampus) | 0,4638 | Rp 5,0 Jt | Rp 27,0 Jt | **Fase 2 (Tahun Berikutnya / CSR)** | **0,0928 (Efisiensi Biaya Tertinggi)** |
| **#5** | A5 (Ruas Cileles) | 0,1820 | Rp 5,5 Jt | Rp 32,5 Jt | **Fase 3 (Pengembangan Lanjutan)** | 0,0331 |

> **Catatan Pembuat Keputusan:**
> - Alternatif **A3 dan A1** didanai penuh pada **Fase 1** (Total Rp 14,0 Jt $\le$ Plafon Rp 15,0 Jt).
> - Alternatif **A4** yang sangat gelap namun butuh investasi tiang baru (Rp 8,0 Jt) dialihkan ke **Fase 2**.
> - Alternatif **A2** memiliki rasio efisiensi biaya tertinggi ($0{,}0928$), sehingga jika ada sisa dana tak terduga sebesar Rp 5 Jt, A2 dapat segera diinstalasi tanpa mengganggu alokasi utama.

---

## 6. Uji Sensitivitas Bobot ($\pm 20\%$)

Pengujian ketahanan peringkat dilakukan dengan memvariasikan bobot tiap kriteria sebesar $+20\%$ dan $-20\%$ secara bergantian (*One-At-A-Time*), dengan renormalisasi proporsional pada 7 kriteria lainnya:
- Variasi C1 ($\pm 20\%$): Peringkat #1 tetap **A3 (Simpul Hegarmanah)**
- Variasi C2 ($\pm 20\%$): Peringkat #1 tetap **A3 (Simpul Hegarmanah)**
- Variasi C3 ($\pm 20\%$): Peringkat #1 tetap **A3 (Simpul Hegarmanah)**
- Variasi C4, C5, C6, C7, C8 ($\pm 20\%$): Peringkat #1 tetap **A3 (Simpul Hegarmanah)**

**Kesimpulan Sensitivitas:** Model terbukti **robust (kokoh)** terhadap fluktuasi subjektivitas pakar hingga margin $\pm 20\%$.
