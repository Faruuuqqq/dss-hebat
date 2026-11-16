import type { SensitivityAnalysisResult, SensitivityScenario } from "./types.ts";
import { solveTopsis } from "./topsis.ts";

export function solveSensitivity(
  X: number[][],
  baseWeights: Record<string, number>,
  criteriaCodes: string[],
  alternativeIds: string[],
  deltas: number[] = [-0.2, 0.2]
): SensitivityAnalysisResult {
  const m = alternativeIds.length;
  const n = criteriaCodes.length;

  // 1. Base TOPSIS
  const baseTopsis = solveTopsis(X, baseWeights, criteriaCodes);
  const baseSortedIds = baseTopsis.sortedIndices.map((i) => alternativeIds[i]);
  const baseOrder = baseSortedIds.join(" > ");

  const baseRankings: Record<string, number> = {};
  alternativeIds.forEach((id, idx) => {
    baseRankings[id] = baseTopsis.rankings[idx];
  });

  const scenarios: SensitivityScenario[] = [];
  let reversalsCount = 0;
  let rank1PreservedCount = 0;
  let fullOrderPreservedCount = 0;

  for (const crit of criteriaCodes) {
    const wBase = baseWeights[crit] ?? 0;

    for (const d of deltas) {
      const deltaPct = Math.round(d * 100);
      const wPrime = wBase * (1 + d);
      const remainingSum = 1 - wPrime;
      const oldRemainingSum = 1 - wBase;

      const newWeights: Record<string, number> = {};
      for (const otherCrit of criteriaCodes) {
        if (otherCrit === crit) {
          newWeights[otherCrit] = wPrime;
        } else {
          const oldW = baseWeights[otherCrit] ?? 0;
          newWeights[otherCrit] = oldRemainingSum > 0 ? oldW * (remainingSum / oldRemainingSum) : 0;
        }
      }

      // Recompute TOPSIS
      const scenarioTopsis = solveTopsis(X, newWeights, criteriaCodes);
      const scenarioSortedIds = scenarioTopsis.sortedIndices.map((i) => alternativeIds[i]);
      const rankingOrder = scenarioSortedIds.join(" > ");

      const isRank1Preserved = scenarioSortedIds[0] === baseSortedIds[0];
      const isFullOrderPreserved = rankingOrder === baseOrder;

      if (isRank1Preserved) rank1PreservedCount++;
      if (isFullOrderPreserved) {
        fullOrderPreservedCount++;
      } else {
        reversalsCount++;
      }

      const rankChanges: Record<string, { oldRank: number; newRank: number; diff: number }> = {};
      alternativeIds.forEach((id, idx) => {
        const oldRank = baseRankings[id];
        const newRank = scenarioTopsis.rankings[idx];
        rankChanges[id] = {
          oldRank,
          newRank,
          diff: oldRank - newRank, // > 0 means improved rank (naik), < 0 means dropped rank (turun)
        };
      });

      scenarios.push({
        kriteria: crit,
        deltaPct,
        newWeights,
        cc: scenarioTopsis.CC,
        rankings: scenarioTopsis.rankings,
        rankingOrder,
        isRank1Preserved,
        isFullOrderPreserved,
        rankChanges,
      });
    }
  }

  return {
    baseOrder,
    baseRankings,
    scenarios,
    summary: {
      totalScenarios: scenarios.length,
      rank1PreservedCount,
      fullOrderPreservedCount,
      reversalsCount,
    },
  };
}
