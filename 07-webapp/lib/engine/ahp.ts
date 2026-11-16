import type { AhpMatrixResult, HierarchicalAhpResult, PairwiseItem } from "./types.ts";

export const RI: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export function solveAhpMatrix(M: number[][]): AhpMatrixResult {
  const n = M.length;
  if (n === 1) {
    return { weights: [1], lam: 1, CI: 0, CR: 0, isConsistent: true };
  }
  if (n === 2) {
    // For 2x2: M = [[1, a], [1/a, 1]]
    // w1 = a / (1 + a), w2 = 1 / (1 + a)
    const a = M[0][1];
    const w1 = a / (1 + a);
    const w2 = 1 / (1 + a);
    return { weights: [w1, w2], lam: 2, CI: 0, CR: 0, isConsistent: true };
  }

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
  const ri = RI[n] ?? 1.49;
  const CR = ri > 0 && n > 2 ? CI / ri : 0;

  return {
    weights: w,
    lam,
    CI,
    CR,
    isConsistent: CR < 0.1,
  };
}

export function aggregateGeomean(matrices: number[][][]): number[][] {
  if (matrices.length === 0) throw new Error("Matrices array cannot be empty");
  const n = matrices[0].length;
  const K = matrices.length;
  const result: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(1));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let prod = 1;
      for (let k = 0; k < K; k++) {
        prod *= matrices[k][i][j];
      }
      result[i][j] = Math.pow(prod, 1 / K);
    }
  }
  return result;
}

export function buildPairwiseMatrix(
  items: string[],
  pairs: { a: string; b: string; val: number }[]
): number[][] {
  const n = items.length;
  const M: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(1));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = items[i];
      const b = items[j];
      const direct = pairs.find((p) => p.a === a && p.b === b);
      if (direct) {
        M[i][j] = direct.val;
        M[j][i] = 1 / direct.val;
      } else {
        const inverse = pairs.find((p) => p.a === b && p.b === a);
        if (inverse) {
          M[i][j] = 1 / inverse.val;
          M[j][i] = inverse.val;
        } else {
          M[i][j] = 1;
          M[j][i] = 1;
        }
      }
    }
  }
  return M;
}

export function solveHierarchicalAhp(
  clusters: string[],
  clusterCriteriaMap: Record<string, string[]>,
  pairwiseItems: PairwiseItem[],
  groups: string[] = ["G1 Pemda", "G2 Kampus", "G3 Warga"]
): HierarchicalAhpResult {
  // 1. Cluster matrices per group
  const clusterMatrices = groups.map((g) => {
    const pairs = pairwiseItems
      .filter((p) => p.kelompok === g && p.level === "Klaster")
      .map((p) => ({ a: p.kriteria_a, b: p.kriteria_b, val: p.nilai_saaty_a_vs_b }));
    return buildPairwiseMatrix(clusters, pairs);
  });
  const aggClusterMatrix = aggregateGeomean(clusterMatrices);
  const clusterAhp = solveAhpMatrix(aggClusterMatrix);
  const clusterWeights: Record<string, number> = {};
  clusters.forEach((c, idx) => {
    clusterWeights[c] = clusterAhp.weights[idx];
  });

  // 2. Local criteria matrices per cluster per group
  const localResults: HierarchicalAhpResult["local"] = {};
  const globalWeights: Record<string, number> = {};

  for (const c of clusters) {
    const items = clusterCriteriaMap[c];
    const localMatrices = groups.map((g) => {
      const pairs = pairwiseItems
        .filter((p) => p.kelompok === g && (p.level === c || p.level.toLowerCase() === c.toLowerCase()))
        .map((p) => ({ a: p.kriteria_a, b: p.kriteria_b, val: p.nilai_saaty_a_vs_b }));
      return buildPairwiseMatrix(items, pairs);
    });
    const aggLocalMatrix = aggregateGeomean(localMatrices);
    const localAhp = solveAhpMatrix(aggLocalMatrix);

    const weightsMap: Record<string, number> = {};
    items.forEach((item, idx) => {
      weightsMap[item] = localAhp.weights[idx];
      globalWeights[item] = clusterWeights[c] * localAhp.weights[idx];
    });

    localResults[c] = {
      items,
      weights: weightsMap,
      matrix: aggLocalMatrix,
      CR: localAhp.CR,
      lam: localAhp.lam,
      isConsistent: localAhp.isConsistent,
    };
  }

  const orderedGlobalWeights = Object.entries(globalWeights).map(([kode, weight]) => {
    const klaster = Object.keys(clusterCriteriaMap).find((cl) => clusterCriteriaMap[cl].includes(kode)) ?? "";
    return {
      kode,
      weight,
      percent: weight * 100,
      klaster,
    };
  });

  return {
    cluster: {
      clusters,
      weights: clusterWeights,
      matrix: aggClusterMatrix,
      CR: clusterAhp.CR,
      lam: clusterAhp.lam,
      isConsistent: clusterAhp.isConsistent,
    },
    local: localResults,
    globalWeights,
    orderedGlobalWeights,
  };
}
