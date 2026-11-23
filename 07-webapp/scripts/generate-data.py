#!/usr/bin/env python3
import json
import os

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir = os.path.join(root_dir, 'data')
os.makedirs(data_dir, exist_ok=True)

# 1. naskah-uts.json
naskah_uts = {
  "id": "naskah_uts",
  "nama": "Dataset Naskah UTS (AHP 8x8)",
  "deskripsi": "Model numerik kanonik proposal UTS: AHP datar 8x8, lambda_max 8.1031, CR 0.0104",
  "status": "SIMULASI",
  "ahp_mode": "datar",
  "plafon_per_fase_rp": 15000000,
  "c9_min_fase1": 3,
  "alternatives": [
    { "id": "A1", "nama_segmen": "Gang Kos Sayang", "tipe_segmen": "Gang residensial", "desa": "Sayang", "lat": -6.9335, "lng": 107.7733, "karakteristik": "Gang sempit, padat indekos" },
    { "id": "A2", "nama_segmen": "Ruas Jalan Cikeruh", "tipe_segmen": "Ruas jalan", "desa": "Cikeruh", "lat": -6.9340, "lng": 107.7768, "karakteristik": "Koridor dekat kampus, jalur malam" },
    { "id": "A3", "nama_segmen": "Persimpangan Hegarmanah", "tipe_segmen": "Persimpangan", "desa": "Hegarmanah", "lat": -6.9336, "lng": 107.7783, "karakteristik": "Simpul utama 5 cabang" },
    { "id": "A4", "nama_segmen": "Gang Cipacing", "tipe_segmen": "Gang residensial", "desa": "Cipacing", "lat": -6.9428, "lng": 107.7622, "karakteristik": "Gang panjang, jauh dari CCTV" },
    { "id": "A5", "nama_segmen": "Ruas Jalan Cileles", "tipe_segmen": "Ruas jalan", "desa": "Cileles", "lat": -6.9118, "lng": 107.7774, "karakteristik": "Ruas sekunder lingkar timur" }
  ],
  "criteria": [
    { "kode": "C1", "nama": "Riwayat Kerawanan", "satuan": "insiden/km/th", "peran": "benefit" },
    { "kode": "C2", "nama": "Mobilitas Malam", "satuan": "orang/jam", "peran": "benefit" },
    { "kode": "C3", "nama": "Defisiensi PJU", "satuan": "skor 1-5", "peran": "benefit" },
    { "kode": "C4", "nama": "Efisiensi Coverage", "satuan": "m2/titik", "peran": "benefit" },
    { "kode": "C5", "nama": "Kepadatan Kos", "satuan": "kamar/km", "peran": "benefit" },
    { "kode": "C6", "nama": "Derajat Simpul", "satuan": "cabang", "peran": "benefit" },
    { "kode": "C7", "nama": "Gap CCTV Eksisting", "satuan": "meter", "peran": "benefit" },
    { "kode": "C8", "nama": "POI Rentan", "satuan": "unit", "peran": "benefit" },
    { "kode": "C9", "nama": "Kelayakan Teknis", "satuan": "skor 1-5", "peran": "kendala" }
  ],
  "values": {
    "A1": { "kriteria": { "C1": 4.2, "C2": 120, "C3": 4, "C4": 380, "C5": 85, "C6": 2, "C7": 450, "C8": 8 }, "c9": 4, "biaya_rp": 6500000 },
    "A2": { "kriteria": { "C1": 2.1, "C2": 350, "C3": 2, "C4": 650, "C5": 40, "C6": 3, "C7": 180, "C8": 12 }, "c9": 5, "biaya_rp": 5000000 },
    "A3": { "kriteria": { "C1": 3.5, "C2": 280, "C3": 3, "C4": 520, "C5": 55, "C6": 5, "C7": 320, "C8": 15 }, "c9": 4, "biaya_rp": 7500000 },
    "A4": { "kriteria": { "C1": 3.8, "C2": 80, "C3": 5, "C4": 290, "C5": 60, "C6": 2, "C7": 600, "C8": 4 }, "c9": 3, "biaya_rp": 8000000 },
    "A5": { "kriteria": { "C1": 1.5, "C2": 160, "C3": 3, "C4": 420, "C5": 30, "C6": 2, "C7": 250, "C8": 5 }, "c9": 4, "biaya_rp": 5500000 }
  },
  "ahp_matrix_8x8": [
    [1.0, 2.0, 2.0, 3.0, 2.0, 4.0, 2.0, 2.0],
    [0.5, 1.0, 1.0, 2.0, 1.0, 3.0, 2.0, 1.0],
    [0.5, 1.0, 1.0, 2.0, 1.0, 3.0, 2.0, 1.0],
    [0.33, 0.5, 0.5, 1.0, 0.5, 2.0, 1.0, 0.5],
    [0.5, 1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0],
    [0.25, 0.33, 0.33, 0.5, 0.5, 1.0, 0.5, 0.5],
    [0.5, 0.5, 0.5, 1.0, 1.0, 2.0, 1.0, 1.0],
    [0.5, 1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0]
  ],
  "benchmarks": {
    "ahp": {
      "lam": 8.10306181034438,
      "CI": 0.014723115763482906,
      "CR": 0.010441926073392132,
      "w": [0.2394767594828246, 0.14285859398318712, 0.14285859398318712, 0.07697142675072806, 0.12448790705295738, 0.05150015848118846, 0.09735865321296974, 0.12448790705295738]
    },
    "topsis": [
      { "alternatif_id": "A1", "closeness_cc": 0.5773850343521282, "ranking": 2 },
      { "alternatif_id": "A2", "closeness_cc": 0.46377056695863755, "ranking": 4 },
      { "alternatif_id": "A3", "closeness_cc": 0.6445304002038504, "ranking": 1 },
      { "alternatif_id": "A4", "closeness_cc": 0.4995401849422471, "ranking": 3 },
      { "alternatif_id": "A5", "closeness_cc": 0.18202618998946082, "ranking": 5 }
    ],
    "allocation": {
      "items": [
        { "alternatif_id": "A3", "ranking": 1, "cc": 0.6445, "fase": 1, "biaya_rp": 7500000 },
        { "alternatif_id": "A1", "ranking": 2, "cc": 0.5774, "fase": 1, "biaya_rp": 6500000 },
        { "alternatif_id": "A4", "ranking": 3, "cc": 0.4995, "fase": 2, "biaya_rp": 8000000 },
        { "alternatif_id": "A2", "ranking": 4, "cc": 0.4638, "fase": 2, "biaya_rp": 5000000 },
        { "alternatif_id": "A5", "ranking": 5, "cc": 0.1820, "fase": 3, "biaya_rp": 5500000 }
      ]
    }
  }
}

