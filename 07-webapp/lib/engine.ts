/**
 * Mesin keputusan DSS prioritisasi penempatan CCTV Jatinangor.
 *
 * Berkas ini SENGAJA mandiri (tanpa impor internal) agar dapat dijalankan
 * langsung oleh Next.js maupun oleh `node scripts/parity.ts` memakai
 * type-stripping bawaan Node, tanpa langkah build tambahan.
 *
 * Sumber kebenaran model dan angka:
 *   dss_revisi_markdown/dss_revisi.md
 *
 * Invarian yang dijaga oleh scripts/parity.ts:
 *   λmax = 8,1031 · CI = 0,0147 · CR = 0,0104
 *   bobot C1 = 23,95%; C2 = C3 = 14,29%; C5 = C8 = 12,45%; C7 = 9,74%; C4 = 7,70%; C6 = 5,15%
 *   CC: A3 0,6445 > A1 0,5774 > A4 0,4995 > A2 0,4638 > A5 0,1820
 *   fase anggaran resmi: [1, 2, 1, 2, 3]
 *   sensitivitas ±20%: 16 skenario, 2 pembalikan peringkat
 *
 * Catatan model: C1–C8 adalah kriteria urgensi yang masuk TOPSIS.
 * C9 dan RAB adalah kendala alokasi. Ambang C9 ≥ 3 adalah kebijakan
 * implementasi terdokumentasi, bukan angka eksplisit pada naskah kanonik.
 */

/* ============================== TIPE ============================== */

export type Alternative = { code: string; name: string; desa: string };

export type MapPosition = Record<string, [number, number]>;

export type Dataset = {
  label: string;
  note: string;
  simulated: boolean;
  alts: Alternative[];
  X: number[][];
  C9: number[];
  COST: number[];
  mapPos: MapPosition | null;
};

export type Criterion = { code: string; name: string; unit: string };

export type AhpResult = { w: number[]; lam: number; CI: number; CR: number };

export type TopsisResult = {
  V: number[][];
  Ap: number[];
  Am: number[];
  Dp: number[];
  Dm: number[];
  CC: number[];
};

export type PhaseResult = {
  phases: (number | null)[];
  excludedC9: number[];
  excludedBudget: number[];
  subtotals: Record<number, number>;
};

export type SensitivityRow = {
  j: number;
  d: number;
  cc: number[];
  ranks: string[];
  reversals: number;
};

export type SensitivityResult = { baseOrder: string[]; rows: SensitivityRow[] };

/* ============================ KRITERIA ============================ */

export const CRITERIA: Criterion[] = [
  { code: "C1", name: "Riwayat Kerawanan", unit: "insiden/km/th" },
  { code: "C2", name: "Mobilitas Malam", unit: "orang/jam" },
  { code: "C3", name: "Defisiensi PJU", unit: "skor 1-5" },
  { code: "C4", name: "Efisiensi Coverage", unit: "m2/titik" },
  { code: "C5", name: "Kepadatan Kos", unit: "kamar/km" },
  { code: "C6", name: "Derajat Simpul", unit: "cabang" },
  { code: "C7", name: "Gap CCTV Eksisting", unit: "meter" },
  { code: "C8", name: "POI Rentan", unit: "unit" },
];

/** RI Saaty untuk n = 1..10. */
export const RI: Record<number, number> = {
  1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49,
};

/** Plafon anggaran per tahun (juta rupiah). */
export const BUDGET = 15.0;

/** Ambang kelayakan teknis operasional (kebijakan implementasi). */
export const C9_MIN = 3;

/* ============================ DATASET ============================ */

