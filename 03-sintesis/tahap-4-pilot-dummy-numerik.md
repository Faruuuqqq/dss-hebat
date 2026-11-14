# DOKUMENTASI SIMULASI PILOT NUMERIK ILUSTRATIF AHP-TOPSIS & ALOKASI ANGGARAN

> **STATUS HISTORIS (14 Nov 2026).** Dokumen ini memakai AHP hierarki 3 kluster:
> C1 24,31%, A3 0,6441, sensitivitas berbasis bobot hierarki. **Jangan kutip angka ini untuk luaran final.**
> Sumber kebenaran = `dss_revisi_markdown/dss_revisi.md` (AHP datar 8×8; C1 23,95%; A3 0,6445; PRISMA 582→416→121→12).
> Verifikasi kanonik: `node 05-aplikasi/test-algoritma.mjs`.

Dokumen ini memuat formulasi matematis lengkap, matriks keputusan ilustratif berbasis tipologi spasial gang permukiman mahasiswa Jatinangor, skema AHP hierarki 3 kluster (10 perbandingan berpasangan), rasio konsistensi (CR), perankingan TOPSIS urgensi ($CC_i$), simulasi batasan anggaran bertahap (*phased budget allocation*), dan analisis sensitivitas $\pm 20\%$ (*One-At-A-Time* / OAT).

> [!NOTE]
> Seluruh angka pada dokumen ini berstatus **data simulasi ilustratif prosedural** untuk mendemonstrasikan bahwa alur komputasi model DSS berjalan secara runtut dan matematis dapat dieksekusi sebelum survei pengukuran empiris penuh dilaksanakan di lapangan.

---

## 1. Pemisahan Konseptual: Urgensi Risiko (C1–C8) vs Kelayakan & Biaya (C9 & RAB)

Menanggapi masukan kritis reviewer mengenai percampuran antara atribut urgensi dengan atribut kelayakan/biaya:
- **Kriteria Urgensi Risiko (C1–C8):** Seluruhnya diformulasikan searah terhadap kebutuhan pemasangan (*benefit-oriented toward urgency*). Nilai yang lebih tinggi menandakan lokasi yang lebih mendesak untuk diawasi dan diproses langsung di dalam TOPSIS.
- **Kelayakan Teknis (C9) & Biaya Finansial (RAB):** Dipisahkan dari engine TOPSIS urgensi. Keduanya berfungsi sebagai **filter kelayakan** ($C9 \ge \theta_{\text{min}}$, mis. skor $\ge 3$) dan **kendala anggaran belanja** ($\sum \text{Cost}_i \le B_k$) untuk mengelompokkan alternatif ke dalam tahapan implementasi (*Fase 1, 2, atau 3*).

---

## 2. Definisi Alternatif dan Matriks Keputusan Ilustratif ($5 \times 8$)

### Alternatif Tipologi Spasial Segmen (A1–A5)
1. **A1 (Gang Kos Sayang):** Gang residensial sempit padat indekos mahasiswa, akses lorong buntu, minim penerangan jalan, jarak ke kamera aktif jauh.
2. **A2 (Ruas Jalan Cikeruh Dekat Kampus):** Koridor jalan aktif dekat gerbang kampus, mobilitas malam tinggi, telah terpasang beberapa kamera swasta.
3. **A3 (Persimpangan Hegarmanah):** Simpul jalan multi-cabang (pertemuan 5 akses), sirkulasi pejalan dan motor ramai, konsentrasi titik fasilitas umum (ATM, minimarket, halte).
4. **A4 (Gang Cipacing):** Gang residensial panjang dengan defisiensi PJU parah (gelap gulita malam hari), minim kamera pengawas, namun mobilitas malam relatif lebih rendah.
5. **A5 (Ruas Jalan Cileles):** Ruas penghubung sekunder dengan kepadatan bangunan dan mobilitas malam tingkat moderat.

### Matriks Keputusan Ilustratif $X$ ($5 \times 8$)

