# Diagram UML — Sistem Pendukung Keputusan SiPrioCCTV Jatinangor

Dokumen ini memodelkan arsitektur, use case, alur aktivitas, dan interaksi komponen pada aplikasi **SiPrioCCTV Jatinangor** (berbasis **Next.js 16 + Three.js + Supabase** pada `07-webapp/` serta prototipe mandiri pada `05-aplikasi/`).

---

## 1. Aktor dan Use Case Diagram

Aplikasi memfasilitasi dua peran utama:
1. **Operator DSS / Administrator:** Mengelola matriks kriteria segmen, mengatur plafon anggaran dan ambang $C_9$, mengganti preset dataset, menganalisis sensitivitas bobot, dan mengekspor hasil ke CSV.
2. **Pakar / Responden:** Mengisi kuesioner perbandingan berpasangan Saaty (1–9) terpandu untuk menilai kepentingan relatif antar-kriteria atau antar-klaster urgensi.

```mermaid
flowchart LR
    admin["Operator DSS / Admin"]
    expert["Pakar / Responden"]

    subgraph app["SiPrioCCTV Jatinangor (Next.js 16)"]
        direction TB
        uc_switch["Memilih Preset Dataset (Ilustratif / Naskah UTS)"]
        uc_kriteria["Melihat & Mengubah Matriks Kriteria (C1-C8, C9, Biaya)"]
        uc_ahp_view["Melihat Matriks AHP, CR, dan Bobot Global"]
        uc_ahp_quiz["Mengisi Kuesioner Slider Perbandingan Saaty"]
        uc_map_3d["Eksplorasi Peta 3D (Three.js) & Layer Spasial"]
        uc_topsis["Melihat Peringkat TOPSIS & Jarak Ideal"]
        uc_alloc["Mengatur Plafon Anggaran & Alokasi Bertahap"]
        uc_sens["Menjalankan Uji Sensitivitas OAT +-20%"]
        uc_export["Mengekspor Laporan Hasil ke CSV"]
        uc_db["Sinkronisasi Data ke Supabase Cloud"]
    end

    admin --> uc_switch
    admin --> uc_kriteria
    admin --> uc_ahp_view
    admin --> uc_map_3d
    admin --> uc_topsis
    admin --> uc_alloc
    admin --> uc_sens
    admin --> uc_export
    admin --> uc_db

    expert --> uc_ahp_quiz
    expert --> uc_ahp_view
    expert --> uc_map_3d
```

---

## 2. Diagram Arsitektur & Komponen (4 Lapis)

Sistem dirancang dengan pemisahan tanggung jawab yang jelas (*Separation of Concerns*):

```mermaid
flowchart TD
    subgraph L1["1. Lapis Presentasi (UI Shell & Pages)"]
        PageDash["app/page.tsx (Dashboard & KPI)"]
        PageKrit["app/kriteria/page.tsx (Data Kriteria)"]
        PageAHP["app/ahp/page.tsx (Pembobotan AHP)"]
        PageHasil["app/hasil/page.tsx (Hasil TOPSIS & Anggaran)"]
        PageSens["app/sensitivitas/page.tsx (Uji Sensitivitas)"]
        Sidebar["components/Sidebar.tsx (Navigasi & Role)"]
        NumberCell["components/NumberCell.tsx (Safe Number Input)"]
    end

    subgraph L2["2. Lapis Visualisasi Spasial"]
        Map3D["components/map/PriorityMap3D.tsx (Three.js WebGL)"]
        Map2D["components/map/PriorityMap2D.tsx (SVG 2D Fallback)"]
        MapMode["components/map/MapModeToggle.tsx (Layer Toggle)"]
    end

    subgraph L3["3. Lapis Logika Keputusan (Domain Engine)"]
        Store["lib/store.tsx (React Context Global State)"]
        Engine["lib/engine/index.ts (Evaluator Orchestrator)"]
        AHP["lib/engine/ahp.ts (AHP Eigenvalue & CR Solver)"]
        TOPSIS["lib/engine/topsis.ts (Euclidean & CC Solver)"]
        Alloc["lib/engine/allocation.ts (Phased Budget & C9 Filter)"]
        Sens["lib/engine/sensitivity.ts (OAT +-20% Simulator)"]
        Fmt["lib/format.ts (Deterministic Formatter & CSV)"]
    end

    subgraph L4["4. Lapis Penyimpanan & Repositori"]
        Repo["lib/supabase-repository.ts (Repository Pattern)"]
        SupaClient["lib/supabase.ts (Supabase JS Client)"]
        CloudDB[("Supabase Cloud (PostgreSQL + RLS + Audit Log)")]
        LocalJSON[("Local Static JSON Fixtures (Graceful Fallback)")]
    end

    L1 --> Store
    L1 --> L2
    Store --> Engine
    Engine --> AHP
    Engine --> TOPSIS
    Engine --> Alloc
    Engine --> Sens
    L1 --> Fmt
    Store --> Repo
    Repo --> SupaClient
    SupaClient -.-> CloudDB
    Repo -.-> LocalJSON
```

