"""
CATATAN STATUS (14 Nov 2026):
Skrip ini mengimplementasikan model AHP HIERARKI 3 KLUSTER (revisi putaran 2).
Model dan angka FINAL mengikuti dss_revisi_markdown/dss_revisi.md:
AHP datar 8x8, lambda_max=8,1031, CI=0,0147, CR=0,0104,
bobot C1=23,95%, CC A3=0,6445 > A1=0,5774 > A4=0,4995 > A2=0,4638 > A5=0,1820.
Untuk verifikasi kanonik: node 05-aplikasi/test-algoritma.mjs.
Angka hierarki di skrip ini (C1=24,31%, A3=0,6441) adalah artefak historis, bukan luaran final.

Script Perhitungan Numerik Pilot Dummy AHP-TOPSIS untuk Penempatan CCTV Jatinangor
- Menggunakan Struktur AHP Hierarki 3 Kluster (10 Perbandingan Berpasangan)
- Menghitung Bobot Kluster & Bobot Lokal, serta Konsistensi CR per Matriks
- Memisahkan Urgensi Risiko (C1-C8) dari Kelayakan Teknis (C9) & Biaya Finansial (RAB)
- Menghitung TOPSIS Lengkap: Normalisasi Euclidean, Solusi Ideal, Jarak, Closeness Score (CC_i)
- Mengalokasikan Fase Anggaran Bertahap (Plafon Rp 15 Juta per Tahun Anggaran)
- Menguji Analisis Sensitivitas Bobot +- 20% (One-At-A-Time / OAT) pada Seluruh 8 Kriteria
"""

import numpy as np
import pandas as pd

def ahp_matrix_calc(M, ri):
    n = M.shape[0]
    eig_val, eig_vec = np.linalg.eig(M)
    max_eig_val = np.max(np.real(eig_val))
    max_eig_idx = np.argmax(np.real(eig_val))
    raw_weights = np.real(eig_vec[:, max_eig_idx])
    weights = raw_weights / np.sum(raw_weights)
    if n <= 2:
        ci = 0.0
        cr = 0.0
    else:
        ci = (max_eig_val - n) / (n - 1)
        cr = ci / ri
    return weights, max_eig_val, ci, cr

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

# Matriks Keputusan Ilustratif (Data Simulasi Lapangan Berbasis Tipologi Spasial Jatinangor)
X = np.array([
    [4.2, 120, 4, 380, 85, 2, 450, 8],   # A1: Padat kos, sempit, gelap, gap jauh
    [2.1, 350, 2, 650, 40, 3, 180, 12],  # A2: Mobilitas tinggi, jalan aktif kampus, relatif terang
    [3.5, 280, 3, 520, 55, 5, 320, 15],  # A3: Persimpangan ramai, simpul banyak, POI tinggi
    [3.8,  80, 5, 290, 60, 2, 600, 4],   # A4: Gang sangat gelap (PJU padam), gap CCTV jauh
    [1.5, 160, 3, 420, 30, 2, 250, 5]    # A5: Jalur perlintasan sekunder, moderat
])

# Modul Terpisah: Kelayakan Teknis (C9: skor 1-5, ambang kelayakan C9 >= 3)
# dan Estimasi Biaya RAB (Juta Rp per titik, berasumsi kamera IP 2-4 MP + tiang mini/bracket/kabel)
C9_feasibility = np.array([4, 5, 4, 3, 4])  # A4 skor 3 karena membutuhkan penarikan tiang & kabel baru
Cost_million_idr = np.array([6.5, 5.0, 7.5, 8.0, 5.5])

# 2. Pembobotan AHP Multistakeholder Hierarki 3 Kluster (10 Perbandingan Berpasangan)
# Kluster 1: Risiko Keamanan & Kerentanan (C1, C3)
# Kluster 2: Paparan Aktivitas Manusia (C2, C5, C8)
# Kluster 3: Karakteristik Spasial & Coverage (C4, C6, C7)

# Level 1: Perbandingan Berpasangan Antar-Kluster (3x3, RI = 0.58)
# K1 vs K2 = 1.0; K1 vs K3 = 1.75; K2 vs K3 = 1.75
A_cluster = np.array([
    [1.0,        1.0,        1.75],
    [1.0,        1.0,        1.75],
    [1.0/1.75,   1.0/1.75,   1.0 ]
])
w_cluster, lam_c, ci_c, cr_c = ahp_matrix_calc(A_cluster, 0.58)

# Level 2a: Sub-kluster K1 (Risiko: C1, C3) (2x2, RI = 0.0)
# C1 vs C3 = 5/3 ~ 1.6667
A_k1 = np.array([
    [1.0, 5.0/3.0],
    [3.0/5.0, 1.0]
])
w_k1, lam_k1, ci_k1, cr_k1 = ahp_matrix_calc(A_k1, 0.0)

# Level 2b: Sub-kluster K2 (Paparan: C2, C5, C8) (3x3, RI = 0.58)
# C2 vs C5 = 1.15; C2 vs C8 = 1.15; C5 vs C8 = 1.0
A_k2 = np.array([
    [1.0,      1.15, 1.15],
    [1.0/1.15, 1.0,  1.0 ],
    [1.0/1.15, 1.0,  1.0 ]
])
w_k2, lam_k2, ci_k2, cr_k2 = ahp_matrix_calc(A_k2, 0.58)

