# Diagram UML — Aplikasi DSS Prioritisasi CCTV Jatinangor

## Tujuan dan batasan

Dokumen ini mendeskripsikan perilaku aplikasi web offline pada `05-aplikasi/index.html` untuk prioritisasi penempatan CCTV di permukiman mahasiswa Jatinangor. Diagram memodelkan **alur aplikasi dan keputusan**, bukan klaim bahwa nilai setiap segmen telah berasal dari survei lapangan.

- **C1–C8** adalah kriteria urgensi berorientasi *benefit* dan menjadi masukan pembobotan AHP serta perankingan TOPSIS.
- **C9** adalah kelayakan teknis, sedangkan **RAB/biaya per titik** adalah kendala anggaran. Keduanya tidak masuk perhitungan urgensi TOPSIS.
- Aplikasi menerapkan **C9 ≥ 3** sebagai ambang kelayakan **operasional** pada tahap alokasi fase. Ambang tersebut adalah kebijakan implementasi terdokumentasi, **bukan** aturan numerik yang dinyatakan eksplisit dalam naskah kanonik.
- Dataset resmi lima segmen memakai mode *hybrid*: sebagian data dikalibrasi dari sumber sekunder, sementara nilai per-gang yang belum tersedia tetap merupakan estimasi terdokumentasi. Dataset 12 desa adalah `[SIMULASI]` untuk demonstrasi skalabilitas.

## Aktor dan use case

Aktor utama adalah pengguna/pengambil keputusan yang membuka aplikasi lokal di browser. Pengguna dapat memilih dataset, mengubah nilai matriks, memeriksa hasil keputusan, lalu mengekspor hasil. Mesin DSS menjalankan AHP, TOPSIS, filter kelayakan, alokasi anggaran, serta sensitivitas secara otomatis.

> Mermaid belum menyediakan notasi *use case diagram* UML native. Diagram berikut memakai `flowchart` sebagai representasi use case yang setara dan dapat dirender Mermaid.

```mermaid
flowchart LR
    user["Pengguna atau pengambil keputusan"]

    subgraph app["Aplikasi DSS CCTV"]
        uc1(["Memilih dataset"])
        uc2(["Mengubah C1 sampai C8"])
        uc3(["Mengubah C9 dan RAB per titik"])
        uc4(["Mengubah matriks AHP 8 x 8"])
        uc5(["Melihat bobot AHP dan konsistensi"])
        uc6(["Melihat peringkat TOPSIS dan peta skematik"])
        uc7(["Melihat kelayakan dan alokasi fase"])
        uc8(["Melihat analisis sensitivitas"])
        uc9(["Ekspor hasil CSV"])
        engine(["Hitung ulang engine DSS"])
    end

    user --> uc1
    user --> uc2
    user --> uc3
    user --> uc4
    user --> uc5
    user --> uc6
    user --> uc7
    user --> uc8
    user --> uc9

    uc1 --> engine
    uc2 --> engine
    uc3 --> engine
    uc4 --> engine
    engine --> uc5
    engine --> uc6
    engine --> uc7
    engine --> uc8
    uc9 --> engine
```

**Penjelasan singkat:** perubahan input tidak merender ulang tabel input, tetapi memicu pembaruan hasil agar fokus saat mengetik tetap terjaga. Ekspor CSV memakai hasil perhitungan terbaru, termasuk status kelayakan C9 dan fase jika alternatif memenuhi ambang operasional.

## Activity diagram perhitungan dan alokasi

Diagram berikut membedakan dua jalur keputusan. Jalur pertama menghasilkan urutan urgensi dari C1–C8 melalui AHP dan TOPSIS. Jalur kedua memakai C9 dan RAB setelah peringkat terbentuk untuk menentukan kelayakan teknis dan fase anggaran.

