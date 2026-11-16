import type { AllocationItem, PhaseAllocationResult } from "./types.ts";

export interface AllocationOptions {
  plafonPerFase: number;
  c9MinFase1?: number;
  strictC9Filter?: boolean; // if true, c9 < c9Min excludes completely
}

export function solveAllocation(
  alternatives: { id: string; nama_segmen: string }[],
  CC: number[],
  c9Scores: number[],
  costs: number[],
  options: AllocationOptions
): PhaseAllocationResult {
  const { plafonPerFase, c9MinFase1 = 3, strictC9Filter = false } = options;
  const m = alternatives.length;

  const candidateItems = alternatives.map((alt, idx) => {
    const cost = costs[idx];
    const c9 = c9Scores[idx];
    const ccVal = CC[idx];
    // CC per juta rupiah
    const costJuta = cost / 1_000_000;
    const ccPerJuta = costJuta > 0 ? ccVal / costJuta : 0;

    return {
      origIdx: idx,
      id: alt.id,
      nama_segmen: alt.nama_segmen,
      cc: ccVal,
      c9,
      cost,
      ccPerJuta,
    };
  });

  // Sort by CC descending
  candidateItems.sort((a, b) => b.cc - a.cc);

  const items: AllocationItem[] = [];
  const phaseSubtotals: Record<number, number> = {};
  let excludedCount = 0;

  for (let rankIdx = 0; rankIdx < candidateItems.length; rankIdx++) {
    const cand = candidateItems[rankIdx];
    const ranking = rankIdx + 1;

    // Check if cost > plafon
    if (cand.cost > plafonPerFase) {
      items.push({
        alternatif_id: cand.id,
        nama_segmen: cand.nama_segmen,
        ranking,
        cc: cand.cc,
        skor_c9: cand.c9,
        biaya_rp: cand.cost,
        fase: null,
        keterangan: "Biaya > Plafon",
        cc_per_juta_rp: Number(cand.ccPerJuta.toFixed(4)),
        warning: `Biaya titik (Rp ${(cand.cost / 1e6).toFixed(1)} Jt) melebihi plafon (Rp ${(plafonPerFase / 1e6).toFixed(1)} Jt).`,
      });
      excludedCount++;
      continue;
    }

    // Check strict C9 filter (used for naskah_uts)
    if (strictC9Filter && cand.c9 < c9MinFase1) {
      items.push({
        alternatif_id: cand.id,
        nama_segmen: cand.nama_segmen,
        ranking,
        cc: cand.cc,
        skor_c9: cand.c9,
        biaya_rp: cand.cost,
        fase: null,
        keterangan: "Tidak Layak",
        cc_per_juta_rp: Number(cand.ccPerJuta.toFixed(4)),
        warning: `Skor C9 = ${cand.c9} di bawah ambang kelayakan (${c9MinFase1}).`,
      });
      excludedCount++;
      continue;
    }

    // Mockup allocation mode: C9 < c9MinFase1 cannot enter Phase 1, starts at Phase 2
    let targetPhase = cand.c9 < c9MinFase1 ? 2 : 1;
    let warning: string | undefined = undefined;

    if (cand.c9 < c9MinFase1) {
      warning = `Perhatian: ${cand.id} peringkat ${ranking}, tetapi C9 = ${cand.c9}. Pastikan tiang, listrik, dan sinyal tersedia sebelum menjadwalkan Fase 2.`;
    }

    while (true) {
      const currentSpent = phaseSubtotals[targetPhase] || 0;
      if (currentSpent + cand.cost <= plafonPerFase + 1e-9) {
        phaseSubtotals[targetPhase] = currentSpent + cand.cost;
        break;
      }
      targetPhase++;
    }

    const keterangan = targetPhase === 1 ? "Segera" : `Fase ${targetPhase}`;

    items.push({
      alternatif_id: cand.id,
      nama_segmen: cand.nama_segmen,
      ranking,
      cc: cand.cc,
      skor_c9: cand.c9,
      biaya_rp: cand.cost,
      fase: targetPhase,
      keterangan,
      cc_per_juta_rp: Number(cand.ccPerJuta.toFixed(4)),
      warning,
    });
  }

  const remainingBudget: Record<number, number> = {};
  for (const [pStr, spent] of Object.entries(phaseSubtotals)) {
    const p = Number(pStr);
    remainingBudget[p] = Math.max(0, plafonPerFase - spent);
  }

  return {
    items,
    subtotals: phaseSubtotals,
    remainingBudget,
    plafonPerFase,
    excludedCount,
  };
}