---

## 3. Activity Diagram — Alur Keputusan Lengkap

Diagram berikut memodelkan seluruh siklus pemrosesan keputusan dari inisialisasi dataset hingga rekomendasi alokasi anggaran dan pengujian sensitivitas:

```mermaid
flowchart TD
    Start(["Mulai"])
    SelectDS["Pilih Preset Dataset (Ilustratif / Naskah UTS)"]
    LoadData["Muat Alternatif, Matriks Keputusan X, dan Matriks AHP"]
    CheckAHPMode{"Mode AHP?"}
    
    SolveHierarki["Hitung AHP Hierarki 3 Klaster x 3 Stakeholder (Rata-rata Geometrik)"]
    SolveFlat["Hitung AHP Datar 8 x 8 (Matriks Kanonik)"]
    
    CheckCR{"CR < 0,10?"}
    CRWarning["Tandai Peringatan Matriks Inkonsisten"]
    WeightReady["Vektor Bobot Global Kriteria (w1 .. w8) Siap"]
    
    NormTOPSIS["Normalisasi Matriks X dengan Vektor Euclidean"]
    WeightTOPSIS["Hitung Matriks Terbobot V = w * R"]
    IdealSolutions["Tentukan Solusi Ideal Positif A+ dan Negatif A-"]
    CalcDistance["Hitung Jarak Euclidean D+ dan D-"]
    CalcCC["Hitung Koefisien Kedekatan Relatif CC = D- / (D+ + D-)"]
    SortAlts["Urutkan Alternatif Berdasarkan Nilai CC Menurun"]
    
    LoopAlt{"Periksa Alternatif Tiap Urutan CC"}
    CheckC9{"C9 >= Ambang Operasional (3)?"}
    DeferPhase["Tunda ke Fase 2+ dengan Peringatan Kesiapan Tiang/Listrik"]
    CheckBudget{"Biaya Muat dalam Plafon Fase Aktif?"}
    AssignPhase["Alokasikan ke Fase Aktif"]
    NextPhase["Buat Fase Anggaran Berikutnya dan Alokasikan"]
    
    RunSens["Jalankan Simulasi Sensitivitas OAT +-20% (16 Skenario)"]
    RenderUI["Render 5 Layar, Peta 3D Three.js, dan Tabel Hasil"]
    ExportCheck{"Pengguna Meminta Ekspor?"}
    GenerateCSV["Generate & Unduh Berkas CSV"]
    End(["Selesai"])

    Start --> SelectDS --> LoadData --> CheckAHPMode
    CheckAHPMode -- "Hierarki (Ilustratif)" --> SolveHierarki --> CheckCR
    CheckAHPMode -- "Datar (Naskah UTS)" --> SolveFlat --> CheckCR
    CheckCR -- "Tidak" --> CRWarning --> WeightReady
    CheckCR -- "Ya" --> WeightReady
    WeightReady --> NormTOPSIS --> WeightTOPSIS --> IdealSolutions --> CalcDistance --> CalcCC --> SortAlts --> LoopAlt
    
    LoopAlt --> CheckC9
    CheckC9 -- "Tidak" --> DeferPhase --> CheckBudget
    CheckC9 -- "Ya" --> CheckBudget
    CheckBudget -- "Ya" --> AssignPhase
    CheckBudget -- "Tidak" --> NextPhase
    
    AssignPhase --> LoopAlt
    NextPhase --> LoopAlt
    LoopAlt -- "Semua Alternatif Teralokasi" --> RunSens --> RenderUI --> ExportCheck
    
    ExportCheck -- "Ya" --> GenerateCSV --> End
    ExportCheck -- "Tidak" --> End
```