export const DATASETS: Record<string, Dataset> = {
  resmi: {
    label: "5 Segmen (Resmi)",
    note:
      "Angka terverifikasi; identik dengan model numerik pada naskah kanonik. " +
      "Data per segmen bersifat hybrid: kalibrasi sekunder + estimasi terdokumentasi.",
    simulated: false,
    alts: [
      { code: "A1", name: "Gang Kos Sayang", desa: "Sayang" },
      { code: "A2", name: "Ruas Jalan Cikeruh", desa: "Cikeruh" },
      { code: "A3", name: "Persimpangan Hegarmanah", desa: "Hegarmanah" },
      { code: "A4", name: "Gang Cipacing", desa: "Cipacing" },
      { code: "A5", name: "Ruas Jalan Cileles", desa: "Cileles" },
    ],
    X: [
      [4.2, 120, 4, 380, 85, 2, 450, 8],
      [2.1, 350, 2, 650, 40, 3, 180, 12],
      [3.5, 280, 3, 520, 55, 5, 320, 15],
      [3.8, 80, 5, 290, 60, 2, 600, 4],
      [1.5, 160, 3, 420, 30, 2, 250, 5],
    ],
    C9: [4, 5, 4, 3, 4],
    COST: [6.5, 5.0, 7.5, 8.0, 5.5],
    mapPos: { A1: [232, 208], A2: [96, 258], A3: [402, 236], A4: [668, 272], A5: [528, 110] },
  },
  perluasan: {
    label: "12 Desa (Simulasi)",
    note:
      "[SIMULASI] Bukan hasil lapangan. Hanya demonstrasi skalabilitas: " +
      "jumlah segmen bertambah tanpa mengubah struktur sembilan kriteria.",
    simulated: true,
    alts: [
      { code: "D1", name: "Segmen Cipacing", desa: "Cipacing" },
      { code: "D2", name: "Segmen Hegarmanah", desa: "Hegarmanah" },
      { code: "D3", name: "Segmen Sayang", desa: "Sayang" },
      { code: "D4", name: "Segmen Cisempur", desa: "Cisempur" },
      { code: "D5", name: "Segmen Cikeruh", desa: "Cikeruh" },
      { code: "D6", name: "Segmen Cintamulya", desa: "Cintamulya" },
      { code: "D7", name: "Segmen Mekargalih", desa: "Mekargalih" },
      { code: "D8", name: "Segmen Cileles", desa: "Cileles" },
      { code: "D9", name: "Segmen Jatiroke", desa: "Jatiroke" },
      { code: "D10", name: "Segmen Cibeusi", desa: "Cibeusi" },
      { code: "D11", name: "Segmen Cilayang", desa: "Cilayang" },
      { code: "D12", name: "Segmen Jatimukti", desa: "Jatimukti" },
    ],
    X: [
      [3.9, 190, 4, 340, 95, 3, 420, 10],
      [4.0, 250, 3, 480, 80, 5, 300, 14],
      [3.6, 220, 3, 450, 70, 3, 350, 11],
      [2.6, 180, 3, 520, 45, 2, 300, 8],
      [2.4, 330, 2, 640, 42, 3, 200, 12],
      [2.2, 160, 3, 480, 38, 2, 280, 7],
      [2.0, 150, 3, 460, 35, 2, 260, 6],
      [1.8, 170, 4, 430, 32, 2, 270, 5],
      [1.9, 140, 3, 440, 33, 2, 300, 5],
      [1.7, 130, 3, 400, 28, 2, 320, 4],
      [1.6, 120, 3, 380, 25, 2, 340, 4],
      [1.5, 110, 3, 360, 22, 2, 360, 3],
    ],
    C9: [3, 4, 4, 4, 5, 4, 4, 4, 4, 4, 3, 4],
    COST: [8.0, 7.0, 6.5, 6.0, 5.0, 5.5, 5.5, 5.5, 5.5, 5.0, 5.5, 5.0],
    mapPos: null,
  },
};

/** Matriks perbandingan berpasangan AHP 8x8 (konsensus). */
export const A0: number[][] = [
  [1.0, 2.0, 2.0, 3.0, 2.0, 4.0, 2.0, 2.0],
  [0.5, 1.0, 1.0, 2.0, 1.0, 3.0, 2.0, 1.0],
  [0.5, 1.0, 1.0, 2.0, 1.0, 3.0, 2.0, 1.0],
  [0.33, 0.5, 0.5, 1.0, 0.5, 2.0, 1.0, 0.5],
  [0.5, 1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0],
  [0.25, 0.33, 0.33, 0.5, 0.5, 1.0, 0.5, 0.5],
  [0.5, 0.5, 0.5, 1.0, 1.0, 2.0, 1.0, 1.0],
  [0.5, 1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0],
];

export const deepCopy = <T,>(a: T[][]): T[][] => a.map((r) => r.slice());

/** Kunci dataset yang sah. */
export type DatasetKey = keyof typeof DATASETS;

