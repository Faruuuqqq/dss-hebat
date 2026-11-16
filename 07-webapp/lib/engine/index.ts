import type {
  Alternative,
  Criterion,
  FullDSSResult,
  PairwiseItem,
} from "./types.ts";
import {
  solveAhpMatrix,
  solveHierarchicalAhp,
  RI,
} from "./ahp.ts";
import { solveTopsis } from "./topsis.ts";
import { solveAllocation } from "./allocation.ts";
import { solveSensitivity } from "./sensitivity.ts";

export type * from "./types.ts";
export * from "./ahp.ts";
export * from "./topsis.ts";
export * from "./allocation.ts";
export * from "./sensitivity.ts";

export interface SolveDatasetInput {
  id: string;
  ahp_mode: "hierarki" | "datar";
  plafon_per_fase_rp: number;
  c9_min_fase1?: number;
  alternatives: Alternative[];
  criteria: Criterion[];
  values: Record<string, { kriteria: Record<string, number>; c9: number; biaya_rp: number }>;
  pairwise?: PairwiseItem[];
  ahp_matrix_8x8?: number[][];
  overrides?: {
    plafonPerFase?: number;
    c9MinFase1?: number;
    strictC9Filter?: boolean;
    customWeights?: Record<string, number>;
  };
}

export function solveDataset(input: SolveDatasetInput): FullDSSResult {
  const {
    id,
    ahp_mode,
    alternatives,
    criteria,
    values,
    pairwise = [],
    ahp_matrix_8x8,
    overrides = {},
  } = input;

  const plafon = overrides.plafonPerFase ?? input.plafon_per_fase_rp ?? 15_000_000;
  const c9Min = overrides.c9MinFase1 ?? input.c9_min_fase1 ?? 3;
  const strictC9 = overrides.strictC9Filter ?? (ahp_mode === "datar");

  // Urgent criteria for TOPSIS (C1 to C8)
  const topsisCriteria = criteria.filter((c) => c.peran === "benefit" || c.kode.startsWith("C") && c.kode !== "C9");
  const critCodes = topsisCriteria.map((c) => c.kode);
  const altIds = alternatives.map((a) => a.id);

  // 1. Solve AHP
  let ahpWeights: Record<string, number> = {};
  let flatResult: any = undefined;
  let hierarchicalResult: any = undefined;

  if (overrides.customWeights) {
    ahpWeights = { ...overrides.customWeights };
  } else if (ahp_mode === "hierarki" && pairwise.length > 0) {
    const clusters = ["Risiko", "Paparan", "Spasial"];
    const clusterCriteriaMap: Record<string, string[]> = {
      Risiko: ["C1", "C3"],
      Paparan: ["C2", "C5", "C8"],
      Spasial: ["C4", "C6", "C7"],
    };
    hierarchicalResult = solveHierarchicalAhp(clusters, clusterCriteriaMap, pairwise);
    ahpWeights = hierarchicalResult.globalWeights;
  } else if (ahp_matrix_8x8) {
    flatResult = solveAhpMatrix(ahp_matrix_8x8);
    critCodes.forEach((code, idx) => {
      ahpWeights[code] = flatResult.weights[idx] ?? 0;
    });
  }

  // 2. Build decision matrix X for TOPSIS
  const X: number[][] = alternatives.map((alt) => {
    const altVal = values[alt.id]?.kriteria ?? {};
    return critCodes.map((code) => altVal[code] ?? 0);
  });

  const c9Scores: number[] = alternatives.map((alt) => values[alt.id]?.c9 ?? 3);
  const costs: number[] = alternatives.map((alt) => values[alt.id]?.biaya_rp ?? 0);

  // 3. Solve TOPSIS
  const topsisResult = solveTopsis(X, ahpWeights, critCodes);

  // 4. Solve Allocation
  const allocationResult = solveAllocation(
    alternatives,
    topsisResult.CC,
    c9Scores,
    costs,
    {
      plafonPerFase: plafon,
      c9MinFase1: c9Min,
      strictC9Filter: strictC9,
    }
  );

  // 5. Solve Sensitivity
  const sensitivityResult = solveSensitivity(
    X,
    ahpWeights,
    critCodes,
    altIds,
    [-0.2, 0.2]
  );

  return {
    datasetId: id,
    alternatives,
    criteria,
    ahp: {
      mode: ahp_mode,
      flatResult,
      hierarchicalResult,
      weights: ahpWeights,
    },
    topsis: topsisResult,
    allocation: allocationResult,
    sensitivity: sensitivityResult,
  };
}
