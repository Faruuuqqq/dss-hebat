# Dokumentasi Rekayasa Perangkat Lunak

Dokumen pada folder ini melengkapi aplikasi DSS prioritisasi penempatan CCTV Jatinangor. Untuk model keputusan, angka hasil, dan alur penelitian, rujukan utama tetap [`dss_revisi_markdown/dss_revisi.md`](../dss_revisi_markdown/dss_revisi.md).

## Indeks artefak

| Artefak | Isi | Status |
|---|---|---|
| [`srs.md`](srs.md) | Tujuan, aktor, kebutuhan fungsional/nonfungsional, batasan, dan kriteria penerimaan aplikasi offline. | Selesai |
| [`traceability.md`](traceability.md) | Keterlacakan kebutuhan ke fungsi `index.html`, test algoritma, dan smoke test UI. | Selesai |
| [`uml.md`](uml.md) | Diagram use case, activity, dan sequence dalam Mermaid. | Selesai |
| [`mockup/README.md`](mockup/README.md) | Keterangan dan cara reproduksi screenshot desktop/mobile aplikasi aktual. | Selesai |
| [`data-dan-sumber.md`](data-dan-sumber.md) | Status data riil, estimasi, simulasi, serta daftar sumber. | Selesai |

## Catatan penting model

- C1–C8 dipakai untuk pembobotan AHP 8×8 dan perankingan TOPSIS sebagai kriteria urgensi.
- C9 dan RAB menjadi kendala alokasi. Nilai C9 ≥ 3 adalah **ambang operasional aplikasi**, bukan angka ambang yang disebut eksplisit dalam naskah kanonik.
- Dataset `resmi` lima segmen menghasilkan keluaran utama. Dataset `perluasan` 12 desa adalah **[SIMULASI]**.
- Nilai per-segmen yang belum didapat melalui observasi lapangan tetap merupakan estimasi terdokumentasi dan tidak boleh dinyatakan sebagai data lapangan tervalidasi.

## Verifikasi

```bash
node 05-aplikasi/test-algoritma.mjs
bash 05-aplikasi/test-ui.sh
```

Kedua perintah memeriksa mesin aplikasi aktual serta perilaku UI inti. Validasi empiris per segmen, C9, RAB, dan koordinat GPS tetap membutuhkan survei lapangan.