---

## 4. Sequence Diagram — Interaksi Pengguna & Evaluasi Real-Time

Diagram sekuens ini menggambarkan interaksi dinamis ketika operator mengubah nilai kriteria alternatif atau preferensi AHP:

```mermaid
sequenceDiagram
    autonumber
    actor User as Operator / Responden
    participant UI as Antarmuka (Page / Form / NumberCell)
    participant Store as State Store (lib/store.tsx)
    participant Engine as Engine Evaluator (lib/engine)
    participant Map3D as Canvas 3D (PriorityMap3D)
    participant Repo as Supabase Repository
    participant Storage as Supabase Cloud / Local JSON

    User->>UI: Ubah Nilai Kriteria Alternatif atau Geser Slider Saaty
    UI->>Store: Kirim Payload Perubahan (updateAlternativeValues / updateAhpCell)
    Store->>Engine: Evaluasi Ulang (evaluate) dengan Preset Aktif
    Engine->>Engine: 1. Hitung Nilai Eigen AHP & Konsistensi CR
    Engine->>Engine: 2. Normalisasi Euclidean & Jarak TOPSIS
    Engine->>Engine: 3. Urutkan CC & Filter Kelayakan C9
    Engine->>Engine: 4. Alokasi Greedy Fase Anggaran
    Engine->>Engine: 5. Simulasi 16 Skenario Sensitivitas OAT
    Engine-->>Store: Kembalikan EvaluationResult Lengkap
    Store-->>UI: Perbarui State Global (KPI, Tabel TOPSIS, Alokasi Fase)
    Store->>Map3D: Perbarui Tinggi Pilar Spasial (propto CC) & Warna Status
    Map3D-->>User: Tampilan 3D Diperbarui secara Halus (60 FPS)

    opt Simpan Perubahan ke Database
        User->>UI: Klik "Simpan Perubahan"
        UI->>Store: Trigger Sinkronisasi
        Store->>Repo: saveAlternativeValues(datasetId, altId, values)
        Repo->>Storage: Upsert ke PostgreSQL (atau Local Fallback)
        Storage-->>Repo: Konfirmasi Berhasil & Log Audit Dicatat
        Repo-->>UI: Tampilkan Notifikasi Sukses
    end
```

---

## 5. Ringkasan Keterlacakan Komponen UML ke Kode

| Komponen / Artefak UML | Berkas Sumber Implementasi | Skrip Pengujian Terkait |
|---|---|---|
| AHP Hierarki & Flat Engine | `07-webapp/lib/engine/ahp.ts` | `07-webapp/scripts/parity.mts` |
| TOPSIS Vector Normalization | `07-webapp/lib/engine/topsis.ts` | `07-webapp/scripts/parity.mts` |
| Alokasi Fase & Filter $C_9$ | `07-webapp/lib/engine/allocation.ts` | `07-webapp/scripts/parity.mts` |
| Uji Sensitivitas OAT $\pm 20\%$ | `07-webapp/lib/engine/sensitivity.ts` | `07-webapp/scripts/parity.mts` |
| Peta Spasial 3D WebGL | `07-webapp/components/map/PriorityMap3D.tsx` | `07-webapp/scripts/ui-check.mjs` |
| Fallback Peta 2D SVG | `07-webapp/components/map/PriorityMap2D.tsx` | `07-webapp/scripts/ui-check.mjs` |
| Proteksi Input Angka | `07-webapp/components/NumberCell.tsx` | `07-webapp/scripts/ui-bugs.mjs` |
| Ekspor CSV Deterministiik | `07-webapp/lib/format.ts` | `07-webapp/scripts/ui-export.mjs` |
| Skema Database & RLS | `07-webapp/supabase/migrations/20261116000000_init.sql` | `07-webapp/lib/supabase-repository.ts` |
| Audit Aksesibilitas WCAG AA | Seluruh halaman `07-webapp/app/` | `07-webapp/scripts/ui-a11y.mjs` |