| Kode Alternatif | C1 (kej/km/th) | C2 (orang/jam) | C3 (skor 1–5) | C4 ($\text{m}^2$/titik) | C5 (kamar/km) | C6 (cabang) | C7 (meter) | C8 (POI) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **A1 (Gang Kos Sayang)** | 4,2 | 120 | 4 | 380 | 85 | 2 | 450 | 8 |
| **A2 (Ruas Jalan Cikeruh)** | 2,1 | 350 | 2 | 650 | 40 | 3 | 180 | 12 |
| **A3 (Persimpangan Hegarmanah)** | 3,5 | 280 | 3 | 520 | 55 | 5 | 320 | 15 |
| **A4 (Gang Cipacing)** | 3,8 | 80 | 5 | 290 | 60 | 2 | 600 | 4 |
| **A5 (Ruas Jalan Cileles)** | 1,5 | 160 | 3 | 420 | 30 | 2 | 250 | 5 |

*Data Kelayakan Teknis & Biaya Finansial Terpisah:*
- **C9 (Kesiapan Teknis: Tiang/PLN/Sinyal, skor 1–5):** A1 = 4, A2 = 5, A3 = 4, A4 = 3 (butuh tiang baru), A5 = 4. Seluruh alternatif memenuhi ambang kelayakan minimum ($C9 \ge 3$).
- **Estimasi Biaya Pengadaan & Instalasi (RAB, Juta Rp):** A1 = Rp 6,5 Jt; A2 = Rp 5,0 Jt; A3 = Rp 7,5 Jt; A4 = Rp 8,0 Jt; A5 = Rp 5,5 Jt. Asumsi: unit kamera IP outdoor 2–4 MP, bracket/tiang mini, kabel, instalasi daya, dan memori/modem lokal.

---

## 3. Pembobotan AHP Multistakeholder Hierarki 3 Kluster

Untuk mengatasi risiko inkonsistensi rasio ($CR > 0{,}10$) akibat 28 perbandingan berpasangan pada matriks datar $8 \times 8$, diterapkan struktur AHP hierarki 3 kluster (memangkas perbandingan menjadi 10 pasang):
- **Kluster 1 ($K_1$ - Risiko):** C1 (Riwayat Kerawanan) dan C3 (Defisiensi PJU).
- **Kluster 2 ($K_2$ - Paparan Aktivitas):** C2 (Mobilitas Malam), C5 (Kepadatan Kos), dan C8 (Fasilitas Rentan).
- **Kluster 3 ($K_3$ - Spasial):** C4 (Efisiensi Coverage), C6 (Derajat Simpul), dan C7 (Coverage Gap CCTV).

### Level 1: Matriks Perbandingan Berpasangan Antar-Kluster ($3 \times 3$, $\text{RI} = 0{,}58$)

| Kluster | $K_1$ (Risiko) | $K_2$ (Paparan) | $K_3$ (Spasial) | Bobot Kluster ($W_k$) |
|---|:---:|:---:|:---:|:---:|
| **$K_1$ (Risiko)** | 1,0000 | 1,0000 | 1,7500 | **0,3889 (38,89%)** |
| **$K_2$ (Paparan)** | 1,0000 | 1,0000 | 1,7500 | **0,3889 (38,89%)** |
| **$K_3$ (Spasial)** | 0,5714 | 0,5714 | 1,0000 | **0,2222 (22,22%)** |

- $\lambda_{\max} = 3{,}0000$, $\text{CI} = 0{,}0000$, $\text{CR} = \mathbf{0{,}0000} < 0{,}10$ **(Konsisten Sempurna)**.

### Level 2: Matriks Perbandingan Lokal Sub-Kluster

1. **Sub-Kluster $K_1$ (Risiko: C1, C3; $2 \times 2$, $\text{RI} = 0$):**
   - Perbandingan C1 terhadap C3 = $1{,}6667$ ($5/3$).
   - Bobot lokal: $w_{\text{C1}|K_1} = 0{,}6250$, $w_{\text{C3}|K_1} = 0{,}3750$. $\text{CR} = 0{,}0000$.
