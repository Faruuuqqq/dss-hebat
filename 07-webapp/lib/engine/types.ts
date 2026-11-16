export type CriterionRole = "benefit" | "cost" | "kendala";

export interface Criterion {
  kode: string;
  nama: string;
  klaster?: string;
  satuan: string;
  skala?: string;
  peran: CriterionRole;
  sumber_data?: string;
}

export interface Alternative {
  id: string;
  nama_segmen: string;
  tipe_segmen: string;
  desa: string;
  lat: number;
  lng: number;
  karakteristik: string;
}

export interface AlternativeValue {
  kriteria: Record<string, number>;
  c9: number;
  biaya_rp: number;
}

export interface Stakeholder {
  responden_id: string;
  kelompok: string;
  instansi: string;
  peran: string;
}

export interface PairwiseItem {
  kelompok: string;
  level: string;
  kriteria_a: string;
  kriteria_b: string;
  nilai_saaty_a_vs_b: number;
}

export interface AhpMatrixResult {
  weights: number[];
  lam: number;
  CI: number;
  CR: number;
  isConsistent: boolean;
}

export interface HierarchicalAhpResult {
  cluster: {
    clusters: string[];
    weights: Record<string, number>;
    matrix: number[][];
    CR: number;
    lam: number;
    isConsistent: boolean;
  };
  local: Record<string, {
    items: string[];
    weights: Record<string, number>;
    matrix: number[][];
    CR: number;
    lam: number;
    isConsistent: boolean;
  }>;
  globalWeights: Record<string, number>;
  orderedGlobalWeights: { kode: string; weight: number; percent: number; klaster: string }[];
}

export interface TopsisResult {
  R: number[][];
  V: number[][];
  Ap: number[];
  Am: number[];
  Dp: number[];
  Dm: number[];
  CC: number[];
  rankings: number[]; // 1-based rank for each alternative in original order
  sortedIndices: number[]; // indices of alternatives sorted best to worst
}

export interface AllocationItem {
  alternatif_id: string;
  nama_segmen: string;
  ranking: number;
  cc: number;
  skor_c9: number;
  biaya_rp: number;
  fase: number | null;
  keterangan: string;
  cc_per_juta_rp: number;
  warning?: string;
}

export interface PhaseAllocationResult {
  items: AllocationItem[];
  subtotals: Record<number, number>;
  remainingBudget: Record<number, number>;
  plafonPerFase: number;
  excludedCount: number;
}

export interface SensitivityScenario {
  kriteria: string;
  deltaPct: number; // e.g. -20, 0, 20
  newWeights: Record<string, number>;
  cc: number[];
  rankings: number[];
  rankingOrder: string; // e.g. "A3 > A1 > A4 > A2 > A5"
  isRank1Preserved: boolean;
  isFullOrderPreserved: boolean;
  rankChanges: Record<string, { oldRank: number; newRank: number; diff: number }>;
}

export interface SensitivityAnalysisResult {
  baseOrder: string;
  baseRankings: Record<string, number>;
  scenarios: SensitivityScenario[];
  summary: {
    totalScenarios: number;
    rank1PreservedCount: number;
    fullOrderPreservedCount: number;
    reversalsCount: number;
  };
}

export interface FullDSSResult {
  datasetId: string;
  alternatives: Alternative[];
  criteria: Criterion[];
  ahp: {
    mode: "hierarki" | "datar";
    flatResult?: AhpMatrixResult;
    hierarchicalResult?: HierarchicalAhpResult;
    weights: Record<string, number>;
  };
  topsis: TopsisResult;
  allocation: PhaseAllocationResult;
  sensitivity: SensitivityAnalysisResult;
}