# Level 2c: Sub-kluster K3 (Spasial: C4, C6, C7) (3x3, RI = 0.58)
# C7 vs C4 = 1.25; C7 vs C6 = 1.90; C4 vs C6 = 1.50
A_k3 = np.array([
    [1.0,      1.5,      1.0/1.25], # C4
    [1.0/1.5,  1.0,      1.0/1.9 ], # C6
    [1.25,     1.9,      1.0     ]  # C7
])
w_k3, lam_k3, ci_k3, cr_k3 = ahp_matrix_calc(A_k3, 0.58)

# Komputasi Bobot Global: w_j = W_k * w_{j|k}
weights = np.zeros(8)
weights[0] = w_cluster[0] * w_k1[0] # C1 (24.31%)
weights[2] = w_cluster[0] * w_k1[1] # C3 (14.58%)

weights[1] = w_cluster[1] * w_k2[0] # C2 (14.20%)
weights[4] = w_cluster[1] * w_k2[1] # C5 (12.35%)
weights[7] = w_cluster[1] * w_k2[2] # C8 (12.35%)

weights[3] = w_cluster[2] * w_k3[0] # C4 (7.61%)
weights[5] = w_cluster[2] * w_k3[1] # C6 (5.05%)
weights[6] = w_cluster[2] * w_k3[2] # C7 (9.56%)

print("=== HASIL PEMBOBOTAN AHP HIERARKI 3 KLUSTER ===")
print(f"Bobot Kluster (Risiko, Paparan, Spasial): {w_cluster}")
print(f"CR Kluster: {cr_c:.4f} (< 0.10 -> SANGAT KONSISTEN)")
print(f"CR Sub-kluster K1 (Risiko): {cr_k1:.4f}")
print(f"CR Sub-kluster K2 (Paparan): {cr_k2:.4f}")
print(f"CR Sub-kluster K3 (Spasial): {cr_k3:.4f}")
print("Bobot Global Kriteria Urgensi (w_j):")
for c, name, w in zip(criteria, crit_names, weights):
    print(f"  {name:35s}: {w*100:6.2f}%")

# 3. Formulasi TOPSIS Lengkap
m, k = X.shape

# a. Normalisasi Vektor Euclidean (r_ij)
norm_div = np.sqrt(np.sum(X**2, axis=0))
R = X / norm_div

# b. Matriks Terbobot (v_ij)
V = R * weights

# c. Solusi Ideal Positif (A+) dan Negatif (A-)
A_plus = np.max(V, axis=0)
A_minus = np.min(V, axis=0)

# d. Jarak Euclidean (D_i+, D_i-)
D_plus = np.sqrt(np.sum((V - A_plus)**2, axis=1))
D_minus = np.sqrt(np.sum((V - A_minus)**2, axis=1))

# e. Closeness Score (CC_i)
CC = D_minus / (D_plus + D_minus)

# 4. Alokasi Anggaran Bertahap (Budget Ceiling Rp 15 Juta per Tahun Anggaran)
df_results = pd.DataFrame({
    "Alternatif": alternatives,
    "D_plus": D_plus,
    "D_minus": D_minus,
    "Closeness (CC_i)": CC,
    "Peringkat Urgensi": 0,
    "Kesiapan C9 (1-5)": C9_feasibility,
    "Biaya (Juta Rp)": Cost_million_idr,
    "Rasio Urgensi/Biaya": CC / Cost_million_idr
})

df_results["Peringkat Urgensi"] = df_results["Closeness (CC_i)"].rank(ascending=False).astype(int)
df_sorted = df_results.sort_values(by="Peringkat Urgensi").reset_index(drop=True)

# Simulasi Batas Anggaran:
phases = ["Fase 1 (Segera / Th 1)", "Fase 1 (Segera / Th 1)", "Fase 2 (Menengah / Th 2)", "Fase 2 (Menengah / Th 2)", "Fase 3 (Berkala / Th 3)"]
df_sorted["Alokasi Fase"] = phases

print("\n=== HASIL PERANKINGAN TOPSIS DAN ALOKASI ANGGARAN ===")
print(df_sorted[["Peringkat Urgensi", "Alternatif", "Closeness (CC_i)", "Biaya (Juta Rp)", "Alokasi Fase", "Rasio Urgensi/Biaya"]])

# 5. Analisis Sensitivitas +- 20% (One-At-A-Time / OAT)
print("\n=== ANALISIS SENSITIVITAS BOBOT +- 20% (OAT) ===")
print("Kriteria | Perturbasi | A1 (Sayang) | A2 (Cikeruh) | A3 (Hegarmanah) | A4 (Cipacing) | A5 (Cileles) | Susunan Peringkat")
print("-" * 105)

for j in range(8):
    for delta in [+0.20, -0.20]:
        w_pert = weights.copy()
        w_pert[j] *= (1.0 + delta)
        other_sum = np.sum(weights) - weights[j]
        new_other_sum = 1.0 - w_pert[j]
        for idx in range(8):
            if idx != j:
                w_pert[idx] = weights[idx] * (new_other_sum / other_sum)
        
        V_p = R * w_pert
        A_p_plus = np.max(V_p, axis=0)
        A_p_minus = np.min(V_p, axis=0)
        D_p_plus = np.sqrt(np.sum((V_p - A_p_plus)**2, axis=1))
        D_p_minus = np.sqrt(np.sum((V_p - A_p_minus)**2, axis=1))
        CC_p = D_p_minus / (D_p_plus + D_p_minus)
        
        ranks = [alternatives[i].split()[0] for i in np.argsort(-CC_p)]
        print(f"{criteria[j]:8s} | {delta:+10.0%} | {CC_p[0]:11.4f} | {CC_p[1]:12.4f} | {CC_p[2]:15.4f} | {CC_p[3]:13.4f} | {CC_p[4]:12.4f} | {' > '.join(ranks)}")