2. **Sub-Kluster $K_2$ (Paparan: C2, C5, C8; $3 \times 3$, $\text{RI} = 0{,}58$):**
   - C2 vs C5 = $1{,}1500$, C2 vs C8 = $1{,}1500$, C5 vs C8 = $1{,}0000$.
   - Bobot lokal: $w_{\text{C2}|K_2} = 0{,}3651$, $w_{\text{C5}|K_2} = 0{,}3175$, $w_{\text{C8}|K_2} = 0{,}3175$. $\text{CR} = 0{,}0000$.
3. **Sub-Kluster $K_3$ (Spasial: C4, C6, C7; $3 \times 3$, $\text{RI} = 0{,}58$):**
   - C7 vs C4 = $1{,}2500$, C7 vs C6 = $1{,}9000$, C4 vs C6 = $1{,}5000$.
   - Bobot lokal: $w_{\text{C4}|K_3} = 0{,}3426$, $w_{\text{C6}|K_3} = 0{,}2274$, $w_{\text{C7}|K_3} = 0{,}4301$. $\text{CR} = 0{,}0000$.

### Komputasi Bobot Global Urgensi ($w_j = W_k \times w_{j|k}$)

- **$w_{\text{C1}}$ (Riwayat Kerawanan):** $0{,}3889 \times 0{,}6250 = \mathbf{0{,}2431\ (24{,}31\%)}$
- **$w_{\text{C3}}$ (Defisiensi Penerangan):** $0{,}3889 \times 0{,}3750 = \mathbf{0{,}1458\ (14{,}58\%)}$
- **$w_{\text{C2}}$ (Volume Mobilitas Malam):** $0{,}3889 \times 0{,}3651 = \mathbf{0{,}1420\ (14{,}20\%)}$
- **$w_{\text{C5}}$ (Kepadatan Kos):** $0{,}3889 \times 0{,}3175 = \mathbf{0{,}1235\ (12{,}35\%)}$
- **$w_{\text{C8}}$ (Fasilitas Rentan POI):** $0{,}3889 \times 0{,}3175 = \mathbf{0{,}1235\ (12{,}35\%)}$
- **$w_{\text{C7}}$ (Coverage Gap CCTV):** $0{,}2222 \times 0{,}4301 = \mathbf{0{,}0956\ (9{,}56\%)}$
- **$w_{\text{C4}}$ (Efisiensi Coverage):** $0{,}2222 \times 0{,}3426 = \mathbf{0{,}0761\ (7{,}61\%)}$
- **$w_{\text{C6}}$ (Derajat Simpul Jalan):** $0{,}2222 \times 0{,}2274 = \mathbf{0{,}0505\ (5{,}05\%)}$
- **Total Bobot:** $\sum w_j = 1{,}0000\ (100\%)$.

---

## 4. Perankingan Menggunakan TOPSIS

### Langkah 1: Normalisasi Vektor Euclidean ($R = [r_{ij}]$)
$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}$$
Pembagi normalisasi:
- C1: 7,2498 | C2: 494,2671 | C3: 7,8102 | C4: 1047,9981 | C5: 133,3229 | C6: 7,1414 | C7: 890,7862 | C8: 21,7715

### Langkah 2: Matriks Ternormalisasi Terbobot ($V = [v_{ij}] = w_j \cdot r_{ij}$)
Solusi Ideal Positif ($A^+$) dan Negatif ($A^-$):
- $A^+ = [0{,}1409; \ 0{,}1006; \ 0{,}0934; \ 0{,}0472; \ 0{,}0787; \ 0{,}0353; \ 0{,}0644; \ 0{,}0851]$
- $A^- = [0{,}0503; \ 0{,}0230; \ 0{,}0373; \ 0{,}0210; \ 0{,}0278; \ 0{,}0141; \ 0{,}0193; \ 0{,}0227]$