/**
 * Ambil dataset berdasarkan kunci.
 *
 * Nilai dari DOM (mis. `<select>`) bertipe string bebas, sehingga kunci yang
 * tidak dikenal bisa masuk. Tanpa guard, `DATASETS[k]` bernilai undefined dan
 * aplikasi melempar error saat membaca `.alts`. Di sini kunci tak dikenal
 * dikembalikan ke dataset default agar aplikasi tetap berjalan.
 */
export function getDataset(key: string): Dataset {
  const fallback: DatasetKey = "resmi";
  return DATASETS[key as DatasetKey] ?? DATASETS[fallback];
}

/* ============================ ALGORITMA ============================ */

/**
 * Bobot AHP memakai power iteration, lalu λmax dihitung dari rata-rata
 * rasio (M·w)_i / w_i. Metode ini yang mereproduksi angka kanonik.
 */
export function ahp(M: number[][]): AhpResult {
  const n = M.length;
  let w = new Array<number>(n).fill(1 / n);

  for (let it = 0; it < 5000; it++) {
    const nw = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += M[i][j] * w[j];
      nw[i] = s;
    }
    const sum = nw.reduce((a, b) => a + b, 0);
    for (let i = 0; i < n; i++) nw[i] /= sum;
    let diff = 0;
    for (let i = 0; i < n; i++) diff += Math.abs(nw[i] - w[i]);
    w = nw;
    if (diff < 1e-13) break;
  }

  let lam = 0;
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += M[i][j] * w[j];
    lam += s / w[i];
  }
  lam /= n;

  const CI = n > 2 ? (lam - n) / (n - 1) : 0;
  const cr = RI[n] && n > 2 ? CI / RI[n] : 0;
  return { w, lam, CI, CR: cr };
}

/** TOPSIS: normalisasi Euclidean, pembobotan, solusi ideal, jarak, CC. */
export function topsis(X: number[][], w: number[]): TopsisResult {
  const m = X.length;
  const n = X[0].length;

  const div: number[] = [];
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let i = 0; i < m; i++) s += X[i][j] ** 2;
    div[j] = Math.sqrt(s);
  }

  const V = X.map((row) => row.map((v, j) => (v / div[j]) * w[j]));

  const Ap: number[] = [];
  const Am: number[] = [];
  for (let j = 0; j < n; j++) {
    let mx = -Infinity;
    let mn = Infinity;
    for (let i = 0; i < m; i++) {
      if (V[i][j] > mx) mx = V[i][j];
      if (V[i][j] < mn) mn = V[i][j];
    }
    Ap[j] = mx;
    Am[j] = mn;
  }

  const Dp: number[] = [];
  const Dm: number[] = [];
  for (let i = 0; i < m; i++) {
    let sp = 0;
    let sm = 0;
    for (let j = 0; j < n; j++) {
      sp += (V[i][j] - Ap[j]) ** 2;
      sm += (V[i][j] - Am[j]) ** 2;
    }
    Dp[i] = Math.sqrt(sp);
    Dm[i] = Math.sqrt(sm);
  }

  const CC = Dp.map((d, i) => (d === 0 && Dm[i] === 0 ? 0 : Dm[i] / (d + Dm[i])));
  return { V, Ap, Am, Dp, Dm, CC };
}

/** Kelayakan teknis: C9 memenuhi ambang operasional. */
export function feasibleFlags(C9: number[], min: number = C9_MIN): boolean[] {
  return C9.map((v) => Number(v) >= min);
}

/**
 * Alokasi fase anggaran.
 *
 * Urut CC menurun, lalu isi fase selama subtotal ≤ plafon. Alternatif yang
 * tidak layak (C9) maupun yang biaya satu titiknya melebihi plafon tidak
 * dialokasikan, sehingga tidak ada fase yang melampaui plafon.
 */
