# Mockup Aplikasi DSS

Folder ini menyimpan *wireframe* berbasis tampilan aplikasi aktual, bukan desain yang terpisah dari implementasi. Artefak dibuat untuk dokumentasi rekayasa perangkat lunak dan dapat direproduksi dari `05-aplikasi/index.html`.

## Artefak

| File | Viewport | Isi yang terlihat |
|---|---:|---|
| `mockup-desktop.png` | 1440 × 2200 px | Header, KPI, matriks keputusan, bobot AHP, hasil TOPSIS, dan awal peta prioritas. |
| `mockup-mobile.png` | 430 × 1600 px | Header, KPI responsif, matriks keputusan, dan awal matriks AHP pada layar sempit. |

## Dasar dan batasan

- Sumber tampilan: `05-aplikasi/index.html`, dataset **5 Segmen (Resmi)**.
- Tampilan menunjukkan hasil resmi: CR 0,0104 dan A3 sebagai prioritas tertinggi.
- C1–C8 merupakan kriteria urgensi pada TOPSIS. C9 dan RAB digunakan saat alokasi fase; label C9 ≥ 3 pada tampilan adalah **ambang kelayakan operasional**, bukan angka ambang yang ditulis eksplisit dalam `dss_revisi_markdown/dss_revisi.md`.
- Data per segmen adalah *hybrid* dan memuat estimasi terdokumentasi. Screenshot tidak boleh diperlakukan sebagai bukti survei lapangan.
- Pada viewport mobile, tabel lebar tetap dapat digeser secara horizontal. Hal ini terlihat pada mockup dan sesuai perilaku aplikasi satu-file saat ini.

## Reproduksi

Jalankan Chromium/Chrome secara *headless* dari root repositori, misalnya:

```bash
CHROME="$(ls -1 "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | tail -1)"
mkdir -p 08-docs/mockup
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1440,2200 \
  --screenshot="$PWD/08-docs/mockup/mockup-desktop.png" \
  "file://$PWD/05-aplikasi/index.html"
```

Gunakan viewport `430,1600` dan nama berkas `mockup-mobile.png` untuk versi mobile.
