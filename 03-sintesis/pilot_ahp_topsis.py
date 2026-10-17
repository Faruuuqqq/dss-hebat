"""
Script Perhitungan Numerik Pilot Dummy AHP-TOPSIS untuk Penempatan CCTV Jatinangor
- Memisahkan Urgensi (C1-C8) dari Kelayakan/Biaya (C9 & Biaya Finansial)
- Menghitung AHP Multistakeholder (3 kelompok: Pemda, Kampus, Warga)
- Mengecek Eigenvalue, CI, dan CR (memastikan CR < 0.1)
- Menghitung TOPSIS lengkap (Normalisasi Vektor, Solusi Ideal, Jarak, Closeness)
- Mengalokasikan fase anggaran bertahap (Budget Ceiling Rp 15 Juta per fase)
- Menguji Analisis Sensitivitas Bobot +- 20% (One-At-A-Time)
"""

import numpy as np
import pandas as pd

# 1. Definisi Alternatif dan Kriteria Urgensi
alternatives = [
    "A1 (Gang Kos Sayang)",
    "A2 (Ruas Cikeruh Kampus)",
    "A3 (Simpul Hegarmanah)",
    "A4 (Gang Cipacing Gelap)",
    "A5 (Ruas Cileles)"
]

criteria = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"]
crit_names = [
    "C1: Kerawanan (insiden/km/th)",
    "C2: Mobilitas Malam (orang/jam)",
    "C3: Defisiensi PJU (skor 1-5)",
    "C4: Coverage (m2/titik)",
    "C5: Kepadatan Kos (kamar/km)",
    "C6: Derajat Simpul (cabang)",
    "C7: Gap CCTV (meter)",
    "C8: POI Rentan (unit)"
]

# Matriks Keputusan Dummy (Data Ilustratif Lapangan yang Realistis)
# C1: insiden/km/th [rasio]
# C2: orang/jam [rasio]
# C3: 1-5 (5 = sangat gelap) [ordinal]
# C4: m2 coverage [rasio]
# C5: kamar/km [rasio]
# C6: jumlah cabang simpul [rasio]
# C7: jarak ke CCTV aktif terdekat (m) [rasio]
# C8: jumlah POI rentan radius 150m [rasio]
X = np.array([
    [4.2, 120, 4, 380, 85, 2, 450, 8],   # A1: Padat kos, sempit, gelap, gap jauh
    [2.1, 350, 2, 650, 40, 3, 180, 12],  # A2: Mobilitas tinggi, jalan utama kampus, relatif terang
    [3.5, 280, 3, 520, 55, 5, 320, 15],  # A3: Persimpangan ramai, simpul banyak, POI tinggi
    [3.8,  80, 5, 290, 60, 2, 600, 4],   # A4: Gang sangat gelap (PJU mati), gap CCTV jauh
    [1.5, 160, 3, 420, 30, 2, 250, 5]    # A5: Jalur pinggiran, moderat
])

# Data Terpisah: Kelayakan Teknis (C9: 1-5) dan Estimasi Biaya Pengadaan/Pemasangan (Juta Rp)
C9_feasibility = np.array([4, 5, 4, 3, 4])  # 5 = tiang, listrik, internet sangat siap
Cost_million_idr = np.array([6.5, 5.0, 7.5, 8.0, 5.5]) # A4 butuh penarikan tiang/kabel baru

# 2. Pembobotan AHP Multistakeholder (3 Kelompok: Pemda, Kampus, Warga)
# Menggunakan struktur hierarki untuk menjaga CR rendah:
# Kluster 1: Risiko Keamanan & Kerentanan (C1, C3)
# Kluster 2: Paparan Aktivitas Manusia (C2, C5, C8)
# Kluster 3: Karakteristik Spasial & Coverage (C4, C6, C7)

# Contoh bobot konsensus hasil geometric mean dari 3 kelompok pemangku kepentingan:
# Hasil pairwise comparison konsensus 8 kriteria:
# Target bobot konsensus:
# C1 (Kerawanan) bobot tinggi (~0.22)
# C2 (Mobilitas) (~0.15)
# C3 (PJU) (~0.14)
# C5 (Kepadatan kos) (~0.13)
# C8 (POI rentan) (~0.12)
# C7 (Gap CCTV) (~0.10)
# C4 (Coverage) (~0.08)
# C6 (Derajat simpul) (~0.06)

# Matriks pairwise comparison konsensus (8x8):
A = np.array([
    # C1    C2    C3    C4    C5    C6    C7    C8
    [1.0,  2.0,  2.0,  3.0,  2.0,  4.0,  2.0,  2.0],  # C1
    [0.5,  1.0,  1.0,  2.0,  1.0,  3.0,  2.0,  1.0],  # C2
    [0.5,  1.0,  1.0,  2.0,  1.0,  3.0,  2.0,  1.0],  # C3
    [0.33, 0.5,  0.5,  1.0,  0.5,  2.0,  1.0,  0.5],  # C4
    [0.5,  1.0,  1.0,  2.0,  1.0,  2.0,  1.0,  1.0],  # C5
    [0.25, 0.33, 0.33, 0.5,  0.5,  1.0,  0.5,  0.5],  # C6
    [0.5,  0.5,  0.5,  1.0,  1.0,  2.0,  1.0,  1.0],  # C7
    [0.5,  1.0,  1.0,  2.0,  1.0,  2.0,  1.0,  1.0]   # C8
])