export function allocPhases(
  cc: number[],
  cost: number[],
  feasible: boolean[],
  budget: number = BUDGET,
): PhaseResult {
  const order = cc
    .map((_, i) => i)
    .filter((i) => feasible[i])
    .sort((a, b) => cc[b] - cc[a]);

  const phases: (number | null)[] = new Array(cc.length).fill(null);
  const excludedC9 = cc.map((_, i) => i).filter((i) => !feasible[i]);
  const excludedBudget: number[] = [];

  let phase = 1;
  let used = 0;
  for (const i of order) {
    if (Number(cost[i]) > budget + 1e-9) {
      excludedBudget.push(i);
      continue;
    }
    if (used > 0 && used + cost[i] > budget + 1e-9) {
      phase++;
      used = 0;
    }
    phases[i] = phase;
    used += cost[i];
  }

  const subtotals: Record<number, number> = {};
  phases.forEach((p, i) => {
    if (p !== null) subtotals[p] = (subtotals[p] ?? 0) + cost[i];
  });

  return { phases, excludedC9, excludedBudget, subtotals };
}

/** Hitung ulang bobot dengan satu kriteria diubah ±d, sisanya renormalisasi proporsional. */
export function perturbWeights(w: number[], j: number, d: number): number[] {
  const wp = w.slice();
  wp[j] *= 1 + d;
  const otherSum = w.reduce((a, b) => a + b, 0) - w[j];
  const newOther = 1 - wp[j];
  for (let k = 0; k < w.length; k++) {
    if (k !== j) wp[k] = otherSum === 0 ? 0 : w[k] * (newOther / otherSum);
  }
  return wp;
}

/** Analisis sensitivitas One-At-A-Time ±20% untuk setiap kriteria. */
export function sensitivity(X: number[][], w: number[]): SensitivityResult {
  const baseCC = topsis(X, w).CC;
  const orderIdx = (cc: number[]) => cc.map((_, i) => i).sort((a, b) => cc[b] - cc[a]);
  const baseOrder = orderIdx(baseCC).map((i) => i);

  const rows: SensitivityRow[] = [];
  for (let j = 0; j < w.length; j++) {
    for (const d of [0.2, -0.2]) {
      const cc = topsis(X, perturbWeights(w, j, d)).CC;
      const order = orderIdx(cc);
      // Hitung pasangan yang bertukar posisi relatif terhadap peringkat dasar.
      let reversals = 0;
      for (let a = 0; a < order.length; a++) {
        for (let b = a + 1; b < order.length; b++) {
          const baseA = baseOrder.indexOf(order[a]);
          const baseB = baseOrder.indexOf(order[b]);
          if (baseA > baseB) reversals++;
        }
      }
      rows.push({ j, d, cc, ranks: order.map((i) => String(i)), reversals });
    }
  }
  return { baseOrder: baseOrder.map(String), rows };
}

/* ============================ ORKESTRASI ============================ */

export type Evaluation = {
  datasetKey: string;
  dataset: Dataset;
  altCodes: string[];
  ahp: AhpResult;
  topsis: TopsisResult;
  rank: number[];
  order: number[];
  feasible: boolean[];
  allocation: PhaseResult;
  sensitivity: SensitivityResult;
  feasibleCount: number;
};

/** Jalankan seluruh rantai keputusan untuk satu dataset. */
export function evaluate(
  datasetKey: string,
  X: number[][],
  C9: number[],
  COST: number[],
  A: number[][],
): Evaluation {
  const dataset = getDataset(datasetKey);
  const altCodes = dataset.alts.map((a) => a.code);

  const ahpRes = ahp(A);
  const t = topsis(X, ahpRes.w);
  const order = t.CC.map((_, i) => i).sort((a, b) => t.CC[b] - t.CC[a]);
  const rank = new Array<number>(X.length);
  order.forEach((idx, r) => (rank[idx] = r + 1));

  const feasible = feasibleFlags(C9);
  const allocation = allocPhases(t.CC, COST, feasible);
  const sens = sensitivity(X, ahpRes.w);

  return {
    datasetKey,
    dataset,
    altCodes,
    ahp: ahpRes,
    topsis: t,
    rank,
    order,
    feasible,
    allocation,
    sensitivity: sens,
    feasibleCount: feasible.filter(Boolean).length,
  };
}

/** Data awal untuk satu dataset (deep copy, aman untuk diedit di UI). */
export function initialState(datasetKey: string = "resmi") {
  const d = getDataset(datasetKey);
  return {
    datasetKey,
    X: deepCopy(d.X),
    C9: d.C9.slice(),
    COST: d.COST.slice(),
    A: deepCopy(A0),
  };
}
