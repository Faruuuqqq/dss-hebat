import type { TopsisResult } from "./types.ts";

export function solveTopsis(
  X: number[][],
  weights: number[] | Record<string, number>,
  criteriaCodes?: string[]
): TopsisResult {
  const m = X.length;
  if (m === 0) {
    return {
      R: [],
      V: [],
      Ap: [],
      Am: [],
      Dp: [],
      Dm: [],
      CC: [],
      rankings: [],
      sortedIndices: [],
    };
  }
  const n = X[0].length;

  const wArray: number[] = Array.isArray(weights)
    ? weights
    : (criteriaCodes ?? []).map((code) => (weights as Record<string, number>)[code] ?? 0);

  // 1. Vector normalization
  const colNorms = new Array<number>(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      sumSq += X[i][j] * X[i][j];
    }
    colNorms[j] = Math.sqrt(sumSq);
  }

  const R: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  const V: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      R[i][j] = colNorms[j] > 0 ? X[i][j] / colNorms[j] : 0;
      V[i][j] = R[i][j] * wArray[j];
    }
  }

  // 2. Ideal positive & negative (all C1-C8 benefit)
  const Ap = new Array<number>(n).fill(0);
  const Am = new Array<number>(n).fill(0);

  for (let j = 0; j < n; j++) {
    let maxVal = -Infinity;
    let minVal = Infinity;
    for (let i = 0; i < m; i++) {
      if (V[i][j] > maxVal) maxVal = V[i][j];
      if (V[i][j] < minVal) minVal = V[i][j];
    }
    Ap[j] = maxVal;
    Am[j] = minVal;
  }

  // 3. Separation distances D+ and D-
  const Dp = new Array<number>(m).fill(0);
  const Dm = new Array<number>(m).fill(0);
  const CC = new Array<number>(m).fill(0);

  for (let i = 0; i < m; i++) {
    let sumSqP = 0;
    let sumSqM = 0;
    for (let j = 0; j < n; j++) {
      sumSqP += (V[i][j] - Ap[j]) * (V[i][j] - Ap[j]);
      sumSqM += (V[i][j] - Am[j]) * (V[i][j] - Am[j]);
    }
    Dp[i] = Math.sqrt(sumSqP);
    Dm[i] = Math.sqrt(sumSqM);
    const denom = Dp[i] + Dm[i];
    CC[i] = denom > 0 ? Dm[i] / denom : 0;
  }

  // 4. Rankings
  const sortedIndices = Array.from({ length: m }, (_, i) => i).sort((a, b) => CC[b] - CC[a]);
  const rankings = new Array<number>(m).fill(0);
  sortedIndices.forEach((origIdx, rankIdx) => {
    rankings[origIdx] = rankIdx + 1;
  });

  return {
    R,
    V,
    Ap,
    Am,
    Dp,
    Dm,
    CC,
    rankings,
    sortedIndices,
  };
}