# Hitung Eigenvector dan Bobot AHP
eig_val, eig_vec = np.linalg.eig(A)
max_eig_val = np.max(np.real(eig_val))
max_eig_idx = np.argmax(np.real(eig_val))
raw_weights = np.real(eig_vec[:, max_eig_idx])
weights = raw_weights / np.sum(raw_weights)

# Cek Konsistensi AHP (n = 8, RI = 1.41)
n = 8
RI = 1.41
CI = (max_eig_val - n) / (n - 1)
CR = CI / RI

print(f"=== HASIL PEMBOBOTAN AHP MULTISTAKEHOLDER ===")
print(f"Lambda Max: {max_eig_val:.4f}")
print(f"CI: {CI:.4f}")
print(f"CR: {CR:.4f} (Ambang batas < 0.10 -> {'KONSISTEN' if CR < 0.10 else 'TIDAK KONSISTEN'})")
for c, name, w in zip(criteria, crit_names, weights):
    print(f"  {name:35s}: {w*100:6.2f}%")

# 3. Formulasi TOPSIS Lengkap
# Semua C1-C8 berorientasi BENEFIT terhadap urgensi prioritas (semakin tinggi skor, semakin mendesak)
m, k = X.shape

# a. Normalisasi Vektor (Euclidean)
norm_div = np.sqrt(np.sum(X**2, axis=0))
R = X / norm_div

# b. Matriks Terbobot
V = R * weights

# c. Solusi Ideal Positif (A+) dan Solusi Ideal Negatif (A-)
A_plus = np.max(V, axis=0)
A_minus = np.min(V, axis=0)

# d. Jarak Euclidean ke Solusi Ideal
D_plus = np.sqrt(np.sum((V - A_plus)**2, axis=1))
D_minus = np.sqrt(np.sum((V - A_minus)**2, axis=1))

# e. Nilai Closeness Coefficient (Ci)
C_i = D_minus / (D_plus + D_minus)

# f. Peringkat Urgensi
rank_idx = np.argsort(-C_i)

# 4. Alokasi Anggaran Bertahap (Budget Ceiling Rp 15 Juta per fase)
df_results = pd.DataFrame({
    "Alternatif": alternatives,
    "D_plus": D_plus,
    "D_minus": D_minus,
    "Closeness (Ci)": C_i,
    "Peringkat Urgensi": 0,
    "Kesiapan C9 (1-5)": C9_feasibility,
    "Biaya (Juta Rp)": Cost_million_idr,
    "Rasio Urgensi/Biaya": C_i / Cost_million_idr
})

df_results["Peringkat Urgensi"] = df_results["Closeness (Ci)"].rank(ascending=False).astype(int)
df_sorted = df_results.sort_values(by="Peringkat Urgensi").reset_index(drop=True)

# Simulasi Budget Ceiling Rp 15 Juta per fase:
budget_phase1_limit = 15.0
cumulative_cost = 0.0
phases = []
for idx, row in df_sorted.iterrows():
    cumulative_cost += row["Biaya (Juta Rp)"]
    if cumulative_cost <= budget_phase1_limit:
        phases.append("Fase 1 (Segera - Anggaran Tahun Ini)")
    elif cumulative_cost <= budget_phase1_limit * 2:
        phases.append("Fase 2 (Anggaran APBD/CSR Berikutnya)")
    else:
        phases.append("Fase 3 (Pengembangan Lanjutan)")

df_sorted["Tahap Pemasangan"] = phases

print("\n=== HASIL PERANGKINGAN TOPSIS DAN ALOKASI FASE ANGGARAN ===")
print(df_sorted[["Peringkat Urgensi", "Alternatif", "Closeness (Ci)", "Biaya (Juta Rp)", "Tahap Pemasangan", "Rasio Urgensi/Biaya"]].to_string(index=False))

# 5. Uji Sensitivitas +-20% (One-At-A-Time)
print("\n=== UJI SENSITIVITAS +-20% PADA BOBOT AHP ===")
sensitivity_stable = True
for idx_c, crit_code in enumerate(criteria):
    for delta in [+0.20, -0.20]:
        w_perturbed = weights.copy()
        w_perturbed[idx_c] *= (1 + delta)
        # Renormalize sisanya
        other_indices = [i for i in range(len(weights)) if i != idx_c]
        remaining_sum = np.sum(w_perturbed[other_indices])
        w_perturbed[other_indices] = w_perturbed[other_indices] * ((1 - w_perturbed[idx_c]) / remaining_sum)
        
        # Hitung TOPSIS ulang
        V_pert = R * w_perturbed
        A_p_pert = np.max(V_pert, axis=0)
        A_m_pert = np.min(V_pert, axis=0)
        D_p_pert = np.sqrt(np.sum((V_pert - A_p_pert)**2, axis=1))
        D_m_pert = np.sqrt(np.sum((V_pert - A_m_pert)**2, axis=1))
        Ci_pert = D_m_pert / (D_p_pert + D_m_pert)
        rank_pert = np.argsort(-Ci_pert)
        
        top_alt = alternatives[rank_pert[0]]
        # print(f"Kriteria {crit_code} {'+20%' if delta > 0 else '-20%'}: Top 1 tetap {top_alt}")
        if top_alt != alternatives[rank_idx[0]]:
            sensitivity_stable = False
            print(f"Pergeseran Peringkat #1 pada {crit_code} ({delta*100:+.0f}%): Menjadi {top_alt}")

if sensitivity_stable:
    print("HASIL SENSITIVITAS: Peringkat #1 (Alternatif Teratas) KOKOH/STABIL pada seluruh variasi bobot +-20%!")
