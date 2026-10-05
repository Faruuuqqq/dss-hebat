# Template Prompt Gemini (seragam untuk 12 paper inti)

Salin prompt di bawah ke Gemini, lampirkan 1 PDF, ulangi per paper. Output-nya langsung menjadi baris charting + bahan sintesis.

---

```
Konteks: Saya menyusun scoping review (PRISMA-ScR) tentang Decision Support System
untuk prioritisasi penempatan CCTV di permukiman mahasiswa Jatinangor, Indonesia.
Fokus: arsitektur DSS (input-engine-output), metode MCDM + kriteria benefit/cost,
dan transferability ke gang permukiman padat dengan budget terbatas.

Dari PDF terlampir, ekstrak TEPAT 7 hal berikut dalam Bahasa Indonesia:

1. MAIN PROBLEM: masalah keputusan apa yang diselesaikan (1-2 kalimat)?
2. DOMAIN & KONTEKS: sub-domain safety + negara/kota studi + ciri permukimannya?
3. KOMPONEN DSS: apa INPUT (data), ENGINE (modul analisis), OUTPUT (keputusan) nya?
4. METODE: metode MCDM/optimasi/simulasi apa, perannya apa (pembobotan vs perankingan)?
5. KRITERIA: daftar semua kriteria + arahnya (makin tinggi = makin prioritas ATAU sebaliknya)?
6. INSIGHT IMPLEMENTASI: apa yang konkret bisa ditiru (teknologi, alur kerja, aktor, biaya)?
7. ADAPTASI JATINANGOR: jika diterapkan di gang kos Jatinangor (data minim, budget kecil),
   apa yang langsung pakai, apa yang perlu proxy/fallback, apa yang mustahil?
   Jawab dalam format: PAKAI / ADAPTASI-DENGAN-[cara] / TOLAK-[alasan].

Akhiri dengan satu baris: RELEVANSI: [Inti/Cadangan/Gugur] karena [satu alasan].
```

---

# Panduan Baca per Anggota (12 paper inti)

Cara pakai: baca PDF → jalankan prompt di atas → tempel output ke chat/file anggota → koordinator (A1) memindahkan intisari ke `data-charting-12.csv` dan mengisi Keputusan di `eligibility-12.csv`.

| Anggota | Paper | Fokus verifikasi |
|---|---|---|
| A1 (koordinator) | #39 Wang (kamera jalan), #45 S4AllCities | Bobot vertex + angka efisiensi; modul input-engine-output + kebutuhan kalibrasi |
| A2 | #31 GIS Berlin, #46 UAV Astana, #11 DEMATEL banjir | Variabel spasial + korelasi guna lahan; 30 titik + 6 skenario; struktur DEMATEL-ISM |
| A3 | #37 kampus UAE, #126 apartemen Korea | Daftar kriteria stakeholder + hasil AHP; domain safety + 3 skenario |
| A4 | #14 Fuzzy AHP-TOPSIS, #83 BWM-CoCoSo | Matriks cost-duration-risk; angka komparasi metode (92,8% vs 88,6%) |
| A5 | #96 Tangerang PROMETHEE, #74 IKN AHP, #56 EWM Guangzhou | Indikator security; bobot surveillance 27,7%; trade-off coverage-cost |

Aturan: keputusan Gugur/Lolos + alasan ditulis di `eligibility-12.csv` hari yang sama. Cadangan naik berurutan (#124 → #135 → #15 → #109 → #69 → #52) atas izin A1.