with open(os.path.join(data_dir, 'naskah-uts.json'), 'w', encoding='utf-8') as f:
    json.dump(naskah_uts, f, indent=2, ensure_ascii=False)

# 2. cctv-eksisting.sim.json
cctv_eksisting = [
  { "id": "CCTV-EX-01", "nama": "ETLE Jatinangor (Polres/Pemda) — Jl. Raya Jatinangor", "lat": -6.9327, "lng": 107.7779, "jenis": "ETLE statis", "status": "Aktif", "kepastian": "riil", "sumber": "Koran Gala / Radar Sumedang (terpasang Nov 2025)", "catatan": "Kamera tilang elektronik resmi Jatinangor; koridor Jl. Raya dekat Unpad/Cikeruh" },
  { "id": "CCTV-EX-02", "nama": "CCTV komersial Simpang Sayang / Jatos", "lat": -6.9335, "lng": 107.7728, "jenis": "CCTV komersial", "status": "Aktif", "kepastian": "simulasi", "sumber": "estimasi visual (bukan ATCS)", "catatan": "Kamera komersial pertigaan Jl. Raya Jatinangor - Jl. Sayang" }
]

with open(os.path.join(data_dir, 'cctv-eksisting.sim.json'), 'w', encoding='utf-8') as f:
    json.dump(cctv_eksisting, f, indent=2, ensure_ascii=False)

# 3. jalan.sim.json
jalan = [
  { "id": "J01", "nama": "Koridor Jl. Raya Jatinangor (Cipacing - IPDN - ITB - Unpad - Hegarmanah)", "coords": [[-6.9412, 107.7595], [-6.9360, 107.7642], [-6.9340, 107.7689], [-6.9335, 107.7728], [-6.9328, 107.7768], [-6.9327, 107.7779], [-6.9293, 107.7811]] },
  { "id": "J02", "nama": "Ruas Jl. Hegarmanah (A3)", "coords": [[-6.9327, 107.7779], [-6.9336, 107.7783], [-6.9375, 107.7786]] },
  { "id": "J03", "nama": "Ruas Jl. Sayang - Gang Kos Sayang (A1)", "coords": [[-6.9335, 107.7728], [-6.9335, 107.7733], [-6.9360, 107.7734], [-6.9387, 107.7735]] },
  { "id": "J04", "nama": "Ruas Gang Ciseke - Cikeruh (A2)", "coords": [[-6.9328, 107.7768], [-6.9340, 107.7768], [-6.9365, 107.7765]] },
  { "id": "J05", "nama": "Ruas Gang Cipacing - Jl. GKPN (A4)", "coords": [[-6.9412, 107.7595], [-6.9428, 107.7622], [-6.9448, 107.7628]] },
  { "id": "J06", "nama": "Ruas Jl. Cikuda - Lingkar Timur Cileles (A5)", "coords": [[-6.9293, 107.7811], [-6.9253, 107.7798], [-6.9212, 107.7786], [-6.9188, 107.7778], [-6.9150, 107.7776], [-6.9118, 107.7774]] }
]

with open(os.path.join(data_dir, 'jalan.sim.json'), 'w', encoding='utf-8') as f:
    json.dump(jalan, f, indent=2, ensure_ascii=False)

print("Generated naskah-uts.json, cctv-eksisting.sim.json, jalan.sim.json")