### Langkah 3: Jarak Euclidean & Closeness Score ($CC_i$)
$$D_i^+ = \sqrt{\sum (v_{ij} - v_j^+)^2}, \quad D_i^- = \sqrt{\sum (v_{ij} - v_j^-)^2}, \quad CC_i = \frac{D_i^-}{D_i^+ + D_i^-}$$

| Alternatif | Jarak Ideal Positif ($D_i^+$) | Jarak Ideal Negatif ($D_i^-$) | Closeness Score ($CC_i$) | Peringkat Urgensi |
|---|:---:|:---:|:---:|:---:|
| **A3 (Persimpangan Hegarmanah)** | **0,0647** | **0,1171** | **0,6441** | **#1 (Tertinggi)** |
| **A1 (Gang Kos Sayang)** | **0,0859** | **0,1191** | **0,5809** | **#2** |
| **A4 (Gang Cipacing)** | **0,1086** | **0,1101** | **0,5036** | **#3** |
| **A2 (Ruas Jalan Cikeruh)** | **0,1125** | **0,0962** | **0,4608** | **#4** |
| **A5 (Ruas Jalan Cileles)** | **0,1450** | **0,0322** | **0,1819** | **#5** |

---

## 5. Mekanisme Alokasi Bertahap di Bawah Kendala Anggaran Belanja

Simulasi batas alokasi anggaran belanja pengadaan fasilitas CCTV per tahun anggaran ditetapkan sebesar **Rp 15.000.000,-**:

| Peringkat | Alternatif | Closeness ($CC_i$) | Biaya (Juta Rp) | Biaya Kumulatif | Tahap Alokasi Anggaran | Rasio Urgensi/Biaya ($CC_i / \text{Biaya}$) |
|:---:|---|:---:|:---:|:---:|---|:---:|
| **#1** | A3 (Simpul Hegarmanah) | 0,6441 | Rp 7,5 Jt | Rp 7,5 Jt | **Fase 1 (Segera / Tahun 1)** | 0,0859 |
| **#2** | A1 (Gang Kos Sayang) | 0,5809 | Rp 6,5 Jt | Rp 14,0 Jt | **Fase 1 (Segera / Tahun 1)** | 0,0894 |
| **#3** | A4 (Gang Cipacing) | 0,5036 | Rp 8,0 Jt | Rp 22,0 Jt | **Fase 2 (Menengah / Tahun 2)** | 0,0630 |
| **#4** | A2 (Ruas Jalan Cikeruh) | 0,4608 | Rp 5,0 Jt | Rp 27,0 Jt | **Fase 2 (Menengah / Tahun 2)** | **0,0922 (Efisiensi Tertinggi)** |
| **#5** | A5 (Ruas Jalan Cileles) | 0,1819 | Rp 5,5 Jt | Rp 32,5 Jt | **Fase 3 (Berkala / Tahun 3)** | 0,0331 |

> **Catatan Alokasi Keputusan:**
> - Alternatif **A3 dan A1** didanai penuh pada **Fase 1** (Total Rp 14,0 Jt $\le$ Plafon Rp 15,0 Jt).
> - Alternatif **A4 dan A2** dialokasikan pada **Fase 2** (Total Rp 13,0 Jt $\le$ Plafon Rp 15,0 Jt).
> - Alternatif **A2** memiliki rasio efisiensi biaya tertinggi ($0{,}0922$) karena infrastruktur tiang dan listrik eksisting telah siap sempurna ($C9 = 5$).

---

## 6. Analisis Sensitivitas Bobot $\pm 20\%$ (One-At-A-Time / OAT)

Tabel berikut menunjukkan hasil pengujian variasi bobot $\pm 20\%$ pada masing-masing dari 8 kriteria dengan renormalisasi proporsional pada 7 kriteria lainnya:

| Kriteria | Variasi | $CC_{\text{A1}}$ | $CC_{\text{A2}}$ | $CC_{\text{A3}}$ | $CC_{\text{A4}}$ | $CC_{\text{A5}}$ | Susunan Peringkat Lengkap |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **C1** | +20% | 0,6199 | 0,4358 | 0,6570 | 0,5375 | 0,1654 | A3 > A1 > A4 > A2 > A5 |
| **C1** | -20% | 0,5440 | 0,4823 | 0,6328 | 0,4734 | 0,1966 | A3 > A1 > A2 > A4 > A5 *(Sensitivitas A4/A2)* |
| **C2** | +20% | 0,5478 | 0,4979 | 0,6522 | 0,4735 | 0,1947 | A3 > A1 > A2 > A4 > A5 *(Sensitivitas A4/A2)* |
| **C2** | -20% | 0,6125 | 0,4241 | 0,6371 | 0,5317 | 0,1698 | A3 > A1 > A4 > A2 > A5 |
| **C3** | +20% | 0,5841 | 0,4456 | 0,6270 | 0,5195 | 0,1916 | A3 > A1 > A4 > A2 > A5 |
| **C3** | -20% | 0,5784 | 0,4734 | 0,6587 | 0,4903 | 0,1736 | A3 > A1 > A4 > A2 > A5 |
| **C4** | +20% | 0,5780 | 0,4652 | 0,6441 | 0,5001 | 0,1845 | A3 > A1 > A4 > A2 > A5 |
| **C4** | -20% | 0,5832 | 0,4572 | 0,6442 | 0,5064 | 0,1798 | A3 > A1 > A4 > A2 > A5 |
| **C5** | +20% | 0,5930 | 0,4521 | 0,6351 | 0,5048 | 0,1769 | A3 > A1 > A4 > A2 > A5 |
| **C5** | -20% | 0,5709 | 0,4678 | 0,6516 | 0,5026 | 0,1860 | A3 > A1 > A4 > A2 > A5 |
| **C6** | +20% | 0,5771 | 0,4601 | 0,6461 | 0,5011 | 0,1811 | A3 > A1 > A4 > A2 > A5 |
| **C6** | -20% | 0,5840 | 0,4613 | 0,6426 | 0,5056 | 0,1826 | A3 > A1 > A4 > A2 > A5 |
| **C7** | +20% | 0,5824 | 0,4508 | 0,6327 | 0,5141 | 0,1814 | A3 > A1 > A4 > A2 > A5 |
| **C7** | -20% | 0,5797 | 0,4691 | 0,6537 | 0,4948 | 0,1823 | A3 > A1 > A4 > A2 > A5 |
| **C8** | +20% | 0,5703 | 0,4730 | 0,6599 | 0,4836 | 0,1774 | A3 > A1 > A4 > A2 > A5 |
| **C8** | -20% | 0,5899 | 0,4505 | 0,6304 | 0,5210 | 0,1857 | A3 > A1 > A4 > A2 > A5 |

### Analisis Ketahanan Peringkat:
1. **Prioritas Utama (Peringkat 1 & 2):** Alternatif **A3 (Persimpangan Hegarmanah)** dan **A1 (Gang Kos Sayang)** mempertahankan posisi secara kokoh pada seluruh 16 pengujian variasi bobot tanpa pernah mengalami pembalikan peringkat (*no rank reversal*).
2. **Kelompok Prioritas Menengah (Peringkat 3 & 4):** Alternatif **A4 dan A2** memiliki selisih nilai kedekatan yang relatif dekat ($0{,}5036$ vs $0{,}4608$), sehingga terjadi pertukaran peringkat pada skenario penurunan bobot C1 ($-20\%$) dan peningkatan bobot C2 ($+20\%$). Temuan ini memberikan justifikasi metodologis yang kuat bagi pengambil keputusan untuk menempatkan A4 dan A2 bersama-sama pada kelompok **Fase 2**.
