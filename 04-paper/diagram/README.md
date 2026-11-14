# Diagram — STATUS

## Sumber kanonik (dipakai paper)

Gambar arsitektur empat lapis dibangun dari satu sumber TikZ:

- **Sumber:** [`assets/diagram/arsitektur-4-lapis-kanonik.tex`](../../assets/diagram/arsitektur-4-lapis-kanonik.tex)
- **Pembangun PNG:** [`assets/diagram/build-arsitektur-png.sh`](../../assets/diagram/build-arsitektur-png.sh)
- **Keluaran PNG:** `06-paper-hasil/img/arsitektur.png` dan `04-paper/gambar-3-arsitektur.png` (400 dpi, keduanya identik)

Isi gambar sudah diselaraskan dengan `dss_revisi_markdown/dss_revisi.md`: AHP **datar 8×8**
(28 perbandingan unik), C1–C8 sebagai kriteria urgensi TOPSIS, serta C9 dan RAB sebagai
kendala alokasi. Kedua paper memuat gambar ini secara vektor melalui `\input`, sehingga
tidak ada risiko gambar raster kedaluwarsa.

Regenerasi:

```bash
TECTONIC=/path/ke/tectonic PYTHON=/path/ke/python-dengan-pymupdf \
  bash assets/diagram/build-arsitektur-png.sh
```

## Artefak historis (JANGAN dipakai di luaran final)

Folder ini juga masih memuat sumber diagram fase proposal putaran 2 yang memakai
**AHP hierarki 3 kluster** dan angka **CC A3 = 0,6441**:

- `generate_drawio.py` — dibekukan; header skrip sudah menandai status historis.
- `arsitektur-4-lapis.mmd`, `arsitektur-4-lapis.drawio`, `semua-diagram.drawio`, `taksiomi-5-pola.*`

Model dan angka final:

- AHP **datar 8×8**, CR = 0,0104
- C1 = 23,95%, C2 = C3 = 14,29%, C5 = C8 = 12,45%
- CC: A3 = **0,6445** > A1 = 0,5774 > A4 = 0,4995 > A2 = 0,4638 > A5 = 0,1820
- PRISMA: 582 → 416 → 121 → 12

Jangan meregenerasi `.drawio` dari `generate_drawio.py` untuk luaran final sebelum angka
di skrip itu diperbarui ke model kanonik.

## Catatan riwayat

Versi PNG lama (3870 × 1830) masih memuat label “Struktur hierarki 3 kluster (10 pasang)”,
sehingga bertentangan dengan Tabel IV dan narasi 8×8 di paper yang sama. Artefak itu sudah
diganti pada 14 Nov 2026.