```mermaid
flowchart TD
    start(["Mulai"])
    load["Muat dataset aktif dan matriks AHP"]
    input["Terima perubahan input pengguna bila ada"]
    ahp["Hitung AHP: bobot, lambda maksimum, CI, dan CR"]
    cr{"CR kurang dari 0,10?"}
    notice["Tandai matriks perlu ditinjau ulang"]
    topsis["Hitung TOPSIS dari C1 sampai C8"]
    rank["Urutkan alternatif berdasarkan CC"]
    feasible{"C9 memenuhi ambang operasional 3?"}
    exclude["Tandai tidak layak dan tidak alokasikan"]
    affordable{"Biaya satu titik tidak melebihi plafon?"}
    excludeBudget["Tandai biaya di atas plafon dan tidak alokasikan"]
    budget{"Biaya masih muat dalam plafon fase?"}
    assign["Masukkan alternatif ke fase aktif"]
    nextphase["Buat fase berikutnya"]
    more{"Masih ada alternatif layak?"}
    sens["Jalankan sensitivitas bobot plus atau minus 20 persen"]
    render["Tampilkan KPI, bobot, peringkat, peta, fase, dan sensitivitas"]
    export{"Pengguna meminta ekspor?"}
    csv["Buat dan unduh CSV hasil"]
    finish(["Selesai"])

    start --> load --> input --> ahp --> cr
    cr -- "Tidak" --> notice --> topsis
    cr -- "Ya" --> topsis
    topsis --> rank --> feasible
    feasible -- "Tidak" --> exclude --> more
    feasible -- "Ya" --> affordable
    affordable -- "Tidak" --> excludeBudget --> more
    affordable -- "Ya" --> budget
    budget -- "Ya" --> assign --> more
    budget -- "Tidak" --> nextphase --> assign
    more -- "Ya" --> feasible
    more -- "Tidak" --> sens --> render --> export
    export -- "Ya" --> csv --> finish
    export -- "Tidak" --> finish
```

**Penjelasan singkat:** status CR tidak menghentikan aplikasi, tetapi memberi penanda bahwa penilaian AHP perlu ditinjau. TOPSIS tetap hanya memproses C1–C8. C9 dan biaya baru dipakai sesudahnya, sehingga alternatif yang sangat urgen tetap dapat terlihat pada peringkat namun tidak dimasukkan ke fase bila C9 berada di bawah ambang operasional atau biaya satu titik melebihi plafon.

## Sequence diagram pembaruan hasil

Sequence berikut menjelaskan pembaruan otomatis saat pengguna mengedit sel matriks atau memilih dataset. Perhitungan mengalir dari browser ke state data, engine AHP dan TOPSIS, kemudian ke filter kelayakan/alokasi dan komponen hasil.

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as Browser dan antarmuka
    participant State as State dataset dan input
    participant AHP as Engine AHP
    participant TOPSIS as Engine TOPSIS
    participant Alloc as Filter C9 dan alokasi RAB
    participant View as Tabel hasil, peta, dan sensitivitas

    User->>UI: Pilih dataset atau ubah nilai input
    UI->>State: Perbarui C1 sampai C8, C9, RAB, atau matriks AHP
    State->>AHP: Hitung bobot, lambda maksimum, CI, CR
    AHP-->>UI: Bobot dan status konsistensi
    State->>TOPSIS: Kirim C1 sampai C8 dan bobot AHP
    TOPSIS-->>UI: D plus, D minus, CC, dan peringkat
    State->>Alloc: Kirim CC, C9, RAB, dan plafon fase
    Note over Alloc: C9 minimal 3 adalah ambang operasional
    Alloc-->>UI: Status layak dan fase alokasi
    UI->>View: Render KPI, bobot, peringkat, peta, fase, sensitivitas
    View-->>User: Hasil keputusan yang diperbarui

    opt Pengguna memilih ekspor
        User->>UI: Klik ekspor CSV
        UI->>AHP: Hitung bobot terbaru
        UI->>TOPSIS: Hitung peringkat terbaru
        UI->>Alloc: Tentukan kelayakan dan fase terbaru
        UI-->>User: Unduh CSV
    end
```

## Trace sumber dan konsistensi

| Elemen diagram | Dasar penelusuran |
|---|---|
| Alternatif segmen, pemisahan C1–C8 dari C9 dan biaya, AHP lalu TOPSIS, serta alokasi bertahap | `dss_revisi_markdown/dss_revisi.md`, Seksi IV-B sampai IV-D. |
| Implementasi AHP datar 8×8, TOPSIS C1–C8, filter C9, plafon fase, sensitivitas, ekspor CSV, dan pembaruan hasil saat input berubah | `05-aplikasi/index.html`. |
| Penjelasan penggunaan aplikasi, dataset resmi dan simulasi, serta definisi ambang C9 sebagai kebijakan operasional | `05-aplikasi/README.md` dan `PROGRESS.md`, Sesi 8 (14 November 2026). |
| Status data riil, estimasi, dan simulasi per segmen | `08-docs/data-dan-sumber.md`, khususnya pemetaan status C1–C9 dan catatan C9. |

Dokumen ini tidak menetapkan nilai observasi baru. Validasi empiris tetap memerlukan survei per segmen untuk kesiapan tiang, listrik, jaringan, RAB, dan indikator urgensi yang saat ini masih berstatus estimasi atau simulasi.
